import DoctorAbout from "@/components/moduels/Doctor/DoctorDetails/DoctorAbout";
import DoctorAvailability from "@/components/moduels/Doctor/DoctorDetails/DoctorAvailability";
import DoctorBookingCard from "@/components/moduels/Doctor/DoctorDetails/DoctorBookingCard";
import DoctorNotFound from "@/components/moduels/Doctor/DoctorDetails/DoctorNotFound";
import DoctorProfileHeader from "@/components/moduels/Doctor/DoctorDetails/DoctorProfileHeader";
import {
    getAvailableSchedules,
    toDayGroups,
} from "@/components/moduels/Doctor/DoctorDetails/scheduleUtils";
import { getDoctorById } from "@/services/admin/doctorManagement";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { IDoctor } from "../../../../../../types/doctor.interface";

const MAX_DAYS = 14;

const DoctorDetailPage = async ({
    params
}: {
    params: Promise<{ id: string }>;
}) => {
    const { id } = await params;
    const result = await getDoctorById(id);
    const doctor: IDoctor | undefined = result?.data;

    if (!result?.success || !doctor) {
        return (
            <div className="container mx-auto px-4 py-8">
                <DoctorNotFound message={result?.message} />
            </div>
        );
    }

    const available = getAvailableSchedules(doctor.schedule);
    const days = toDayGroups(available).slice(0, MAX_DAYS);

    return (
        <div className="container mx-auto space-y-6 px-4 py-8 pb-28 lg:pb-8">
            <Link
                href="/consultation/doctors"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="size-4" />
                Back to doctors
            </Link>

            <DoctorProfileHeader doctor={doctor} availableSlots={available.length} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <DoctorAbout doctor={doctor} />
                    <DoctorAvailability days={days} totalSlots={available.length} />
                </div>

                <div className="lg:col-span-1">
                    <DoctorBookingCard
                        doctor={doctor}
                        availableSlots={available.length}
                        nextSlot={available[0]?.startDateTime}
                    />
                </div>
            </div>
        </div>
    );
};

export default DoctorDetailPage;
