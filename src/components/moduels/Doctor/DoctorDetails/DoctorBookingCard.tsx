"use client";

import BookAppointmentDialog from "@/components/moduels/Consultation/BookAppointmentDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CalendarCheck, Clock3, MousePointerClick } from "lucide-react";
import { useState } from "react";
import { IDoctor } from "../../../../../types/doctor.interface";
import { formatScheduleDate } from "./scheduleUtils";

interface DoctorBookingCardProps {
    doctor: IDoctor;
    availableSlots: number;
    nextSlot?: string;
}

export default function DoctorBookingCard({
    doctor,
    availableSlots,
    nextSlot,
}: DoctorBookingCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const noSlots = availableSlots === 0;

    return (
        <>
            <Card className="gap-0 overflow-hidden p-0 shadow-md lg:sticky lg:top-24">
                <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-teal-500 p-6 text-white">
                    <p className="text-sm text-blue-100">Consultation Fee</p>
                    <p className="mt-1 text-4xl font-bold">৳{doctor.appointmentFee}</p>
                </div>

                <div className="space-y-4 p-6">
                    <div className="flex items-start gap-3 rounded-xl bg-muted/40 p-3">
                        <Clock3 className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                        <div className="text-sm">
                            {noSlots || !nextSlot ? (
                                <p className="text-muted-foreground">
                                    No slots available right now
                                </p>
                            ) : (
                                <>
                                    <p className="text-xs text-muted-foreground">
                                        Next available
                                    </p>
                                    <p className="font-semibold">
                                        {formatScheduleDate(nextSlot, {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                        {" · "}
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

                    <Button
                        size="lg"
                        className="hidden w-full cursor-pointer bg-blue-600 text-white hover:bg-blue-700 lg:inline-flex"
                        disabled={noSlots}
                        onClick={() => setIsOpen(true)}
                    >
                        <CalendarCheck className="mr-2 size-4" />
                        Book Appointment
                    </Button>

                    <p className="flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
                        <MousePointerClick className="size-3.5" />
                        You will choose your date and time in the next step
                    </p>
                </div>
            </Card>

            {/* Mobile: sticky bottom bar */}
            <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
                <div>
                    <p className="text-xs text-muted-foreground">Consultation Fee</p>
                    <p className="text-xl font-bold">৳{doctor.appointmentFee}</p>
                </div>
                <Button
                    size="lg"
                    className="cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
                    disabled={noSlots}
                    onClick={() => setIsOpen(true)}
                >
                    <CalendarCheck className="mr-2 size-4" />
                    Book Appointment
                </Button>
            </div>

            <BookAppointmentDialog
                doctor={doctor}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}
