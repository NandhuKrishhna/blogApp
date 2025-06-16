import { z } from "zod";

export const createArticleSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().optional(),
    content: z.string().min(1, "Content is required"),
    imageUrl: z.string().optional()
});
