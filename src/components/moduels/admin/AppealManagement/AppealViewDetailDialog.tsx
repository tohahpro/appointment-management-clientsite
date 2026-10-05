"use client";

import Image from "next/image";
import { useState } from "react";
import {
    Check,
    ChevronDown,
    Heart,
    LockKeyhole,
    MapPin,
    ShieldCheck,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AppealIcon } from "@/components/moduels/admin/AppealManagement/appeal-icon";
import { IAppeal } from "../../../../../types/appeal.interface";

interface AppealViewDetailDialogProps {
    open: boolean;
    onClose: () => void;
    appeal: IAppeal | null;
}

export default function AppealViewDetailDialog({
    open,
    onClose,
    appeal,
}: AppealViewDetailDialogProps) {
    const [frequency, setFrequency] = useState<"one-time" | "monthly">("one-time");

    const [selectedAmount, setSelectedAmount] = useState<number | "custom" | null>(null);

    if (!appeal) return null;

    const matter = appeal.matters?.[0];
    const impact = appeal.impacts?.[0];

    const provides = appeal.supports?.find(
        (item: any) => item.category === "PROVIDES",
    );

    const works = appeal.supports?.find(
        (item: any) => item.category === "WORKS",
    );

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => { if (!value) { onClose() } }}        >
            <DialogContent
                className="flex max-h-[96vh] w-[97vw] max-w-none flex-col gap-0 overflow-hidden p-0 sm:max-w-375!">
                {/* Header */}
                <DialogHeader className="shrink-0 border-b bg-white px-5 py-4">
                    <DialogTitle className="text-xl font-bold text-slate-950">
                        Appeal Details
                    </DialogTitle>
                </DialogHeader>

                {/* Scroll Area */}

                <div className="flex-1 overflow-y-auto bg-[#fafafa]">
                    <div className="mx-auto grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_340px]">
                        {/* ================= LEFT ================= */}
                        <div className="space-y-5">
                            {/* HERO */}
                            <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
                                <div className="grid min-h-117.5 lg:grid-cols-[45%_55%]">
                                    {/* Hero Content */}
                                    <div className="flex flex-col justify-between p-5 md:p-6">
                                        <div>
                                            {appeal.label && (
                                                <span className="inline-flex rounded-md bg-green-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-green-800">
                                                    {appeal.label}
                                                </span>
                                            )}

                                            <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-950">
                                                {appeal.title}
                                            </h1>

                                            {appeal.description && (
                                                <p className="mt-4 text-sm leading-6 text-slate-600">
                                                    {appeal.description}
                                                </p>
                                            )}

                                            {/* Hero Highlights */}

                                            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                                                {appeal.heroHighlights?.map(
                                                    (item: any) => (
                                                        <div
                                                            key={item.id}
                                                            className="text-center"
                                                        >
                                                            <div className="mx-auto flex h-9 w-9 items-center justify-center text-red-600">
                                                                <AppealIcon name={item.icon} className="h-6 w-6" />
                                                            </div>

                                                            <p className="mt-2 text-xs font-semibold leading-5 text-slate-800">
                                                                {item.label}
                                                            </p>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>

                                        {/* Quote */}

                                        {appeal.islamicQuotes?.[0] && (
                                            <div className="mt-7 rounded-xl bg-red-50 p-4">
                                                <div className="text-3xl font-black text-red-600">
                                                    “
                                                </div>
                                                <blockquote className="text-center text-xs font-semibold italic leading-6 text-slate-800">
                                                    {appeal.islamicQuotes[0].hadith}
                                                </blockquote>

                                                {appeal.islamicQuotes[0]
                                                    .reference && (
                                                        <p className="mt-2 text-center text-[11px] font-medium text-slate-600">
                                                            —{" "}
                                                            {appeal.islamicQuotes[0].reference}
                                                        </p>
                                                    )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Hero Image */}

                                    <div className="relative min-h-100">
                                        <Image
                                            src={appeal.image}
                                            alt={appeal.imageContext || appeal.title}
                                            fill
                                            priority
                                            className="object-cover"
                                        />

                                        {appeal.imageContext && (
                                            <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-green-950/90 p-4 text-white backdrop-blur">
                                                <div className="flex items-start gap-2">
                                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />

                                                    <p className="whitespace-pre-line text-sm font-semibold leading-6">
                                                        {appeal.imageContext}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* TRUST ROW */}

                            <section className="grid gap-3 rounded-xl border bg-white p-4 shadow-sm sm:grid-cols-2 xl:grid-cols-4">
                                <TrustItem
                                    icon={<ShieldCheck />}
                                    title="UK Registered Charity"
                                    text="Charity No. 1186200"
                                />

                                <TrustItem
                                    icon={<ShieldCheck />}
                                    title="Zakat Eligible"
                                    text="100% Shariah Compliant"
                                />

                                <TrustItem
                                    icon={<ShieldCheck />}
                                    title="Transparent Reporting"
                                    text="Regular project updates"
                                />

                                <TrustItem
                                    icon={<LockKeyhole />}
                                    title="Secure & Encrypted"
                                    text="Your data is protected"
                                />
                            </section>

                            {/* MATTERS */}

                            {matter && (
                                <section className="grid overflow-hidden rounded-xl border bg-white shadow-sm md:grid-cols-2">
                                    <div className="p-5">
                                        <SectionTitle
                                            title={matter.title}
                                        />

                                        {matter.description && (
                                            <p className="mt-4 text-xs leading-6 text-slate-600">
                                                {matter.description}
                                            </p>
                                        )}

                                        <div className="mt-6 grid grid-cols-3 gap-3">
                                            {matter.mattersHighlights?.map(
                                                (item: any) => (
                                                    <div
                                                        key={item.id}
                                                        className="text-center"
                                                    >
                                                        <div className="mx-auto flex h-9 w-9 items-center justify-center text-red-600">
                                                            <AppealIcon name={item.icon} className="h-5 w-5" />
                                                        </div>

                                                        <p className="mt-2 text-[11px] leading-4 text-slate-500">
                                                            {item.label}
                                                        </p>
                                                        <p className="mt-2 text-base font-bold text-slate-950">
                                                            {item.value}
                                                        </p>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    {impact?.image && (
                                        <div className="p-3">
                                            <div className="relative h-full min-h-65 overflow-hidden rounded-lg">
                                                <Image
                                                    src={impact.image}
                                                    alt={impact.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </section>
                            )}

                            {/* SUPPORT + IMPACT */}

                            <section className="flex gap-4">
                                {/* Provides */}

                                {provides && (
                                    <InfoCard title={provides.title}                                    >
                                        <div className="space-y-4 flex-1">
                                            {provides.supportHighlights?.map(
                                                (item: any) => (
                                                    <div key={item.id} className="flex gap-3"                                                    >
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                                                            <AppealIcon name={item.icon} className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-semibold text-slate-900">
                                                                {item.label}
                                                            </p>
                                                            <p className="mt-1 text-[11px] leading-5 text-slate-500">
                                                                {item.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </InfoCard>
                                )}

                                {/* Works */}

                                {works && (
                                    <InfoCard title={works.title}                                    >
                                        <div className="space-y-4 flex-1">
                                            {works.supportHighlights?.map(
                                                (item: any, index: any) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex gap-3"
                                                    >
                                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                                                            {index + 1}
                                                        </div>

                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <AppealIcon name={item.icon} className="h-4 w-4" />
                                                                <p className="text-xs font-bold text-slate-900">{item.label} </p>
                                                            </div>

                                                            <p className="mt-1 text-[11px] leading-5 text-slate-500">{item.description}</p>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </InfoCard>
                                )}

                                {/* Impact */}

                                {impact && (
                                    <InfoCard title={impact.title}                                    >
                                        <div className="relative h-32 overflow-hidden rounded-lg">
                                            {impact.image && (
                                                <Image
                                                    src={impact.image}
                                                    alt={impact.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>

                                        <div className="mt-4 flex gap-3">
                                            {impact.impactHighlights?.map(
                                                (item: any) => (
                                                    <div key={item.id}
                                                        className="border-r border-slate-200 px-2 text-center last:border-r-0"
                                                    >
                                                        <p className="text-base font-bold text-slate-950">{item.value}</p>
                                                        <p className="mt-1 text-[11px] leading-4 text-slate-600">{item.label}</p>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </InfoCard>
                                )}
                            </section>

                            {/* ALL IMPACTS */}

                            {appeal.impacts?.length > 1 && (
                                <section className="space-y-4 rounded-xl border bg-white p-5 shadow-sm">
                                    <SectionTitle title="All Impact Sections" />

                                    {appeal.impacts.map(
                                        (item: any) => (
                                            <div
                                                key={item.id}
                                                className="grid overflow-hidden rounded-xl border md:grid-cols-[260px_1fr]"
                                            >
                                                <div className="relative min-h-45">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>

                                                <div className="p-4">
                                                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                                                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                                        {item.impactHighlights?.map(
                                                            (highlight: any) => (
                                                                <div key={highlight.id}
                                                                    className="rounded-lg bg-slate-50 p-3 text-center"
                                                                >
                                                                    <p className="font-bold">{highlight.value}</p>
                                                                    <p className="mt-1 text-[11px] text-slate-500">{highlight.label}</p>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </section>
                            )}

                            {/* FAQ */}

                            {appeal.faqs?.length >
                                0 && (
                                    <section className="rounded-xl border bg-white p-5 shadow-sm">
                                        <SectionTitle title="Frequently Asked Questions" />

                                        <div className="mt-5 grid gap-3 md:grid-cols-2">
                                            {appeal.faqs.map(
                                                (faq: any) => (
                                                    <FaqItem
                                                        key={faq.id}
                                                        question={faq.question}
                                                        answer={faq.answer}
                                                    />
                                                ),
                                            )}
                                        </div>
                                    </section>
                                )}
                        </div>

                        {/* ================= DONATION SIDEBAR ================= */}

                        {appeal.donationForm && (
                            <aside className="h-fit rounded-xl border bg-white p-5 shadow-sm lg:sticky lg:top-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-950">
                                            {appeal.donationForm.title}
                                        </h2>

                                        {appeal.donationForm
                                            .context && (
                                                <p className="mt-2 text-xs leading-5 text-slate-500">
                                                    {appeal.donationForm.context}
                                                </p>
                                            )}
                                    </div>

                                    <ShieldCheck className="h-5 w-5 text-red-600" />
                                </div>

                                {/* Frequency */}

                                <div className="mt-6">
                                    <p className="text-xs font-bold text-slate-900">Choose Frequency</p>
                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setFrequency("one-time")}
                                            className={`rounded-lg border px-3 py-2.5 text-xs font-semibold ${frequency ===
                                                "one-time"
                                                ? "border-red-600 bg-red-600 text-white"
                                                : "bg-white text-slate-700"
                                                }`}
                                        >
                                            One-time
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setFrequency("monthly")}
                                            className={`rounded-lg border px-3 py-2.5 text-xs font-semibold ${frequency ===
                                                "monthly"
                                                ? "border-red-600 bg-red-600 text-white"
                                                : "bg-white text-slate-700"
                                                }`}
                                        >
                                            Monthly
                                        </button>
                                    </div>
                                </div>

                                {/* Amounts */}

                                <div className="mt-6">
                                    <p className="text-xs font-bold text-slate-900">Choose Amount (GBP)</p>

                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        {appeal.donationForm.donationAmountOptions?.filter((option: any) => option.isActive).map((option: any) => {
                                            const value = option.isCustom ? "custom" : option.amount;
                                            const selected = selectedAmount === value;

                                            return (
                                                <button
                                                    key={option.id}
                                                    type="button"
                                                    onClick={() => setSelectedAmount(value ?? null,)}
                                                    className={`min-h-16 rounded-lg border p-2.5 text-center ${selected
                                                        ? "border-red-500 bg-red-50"
                                                        : "border-slate-200 bg-white"
                                                        }`}
                                                >
                                                    <p className="text-sm font-bold text-slate-950">
                                                        {option.isCustom
                                                            ? "£ Custom"
                                                            : `£${option.amount}`}
                                                    </p>

                                                    {option.title && (
                                                        <p className="mt-1 text-[10px] leading-4 text-slate-500">{option.title}</p>
                                                    )}
                                                </button>
                                            );
                                        },
                                        )}
                                    </div>
                                </div>

                            </aside>
                        )}
                    </div>
                </div>

                {/* FOOTER */}

                <div className="flex shrink-0 justify-end border-t bg-white px-5 py-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({
    title,
}: {
    title: string;
}) {
    return (
        <div>
            <h2 className="text-base font-bold text-slate-950">
                {title}
            </h2>

            <div className="mt-2 h-0.5 w-8 bg-red-600" />
        </div>
    );
}

/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <article className="flex-1 rounded-xl border bg-white p-5 shadow-sm">
            <SectionTitle title={title} />

            <div className="mt-5">
                {children}
            </div>
        </article>
    );
}

/* =========================================================
   TRUST ITEM
========================================================= */

function TrustItem({
    icon,
    title,
    text,
}: {
    icon: React.ReactNode;
    title: string;
    text: string;
}) {
    return (
        <div className="flex items-center gap-2.5">
            <div className="text-green-700 [&>svg]:h-5 [&>svg]:w-5">
                {icon}
            </div>

            <div>
                <p className="text-xs font-bold text-slate-900">
                    {title}
                </p>

                <p className="mt-0.5 text-[10px] text-slate-500">
                    {text}
                </p>
            </div>
        </div>
    );
}

/* =========================================================
   FAQ ITEM
========================================================= */

function FaqItem({
    question,
    answer,
}: {
    question: string;
    answer?: string | null;
}) {
    const [open, setOpen] =
        useState(false);

    return (
        <div className="rounded-lg border">
            <button
                type="button"
                onClick={() =>
                    setOpen(!open)
                }
                className="flex w-full items-center justify-between gap-3 p-3 text-left"
            >
                <span className="text-xs font-semibold text-slate-900">
                    {question}
                </span>

                <ChevronDown
                    className={`h-4 w-4 shrink-0 transition ${open
                        ? "rotate-180"
                        : ""
                        }`}
                />
            </button>

            {open && answer && (
                <div className="border-t px-3 py-3 text-xs leading-5 text-slate-600">
                    {answer}
                </div>
            )}
        </div>
    );
}