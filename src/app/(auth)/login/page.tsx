import Image from "next/image";
import DoctorLogin from "../../../assets/Images/login.png";
import { LoginForm } from "@/components/moduels/auth/LoginForm";
import BrandLogo from "@/components/shared/BrandLogo";
import Link from "next/link";


const LoginPage = async (
    { searchParams }: { searchParams?: Promise<{ redirect?: string }> }
) => {

    const params = await searchParams || {}

    return (
        <>
            <div className="relative min-h-svh grid grid-cols-1 lg:grid-cols-2">

                {/* ✅ Background Image (Small & Medium) */}
                <div className="absolute inset-0 -z-10 lg:hidden">
                    <Image
                        src={DoctorLogin}
                        alt="Background"
                        fill
                        priority
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60" /> {/* overlay */}
                </div>

                {/* ✅ Left Side Image (Large Device) */}
                <div className="flex flex-col gap-4 p-6 md:p-10 bg-white/30 lg:bg-background backdrop-blur-xs">
                    <Link href='/' className="flex justify-center gap-2 md:justify-start">
                        <BrandLogo />
                    </Link>

                    <div className="flex flex-1 items-center justify-center">
                        <div className="w-full max-w-md lg:max-w-full">
                            <LoginForm redirect={params.redirect} />
                        </div>
                    </div>
                </div>

                {/* ✅ Right Side Content */}
                <div className="relative hidden bg-muted lg:block">
                    <Image
                        src={DoctorLogin}
                        alt="Side Image"
                        fill
                        priority
                        className="object-cover dark:brightness-[0.8]"
                    />
                </div>
            </div>
        </>
    );
};

export default LoginPage;