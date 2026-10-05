"use client";

import Image from "next/image";
import {
    CalendarDays,
    CircleDollarSign,
    GalleryHorizontal,
    HandCoins,
    ImageIcon,
    Target,
    Users,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { IIslamicGiving } from "../../../../../types/islamicGiving.interface";


interface IslamicGivingViewDetailDialogProps {
    open: boolean;
    onClose: () => void;
    islamicGiving: IIslamicGiving | null;
}

const formatCurrency = (amount?: number | null) => {
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount ?? 0);
};

const formatDate = (date?: string | null) => {
    if (!date) return "Not set";

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
};

const IslamicGivingViewDetailDialog = ({
    open,
    onClose,
    islamicGiving,
}: IslamicGivingViewDetailDialogProps) => {
    if (!islamicGiving) return null;

    const donationForm = islamicGiving.donationForms;

    const expectedAmount = donationForm?.expectedAmount ?? 0;
    const raisedAmount = donationForm?.totalDonarAmount ?? 0;
    const totalDonors = donationForm?.totalDonar ?? 0;

    const progress =
        expectedAmount > 0
            ? Math.min((raisedAmount / expectedAmount) * 100, 100)
            : 0;

    const sortedImages = [...(islamicGiving.islamicGivingImages ?? [])].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );

    const donationOptions = [...(donationForm?.donationAmountOptions ?? [])]
        .filter((option) => option.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder);

    return (
        <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
            <DialogContent className="max-h-[92vh] overflow-y-auto p-0 sm:max-w-4xl">
                {/* Hero */}
                <div className="relative h-56 w-full overflow-hidden rounded-t-lg bg-muted sm:h-72">
                    {islamicGiving.image ? (
                        <>
                            <Image
                                src={islamicGiving.image}
                                alt={islamicGiving.title}
                                fill
                                priority
                                className="object-cover"
                            />

                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                                <Badge
                                    variant="secondary"
                                    className="mb-3 border-white/20 bg-white/15 text-white backdrop-blur-md hover:bg-white/15"
                                >
                                    {islamicGiving.pageName}
                                </Badge>

                                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                    {islamicGiving.title}
                                </h2>
                            </div>
                        </>
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                            <ImageIcon className="h-10 w-10" />
                            <span className="text-sm">No featured image</span>
                        </div>
                    )}
                </div>

                <div className="space-y-8 p-6">
                    <DialogHeader className="sr-only">
                        <DialogTitle>{islamicGiving.title}</DialogTitle>
                        <DialogDescription>
                            View Islamic Giving information and donation details.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Basic information */}
                    <section>
                        <div className="mb-4">
                            <h3 className="text-base font-semibold">
                                Page Information
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Basic information about this Islamic Giving page.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <InfoCard
                                label="Page Name"
                                value={islamicGiving.pageName}
                            />

                            <InfoCard
                                label="Title"
                                value={islamicGiving.title}
                            />

                            <InfoCard
                                label="Created"
                                value={formatDate(islamicGiving.createdAt)}
                            />

                            <InfoCard
                                label="Last Updated"
                                value={formatDate(islamicGiving.updatedAt)}
                            />
                        </div>
                    </section>

                    <Separator />

                    {/* Donation form */}
                    <section>
                        <div className="mb-4">
                            <h3 className="text-base font-semibold">
                                Donation Overview
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Current fundraising performance and donation configuration.
                            </p>
                        </div>

                        {!donationForm ? (
                            <div className="rounded-xl border border-dashed p-8 text-center">
                                <HandCoins className="mx-auto mb-3 h-9 w-9 text-muted-foreground" />
                                <p className="font-medium">
                                    No donation form connected
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    This Islamic Giving page does not currently have a donation
                                    form.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {/* Stats */}
                                <div className="grid gap-3 sm:grid-cols-3">
                                    <StatCard
                                        icon={Target}
                                        label="Target"
                                        value={formatCurrency(expectedAmount)}
                                    />

                                    <StatCard
                                        icon={CircleDollarSign}
                                        label="Raised"
                                        value={formatCurrency(raisedAmount)}
                                    />

                                    <StatCard
                                        icon={Users}
                                        label="Donors"
                                        value={totalDonors.toLocaleString("en-GB")}
                                    />
                                </div>

                                {/* Progress */}
                                {expectedAmount > 0 && (
                                    <div className="rounded-xl border bg-card p-5">
                                        <div className="mb-3 flex items-center justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Fundraising Progress
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatCurrency(raisedAmount)} raised of{" "}
                                                    {formatCurrency(expectedAmount)}
                                                </p>
                                            </div>

                                            <span className="text-sm font-semibold">
                                                {progress.toFixed(1)}%
                                            </span>
                                        </div>

                                        <Progress value={progress} className="h-2.5" />
                                    </div>
                                )}

                                {/* Form details */}
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <InfoCard
                                        label="Donation Form Title"
                                        value={donationForm.title}
                                    />

                                    <InfoCard
                                        label="Donation End"
                                        value={formatDate(donationForm.donationEnd)}
                                        icon={CalendarDays}
                                    />
                                </div>

                                {donationForm.context && (
                                    <div className="rounded-xl border bg-muted/30 p-5">
                                        <p className="mb-2 text-sm font-semibold">
                                            Donation Context
                                        </p>

                                        <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
                                            {donationForm.context}
                                        </p>
                                    </div>
                                )}

                                {/* Donation options */}
                                <div>
                                    <div className="mb-3 flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-semibold">
                                                Donation Options
                                            </h4>
                                            <p className="text-xs text-muted-foreground">
                                                Active predefined or custom donation choices.
                                            </p>
                                        </div>

                                        <Badge variant="outline">
                                            {donationOptions.length} option
                                            {donationOptions.length !== 1 ? "s" : ""}
                                        </Badge>
                                    </div>

                                    {donationOptions.length === 0 ? (
                                        <div className="rounded-xl border border-dashed p-5 text-center text-sm text-muted-foreground">
                                            No active donation options
                                        </div>
                                    ) : (
                                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                            {donationOptions.map((option) => (
                                                <div
                                                    key={option.id}
                                                    className="rounded-xl border bg-card p-4"
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-semibold">
                                                                {option.title ||
                                                                    (option.isCustom
                                                                        ? "Custom Amount"
                                                                        : "Donation")}
                                                            </p>

                                                            <p className="mt-1 text-lg font-bold">
                                                                {option.isCustom
                                                                    ? "Custom"
                                                                    : formatCurrency(option.amount)}
                                                            </p>
                                                        </div>

                                                        {option.isCustom && (
                                                            <Badge variant="secondary">
                                                                Custom
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </section>

                    <Separator />

                    {/* Gallery */}
                    <section>
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <div>
                                <h3 className="flex items-center gap-2 text-base font-semibold">
                                    <GalleryHorizontal className="h-4 w-4" />
                                    Gallery
                                </h3>

                                <p className="text-sm text-muted-foreground">
                                    Images associated with this Islamic Giving page.
                                </p>
                            </div>

                            <Badge variant="outline">
                                {sortedImages.length} image
                                {sortedImages.length !== 1 ? "s" : ""}
                            </Badge>
                        </div>

                        {sortedImages.length === 0 ? (
                            <div className="rounded-xl border border-dashed p-8 text-center">
                                <ImageIcon className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    No gallery images available.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {sortedImages.map((galleryImage, index) => (
                                    <div
                                        key={galleryImage.id}
                                        className="group relative aspect-4/3 overflow-hidden rounded-xl border bg-muted"
                                    >
                                        <Image
                                            src={galleryImage.image}
                                            alt={`${islamicGiving.title} image ${index + 1}`}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />

                                        <div className="absolute left-2 top-2">
                                            <Badge className="bg-black/60 text-white hover:bg-black/60">
                                                {galleryImage.order ?? index + 1}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default IslamicGivingViewDetailDialog;

interface InfoCardProps {
    label: string;
    value: string;
    icon?: React.ElementType;
}

const InfoCard = ({
    label,
    value,
    icon: Icon,
}: InfoCardProps) => {
    return (
        <div className="rounded-xl border bg-card p-4">
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {label}
            </div>

            <p className="wrap-break-words text-sm font-semibold">
                {value || "N/A"}
            </p>
        </div>
    );
};

interface StatCardProps {
    icon: React.ElementType;
    label: string;
    value: string;
}

const StatCard = ({
    icon: Icon,
    label,
    value,
}: StatCardProps) => {
    return (
        <div className="rounded-xl border bg-card p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-4 w-4" />
            </div>

            <p className="text-xs font-medium text-muted-foreground">
                {label}
            </p>

            <p className="mt-1 text-xl font-bold tracking-tight">
                {value}
            </p>
        </div>
    );
};