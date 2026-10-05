import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SupportCtaProps = {
    eyebrow?: string;
    title: string;
    description?: string;

    primaryButton?: {
        label: string;
        href: string;
    };

    secondaryButton?: {
        label: string;
        href: string;
    };

    className?: string;
    contentClassName?: string;
    titleClassName?: string;
    descriptionClassName?: string;
    actionsClassName?: string;

    children?: React.ReactNode;
};

const SupportCTA = ({
    eyebrow = "Want To Make A Difference?",
    title,
    description,

    primaryButton,
    secondaryButton,

    className,
    contentClassName,
    titleClassName,
    descriptionClassName,
    actionsClassName,

    children,
}: SupportCtaProps) => {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl bg-[#153e27] px-6 py-9 text-white sm:px-9 md:px-12 md:py-11",
                className
            )}
        >
            {/* Decorative Circles */}
            <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-white/5" />

            <div
                className={cn(
                    "relative z-10 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between",
                    contentClassName
                )}
            >
                {/* Content */}
                <div className="max-w-2xl">
                    {eyebrow && (
                        <p className="font-bold uppercase tracking-[0.16em] text-white/60">
                            {eyebrow}
                        </p>
                    )}

                    <h2
                        className={cn(
                            "mt-3 text-2xl font-black tracking-[-0.03em] sm:text-3xl",
                            titleClassName
                        )}
                    >
                        {title}
                    </h2>

                    {description && (
                        <p
                            className={cn(
                                "mt-3 text-sm leading-6 text-white/70",
                                descriptionClassName
                            )}
                        >
                            {description}
                        </p>
                    )}

                    {children}
                </div>

                {/* Actions */}
                {(primaryButton || secondaryButton) && (
                    <div
                        className={cn(
                            "flex flex-wrap gap-3",
                            actionsClassName
                        )}
                    >
                        {primaryButton && (
                            <Button
                                asChild
                                size="lg"
                                className="h-10 rounded bg-[#D23157] px-10 font-bold text-white hover:bg-[#b9284b] md:h-13"
                            >
                                <Link href={primaryButton.href}>
                                    {primaryButton.label}
                                </Link>
                            </Button>
                        )}

                        {secondaryButton && (
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="h-10 rounded border-white/30 bg-transparent px-10 text-white hover:bg-white hover:text-[#153e27] md:h-13"
                            >
                                <Link href={secondaryButton.href}>
                                    {secondaryButton.label}
                                </Link>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupportCTA;