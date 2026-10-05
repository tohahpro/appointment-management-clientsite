import PatientRegistrationForm from "@/components/moduels/auth/RegisterForm";
import BrandLogo from "@/components/shared/BrandLogo";
import Link from "next/link";



const PatientPage = () => {

    return (
        <>
            <div className="flex flex-col gap-4 p-6 md:p-10 bg-white/30 lg:bg-background backdrop-blur-xs">
                <Link href='/' className="flex justify-center gap-2 md:justify-start">
                    <BrandLogo />
                </Link>

                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xl lg:max-w-full">
                        <PatientRegistrationForm />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PatientPage;