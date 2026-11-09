import DoctorGrid from "@/components/moduels/Consultation/DoctorGrid";
import DoctorSearchFilters from "@/components/moduels/Consultation/DoctorSearchFilter";
import TablePagination from "@/components/shared/TablePagination";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { queryStringFormatter } from "@/lib/formatters";
import { getDoctors } from "@/services/admin/doctorManagement";
import { getSpeacialities } from "@/services/admin/specialitiesManagement";
import { HeartPulse, ShieldCheck, Stethoscope } from "lucide-react";
import { Suspense } from "react";

// ISR: Revalidate every 10 minutes for doctor listings
export const revalidate = 600;

const ConsultationPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const searchParamsObj = await searchParams;
    const queryString = queryStringFormatter(searchParamsObj);

    // Fetch doctors and specialties in parallel
    const [doctorsResponse,
        specialtiesResponse
    ] = await Promise.all([
        getDoctors(queryString),
        getSpeacialities(),
    ]);

    const doctors = doctorsResponse?.data || [];
    const specialties = specialtiesResponse?.data || [];

    const meta = doctorsResponse?.meta;
    const totalDoctors: number = meta?.total ?? doctors.length;
    const limit: number = meta?.limit || 10;
    const totalPages: number =
        meta?.totalPage || Math.ceil(totalDoctors / limit) || 1;

    const highlights = [
        { icon: Stethoscope, label: `${totalDoctors} ${totalDoctors === 1 ? "Doctor" : "Doctors"}` },
        { icon: HeartPulse, label: `${specialties.length} Specialties` },
        { icon: ShieldCheck, label: "Easy online booking" },
    ];

    return (
        <div className="container mx-auto space-y-8 px-4 py-8">
            {/* Hero */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-teal-500 text-white shadow-lg">
                <div className="pointer-events-none absolute -right-20 -top-24 size-80 rounded-full bg-white/10" />
                <div className="pointer-events-none absolute -bottom-28 left-1/4 size-72 rounded-full bg-white/5" />

                <div className="relative px-6 pb-24 pt-10 sm:px-10 sm:pt-12">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                        <Stethoscope className="size-3.5" />
                        Online Consultation
                    </span>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
                        Find a Doctor
                    </h1>

                    <p className="mt-3 max-w-2xl text-base text-blue-50/90 sm:text-lg">
                        Search and book appointments with our qualified healthcare
                        professionals, quickly and with confidence.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                        {highlights.map(({ icon: Icon, label }) => (
                            <span
                                key={label}
                                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-sm backdrop-blur"
                            >
                                <Icon className="size-4" />
                                {label}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Filters, overlapping the hero */}
            <div className="relative -mt-20 px-3 sm:px-8">
                <DoctorSearchFilters specialties={specialties} />
            </div>

            {/* Results */}
            <div className="space-y-5">
                <p className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-semibold text-foreground">{doctors.length}</span>{" "}
                    of{" "}
                    <span className="font-semibold text-foreground">{totalDoctors}</span>{" "}
                    {totalDoctors === 1 ? "doctor" : "doctors"}
                </p>

                <Suspense fallback={<TableSkeleton columns={3} />}>
                    <DoctorGrid doctors={doctors} />
                </Suspense>

                <TablePagination
                    currentPage={doctorsResponse?.meta?.page || 1}
                    totalPages={totalPages}
                />
            </div>
        </div>
    );
};

export default ConsultationPage;
