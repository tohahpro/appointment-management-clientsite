/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/lib/server-fetch";
import z from "zod";

const registerValidationZodSchema = z.object({
    name: z.string().min(1, { message: "Name is Required" }),
    storeName: z.string().min(1, { message: "Store name is Required" }),
    contactNumber: z.string()
        .min(1, { message: "Contact number is required" })
        .regex(/^(?:\+8801|01)[3-9]\d{8}$/, { message: "Invalid BD phone number" }),
    email: z.string().email({ message: "Valid email is required" }),
    password: z.string().min(6, {
        message: "Password is required and must be at least 6 character long"
    }),
    confirmPassword: z.string().min(6, {
        message: "Confirm Password is required and must be at least 6 character long"
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Confirm Passwords do not match",
    path: ["confirmPassword"]
});

export const registerTailor = async (_currentState: any, formData: any): Promise<any> => {

    try {
        const validationData = {
            name: formData.get('name'),
            email: formData.get('email'),
            storeName: formData.get('storeName') as string,
            contactNumber: formData.get('contactNumber') as string,
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
        }

        const validatedFields = registerValidationZodSchema.safeParse(validationData);

        if (!validatedFields.success) {
            return {
                success: false,
                errors: validatedFields.error.issues.map(issue => {
                    return {
                        field: issue.path[0],
                        message: issue.message
                    }
                })
            }
        }

        const registerData = {
            password: formData.get('password'),
            tailor: {
                name: formData.get('name'),
                email: formData.get('email'),
                storeName: formData.get('storeName'),
                contactNumber: formData.get('contactNumber')
            }
        }

        console.log(registerData)

        const res = await serverFetch.post("/user/create-tailor", {
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registerData)
        })

        const result = await res.json();

        return result;

    } catch (error: any) {
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        console.log(error);
        return { error: "Registration failed" }
    }

}