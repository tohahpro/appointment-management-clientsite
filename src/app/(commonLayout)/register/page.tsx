"use client";

import Link from "next/link";
import type { StaticImageData } from "next/image";
import {
    ArrowRight,
    BadgeCheck,
    CalendarDays,
    Check,
    Clock3,
    ShieldCheck,
    Stethoscope,
    UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import doctorImage from "../../../assets/Images/doctor-registration.png";
import patientImage from "../../../assets/Images/patient-registration.png";

const doctorFeatures = [
    "Official medical accreditation verification",
    "Manage chamber schedule and appointment slots",
    "Live patient queue and waiting-room access",
    "Automated appointment and patient management",
];

const patientFeatures = [
    "Search doctors by specialty, hospital or fee",
    "Book appointments with verified doctors",
    "Track appointment and queue status",
    "Access prescriptions and appointment history",
];

const benefits = [
    {
        icon: CalendarDays,
        title: "Real-Time Availability",
        description:
            "View available doctor schedules and choose the appointment time that works best for you.",
    },
    {
        icon: Clock3,
        title: "Smarter Queue Management",
        description:
            "Reduce waiting time with digital queues and live appointment status updates.",
    },
    {
        icon: ShieldCheck,
        title: "Verified Doctor Profiles",
        description:
            "Doctor profiles can be reviewed and verified before becoming available to patients.",
    },
];

export default function RegisterPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            <div className="mx-auto w-full max-w-362.5 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                {/* =====================================================
                    HERO
                ===================================================== */}

                <section className="mx-auto max-w-3xl text-center">
                    <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        Tarevia Healthcare Network
                    </span>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                        Join the Tarevia Network
                    </h1>

                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                        Choose how you want to join. Doctors can manage their
                        professional practice while patients can book and manage
                        healthcare appointments with ease.
                    </p>
                </section>

                {/* =====================================================
                    REGISTRATION CARDS
                ===================================================== */}

                <section className="mt-9 grid gap-5 lg:grid-cols-2">
                    {/* Doctor */}

                    <RegistrationCard
                        image={doctorImage}
                        icon={Stethoscope}
                        title="Doctor Registration"
                        description="For certified medical professionals who want to manage appointments, consultation schedules and patient queues."
                        features={doctorFeatures}
                        href="/register/doctor"
                        buttonText="Continue as Doctor"
                        variant="primary"
                    />

                    <RegistrationCard
                        image={patientImage}
                        icon={UserRound}
                        title="Patient Registration"
                        description="For patients and family members who want to find doctors, book appointments and manage their healthcare journey."
                        features={patientFeatures}
                        href="/register/patient"
                        buttonText="Continue as Patient"
                        variant="dark"
                    />
                </section>

                {/* =====================================================
                    NETWORK SECTION
                ===================================================== */}

                <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
                        {/* Image */}

                        <div className="relative min-h-70 overflow-hidden bg-slate-100 lg:min-h-87.5">
                            <img
                                src="/images/healthcare-team.jpg"
                                alt="Healthcare professionals"
                                className="absolute inset-0 h-full w-full object-cover"
                            />

                            <div className="absolute inset-0 bg-linear-to-r from-slate-950/15 to-transparent" />
                        </div>

                        {/* Content */}

                        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10 xl:p-12">
                            <div className="inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">
                                <BadgeCheck className="size-4" />
                                Trusted Healthcare Network
                            </div>

                            <h2 className="mt-4 max-w-2xl text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                                Connecting Doctors and Patients Through One
                                Simple Platform
                            </h2>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                                Tarevia brings verified healthcare providers,
                                appointment booking and patient queue management
                                together in one modern healthcare experience.
                            </p>

                            <div className="mt-7 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3">
                                <MiniFeature
                                    icon={ShieldCheck}
                                    title="Verified Doctors"
                                />

                                <MiniFeature
                                    icon={Clock3}
                                    title="Live Queue Status"
                                />

                                <MiniFeature
                                    icon={UserRound}
                                    title="Simple Patient Access"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    BENEFITS
                ===================================================== */}

                <section className="mt-6 grid gap-4 md:grid-cols-3">
                    {benefits.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.title}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <Icon className="size-5" />
                                </div>

                                <h3 className="mt-4 text-sm font-semibold text-slate-950">
                                    {item.title}
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </section>

                {/* =====================================================
                    SIGN IN
                ===================================================== */}

                <div className="mt-9 text-center text-sm text-slate-500">
                    Already registered with Tarevia?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
                    >
                        Sign in to your account
                    </Link>
                </div>
            </div>
        </main>
    );
}

/* =========================================================
   Registration Card
========================================================= */

function RegistrationCard({
    image,
    icon: Icon,
    title,
    description,
    features,
    href,
    buttonText,
    variant,
}: {
    image: StaticImageData;
    icon: React.ElementType;
    title: string;
    description: string;
    features: string[];
    href: string;
    buttonText: string;
    variant: "primary" | "dark";
}) {
    const buttonClass =
        variant === "primary"
            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"
            : "bg-slate-950 text-white hover:bg-slate-800 shadow-slate-200";

    return (
        <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            {/* Image */}

            <div className="relative h-55 overflow-hidden sm:h-65">
                <img
                    src={image.src}
                    alt={title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent" />

                <div className="absolute left-5 top-5 flex size-11 items-center justify-center rounded-xl border border-white/70 bg-white/90 text-blue-600 shadow-sm backdrop-blur">
                    <Icon className="size-5" />
                </div>
            </div>

            {/* Body */}

            <div className="p-5 sm:p-6">
                <h2 className="text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
                    {title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    {description}
                </p>

                <div className="my-5 h-px bg-slate-100" />

                <div className="space-y-3">
                    {features.map((feature) => (
                        <div
                            key={feature}
                            className="flex items-start gap-2.5"
                        >
                            <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                <Check className="size-3" />
                            </div>

                            <p className="text-sm leading-5 text-slate-600">
                                {feature}
                            </p>
                        </div>
                    ))}
                </div>

                <Button
                    asChild
                    className={`mt-6 h-11 w-full rounded-xl font-semibold shadow-sm ${buttonClass}`}
                >
                    <Link href={href}>
                        {buttonText}
                        <ArrowRight className="ml-1 size-4" />
                    </Link>
                </Button>
            </div>
        </article>
    );
}

/* =========================================================
   Mini Feature
========================================================= */

function MiniFeature({
    icon: Icon,
    title,
}: {
    icon: React.ElementType;
    title: string;
}) {
    return (
        <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Icon className="size-4" />
            </div>

            <span className="text-xs font-semibold text-slate-700 sm:text-sm">
                {title}
            </span>
        </div>
    );
}