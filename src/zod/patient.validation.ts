import { z } from "zod";

export const registerPatientValidationZodSchema =
    z
        .object({
            name: z
                .string()
                .trim()
                .min(
                    2,
                    "Name must be at least 2 characters"
                ),

            email: z
                .string()
                .trim()
                .email(
                    "Please enter a valid email address"
                ),

            password: z
                .string()
                .min(
                    6,
                    "Password must be at least 6 characters"
                ),

            confirmPassword: z
                .string()
                .min(
                    1,
                    "Please confirm your password"
                ),

            contactNumber: z
                .string()
                .trim()
                .optional()
                .or(z.literal("")),

            address: z
                .string()
                .trim()
                .optional()
                .or(z.literal("")),
        })
        .refine(
            (data) =>
                data.password ===
                data.confirmPassword,
            {
                path: [
                    "confirmPassword",
                ],
                message:
                    "Passwords do not match",
            }
        );