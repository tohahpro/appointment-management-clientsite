import PatientsManagementHeader from "@/components/moduels/admin/PatientManagement/PatientsManagementHeader";
import PatientsTable from "@/components/moduels/admin/PatientManagement/PatientsTable";
import TablePagination from "@/components/shared/TablePagination";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { queryStringFormatter } from "@/lib/formatters";
import { getPatients } from "@/services/admin/patientManagement";
import { Suspense } from "react";

const PatientsManagementPage = async ({
    searchParams
}: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {

    const searchParamsObj = await searchParams;
    const queryString = queryStringFormatter(searchParamsObj);

    const patientsResult = await getPatients(queryString);

    const totalPages = Math.ceil(
        (patientsResult.meta?.total || 0) / (patientsResult.meta?.limit || 10)
    );

    return (
        <div className="space-y-6">
            <PatientsManagementHeader />
            <Suspense fallback={<TableSkeleton columns={5} rows={10} />}>
                <PatientsTable patients={patientsResult.data || []} />
                <TablePagination
                    currentPage={patientsResult.meta?.page || 1}
                    totalPages={totalPages || 1}
                />
            </Suspense>
        </div>
    );
};

export default PatientsManagementPage;