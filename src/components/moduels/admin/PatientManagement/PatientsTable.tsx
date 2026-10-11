"use client";

import ManagementTable from "@/components/shared/ManagementTable";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { IPatient } from "../../../../../types/patient.interface";
import { softDeletePatient } from "@/services/admin/patientManagement";
import { patientsColumns } from "./PatientColumns";
import PatientViewDetailDialog from "./PatientViewDetailsDialog";

interface PatientsTableProps {
    patients: IPatient[];
}

const PatientsTable = ({ patients }: PatientsTableProps) => {
    const router = useRouter();
    const [deletingPatient, setDeletingPatient] = useState<IPatient | null>(null);
    const [viewingPatient, setViewingPatient] = useState<IPatient | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleView = (patient: IPatient) => {
        setViewingPatient(patient);
    };

    const handleDelete = (patient: IPatient) => {
        setDeletingPatient(patient);
    };

    const confirmDelete = async () => {
        if (!deletingPatient) return;
        setIsDeleting(true);

        try {
            const result = await softDeletePatient(deletingPatient.id);

            if (result.success) {
                toast.success(result.message || "Patient deleted successfully");
                setDeletingPatient(null);
                router.refresh();
            } else {
                toast.error(result.message || "Failed to delete patient");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <ManagementTable
                data={patients}
                columns={patientsColumns}
                onView={handleView}
                onDelete={handleDelete}
                getRowKey={(patient) => patient.id}
                emptyMessage="No patients found"
            />

            <PatientViewDetailDialog
                open={!!viewingPatient}
                onClose={() => setViewingPatient(null)}
                patient={viewingPatient}
            />

            <DeleteConfirmationDialog
                open={!!deletingPatient}
                onOpenChange={(open) => !open && setDeletingPatient(null)}
                onConfirm={confirmDelete}
                title="Delete Patient"
                description={`Are you sure you want to delete ${deletingPatient?.name}? This action cannot be undone.`}
                isDeleting={isDeleting}
            />
        </>
    );
};

export default PatientsTable;