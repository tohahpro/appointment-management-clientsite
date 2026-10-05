"use client"

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
// import DoctorFormDialog from "./DoctorFormDialog";
import { Plus } from "lucide-react";
import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import AppealFormDialog from "./AppealCreateDialogForm";
import { ICategory } from "../../../../../types/appeal.interface";


interface AppealsManagementHeaderProps {
    categories?: ICategory[];
}

const AppealsManagementHeader = ({
    categories,
}: AppealsManagementHeaderProps) => {

    const router = useRouter();

    const [, startTransition] = useTransition();

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSuccess = () => {
        startTransition(() => {
            router.refresh();
        })
    }

    const [dialogKey, setDialogKey] = useState(0);
    const handleOpenDialog = () => {
        setDialogKey(prev => prev + 1);
        setIsDialogOpen(true);
    }

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    }

    return (
        <div>
            <AppealFormDialog
                key={dialogKey}
                open={isDialogOpen}
                onClose={handleCloseDialog}
                onSuccess={handleSuccess}
                categories={categories ?? []}
            />

            <ManagementPageHeader
                title="Appeal Management"
                description="Manage appeals information and details"
                action={{
                    label: "Add Appeal",
                    icon: Plus,
                    onClick: handleOpenDialog
                }}
            />
        </div>
    );
};

export default AppealsManagementHeader;