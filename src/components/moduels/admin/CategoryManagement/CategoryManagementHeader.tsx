"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Plus } from "lucide-react";

import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import { ICategory } from "../../../../../types/appeal.interface";
import CategoryFormDialog from "./CategoryFormDialog";


interface CategoryManagementHeaderProps {
    categories: ICategory[];
}
const CategoryManagementHeader = (categories: CategoryManagementHeaderProps) => {
    const router = useRouter();

    const [, startTransition] = useTransition();
    const [isDialogOpen, setIsDialogOpen,] = useState(false);
    const [dialogKey, setDialogKey,] = useState(0);

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
            <CategoryFormDialog
                key={dialogKey}
                open={isDialogOpen}
                onClose={handleCloseDialog}
                onSuccess={handleSuccess}
            />

            <ManagementPageHeader
                title="Appeal Category Management"
                description="Manage appeal category information and details"
                action={{
                    label: "Add Category",
                    icon: Plus,
                    onClick: handleOpenDialog,
                }}
            />
        </div>
    );
};

export default CategoryManagementHeader;