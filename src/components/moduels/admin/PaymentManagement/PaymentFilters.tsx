"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RefreshButton from "@/components/shared/RefreshButton";
import SearchFilter from "@/components/shared/SearchFilter";

const PaymentFilters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();


    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        // Filter change হলে first page
        params.set("page", "1");

    }, [router, searchParams]);


    return (
        <div className="space-y-3 pt-10">
            {/* Search */}
            <div className="flex items-center gap-3">
                <SearchFilter
                    paramName="searchTerm"
                    placeholder="Search payments..."
                />

                <RefreshButton />
            </div>
        </div>
    );
};

export default PaymentFilters;