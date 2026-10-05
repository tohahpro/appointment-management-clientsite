"use client";

import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import IslamicGivingFormDialog from "./IslamicGivingFormDialog";


const IslamicGivingManagementHeader = () => {
    const router = useRouter();
    const [, startTransition] = useTransition();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogKey, setDialogKey] = useState(0);

    const handleSuccess = () => {
        startTransition(() => {
            router.refresh();
        });
    };

    const handleOpenDialog = () => {
        setDialogKey((prev) => prev + 1);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    return (
        <div>
            <IslamicGivingFormDialog
                key={dialogKey}
                islamicGiving={null}
                open={isDialogOpen}
                onClose={handleCloseDialog}
                onSuccess={handleSuccess}
            />

            <ManagementPageHeader
                title="Islamic Giving Management"
                description="Manage Islamic giving pages and donation information"
                action={{
                    label: "Add Islamic Giving",
                    icon: Plus,
                    onClick: handleOpenDialog,
                }}
            />
        </div>
    );
};

export default IslamicGivingManagementHeader;