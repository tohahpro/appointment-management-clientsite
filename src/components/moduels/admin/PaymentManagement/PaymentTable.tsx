"use client";


import { useState } from "react";
import ManagementTable from "@/components/shared/ManagementTable";
import { donationPaymentColumns } from "./PaymentColumns";
import PaymentViewDetailDialog from "./PaymentViewDetailDialog";
import { IDonationPayment } from "../../../../../types/payment.interface";



interface PaymentsTableProps {
    payments: IDonationPayment[];
}

const PaymentsTable = ({
    payments,
}: PaymentsTableProps) => {

    const [viewingPayment, setViewingPayment] = useState<IDonationPayment | null>(null);

    const handleView = (payment: IDonationPayment) => {
        setViewingPayment(payment);
    };



    return (
        <>
            <ManagementTable
                data={payments}
                columns={donationPaymentColumns}
                onView={handleView}
                getRowKey={(payment) => payment.id}
                emptyMessage="No donation payments found"
            />

            {/* Payment Details */}
            <PaymentViewDetailDialog
                open={!!viewingPayment}
                onClose={() => setViewingPayment(null)}
                payment={viewingPayment}
            />
        </>
    );
};

export default PaymentsTable;