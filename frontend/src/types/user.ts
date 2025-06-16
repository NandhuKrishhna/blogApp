import { z, ZodType } from "zod";
export interface ErrorResponse {
    data: {
        errors?: Array<{ path: string; message: string }>;
        message?: string;
    };
    status: number;
}
export type LoginData = {
    email: string;
    password: string;
};
export const loginSchema: ZodType<LoginData> = z.object({
    email: z.string().email({ message: "Enter a valid email address" }).nonempty({ message: "Email is required" }),

    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(30, { message: "Password cannot exceed 30 characters" })
        .nonempty({ message: "Password is required" }),
});
