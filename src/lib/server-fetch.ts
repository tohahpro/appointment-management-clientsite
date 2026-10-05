import { getCookie } from "@/services/auth/tokenHandlers";


const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;


export const serverFetchHelper = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {

    const accessToken = await getCookie("accessToken");
    const refreshToken = await getCookie("refreshToken");

    const requestHeaders = new Headers(options.headers);

    const cookieValues: string[] = [];

    if (accessToken) {
        cookieValues.push(`accessToken=${accessToken}`);
    }

    if (refreshToken) {
        cookieValues.push(`refreshToken=${refreshToken}`);
    }

    if (cookieValues.length > 0) {
        requestHeaders.set("Cookie", cookieValues.join("; "));
    }

    return fetch(`${BACKEND_API_URL}${endpoint}`, {
        ...options,
        headers: requestHeaders,
        cache: options.cache ?? "no-store",
    });
};

export const serverFetch = {
    get: async (endpoint: string, options: RequestInit = {}): Promise<Response> => serverFetchHelper(endpoint, { ...options, method: "GET" }),

    post: async (endpoint: string, options: RequestInit = {}): Promise<Response> => serverFetchHelper(endpoint, { ...options, method: "POST" }),

    put: async (endpoint: string, options: RequestInit = {}): Promise<Response> => serverFetchHelper(endpoint, { ...options, method: "PUT" }),

    patch: async (endpoint: string, options: RequestInit = {}): Promise<Response> => serverFetchHelper(endpoint, { ...options, method: "PATCH" }),

    delete: async (endpoint: string, options: RequestInit = {}): Promise<Response> => serverFetchHelper(endpoint, { ...options, method: "DELETE" }),
}