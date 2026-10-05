/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import InputFieldError from "@/components/shared/InputFieldError";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/services/auth/auth.service";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { PasswordInput } from "./PasswordInput";
import Link from "next/link";
import SubmitButton from "@/components/shared/SubmitButton";

interface ResetPasswordFormProps {
    redirect?: string;
    email?: string;
    token?: string;
}

const ResetPasswordForm = ({
    redirect,
    email,
    token,
}: ResetPasswordFormProps) => {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(resetPassword, null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (state && !state.success && state.message) {
            console.log(state)
            toast.error(state.message);
        }

        if (state && state.success && state.redirectToLogin) {
            toast.success(state.message);
            setTimeout(() => {
                router.push(redirect || "/login");
            }, 1500);
        }
    }, [state, router, redirect]);

    return (
        <form action={formAction}>
            {redirect && <Input type="hidden" name="redirect" value={redirect} />}
            {email && <Input type="hidden" name="email" value={email} />}
            {token && <Input type="hidden" name="token" value={token} />}
            {email && token && (
                <Input type="hidden" name="isEmailReset" value="true" />
            )}
            <Input
                type="hidden"
                name="isEmailReset"
                value={email && token ? "true" : "false"}
            />
            <FieldGroup>
                <div className="grid grid-cols-1 gap-4">
                    {/* New Password */}
                    <Field>
                        <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                        <PasswordInput
                            id="newPassword"
                            name="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="********"
                            autoComplete="new-password"
                            className="h-11 rounded-lg bg-white/10 lg:text-black lg:placeholder:text-black/40
                               focus:ring-1 focus:ring-[#7640b8] focus:border-[#7640b8]"
                        />
                        <InputFieldError field="newPassword" state={state as any} />
                    </Field>

                    {/* Confirm Password */}
                    <Field>
                        <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                        <PasswordInput
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="********"
                            autoComplete="new-password"
                            className="h-11 rounded-lg bg-white/10 lg:text-black lg:placeholder:text-black/40
                               focus:ring-1 focus:ring-[#7640b8] focus:border-[#7640b8]"
                        />
                        <InputFieldError field="confirmPassword" state={state as any} />
                    </Field>
                </div>

                <FieldGroup className="mt-4">
                    <Field>
                        <SubmitButton
                            type="submit"
                            isLoading={isPending}
                            loadingText="Resetting..."
                            title="Reset Password"
                        />
                        <FieldDescription className="text-center text-sm text-black/50">
                            Back to Login?{" "}
                            <Link
                                href='/login'
                                className="text-[#b480f7] lg:text-[#904be2]/90 underline hover:text-indigo-300 font-medium"
                            >
                                Sign in
                            </Link>
                        </FieldDescription>
                    </Field>
                </FieldGroup>
            </FieldGroup>
        </form>
    );
};

export default ResetPasswordForm;