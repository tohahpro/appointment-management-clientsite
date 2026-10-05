import Link from "next/link";
import { Construction } from "lucide-react";

import { Button } from "@/components/ui/button";

const completedPages = [
    {
        title: "Home",
        href: "/",
    },
];

const UnderConstructionPage = () => {
    return (
        <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 py-16">
            <div className="container">
                <div className="mx-auto flex flex-col items-center text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                        <Construction className="h-10 w-10 text-red-600" />
                    </div>

                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
                        Coming Soon
                    </p>

                    <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                        This Page Is Under Construction
                    </h1>

                    <div className="mx-auto w-full md:w-3/7">
                        <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
                            We&apos;re currently working on this page to bring you a
                            better experience. Please check back soon. Thank you
                            for your patience.
                        </p>

                        <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
                            Please review the completed pages below.
                        </p>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
                        {completedPages.map((page) => (
                            <Button
                                key={page.href}
                                asChild
                                className="h-10 rounded bg-[#053AA5] px-7 text-white"
                            >
                                <Link href={page.href}>
                                    {page.title}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default UnderConstructionPage;