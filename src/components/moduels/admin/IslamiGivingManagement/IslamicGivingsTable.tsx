"use client";

import ManagementTable from "@/components/shared/ManagementTable";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { IIslamicGiving } from "../../../../../types/islamicGiving.interface";


// import IslamicGivingFormDialog from "./IslamicGivingFormDialog";
import IslamicGivingViewDetailDialog from "./IslamicGivingViewDetailDialog";
import { deleteIslamicGiving } from "@/services/admin/IslamicGivingManagement";
import { islamicGivingColumns } from "./IslamicGivingColumns";
import IslamicGivingFormDialog from "./IslamicGivingFormDialog";


interface IslamicGivingTableProps {
    islamicGivings: IIslamicGiving[];
}

const IslamicGivingTable = ({
    islamicGivings
}: IslamicGivingTableProps) => {
    const router = useRouter();
    const [, startTransition] = useTransition();

    const [deletingItem, setDeletingItem] = useState<IIslamicGiving | null>(null);
    const [viewingItem, setViewingItem] = useState<IIslamicGiving | null>(null);
    const [editingItem, setEditingItem] = useState<IIslamicGiving | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);


    const handleRefresh = () => {
        startTransition(() => {
            router.refresh();
        });
    };

    const handleView = (item: IIslamicGiving) => {
        setViewingItem(item);
    };

    const handleEdit = (item: IIslamicGiving) => {
        setEditingItem(item);
    };

    const handleDelete = (item: IIslamicGiving) => {
        setDeletingItem(item);
    };

    const confirmDelete = async () => {
        if (!deletingItem) return;

        setIsDeleting(true);

        const result = await deleteIslamicGiving(deletingItem.id);

        setIsDeleting(false);

        if (result.success) {
            toast.success(
                result.message || "Islamic Giving deleted successfully"
            );

            setDeletingItem(null);
            handleRefresh();
        } else {
            toast.error(
                result.message || "Failed to delete Islamic Giving"
            );
        }
    };

    return (
        <>
            <ManagementTable
                data={islamicGivings}
                columns={islamicGivingColumns}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                getRowKey={(item) => item.id}
                emptyMessage="No Islamic Giving found"
            />

            {/* Edit Islamic Giving */}
            <IslamicGivingFormDialog
                open={!!editingItem}
                onClose={() => setEditingItem(null)}
                islamicGiving={editingItem!}
                onSuccess={() => {
                    setEditingItem(null);
                    handleRefresh();
                }}
            />

            {/* View Islamic Giving Details */}
            <IslamicGivingViewDetailDialog
                open={!!viewingItem}
                onClose={() => setViewingItem(null)}
                islamicGiving={viewingItem}
            />

            {/* Delete Confirmation */}
            <DeleteConfirmationDialog
                open={!!deletingItem}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeletingItem(null);
                    }
                }}
                onConfirm={confirmDelete}
                title="Delete Islamic Giving"
                description={`Are you sure you want to delete "${deletingItem?.title}"? This action cannot be undone.`}
                isDeleting={isDeleting}
            />
        </>
    );
};

export default IslamicGivingTable;