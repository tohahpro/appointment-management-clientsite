import ChangePasswordForm from "@/components/moduels/auth/ChangePasswordForm";
import { KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

const ChangePasswordPage = () => {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 sm:px-6">
            {/* Background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-0 top-0 size-72 rounded-full bg-blue-100 opacity-50 blur-3xl" />

                <div className="absolute bottom-0 right-0 size-80 rounded-full bg-cyan-100 opacity-40 blur-3xl" />

                <div className="absolute inset-0 bg-linear-to-b from-white/70 via-transparent to-white/40" />
            </div>

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-xl">
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="relative">
                        <div className="flex size-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-blue-600 shadow-sm">
                            <LockKeyhole className="size-6" />
                        </div>

                        <div className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-white">
                            <ShieldCheck className="size-3" />
                        </div>
                    </div>
                </div>

                {/* Heading */}
                <div className="mb-8 text-center">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        <KeyRound className="size-3.5" />
                        Account Security
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                        Change your password
                    </h1>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
                        Keep your account protected by choosing a strong and
                        unique password that you do not use elsewhere.
                    </p>
                </div>

                {/* Form Card */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
                    {/* Security Info */}
                    <div className="mb-6 flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-200">
                            <ShieldCheck className="size-5" />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-slate-900">
                                Secure password update
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Use at least 8 characters with a combination of
                                uppercase, lowercase, numbers and symbols.
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <ChangePasswordForm />
                </div>

                {/* Footer */}
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                    <ShieldCheck className="size-3.5" />

                    <span>
                        Your account and personal information are protected
                    </span>
                </div>
            </div>
        </main>
    );
};

export default ChangePasswordPage;