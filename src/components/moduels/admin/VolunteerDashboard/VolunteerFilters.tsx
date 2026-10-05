"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import RefreshButton from "@/components/shared/RefreshButton";
import SearchFilter from "@/components/shared/SearchFilter";
import { useDebounce } from "@/hooks/useDebounce";

const occupationOptions = [
    "Imaam",
    "Muazzin",
    "Doctor",
    "Teacher",
    "Writer",
    "Farmer",
    "Engineer",
    "Lawyer",
    "BusinessPerson",
    "ComputerProgrammer",
    "Crafter",
    "Journalist",
    "SocialWorker",
    "GraphicsDesigner",
    "Banker",
    "Student",
    "Housewife",
    "GovernmentEmployee",
    "Unemployed",
    "Others",
];

const formatOccupation = (value: string) => {
    return value.replace(/([a-z])([A-Z])/g, "$1 $2");
};

const VolunteerFilters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isPending, startTransition] =
        useTransition();

    const [status, setStatus] = useState(
        () => searchParams.get("status") || ""
    );

    const [currentOccupation, setCurrentOccupation] = useState(() =>
        searchParams.get("currentOccupation") || ""
    );

    const [educationLevel, setEducationLevel] = useState(() =>
        searchParams.get("educationLevel") || ""
    );

    const debouncedEducationLevel = useDebounce(educationLevel, 500);

    useEffect(() => {
        const params = new URLSearchParams(
            searchParams.toString()
        );

        if (status) {
            params.set("status", status);
        } else {
            params.delete("status");
        }

        if (currentOccupation) {
            params.set(
                "currentOccupation",
                currentOccupation
            );
        } else {
            params.delete("currentOccupation");
        }

        if (debouncedEducationLevel) {
            params.set(
                "educationLevel",
                debouncedEducationLevel
            );
        } else {
            params.delete("educationLevel");
        }

        // Filter change হলে first page
        params.set("page", "1");

        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    }, [
        status,
        currentOccupation,
        debouncedEducationLevel,
    ]);

    const clearAllFilters = () => {
        setStatus("");
        setCurrentOccupation("");
        setEducationLevel("");

        startTransition(() => {
            router.push(window.location.pathname);
        });
    };

    const activeFiltersCount =
        (status ? 1 : 0) +
        (currentOccupation ? 1 : 0) +
        (educationLevel ? 1 : 0);

    return (
        <div className="space-y-3 pt-10">
            {/* Search */}
            <div className="flex items-center gap-3">
                <SearchFilter
                    paramName="searchTerm"
                    placeholder="Search volunteers..."
                />

                <RefreshButton />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Status */}
                <Select
                    value={status || "all"}
                    onValueChange={(value) =>
                        setStatus(
                            value === "all"
                                ? ""
                                : value
                        )
                    }
                    disabled={isPending}
                >
                    <SelectTrigger className="h-10 w-40">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="all">
                            All Status
                        </SelectItem>

                        <SelectItem value="ACTIVE">
                            Active
                        </SelectItem>

                        <SelectItem value="INACTIVE">
                            Inactive
                        </SelectItem>

                        <SelectItem value="SUSPENDED">
                            Suspended
                        </SelectItem>
                    </SelectContent>
                </Select>

                {/* Occupation */}
                <Select
                    value={
                        currentOccupation || "all"
                    }
                    onValueChange={(value) =>
                        setCurrentOccupation(
                            value === "all"
                                ? ""
                                : value
                        )
                    }
                    disabled={isPending}
                >
                    <SelectTrigger className="h-10 w-52.5">
                        <SelectValue placeholder="Occupation" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="all">
                            All Occupations
                        </SelectItem>

                        {occupationOptions.map(
                            (occupation) => (
                                <SelectItem
                                    key={occupation}
                                    value={occupation}
                                >
                                    {formatOccupation(
                                        occupation
                                    )}
                                </SelectItem>
                            )
                        )}
                    </SelectContent>
                </Select>

                {/* Education */}
                <Input
                    value={educationLevel}
                    onChange={(event) =>
                        setEducationLevel(
                            event.target.value
                        )
                    }
                    placeholder="Education level"
                    className="h-10 md:h-14.5 rounded-md w-50 md:w-80"
                    disabled={isPending}
                />

                {/* Clear */}
                {activeFiltersCount > 0 && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={clearAllFilters}
                        disabled={isPending}
                        className="h-10 px-3"
                    >
                        <X className="mr-1 h-4 w-4" />

                        Clear ({activeFiltersCount})
                    </Button>
                )}
            </div>
        </div>
    );
};

export default VolunteerFilters;