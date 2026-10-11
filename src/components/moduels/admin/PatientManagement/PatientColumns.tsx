"use client";

import { DateCell } from "@/components/shared/cell/DataCell";
import { StatusBadgeCell } from "@/components/shared/cell/StatusBadge";
import { UserInfoCell } from "@/components/shared/cell/UserInfoCell";
import { Column } from "@/components/shared/ManagementTable";
import { Mail, MapPin, Phone } from "lucide-react";
import { IPatient } from "../../../../../types/patient.interface";

export const patientsColumns: Column<IPatient>[] = [
    {
        header: "Patient",
        accessor: (patient) => (
            <UserInfoCell
                name={patient.name}
                email={patient.email}
                photo={patient.profilePhoto ?? ""}
            />
        ),
        sortKey: "name",
    },
    {
        header: "Contact",
        accessor: (patient) => (
            <div className="flex items-center gap-2 text-sm">
                <Phone className="size-4 text-muted-foreground" />
                <span>{patient.contactNumber || "Not provided"}</span>
            </div>
        ),
    },
    {
        header: "Address",
        accessor: (patient) => (
            <div className="flex max-w-48 items-center gap-2 text-sm">
                <MapPin className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{patient.address || "Not provided"}</span>
            </div>
        ),
        sortKey: "address",
    },
    {
        header: "Status",
        accessor: (patient) => (
            <StatusBadgeCell isDeleted={patient.isDeleted} />
        ),
    },
    {
        header: "Joined",
        accessor: (patient) => <DateCell date={patient.createdAt} />,
        sortKey: "createdAt",
    },
];