"use client";

import {
  CalendarDays,
  CircleDollarSign,
  CreditCard,
  HeartHandshake,
  Mail,
  Phone,
  ReceiptText,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/formatters";

import {
  IDonationPayment,
  PaymentStatus,
} from "../../../../../types/payment.interface";

interface PaymentViewDetailDialogProps {
  open: boolean;
  onClose: () => void;
  payment: IDonationPayment | null;
}

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
};

const formatText = (value?: string | null) => {
  if (!value) return "N/A";

  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
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

const PaymentViewDetailDialog = ({
  open,
  onClose,
  payment,
}: PaymentViewDetailDialogProps) => {
  if (!payment) return null;

  const source =
    getDonationSource(payment);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="
                    flex max-h-[92dvh] w-[calc(100%-1rem)]
                    max-w-4xl flex-col gap-0 overflow-hidden p-0
                    sm:w-[calc(100%-2rem)]
                "
      >
        {/* Header */}
        <div className="shrink-0 border-b bg-background px-4 py-4 sm:px-6 sm:py-5">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-lg font-semibold tracking-tight sm:text-xl">
              Payment Details
            </DialogTitle>

            <DialogDescription className="text-xs sm:text-sm">
              Complete donation and transaction information.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Body */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* Summary */}
          <section className="border-b bg-muted/20 px-4 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              {/* Donor */}
              <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-background text-muted-foreground shadow-sm sm:h-12 sm:w-12">
                  <UserRound className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
                      {payment.donorName ||
                        "Anonymous Donor"}
                    </h2>

                    <PaymentStatusBadge
                      status={
                        payment.status
                      }
                    />
                  </div>

                  <a
                    href={`mailto:${payment.donorEmail}`}
                    className="mt-1 flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0" />

                    <span className="truncate">
                      {
                        payment.donorEmail
                      }
                    </span>
                  </a>

                  {payment.donorPhone && (
                    <a
                      href={`tel:${payment.donorPhone}`}
                      className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Phone className="h-3.5 w-3.5 shrink-0" />

                      {
                        payment.donorPhone
                      }
                    </a>
                  )}
                </div>
              </div>

              {/* Amount */}
              <div className="rounded-xl border bg-background px-4 py-3 shadow-sm md:min-w-45 md:text-right">
                <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
                  Donation Amount
                </p>

                <p className="mt-1 text-2xl font-bold tracking-tight">
                  {formatMoney(
                    payment.amount
                  )}
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatText(
                    payment.frequency
                  )}
                </p>
              </div>
            </div>
          </section>

          <div className="space-y-4 p-4 sm:space-y-5 sm:p-6">
            {/* Donation Destination */}
            <DetailSection
              title="Donation Destination"
              description="Where this donation was allocated"
              icon={HeartHandshake}
            >
              <div className="rounded-xl border bg-muted/20 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="rounded-full"
                  >
                    {source.type}
                  </Badge>

                  {source.category && (
                    <span className="text-xs capitalize text-muted-foreground">
                      {
                        source.category
                      }
                    </span>
                  )}
                </div>

                <h3 className="mt-2 text-base font-semibold leading-6">
                  {source.title}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {
                    payment
                      .donationForm
                      ?.title
                  }
                </p>
              </div>
            </DetailSection>

            {/* Payment Information */}
            <DetailSection
              title="Payment Information"
              description="Donation amount and payment status"
              icon={CreditCard}
            >
              <DetailGrid>
                <DetailItem
                  label="Amount"
                  value={formatMoney(
                    payment.amount
                  )}
                  icon={
                    CircleDollarSign
                  }
                  highlight
                />

                <DetailItem
                  label="Frequency"
                  value={formatText(
                    payment.frequency
                  )}
                />

                <DetailItem
                  label="Payment Status"
                  value={formatText(
                    payment.status
                  )}
                />

                <DetailItem
                  label="Donation Form"
                  value={
                    payment
                      .donationForm
                      ?.title ||
                    "N/A"
                  }
                />
              </DetailGrid>
            </DetailSection>

            {/* Donor */}
            <DetailSection
              title="Donor Information"
              description="Donor contact information"
              icon={UserRound}
            >
              <DetailGrid>
                <DetailItem
                  label="Donor Name"
                  value={
                    payment.donorName ||
                    "Anonymous"
                  }
                />

                <DetailItem
                  label="Email Address"
                  value={
                    payment.donorEmail
                  }
                />

                <DetailItem
                  label="Phone Number"
                  value={
                    payment.donorPhone ||
                    "N/A"
                  }
                />
              </DetailGrid>
            </DetailSection>

            {/* Transaction */}
            <DetailSection
              title="Transaction Information"
              description="Stripe transaction reference information"
              icon={ReceiptText}
            >
              <DetailGrid>
                <CopyableDetailItem
                  label="Transaction ID"
                  value={
                    payment.transactionId
                  }
                />

                <CopyableDetailItem
                  label="Stripe Event ID"
                  value={
                    payment.stripeEventId
                  }
                />
              </DetailGrid>

              {payment.status ===
                "PENDING" &&
                !payment.transactionId && (
                  <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs leading-5 text-amber-700">
                    Transaction information
                    is not available yet
                    because this payment is
                    still pending.
                  </div>
                )}
            </DetailSection>

            {/* System */}
            <DetailSection
              title="System Information"
              description="Internal record and audit information"
              icon={ShieldCheck}
              muted
            >
              <DetailGrid>
                <CopyableDetailItem
                  label="Payment ID"
                  value={payment.id}
                />

                <CopyableDetailItem
                  label="Donation Form ID"
                  value={
                    payment.donationFormId
                  }
                />

                <DetailItem
                  label="Created At"
                  value={formatDateTime(
                    payment.createdAt
                  )}
                  icon={
                    CalendarDays
                  }
                />

                <DetailItem
                  label="Updated At"
                  value={formatDateTime(
                    payment.updatedAt
                  )}
                  icon={
                    CalendarDays
                  }
                />
              </DetailGrid>
            </DetailSection>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentViewDetailDialog;


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
        "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",

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

          normalized ===
          "SUCCEEDED" &&
          "bg-emerald-500",

          normalized === "PENDING" &&
          "bg-amber-500",

          normalized === "FAILED" &&
          "bg-red-500",

          normalized ===
          "CANCELED" &&
          "bg-slate-400"
        )}
      />

      {normalized === "SUCCEEDED"
        ? "Paid"
        : formatText(status)}
    </Badge>
  );
};


