/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import jwt, { JwtPayload } from "jsonwebtoken";
import { getCookie } from "./tokenHandlers";
import { serverFetch } from "@/lib/server-fetch";
import { UserInfo } from "../../../types/user.interface";

export const getUserInfo = async (): Promise<UserInfo | any> => {
    let userInfo: UserInfo | any;
    try {

        const response = await serverFetch.get("/auth/me")

        const result = await response.json();

        if (result.success) {
            const accessToken = await getCookie("accessToken");

            if (!accessToken) {
                throw new Error("No access token found");
            }

            const verifiedToken = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string) as JwtPayload;

            userInfo = {
                name: verifiedToken.name || "Unknown User",
                email: verifiedToken.email,
                role: verifiedToken.role,
            }
        }

        userInfo = {
            name: result.data?.admin?.name || result.data?.modarator?.name || result.data?.patient?.name || result.data?.name || "Unknown User",
            ...result.data
        };

        return userInfo;
    } catch (error: any) {
        console.log(error);

        // return null;
        return {
            id: "",
            name: "Unknown User",
            email: "",
            role: "Patient",
            admin: {
                isPasswordChange: false
            }
            // needPasswordChange: false,
            // status: "Active",
            // createdAt: "",
            // updatedAt: "",
        };
    }

}