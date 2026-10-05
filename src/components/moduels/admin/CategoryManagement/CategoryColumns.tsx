/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DateCell } from "@/components/shared/cell/DataCell";
import { Column } from "@/components/shared/ManagementTable";
import { ICategory } from "../../../../../types/appeal.interface";

export const categoryColumns: Column<ICategory>[] = [
    {
        header: "Category",
        accessor: (category) => (
            <div>
                <p className="max-w-70 truncate text-sm font-semibold">
                    {category.name}
                </p>

                <p className="text-xs text-muted-foreground">
                    {category.description || "No description"}
                </p>
            </div>
        )
    },

    {
        header: "Status",
        accessor: (category) => (
            <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${category.isActive
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                    }`}
            >
                {category.isActive ? "Active" : "Inactive"}
            </span>
        ),
    },

    {
        header: "Created",
        accessor: (category) => (
            <DateCell date={category.createdAt} />
        )
    },
];