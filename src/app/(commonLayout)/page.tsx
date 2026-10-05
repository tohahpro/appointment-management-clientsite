"use client";

import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    BadgeCheck,
    CalendarDays,
    Check,
    ChevronDown,
    Clock3,
    HeartPulse,
    Laptop,
    LockKeyhole,
    MessageSquareText,
    MonitorSmartphone,
    Search,
    ShieldCheck,
    Sparkles,
    Star,
    Stethoscope,
    UserRound,
    UsersRound,
    Video,
    WalletCards,
} from "lucide-react";


/*                                   DATA                                     */


const specialties = [
    {
        title: "Cardiology",
        description: "Heart health, blood pressure and cardiovascular care.",
        icon: HeartPulse,
        doctors: "42 Doctors",
    },
    {
        title: "Neurology",
        description: "Expert care for brain, spine and nervous system conditions.",
        icon: Sparkles,
        doctors: "28 Doctors",
    },
    {
        title: "Dermatology",
        description: "Professional treatment for skin, hair and nail concerns.",
        icon: ShieldCheck,
        doctors: "34 Doctors",
    },
    {
        title: "Pediatrics",
        description: "Specialized healthcare for infants, children and teenagers.",
        icon: UsersRound,
        doctors: "51 Doctors",
    },
    {
        title: "Orthopedics",
        description: "Bone, joint, muscle and movement related treatment.",
        icon: UserRound,
        doctors: "31 Doctors",
    },
    {
        title: "Gynecology",
        description: "Trusted women's health and reproductive care services.",
        icon: HeartPulse,
        doctors: "25 Doctors",
    },
    {
        title: "Dentistry",
        description: "Complete oral, dental and preventive healthcare solutions.",
        icon: Sparkles,
        doctors: "38 Doctors",
    },
    {
        title: "General Medicine",
        description: "Primary medical care for common illnesses and conditions.",
        icon: Stethoscope,
        doctors: "64 Doctors",
    },
];

const appointmentSteps = [
    {
        number: "01",
        title: "Find a Doctor",
        description:
            "Search and select a trusted doctor based on specialty and experience.",
        icon: Search,
    },
    {
        number: "02",
        title: "Choose a Time",
        description:
            "Pick an available date and consultation time that works for you.",
        icon: CalendarDays,
    },
    {
        number: "03",
        title: "Book Your Appointment",
        description:
            "Confirm your appointment and connect with your doctor online.",
        icon: BadgeCheck,
    },
];

const features = [
    {
        title: "Easy Doctor Search",
        description:
            "Find experienced doctors quickly by specialty, experience and availability.",
        icon: Search,
    },
    {
        title: "Verified Doctor Profiles",
        description:
            "View doctor qualifications, expertise and professional information.",
        icon: BadgeCheck,
    },
    {
        title: "Real-Time Availability",
        description:
            "Choose from available appointment slots without unnecessary waiting.",
        icon: Clock3,
    },
    {
        title: "Easy Appointment Booking",
        description:
            "Book your consultation using a simple and straightforward process.",
        icon: CalendarDays,
    },
    {
        title: "Appointment Management",
        description:
            "View, reschedule and manage your upcoming consultations in one place.",
        icon: Laptop,
    },
    {
        title: "Secure Online Payment",
        description:
            "Complete your appointment payment through a safe checkout experience.",
        icon: LockKeyhole,
    },
];

const doctorBenefits = [
    "Create and manage your professional doctor profile",
    "Set your own consultation schedules and availability",
    "Receive and manage patient appointments",
    "Consult patients through secure online sessions",
    "Maintain appointment and consultation history",
];

const consultationFeatures = [
    {
        title: "HD Video Consultation",
        description: "Connect with your doctor through a smooth online experience.",
        icon: Video,
    },
    {
        title: "Virtual Waiting Room",
        description: "Join your scheduled consultation from anywhere.",
        icon: MonitorSmartphone,
    },
    {
        title: "Secure Digital Prescription",
        description: "Access prescription information after your consultation.",
        icon: ShieldCheck,
    },
    {
        title: "Easy Payment",
        description: "Pay consultation fees securely before your appointment.",
        icon: WalletCards,
    },
];

