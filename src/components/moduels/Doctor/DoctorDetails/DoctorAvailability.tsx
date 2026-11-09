"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock3 } from "lucide-react";
import { useState } from "react";
import { formatScheduleDate, IDayGroup } from "./scheduleUtils";

interface DoctorAvailabilityProps {
    days: IDayGroup[];
    totalSlots: number;
}

export default function DoctorAvailability({
    days,
    totalSlots,
}: DoctorAvailabilityProps) {
    const [selectedKey, setSelectedKey] = useState(days[0]?.key);
    const selectedDay = days.find((d) => d.key === selectedKey) ?? days[0];

    return (
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
                <CardTitle className="text-xl">Availability</CardTitle>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                    {totalSlots} {totalSlots === 1 ? "slot" : "slots"}
                </span>
            </CardHeader>

            <CardContent>
                {!selectedDay ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-4 py-10 text-center">
                        <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
                            <CalendarDays className="size-6 text-muted-foreground" />
                        </div>
                        <p className="font-medium">No Available Slots</p>
                        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                            This doctor currently has no open appointment slots. Please
                            check back later.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
                            {days.map((day) => {
                                const isActive = day.key === selectedDay.key;
                                return (
                                    <button
                                        key={day.key}
                                        type="button"
                                        aria-pressed={isActive}
                                        onClick={() => setSelectedKey(day.key)}
                                        className={`flex min-w-20 shrink-0 cursor-pointer flex-col items-center rounded-xl border px-3 py-2.5 transition-colors ${
                                            isActive
                                                ? "border-blue-600 bg-blue-600 text-white shadow-md"
                                                : "bg-card hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                                        }`}
                                    >
                                        <span
                                            className={`text-xs ${isActive ? "text-blue-100" : "text-muted-foreground"}`}
                                        >
                                            {formatScheduleDate(day.firstSlot, { weekday: "short" })}
                                        </span>
                                        <span className="text-xl font-bold leading-tight">
                                            {formatScheduleDate(day.firstSlot, { day: "numeric" })}
                                        </span>
                                        <span
                                            className={`text-xs ${isActive ? "text-blue-100" : "text-muted-foreground"}`}
                                        >
                                            {formatScheduleDate(day.firstSlot, { month: "short" })}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm font-medium">
                                {formatScheduleDate(selectedDay.firstSlot, {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                                <span className="font-normal text-muted-foreground">
                                    {" "}
                                    · {selectedDay.slots.length}{" "}
                                    {selectedDay.slots.length === 1 ? "slot" : "slots"}
                                </span>
                            </p>

                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                                {selectedDay.slots.map((slot) => (
                                    <div
                                        key={slot.id}
                                        className="flex items-center justify-center gap-1.5 rounded-lg border bg-muted/30 px-2 py-2.5 text-sm"
                                    >
                                        <Clock3 className="size-3.5 text-blue-600 dark:text-blue-400" />
                                        {formatScheduleDate(slot.startDateTime, {
                                            hour: "numeric",
                                            minute: "2-digit",
                                            hour12: true,
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
