/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { loginUser } from "@/services/auth/loginUser";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "./PasswordInput";
import { SocialButtons } from "./SocialButtons";
import { toast } from "sonner";
import SubmitButton from "@/components/shared/SubmitButton";


export function LoginForm({ redirect }: { redirect?: string }) {

  const [state, formAction, isPending] = useActionState(loginUser, null);
  const [password, setPassword] = useState("");

  const getFieldError = (fieldName: string) => {
    if (state?.errors) {
      const error = state.errors.find((err: any) => err.field === fieldName);
      return error?.message ?? null;
    }
    return null;
  };

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message || "Login successfully!");
    }
    if (state && !state.success && state.message) {
      console.log(state.message)
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="mx-auto w-full space-y-4 
                bg-black/50 lg:bg-transparent backdrop-blur-2xl 
                rounded-2xl p-6 sm:p-8 
                border-white/20 shadow-2xl lg:shadow-none">

      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold tracking-tight py-2 bg-linear-to-r from-[#974fef] to-[#7640b8] text-transparent inline-block "
          style={{ WebkitBackgroundClip: "text" }}>
          Login to your account
        </h1>
        <p className="text-white/70 lg:text-black/70 text-sm">
          Your Journey to Better Health Starts Here.
        </p>
      </div>

      <form action={formAction} className="space-y-4 max-w-md mx-auto">
        {
          redirect && <input type="hidden" name="redirect" value={redirect} />
        }
        <div className="gap-4 space-y-2">
          {/* Email */}
          <Field className="">
            <FieldLabel className="text-white/80 lg:text-black">
              Email
            </FieldLabel>
            <Input
              name="email"
              type="email"
              placeholder="m@example.com"
              className="h-11 rounded-lg bg-white/10 border border-white/10 lg:border-[#393737]/10
                        text-white lg:text-black placeholder:text-white/40 lg:placeholder:text-black/40
                        focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            />
            {getFieldError("email") && (
              <FieldDescription className="text-rose-400 text-xs">
                {getFieldError("email")}
              </FieldDescription>
            )}
          </Field>

          {/* Password */}
          <Field className="">
            <FieldLabel className="text-white/80 lg:text-black">
              Password
            </FieldLabel>
            <PasswordInput
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="h-11 rounded-lg bg-white/10 border border-white/20 lg:border-[#393737]/10
                               text-white lg:text-black placeholder:text-white/40 lg:placeholder:text-black/40
                               focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            />

            {getFieldError("password") && (
              <FieldDescription className="text-rose-400 text-xs">
                {getFieldError("password")}
              </FieldDescription>
            )}
          </Field>

        </div>

        {/* Submit Button */}
        <SubmitButton
          type="submit"
          isLoading={isPending}
          loadingText="Logging in..."
          title="Login"
        />
      </form>

      {/* Footer */}
      <div className="max-w-md mx-auto space-y-2">
        {/* Divider */}
        {/* <div className="flex items-center gap-1">
          <div className="flex-1 h-px bg-white/20 lg:bg-black/20"></div>
          <span className="text-sm text-white/60 lg:text-black/50 px-2">
            Continue with
          </span>
          <div className="flex-1 h-px bg-white/20 lg:bg-black/20"></div>
        </div> */}
        {/* <SocialButtons /> */}
        <FieldDescription className="text-center text-sm text-white/70 lg:text-black/60">
          {`Don't have an account?`}{" "}
          <Link
            href='/register'
            className="text-[#b480f7] lg:text-[#904be2]/90 underline hover:text-indigo-300 font-medium"
          >
            Sign Up
          </Link>
        </FieldDescription>
        {/* <FieldDescription className="px-6 text-center">
          <Link
            href="/forgot-password"
            className="text-[#b480f7] lg:text-[#904be2]/90 underline hover:text-indigo-300 font-medium"
          >
            Forgot password?
          </Link>
        </FieldDescription> */}
      </div>

    </div>


  );
}
