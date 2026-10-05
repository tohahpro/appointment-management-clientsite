"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";


import { updateVolunteerStatus } from "@/services/admin/volunteerManagement";
import { IVolunteer, VolunteerStatus } from "../../../../../types/volunteer.interface";

interface VolunteerStatusCellProps {
    volunteer: IVolunteer;
}

const statusOptions: VolunteerStatus[] = [
    "ACTIVE",
    "INACTIVE",
    "SUSPENDED",
];

const VolunteerStatusCell = ({
    volunteer,
}: VolunteerStatusCellProps) => {
    const router = useRouter();

    const [selectedStatus, setSelectedStatus] =
        useState<VolunteerStatus | null>(null);

    const [isConfirmOpen, setIsConfirmOpen] =
        useState(false);

    const [isPending, startTransition] =
        useTransition();

    const getStatusStyle = (
        status: VolunteerStatus
    ) => {
        switch (status) {
            case "ACTIVE":
                return "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-950 dark:text-green-400";

            case "SUSPENDED":
                return "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-950 dark:text-orange-400";

            case "INACTIVE":
            default:
                return "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300";
        }
    };

    const handleStatusSelect = (
        status: VolunteerStatus
    ) => {
        if (status === volunteer.status) {
            return;
        }

        setSelectedStatus(status);
        setIsConfirmOpen(true);
    };

    const handleConfirm = () => {
        if (!selectedStatus) return;

        startTransition(async () => {
            const result =
                await updateVolunteerStatus(
                    volunteer.id,
                    selectedStatus
                );

            if (result.success) {
                toast.success(
                    result.message ||
                    "Volunteer status updated successfully"
                );

                setIsConfirmOpen(false);
                setSelectedStatus(null);

                router.refresh();

                return;
            }

            toast.error(
                result.message ||
                "Failed to update volunteer status"
            );
        });
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger
                    disabled={isPending}
                    className={`
                        inline-flex items-center gap-1.5
                        rounded-full px-2.5 py-1
                        text-xs font-semibold
                        outline-none transition-colors
                        ${getStatusStyle(volunteer.status)}
                        ${isPending
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer"
                        }
                    `}
                >
                    {volunteer.status}

                    <ChevronDown className="h-3 w-3" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="start"
                    className="min-w-38"
                >
                    {statusOptions.map((status) => (
                        <DropdownMenuItem
                            key={status}
                            disabled={
                                status === volunteer.status
                            }
                            onClick={() =>
                                handleStatusSelect(status)
                            }
                            className="cursor-pointer"
                        >
                            <span
                                className={`
                                    mr-2 h-2 w-2 rounded-full
                                    ${status === "ACTIVE"
                                        ? "bg-green-500"
                                        : status === "SUSPENDED"
                                            ? "bg-orange-500"
                                            : "bg-gray-400"
                                    }
                                `}
                            />

                            {status}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog
                open={isConfirmOpen}
                onOpenChange={(open) => {
                    if (isPending) return;

                    setIsConfirmOpen(open);

                    if (!open) {
                        setSelectedStatus(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Update Volunteer Status
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            Are you sure you want to change{" "}
                            <span className="font-semibold text-foreground">
                                {volunteer.name}
                            </span>
                            {"'s status from "}
                            <span className="font-semibold text-foreground">
                                {volunteer.status}
                            </span>
                            {" to "}
                            <span className="font-semibold text-foreground">
                                {selectedStatus}
                            </span>
                            ?
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel
                            disabled={isPending}
                        >
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={(event) => {
                                event.preventDefault();
                                handleConfirm();
                            }}
                            disabled={isPending}
                            className="bg-[#D23157] text-white hover:bg-[#bd294c]"
                        >
                            {isPending
                                ? "Updating..."
                                : "Confirm Update"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default VolunteerStatusCell;