const testimonials = [
    {
        name: "Farhan Ahmed",
        role: "Verified Patient",
        quote:
            "Booking a specialist was simple and fast. I found the right doctor and completed my consultation without leaving home.",
    },
    {
        name: "Nusrat Jahan",
        role: "Verified Patient",
        quote:
            "The appointment process was clear and convenient. Everything from selecting a doctor to consultation was easy.",
    },
    {
        name: "Shafiq Hasan",
        role: "Verified Patient",
        quote:
            "A very smooth platform for online doctor appointments. The dashboard and consultation process were straightforward.",
    },
];

const faqs = [
    {
        question: "How do I book an appointment?",
        answer:
            "Search for a doctor, open the doctor's profile, choose an available appointment slot and complete the booking process.",
    },
    {
        question: "Can I reschedule my appointment?",
        answer:
            "Yes. Eligible appointments can be rescheduled from your patient dashboard based on the doctor's available schedule.",
    },
    {
        question: "Can I cancel an appointment?",
        answer:
            "Yes. You can cancel an eligible upcoming appointment from your dashboard.",
    },
    {
        question: "How do online consultations work?",
        answer:
            "After booking your appointment, you can access the consultation information from your dashboard and join at the scheduled time.",
    },
    {
        question: "How can I find doctors by specialization?",
        answer:
            "Use the specialty section or doctor search filters to browse doctors according to their medical specialization.",
    },
    {
        question: "Can I see my appointment history?",
        answer:
            "Yes. Your patient dashboard keeps your upcoming, completed and previous appointment information organized.",
    },
];


/*                            REUSABLE COMPONENTS                              */


function SectionHeading({
    eyebrow,
    title,
    description,
}: {
    eyebrow: string;
    title: string;
    description?: string;
}) {
    return (
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                <Sparkles className="size-3" />
                {eyebrow}
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
                {title}
            </h2>

            {description && (
                <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                    {description}
                </p>
            )}
        </div>
    );
}

function PrimaryButton({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
            {children}
        </Link>
    );
}

function SecondaryButton({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
            {children}
        </Link>
    );
}


/*                                HOME PAGE                                   */


