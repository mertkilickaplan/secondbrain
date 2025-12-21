import { z } from "zod";

// Note content validation
export const noteContentSchema = z.object({
    content: z
        .string()
        .min(1, "Content is required")
        .max(10000, "Content too long (max 10000 chars)"),
});

// Note update validation
export const noteUpdateSchema = z.object({
    content: z
        .string()
        .min(1)
        .max(10000)
        .optional(),
    title: z
        .string()
        .max(200, "Title too long")
        .optional(),
    tags: z
        .array(z.string().max(50))
        .max(20, "Too many tags")
        .optional(),
    reprocess: z.boolean().optional(),
});

// Search query validation
export const searchQuerySchema = z.object({
    q: z
        .string()
        .min(2, "Query too short")
        .max(100, "Query too long"),
});

// Import data validation
export const importDataSchema = z.object({
    version: z.string().optional(),
    notes: z.array(
        z.object({
            id: z.string().optional(),
            content: z.string(),
            type: z.enum(["text", "url"]).default("text"),
            url: z.string().url().optional().nullable(),
            title: z.string().optional().nullable(),
            summary: z.string().optional().nullable(),
            topics: z.array(z.string()).optional(),
            tags: z.array(z.string()).optional(),
            status: z.string().optional(),
        })
    ),
    edges: z
        .array(
            z.object({
                sourceId: z.string(),
                targetId: z.string(),
                similarity: z.number().min(0).max(1),
                explanation: z.string(),
            })
        )
        .optional(),
});

// Helper to validate and return errors
export function validateOrError<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): { success: true; data: T } | { success: false; error: string } {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return {
        success: false,
        error: result.error.issues.map((e) => e.message).join(", "),
    };
}
