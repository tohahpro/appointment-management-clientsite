"use client";

import type { ReactNode } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

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
  Award,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Clock3,
  GraduationCap,
  IdCard,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Stethoscope,
  UserRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { IDoctor } from "../../../../../types/doctor.interface";
import Image from "next/image";

// -------------------- Types --------------------

interface IDoctorViewDialogProps {
  open: boolean;
  onClose: () => void;
  doctor: IDoctor | null;
}

interface DetailItemProps {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  className?: string;
}

interface SectionCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
}

// -------------------- Detail Item --------------------

const DetailItem = ({
  icon: Icon,
  label,
  value,
  className = "",
}: DetailItemProps) => {
  return (
    <div
      className={`group flex min-w-0 items-start gap-3 rounded-xl p-3 transition-colors hover:bg-slate-50 ${className}`}
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-500 transition-colors group-hover:border-blue-100 group-hover:bg-blue-50 group-hover:text-blue-600">
        <Icon className="size-4.5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="mb-1 text-xs font-medium text-slate-400">
          {label}
        </p>

        <div className="wrap-break-word text-sm font-semibold leading-relaxed text-slate-800">
          {value}
        </div>
      </div>
    </div>
  );
};

// -------------------- Section Card --------------------

const SectionCard = ({
  icon: Icon,
  title,
  description,
  children,
}: SectionCardProps) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon className="size-5" />
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {title}
          </h3>

          {description && (
            <p className="mt-0.5 text-xs text-slate-400">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="p-2 sm:p-3">
        {children}
      </div>
    </section>
  );
};

// -------------------- Main Component --------------------

