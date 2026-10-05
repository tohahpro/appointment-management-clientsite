"use client";

import { DateCell } from "@/components/shared/cell/DataCell";
import { UserInfoCell } from "@/components/shared/cell/UserInfoCell";
import { Column } from "@/components/shared/ManagementTable";
import { IVolunteer } from "../../../../../types/volunteer.interface";
import VolunteerStatusCell from "./VolunteerStatusCell";


export const volunteersColumns: Column<IVolunteer>[] = [
  {
    header: "Volunteer",
    accessor: (volunteer) => (
      <UserInfoCell
        name={volunteer.name}
        email={volunteer.email}
        photo={volunteer.photo as string}
      />
    ),
    sortKey: "name",
  },
  {
    header: "Contact",
    accessor: (volunteer) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">
          {volunteer.mobileNumber}
        </span>

        {volunteer.whatsappNumber && (
          <span className="text-xs text-muted-foreground">
            WhatsApp: {volunteer.whatsappNumber}
          </span>
        )}
      </div>
    ),
  },
  {
    header: "Occupation",
    accessor: (volunteer) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium capitalize">
          {volunteer.currentOccupation
            ?.replaceAll("_", " ")
            .toLowerCase()}
        </span>

        {volunteer.organizationName && (
          <span className="text-xs text-muted-foreground">
            {volunteer.organizationName}
          </span>
        )}
      </div>
    ),
    sortKey: "currentOccupation",
  },
  {
    header: "Education",
    accessor: (volunteer) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">
          {volunteer.educationLevel}
        </span>

        {volunteer.departmentDegree && (
          <span className="text-xs text-muted-foreground">
            {volunteer.departmentDegree}
          </span>
        )}

        {volunteer.institutionName && (
          <span className="text-xs text-muted-foreground">
            {volunteer.institutionName}
          </span>
        )}
      </div>
    ),
  },
  {
    header: "Address",
    accessor: (volunteer) => (
      <div className="max-w-55">
        <p
          className="truncate text-sm"
          title={volunteer.currentAddress}
        >
          {volunteer.currentAddress}
        </p>
      </div>
    ),
  },
  {
    header: "Status",
    accessor: (volunteer) => (
      <VolunteerStatusCell volunteer={volunteer} />
    ),
    sortKey: "status",
  },
  {
    header: "Account",
    accessor: (volunteer) => (
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${volunteer.isActive
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
          : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
          }`}
      >
        {volunteer.isActive ? "Active" : "Inactive"}
      </span>
    ),
    sortKey: "isActive",
  },
  {
    header: "Joined",
    accessor: (volunteer) => (
      <DateCell date={volunteer.createdAt} />
    ),
    sortKey: "createdAt",
  },
];