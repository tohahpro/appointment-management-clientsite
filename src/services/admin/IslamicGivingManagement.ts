/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";

import { serverFetch } from "@/lib/server-fetch";
import { givingValidation } from "@/zod/islamicGiving.validationt";


export async function createIslamicGiving(_prevState: any, formData: FormData) {
    try {

        const dataString = formData.get("data") as string;

        if (!dataString) {
            return {
                success: false,
                message: "Islamic Giving data is required",
            };
        }

        const islamicGivingData = JSON.parse(dataString);

        const image = formData.get("image");
        const givingImages = formData.getAll("givingImages");

        // Frontend validation
        const validatedPayload = givingValidation.createIslamicGivingZodSchema.safeParse(islamicGivingData);

        if (!validatedPayload.success) {
            return {
                success: false,
                message: "Validation failed",
                formData: islamicGivingData,
                errors: validatedPayload.error.flatten().fieldErrors,
            };
        }

        // Main image validation
        if (!(image instanceof File) || image.size === 0) {
            return {
                success: false,
                message: "Main image is required",
                formData: islamicGivingData,
            };
        }

        // Giving images validation
        const validGivingImages = givingImages.filter(
            (file): file is File =>
                file instanceof File && file.size > 0
        );

        if (validGivingImages.length === 0) {
            return {
                success: false,
                message: "At least one giving image is required",
                formData: islamicGivingData,
            };
        }

        if (validGivingImages.length > 10) {
            return {
                success: false,
                message: "Maximum 10 giving images are allowed",
                formData: islamicGivingData,
            };
        }

        const backendFormData = new FormData();

        // JSON data
        backendFormData.append("data", JSON.stringify(validatedPayload.data));
        // Main image
        backendFormData.append("image", image);

        // Multiple giving images
        validGivingImages.forEach((givingImage) => {
            backendFormData.append("givingImages", givingImage);
        });

        const response = await serverFetch.post("/islamic-giving", { body: backendFormData });

        const result = await response.json();

        if (result.success) {
            revalidatePath("/dashboard/islamic-giving");
            revalidatePath("/islamic-giving");
        }

        return result;
    } catch (error: any) {
        console.error("Create Islamic Giving Error:", error);

        return {
            success: false,
            message: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
        };
    }
}


export async function getIslamicGivings(queryString?: string) {
    try {
        const url = queryString
            ? `/islamic-giving?${queryString}`
            : "/islamic-giving";

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


export async function getIslamicGivingByPageName(pageName: string) {
    try {
        const response = await serverFetch.get(`/islamic-giving/${pageName}`);

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


export async function getIslamicGivingById(id: string) {
    try {
        const response = await serverFetch.get(`/islamic-giving/${id}`);

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

export async function updateIslamicGiving(id: string, _prevState: any, formData: FormData) {
    try {

        const dataString = formData.get("data") as string;

        if (!dataString) {
            return {
                success: false,
                message: "Islamic Giving data is required",
            };
        }

        const islamicGivingData = JSON.parse(dataString);

        const image = formData.get("image");
        const givingImages = formData.getAll("givingImages");

        const validatedPayload = givingValidation.updateIslamicGivingZodSchema.safeParse(islamicGivingData);

        if (!validatedPayload.success) {
            return {
                success: false,
                message: "Validation failed",
                formData: islamicGivingData,
                errors: validatedPayload.error.flatten().fieldErrors,
            };
        }

        const validImage = image instanceof File && image.size > 0 ? image : null;
        const validGivingImages = givingImages.filter((file): file is File => file instanceof File && file.size > 0);

        if (validGivingImages.length > 10) {
            return {
                success: false,
                message: "Maximum 10 giving images are allowed",
                formData: islamicGivingData
            };
        }

        const backendFormData = new FormData();
        backendFormData.append("data", JSON.stringify(validatedPayload.data));

        /* Hero image is optional on update */

        if (validImage) {
            backendFormData.append("image", validImage);
        }

        validGivingImages.forEach(
            (givingImage) => {
                backendFormData.append("givingImages", givingImage);
            }
        );

        const response = await serverFetch.patch(`/islamic-giving/${id}`,
            { body: backendFormData }
        );

        const result = await response.json();

        if (result.success) {
            revalidatePath("/dashboard/islamic-giving");
            revalidatePath(`/dashboard/islamic-giving/${id}`);
            revalidatePath("/islamic-giving");

            if (validatedPayload.data.pageName) {
                revalidatePath(
                    `/islamic-giving/${validatedPayload.data.pageName}`
                );
            }
        }

        return result;
    } catch (error: any) {
        return {
            success: false,
            message: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
        };
    }
}

export async function deleteIslamicGiving(id: string) {
    try {
        const response = await serverFetch.delete(`/islamic-giving/${id}`);

        const result = await response.json();

        if (result.success) {
            revalidatePath("/dashboard/islamic-giving");
            revalidatePath("/islamic-giving");
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