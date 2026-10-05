"use client"
import ManagementTable from "@/components/shared/ManagementTable";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { IAppeal, ICategory } from "../../../../../types/appeal.interface";
import { appealsColumns } from "./AppealColumns";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { deleteAppeal } from "@/services/admin/appealManagement";
import AppealViewDetailDialog from "./AppealViewDetailDialog";
import AppealEditFormDialog from "./AppealEditDialogForm";


interface AppealTableProps {
    appeals: IAppeal[];
    categories: ICategory[];
}

const AppealTable = ({ appeals, categories }: AppealTableProps) => {

    const router = useRouter();
    const [, startTransition] = useTransition();
    const [deletingAppeal, setDeletingAppeal] = useState<IAppeal | null>(null);
    const [viewingAppeal, setViewingAppeal] = useState<IAppeal | null>(null);
    const [editingAppeal, setEditingAppeal] = useState<IAppeal | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleRefresh = () => {
        startTransition(() => {
            router.refresh();
        });
    };

    const handleView = (appeal: IAppeal) => {
        setViewingAppeal(appeal);
    };

    const handleEdit = (appeal: IAppeal) => {
        setEditingAppeal(appeal);
    };

    const handleDelete = (appeal: IAppeal) => {
        setDeletingAppeal(appeal);
    };

    const confirmDelete = async () => {
        if (!deletingAppeal) return;

        setIsDeleting(true);
        const result = await deleteAppeal(deletingAppeal.id!);
        setIsDeleting(false);

        if (result.success) {
            toast.success(result.message || "Appeal deleted successfully");
            setDeletingAppeal(null);
            handleRefresh();
        } else {
            toast.error(result.message || "Failed to delete appeal");
        }
    }

    return (
        <>
            <div className="py-4 md:py-10">
                <ManagementTable
                    data={appeals}
                    columns={appealsColumns}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    getRowKey={(appeal) => appeal.id!}
                    emptyMessage="No Appeal found"
                />
            </div>
            {/* Edit Doctor Form Dialog */}
            <AppealEditFormDialog
                open={!!editingAppeal}
                onClose={() => setEditingAppeal(null)}
                appeal={editingAppeal!}
                categories={categories}
                onSuccess={() => {
                    setEditingAppeal(null);
                    handleRefresh();
                }}
            />

            {/* View Doctor Detail Dialog */}
            <AppealViewDetailDialog
                open={!!viewingAppeal}
                onClose={() => setViewingAppeal(null)}
                appeal={viewingAppeal}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                open={!!deletingAppeal}
                onOpenChange={(open) => !open && setDeletingAppeal(null)}
                onConfirm={confirmDelete}
                title="Delete Appeal"
                description={`Are you sure you want to delete ${deletingAppeal?.title}? This action cannot be undone.`}
                isDeleting={isDeleting}
            />
        </>
    );
};

export default AppealTable;