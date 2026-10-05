"use client";

import { Column } from "@/components/shared/ManagementTable";
import { DateCell } from "@/components/shared/cell/DataCell";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { IDonationPayment, PaymentStatus } from "../../../../../types/payment.interface";


const formatFrequency = (
  frequency: string
) => {
  return frequency
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
};

const getDonationSource = (
  payment: IDonationPayment
) => {
  const form = payment.donationForm;

  if (!form) {
    return {
      title: "General Donation",
      type: "General",
      category: null,
    };
  }

  if (form.appeal) {
    return {
      title:
        form.appeal.title ||
        form.title,

      type: "Appeal",

      category:
        form.appeal.category?.name ||
        form.appeal.label ||
        null,
    };
  }

  if (form.islamicGiving) {
    return {
      title:
        form.islamicGiving.title ||
        form.title,

      type: "Islamic Giving",

      category:
        form.islamicGiving.pageName ||
        null,
    };
  }

  return {
    title:
      form.title ||
      "General Donation",

    type: "General",
    category: null,
  };
};

const PaymentStatusBadge = ({
  status,
}: {
  status: PaymentStatus;
}) => {
  const normalized =
    status.toUpperCase();

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-medium",

        normalized === "SUCCEEDED" &&
        "border-emerald-200 bg-emerald-50 text-emerald-700",

        normalized === "PENDING" &&
        "border-amber-200 bg-amber-50 text-amber-700",

        normalized === "FAILED" &&
        "border-red-200 bg-red-50 text-red-700",

        normalized === "CANCELED" &&
        "border-slate-200 bg-slate-50 text-slate-600"
      )}
    >
      <span
        className={cn(
          "mr-1.5 inline-block h-1.5 w-1.5 rounded-full",

          normalized === "SUCCEEDED" &&
          "bg-emerald-500",

          normalized === "PENDING" &&
          "bg-amber-500",

          normalized === "FAILED" &&
          "bg-red-500",

          normalized === "CANCELED" &&
          "bg-slate-400"
        )}
      />

      {normalized === "SUCCEEDED"
        ? "Paid"
        : normalized === "CANCELED"
          ? "Canceled"
          : normalized
            .toLowerCase()
            .replace(/\b\w/g, (char) =>
              char.toUpperCase()
            )}
    </Badge>
  );
};

export const donationPaymentColumns: Column<IDonationPayment>[] =
  [
    {
      header: "Donor",
      accessor: (payment) => (
        <div className="min-w-45">
          <p className="font-medium text-foreground text-sm">
            {payment.donorName ||
              "Anonymous Donor"}
          </p>

          <p className="mt-0.5 max-w-55 truncate text-xs text-muted-foreground">
            {payment.donorEmail}
          </p>
        </div>
      ),
      sortKey: "donorName",
    },

    {
      header: "Donation For",
      accessor: (payment) => {
        const source =
          getDonationSource(payment);

        return (
          <div className="min-w-55 max-w-70">
            <p
              className="truncate text-sm font-medium text-foreground"
              title={source.title}
            >
              {source.title}
            </p>

            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <Badge
                variant="secondary"
                className="rounded-full px-2 py-0.5 text-[10px] font-medium"
              >
                {source.type}
              </Badge>

              {source.category && (
                <span className="max-w-32.5 truncate text-xs capitalize text-muted-foreground">
                  {source.category}
                </span>
              )}
            </div>
          </div>
        );
      },
    },

    {
      header: "Amount",
      accessor: (payment) => (
        <span className="whitespace-nowrap text-sm font-semibold tabular-nums">
          {new Intl.NumberFormat(
            "en-GB",
            {
              style: "currency",
              currency: "GBP",
            }
          ).format(payment.amount)}
        </span>
      ),
      sortKey: "amount",
    },

    {
      header: "Frequency",
      accessor: (payment) => (
        <Badge
          variant="outline"
          className="whitespace-nowrap rounded-full font-normal"
        >
          {formatFrequency(
            payment.frequency
          )}
        </Badge>
      ),
      sortKey: "frequency",
    },

    {
      header: "Status",
      accessor: (payment) => (
        <PaymentStatusBadge
          status={payment.status}
        />
      ),
      sortKey: "status",
    },

    {
      header: "Transaction ID",
      accessor: (payment) => {
        if (!payment.transactionId) {
          return (
            <span className="text-xs text-muted-foreground">
              —
            </span>
          );
        }

        return (
          <div className="max-w-40">
            <span
              title={
                payment.transactionId
              }
              className="block truncate font-mono text-xs text-muted-foreground"
            >
              {
                payment.transactionId
              }
            </span>
          </div>
        );
      },
    },

    {
      header: "Donated At",
      accessor: (payment) => (
        <DateCell
          date={payment.createdAt}
        />
      ),
      sortKey: "createdAt",
    },
  ];