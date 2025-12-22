import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/supabase/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
    const auth = await requireAuth();
    if (auth.response) return auth.response;

    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q")?.trim();
        const tag = searchParams.get("tag");
        const status = searchParams.get("status");
        const type = searchParams.get("type");

        if (!query || query.length < 2) {
            return NextResponse.json({ results: [] });
        }

        // Check if this is a tag search (starts with #)
        const isTagSearch = query.startsWith('#');
        const searchTerm = isTagSearch ? query.slice(1).trim() : query;

        // Build WHERE clause for filters
        const filters: string[] = [`"userId" = '${auth.user.id}'`];

        if (tag) {
            // Escape single quotes in tag
            const escapedTag = tag.replace(/'/g, "''");
            filters.push(`tags LIKE '%${escapedTag}%'`);
        }
        if (status) filters.push(`status = '${status}'`);
        if (type) filters.push(`type = '${type}'`);

        const whereClause = filters.join(' AND ');

        let notes: any[] = [];

        // Tag search: search only by tag (when query starts with #)
        if (isTagSearch) {
            if (searchTerm.length === 0) {
                return NextResponse.json({
                    results: [],
                    query,
                    isTagSearch: true
                });
            }

            const escapedSearchTerm = searchTerm.replace(/'/g, "''");
            notes = await prisma.$queryRawUnsafe<any[]>(`
                SELECT 
                    id,
                    title,
                    summary,
                    status,
                    type,
                    tags,
                    1.0 as rank
                FROM "Note"
                WHERE ${whereClause}
                  AND tags LIKE '%${escapedSearchTerm}%'
                ORDER BY "createdAt" DESC
                LIMIT 50
            `);
        } else {
            // Full-text search with ranking and highlighting
            notes = await prisma.$queryRawUnsafe<any[]>(`
                SELECT 
                    id,
                    title,
                    summary,
                    status,
                    type,
                    ts_rank(search_vector, plainto_tsquery('english', $1)) as rank,
                    ts_headline('english', 
                        COALESCE(title, '') || ' ' || COALESCE(content, ''), 
                        plainto_tsquery('english', $1),
                        'MaxWords=20, MinWords=10, ShortWord=3, HighlightAll=false'
                    ) as snippet
                FROM "Note"
                WHERE ${whereClause}
                  AND search_vector @@ plainto_tsquery('english', $1)
                ORDER BY rank DESC
                LIMIT 10
            `, searchTerm);

            // If we have few results, try fuzzy search for typo tolerance
            if (notes.length < 3) {
                try {
                    const fuzzyNotes = await prisma.$queryRawUnsafe<any[]>(`
                        SELECT 
                            id, title, summary, status, type,
                            GREATEST(
                                similarity(COALESCE(title, ''), $1),
                                similarity(COALESCE(content, ''), $1)
                            ) as similarity
                        FROM "Note"
                        WHERE ${whereClause}
                          AND (
                            title % $1 OR 
                            content % $1
                          )
                          AND id NOT IN (${notes.map(n => `'${n.id}'`).join(',') || "''"})
                        ORDER BY similarity DESC
                        LIMIT ${10 - notes.length}
                    `, searchTerm);

                    // Add fuzzy results with a rank based on similarity
                    fuzzyNotes.forEach(note => {
                        note.rank = note.similarity * 0.5; // Lower rank than FTS
                    });

                    notes.push(...fuzzyNotes);
                } catch (fuzzyError) {
                    // Fuzzy search failed, continue with FTS results only
                    console.warn("Fuzzy search failed:", fuzzyError);
                }
            }
        }

        return NextResponse.json({
            results: notes,
            query,
            isTagSearch,
            filters: { tag, status, type },
            count: notes.length
        });
    } catch (error: any) {
        console.error("Error searching notes:", error);

        let userMessage = "Search failed";

        if (error.message) {
            const msg = error.message.toLowerCase();

            if (msg.includes("search_vector")) {
                userMessage = "Search index not ready - please try again";
            } else if (msg.includes("syntax")) {
                userMessage = "Invalid search query";
            }
        }

        return NextResponse.json({
            error: userMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}