const DoctorViewDetailDialog = ({
  open,
  onClose,
  doctor,
}: IDoctorViewDialogProps) => {
  if (!doctor) return null;

  const status = doctor.user?.status;

  const isVerified = status === "ACTIVE";
  const isPending = status === "INACTIVE";

  const verificationText = isVerified
    ? "Verified Doctor"
    : isPending
      ? "Pending Verification"
      : status || "Status Unknown";

  const verificationStyle = isVerified
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : isPending
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-slate-200 bg-slate-100 text-slate-700";

  const specialties = doctor.doctorSpecialties ?? [];

  const gender = doctor.gender
    ? doctor.gender.charAt(0) +
    doctor.gender.slice(1).toLowerCase()
    : "Not specified";

  const rating = doctor.averageRating ?? 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent
        className="
          flex max-h-[92dvh] w-full max-w-[calc(100vw-1rem)]
          flex-col gap-0 overflow-hidden rounded-2xl
          border border-slate-200 bg-[#F8FAFC]
          p-0 shadow-2xl
          sm:max-w-5xl sm:rounded-3xl
        "
      >
        {/* ================= PROFILE HEADER ================= */}

        <div className="relative shrink-0 overflow-hidden bg-linear-to-br from-[#0F2747] via-[#174477] to-[#2563EB]">

          {/* Decorative Elements */}

          <div className="pointer-events-none absolute -right-20 -top-24 size-80 rounded-full bg-white/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-28 left-1/3 size-72 rounded-full bg-sky-400/20 blur-3xl" />

          <div className="relative px-5 pb-7 pt-6 sm:px-8 sm:pt-7">
            {/* Doctor Profile */}

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

              {/* Avatar */}

              <div className="relative mx-auto shrink-0 sm:mx-0">
                <Avatar className="rounded shadow-xl sm:size-28 md:size-44">
                  {doctor.profilePhoto && (
                    <Image
                      src={doctor.profilePhoto}
                      alt={doctor.name}
                      className="object-cover"
                      fill
                    />
                  )}

                  <AvatarFallback className="bg-blue-100 text-3xl font-bold text-blue-700">
                    {getInitials(doctor.name)}
                  </AvatarFallback>
                </Avatar>

                {isVerified && !doctor.isDeleted && (
                  <div className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border-4 border-[#174477] bg-emerald-500 text-white shadow-lg">
                    <BadgeCheck className="size-4" />
                  </div>
                )}
              </div>

              {/* Name & Information */}

              <div className="min-w-0 flex-1 text-center sm:text-left">
                <h2 className="mb-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {doctor.name}
                </h2>

                <p className="mb-2 text-sm font-medium text-blue-100">
                  {doctor.designation || "Medical Professional"}
                </p>

                <div className="mb-4 flex items-center justify-center gap-2 text-sm text-blue-100/80 sm:justify-start">
                  <Building2 className="size-4 shrink-0" />

                  <span className="wrap-break-word">
                    {doctor.currentWorkingPlace || "Not specified"}
                  </span>
                </div>

                {/* Status Badges */}

                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">

                  <Badge
                    variant="outline"
                    className={`gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${verificationStyle}`}
                  >
                    {isVerified ? (
                      <BadgeCheck className="size-3.5" />
                    ) : (
                      <Clock3 className="size-3.5" />
                    )}

                    {verificationText}
                  </Badge>

                  {doctor.isDeleted && (
                    <Badge
                      variant="destructive"
                      className="rounded-lg px-3 py-1.5 text-xs"
                    >
                      Deleted
                    </Badge>
                  )}

                  <Badge
                    variant="outline"
                    className="gap-1.5 rounded-lg border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white"
                  >
                    <IdCard className="size-3.5" />
                    {doctor.registrationNumber}
                  </Badge>
                </div>
              </div>

              {/* Rating Highlight */}
              {/* 
              <div className="flex w-full justify-center sm:w-auto">
                <div className="flex min-w-36 flex-col items-center rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-center shadow-lg backdrop-blur-md">
                  <div className="mb-1 flex items-center gap-2">
                    <Star className="size-5 fill-amber-400 text-amber-400" />

                    <span className="text-3xl font-bold text-white">
                      {rating.toFixed(1)}
                    </span>
                  </div>

                  <div className="mb-2 flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`size-3 ${index < Math.round(rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-white/30"
                          }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs font-medium text-blue-100">
                    Average Rating
                  </p>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* ================= SCROLLABLE BODY ================= */}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-7 sm:py-6">

          {/* Quick Statistics */}

          <div className="mb-5 grid grid-cols-2 gap-3">

            {/* Experience */}

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Award className="size-5" />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">
                  Experience
                </p>

                <p className="text-lg font-bold text-slate-900">
                  {doctor.experience}{" "}
                  <span className="text-xs font-medium text-slate-500">
                    {doctor.experience === 1 ? "Year" : "Years"}
                  </span>
                </p>
              </div>
            </div>

            {/* Appointment Fee */}

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Wallet className="size-5" />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">
                  Appointment Fee
                </p>

                <p className="text-lg font-bold text-slate-900">
                  ${doctor.appointmentFee.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}

          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1.4fr_1fr]">

            {/* ================= LEFT COLUMN ================= */}

            <div className="space-y-5">

              {/* Professional Information */}

              <SectionCard
                icon={Stethoscope}
                title="Professional Information"
                description="Medical qualifications and career details"
              >
                <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">

                  <DetailItem
                    icon={BriefcaseBusiness}
                    label="Designation"
                    value={doctor.designation || "Not specified"}
                  />

                  <DetailItem
                    icon={GraduationCap}
                    label="Qualification"
                    value={doctor.qualification || "Not specified"}
                  />

                  <DetailItem
                    icon={IdCard}
                    label="Registration Number"
                    value={doctor.registrationNumber || "Not specified"}
                  />

                  <DetailItem
                    icon={Award}
                    label="Experience"
                    value={`${doctor.experience} ${doctor.experience === 1 ? "Year" : "Years"
                      }`}
                  />

                  <DetailItem
                    icon={Building2}
                    label="Current Working Place"
                    value={
                      doctor.currentWorkingPlace || "Not specified"
                    }
                    className="sm:col-span-2"
                  />
                </div>
              </SectionCard>

              {/* Contact Information */}

              <SectionCard
                icon={Phone}
                title="Contact Information"
                description="Contact and location details"
              >
                <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">

                  <DetailItem
                    icon={Phone}
                    label="Contact Number"
                    value={
                      doctor.contactNumber ? (
                        <a
                          href={`tel:${doctor.contactNumber}`}
                          className="transition-colors hover:text-blue-600"
                        >
                          {doctor.contactNumber}
                        </a>
                      ) : (
                        "Not provided"
                      )
                    }
                  />

                  <DetailItem
                    icon={Mail}
                    label="Email Address"
                    value={
                      doctor.email ? (
                        <a
                          href={`mailto:${doctor.email}`}
                          className="break-all transition-colors hover:text-blue-600"
                        >
                          {doctor.email}
                        </a>
                      ) : (
                        "Not provided"
                      )
                    }
                  />

                  <DetailItem
                    icon={MapPin}
                    label="Address"
                    value={doctor.address || "Not provided"}
                    className="sm:col-span-2"
                  />
                </div>
              </SectionCard>
            </div>

            {/* ================= RIGHT COLUMN ================= */}

            <div className="space-y-5">

              {/* Medical Specialties */}

              <SectionCard
                icon={Stethoscope}
                title="Medical Specialties"
                description="Areas of medical expertise"
              >
                {specialties.length > 0 ? (
                  <div className="flex flex-wrap gap-2 p-3">
                    {specialties.map((specialty) => (
                      <Badge
                        key={specialty.id}
                        variant="outline"
                        className="gap-1.5 rounded-xl border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700"
                      >
                        <BadgeCheck className="size-3.5" />

                        {specialty.specialities.title}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="p-3 text-sm text-slate-400">
                    No specialties added yet.
                  </p>
                )}
              </SectionCard>

              {/* Personal Information */}

              <SectionCard
                icon={UserRound}
                title="Personal Information"
                description="Basic profile and account details"
              >
                <div className="space-y-1">

                  <DetailItem
                    icon={UserRound}
                    label="Gender"
                    value={gender}
                  />

                  <DetailItem
                    icon={CalendarDays}
                    label="Joined On"
                    value={formatDateTime(doctor.createdAt)}
                  />

                  <DetailItem
                    icon={Clock3}
                    label="Last Updated"
                    value={formatDateTime(doctor.updatedAt)}
                  />
                </div>
              </SectionCard>

              {/* Verification Information */}

              <div
                className={`rounded-2xl border p-5 ${isVerified
                  ? "border-emerald-200 bg-emerald-50"
                  : isPending
                    ? "border-amber-200 bg-amber-50"
                    : "border-slate-200 bg-slate-100"
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${isVerified
                      ? "bg-emerald-100 text-emerald-600"
                      : isPending
                        ? "bg-amber-100 text-amber-600"
                        : "bg-slate-200 text-slate-600"
                      }`}
                  >
                    {isVerified ? (
                      <ShieldCheck className="size-5" />
                    ) : (
                      <Clock3 className="size-5" />
                    )}
                  </div>

                  <div>
                    <h4
                      className={`text-sm font-bold ${isVerified
                        ? "text-emerald-900"
                        : isPending
                          ? "text-amber-900"
                          : "text-slate-900"
                        }`}
                    >
                      {isVerified
                        ? "Admin Verified"
                        : isPending
                          ? "Verification Pending"
                          : verificationText}
                    </h4>

                    <p
                      className={`mt-1 text-xs leading-relaxed ${isVerified
                        ? "text-emerald-700"
                        : isPending
                          ? "text-amber-700"
                          : "text-slate-600"
                        }`}
                    >
                      {isVerified
                        ? "This doctor's profile has been verified and approved by the administration."
                        : isPending
                          ? "This doctor's profile is waiting for verification and approval from the administration."
                          : "Check this doctor's account status in the administration panel."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= FOOTER ================= */}

        <DialogFooter className="shrink-0 flex-row items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-7">
          <p className="hidden text-xs font-medium text-slate-400 sm:block">
            Doctor Profile Information
          </p>

          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="ml-auto min-w-28 rounded-xl border-slate-200 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorViewDetailDialog;