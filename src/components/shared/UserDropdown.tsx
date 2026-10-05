"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/services/auth/logout";
import { LogOut, Settings, User } from "lucide-react";
import { UserInfo } from "../../../types/user.interface";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import Image from "next/image";


interface UserDropdownProps {
    userInfo: UserInfo;
}

const UserDropdown = ({ userInfo }: UserDropdownProps) => {

    const handleLogout = async () => {
        await logoutUser();
    };

    const defaultDashboard = getDefaultDashboardRoute(userInfo.role)

    const profilePhoto =
        userInfo?.doctor?.profilePhoto ||
        userInfo?.patient?.profilePhoto ||
        userInfo?.admin?.profilePhoto;

    const userName =
        userInfo?.doctor?.name ||
        userInfo?.patient?.name ||
        userInfo?.admin?.name ||
        "U";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                    <div className="group relative">
                        <div className="relative flex size-10 items-center justify-center overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200 transition-all duration-200 group-hover:ring-2 group-hover:ring-blue-500">
                            {profilePhoto ? (
                                <Image
                                    src={profilePhoto}
                                    alt={userName}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                />
                            ) : (
                                <span className="flex size-full items-center justify-center bg-linear-to-br from-slate-800 to-slate-950 text-sm font-semibold text-white">
                                    {userName.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">
                            {userInfo?.admin?.name || userInfo?.doctor?.name || userInfo?.patient?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{userInfo.email}</p>
                        <p className="text-xs text-primary capitalize">
                            {userInfo?.role?.toLowerCase()}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={"/my-profile"} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={defaultDashboard} className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Dashboard
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="mb-2" />
                <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 w-full p-0"
                >
                    <Button className="cursor-pointer w-full" variant={"outline"} onClick={handleLogout}>
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserDropdown;