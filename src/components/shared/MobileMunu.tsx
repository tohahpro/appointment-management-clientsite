"use client";

import { LayoutDashboard, LogOut, Menu, Settings, User } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { UserInfo } from "../../../types/user.interface";
import { logoutUser } from "@/services/auth/logout";


interface MobileMenuProps {
    navItems: Array<{ href: string; label: string }>;
    hasAccessToken: boolean;
    userInfo?: UserInfo | null;
    dashboardRoute?: string;
}

const MobileMenu = ({
    navItems,
    hasAccessToken,
    userInfo,
    dashboardRoute,
}: MobileMenuProps) => {

    const handleLogout = async () => {
        await logoutUser();
    };

    return (
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline">
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] p-4">
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <nav className="flex flex-col space-y-4 mt-8">
                        {navItems.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="flex text-lg font-medium md:hidden"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <hr className="flex md:hidden" />
                        <div className="pt-4 flex flex-col space-y-4">
                            {hasAccessToken && userInfo ? (
                                <>
                                    <div className="flex justify-start">
                                        <div className="w-64 bg-white p-4 space-y-4">
                                            {/* User Info */}
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                                                    N/A  {/* {userInfo?.admin?.name?.charAt(0).toUpperCase() || userInfo?.moderator?.name.charAt(0).toUpperCase()} */}
                                                </div>

                                                <div>
                                                    <p className="text-sm font-medium">{userInfo.admin?.name || userInfo.tailor?.name}</p>
                                                    <p className="text-xs text-muted-foreground">{userInfo.email}</p>
                                                    <p className="text-xs text-primary capitalize">
                                                        {userInfo.role.toLowerCase()}
                                                    </p>
                                                </div>
                                            </div>

                                            <hr />

                                            <div className="space-y-2">
                                                <Link
                                                    href="/my-profile"
                                                    className="flex items-center gap-2 text-sm hover:text-primary"
                                                >
                                                    <User className="h-4 w-4" />
                                                    Profile
                                                </Link>

                                                <Link
                                                    href="/change-password"
                                                    className="flex items-center gap-2 text-sm hover:text-primary"
                                                >
                                                    <Settings className="h-4 w-4" />
                                                    Change Password
                                                </Link>
                                                <Link
                                                    href={dashboardRoute || "/"}
                                                    className="text-lg font-medium"
                                                >
                                                    <Button className="gap-2 w-2/3">
                                                        <LayoutDashboard className="h-4 w-4" />
                                                        Dashboard
                                                    </Button>
                                                </Link>

                                                <Button
                                                    variant="ghost"
                                                    onClick={handleLogout}
                                                    className="flex mt-2 items-center rounded-md shadow border gap-2 text-sm text-red-600 w-2/3"
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                    Logout
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                </>
                            ) : (
                                <Link href="/login" className="text-lg font-medium">
                                    <Button className="w-full">Login</Button>
                                </Link>
                            )}
                        </div>
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default MobileMenu;