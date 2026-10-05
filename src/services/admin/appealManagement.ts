/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";



import { createAppealZodSchema, updateAppealZodSchema } from "@/zod/appeal.validation";
import { ICreateAppeal, IUpdateAppeal } from "../../../types/appeal.interface";

/* =====================================
   Create Appeal
===================================== */

export async function createAppeal(_prevState: any, formData: FormData) {
    try {
        const dataString = formData.get("data") as string;

        if (!dataString) {
            return {
                success: false,
                message: "Appeal data is required",
            };
        }

        const appealData: ICreateAppeal =
            JSON.parse(dataString);

        const appealImage =
            formData.get("appealImage");

        const impactImage =
            formData.get("impactImage");

        // Frontend Zod validation
        const validatedPayload = zodValidator(
            appealData,
            createAppealZodSchema,
        );

        if (
            !validatedPayload.success &&
            validatedPayload.errors
        ) {
            return {
                success: false,
                message: "Validation failed",
                formData: appealData,
                errors: validatedPayload.errors,
            };
        }

        if (!validatedPayload.data) {
            return {
                success: false,
                message: "Validation failed",
                formData: appealData,
            };
        }

        if (
            !(appealImage instanceof File) ||
            appealImage.size === 0
        ) {
            return {
                success: false,
                message: "Appeal image is required",
                formData: appealData,
            };
        }

        const backendFormData = new FormData();

        backendFormData.append(
            "data",
            JSON.stringify(validatedPayload.data),
        );

        backendFormData.append(
            "appealImage",
            appealImage,
        );

        if (
            impactImage instanceof File &&
            impactImage.size > 0
        ) {
            backendFormData.append(
                "impactImage",
                impactImage,
            );
        }

        const response = await serverFetch.post(
            "/appeals",
            {
                body: backendFormData,
            },
        );

        const result = await response.json();

        if (result.success) {
            revalidatePath("/dashboard/appeals");
            revalidatePath("/appeals");
        }

        return result;
    } catch (error: any) {
        console.error(error);

        return {
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Something went wrong",
        };
    }
}

/* =====================================
   Get All Appeals
===================================== */

export async function getAppeals(queryString?: string) {
    try {
        const url = queryString
            ? `/appeals?${queryString}`
            : "/appeals";

        const response = await serverFetch.get(url);

        return await response.json();
    } catch (error: any) {
        console.error(error);

        return {
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Something went wrong",
            meta: null,
            data: [],
        };
    }
}

/* =====================================
   Get Single Appeal
===================================== */

export async function getAppealById(id: string) {
    try {
        const response = await serverFetch.get(`/appeals/${id}`);

        return await response.json();
    } catch (error: any) {
        console.error(error);

        return {
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Something went wrong",
            data: null,
        };
    }
}

export async function getAppealPageBySlug(slug: string) {
    try {
        const response = await serverFetch.get(`/appeals/slug/${slug}`);

        return await response.json();
    } catch (error: any) {
        console.error(error);

        return {
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Something went wrong",
            data: null,
        };
    }
}

/* =====================================
   Update Appeal
===================================== */

export async function updateAppeal(
    id: string, _prevState: any, formData: FormData
) {
    try {
        const dataString =
            formData.get("data") as string;

        let appealData: IUpdateAppeal = {};

        if (dataString) {
            appealData = JSON.parse(dataString);
        }

        const appealImage =
            formData.get("appealImage");

        const impactImage =
            formData.get("impactImage");

        const matterImages =
            formData.getAll("matterImages");


        const validatedPayload = zodValidator(appealData, updateAppealZodSchema);

        if (
            !validatedPayload.success &&
            validatedPayload.errors
        ) {
            return {
                success: false,
                message: "Validation failed",
                formData: appealData,
                errors: validatedPayload.errors,
            };
        }

        if (!validatedPayload.data) {
            return {
                success: false,
                message: "Validation failed",
                formData: appealData,
            };
        }

        const backendFormData = new FormData();

        backendFormData.append(
            "data",
            JSON.stringify(validatedPayload.data),
        );

        /*
         * নতুন appeal image দেওয়া হলে append হবে।
         * না দিলে backend পুরোনো image রাখবে।
         */
        if (
            appealImage instanceof File &&
            appealImage.size > 0
        ) {
            backendFormData.append(
                "appealImage",
                appealImage,
            );
        }

        /*
         * নতুন impact image দেওয়া হলে append হবে।
         * না দিলে backend পুরোনো impact image রাখবে।
         */
        if (
            impactImage instanceof File &&
            impactImage.size > 0
        ) {
            backendFormData.append(
                "impactImage",
                impactImage,
            );
        }

        if (matterImages && matterImages.length > 0) {
            matterImages.forEach(
                (matterImage) => {
                    if (
                        matterImage instanceof File &&
                        matterImage.size > 0
                    ) {
                        backendFormData.append(
                            "matterImages",
                            matterImage,
                        );
                    }
                },
            );
        }

        const response =
            await serverFetch.patch(
                `/appeals/${id}`,
                {
                    body: backendFormData,
                },
            );

        const result = await response.json();

        if (result.success) {
            revalidatePath("/dashboard/appeals");
            revalidatePath(`/dashboard/appeals/${id}`);
            revalidatePath("/appeals");
            revalidatePath(`/appeals/${id}`);
        }

        return result;
    } catch (error: any) {
        console.error(error);

        return {
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Something went wrong",
        };
    }
}

/* =====================================
   Delete Appeal
===================================== */

export async function deleteAppeal(
    id: string,
) {
    try {
        const response = await serverFetch.delete(`/appeals/${id}`);
        const result = await response.json();

        if (result.success) {
            revalidatePath("/dashboard/appeals");
            revalidatePath("/appeals");
        }

        return result;
    } catch (error: any) {
        console.error(error);

        return {
            success: false,
            message:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Something went wrong",
        };
    }
}