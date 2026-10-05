import { serverFetch } from "@/lib/server-fetch";
import { DashboardDateRange } from "../../../types/meta.interface";


export async function getDashboardMetaData(
    range: DashboardDateRange = "last1Month"
) {
    try {
        const response = await serverFetch.get(`/meta?range=${range}`);

        return await response.json();
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