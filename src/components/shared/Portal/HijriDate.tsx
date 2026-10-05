"use client";

import { useEffect, useState } from "react";

const HijriDate = () => {
    const [hijriDate, setHijriDate] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUKHijriDate = async () => {
            try {
                // UK/London-এর বর্তমান Gregorian date
                const formatter = new Intl.DateTimeFormat("en-GB", {
                    timeZone: "Europe/London",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                });

                const parts = formatter.formatToParts(new Date());

                const day =
                    parts.find((part) => part.type === "day")?.value;

                const month =
                    parts.find((part) => part.type === "month")?.value;

                const year =
                    parts.find((part) => part.type === "year")?.value;

                if (!day || !month || !year) {
                    throw new Error("Could not determine UK date");
                }

                const gregorianDate = `${day}-${month}-${year}`;

                const response = await fetch(
                    `https://api.aladhan.com/v1/gToH/${gregorianDate}`,
                    {
                        cache: "no-store",
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch Hijri date");
                }

                const result = await response.json();

                const hijri = result?.data?.hijri;

                if (!hijri) {
                    throw new Error("Hijri date not found");
                }

                const monthName =
                    hijri?.month?.en || "";

                const hijriDay =
                    Number(hijri?.day);

                const hijriYear =
                    hijri?.year;

                setHijriDate(
                    `${monthName} ${hijriDay}, ${hijriYear}`
                );
            } catch (error) {
                console.error("UK Hijri Date Error:", error);

                setHijriDate("Islamic Date");
            } finally {
                setLoading(false);
            }
        };

        getUKHijriDate();

        // Website দীর্ঘ সময় open থাকলে date refresh
        const interval = setInterval(
            getUKHijriDate,
            10 * 60 * 1000
        );

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <span className="text-[#999999]">
                Loading...
            </span>
        );
    }

    return <>{hijriDate}</>;
};

export default HijriDate;