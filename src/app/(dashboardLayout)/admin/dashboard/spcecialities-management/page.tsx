import SpecialitiesManagementHeader from "@/components/moduels/admin/SpcecialitiesManagement/SpecialitiesManagementHeader";
import SpecialitiesTable from "@/components/moduels/admin/SpcecialitiesManagement/SpecialitiesTable";
import RefreshButton from "@/components/shared/RefreshButton";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { getSpeacialities } from "@/services/admin/specialitiesManagement";
import { Suspense } from "react";


const AdminSpcecialitiesManagementPage = async () => {

    const result = await getSpeacialities()

    return (
        <div className="space-y-6">
            <SpecialitiesManagementHeader />
            <div className="flex">
                <RefreshButton />
            </div>
            <Suspense fallback={<TableSkeleton columns={2} rows={10} />}>
                <SpecialitiesTable specialities={result.data} />
            </Suspense>
        </div>
    );
};

export default AdminSpcecialitiesManagementPage;