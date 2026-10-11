"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { formatDateTime, getInitials } from "@/lib/formatters";
import {
    CalendarDays,
    Clock3,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    UserRound,
    type LucideIcon,
} from "lucide-react";
import { IPatient } from "../../../../../types/patient.interface";

interface PatientViewDetailDialogProps {
    open: boolean;
    onClose: () => void;
    patient: IPatient | null;
}

interface InfoItemProps {
    icon: LucideIcon;
    label: string;
    value: string;
}

const InfoItem = ({ icon: Icon, label, value }: InfoItemProps) => (
    <div className="flex min-w-0 items-start gap-3 rounded-xl p-3 transition-colors hover:bg-slate-50">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Icon className="size-4.5" />
        </div>
        <div className="min-w-0 flex-1">
            <p className="mb-1 text-xs font-medium text-slate-400">{label}</p>
            <p className="wrap-break-word text-sm font-semibold text-slate-800">{value || "Not provided"}</p>
        </div>
    </div>
);

const PatientViewDetailDialog = ({ open, onClose, patient }: PatientViewDetailDialogProps) => {
    if (!patient) return null;

    const isDeleted = patient.isDeleted;

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="flex max-h-[90dvh] w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-[#F8FAFC] p-0 shadow-2xl sm:max-w-2xl sm:rounded-3xl">
                <div className="relative shrink-0 overflow-hidden bg-linear-to-br from-[#0F2747] via-[#174477] to-[#2563EB] px-6 pb-7 pt-7 sm:px-8">
                    <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-white/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 left-1/3 size-52 rounded-full bg-blue-300/20 blur-3xl" />
                    <DialogHeader className="relative mb-6 text-left">
                        <DialogTitle className="text-xl font-bold text-white">Patient Profile</DialogTitle>
                        <DialogDescription className="text-sm text-blue-100/80">
                            Complete patient profile and account information.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-center">
                        <div className="relative shrink-0">
                            <Avatar className="size-24 border-4 border-white/90 shadow-xl sm:size-28">
                                <AvatarImage src={patient.profilePhoto ?? undefined} alt={patient.name} className="object-cover" />
                                <AvatarFallback className="bg-blue-100 text-3xl font-bold text-blue-700">
                                    {getInitials(patient.name)}
                                </AvatarFallback>
                            </Avatar>
                            {!isDeleted && (
                                <div className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border-4 border-[#174477] bg-emerald-500 text-white">
                                    <ShieldCheck className="size-4" />
                                </div>
                            )}
                        </div>

                        <div className="min-w-0 flex-1 text-center sm:text-left">
                            <h2 className="mb-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                {patient.name}
                            </h2>
                            <p className="mb-4 flex items-center justify-center gap-2 break-all text-sm text-blue-100/80 sm:justify-start">
                                <Mail className="size-4 shrink-0" />
                                {patient.email}
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                                <Badge
                                    variant="outline"
                                    className={`gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${isDeleted
                                        ? "border-red-200 bg-red-50 text-red-700"
                                        : "border-emerald-200 bg-emerald-50 text-emerald-700"
                                        }`}
                                >
                                    <ShieldCheck className="size-3.5" />
                                    {isDeleted ? "Deleted Account" : "Active"}
                                </Badge>
                                <Badge variant="outline" className="gap-1.5 rounded-lg border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white">
                                    <UserRound className="size-3.5" />
                                    Patient
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-5 sm:px-7 sm:py-6">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Phone className="size-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Contact Information</h3>
                                <p className="text-xs text-slate-400">Communication and location details</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-2">
                            <InfoItem icon={Mail} label="Email Address" value={patient.email} />
                            <InfoItem icon={Phone} label="Contact Number" value={patient.contactNumber || "Not provided"} />
                            <div className="sm:col-span-2">
                                <InfoItem icon={MapPin} label="Address" value={patient.address || "Not provided"} />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                <UserRound className="size-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Account Information</h3>
                                <p className="text-xs text-slate-400">Registration and account details</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-2">
                            <InfoItem icon={CalendarDays} label="Joined On" value={formatDateTime(patient.createdAt)} />
                            <InfoItem icon={Clock3} label="Last Updated" value={formatDateTime(patient.updatedAt)} />
                        </div>
                    </div>

                    <div className={`flex items-start gap-3 rounded-2xl border p-4 ${isDeleted ? "border-red-200 bg-red-50" : "border-emerald-200 bg-emerald-50"
                        }`}>
                        <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${isDeleted ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
                            }`}>
                            <ShieldCheck className="size-5" />
                        </div>
                        <div>
                            <h4 className={`text-sm font-bold ${isDeleted ? "text-red-900" : "text-emerald-900"}`}>
                                {isDeleted ? "Account Deleted" : "Account Available"}
                            </h4>
                            <p className={`mt-1 text-xs leading-relaxed ${isDeleted ? "text-red-700" : "text-emerald-700"}`}>
                                {isDeleted
                                    ? "This patient profile has been marked as deleted."
                                    : "This patient profile is available in the healthcare management system."}
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="shrink-0 flex-row items-center justify-between border-t border-slate-200 bg-white px-5 py-4 sm:px-7">
                    <p className="hidden text-xs font-medium text-slate-400 sm:block">
                        Patient Profile Information
                    </p>
                    <Button type="button" variant="outline" onClick={onClose} className="ml-auto min-w-28 rounded-xl border-slate-200 font-semibold">
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PatientViewDetailDialog;