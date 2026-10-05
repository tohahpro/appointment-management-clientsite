"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MatterImage = {
    image: string;
    order: string | number;
    matterId?: string;
};

type ThumbnailCarouselProps = {
    matterImages: MatterImage[];
};

const VISIBLE_THUMBNAILS = 4;

const ThumbnailCarousel = ({
    matterImages,
}: ThumbnailCarouselProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [thumbnailStart, setThumbnailStart] = useState(0);

    const images = useMemo(() => {
        return [...(matterImages || [])].sort(
            (a, b) => Number(a.order) - Number(b.order),
        );
    }, [matterImages]);

    /*
     * Active image অনুযায়ী thumbnail carousel move করবে।
     *
     * 1 → [1,2,3,4]
     * 2 → [1,2,3,4]
     * 3 → [1,2,3,4]
     * 4 → [1,2,3,4]
     * 5 → [2,3,4,5]
     * 6 → [3,4,5,6]
     */
    useEffect(() => {
        if (activeIndex < thumbnailStart) {
            setThumbnailStart(activeIndex);
            return;
        }

        if (
            activeIndex >=
            thumbnailStart + VISIBLE_THUMBNAILS
        ) {
            setThumbnailStart(
                activeIndex - VISIBLE_THUMBNAILS + 1,
            );
        }
    }, [activeIndex, thumbnailStart]);

    if (!images.length) {
        return null;
    }

    const handlePrevious = () => {
        setActiveIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1,
        );
    };

    const handleNext = () => {
        setActiveIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1,
        );
    };

    return (
        <div className="w-full">
            {/* =========================
                Main Image
            ========================== */}
            <div className="relative aspect-24/20 w-full overflow-hidden rounded-2xl bg-slate-100">
                {images.map((item, index) => (
                    <Image
                        key={index}
                        src={item.image}
                        alt={`Matter image ${index + 1}`}
                        fill
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, 600px"
                        className={cn(
                            "object-cover transition-all duration-500 ease-in-out",
                            activeIndex === index
                                ? "scale-100 opacity-100"
                                : "pointer-events-none scale-[1.02] opacity-0",
                        )}
                    />
                ))}

                {/* Previous */}
                {images.length > 1 && (
                    <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        onClick={handlePrevious}
                        className="
                            absolute left-0 top-1/2 z-20
                            h-14 w-10
                            -translate-y-1/2
                            rounded-l-none rounded-r-xl
                            border-0 bg-white text-slate-900
                            shadow-none hover:bg-white
                            md:h-18 md:w-13.5
                        "
                    >
                        <ChevronLeft className="size-6" />
                    </Button>
                )}

                {/* Next */}
                {images.length > 1 && (
                    <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        onClick={handleNext}
                        className="
                            absolute right-0 top-1/2 z-20
                            h-14 w-10
                            -translate-y-1/2
                            rounded-l-xl rounded-r-none
                            border-0 bg-white text-slate-900
                            shadow-none hover:bg-white
                            md:h-18 md:w-13.5
                        "
                    >
                        <ChevronRight className="size-6" />
                    </Button>
                )}
            </div>

            {/* =========================
                Thumbnail Area
            ========================== */}
            {images.length > 1 && (
                <div className="overflow-hidden bg-white pb-7 pt-4">
                    {/* Thumbnail viewport */}
                    <div className="overflow-hidden">
                        {/* Sliding Track */}
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{
                                transform: `translateX(-${thumbnailStart *
                                    (100 / VISIBLE_THUMBNAILS)
                                    }%)`,
                            }}
                        >
                            {images.map((item, index) => (
                                <div
                                    key={index}
                                    className="shrink-0 px-1"
                                    style={{
                                        width: `${100 /
                                            VISIBLE_THUMBNAILS
                                            }%`,
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActiveIndex(index)
                                        }
                                        className={cn(
                                            "relative aspect-4/3 w-full overflow-hidden rounded-xl",
                                            "transition-all duration-300",
                                        )}
                                    >
                                        <Image
                                            src={item.image}
                                            alt={`Thumbnail ${index + 1}`}
                                            fill
                                            sizes="150px"
                                            className={cn(
                                                "object-cover transition-all duration-300",
                                                activeIndex === index
                                                    ? "scale-[1.03] brightness-[0.65]"
                                                    : "brightness-100 hover:brightness-90",
                                            )}
                                        />

                                        {/* Active Overlay */}
                                        {activeIndex === index && (
                                            <div className="absolute inset-0 bg-black/10" />
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* =========================
                        Indicators
                    ========================== */}
                    <div className="mt-7 flex items-center justify-center gap-3">
                        {images.map((item, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() =>
                                    setActiveIndex(index)
                                }
                                aria-label={`Go to slide ${index + 1}`}
                                className={cn(
                                    "h-0.75 w-8 transition-all duration-300",
                                    activeIndex === index
                                        ? "bg-[#78b82a]"
                                        : "bg-[#c9c9c9]",
                                )}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThumbnailCarousel;