import { IDoctorSchedule } from "../../../../../types/doctor.interface";

export const TIME_ZONE = "Asia/Dhaka";

export const formatScheduleDate = (
    date: string,
    options: Intl.DateTimeFormatOptions
): string => {
    return new Intl.DateTimeFormat("en-US", {
        timeZone: TIME_ZONE,
        ...options,
    }).format(new Date(date));
};

// YYYY-MM-DD key in Bangladesh timezone
export const getScheduleDateKey = (date: string): string => {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date(date));

    const year = parts.find((p) => p.type === "year")?.value;
    const month = parts.find((p) => p.type === "month")?.value;
    const day = parts.find((p) => p.type === "day")?.value;

    return `${year}-${month}-${day}`;
};

// Only future, not-yet-booked slots, sorted by start time
export const getAvailableSchedules = (
    schedules: IDoctorSchedule[] = []
): IDoctorSchedule[] => {
    const now = Date.now();

    return schedules
        .filter((s) => {
            const start = new Date(s.startDateTime).getTime();
            return s.isBooked === false && Number.isFinite(start) && start > now;
        })
        .sort(
            (a, b) =>
                new Date(a.startDateTime).getTime() -
                new Date(b.startDateTime).getTime()
        );
};

// [dateKey, slots[]] pairs, oldest date first
export const groupSchedulesByDate = (
    schedules: IDoctorSchedule[]
): [string, IDoctorSchedule[]][] => {
    const grouped: Record<string, IDoctorSchedule[]> = {};

    schedules.forEach((s) => {
        const key = getScheduleDateKey(s.startDateTime);
        (grouped[key] ??= []).push(s);
    });

    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
};

export interface IDaySlot {
    id: string;
    startDateTime: string;
}

export interface IDayGroup {
    key: string;
    firstSlot: string;
    slots: IDaySlot[];
}

// Plain, serializable day groups (safe to pass from a server to a client component)
export const toDayGroups = (schedules: IDoctorSchedule[]): IDayGroup[] => {
    return groupSchedulesByDate(schedules).map(([key, slots]) => ({
        key,
        firstSlot: slots[0].startDateTime,
        slots: slots.map((s) => ({ id: s.id, startDateTime: s.startDateTime })),
    }));
};
