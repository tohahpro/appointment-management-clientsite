"use client";
import { formatScheduleDate } from "@/components/moduels/Doctor/DoctorDetails/scheduleUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getInitials } from "@/lib/formatters";
import {
    Briefcase,
    Building2,
    CalendarCheck,
    Clock3,
    Eye,
    GraduationCap,
    Star,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { IDoctor } from "../../../../types/doctor.interface";
import BookAppointmentDialog from "./BookAppointmentDialog";


interface DoctorCardProps {
    doctor: IDoctor;
    availableSlots: number;
    nextSlot?: string;
}

export default function DoctorCard({ doctor, availableSlots, nextSlot }: DoctorCardProps) {

    const [showScheduleModal, setShowScheduleModal] = useState(false);

    const specialties = (doctor.doctorSpecialties ?? []).filter(
        (s) => s.specialities?.title
    );
    const rating = doctor.averageRating > 0 ? doctor.averageRating.toFixed(1) : "New";
    const noSlots = availableSlots === 0;

    const infoRows = [
        {
            icon: Briefcase,
            text: `${doctor.experience} ${doctor.experience === 1 ? "year" : "years"} experience`,
        },
        { icon: Building2, text: doctor.currentWorkingPlace },
        { icon: GraduationCap, text: doctor.qualification },
    ].filter((row) => row.text);

    return (
        <>
            <Card className="group h-full gap-0 overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl">
                {/* Top band */}
                <div className="relative h-24 bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400">
                    <div className="pointer-events-none absolute -right-8 -top-10 size-32 rounded-full bg-white/10" />

                    <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-amber-600 shadow-sm">
                        <Star className="size-3.5 fill-amber-400 text-amber-400" />
                        {rating}
                    </span>
                </div>

                <div className="flex flex-1 flex-col px-5 pb-5">
                    <Avatar className="-mt-12 size-24 shadow-lg ring-4 ring-background">
                        <AvatarImage
                            src={doctor.profilePhoto || ""}
                            alt={doctor.name}
                            className="object-cover"
                        />
                        <AvatarFallback className="text-2xl font-semibold">
                            {getInitials(doctor.name)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="mt-3">
                        <h3 className="line-clamp-1 text-lg font-bold">{doctor.name}</h3>
                        <p className="line-clamp-1 text-sm text-muted-foreground">
                            {doctor.designation}
                        </p>
                    </div>

                    {specialties.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {specialties.slice(0, 2).map((s) => (
                                <span
                                    key={s.specialitiesId}
                                    className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                                >
                                    {s.specialities.title}
                                </span>
                            ))}
                            {specialties.length > 2 && (
                                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                                    +{specialties.length - 2} more
                                </span>
                            )}
                        </div>
                    )}

                    <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                        {infoRows.map(({ icon: Icon, text }) => (
                            <li key={text} className="flex items-center gap-2.5">
                                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-blue-600 dark:text-blue-400">
                                    <Icon className="size-4" />
                                </span>
                                <span className="line-clamp-1">{text}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Fee + availability */}
                    <div className="mt-5 flex items-end justify-between gap-3 rounded-xl bg-muted/40 p-3">
                        <div>
                            <p className="text-xs text-muted-foreground">Consultation fee</p>
                            <p className="text-xl font-bold text-blue-700 dark:text-blue-400">
                                ৳{doctor.appointmentFee}
                            </p>
                        </div>

                        <div className="text-right text-xs">
                            {noSlots || !nextSlot ? (
                                <p className="font-medium text-muted-foreground">
                                    No slots available
                                </p>
                            ) : (
                                <>
                                    <p className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                                        <span className="size-2 rounded-full bg-emerald-500" />
                                        {availableSlots} {availableSlots === 1 ? "slot" : "slots"} open
                                    </p>
                                    <p className="mt-0.5 inline-flex items-center gap-1 text-muted-foreground">
                                        <Clock3 className="size-3" />
                                        {formatScheduleDate(nextSlot, {
                                            month: "short",
                                            day: "numeric",
                                        })}
                                        {", "}
                                        {formatScheduleDate(nextSlot, {
                                            hour: "numeric",
                                            minute: "2-digit",
                                            hour12: true,
                                        })}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <Button asChild variant="outline" className="flex-1 cursor-pointer">
                            <Link href={`/consultation/doctors/${doctor.id}`}>
                                <Eye className="mr-2 size-4" />
                                View Details
                            </Link>
                        </Button>
                        <Button
                            onClick={() => setShowScheduleModal(true)}
                            disabled={noSlots}
                            className="flex-1 cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
                        >
                            <CalendarCheck className="mr-2 size-4" />
                            Book
                        </Button>
                    </div>
                </div>
            </Card>

            <BookAppointmentDialog
                doctor={doctor}
                isOpen={showScheduleModal}
                onClose={() => setShowScheduleModal(false)}
            />
        </>
    );
}
