import ResetPasswordForm from "@/components/moduels/auth/ResetPasswordForm";

export const dynamic = "force-dynamic";

const ResetPasswordPage = async ({
    searchParams,
}: {
    searchParams?: Promise<{ redirect?: string; email?: string; token?: string }> | { redirect?: string; email?: string; token?: string };
}) => {
    const params = searchParams ? await searchParams : {};
    const { redirect, email, token } = params;
    console.log(token)

    return (
        <>
            <div className="relative h-[92.98vh] flex items-center justify-center bg-linear-to-br from-[#fcf9ff] via-[#f0e4ff] to-[#d0abfd]">

                {/* Card Wrapper */}
                <div className="w-full max-w-2xl">

                    {/* Title Section */}
                    <div className="text-center">
                        <h1 className="text-3xl pb-2.5 font-bold bg-linear-to-r from-[#974fef] to-[#7640b8] bg-clip-text text-transparent">
                            Reset Your Password
                        </h1>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                            Enter your new password below to reset your account password
                        </p>
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl border-gray-200/60 lg:bg-white/50  backdrop-blur-xl p-8 transition-all duration-300 mt-8">

                        {/* Decorative top bar */}
                        <div className="flex justify-center gap-2">
                            <span className="h-1 w-16 bg-linear-to-r from-[#974fef] to-[#7640b8] rounded-full mb-6"></span>
                            <span className="h-1 w-16 bg-linear-to-r from-[#974fef] to-[#7640b8] rounded-full mb-6"></span>
                        </div>
                        <ResetPasswordForm redirect={redirect} email={email} token={token} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResetPasswordPage;