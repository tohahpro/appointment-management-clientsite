import type { MouseEventHandler, ReactNode } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DonateButtonProps {
    href?: string;
    children?: ReactNode;
    className?: string;
    icon?: ReactNode;
    showIcon?: boolean;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
}

const DonateButton = ({
    href = "/donate",
    children = "Donate Now",
    className,
    icon,
    showIcon = true,
    onClick,
}: DonateButtonProps) => {
    const defaultIcon = (
        <Heart
            aria-hidden="true"
            className="size-5 fill-current"
        />
    );

    return (
        <Button
            asChild
            className={cn(
                "h-12 rounded bg-[#D23157] text-white transition-all hover:bg-[#D23157]",
                className,
            )}
        >
            <Link
                href={href}
                onClick={onClick}
            >
                <span>{children}</span>
                {showIcon && (icon ?? defaultIcon)}
            </Link>
        </Button>
    );
};

export default DonateButton;