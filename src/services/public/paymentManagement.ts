"use server";

import { revalidatePath } from "next/cache";
import { serverFetch } from "@/lib/server-fetch";
import { TCreatePaymentPayload } from "../../../types/payment.interface";


export async function createPayment(payload: TCreatePaymentPayload) {
    try {
        const response = await serverFetch.post("/payment", {
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        }
        );

        const result = await response.json();

        if (result.success) {
            revalidatePath("/dashboard/payments");
        }

        return result;
    } catch (error: any) {

        return {
            success: false,
            message: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
            data: null,
        };
    }
}


export async function getPayments(queryString?: string) {
    try {
        const url = queryString ? `/payment?${queryString}` : "/payment";

        const response = await serverFetch.get(url);

        return await response.json();
    } catch (error: any) {
        return {
            success: false,
            message: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
            meta: null
        };
    }
}

export async function getPaymentBySessionId(sessionId: string) {
    try {
        if (!sessionId) {
            return {
                success: false,
                message: "Session ID is required"
            };
        }

        const response = await serverFetch.get(`/payment/session/${sessionId}`);

        return await response.json();
    } catch (error: any) {

        return {
            success: false,
            message: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
            data: null,
        };
    }
}