/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";

import { DateCell } from "@/components/shared/cell/DataCell";
import { Column } from "@/components/shared/ManagementTable";
import { IIslamicGiving } from "../../../../../types/islamicGiving.interface";



export const islamicGivingColumns: Column<IIslamicGiving>[] = [
  {
    header: "Islamic Giving",
    accessor: (item) => (
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              No Image
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="max-w-60 truncate text-sm font-semibold">
            {item.title}
          </p>

          <p className="text-xs text-muted-foreground">
            {item.pageName}
          </p>
        </div>
      </div>
    ),
    sortKey: "title",
  },

  {
    header: "Page Name",
    accessor: (item) => (
      <span className="text-sm font-medium">
        {item.pageName}
      </span>
    ),
    sortKey: "pageName",
  },

  {
    header: "Donation Form",
    accessor: (item) => {
      if (!item.donationForms) {
        return (
          <span className="text-xs text-muted-foreground">
            No donation form
          </span>
        );
      }

      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {item.donationForms.title}
          </span>

          {item.donationForms.expectedAmount != null &&
            item.donationForms.expectedAmount > 0 && (
              <span className="text-xs text-muted-foreground">
                Target: £
                {item.donationForms.expectedAmount.toLocaleString("en-GB")}
              </span>
            )}
        </div>
      );
    },
  },

  {
    header: "Raised",
    accessor: (item) => {
      const total = item.donationForms?.totalDonarAmount ?? 0;

      return (
        <span className="text-sm font-semibold">
          £{total.toLocaleString("en-GB")}
        </span>
      );
    },
  },

  {
    header: "Donors",
    accessor: (item) => (
      <span className="text-sm font-medium">
        {item.donationForms?.totalDonar ?? 0}
      </span>
    ),
  },

  {
    header: "Images",
    accessor: (item) => (
      <span className="text-sm">
        {item.islamicGivingImages?.length ?? 0}
      </span>
    ),
  },

  {
    header: "Created",
    accessor: (item) => (
      <DateCell date={item.createdAt} />
    ),
    sortKey: "createdAt",
  },
];