"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";

function LoginSuccessToastContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        if (searchParams.get('loggedIn') === 'true') {
            toast.success('You have been logged in successfully.');
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete("loggedIn");
            router.replace(newUrl.toString());
        }
    }, [searchParams, router])

    return null;
}

const LoginSuccessToast = () => (
    <Suspense fallback={null}>
        <LoginSuccessToastContent />
    </Suspense>
);

export default LoginSuccessToast;