"use client";

import SubmitButton from "@/components/shared/SubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword } from "@/services/auth/auth.service";
import { CheckCircle, Mail } from "lucide-react";
import { useActionState } from "react";

const ForgotPasswordForm = () => {
    const [state, formAction, isPending] = useActionState(forgotPassword, null);

    return (
        <form action={formAction} className="space-y-6">
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
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                    <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        required
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={state?.formData?.email || ""}
                        placeholder="m@example.com"
                        disabled={isPending}
                        className="h-10 rounded-lg  border  border-[#393737]/10
                         text-black placeholder:text-black/40
                        focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                    />
                </div>
                {state?.errors?.find((e: any) => e.field === "email") && (
                    <p className="text-sm text-red-500">
                        {state.errors.find((e: any) => e.field === "email")?.message}
                    </p>
                )}
            </Field>
            <SubmitButton
                type="submit"
                isLoading={isPending}
                loadingText="Sending Reset Link..."
                title="Send Reset Link"
            />
        </form>
    );
};

export default ForgotPasswordForm;