interface DetailSectionProps {
  title: string;
  description?: string;
  icon: React.ElementType;
  children: React.ReactNode;
  muted?: boolean;
}

const DetailSection = ({
  title,
  description,
  icon: Icon,
  children,
  muted = false,
}: DetailSectionProps) => {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border bg-card",
        muted && "bg-muted/20"
      )}
    >
      <div className="flex items-start gap-3 border-b px-4 py-3.5 sm:px-5">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-semibold">
            {title}
          </h3>

          {description && (
            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {children}
      </div>
    </section>
  );
};


const DetailGrid = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
      {children}
    </div>
  );
};


interface DetailItemProps {
  label: string;
  value?: string | null;
  icon?: React.ElementType;
  highlight?: boolean;
}

const DetailItem = ({
  label,
  value,
  icon: Icon,
  highlight = false,
}: DetailItemProps) => {
  return (
    <div className="min-w-0">
      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
        {label}
      </p>

      <div className="flex min-w-0 items-start gap-2">
        {Icon && (
          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        )}

        <p
          className={cn(
            "min-w-0 wrap-break-words text-sm font-medium leading-5",
            highlight &&
            "text-base font-semibold"
          )}
        >
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
};

const CopyableDetailItem = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => {
  return (
    <div className="min-w-0">
      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
        {label}
      </p>

      {value ? (
        <div className="rounded-lg border bg-muted/20 px-3 py-2.5">
          <p className="break-all font-mono text-xs leading-5">
            {value}
          </p>
        </div>
      ) : (
        <span className="text-sm font-medium text-muted-foreground">
          N/A
        </span>
      )}
    </div>
  );
};