"use client";

import { useActionState, useEffect, useRef } from "react";
import InputFieldError from "@/components/shared/InputFieldError";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createSpeaciality } from "@/services/admin/specialitiesManagement";
import { ArrowRight, HeartPulse, Loader2, ShieldCheck, Stethoscope } from "lucide-react";
import { toast } from "sonner";

interface ISpecialitiesFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SpecialitiesFormDialog = ({ open, onClose, onSuccess }: ISpecialitiesFormDialogProps) => {
  const [state, formAction, pending] = useActionState(createSpeaciality, null);
  const formRef = useRef<HTMLFormElement>(null);
  const handledState = useRef<typeof state>(null);

  useEffect(() => {
    if (!state || handledState.current === state) return;
    handledState.current = state;

    if (state.success) {
      toast.success(state.message || "Specialty created successfully!");
      formRef.current?.reset();
      onSuccess();
      onClose();
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, onSuccess, onClose]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && !pending && onClose()}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-md gap-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-0 shadow-2xl sm:max-w-lg">
        <div className="relative overflow-hidden border-b border-blue-100 bg-linear-to-br from-blue-50 via-white to-indigo-50 px-6 pb-6 pt-7 sm:px-8">
          <div className="pointer-events-none absolute -right-12 -top-20 size-48 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-10 size-40 rounded-full bg-indigo-200/20 blur-3xl" />
          <DialogHeader className="relative space-y-3 text-left">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-blue-100 bg-white shadow-sm">
              <Stethoscope className="size-6 text-blue-600" />
            </div>
            <div className="space-y-1.5">
              <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
                Add New Specialty
              </DialogTitle>
              <DialogDescription className="max-w-sm text-sm leading-relaxed text-slate-500">
                Create a new medical specialty to organize doctors and help patients find the right care.
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        <form ref={formRef} action={formAction}>
          <div className="space-y-6 px-6 py-7 sm:px-8">
            <Field className="space-y-2">
              <FieldLabel htmlFor="title" className="text-sm font-semibold text-slate-800">
                Specialty Name <span className="text-red-500">*</span>
              </FieldLabel>
              <div className="relative">
                <Stethoscope className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g. Cardiology"
                  autoComplete="off"
                  maxLength={100}
                  required
                  disabled={pending}
                  className="h-12 rounded-xl border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm font-medium text-slate-800 shadow-none transition-all placeholder:font-normal placeholder:text-slate-400 hover:border-blue-200 focus-visible:border-blue-500 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-blue-500/10"
                />
              </div>
              <InputFieldError field="title" state={state} />
              <p className="text-xs leading-relaxed text-slate-400">
                Enter a clear and recognizable medical specialty name.
              </p>
            </Field>

            <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                <HeartPulse className="size-4.5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-blue-900">Medical Specialty</h4>
                <p className="text-xs leading-relaxed text-blue-700/80">
                  This specialty will be available when assigning medical specializations to doctors.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="hidden items-center gap-1.5 text-xs font-medium text-slate-400 sm:flex">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              Admin Management
            </div>
            <div className="flex w-full gap-3 sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={pending}
                className="h-11 flex-1 rounded-xl border-slate-200 bg-white px-5 font-semibold text-slate-600 shadow-none hover:bg-slate-100 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={pending}
                className="h-11 flex-1 gap-2 rounded-xl bg-blue-600 px-6 font-semibold text-white shadow-md shadow-blue-600/15 transition-all hover:bg-blue-700 disabled:opacity-60 sm:flex-none"
              >
                {pending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save Specialty
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SpecialitiesFormDialog;