import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/supabase/auth";
import { SearchResult, SearchResponse } from "@/types/api";
import { ApiError, createAuthError, createDatabaseError, createValidationError, handleUnknownError } from "@/lib/api-error";
import { normalizeTurkish, hasTurkishCharacters } from "@/lib/turkish-utils";

export const runtime = "nodejs";

export async function GET(req: Request) {
    try {
        const auth = await requireAuth();
        if (auth.response) throw createAuthError();

        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q")?.trim();
        const tag = searchParams.get("tag");
        const status = searchParams.get("status");
        const type = searchParams.get("type");

        if (!query || query.length < 2) {
            return NextResponse.json<SearchResponse>({
                results: [],
                query: query || '',
                count: 0
            });
        }

        // Check if this is a tag search (starts with #)
        const isTagSearch = query.startsWith('#');
        const searchTerm = isTagSearch ? query.slice(1).trim() : query;

        // Build WHERE clause for filters
        const filters: string[] = [`"userId" = '${auth.user.id}'`];

        if (tag) {
            const escapedTag = tag.replace(/'/g, "''");
            filters.push(`tags LIKE '%${escapedTag}%'`);
        }
        if (status) filters.push(`status = '${status}'`);
        if (type) filters.push(`type = '${type}'`);

        const whereClause = filters.join(' AND ');

        let notes: SearchResult[] = [];

        // Tag search: search only by tag (when query starts with #)
        if (isTagSearch) {
            if (searchTerm.length === 0) {
                return NextResponse.json<SearchResponse>({
                    results: [],
                    query,
                    isTagSearch: true,
                    count: 0
                });
            }

            const escapedSearchTerm = searchTerm.replace(/'/g, "''");

            try {
                notes = await prisma.$queryRawUnsafe<SearchResult[]>(`
                    SELECT 
                        id,
                        title,
                        content,
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
            } catch (error) {
                throw createDatabaseError(
                    'Tag search failed',
                    error instanceof Error ? error.message : String(error)
                );
            }
        } else {
            // Prefix search for short queries (2-3 characters) for instant results
            if (searchTerm.length >= 2 && searchTerm.length < 4) {
                try {
                    // Try prefix match with original query
                    notes = await prisma.$queryRawUnsafe<SearchResult[]>(`
                        SELECT 
                            id,
                            title,
                            content,
                            summary,
                            status,
                            type,
                            1.0 as rank
                        FROM "Note"
                        WHERE ${whereClause}
                          AND (title ILIKE $1 OR content ILIKE $1)
                        ORDER BY 
                          CASE WHEN title ILIKE $1 THEN 1 ELSE 2 END,
                          "createdAt" DESC
                        LIMIT 10
                    `, `${searchTerm}%`);

                    // If no results and has Turkish characters, try with normalized
                    if (notes.length === 0 && hasTurkishCharacters(searchTerm)) {
                        const normalizedTerm = normalizeTurkish(searchTerm);
                        if (normalizedTerm !== searchTerm) {
                            notes = await prisma.$queryRawUnsafe<SearchResult[]>(`
                                SELECT 
                                    id, title, content, summary, status, type,
                                    1.0 as rank
                                FROM "Note"
                                WHERE ${whereClause}
                                  AND (title ILIKE $1 OR content ILIKE $1)
                                ORDER BY 
                                  CASE WHEN title ILIKE $1 THEN 1 ELSE 2 END,
                                  "createdAt" DESC
                                LIMIT 10
                            `, `${normalizedTerm}%`);
                        }
                    }
                } catch (prefixError) {
                    console.warn("Prefix search failed:", prefixError);
                }
            }

            // Full-text search for longer queries (4+ chars) or if prefix had no results
            if (notes.length === 0 && searchTerm.length >= 4) {
                try {
                    notes = await prisma.$queryRawUnsafe<SearchResult[]>(`
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
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message.toLowerCase() : '';

                    if (errorMessage.includes('search_vector')) {
                        throw createDatabaseError('Search index not ready - please try again');
                    } else if (errorMessage.includes('syntax')) {
                        throw createValidationError('Invalid search query');
                    }

                    throw createDatabaseError(
                        'Full-text search failed',
                        error instanceof Error ? error.message : String(error)
                    );
                }
            } // End FTS if block

            // If no results and query has Turkish characters, try with normalized query
            if (notes.length === 0 && hasTurkishCharacters(searchTerm)) {
                const normalizedTerm = normalizeTurkish(searchTerm);
                if (normalizedTerm !== searchTerm) {
                    try {
                        notes = await prisma.$queryRawUnsafe<SearchResult[]>(`
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
                        `, normalizedTerm);
                    } catch (normalizedError) {
                        // If normalized search also fails, continue with empty results
                        console.warn("Normalized FTS failed:", normalizedError);
                    }
                }
            }

            // If we have few results, try fuzzy search for typo tolerance
            if (notes.length < 3) {
                try {
                    const fuzzyNotes = await prisma.$queryRawUnsafe<SearchResult[]>(`
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
                        note.rank = (note as unknown as { similarity: number }).similarity * 0.5;
                    });

                    notes.push(...fuzzyNotes);
                } catch (fuzzyError) {
                    // Fuzzy search failed, continue with FTS results only
                    console.warn("Fuzzy search failed:", fuzzyError);
                }

                // If still few results and has Turkish characters, try fuzzy with normalized
                if (notes.length < 3 && hasTurkishCharacters(searchTerm)) {
                    const normalizedTerm = normalizeTurkish(searchTerm);
                    if (normalizedTerm !== searchTerm) {
                        try {
                            const normalizedFuzzyNotes = await prisma.$queryRawUnsafe<SearchResult[]>(`
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
                            `, normalizedTerm);

                            normalizedFuzzyNotes.forEach(note => {
                                note.rank = (note as unknown as { similarity: number }).similarity * 0.5;
                            });

                            notes.push(...normalizedFuzzyNotes);
                        } catch (normalizedFuzzyError) {
                            console.warn("Normalized fuzzy search failed:", normalizedFuzzyError);
                        }
                    }
                }
            }
        }

        return NextResponse.json<SearchResponse>({
            results: notes,
            query,
            isTagSearch,
            filters: { tag, status, type },
            count: notes.length
        });
    } catch (error) {
        const apiError = handleUnknownError(error);
        return apiError.toResponse();
    }
}
