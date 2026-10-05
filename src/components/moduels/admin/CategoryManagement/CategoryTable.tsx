"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import ManagementTable from "@/components/shared/ManagementTable";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { ICategory } from "../../../../../types/appeal.interface";
import { deleteCategory } from "@/services/admin/categoryManagement";
import { categoryColumns } from "./CategoryColumns";


interface CategoryTableProps {
    categories: ICategory[];
}

const CategoryTable = ({ categories }: CategoryTableProps) => {

    const router = useRouter();

    const [, startTransition] = useTransition();

    const [deletingCategory, setDeletingCategory] = useState<ICategory | null>(null);
    // const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);

    const [isDeleting, setIsDeleting] = useState(false);

    const handleRefresh = () => {
        startTransition(() => {
            router.refresh();
        });
    };



    // const handleEdit = (category: ICategory) => {
    //     setEditingCategory(category);
    // };

    const handleDelete = (category: ICategory) => {
        setDeletingCategory(category);
    };

    const confirmDelete = async () => {
        if (!deletingCategory) {
            return;
        }

        setIsDeleting(true);

        const result = await deleteCategory(deletingCategory.id);

        setIsDeleting(false);

        if (result.success) {
            toast.success(
                result.message || "Category deleted successfully"
            );

            setDeletingCategory(null);

            handleRefresh();
        } else {
            toast.error(
                result.message || "Failed to delete category"
            );
        }
    };

    return (
        <>
            <div className="py-4 md:py-10">
                <ManagementTable
                    data={categories}
                    columns={categoryColumns}
                    // onEdit={handleEdit}
                    onDelete={handleDelete}
                    getRowKey={(category) => category.id}
                    emptyMessage="No Category found"
                />
            </div>

            {/* Edit Category Dialog */}
            {/* <CategoryEditFormDialog
                open={!!editingCategory}
                onClose={() =>
                    setEditingCategory(null)
                }
                category={editingCategory!}
                onSuccess={() => {
                    setEditingCategory(null);
                    handleRefresh();
                }}
            /> */}


            {/* Delete Confirmation */}
            <DeleteConfirmationDialog
                open={!!deletingCategory}
                onOpenChange={(open) => !open &&
                    setDeletingCategory(null)
                }
                onConfirm={confirmDelete}
                title="Delete Category"
                description={`Are you sure you want to delete ${deletingCategory?.name}? This action cannot be undone.`}
                isDeleting={isDeleting}
            />
        </>
    );
};

export default CategoryTable;