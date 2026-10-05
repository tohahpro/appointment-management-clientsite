/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/lib/server-fetch"
import { zodValidator } from "@/lib/zodValidator"
import z from "zod"


const createSpeacialityZodSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long")
})




export async function getSpeacialities() {
    try {
        const response = await serverFetch.get("/speciality")
        const result = await response.json();
        return result;
    } catch (error: any) {
        console.log(error);
        return {
            success: false,
            message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`
        };
    }
}

export async function deleteSpeciality(id: string) {
    try {
        const response = await serverFetch.delete(`/specialties/${id}`)
        const result = await response.json();
        return result;
    } catch (error: any) {
        console.log(error);
        return {
            success: false,
            message: `${process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'}`
        };
    }
}