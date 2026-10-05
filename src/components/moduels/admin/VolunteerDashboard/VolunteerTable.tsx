"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import ManagementTable from "@/components/shared/ManagementTable";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { IVolunteer } from "../../../../../types/volunteer.interface";
import { softDeleteVolunteer } from "@/services/admin/volunteerManagement";
import { volunteersColumns } from "./VolunteerColumns";
import VolunteerViewDetailDialog from "./VolunteerViewDetailDialog";


interface VolunteersTableProps {
    volunteers: IVolunteer[];
}

const VolunteersTable = ({ volunteers }: VolunteersTableProps) => {
    const router = useRouter();

    const [, startTransition] = useTransition();

    const [deletingVolunteer, setDeletingVolunteer] = useState<IVolunteer | null>(null);
    const [viewingVolunteer, setViewingVolunteer] = useState<IVolunteer | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleRefresh = () => {
        startTransition(() => {
            router.refresh();
        });
    };

    const handleView = (volunteer: IVolunteer) => {
        setViewingVolunteer(volunteer);
    };

    const handleDelete = (volunteer: IVolunteer) => {
        setDeletingVolunteer(volunteer);
    };

    const confirmDelete = async () => {
        if (!deletingVolunteer) return;

        try {
            setIsDeleting(true);

            const result = await softDeleteVolunteer(deletingVolunteer.id);

            if (result.success) {
                toast.success(
                    result.message || "Volunteer deleted successfully"
                );

                setDeletingVolunteer(null);
                handleRefresh();
            } else {
                toast.error(
                    result.message || "Failed to delete volunteer"
                );
            }
        } catch {
            toast.error("Something went wrong while deleting volunteer");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <ManagementTable
                data={volunteers}
                columns={volunteersColumns}
                onView={handleView}
                onDelete={handleDelete}
                getRowKey={(volunteer) => volunteer.id}
                emptyMessage="No volunteers found"
            />

            {/* View Volunteer */}
            <VolunteerViewDetailDialog
                open={!!viewingVolunteer}
                onClose={() => setViewingVolunteer(null)}
                volunteer={viewingVolunteer}
            />

            {/* Delete Volunteer */}
            <DeleteConfirmationDialog
                open={!!deletingVolunteer}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeletingVolunteer(null);
                    }
                }}
                onConfirm={confirmDelete}
                title="Delete Volunteer"
                description={`Are you sure you want to delete ${deletingVolunteer?.name ?? "this volunteer"}? This action cannot be undone.`}
                isDeleting={isDeleting}
            />
        </>
    );
};

export default VolunteersTable;