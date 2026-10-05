"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";

function LogoutSuccessToastContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        if (searchParams.get('loggedOut') === 'true') {
            toast.success('You have been logged out successfully.');

            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete("loggedOut");
            router.replace(newUrl.toString());
        }
    }, [searchParams, router])

    return null;
}

const LogoutSuccessToast = () => (
    <Suspense fallback={null}>
        <LogoutSuccessToastContent />
    </Suspense>
);

export default LogoutSuccessToast;