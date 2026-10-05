/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, LogOut, PanelLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { getIconComponent } from "@/lib/icon-mapper"
import { logoutUser } from "@/services/auth/logout"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import BrandLogo from "@/components/shared/BrandLogo"
import { UserInfo } from "../../../../types/user.interface"
import { NavSection } from "../../../../types/dashboard.interface"
import Image from "next/image"
import logoImage from "../../../assets/logo/Tarevia.png";


interface DashboardSidebarContentProps {
    userInfo: UserInfo
    navItems: NavSection[]
    dashboardHome: string
}

const DashboardSidebarContent = ({
    userInfo,
    navItems,
    dashboardHome,
}: DashboardSidebarContentProps) => {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)

    const handleLogout = async () => {
        await logoutUser()
    }

    const displayName = userInfo?.admin?.name || userInfo?.doctor?.name || userInfo?.patient?.name || "User"

    const initial = displayName.charAt(0).toUpperCase()

    return (
        <TooltipProvider delayDuration={100}>
            <aside
                className={cn(
                    "relative hidden h-screen min-h-0 flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out lg:flex",
                    isCollapsed ? "w-20" : "w-72"
                )}
            >
                {/* Background */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-40 overflow-hidden">
                    <div className="absolute -left-12 -top-16 h-40 w-40 rounded-full bg-blue-100 blur-3xl" />
                    <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-cyan-50 blur-3xl" />
                </div>

                {/* Collapse Button */}
                <button
                    type="button"
                    onClick={() => setIsCollapsed((prev) => !prev)}
                    className="absolute -right-3 top-6 z-30 flex size-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                    <PanelLeft
                        className={cn(
                            "size-4 transition-transform duration-300",
                            isCollapsed && "rotate-180"
                        )}
                    />
                </button>

                {/* Logo */}
                <div
                    className={cn(
                        "relative z-10 flex h-20 shrink-0 items-center border-b border-slate-100",
                        isCollapsed
                            ? "justify-center px-3"
                            : "justify-start px-5"
                    )}
                >
                    <Link
                        href={dashboardHome}
                        className="flex min-w-0 items-center gap-3"
                    >
                        {!isCollapsed ? (
                            <div className="min-w-0">
                                <BrandLogo />
                            </div>
                        ) : (
                            <div className="relative h-12 w-12 shrink-0">
                                <Image
                                    src={logoImage}
                                    alt="Tarevia"
                                    fill
                                    priority
                                    sizes="24px"
                                    className="object-contain"
                                />
                            </div>
                        )}
                    </Link>
                </div>

                {/* Navigation */}
                <ScrollArea className="relative z-10 min-h-0 flex-1">
                    <div
                        className={cn(
                            "py-5",
                            isCollapsed ? "px-3" : "px-4"
                        )}
                    >
                        <div className="space-y-6">
                            {navItems.map((section, sectionIndex) => (
                                <div key={sectionIndex}>
                                    {!isCollapsed && section.title && (
                                        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[#4576df]">
                                            {section.title}
                                        </p>
                                    )}

                                    <div className="space-y-1">
                                        {section.items.map((item: any) => {
                                            const isActive =
                                                pathname === item.href ||
                                                (item.href !== dashboardHome &&
                                                    pathname.startsWith(
                                                        `${item.href}/`
                                                    ))

                                            const Icon = getIconComponent(
                                                item.icon
                                            )

                                            const navLink = (
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        "group relative flex h-12 items-center rounded-xl text-sm font-medium transition-all duration-200",
                                                        isCollapsed
                                                            ? "justify-center"
                                                            : "gap-3 px-3",
                                                        isActive
                                                            ? "bg-blue-50 text-blue-700"
                                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                                    )}
                                                >
                                                    {isActive && (
                                                        <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-600" />
                                                    )}

                                                    <div
                                                        className={cn(
                                                            "flex size-9  shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                                                            isActive
                                                                ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                                                                : "text-black/80 group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-sm"
                                                        )}
                                                    >
                                                        <Icon className="size-4" />
                                                    </div>

                                                    {!isCollapsed && (
                                                        <>
                                                            <span className="min-w-0 flex-1 truncate text-black/80">
                                                                {item.title}
                                                            </span>

                                                            {item.badge ? (
                                                                <Badge
                                                                    variant="outline"
                                                                    className={cn(
                                                                        "rounded-lg px-2 py-0.5 text-xs font-semibold",
                                                                        isActive
                                                                            ? "border-blue-100 bg-white text-blue-600"
                                                                            : "border-slate-200 bg-slate-50 text-slate-500"
                                                                    )}
                                                                >
                                                                    {item.badge}
                                                                </Badge>
                                                            ) : (
                                                                <ChevronRight
                                                                    className={cn(
                                                                        "size-4 text-slate-300 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100",
                                                                        isActive &&
                                                                        "text-blue-300 opacity-100"
                                                                    )}
                                                                />
                                                            )}
                                                        </>
                                                    )}
                                                </Link>
                                            )

                                            if (isCollapsed) {
                                                return (
                                                    <Tooltip key={item.href}>
                                                        <TooltipTrigger asChild>
                                                            {navLink}
                                                        </TooltipTrigger>

                                                        <TooltipContent
                                                            side="right"
                                                            sideOffset={10}
                                                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-lg"
                                                        >
                                                            {item.title}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                )
                                            }

                                            return (
                                                <div key={item.href}>
                                                    {navLink}
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {sectionIndex <
                                        navItems.length - 1 && (
                                            <div
                                                className={cn(
                                                    "mt-6 h-px bg-slate-100",
                                                    isCollapsed
                                                        ? "mx-2"
                                                        : "mx-3"
                                                )}
                                            />
                                        )}
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollArea>

                {/* User Section */}
                <div
                    className={cn(
                        "relative z-10 shrink-0 border-t border-slate-100 bg-white",
                        isCollapsed ? "p-3" : "p-4"
                    )}
                >
                    {isCollapsed ? (
                        <div className="space-y-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        className="flex h-12 w-full items-center justify-center rounded-xl transition hover:bg-blue-50"
                                    >
                                        <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 ring-2 ring-white">
                                            {initial}
                                        </div>
                                    </button>
                                </TooltipTrigger>

                                <TooltipContent
                                    side="right"
                                    sideOffset={10}
                                    className="w-56 rounded-xl border border-slate-200 bg-white p-3 shadow-xl"
                                >
                                    <p className="truncate text-sm font-semibold text-slate-800">
                                        {displayName}
                                    </p>

                                    <p className="mt-1 truncate text-xs text-slate-500">
                                        {userInfo?.email}
                                    </p>

                                    <span className="mt-2 inline-flex rounded-full bg-blue-50 px-2 py-1 text-xs font-medium capitalize text-blue-700">
                                        {userInfo?.role?.toLowerCase()}
                                    </span>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex h-10 w-full items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                                    >
                                        <LogOut className="size-4" />
                                    </button>
                                </TooltipTrigger>

                                <TooltipContent
                                    side="right"
                                    sideOffset={10}
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-lg"
                                >
                                    Logout
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                            <div className="flex items-center gap-3">
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 ring-2 ring-white">
                                    {initial}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-slate-800">
                                        {displayName}
                                    </p>

                                    <p className="mt-1 truncate text-xs text-slate-400">
                                        {userInfo?.email}
                                    </p>
                                </div>

                                <span className="shrink-0 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium capitalize text-blue-700">
                                    {userInfo?.role?.toLowerCase()}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-500 transition hover:border-red-100 hover:bg-red-50 hover:text-red-500"
                            >
                                <LogOut className="size-4" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </aside>
        </TooltipProvider>
    )
}

export default DashboardSidebarContent