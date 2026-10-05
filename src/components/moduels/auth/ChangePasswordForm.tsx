"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { PasswordInput } from "./PasswordInput";
import { changePassword } from "@/services/auth/auth.service";
import { PasswordStrength } from "./PasswordStrength";
import SubmitButton from "@/components/shared/SubmitButton";


const ChangePasswordForm = () => {

    const [state, formAction, isPending] = useActionState(changePassword, null);
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formKey, setFormKey] = useState(0);


    useEffect(() => {
        if (!state?.success) return;
        setTimeout(() => {
            setFormKey(prev => prev + 1);
            // Controlled state reset
            setPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }, 0);
    }, [state?.success]);

    return (
        <form key={formKey} action={formAction} className="space-y-3 bg-transparent">
            {state?.success && (
                <Alert className="border-green-500 bg-green-50 text-green-900">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}

            {state?.success === false && (
                <Alert variant="destructive">
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}

            <Field>
                <Label htmlFor="oldPassword">Current Password</Label>
                <PasswordInput
                    id="oldPassword"
                    name="oldPassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    required
                    disabled={isPending}
                    className="h-11 rounded-lg bg-white/10 lg:text-black lg:placeholder:text-black/40
                               focus:ring-1 focus:ring-[#7640b8] focus:border-[#7640b8]"
                />
                {state?.errors?.find((e: any) => e.field === "oldPassword") && (
                    <p className="text-sm text-red-500">
                        {state.errors.find((e: any) => e.field === "oldPassword")?.message}
                    </p>
                )}
            </Field>

            <Field>
                <Label htmlFor="newPassword">New Password</Label>
                <PasswordInput
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="********"
                    required
                    disabled={isPending}
                    className="h-11 rounded-lg bg-white/10 lg:text-black lg:placeholder:text-black/40
                               focus:ring-1 focus:ring-[#7640b8] focus:border-[#7640b8]"
                />

                {state?.errors?.find((e: any) => e.field === "newPassword") && (
                    <p className="text-sm text-red-500">
                        {state.errors.find((e: any) => e.field === "newPassword")?.message}
                    </p>
                )}
            </Field>

            <Field>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="********"
                    required
                    disabled={isPending}
                    className="h-11 rounded-lg bg-white/10 lg:text-black lg:placeholder:text-black/40
                               focus:ring-1 focus:ring-[#7640b8] focus:border-[#7640b8]"
                />
                {state?.errors?.find((e: any) => e.field === "confirmPassword") && (
                    <p className="text-sm text-red-500">
                        {state.errors.find((e: any) => e.field === "confirmPassword")?.message}
                    </p>
                )}
            </Field>
            <PasswordStrength password={newPassword} />
            <SubmitButton
                type="submit"
                isLoading={isPending}
                loadingText="Changing Password..."
                title="Change Password"
            />
        </form>
    );
};

export default ChangePasswordForm;