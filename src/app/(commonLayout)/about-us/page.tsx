import Image from "next/image";
import Link from "next/link";

import {
    ArrowRight,
    BookOpen,
    BriefcaseBusiness,
    CalendarDays,
    Eye,
    Gift,
    GraduationCap,
    HandHeart,
    Handshake,
    HeartPulse,
    Leaf,
    PackageCheck,
    ShieldCheck,
    Target,
    Truck,
    Users,
    Waves,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SupportCTA from "@/components/shared/Portal/SupportCta";

const stats = [
    {
        icon: Users,
        label: "Communities Reached",
        value: "25+",
        description: "Across the UK & Overseas",
    },
    {
        icon: Gift,
        label: "Projects Delivered",
        value: "120+",
        description: "Education, Relief, Healthcare & More",
    },
    {
        icon: HandHeart,
        label: "Lives Impacted",
        value: "100,000+",
        description: "Individuals & Families",
    },
    {
        icon: CalendarDays,
        label: "Years of Service",
        value: "10+",
        description: "Of Trust & Commitment",
    },
];

const values = [
    {
        icon: HandHeart,
        title: "Compassion",
        description: "We serve with empathy and care for every human life.",
    },
    {
        icon: ShieldCheck,
        title: "Integrity",
        description:
            "We are transparent, honest, and accountable in everything we do.",
    },
    {
        icon: Users,
        title: "Respect",
        description: "We value every individual and community we work with.",
    },
    {
        icon: Handshake,
        title: "Collaboration",
        description:
            "We believe in working together for a greater collective impact.",
    },
    {
        icon: Leaf,
        title: "Sustainability",
        description:
            "We focus on long-term solutions that create lasting change.",
    },
];

const workAreas = [
    {
        title: "Education",
        description:
            "Providing access to quality education for children and young people.",
        image: "/images/about/education.jpg",
        icon: BookOpen,
    },
    {
        title: "Healthcare",
        description:
            "Improving health and well-being through essential medical support.",
        image: "/images/about/healthcare.jpg",
        icon: HeartPulse,
    },
    {
        title: "Emergency Relief",
        description:
            "Delivering urgent aid during natural disasters and humanitarian crises.",
        image: "/images/about/emergency-relief.jpg",
        icon: Truck,
    },
    {
        title: "Water & Sanitation",
        description:
            "Building clean water sources and promoting hygiene for better lives.",
        image: "/images/about/water.jpg",
        icon: Waves,
    },
    {
        title: "Livelihood Support",
        description:
            "Empowering families with skills and resources for sustainable incomes.",
        image: "/images/about/livelihood.jpg",
        icon: BriefcaseBusiness,
    },
];

const commitments = [
    "100% Donation Policy",
    "Transparent & Accountable",
    "Sustainable Programs",
    "UK Registered Charity",
    "Dedicated to Long-Term Impact",
];


export const dynamic = "force-dynamic";


const AboutUsPage = () => {
    return (
        <main className="overflow-hidden bg-white text-[#102d25]">
            {/* HERO */}

            <section className="relative min-h-115 overflow-hidden bg-[#073c2f] lg:min-h-127.5">
                <div className="absolute inset-0">
                    <Image
                        src="/images/about/about-hero.jpg"
                        alt="Children supported by Nessa Foundation"
                        fill
                        priority
                        className="object-cover object-center lg:object-[70%_center]"
                        sizes="100vw"
                    />

                    <div className="absolute inset-0 bg-linear-to-r from-[#062f26] via-[#062f26]/95 to-[#062f26]/10" />
                    <div className="absolute inset-0 bg-linear-to-t from-[#062f26]/40 via-transparent to-transparent" />
                </div>

                <div className="relative container mx-auto flex min-h-115 items-center px-10 py-16 lg:min-h-127.5">
                    <div className="max-w-xl">
                        <div className="mb-5">
                            <span className="block font-extrabold tracking-tight text-[#08a365]">
                                About
                            </span>

                            <h1 className="mt-1 font-extrabold leading-[1.05] tracking-tight text-white">
                                Nessa Foundation
                            </h1>

                            <div className="mt-5 h-0.75 w-11 bg-[#f8c940]" />
                        </div>

                        <p className="leading-7 text-white/90 sm:leading-8">
                            We are a UK-based charity dedicated to uplifting
                            communities and providing sustainable support to
                            those who need it most—today and for generations to
                            come.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Button
                                asChild
                                className="h-12 rounded-[5px] bg-[#df1717] px-7 text-sm font-bold text-white hover:bg-[#c91212]"
                            >
                                <Link href="#mission">
                                    Our Mission
                                    <ArrowRight className="ml-2 size-4" />
                                </Link>
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                className="h-12 rounded-[5px] border-white/80 bg-transparent px-7 text-sm font-bold text-white hover:bg-white hover:text-[#063b2d]"
                            >
                                <Link href="#impact">
                                    Our Impact
                                    <ArrowRight className="ml-2 size-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* OUR STORY */}

            <section className="bg-white py-14 sm:py-16 lg:py-20">
                <div className="mx-auto grid container items-center gap-10 px-5 lg:grid-cols-[0.93fr_1.07fr] lg:gap-16 lg:px-12">
                    <div>
                        <SectionHeading align="left">Our Story</SectionHeading>

                        <div className="mt-8 space-y-5 leading-7 text-[#4f5e59]">
                            <p>
                                Nessa Foundation was founded with a simple
                                belief—every human being deserves dignity, hope,
                                and the opportunity to build a better life.
                            </p>

                            <p>
                                We started our journey by supporting vulnerable
                                families and orphans. Over the years, with the
                                trust of our donors and supporters, we have
                                grown into a key charity delivering life-changing
                                programs in education, healthcare, emergency
                                relief, water, and livelihood support.
                            </p>

                            <p>
                                Our work is inspired by compassion, guided by
                                integrity, and driven by the commitment to serve
                                humanity without distinction.
                            </p>
                        </div>
                    </div>

                    <div className="relative lg:pl-5">
                        <div className="relative aspect-[1.55/1] overflow-hidden rounded-xl shadow-[0_18px_45px_rgba(7,60,47,0.12)]">
                            <Image
                                src="/images/about/our-story.jpg"
                                alt="Nessa Foundation volunteers serving a local community"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 55vw"
                            />
                        </div>

                        <div className="absolute -bottom-6 right-2 max-w-55 rounded-xl bg-[#053c2c] p-5 text-white shadow-xl sm:right-5 sm:max-w-60 lg:-right-3">
                            <div className="flex items-center gap-3 pb-3">
                                <PackageCheck className="size-7 text-[#48c792]" />
                                <p className="font-medium text-white/70">
                                    Serving
                                </p>
                            </div>

                            <p className="mt-1 font-bold leading-tight">
                                Communities <br /> with Compassion
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS */}
            <section id="impact" className="bg-[#f1f6f4] py-8 lg:py-10">
                <div className="mx-auto grid container gap-4 px-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-12">
                    {stats.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Card
                                key={item.label}
                                className="rounded-xl border border-[#e7eeeb] bg-white shadow-[0_5px_20px_rgba(6,59,45,0.03)]"
                            >
                                <CardContent className="flex min-h-48.75 flex-col items-center justify-center px-5 py-7 text-center">
                                    <div className="flex size-12 items-center justify-center rounded-full bg-[#075237] text-white">
                                        <Icon className="size-6" />
                                    </div>

                                    <p className="mt-4 text-sm font-semibold leading-tight text-[#18352c]">
                                        {item.label}
                                    </p>

                                    <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#087a47]">
                                        {item.value}
                                    </p>

                                    <p className="mt-2 text-xs leading-5 text-[#56635f] sm:text-sm">
                                        {item.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </section>

            {/*MISSION + VISION*/}

            <section
                id="mission"
                className="bg-white py-14 sm:py-16 lg:py-20"
            >
                <div className="mx-auto container px-5 lg:px-12">
                    <SectionHeading>Our Mission &amp; Vision</SectionHeading>

                    <div className="mt-9 grid gap-5 md:grid-cols-2">
                        <InfoCard
                            icon={Target}
                            title="Our Mission"
                            description="To uplift communities by providing sustainable support in education, healthcare, emergency relief, and livelihood programs, focusing on those who need it most."
                        />

                        <InfoCard
                            icon={Eye}
                            title="Our Vision"
                            description="A world where every individual has the opportunity to live with dignity, hope, and the resources to build a better future."
                        />
                    </div>

                    <div className="mt-12">
                        <SectionHeading>Our Values</SectionHeading>

                        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0">
                            {values.map((item, index) => {
                                const Icon = item.icon;

                                return (
                                    <div
                                        key={item.title}
                                        className={`px-4 text-center ${index !== 0
                                            ? "lg:border-l lg:border-[#e7ecea]"
                                            : ""
                                            }`}
                                    >
                                        <Icon
                                            strokeWidth={1.7}
                                            className="mx-auto size-9 text-[#006b46]"
                                        />

                                        <h4 className="mt-4 font-bold text-[#17332b]">
                                            {item.title}
                                        </h4>

                                        <div className="mx-auto my-3 h-px w-14 bg-[#dfe6e3]" />

                                        <p className="text-sm leading-6 text-[#6a7470]">
                                            {item.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* WHAT WE DO */}

            <section className="pb-8 lg:pb-10">
                <div className="mx-auto container px-5 lg:px-12">
                    <div className="overflow-hidden rounded-[14px] bg-linear-to-br from-[#063d2f] to-[#003729] px-4 py-7 shadow-[0_15px_40px_rgba(4,54,42,0.12)] sm:px-6 lg:px-7">
                        <SectionHeading dark>What We Do</SectionHeading>

                        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                            {workAreas.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <article
                                        key={item.title}
                                        className="group overflow-hidden rounded-lg bg-[#073e30]"
                                    >
                                        <div className="relative aspect-[1.48/1] overflow-hidden">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover transition duration-500 group-hover:scale-105"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                                            />

                                            <div className="absolute inset-0 bg-linear-to-t from-[#063d2f]/65 to-transparent" />
                                        </div>

                                        <div className="relative px-4 pb-6 pt-7 text-center">
                                            <div className="absolute left-1/2 top-0 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#078555] text-white shadow-lg">
                                                <Icon className="size-5" />
                                            </div>

                                            <h4 className="font-bold text-white">
                                                {item.title}
                                            </h4>

                                            <p className="mt-2 text-xs leading-5 text-white/75 sm:text-sm">
                                                {item.description}
                                            </p>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* WHY CHOOSE + COMMITMENT */}

            <section className="bg-white py-5 lg:py-7">
                <div className="mx-auto grid container gap-5 px-5 lg:grid-cols-2 lg:px-12">
                    <Card className="relative overflow-hidden rounded-xl border-[#e7eeeb] bg-[#f3f8f5] shadow-none">
                        <CardContent className="relative p-7 sm:p-8">
                            <div className="pointer-events-none absolute -bottom-10 right-2 opacity-[0.06]">
                                <HandHeart className="size-52 text-[#075339]" />
                            </div>

                            <h2 className="font-extrabold leading-tight text-[#14362c]">
                                Why Choose
                                <br />
                                Nessa Foundation?
                            </h2>

                            <div className="mt-4 h-0.75 w-10 bg-[#df1818]" />

                            <ul className="relative mt-6 space-y-3">
                                {commitments.map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-center gap-3 font-medium text-[#40534c]"
                                    >
                                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#086442] text-white">
                                            <ShieldCheck className="size-3" />
                                        </span>

                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border-none bg-[#06442f] text-white shadow-none">
                        <CardContent className="flex h-full flex-col justify-center p-7 sm:p-8 lg:p-10">
                            <h2 className="font-extrabold">
                                Our Commitment
                            </h2>

                            <p className="mt-5 leading-7 text-white/80">
                                We are committed to using every donation
                                responsibly and transparently to maximize impact
                                for those in need.
                            </p>

                            <div className="mt-7">
                                <Button
                                    asChild
                                    className="h-12 rounded-md bg-[#f9ca35] px-6 font-bold text-[#173027] hover:bg-[#f2bd20]"
                                >
                                    <Link href="/donate">
                                        Support Our Work
                                        <HandHeart className="ml-2 size-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* BOTTOM CTA */}
            <section className="container mx-auto px-12">
                <SupportCTA
                    eyebrow=""
                    title="Be Part of the Change"
                    description="Together, we can build a better future for everyone."
                    primaryButton={{
                        label: "Donate Now",
                        href: "/donate",
                    }}
                />
            </section>
        </main>
    );
}

export default AboutUsPage;

/*    REUSABLE COMPONENTS
*/

function SectionHeading({
    children,
    align = "center",
    dark = false,
}: {
    children: React.ReactNode;
    align?: "left" | "center";
    dark?: boolean;
}) {
    return (
        <div className={align === "left" ? "text-left" : "text-center"}>
            <h2
                className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${dark ? "text-white" : "text-[#15382e]"
                    }`}
            >
                {children}
            </h2>

            <div
                className={`mt-3 h-0.75 w-10 bg-[#df1b1b] ${align === "center" ? "mx-auto" : ""
                    }`}
            />
        </div>
    );
}

function InfoCard({
    icon: Icon,
    title,
    description,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
}) {
    return (
        <Card className="rounded-xl border-[#edf1ef] bg-[#fbfcfc] shadow-none">
            <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
                <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-[#e7f3ee] text-[#056543]">
                    <Icon strokeWidth={1.7} className="size-10" />
                </div>

                <div>
                    <h3 className="text-lg font-bold text-[#18372e]">
                        {title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#66736e]">
                        {description}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}