export default function HomePage() {
    return (
        <main className="overflow-hidden bg-white text-slate-950">
            {/* HERO SECTION */}

            <section className="border-b border-slate-100">
                <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
                    {/* Hero Content */}
                    <div>
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                            <ShieldCheck className="size-4" />
                            Safe and convenient online healthcare
                        </div>

                        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                            Book a Doctor Online.
                            <span className="mt-2 block text-blue-600">
                                Consult from Anywhere with Confidence.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 lg:text-lg">
                            Connect with qualified medical professionals through a simple
                            online healthcare experience. Find doctors, select an available
                            time and manage your appointments from one place.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <PrimaryButton href="/doctors">
                                <Search className="size-4" />
                                Find a Doctor
                            </PrimaryButton>

                            <SecondaryButton href="/how-it-works">
                                <Video className="size-4" />
                                How It Works
                            </SecondaryButton>
                        </div>

                        {/* Hero Stats */}
                        <div className="mt-10 grid max-w-xl grid-cols-3 divide-x divide-slate-200 border-t border-slate-200 pt-6">
                            <div className="pr-4">
                                <p className="text-xl font-bold text-slate-950 sm:text-2xl">
                                    500+
                                </p>
                                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                                    Doctors
                                </p>
                            </div>

                            <div className="px-4">
                                <p className="text-xl font-bold text-slate-950 sm:text-2xl">
                                    100%
                                </p>
                                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                                    Online
                                </p>
                            </div>

                            <div className="pl-4">
                                <p className="text-xl font-bold text-slate-950 sm:text-2xl">
                                    Secure
                                </p>
                                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                                    Healthcare
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Hero Visual */}
                    <div className="relative mx-auto w-full max-w-xl">
                        <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200">
                            <div className="overflow-hidden rounded-2xl bg-slate-100">
                                <Image
                                    src="/images/doctor-consultation.jpg"
                                    alt="Doctor providing an online consultation"
                                    width={900}
                                    height={700}
                                    priority
                                    className="aspect-video w-full object-cover"
                                />
                            </div>

                            <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                        <Stethoscope className="size-5" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-900">
                                            Dr. Sarah Ahmed
                                        </p>
                                        <p className="truncate text-xs text-slate-500">
                                            General Medicine
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                    <span className="size-2 rounded-full bg-emerald-500" />
                                    Available
                                </div>
                            </div>
                        </div>

                        {/* Floating Appointment Card */}
                        <div className="absolute -bottom-5 left-4 rounded-xl border border-slate-200 bg-white p-4 shadow-lg sm:left-8">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                    <CalendarDays className="size-5" />
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">Next appointment</p>
                                    <p className="text-sm font-semibold text-slate-900">
                                        Today, 4:30 PM
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

            {/* SPECIALTIES SECTION */}

            <section className="bg-slate-50 py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading
                        eyebrow="Medical Specialties"
                        title="Browse by Specialty"
                        description="Find the right doctor based on the care and expertise you need."
                    />

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {specialties.map((specialty, index) => {
                            const Icon = specialty.icon;

                            return (
                                <div
                                    key={index}
                                    className={`group rounded-xl border bg-white p-5 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg ${index === 0
                                        ? "border-blue-500 shadow-sm"
                                        : "border-slate-200"
                                        }`}
                                >
                                    <div className="mb-5 flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                                        <Icon className="size-5" />
                                    </div>

                                    <h3 className="text-base font-semibold text-slate-900">
                                        {specialty.title}
                                    </h3>

                                    <p className="mt-2 min-h-12 text-sm leading-5 text-slate-500">
                                        {specialty.description}
                                    </p>

                                    {/* <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                                        <span className="text-xs font-medium text-slate-500">
                                            {specialty.doctors}
                                        </span>

                                        <ArrowRight className="size-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
                                    </div> */}
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 text-center">
                        <SecondaryButton href="/doctors">
                            View All Specialties
                            <ArrowRight className="size-4" />
                        </SecondaryButton>
                    </div>
                </div>
            </section>

            {/* APPOINTMENT STEPS SECTION */}

            <section className="border-y border-slate-100 bg-white py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading
                        eyebrow="Simple Process"
                        title="Book an Appointment in 3 Simple Steps"
                        description="Getting medical advice online should be simple, clear and convenient."
                    />

                    <div className="grid gap-5 md:grid-cols-3">
                        {appointmentSteps.map((step) => {
                            const Icon = step.icon;

                            return (
                                <div
                                    key={step.title}
                                    className="relative rounded-2xl border border-slate-200 bg-white p-7 text-center transition hover:border-blue-200 hover:shadow-lg"
                                >
                                    <div className="absolute right-5 top-5 text-sm font-bold text-slate-200">
                                        {step.number}
                                    </div>

                                    <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <Icon className="size-5" />
                                    </div>

                                    <h3 className="text-lg font-semibold text-slate-900">
                                        {step.title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-6 text-slate-500">
                                        {step.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* HEALTHCARE FEATURES SECTION */}

            <section className="bg-slate-50 py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading
                        eyebrow="Built for Everyone"
                        title="Healthcare Made Simple"
                        description="Everything you need to find doctors, book consultations and manage your healthcare online."
                    />

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <div
                                    key={feature.title}
                                    className="rounded-xl border border-slate-200 bg-white p-6 transition hover:border-blue-200 hover:shadow-md"
                                >
                                    <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                        <Icon className="size-5" />
                                    </div>

                                    <h3 className="font-semibold text-slate-900">
                                        {feature.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* DOCTOR REGISTRATION SECTION */}

            <section className="bg-slate-950 py-16 text-white lg:py-20">
                <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold text-blue-300">
                            <Stethoscope className="size-3.5" />
                            For Healthcare Professionals
                        </div>

                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Are You a Doctor?
                        </h2>

                        <p className="mt-4 max-w-xl leading-7 text-slate-400">
                            Join our healthcare platform and make your medical services more
                            accessible to patients while managing appointments online.
                        </p>

                        <div className="mt-7 space-y-3">
                            {doctorBenefits.map((benefit) => (
                                <div key={benefit} className="flex items-start gap-3">
                                    <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                                        <Check className="size-3.5" />
                                    </div>

                                    <p className="text-sm leading-6 text-slate-300">{benefit}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/register/doctor"
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500"
                            >
                                Register as a Doctor
                                <ArrowRight className="size-4" />
                            </Link>

                            <Link
                                href="/doctor-info"
                                className="inline-flex h-11 items-center justify-center px-3 text-sm font-medium text-slate-300 transition hover:text-white"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-3">
                        <Image
                            src="/images/doctor-consultation.jpg"
                            alt="Doctor consulting with patient online"
                            width={900}
                            height={700}
                            className="aspect-video w-full rounded-xl object-cover"
                        />

                        <div className="p-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        Manage your consultations
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Appointments, patients and schedules in one place.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-emerald-400">
                                    <span className="size-2 rounded-full bg-emerald-400" />
                                    Online
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* TESTIMONIAL SECTION */}

            <section className="border-y border-slate-100 bg-slate-50 py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading
                        eyebrow="Patient Reviews"
                        title="Trusted by Thousands of Patients"
                        description="See what patients say about their healthcare experience."
                    />

                    <div className="grid gap-5 lg:grid-cols-3">
                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial.name}
                                className="rounded-2xl border border-slate-200 bg-white p-6"
                            >
                                <div className="flex items-center gap-1 text-amber-400">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <Star key={index} className="size-4 fill-current" />
                                    ))}
                                </div>

                                <p className="mt-5 text-sm leading-6 text-slate-600">
                                    “{testimonial.quote}”
                                </p>

                                <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                                    <div className="flex size-10 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                                        {testimonial.name.charAt(0)}
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {testimonial.name}
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            {testimonial.role}
                                        </p>
                                    </div>

                                    <span className="ml-auto rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                        Verified
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}

            <section className="bg-white py-16 lg:py-20">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading
                        eyebrow="Got Questions?"
                        title="Frequently Asked Questions"
                        description="Find answers to common questions about appointments and online consultations."
                    />

                    <div className="space-y-3">
                        {faqs.map((faq) => (
                            <details
                                key={faq.question}
                                className="group rounded-xl border border-slate-200 bg-white transition open:border-blue-200 open:shadow-sm"
                            >
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 p-5">
                                    <span className="text-sm font-semibold text-slate-900 sm:text-base">
                                        {faq.question}
                                    </span>

                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition group-open:rotate-180 group-open:bg-blue-50 group-open:text-blue-600">
                                        <ChevronDown className="size-4" />
                                    </div>
                                </summary>

                                <div className="px-5 pb-5">
                                    <p className="border-t border-slate-100 pt-4 text-sm leading-6 text-slate-500">
                                        {faq.answer}
                                    </p>
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA SECTION */}

            <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                <div className="mx-auto max-w-5xl rounded-3xl bg-slate-950 px-6 py-12 text-center text-white shadow-xl sm:px-10 sm:py-14">
                    <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-xl bg-blue-600">
                        <HeartPulse className="size-6" />
                    </div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                        Start Your Healthcare Journey
                    </p>

                    <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                        Your Healthcare Journey Starts Here
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                        Find the right doctor, choose a convenient appointment and manage
                        your healthcare online with confidence.
                    </p>

                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                        <Link
                            href="/doctors"
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500"
                        >
                            <Search className="size-4" />
                            Find a Doctor
                        </Link>

                        <Link
                            href="/register"
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                        >
                            <UserRound className="size-4" />
                            Create Account
                        </Link>
                    </div>

                    <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-slate-800 pt-6 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                            <ShieldCheck className="size-3.5 text-emerald-400" />
                            Secure Platform
                        </span>

                        <span className="flex items-center gap-1.5">
                            <BadgeCheck className="size-3.5 text-emerald-400" />
                            Verified Doctors
                        </span>

                        <span className="flex items-center gap-1.5">
                            <Video className="size-3.5 text-emerald-400" />
                            Online Consultation
                        </span>
                    </div>
                </div>
            </section>
        </main>
    );
}