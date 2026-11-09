"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const LIST_PATH = "/consultation/doctors";

interface DoctorSearchFiltersProps {
  specialties: Array<{ id: string; title: string }>;
}

export default function DoctorSearchFilters({
  specialties,
}: DoctorSearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state once from URL, but don't re-sync on every searchParams change
  const [searchTerm, setSearchTerm] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        new URLSearchParams(window.location.search).get("searchTerm") || ""
      );
    }
    return "";
  });

  const debouncedSearch = useDebounce(searchTerm, 500);

  const updateFilters = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(window.location.search);

      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      // Reset to page 1 when filters change
      params.delete("page");

      router.push(`${LIST_PATH}?${params.toString()}`);
    },
    [router]
  );

  // Trigger search when debounced value changes
  useEffect(() => {
    const urlSearchTerm =
      new URLSearchParams(window.location.search).get("searchTerm") || "";
    if (debouncedSearch !== urlSearchTerm) {
      updateFilters("searchTerm", debouncedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleClearFilters = () => {
    setSearchTerm("");
    router.push(LIST_PATH);
  };

  const hasActiveFilters =
    searchParams.get("searchTerm") ||
    searchParams.get("specialties") ||
    searchParams.get("gender");

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-xl sm:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-blue-600 dark:text-blue-400" />
          <Input
            placeholder="Search doctors by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 rounded-xl bg-muted/40 pl-12 text-base"
          />
        </div>

        {/* Specialty Filter */}
        <Select
          value={searchParams.get("specialties") || "all"}
          onValueChange={(value) => updateFilters("specialties", value)}
        >
          <SelectTrigger className="h-12 w-full rounded-xl bg-muted/40 md:w-60">
            <SelectValue placeholder="Select Specialty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specialties</SelectItem>
            {specialties.map((specialty) => (
              <SelectItem key={specialty.id} value={specialty.title}>
                {specialty.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Gender Filter */}
        <Select
          value={searchParams.get("gender") || "all"}
          onValueChange={(value) => updateFilters("gender", value)}
        >
          <SelectTrigger className="h-12 w-full rounded-xl bg-muted/40 md:w-44">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            <SelectItem value="MALE">Male</SelectItem>
            <SelectItem value="FEMALE">Female</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="h-12 w-full cursor-pointer rounded-xl text-muted-foreground md:w-auto"
          >
            <X className="mr-1 size-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
