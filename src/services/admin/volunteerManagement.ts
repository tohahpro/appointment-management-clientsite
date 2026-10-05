"use server";

import { revalidatePath } from "next/cache";

import { serverFetch } from "@/lib/server-fetch";

export async function createVolunteer(
    _prevState: any,
    formData: FormData
) {
    try {
        const dataString = formData.get("data") as string;

        if (!dataString) {
            return {
                success: false,
                message: "Volunteer data is required",
            };
        }

        const volunteerData = JSON.parse(dataString);

        const image = formData.get("image");

        const backendFormData = new FormData();

        backendFormData.append("data", JSON.stringify(volunteerData));

        if (image instanceof File && image.size > 0) {
            backendFormData.append("image", image);
        }

        const response =
            await serverFetch.post(
                "/volunteer",
                { body: backendFormData }
            );

        const result = await response.json();

        if (result.success) {
            revalidatePath("/dashboard/volunteers");
        }

        return result;
    } catch (error: any) {
        console.error(error);

        return {
            success: false,
            message: process.env.NODE_ENV === "development"
                ? error.message
                : "Something went wrong",
        };
    }
}

export async function getVolunteers(queryString?: string) {
    try {
        const url = queryString
            ? `/volunteer?${queryString}`
            : "/volunteer";

        const response =
            await serverFetch.get(
                url
            );

        return await response.json();
    } catch (error: any) {
        console.error(error);

        return {
            success: false,
            message: process.env.NODE_ENV === "development"
                ? error.message
                : "Something went wrong",
            meta: null,
            data: [],
        };
    }
}

export async function getVolunteerById(id: string) {
    try {
        const response =
            await serverFetch.get(`/volunteer/${id}`);

        return await response.json();
    } catch (error: any) {
        console.error(error);

        return {
            success: false,
            message: process.env.NODE_ENV === "development"
                ? error.message
                : "Something went wrong",
            data: null,
        };
    }
}

export async function updateVolunteerStatus(id: string, status: string) {
    try {
        const response =
            await serverFetch.patch(`/volunteer/status/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        status,
                    }),
                }
            );

        const result = await response.json();

        if (result.success) {
            revalidatePath("/dashboard/volunteers");
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

export async function softDeleteVolunteer(
    id: string
) {
    try {
        const response = await serverFetch.delete(`/volunteer/${id}`);

        const result = await response.json();

        if (result.success) {
            revalidatePath("/dashboard/volunteers");
        }

        return result;
    } catch (error: any) {
        console.error(error);

        return {
            success: false,
            message: process.env.NODE_ENV === "development"
                ? error.message
                : "Something went wrong",
        };
    }
}