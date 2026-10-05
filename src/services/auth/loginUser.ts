/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { z } from 'zod'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { parse } from 'cookie'
import { redirect } from 'next/navigation'
import { serverFetch } from '@/lib/server-fetch'
import { setCookie } from './tokenHandlers'
import { getDefaultDashboardRoute, isValidRedirectForRole } from '@/lib/authUtils'


const loginValidationZodSchema =
    z.object({
        email: z.string({ required_error: "Email is required" }).email({ message: "Email is required" }),
        password: z.string({ required_error: "Password is required" }).min(6, {
            message: "Password is required and must be at least 6 character long"
        }).max(100, {
            message: "Password must be at most 100 characters long"
        })
    })


export const loginUser = async (_currentState: any, formData: any): Promise<any> => {
    try {
        const redirectTo = formData.get('redirect') || null
        // step-1
        let accessTokenObject: null | any = null;
        let refreshTokenObject: null | any = null;

        const loginData = {
            email: formData.get('email'),
            password: formData.get('password')
        }
        const validatedFields = loginValidationZodSchema.safeParse(loginData)

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

        console.log(loginData)
        const res = await serverFetch.post("/auth/login", {
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData)
        })

        // step-2
        const result = await res.json()

        if (!res.ok) {
            throw new Error(result?.message)
        }

        // step-3
        const setCookieHeaders = res.headers.getSetCookie();

        // step-4
        if (setCookieHeaders && setCookieHeaders.length > 0) {
            // step-4.1
            setCookieHeaders.forEach((cookie: string) => {

                // step-4.2 use parse in cookie npm package
                const parsedCookie = parse(cookie);

                // step-4.3 condition check and set cookie
                if (parsedCookie['accessToken']) {
                    accessTokenObject = parsedCookie
                }
                else if (parsedCookie['refreshToken']) {
                    refreshTokenObject = parsedCookie
                }
            })

        } else {
            throw new Error("No Set-Cookie header found")
        }
        // step-5
        if (!accessTokenObject) {
            throw new Error("Tokens not found in cookies")
        }

        if (!refreshTokenObject) {
            throw new Error("Tokens not found in cookies")
        }

        // step-6 cookies store help by next/headers
        // const cookieStore = await cookies()

        // step-6.1 Token set in cookies
        await setCookie("accessToken", accessTokenObject.accessToken, {
            secure: true,
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
            path: accessTokenObject.Path || "/",
            sameSite: 'lax'
        })

        // step-6.2 Token set in cookies
        await setCookie("refreshToken", refreshTokenObject.refreshToken, {
            secure: true,
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 90,
            path: refreshTokenObject.Path || "/",
            sameSite: 'lax'
        })


        const verifiedToken: JwtPayload | string = jwt.verify(accessTokenObject.accessToken, process.env.JWT_ACCESS_SECRET as string)

        if (typeof verifiedToken === "string") { // string return when token return error
            throw new Error("Invalid Token")
        }

        const userRole: any = verifiedToken.role;

        if (!result.success) {
            throw new Error(result.message || "Login failed")
        }

        if (result?.needPasswordChange) {
            redirect(`/reset-password`);
        }


        if (redirectTo && result.needPasswordChange) {
            const requestedPath = redirectTo.toString();
            if (isValidRedirectForRole(requestedPath, userRole)) {
                redirect(`/reset-password?redirect=${requestedPath}`);
            } else {
                redirect("/reset-password");
            }
        }

        if (redirectTo) {
            const requestedPath = redirectTo.toString();
            if (isValidRedirectForRole(requestedPath, userRole)) {
                redirect(requestedPath);
            } else {
                redirect(`${getDefaultDashboardRoute(userRole)}?loggedIn=true`);
            }
        } else {
            redirect(`${getDefaultDashboardRoute(userRole)}?loggedIn=true`);
        }

    } catch (error: any) {
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        console.log(error);
        return { success: false, message: `${process.env.NODE_ENV === 'development' ? error.message : "Login Failed. You might have entered incorrect email or password."}` };
    }
}