"use server";

import { revalidatePath } from "next/cache";

import { serverFetch } from "@/lib/server-fetch";

export type CreateCategoryPayload = {
    name: string;
    description: string;
};

export async function createCategory(_prevState: any, formData: FormData) {
    try {
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;

        if (!name?.trim()) {
            return {
                success: false,
                message: "Category name is required",
            };
        }

        const payload: CreateCategoryPayload = {
            name: name.trim(),
            description: description.trim()
        };

        const response = await serverFetch.post("/category",
            {
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            }
        );

        const result = await response.json();

        if (result.success) {
            revalidatePath("/dashboard/categories");
        }

        return result;
    } catch (error: any) {
        console.error(error);

        return {
            success: false,
            message: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
        };
    }
}

export async function getCategories() {
    try {
        const response = await serverFetch.get("/category");

        return await response.json();
    } catch (error: any) {
        console.error(error);

        return {
            success: false,
            message: process.env.NODE_ENV === "development" ? error.message : "Something went wrong"
        };
    }
}

export async function getCategoryById(id: string) {
    try {
        const response = await serverFetch.get(`/category/${id}`);
        return await response.json();

    } catch (error: any) {
        console.error(error);

        return {
            success: false,
            message: process.env.NODE_ENV === "development" ? error.message : "Something went wrong"
        };
    }
}

export async function deleteCategory(id: string) {
    try {
        const response = await serverFetch.delete(`/category/${id}`);
        const result = await response.json();

        if (result.success) {
            revalidatePath("/dashboard/categories");
        }

        return result;
    } catch (error: any) {
        console.error(error);
        return {
            success: false,
            message: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
        };
    }
}