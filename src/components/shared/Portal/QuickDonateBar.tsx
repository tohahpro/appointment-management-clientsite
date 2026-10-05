"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
    Droplet,
    Menu,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { QuickDonateBarProps } from "../../../../types/quickdonation.interface";
import FormatTitle from "../cell/FormatTitle";

const QuickDonateBar = ({
    appeals,
    className,
    onDonate,
}: QuickDonateBarProps) => {
    const router = useRouter();

    const availableAppeals = useMemo(() => {
        return appeals?.filter(
            (appeal) =>
                appeal.donationForm &&
                appeal.donationForm.donationAmountOptions?.length > 0
        );
    }, [appeals]);

    const firstAppeal =
        availableAppeals[0];

    const [
        selectedAppealId,
        setSelectedAppealId,
    ] = useState(
        firstAppeal?.id ?? ""
    );

    const [
        paymentType,
        setPaymentType,
    ] = useState<
        "single" | "regular"
    >("single");

    const [
        donationType,
        setDonationType,
    ] = useState<
        "general" | "zakat" | "sadaqah"
    >("general");

    const selectedAppeal =
        useMemo(() => {
            return (
                availableAppeals.find(
                    (appeal) =>
                        appeal.id ===
                        selectedAppealId
                ) ?? firstAppeal
            );
        }, [
            availableAppeals,
            selectedAppealId,
            firstAppeal,
        ]);

    const donationAmounts =
        useMemo(() => {
            if (
                !selectedAppeal?.donationForm
            ) {
                return [];
            }

            return [
                ...selectedAppeal
                    .donationForm
                    .donationAmountOptions,
            ]
                .filter(
                    (option) =>
                        option.isActive
                )
                .sort(
                    (a, b) =>
                        a.sortOrder -
                        b.sortOrder
                );
        }, [selectedAppeal]);

    const firstNormalAmount =
        donationAmounts.find(
            (option) =>
                !option.isCustom &&
                option.amount !== null
        );

    const [
        selectedAmount,
        setSelectedAmount,
    ] = useState(
        firstNormalAmount?.amount?.toString() ??
        ""
    );

    const [
        customAmount,
        setCustomAmount,
    ] = useState("");

    const [
        error,
        setError,
    ] = useState("");

    const isCustomAmount =
        selectedAmount === "custom";

    const handleAppealChange = (
        appealId: string
    ) => {
        setSelectedAppealId(
            appealId
        );

        setCustomAmount("");
        setError("");

        const appeal =
            availableAppeals.find(
                (item) =>
                    item.id ===
                    appealId
            );

        if (
            !appeal?.donationForm
        ) {
            setSelectedAmount(
                ""
            );

            return;
        }

        const amounts = appeal.donationForm
            .donationAmountOptions
            .filter(
                (option) =>
                    option.isActive &&
                    !option.isCustom &&
                    option.amount !==
                    null
            )
            .sort((a, b) => a.sortOrder - b.sortOrder);

        setSelectedAmount(amounts[0]?.amount?.toString() ?? "");
    };

    const handlePaymentTypeChange = (value: "single" | "regular") => {
        setPaymentType(value);
        setError("");
    };

    const handleDonationTypeChange = (value: | "general" | "zakat" | "sadaqah") => {
        setDonationType(value);
        setError("");
    };

    const handleAmountChange = (value: string) => {
        setSelectedAmount(value);
        setError("");

        if (value !== "custom") {
            setCustomAmount("");
        }
    };

    const handleCustomAmountChange = (value: string) => {
        setCustomAmount(value);
        setError("");
    };

    const handleDonate = () => {
        setError("");

        if (!selectedAppeal) {
            setError("Please select a campaign.");

            return;
        }

        const finalAmount = isCustomAmount ? Number(customAmount) : Number(selectedAmount);

        if (!finalAmount || finalAmount <= 0) {
            setError("Please select or enter a valid donation amount.");
            return;
        }

        const checkoutData = {
            appealId: selectedAppeal.id,
            appealTitle: selectedAppeal.label,
            appealSlug: selectedAppeal.slug,
            donationFormId: selectedAppeal.donationForm?.id,
            donationType,
            frequency: paymentType === "regular" ? "monthly" : "one-time",
            amount: finalAmount,
            currency: "GBP",
        };

        const donationData = {
            appealId: selectedAppeal.id,
            appealSlug: selectedAppeal.slug,
            appealLabel: selectedAppeal.label,
            paymentType,
            donationType,
            amount: finalAmount.toString(),
        };

        sessionStorage.setItem("donationCheckout", JSON.stringify(checkoutData));

        onDonate?.(donationData);
        router.push("/donation/checkout");
    };

    const isMosque = selectedAppeal?.label?.toLowerCase() === "mosque appeal";

    if (!availableAppeals.length) {
        return null;
    }

    return (
        <div
            className={cn("rounded bg-[#f1f1ed] p-3 shadow-[0_10px_35px_rgba(0,0,0,0.08)]", className)}
        >
            <div className="grid gap-2 lg:grid-cols-[1.4fr_1fr_0.8fr_0.9fr_1.05fr]">
                {/* Campaign */}
                <Select
                    value={selectedAppeal?.id}
                    onValueChange={handleAppealChange}
                >
                    <SelectTrigger className="[&>svg]:hidden h-14 w-full rounded border-0 bg-white px-5 font-semibold text-[#183923] shadow-none">
                        <div className="flex w-full items-center justify-between gap-3">
                            <SelectValue placeholder="Choose Campaign" />

                            <Menu className="h-4 w-4 shrink-0 text-[#8BC53F]" />
                        </div>
                    </SelectTrigger>

                    <SelectContent>
                        {availableAppeals.map(
                            (appeal) => (
                                <SelectItem
                                    key={appeal.id}
                                    value={appeal.id}
                                >
                                    <FormatTitle text={appeal.label} />
                                </SelectItem>
                            )
                        )}
                    </SelectContent>
                </Select>

                {/* Payment Type */}
                <Select
                    value={paymentType}
                    onValueChange={(value) =>
                        handlePaymentTypeChange(value as | "single" | "regular")
                    }
                >
                    <SelectTrigger className="h-14 w-full rounded border-0 bg-white px-5 font-semibold text-[#183923] shadow-none">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="single">Single Payment</SelectItem>
                        {/* <SelectItem value="regular">Regular Payment</SelectItem> */}
                    </SelectContent>
                </Select>

                {/* Amount */}
                {isCustomAmount ? (
                    <div className="relative flex items-center">
                        <span className="absolute left-4 top-1/2 z-10 -translate-y-1/2 font-bold text-[#183923]">
                            £
                        </span>

                        <Input
                            type="number"
                            min="1"
                            value={customAmount}
                            onChange={(event) =>
                                handleCustomAmountChange(event.target.value)
                            }
                            placeholder="Amount 10.00"
                            autoFocus
                            className="h-14 rounded border-0 bg-white pl-8 pr-10 font-bold text-[#183923] shadow-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />

                        <button
                            type="button"
                            onClick={() => {
                                setCustomAmount("");
                                setSelectedAmount(firstNormalAmount?.amount?.toString() ?? "");
                                setError("");
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#1f6b3a]"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ) : (
                    <Select
                        value={selectedAmount}
                        onValueChange={handleAmountChange}
                    >
                        <SelectTrigger className="h-14 w-full rounded border-0 bg-white px-5 font-bold text-[#183923] shadow-none">
                            <SelectValue placeholder="Amount" />
                        </SelectTrigger>

                        <SelectContent>
                            {donationAmounts.map((option) => {
                                if (option.isCustom) {
                                    return (
                                        <SelectItem
                                            key={option.id}
                                            value="custom"
                                        >
                                            {option.title ?? "Custom Amount"}
                                        </SelectItem>
                                    );
                                }
                                if (option.amount === null) { return null; }
                                return (
                                    <SelectItem
                                        key={option.id}
                                        value={option.amount.toString()}
                                    >
                                        £{option.amount.toFixed(2)}
                                    </SelectItem>
                                );
                            }
                            )}
                        </SelectContent>
                    </Select>
                )}

                {/* Donation Type */}
                <Select
                    value={donationType}
                    onValueChange={(value) =>
                        handleDonationTypeChange(
                            value as "general" | "zakat" | "sadaqah"
                        )
                    }
                >
                    <SelectTrigger className="h-14 w-full rounded border-0 bg-white px-5 font-semibold text-[#183923] shadow-none">
                        <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="general">
                            General
                        </SelectItem>

                        {!isMosque && (
                            <SelectItem value="zakat">
                                Zakat
                            </SelectItem>
                        )}

                        <SelectItem value="sadaqah">
                            Sadaqah
                        </SelectItem>
                    </SelectContent>
                </Select>

                {/* Quick Donate */}
                <Button
                    type="button"
                    onClick={handleDonate}
                    className="h-14 cursor-pointer rounded bg-[#D23157] px-8 text-base font-bold text-white hover:bg-[#d1084b]"
                >
                    Quick Donate

                    <Droplet className="ml-2 h-4 w-4 fill-current" />
                </Button>
            </div>
        </div>
    );
};

export default QuickDonateBar;