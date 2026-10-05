"use client";

import Link from "next/link";
import {
    ArrowUp,
    HeartPulse,
    Lock,
    Shield,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BrandLogo from "./BrandLogo";

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
            <div className="container mx-auto px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                    <div className="space-y-5 lg:col-span-4">
                        <Link
                            href="/"
                            className="flex w-fit items-center gap-3"
                        >
                            <div className="flex flex-wrap items-center gap-2">
                                <BrandLogo />
                            </div>
                        </Link>

                        <p className="max-w-md text-sm leading-6 text-slate-400">
                            Modern doctor appointment booking and real-time
                            digital queue management platform connecting
                            verified physicians, chamber clinics, and patients.
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                            <div className="flex items-center gap-2">
                                <Shield className="size-4 text-blue-400" />
                                <span>BMDC Verified Doctors</span>
                            </div>

                            <div className="hidden size-1 rounded-full bg-slate-700 sm:block" />

                            <div className="flex items-center gap-2">
                                <Lock className="size-4 text-blue-400" />
                                <span>256-Bit Encrypted</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <h3 className="mb-4 text-sm font-semibold text-white">
                            For Patients
                        </h3>

                        <div className="flex flex-col items-start gap-3">
                            <Link
                                href="/doctors"
                                className="text-sm text-slate-400 transition-colors hover:text-white"
                            >
                                Find Doctors
                            </Link>

                            <Link
                                href="/specialties"
                                className="text-sm text-slate-400 transition-colors hover:text-white"
                            >
                                Medical Specialties
                            </Link>

                            <Link
                                href="/how-it-works"
                                className="text-sm text-slate-400 transition-colors hover:text-white"
                            >
                                How Queue Works
                            </Link>

                            <Link
                                href="/register/patient"
                                className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
                            >
                                Create Patient Account
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <h3 className="mb-4 text-sm font-semibold text-white">
                            For Doctors
                        </h3>

                        <div className="flex flex-col items-start gap-3">
                            <Link
                                href="/register/doctor"
                                className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
                            >
                                Join as Doctor
                            </Link>

                            <Link
                                href="/doctor/chamber"
                                className="text-sm text-slate-400 transition-colors hover:text-white"
                            >
                                Chamber Management
                            </Link>

                            <Link
                                href="/terms"
                                className="text-sm text-slate-400 transition-colors hover:text-white"
                            >
                                Clinical Charter
                            </Link>

                            <Link
                                href="/support"
                                className="text-sm text-slate-400 transition-colors hover:text-white"
                            >
                                Doctor Onboarding Desk
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <h3 className="mb-4 text-sm font-semibold text-white">
                            Platform & Legal
                        </h3>

                        <div className="flex flex-col items-start gap-3">
                            <Link
                                href="/privacy"
                                className="text-sm text-slate-400 transition-colors hover:text-white"
                            >
                                Privacy Policy
                            </Link>

                            <Link
                                href="/terms"
                                className="text-sm text-slate-400 transition-colors hover:text-white"
                            >
                                Terms of Practice
                            </Link>

                            <Link
                                href="/support"
                                className="text-sm text-slate-400 transition-colors hover:text-white"
                            >
                                Data Protection
                            </Link>

                            <span className="text-sm text-slate-600">
                                ISO 27001 Aligned
                            </span>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <h3 className="mb-4 text-sm font-semibold text-white">
                            Clinical Support
                        </h3>

                        <Card className="border-slate-800 bg-slate-900/70 p-4 shadow-none">
                            <p className="text-xs text-slate-500">
                                Toll-Free Patient Line
                            </p>

                            <p className="mt-1 text-sm font-semibold text-white">
                                +880 9610-000000
                            </p>

                            <div className="mt-2 flex items-center gap-2">
                                <span className="size-1.5 rounded-full bg-emerald-400" />
                                <span className="text-xs font-medium text-emerald-400">
                                    24/7 Active Triage
                                </span>
                            </div>
                        </Card>

                        <Link
                            href="/support"
                            className="mt-4 inline-block text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
                        >
                            Open Help Desk →
                        </Link>
                    </div>
                </div>
            </div>

            <Separator className="bg-slate-800" />

            <div className="bg-black/20">
                <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:px-6 md:flex-row lg:px-8">
                    <p className="text-center text-xs text-slate-500 md:text-left">
                        © {new Date().getFullYear()} Tarevia Healthcare
                        Technologies. All rights reserved.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
                        <Link
                            href="/privacy"
                            className="text-xs text-slate-400 transition-colors hover:text-white"
                        >
                            Privacy
                        </Link>

                        <span className="text-slate-700">•</span>

                        <Link
                            href="/terms"
                            className="text-xs text-slate-400 transition-colors hover:text-white"
                        >
                            Terms
                        </Link>

                        <span className="text-slate-700">•</span>

                        <Link
                            href="/support"
                            className="text-xs text-slate-400 transition-colors hover:text-white"
                        >
                            Support
                        </Link>

                        <span className="hidden text-slate-700 sm:inline">
                            •
                        </span>

                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={scrollToTop}
                            className="h-auto gap-1.5 px-2 py-1 text-xs text-slate-400 hover:bg-slate-900 hover:text-white"
                        >
                            Back to Top
                            <ArrowUp className="size-3.5" />
                        </Button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;