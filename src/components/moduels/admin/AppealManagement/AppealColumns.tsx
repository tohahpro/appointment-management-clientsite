/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";

import { DateCell } from "@/components/shared/cell/DataCell";
import { Column } from "@/components/shared/ManagementTable";
import { IAppeal } from "../../../../../types/appeal.interface";

const formatCurrency = (amount?: number | null) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount ?? 0);
};

export const appealsColumns: Column<IAppeal>[] = [
  {
    header: "Appeal",
    accessor: (appeal) => (
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-md">
          <Image
            src={appeal.image}
            alt={appeal.title}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <p className="max-w-70 truncate text-sm font-semibold">
            {appeal.title}
          </p>

          <p className="text-xs text-muted-foreground">
            {appeal.label || "No label"}
          </p>
        </div>
      </div>
    ),
    sortKey: "title",
  },

  {
    header: "Category",
    accessor: (appeal) => (
      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
        {appeal.category?.name || "N/A"}
      </span>
    ),
  },

  {
    header: "Sections",
    accessor: (appeal) => (
      <div className="text-sm">
        <span className="font-medium">
          {(appeal.heroHighlights?.length ?? 0) +
            (appeal.supports?.length ?? 0) +
            (appeal.impacts?.length ?? 0) +
            (appeal.faqs?.length ?? 0)}
        </span>

        <span className="ml-1 text-muted-foreground">
          items
        </span>
      </div>
    ),
  },

  {
    header: "Donation",
    accessor: (appeal) => (
      <span className="text-sm">
        {appeal.donationForm
          ? `${appeal.donationForm.donationAmountOptions?.length ?? 0} options`
          : "Not configured"}
      </span>
    ),
  },

  {
    header: "Expected Amount",
    accessor: (appeal) => (
      <span className="text-sm font-semibold px-3">
        {appeal.donationForm
          ? formatCurrency(appeal.donationForm.expectedAmount)
          : "N/A"}
      </span>
    ),
  },

  {
    header: "Total Donors",
    accessor: (appeal) => (
      <span className="text-sm font-medium px-3">
        {appeal.donationForm?.totalDonar ?? 0}
      </span>
    ),
  },

  {
    header: "Total Donation",
    accessor: (appeal) => (
      <span className="text-sm font-semibold text-green-600 px-3">
        {appeal.donationForm
          ? formatCurrency(appeal.donationForm.totalDonarAmount)
          : formatCurrency(0)}
      </span>
    ),
  },

  {
    header: "Created",
    accessor: (appeal) => (
      <DateCell date={appeal.createdAt} />
    ),
    sortKey: "createdAt",
  },
];