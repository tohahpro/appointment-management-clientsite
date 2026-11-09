import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { getInitials } from "@/lib/formatters";
import { Briefcase, Building2, CalendarClock, Star, Wallet } from "lucide-react";
import { IDoctor } from "../../../../../types/doctor.interface";

interface DoctorProfileHeaderProps {
    doctor: IDoctor;
    availableSlots: number;
}

export default function DoctorProfileHeader({
    doctor,
    availableSlots,
}: DoctorProfileHeaderProps) {
    const specialties = (doctor.doctorSpecialties ?? []).filter(
        (s) => s.specialities?.title
    );
    const rating = doctor.averageRating > 0 ? doctor.averageRating.toFixed(1) : "New";

    const stats = [
        {
            icon: Briefcase,
            label: "Experience",
            value: `${doctor.experience} ${doctor.experience === 1 ? "yr" : "yrs"}`,
            tile: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
        },
        {
            icon: Star,
            label: "Rating",
            value: rating,
            tile: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
        },
        {
            icon: Wallet,
            label: "Consultation Fee",
            value: `৳${doctor.appointmentFee}`,
            tile: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
        },
        {
            icon: CalendarClock,
            label: "Open Slots",
            value: String(availableSlots),
            tile: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
        },
    ];

    return (
        <div>
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-teal-500 text-white shadow-lg">
                <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10" />
                <div className="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-white/5" />

                <div className="relative flex flex-col items-center gap-6 px-6 pb-24 pt-10 text-center sm:flex-row sm:items-center sm:gap-8 sm:px-10 sm:text-left">
                    <Avatar className="size-32 shrink-0 shadow-xl ring-4 ring-white/40 sm:size-40">
                        <AvatarImage
                            src={doctor.profilePhoto || ""}
                            alt={doctor.name}
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-white/20 text-4xl font-semibold text-white">
                            {getInitials(doctor.name)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 space-y-3">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                            <span
                                className={`size-2 rounded-full ${availableSlots > 0 ? "bg-emerald-300" : "bg-white/50"}`}
                            />
                            {availableSlots > 0
                                ? "Accepting appointments"
                                : "No open slots right now"}
                        </span>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            {doctor.name}
                        </h1>

                        <p className="text-lg text-blue-50/90">{doctor.designation}</p>

                        {doctor.currentWorkingPlace && (
                            <p className="flex items-center justify-center gap-2 text-sm text-blue-50/90 sm:justify-start">
                                <Building2 className="size-4 shrink-0" />
                                {doctor.currentWorkingPlace}
                            </p>
                        )}

                        {specialties.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-2 pt-1 sm:justify-start">
                                {specialties.map((s) => (
                                    <span
                                        key={s.specialitiesId}
                                        className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur"
                                    >
                                        {s.specialities.title}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <div className="relative -mt-12 grid grid-cols-2 gap-3 px-3 sm:px-8 lg:grid-cols-4">
                {stats.map(({ icon: Icon, label, value, tile }) => (
                    <Card key={label} className="flex-row items-center gap-3 p-4 shadow-md">
                        <div
                            className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${tile}`}
                        >
                            <Icon className="size-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-xs text-muted-foreground">{label}</p>
                            <p className="truncate text-xl font-bold leading-tight">{value}</p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
