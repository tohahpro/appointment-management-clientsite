import { Column } from "@/components/shared/ManagementTable";
import { ISpecialty } from "../../../../../types/specialities.interface";


export const specialitiesColumns: Column<ISpecialty>[] = [
  {
    header: "Title",
    accessor: (speciality) => speciality.title,
  },
];