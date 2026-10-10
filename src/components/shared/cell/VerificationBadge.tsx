"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    CheckCircle2,
    ChevronDown,
    Clock,
    Loader2,
} from "lucide-react";

import { toast } from "sonner";
import { changeProfileStatus } from "@/services/admin/doctorManagement";

type UserStatus = "ACTIVE" | "INACTIVE";

interface VerificationBadgeProps {
    userId: string;
    status: string;
}

export function VerificationBadge({
    userId,
    status,
}: VerificationBadgeProps) {
    const router = useRouter();

    const [currentStatus, setCurrentStatus] = useState(status);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setCurrentStatus(status);
    }, [status]);

    const isVerified = currentStatus === "ACTIVE";

    const handleStatusChange = async (newStatus: UserStatus) => {
        if (currentStatus === newStatus || isLoading) return;

        setIsLoading(true);

        try {
            const result = await changeProfileStatus(userId, {
                status: newStatus,
            });

            if (!result.success) {
                toast.error(result.message || "Failed to update status");
                return;
            }

            setCurrentStatus(newStatus);

            toast.success(
                newStatus === "ACTIVE"
                    ? "Doctor verified successfully"
                    : "Doctor verification removed"
            );

            router.refresh();

        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    disabled={isLoading}
                    className="cursor-pointer outline-none disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Badge
                        variant="outline"
                        className={`gap-1.5 px-3 py-1.5 transition-colors rounded ${isVerified
                            ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                            : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                            }`}
                    >
                        {isLoading ? (
                            <Loader2 className="size-3.5 animate-spin" />
                        ) : isVerified ? (
                            <CheckCircle2 className="size-3.5" />
                        ) : (
                            <Clock className="size-3.5" />
                        )}

                        {isVerified ? "Verified" : "Not Verified"}

                        <ChevronDown className="ml-1 size-3.5 opacity-60" />
                    </Badge>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-48 rounded-xl p-1.5"
            >
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Verification Status
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    disabled={isLoading || isVerified}
                    onSelect={() => handleStatusChange("ACTIVE")}
                    className="cursor-pointer gap-2 rounded-lg"
                >
                    <CheckCircle2 className="size-4 text-green-600" />
                    <span>Verified</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    disabled={isLoading || currentStatus === "INACTIVE"}
                    onSelect={() => handleStatusChange("INACTIVE")}
                    className="cursor-pointer gap-2 rounded-lg"
                >
                    <Clock className="size-4 text-amber-600" />
                    <span>Not Verified</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}