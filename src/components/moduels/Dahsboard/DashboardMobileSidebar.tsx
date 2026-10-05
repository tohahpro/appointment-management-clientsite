"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SheetTitle } from "@/components/ui/sheet";

import { cn } from "@/lib/utils";
import { getIconComponent } from "@/lib/icon-mapper";

import { UserInfo } from "../../../../types/user.interface";
import { NavSection } from "../../../../types/dashboard.interface";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logoutUser } from "@/services/auth/logout";

interface DashboardMobileSidebarContentProps {
    userInfo: UserInfo;
    navItems: NavSection[];
    dashboardHome: string;
}

const DashboardMobileSidebar = ({
    userInfo,
    navItems,
    dashboardHome,
}: DashboardMobileSidebarContentProps) => {
    const pathname = usePathname();

    const userName =
        userInfo.admin?.name ||
        userInfo.tailor?.name ||
        "User";

    const userInitial =
        userName.charAt(0).toUpperCase() || "U";

    const isItemActive = (href: string) => {
        if (href === dashboardHome) {
            return pathname === dashboardHome;
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    const handleLogout = async () => {
        await logoutUser()
    }

    return (
        <div className="flex h-dvh min-h-0 w-full flex-col bg-background">
            {/* ========================================
                Logo
            ======================================== */}
            <div className="flex h-16 shrink-0 items-center border-b px-5">
                <Link
                    href={dashboardHome}
                    className="flex min-w-0 items-center gap-3"
                >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <span className="text-sm font-bold">
                            PH
                        </span>
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-base font-bold leading-none text-foreground">
                            PH Healthcare
                        </p>

                        <p className="mt-1 truncate text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                            Dashboard
                        </p>
                    </div>
                </Link>
            </div>

            <SheetTitle className="sr-only">
                Navigation Menu
            </SheetTitle>

            {/* ========================================
                Scrollable Navigation
            ======================================== */}
            <ScrollArea className="min-h-0 flex-1">
                <div className="px-3 py-4">
                    <nav className="space-y-5">
                        {navItems.map(
                            (section, sectionIdx) => (
                                <div
                                    key={section.title || sectionIdx}
                                >
                                    {/* Section Title */}
                                    {section.title && (
                                        <h4 className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                            {section.title}
                                        </h4>
                                    )}

                                    {/* Navigation Items */}
                                    <div className="space-y-1">
                                        {section.items.map(
                                            (item) => {
                                                const isActive = isItemActive(item.href);
                                                const Icon = getIconComponent(item.icon);
                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className={cn(
                                                            "group relative flex min-h-10 items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                                            isActive
                                                                ? "bg-[#D23157] text-primary-foreground shadow-sm"
                                                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                        )}
                                                    >
                                                        {/* Active indicator */}
                                                        {isActive && (
                                                            <span className="absolute left-0 top-1/2 h-5 w-0.75 -translate-y-1/2 rounded-r-full bg-primary-foreground/90" />
                                                        )}

                                                        {/* Icon */}
                                                        <Icon
                                                            className={cn(
                                                                "size-4 shrink-0 transition-all duration-200",
                                                                isActive
                                                                    ? "text-primary-foreground"
                                                                    : "text-muted-foreground group-hover:text-accent-foreground"
                                                            )}
                                                        />

                                                        {/* Title */}
                                                        <span className="min-w-0 flex-1 truncate">
                                                            {item.title}
                                                        </span>

                                                        {/* Badge */}
                                                        {item.badge !== undefined &&
                                                            item.badge !==
                                                            null && (
                                                                <Badge
                                                                    variant={isActive ? "secondary" : "default"}
                                                                    className={cn(
                                                                        "h-5 min-w-5 shrink-0 rounded-full px-1.5 text-[10px]",
                                                                        isActive &&
                                                                        "bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/15"
                                                                    )}
                                                                >
                                                                    {item.badge}
                                                                </Badge>
                                                            )}
                                                    </Link>
                                                );
                                            }
                                        )}
                                    </div>

                                    {/* Separator */}
                                    {sectionIdx <
                                        navItems.length -
                                        1 && (
                                            <Separator className="my-4" />
                                        )}
                                </div>
                            )
                        )}
                    </nav>
                </div>
            </ScrollArea>

            {/* ========================================
                User Info
            ======================================== */}
            <div className="shrink-0 border-t border-slate-200/70 bg-white p-3">
                <div className="overflow-hidden bg-[#FAFCFB]">
                    {/* User Info */}
                    <div className="flex items-center gap-3 p-3.5">
                        {/* Avatar */}
                        <div className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-[#E9FFF1] ring-1 ring-[#CFE8D7]">
                            <span className="text-sm font-bold text-[#166534]">
                                {userInitial}
                            </span>

                            <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-emerald-500" />
                        </div>

                        {/* User Details */}
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold tracking-[-0.01em] text-slate-900">
                                {userName}
                            </p>

                            <div className="mt-1 flex items-center gap-2">
                                <span className="inline-flex items-center rounded-full bg-[#E9FFF1] px-2 py-0.5 text-[10px] font-semibold capitalize text-[#166534]">
                                    {userInfo.role
                                        ?.toLowerCase()
                                        .replaceAll("_", " ")}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="mx-3 border-t border-slate-200/70" />

                    {/* Logout */}
                    <div className="p-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleLogout}
                            className="group h-10 w-full justify-between px-3  transition-all duration-200 hover:bg-[#FFF0F4] hover:text-[#D23157]"
                        >
                            <span className="flex items-center gap-2.5">
                                <span className="flex size-7 items-center justify-center rounded-lg bg-slate-100 transition-colors duration-200 group-hover:bg-[#FCE3EA]">
                                    <LogOut className="size-3.5" />
                                </span>

                                <span className="text-xs font-semibold">
                                    Logout
                                </span>
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardMobileSidebar;