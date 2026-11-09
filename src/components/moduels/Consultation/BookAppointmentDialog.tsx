"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Moon,
  Sun,
  Sunrise,
} from "lucide-react";

import {
  formatScheduleDate,
  getAvailableSchedules,
  groupSchedulesByDate,
  TIME_ZONE,
} from "@/components/moduels/Doctor/DoctorDetails/scheduleUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { getInitials } from "@/lib/formatters";

import { IDoctor, IDoctorSchedule } from "../../../../types/doctor.interface";

interface BookAppointmentDialogProps {
  doctor: IDoctor;
  isOpen: boolean;
  onClose: () => void;
}

// Hour of the day (0-23) in Bangladesh timezone
const getHour = (date: string): number =>
  Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: TIME_ZONE,
      hour: "numeric",
      hourCycle: "h23",
    }).format(new Date(date))
  );

const PERIODS = [
  { id: "morning", label: "Morning", icon: Sunrise, test: (h: number) => h < 12 },
  {
    id: "afternoon",
    label: "Afternoon",
    icon: Sun,
    test: (h: number) => h >= 12 && h < 17,
  },
  { id: "evening", label: "Evening", icon: Moon, test: (h: number) => h >= 17 },
];

export default function BookAppointmentDialog({
  doctor,
  isOpen,
  onClose,
}: BookAppointmentDialogProps) {
  const router = useRouter();

  const [selectedSchedule, setSelectedSchedule] =
    useState<IDoctorSchedule | null>(null);
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);

  // Get schedules directly from Doctor
  const doctorSchedules = doctor.schedule ?? [];

  // Future, not-yet-booked slots grouped by date (Bangladesh timezone)
  const { days, totalAvailableSlots } = useMemo(() => {
    const available = getAvailableSchedules(doctorSchedules);

    return {
      days: groupSchedulesByDate(available),
      totalAvailableSlots: available.length,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorSchedules, isOpen]);

  const activeDay =
    days.find(([key]) => key === selectedDayKey) ?? days[0] ?? null;
  const activeSlots = activeDay ? activeDay[1] : [];

  // Close dialog
  const handleCloseModal = () => {
    setSelectedSchedule(null);
    setSelectedDayKey(null);
    onClose();
  };

  // Continue to appointment booking
  const handleContinue = () => {
    if (!selectedSchedule) return;

    const bookingUrl = `/dashboard/book-appointment/${doctor.id}/${selectedSchedule.id}`;

    handleCloseModal();

    router.push(bookingUrl);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleCloseModal();
        }
      }}
    >
      <DialogContent className="flex max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-2xl">
        {/* Dialog Header */}
        <DialogHeader className="shrink-0 border-b px-5 py-5 sm:px-6">
          <DialogTitle className="text-lg font-semibold sm:text-xl">
            Book an Appointment
          </DialogTitle>

          <DialogDescription>
            Choose a date and time that works for you with{" "}
            <span className="font-medium text-foreground">{doctor.name}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Dialog Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="space-y-6">
            {/* Doctor Information */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-teal-500 p-4 text-white shadow-md">
              <div className="pointer-events-none absolute -right-10 -top-12 size-40 rounded-full bg-white/10" />

              <div className="relative flex items-center gap-4">
                <Avatar className="size-16 shrink-0 shadow-md ring-2 ring-white/50">
                  <AvatarImage
                    src={doctor.profilePhoto || ""}
                    alt={doctor.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-white/20 text-lg font-semibold text-white">
                    {getInitials(doctor.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-semibold">
                    {doctor.name}
                  </h3>
                  <p className="truncate text-sm text-blue-50/90">
                    {doctor.designation}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-xs text-blue-100">Consultation fee</p>
                  <p className="text-2xl font-bold">৳{doctor.appointmentFee}</p>
                </div>
              </div>
            </div>

            {/* Available Slots Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold">Select date &amp; time</h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  All times are in Bangladesh time (BST)
                </p>
              </div>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                {totalAvailableSlots} Available
              </span>
            </div>

            {/* Available Schedules */}
            {!activeDay ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-4 py-12 text-center">
                <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
                  <CalendarDays className="size-6 text-muted-foreground" />
                </div>

                <p className="font-medium">No Available Slots</p>

                <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                  This doctor currently has no available appointment slots.
                  Please check back later.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Day picker */}
                <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
                  {days.map(([key, slots]) => {
                    const isActive = key === activeDay[0];

                    return (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => {
                          setSelectedDayKey(key);
                          setSelectedSchedule(null);
                        }}
                        className={`flex min-w-20 shrink-0 cursor-pointer flex-col items-center rounded-xl border px-3 py-2.5 transition-colors ${
                          isActive
                            ? "border-blue-600 bg-blue-600 text-white shadow-md"
                            : "bg-card hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                        }`}
                      >
                        <span
                          className={`text-xs ${isActive ? "text-blue-100" : "text-muted-foreground"}`}
                        >
                          {formatScheduleDate(slots[0].startDateTime, {
                            weekday: "short",
                          })}
                        </span>
                        <span className="text-xl font-bold leading-tight">
                          {formatScheduleDate(slots[0].startDateTime, {
                            day: "numeric",
                          })}
                        </span>
                        <span
                          className={`text-xs ${isActive ? "text-blue-100" : "text-muted-foreground"}`}
                        >
                          {formatScheduleDate(slots[0].startDateTime, {
                            month: "short",
                          })}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Time slots grouped by part of the day */}
                <div className="space-y-4">
                  {PERIODS.map(({ id, label, icon: Icon, test }) => {
                    const periodSlots = activeSlots.filter((s) =>
                      test(getHour(s.startDateTime))
                    );

                    if (periodSlots.length === 0) return null;

                    return (
                      <div key={id} className="space-y-2.5">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Icon className="size-4 text-blue-600 dark:text-blue-400" />
                          {label}
                        </div>

                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                          {periodSlots.map((schedule) => {
                            const isSelected =
                              selectedSchedule?.id === schedule.id;

                            return (
                              <button
                                key={schedule.id}
                                type="button"
                                aria-pressed={isSelected}
                                onClick={() => setSelectedSchedule(schedule)}
                                className={`flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-2 py-2.5 text-sm transition-colors ${
                                  isSelected
                                    ? "border-blue-600 bg-blue-600 font-medium text-white shadow-md"
                                    : "bg-card hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                                }`}
                              >
                                {isSelected ? (
                                  <Check className="size-4 shrink-0" />
                                ) : (
                                  <Clock3 className="size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                                )}

                                {formatScheduleDate(schedule.startDateTime, {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dialog Footer */}
        <DialogFooter className="shrink-0 border-t bg-muted/30 px-5 py-4 sm:px-6">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Selected Schedule */}
            <div className="text-sm">
              {selectedSchedule ? (
                <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-blue-800 dark:bg-blue-500/15 dark:text-blue-200">
                  <CalendarDays className="size-4 shrink-0" />
                  <span className="font-medium">
                    {formatScheduleDate(selectedSchedule.startDateTime, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                    {" · "}
                    {formatScheduleDate(selectedSchedule.startDateTime, {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              ) : (
                <span className="text-muted-foreground">
                  Select a time slot to continue
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                className="cursor-pointer"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleContinue}
                disabled={!selectedSchedule}
                className="cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
              >
                Continue
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}