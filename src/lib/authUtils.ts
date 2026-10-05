
export type UserRole = "ADMIN" | "SUPER_ADMIN" | "DOCTOR" | "PATIENT";

type RouteConfig = {
    exact: string[],
    patterns: RegExp[],
}

const authRoutes = ["/login", "/register", "/forgot-password"];

const commonProtectedRoutes: RouteConfig = {
    exact: ["/my-profile", "/settings", "/change-password", "/reset-password"],
    patterns: []
}

const adminProtectedRoutes: RouteConfig = {
    patterns: [/^\/admin/],
    exact: []
}

const doctorProtectedRoutes: RouteConfig = {
    patterns: [/^\/dashboard/],
    exact: []
}

export const isAuthRoute = (pathname: string) => {
    // return authRoutes.some((route: string) => {
    //     // return route.startsWith(pathname)
    //     return route === pathname;
    // })
    return authRoutes.includes(pathname);
}

export const isRouteMatches = (pathname: string, routes: RouteConfig): boolean => {
    if (routes.exact.includes(pathname)) {
        return true;
    }
    return routes.patterns.some((pattern: RegExp) => pattern.test(pathname))
}

export const getRouteOwner = (pathname: string): "ADMIN" | "DOCTOR" | "PATIENT" | "COMMON" | null => {
    if (isRouteMatches(pathname, adminProtectedRoutes)) {
        return "ADMIN";
    }
    if (isRouteMatches(pathname, doctorProtectedRoutes)) {
        return "DOCTOR";
    }
    if (isRouteMatches(pathname, commonProtectedRoutes)) {
        return "COMMON";
    }

    return null
}

export const getDefaultDashboardRoute = (role: UserRole): string => {
    if (role === "ADMIN") {
        return "/admin/dashboard"
    }
    if (role === "DOCTOR") {
        return "/dashboard"
    }
    if (role === "PATIENT") {
        return "/dashboard"
    }

    return "/"
}

export const isValidRedirectForRole = (redirectPath: string, role: UserRole): boolean => {
    const routeOwner = getRouteOwner(redirectPath);

    if (routeOwner === null || routeOwner === "COMMON") {
        return true;
    }

    if (routeOwner === role) {
        return true;
    }
    return false;
}
