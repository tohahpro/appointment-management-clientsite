import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, Building2, GraduationCap, User } from "lucide-react";
import { IDoctor } from "../../../../../types/doctor.interface";

interface DoctorAboutProps {
    doctor: IDoctor;
}

const GENDER_LABEL: Record<IDoctor["gender"], string> = {
    MALE: "Male",
    FEMALE: "Female",
    OTHER: "Other",
};

export default function DoctorAbout({ doctor }: DoctorAboutProps) {
    const specialties = (doctor.doctorSpecialties ?? []).filter(
        (s) => s.specialities?.title
    );

    const details = [
        {
            icon: GraduationCap,
            label: "Qualification",
            value: doctor.qualification,
            tile: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
        },
        {
            icon: Building2,
            label: "Current Workplace",
            value: doctor.currentWorkingPlace,
            tile: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
        },
        {
            icon: BadgeCheck,
            label: "Registration No.",
            value: doctor.registrationNumber,
            tile: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
        },
        {
            icon: User,
            label: "Gender",
            value: GENDER_LABEL[doctor.gender],
            tile: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
        },
    ];

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl">About Doctor</CardTitle>
            </CardHeader>

            <CardContent className="space-y-8">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {details.map(({ icon: Icon, label, value, tile }) => (
                        <div
                            key={label}
                            className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4"
                        >
                            <div
                                className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${tile}`}
                            >
                                <Icon className="size-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">{label}</p>
                                <p className="text-sm font-semibold wrap-break-word">
                                    {value || "N/A"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {specialties.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-base font-semibold">Specialties</h3>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {specialties.map((s) => (
                                <div
                                    key={s.specialitiesId}
                                    className="rounded-xl border border-l-4 border-l-blue-500 bg-card p-4"
                                >
                                    <p className="font-medium">{s.specialities.title}</p>
                                    {s.specialities.description && (
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {s.specialities.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
