import { Button } from "@/components/ui/button";
import { ArrowLeft, UserX } from "lucide-react";
import Link from "next/link";

interface DoctorNotFoundProps {
    message?: string;
}

export default function DoctorNotFound({ message }: DoctorNotFoundProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-4 py-20 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
                <UserX className="size-7 text-muted-foreground" />
            </div>

            <h1 className="text-xl font-semibold">Doctor not found</h1>

            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                {message ||
                    "We couldn't find this doctor's profile. It may have been removed or the link is incorrect."}
            </p>

            <Button asChild className="mt-6">
                <Link href="/consultation/doctors">
                    <ArrowLeft className="mr-2 size-4" />
                    Back to doctors
                </Link>
            </Button>
        </div>
    );
}
