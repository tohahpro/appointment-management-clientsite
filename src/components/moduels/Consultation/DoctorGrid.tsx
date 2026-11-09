import { getAvailableSchedules } from "@/components/moduels/Doctor/DoctorDetails/scheduleUtils";
import { SearchX } from "lucide-react";
import { IDoctor } from "../../../../types/doctor.interface";
import DoctorCard from "./DoctorCard";

interface DoctorGridProps {
  doctors: IDoctor[];
}

export default function DoctorGrid({ doctors }: DoctorGridProps) {
  if (doctors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-16 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
          <SearchX className="size-7" />
        </div>
        <p className="text-lg font-semibold">No doctors found</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          We couldn&apos;t find anyone matching your search. Try adjusting your
          filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {doctors.map((doctor) => {
        const available = getAvailableSchedules(doctor.schedule);

        return (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            availableSlots={available.length}
            nextSlot={available[0]?.startDateTime}
          />
        );
      })}
    </div>
  );
}
