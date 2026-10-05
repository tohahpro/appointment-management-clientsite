"use client";

import Image from "next/image";
import {
    BriefcaseBusiness,
    CalendarDays,
    ExternalLink,
    GraduationCap,
    House,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    UserRound,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/formatters";

import { IVolunteer } from "../../../../../types/volunteer.interface";

interface VolunteerViewDetailDialogProps {
    open: boolean;
    onClose: () => void;
    volunteer: IVolunteer | null;
}

const formatOccupation = (value?: string) => {
    if (!value) return "N/A";

    return value.replace(/([a-z])([A-Z])/g, "$1 $2");
};

const VolunteerViewDetailDialog = ({
    open,
    onClose,
    volunteer,
}: VolunteerViewDetailDialogProps) => {
    if (!volunteer) return null;

    const isActive = volunteer.status === "ACTIVE";
    const isSuspended = volunteer.status === "SUSPENDED";

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value) onClose();
            }}
        >
            <DialogContent
                className="
                    flex max-h-[92dvh] w-[calc(100%-1rem)] max-w-4xl
                    flex-col gap-0 overflow-hidden p-0
                    sm:w-[calc(100%-2rem)]
                "
            >
                {/* Sticky Header */}
                <div className="shrink-0 border-b bg-background px-4 py-4 sm:px-6 sm:py-5">
                    <DialogHeader className="space-y-1 text-left">
                        <DialogTitle className="text-lg font-semibold tracking-tight sm:text-xl">
                            Volunteer Details
                        </DialogTitle>

                        <DialogDescription className="text-xs sm:text-sm">
                            Complete profile and account information for this volunteer.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* Scrollable Content */}
                <div className="min-h-0 flex-1 overflow-y-auto">
                    {/* Profile Hero */}
                    <div className="border-b bg-muted/20 px-4 py-5 sm:px-6 sm:py-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            {/* Photo */}
                            <div className="shrink-0">
                                {volunteer.photo ? (
                                    <div className="w-24 overflow-hidden rounded-xl border bg-background shadow-sm sm:w-28">
                                        <Image
                                            src={volunteer.photo}
                                            alt={volunteer.name}
                                            width={400}
                                            height={500}
                                            className="h-auto w-full object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className="
                                            flex h-24 w-24 items-center justify-center
                                            rounded-xl border bg-background text-2xl
                                            font-semibold text-muted-foreground shadow-sm
                                            sm:h-28 sm:w-28
                                        "
                                    >
                                        {volunteer.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {/* Profile Content */}
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="wrap-break-word text-xl font-semibold tracking-tight sm:text-2xl">
                                        {volunteer.name}
                                    </h2>

                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                                            isActive &&
                                            "border-emerald-200 bg-emerald-50 text-emerald-700",
                                            isSuspended &&
                                            "border-red-200 bg-red-50 text-red-700",
                                            !isActive &&
                                            !isSuspended &&
                                            "border-amber-200 bg-amber-50 text-amber-700"
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "mr-1.5 h-1.5 w-1.5 rounded-full",
                                                isActive && "bg-emerald-500",
                                                isSuspended && "bg-red-500",
                                                !isActive &&
                                                !isSuspended &&
                                                "bg-amber-500"
                                            )}
                                        />

                                        {volunteer.status}
                                    </Badge>
                                </div>

                                <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-5">
                                    <a
                                        href={`mailto:${volunteer.email}`}
                                        className="flex min-w-0 items-center gap-2 transition-colors hover:text-foreground"
                                    >
                                        <Mail className="h-4 w-4 shrink-0" />

                                        <span className="truncate">
                                            {volunteer.email || "N/A"}
                                        </span>
                                    </a>

                                    <a
                                        href={`tel:${volunteer.mobileNumber}`}
                                        className="flex items-center gap-2 transition-colors hover:text-foreground"
                                    >
                                        <Phone className="h-4 w-4 shrink-0" />

                                        <span>
                                            {volunteer.mobileNumber || "N/A"}
                                        </span>
                                    </a>
                                </div>

                                {volunteer.currentOccupation && (
                                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                        <BriefcaseBusiness className="h-4 w-4 shrink-0" />

                                        <span>
                                            {formatOccupation(
                                                volunteer.currentOccupation
                                            )}

                                            {volunteer.organizationName &&
                                                ` • ${volunteer.organizationName}`}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-4 p-4 sm:space-y-5 sm:p-6">
                        <DetailSection
                            title="Personal Information"
                            description="Basic contact and personal details"
                            icon={UserRound}
                        >
                            <DetailGrid>
                                <DetailItem
                                    label="Full Name"
                                    value={volunteer.name}
                                />

                                <DetailItem
                                    label="Father's Name"
                                    value={volunteer.fathersName}
                                />

                                <DetailItem
                                    label="Mobile Number"
                                    value={volunteer.mobileNumber}
                                />

                                <DetailItem
                                    label="Email Address"
                                    value={volunteer.email}
                                />

                                <DetailItem
                                    label="WhatsApp Number"
                                    value={volunteer.whatsappNumber}
                                />
                            </DetailGrid>
                        </DetailSection>

                        <DetailSection
                            title="Occupation Information"
                            description="Professional and workplace information"
                            icon={BriefcaseBusiness}
                        >
                            <DetailGrid>
                                <DetailItem
                                    label="Current Occupation"
                                    value={formatOccupation(
                                        volunteer.currentOccupation
                                    )}
                                />

                                <DetailItem
                                    label="Organization Name"
                                    value={volunteer.organizationName}
                                />

                                <div className="sm:col-span-2">
                                    <DetailItem
                                        label="Workplace Address"
                                        value={volunteer.workplaceAddress}
                                    />
                                </div>
                            </DetailGrid>
                        </DetailSection>

                        <DetailSection
                            title="Address Information"
                            description="Current and permanent residential address"
                            icon={MapPin}
                        >
                            <DetailGrid>
                                <DetailItem
                                    label="Current Address"
                                    value={volunteer.currentAddress}
                                />

                                <DetailItem
                                    label="Permanent Address"
                                    value={volunteer.permanentAddress}
                                />
                            </DetailGrid>
                        </DetailSection>

                        <DetailSection
                            title="Education Information"
                            description="Academic background and qualifications"
                            icon={GraduationCap}
                        >
                            <DetailGrid>
                                <DetailItem
                                    label="Education Level"
                                    value={volunteer.educationLevel}
                                />

                                <DetailItem
                                    label="Last Passed"
                                    value={volunteer.lastPassed}
                                />

                                <DetailItem
                                    label="Department / Degree"
                                    value={volunteer.departmentDegree}
                                />

                                <DetailItem
                                    label="Institution Name"
                                    value={volunteer.institutionName}
                                />
                            </DetailGrid>
                        </DetailSection>

                        <DetailSection
                            title="Social Information"
                            description="Social and professional profiles"
                            icon={House}
                        >
                            <div className="grid gap-3 sm:grid-cols-2">
                                <LinkDetailItem
                                    label="Facebook"
                                    value={volunteer.facebookLink}
                                />

                                <LinkDetailItem
                                    label="LinkedIn"
                                    value={volunteer.linkedinLink}
                                />
                            </div>
                        </DetailSection>

                        <DetailSection
                            title="System Information"
                            description="Account status and record history"
                            icon={ShieldCheck}
                            muted
                        >
                            <DetailGrid>
                                <StatusDetailItem
                                    label="Volunteer Status"
                                    value={volunteer.status}
                                    active={volunteer.status === "ACTIVE"}
                                />

                                <StatusDetailItem
                                    label="Account Status"
                                    value={
                                        volunteer.isActive
                                            ? "Active"
                                            : "Inactive"
                                    }
                                    active={volunteer.isActive}
                                />

                                <DetailItem
                                    label="Created At"
                                    value={formatDateTime(
                                        volunteer.createdAt
                                    )}
                                    icon={CalendarDays}
                                />

                                <DetailItem
                                    label="Updated At"
                                    value={formatDateTime(
                                        volunteer.updatedAt
                                    )}
                                    icon={CalendarDays}
                                />
                            </DetailGrid>
                        </DetailSection>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default VolunteerViewDetailDialog;

/* -------------------------------------------------------------------------- */
/*                               Detail Section                               */
/* -------------------------------------------------------------------------- */

interface DetailSectionProps {
    title: string;
    description?: string;
    icon: React.ElementType;
    children: React.ReactNode;
    muted?: boolean;
}

const DetailSection = ({
    title,
    description,
    icon: Icon,
    children,
    muted = false,
}: DetailSectionProps) => {
    return (
        <section
            className={cn(
                "overflow-hidden rounded-xl border bg-card",
                muted && "bg-muted/20"
            )}
        >
            <div className="flex items-start gap-3 border-b px-4 py-3.5 sm:px-5">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                    <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                    <h3 className="text-sm font-semibold leading-5">
                        {title}
                    </h3>

                    {description && (
                        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            <div className="p-4 sm:p-5">
                {children}
            </div>
        </section>
    );
};

/* -------------------------------------------------------------------------- */
/*                                Detail Grid                                 */
/* -------------------------------------------------------------------------- */

const DetailGrid = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {children}
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*                                Detail Item                                 */
/* -------------------------------------------------------------------------- */

interface DetailItemProps {
    label: string;
    value?: string | null;
    icon?: React.ElementType;
}

const DetailItem = ({
    label,
    value,
    icon: Icon,
}: DetailItemProps) => {
    return (
        <div className="min-w-0">
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-muted-foreground">
                {label}
            </p>

            <div className="flex items-start gap-2">
                {Icon && (
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                )}

                <p className="min-w-0 wrap-break-word text-sm font-medium leading-5 text-foreground">
                    {value || "N/A"}
                </p>
            </div>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*                              Status Detail Item                            */
/* -------------------------------------------------------------------------- */

interface StatusDetailItemProps {
    label: string;
    value: string;
    active: boolean;
}

const StatusDetailItem = ({
    label,
    value,
    active,
}: StatusDetailItemProps) => {
    return (
        <div className="min-w-0">
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-muted-foreground">
                {label}
            </p>

            <div className="flex items-center gap-2">
                <span
                    className={cn(
                        "h-2 w-2 rounded-full",
                        active
                            ? "bg-emerald-500"
                            : "bg-muted-foreground/50"
                    )}
                />

                <span className="text-sm font-medium">
                    {value}
                </span>
            </div>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*                               Social Link Item                             */
/* -------------------------------------------------------------------------- */

const LinkDetailItem = ({
    label,
    value,
}: DetailItemProps) => {
    if (!value) {
        return (
            <div className="rounded-lg border bg-muted/20 p-3.5">
                <p className="text-xs font-medium text-muted-foreground">
                    {label}
                </p>

                <p className="mt-1 text-sm font-medium">
                    N/A
                </p>
            </div>
        );
    }

    return (
        <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="
                group flex min-w-0 items-center justify-between gap-3
                rounded-lg border bg-background p-3.5
                transition-all duration-200
                hover:border-primary/30 hover:bg-muted/30
                hover:shadow-sm
            "
        >
            <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                    {label}
                </p>

                <p className="mt-1 truncate text-sm font-medium text-foreground">
                    {value}
                </p>
            </div>

            <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
        </a>
    );
};