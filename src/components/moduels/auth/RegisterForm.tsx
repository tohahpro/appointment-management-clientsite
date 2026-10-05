"use client";

import React, {
    useActionState,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    ArrowLeft,
    ArrowRight,
    BadgeCheck,
    Check,
    CircleUserRound,
    Home,
    LockKeyhole,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    UserRound,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Field,
    FieldDescription,
    FieldLabel,
} from "@/components/ui/field";

import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { registerPatient } from "@/services/auth/registerPatient";


/* =========================================================
   Types
========================================================= */

type FormState = {
    success?: boolean;
    message?: string;

    errors?: {
        field: string;
        message: string;
    }[];

    formData?: Record<string, unknown>;
};

type StepKey =
    | "account"
    | "personal"
    | "profile"
    | "verification";

type Step = {
    id: number;
    key: StepKey;
    title: string;
    shortTitle: string;
    description: string;
    icon: React.ElementType;
};

type PatientFormData = {
    name: string;
    email: string;

    password: string;
    confirmPassword: string;

    contactNumber: string;
    address: string;

    profilePhoto: File | null;
};

type LocalErrors = Record<string, string>;

/* =========================================================
   Steps
========================================================= */

const steps: Step[] = [
    {
        id: 1,
        key: "account",
        title: "Account Details",
        shortTitle: "Account",
        description: "Create your patient account",
        icon: LockKeyhole,
    },
    {
        id: 2,
        key: "personal",
        title: "Personal Information",
        shortTitle: "Personal",
        description: "Contact & address details",
        icon: UserRound,
    },
    {
        id: 3,
        key: "profile",
        title: "Profile Photo",
        shortTitle: "Profile",
        description: "Add your profile picture",
        icon: CircleUserRound,
    },
    {
        id: 4,
        key: "verification",
        title: "Review & Submit",
        shortTitle: "Review",
        description: "Check your information",
        icon: ShieldCheck,
    },
];

const initialFormData: PatientFormData = {
    name: "",
    email: "",

    password: "",
    confirmPassword: "",

    contactNumber: "",
    address: "",

    profilePhoto: null,
};

/* =========================================================
   Error field -> step
========================================================= */

const fieldStepMap: Record<string, number> = {
    name: 1,
    email: 1,
    password: 1,
    confirmPassword: 1,

    contactNumber: 2,
    address: 2,

    profilePhoto: 3,
    file: 3,
};

/* =========================================================
   Component
========================================================= */

export default function PatientRegistrationForm() {

    const [state, formAction, isPending] = useActionState<FormState | null, FormData>(registerPatient, null);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<PatientFormData>(initialFormData);
    const [localErrors, setLocalErrors] = useState<LocalErrors>({});

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    /* =====================================================
       Derived values
    ===================================================== */

    const progress =
        (currentStep / steps.length) * 100;

    const currentStepData = useMemo(() => {
        return (
            steps.find(
                (step) =>
                    step.id === currentStep
            ) ?? steps[0]
        );
    }, [currentStep]);

    /* =====================================================
       Backend error -> correct step
    ===================================================== */

    useEffect(() => {
        if (!state?.errors?.length) {
            return;
        }

        const firstError =
            state.errors[0];

        const errorStep =
            fieldStepMap[firstError.field];

        if (errorStep) {
            setCurrentStep(errorStep);
        }
    }, [state]);

    /* =====================================================
       Update field
    ===================================================== */

    const updateField = <
        K extends keyof PatientFormData,
    >(
        field: K,
        value: PatientFormData[K]
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        setLocalErrors((prev) => {
            if (!prev[field]) {
                return prev;
            }

            const next = {
                ...prev,
            };

            delete next[field];

            return next;
        });
    };

    /* =====================================================
       Error helper
    ===================================================== */

    const getFieldError = (
        field: string
    ) => {
        if (localErrors[field]) {
            return localErrors[field];
        }

        return state?.errors?.find(
            (error) =>
                error.field === field
        )?.message;
    };

    /* =====================================================
       Validate each step
    ===================================================== */

    const validateStep = () => {
        const errors: LocalErrors = {};

        /* ---------------- STEP 1 ---------------- */

        if (currentStep === 1) {
            if (!formData.name.trim()) {
                errors.name = "Full name is required";
            } else if (
                formData.name.trim().length < 2
            ) {
                errors.name = "Name must be at least 2 characters";
            }

            if (!formData.email.trim()) {
                errors.email =
                    "Email address is required";
            } else if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                    formData.email
                )
            ) {
                errors.email =
                    "Please enter a valid email address";
            }

            if (!formData.password) {
                errors.password =
                    "Password is required";
            } else if (
                formData.password.length < 6
            ) {
                errors.password =
                    "Password must be at least 6 characters";
            }

            if (
                !formData.confirmPassword
            ) {
                errors.confirmPassword =
                    "Please confirm your password";
            } else if (
                formData.password !==
                formData.confirmPassword
            ) {
                errors.confirmPassword =
                    "Passwords do not match";
            }
        }

        /* ---------------- STEP 2 ---------------- */

        if (currentStep === 2) {
            if (
                formData.contactNumber &&
                formData.contactNumber
                    .trim()
                    .length < 8
            ) {
                errors.contactNumber =
                    "Please enter a valid contact number";
            }

            if (
                formData.address &&
                formData.address
                    .trim()
                    .length < 3
            ) {
                errors.address =
                    "Please enter a valid address";
            }
        }

        setLocalErrors(errors);

        return (
            Object.keys(errors).length ===
            0
        );
    };

    /* =====================================================
       Navigation
    ===================================================== */

    const goNext = () => {
        if (!validateStep()) {
            return;
        }

        if (
            currentStep < steps.length
        ) {
            setCurrentStep(
                (prev) => prev + 1
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    };

    const goPrevious = () => {
        if (currentStep <= 1) {
            return;
        }

        setLocalErrors({});

        setCurrentStep(
            (prev) => prev - 1
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const goToStep = (
        stepId: number
    ) => {
        if (
            stepId <= currentStep
        ) {
            setLocalErrors({});
            setCurrentStep(stepId);
        }
    };

    /* =====================================================
       File
    ===================================================== */

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file =
            event.target.files?.[0] ??
            null;

        updateField(
            "profilePhoto",
            file
        );
    };

    const removePhoto = () => {
        updateField(
            "profilePhoto",
            null
        );

        if (fileInputRef.current) {
            fileInputRef.current.value =
                "";
        }
    };

    /* =====================================================
       UI
    ===================================================== */

    return (
        <div className="min-h-screen bg-slate-50/70">
            <div className="mx-auto w-full max-w-[1450px] px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">

                {/* =========================================
                    Mobile Header
                ========================================= */}

                <div className="mb-4 lg:hidden">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                        Patient Enrollment
                    </p>

                    <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                        Create Patient Account
                    </h1>

                    <p className="mt-1 max-w-lg text-sm leading-6 text-slate-500">
                        Create your account to
                        book appointments and
                        manage your healthcare.
                    </p>
                </div>

                {/* =========================================
                    Mobile Progress
                ========================================= */}

                <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
                    <div className="mb-3 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-medium text-slate-500">
                                Step{" "}
                                {currentStep} of{" "}
                                {steps.length}
                            </p>

                            <p className="mt-0.5 text-sm font-semibold text-slate-900">
                                {
                                    currentStepData.title
                                }
                            </p>
                        </div>

                        <div className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            {Math.round(
                                progress
                            )}
                            %
                        </div>
                    </div>

                    <Progress
                        value={progress}
                        className="h-1.5"
                    />

                    <div className="mt-4 flex items-center">
                        {steps.map(
                            (step) => {
                                const completed =
                                    step.id <
                                    currentStep;

                                const active =
                                    step.id ===
                                    currentStep;

                                return (
                                    <React.Fragment
                                        key={
                                            step.id
                                        }
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                goToStep(
                                                    step.id
                                                )
                                            }
                                            className={[
                                                "flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition",
                                                completed
                                                    ? "border-blue-600 bg-blue-600 text-white"
                                                    : active
                                                        ? "border-blue-600 bg-blue-50 text-blue-700"
                                                        : "border-slate-200 bg-white text-slate-400",
                                            ].join(
                                                " "
                                            )}
                                        >
                                            {completed ? (
                                                <Check className="size-4" />
                                            ) : (
                                                step.id
                                            )}
                                        </button>

                                        {step.id !==
                                            steps.length && (
                                                <div
                                                    className={[
                                                        "mx-1 h-px flex-1",
                                                        completed
                                                            ? "bg-blue-600"
                                                            : "bg-slate-200",
                                                    ].join(
                                                        " "
                                                    )}
                                                />
                                            )}
                                    </React.Fragment>
                                );
                            }
                        )}
                    </div>
                </div>

                <div className="grid items-start gap-5 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[350px_minmax(0,1fr)]">

                    {/* =========================================
                        Desktop Sidebar
                    ========================================= */}

                    <aside className="sticky top-6 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
                        <div className="p-6 xl:p-7">
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                                Patient Enrollment
                            </p>

                            <h1 className="mt-2 text-[26px] font-bold tracking-tight text-slate-950">
                                Patient Registration
                            </h1>

                            <p className="mt-1.5 text-sm leading-6 text-slate-500">
                                Create your patient
                                profile to easily find
                                doctors and manage
                                appointments.
                            </p>

                            <div className="mt-6">
                                <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                                    <span className="font-semibold text-slate-900">
                                        Step{" "}
                                        {currentStep}{" "}
                                        of{" "}
                                        {
                                            steps.length
                                        }
                                    </span>

                                    <span className="font-medium text-slate-500">
                                        {Math.round(
                                            progress
                                        )}
                                        % Complete
                                    </span>
                                </div>

                                <Progress
                                    value={
                                        progress
                                    }
                                    className="h-1.5"
                                />
                            </div>
                        </div>

                        <Separator />

                        <div className="p-6 xl:p-7">
                            {steps.map(
                                (
                                    step,
                                    index
                                ) => {
                                    const Icon =
                                        step.icon;

                                    const active =
                                        currentStep ===
                                        step.id;

                                    const completed =
                                        step.id <
                                        currentStep;

                                    return (
                                        <div
                                            key={
                                                step.id
                                            }
                                            className="relative flex min-h-[84px] gap-4"
                                        >
                                            {index !==
                                                steps.length -
                                                1 && (
                                                    <div
                                                        className={[
                                                            "absolute left-[17px] top-9 h-[48px] w-px",
                                                            completed
                                                                ? "bg-blue-500"
                                                                : "bg-slate-200",
                                                        ].join(
                                                            " "
                                                        )}
                                                    />
                                                )}

                                            <button
                                                type="button"
                                                disabled={
                                                    step.id >
                                                    currentStep
                                                }
                                                onClick={() =>
                                                    goToStep(
                                                        step.id
                                                    )
                                                }
                                                className={[
                                                    "relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border transition-all",
                                                    completed
                                                        ? "border-blue-600 bg-blue-600 text-white"
                                                        : active
                                                            ? "border-blue-600 bg-blue-50 text-blue-700 ring-4 ring-blue-50"
                                                            : "border-slate-200 bg-white text-slate-400",
                                                ].join(
                                                    " "
                                                )}
                                            >
                                                {completed ? (
                                                    <Check className="size-4" />
                                                ) : (
                                                    <Icon className="size-4" />
                                                )}
                                            </button>

                                            <div className="min-w-0 pt-0.5">
                                                <p
                                                    className={[
                                                        "text-sm font-semibold",
                                                        active ||
                                                            completed
                                                            ? "text-slate-950"
                                                            : "text-slate-500",
                                                    ].join(
                                                        " "
                                                    )}
                                                >
                                                    {
                                                        step.shortTitle
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                                    {
                                                        step.description
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>

                        <div className="border-t bg-slate-50/70 p-5">
                            <div className="flex gap-3">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                    <BadgeCheck className="size-4" />
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-slate-800">
                                        Secure
                                        Registration
                                    </p>

                                    <p className="mt-0.5 text-xs leading-5 text-slate-500">
                                        Your account
                                        information is
                                        securely
                                        processed.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* =========================================
                        Main Form
                    ========================================= */}

                    <form
                        action={formAction}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                    >
                        {/* =====================================
                            Persistent values
                        ===================================== */}

                        <input
                            type="hidden"
                            name="name"
                            value={
                                formData.name
                            }
                        />

                        <input
                            type="hidden"
                            name="email"
                            value={
                                formData.email
                            }
                        />

                        <input
                            type="hidden"
                            name="password"
                            value={
                                formData.password
                            }
                        />

                        <input
                            type="hidden"
                            name="confirmPassword"
                            value={
                                formData.confirmPassword
                            }
                        />

                        <input
                            type="hidden"
                            name="contactNumber"
                            value={
                                formData.contactNumber
                            }
                        />

                        <input
                            type="hidden"
                            name="address"
                            value={
                                formData.address
                            }
                        />

                        {/* =====================================
                            Persistent file input
                        ===================================== */}

                        <input
                            ref={fileInputRef}
                            name="file"
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={
                                handleFileChange
                            }
                            className="hidden"
                        />

                        {/* =====================================
                            Form Header
                        ===================================== */}

                        <div className="border-b px-5 py-5 sm:px-7 lg:px-8 lg:py-6">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <p className="text-xs font-medium text-slate-500">
                                        Step{" "}
                                        {
                                            currentStep
                                        }{" "}
                                        of{" "}
                                        {
                                            steps.length
                                        }
                                    </p>

                                    <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                                        {
                                            currentStepData.title
                                        }
                                    </h2>

                                    <p className="mt-1.5 text-sm text-slate-500">
                                        {
                                            currentStepData.description
                                        }
                                    </p>
                                </div>

                                <Badge
                                    variant="secondary"
                                    className="w-fit rounded-full bg-blue-50 px-3 py-1.5 font-medium text-blue-700 hover:bg-blue-50"
                                >
                                    {
                                        currentStepData.shortTitle
                                    }
                                </Badge>
                            </div>
                        </div>

                        {/* =====================================
                            Form body
                        ===================================== */}

                        <div className="min-h-[430px] px-5 py-6 sm:px-7 lg:px-8 lg:py-8">

                            {/* =================================
                                STEP 1
                            ================================= */}

                            {currentStep ===
                                1 && (
                                    <div className="mx-auto max-w-4xl space-y-6">
                                        <SectionTitle
                                            title="Create your patient account"
                                            description="Use your personal email address to access appointments, prescriptions and account information."
                                        />

                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <Field>
                                                <FieldLabel>
                                                    Full
                                                    Name
                                                    <Required />
                                                </FieldLabel>

                                                <InputWrapper
                                                    icon={
                                                        UserRound
                                                    }
                                                >
                                                    <Input
                                                        value={
                                                            formData.name
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            updateField(
                                                                "name",
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder="e.g. John Doe"
                                                        className="h-12 border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0"
                                                    />
                                                </InputWrapper>

                                                <ErrorText
                                                    message={getFieldError(
                                                        "name"
                                                    )}
                                                />
                                            </Field>

                                            <Field>
                                                <FieldLabel>
                                                    Email
                                                    Address
                                                    <Required />
                                                </FieldLabel>

                                                <InputWrapper
                                                    icon={
                                                        Mail
                                                    }
                                                >
                                                    <Input
                                                        type="email"
                                                        value={
                                                            formData.email
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            updateField(
                                                                "email",
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder="e.g. john@example.com"
                                                        className="h-12 border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0"
                                                    />
                                                </InputWrapper>

                                                <ErrorText
                                                    message={getFieldError(
                                                        "email"
                                                    )}
                                                />
                                            </Field>
                                        </div>

                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <Field>
                                                <FieldLabel>
                                                    Password
                                                    <Required />
                                                </FieldLabel>

                                                <InputWrapper
                                                    icon={
                                                        LockKeyhole
                                                    }
                                                >
                                                    <Input
                                                        type="password"
                                                        value={
                                                            formData.password
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            updateField(
                                                                "password",
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder="Minimum 6 characters"
                                                        className="h-12 border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0"
                                                    />
                                                </InputWrapper>

                                                <ErrorText
                                                    message={getFieldError(
                                                        "password"
                                                    )}
                                                />
                                            </Field>

                                            <Field>
                                                <FieldLabel>
                                                    Confirm
                                                    Password
                                                    <Required />
                                                </FieldLabel>

                                                <InputWrapper
                                                    icon={
                                                        LockKeyhole
                                                    }
                                                >
                                                    <Input
                                                        type="password"
                                                        value={
                                                            formData.confirmPassword
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            updateField(
                                                                "confirmPassword",
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder="Re-enter password"
                                                        className="h-12 border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0"
                                                    />
                                                </InputWrapper>

                                                <ErrorText
                                                    message={getFieldError(
                                                        "confirmPassword"
                                                    )}
                                                />
                                            </Field>
                                        </div>
                                    </div>
                                )}

                            {/* =================================
                                STEP 2
                            ================================= */}

                            {currentStep ===
                                2 && (
                                    <div className="mx-auto max-w-4xl space-y-6">
                                        <SectionTitle
                                            title="Personal information"
                                            description="Add your contact information to help manage your appointments and patient profile."
                                        />

                                        <Field>
                                            <FieldLabel>
                                                Contact
                                                Number
                                            </FieldLabel>

                                            <InputWrapper
                                                icon={
                                                    Phone
                                                }
                                            >
                                                <Input
                                                    value={
                                                        formData.contactNumber
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        updateField(
                                                            "contactNumber",
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="+880 1XXX-XXXXXX"
                                                    className="h-12 border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0"
                                                />
                                            </InputWrapper>

                                            <FieldDescription>
                                                Optional,
                                                but useful
                                                for
                                                appointment
                                                communication.
                                            </FieldDescription>

                                            <ErrorText
                                                message={getFieldError(
                                                    "contactNumber"
                                                )}
                                            />
                                        </Field>

                                        <Field>
                                            <FieldLabel>
                                                Address
                                            </FieldLabel>

                                            <InputWrapper
                                                icon={
                                                    MapPin
                                                }
                                            >
                                                <Input
                                                    value={
                                                        formData.address
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        updateField(
                                                            "address",
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="House, road, city, country"
                                                    className="h-12 border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0"
                                                />
                                            </InputWrapper>

                                            <FieldDescription>
                                                Your
                                                residential
                                                address is
                                                optional.
                                            </FieldDescription>

                                            <ErrorText
                                                message={getFieldError(
                                                    "address"
                                                )}
                                            />
                                        </Field>

                                        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                                            <div className="flex gap-3">
                                                <Home className="mt-0.5 size-5 shrink-0 text-blue-600" />

                                                <div>
                                                    <p className="text-sm font-semibold text-blue-950">
                                                        Keep
                                                        your
                                                        profile
                                                        updated
                                                    </p>

                                                    <p className="mt-1 text-xs leading-5 text-blue-800/70">
                                                        You
                                                        can
                                                        update
                                                        these
                                                        details
                                                        later
                                                        from
                                                        your
                                                        patient
                                                        dashboard.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            {/* =================================
                                STEP 3
                            ================================= */}

                            {currentStep ===
                                3 && (
                                    <div className="mx-auto max-w-4xl space-y-6">
                                        <SectionTitle
                                            title="Add a profile photo"
                                            description="A profile photo makes your account easier to recognize. You can also add one later."
                                        />

                                        <div className="mx-auto max-w-xl">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                                className="group flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-6 py-12 text-center transition hover:border-blue-400 hover:bg-blue-50/40"
                                            >
                                                <div className="flex size-16 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition group-hover:text-blue-600">
                                                    <CircleUserRound className="size-8" />
                                                </div>

                                                <p className="mt-4 text-sm font-semibold text-slate-900">
                                                    {formData.profilePhoto
                                                        ? formData
                                                            .profilePhoto
                                                            .name
                                                        : "Upload profile photo"}
                                                </p>

                                                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                                                    PNG,
                                                    JPG or
                                                    WEBP.
                                                    Recommended
                                                    square
                                                    image.
                                                </p>

                                                <div className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm">
                                                    Choose
                                                    Image
                                                </div>
                                            </button>

                                            {formData.profilePhoto && (
                                                <div className="mt-3 flex justify-center">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={
                                                            removePhoto
                                                        }
                                                        className="gap-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                                    >
                                                        <X className="size-4" />
                                                        Remove
                                                        photo
                                                    </Button>
                                                </div>
                                            )}

                                            <p className="mt-5 text-center text-xs leading-5 text-slate-500">
                                                Profile
                                                photo is
                                                optional.
                                                You can
                                                skip this
                                                step and
                                                upload one
                                                later.
                                            </p>
                                        </div>
                                    </div>
                                )}

                            {/* =================================
                                STEP 4
                            ================================= */}

                            {currentStep ===
                                4 && (
                                    <div className="mx-auto max-w-4xl space-y-6">
                                        <SectionTitle
                                            title="Review your information"
                                            description="Check your account information before creating your patient profile."
                                        />

                                        <ReviewSection
                                            title="Account Information"
                                            items={[
                                                [
                                                    "Full Name",
                                                    formData.name,
                                                ],
                                                [
                                                    "Email Address",
                                                    formData.email,
                                                ],
                                            ]}
                                        />

                                        <ReviewSection
                                            title="Personal Information"
                                            items={[
                                                [
                                                    "Contact Number",
                                                    formData.contactNumber,
                                                ],
                                                [
                                                    "Address",
                                                    formData.address,
                                                ],
                                                [
                                                    "Profile Photo",
                                                    formData.profilePhoto
                                                        ? formData
                                                            .profilePhoto
                                                            .name
                                                        : "Not uploaded",
                                                ],
                                            ]}
                                        />

                                        <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
                                            <div className="flex gap-3">
                                                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-blue-600" />

                                                <div>
                                                    <p className="text-sm font-semibold text-blue-950">
                                                        Ready
                                                        to
                                                        create
                                                        your
                                                        account
                                                    </p>

                                                    <p className="mt-1 text-sm leading-6 text-blue-800/80">
                                                        By
                                                        creating
                                                        your
                                                        account,
                                                        you
                                                        confirm
                                                        that
                                                        the
                                                        provided
                                                        information
                                                        is
                                                        correct.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                        </div>

                        {/* =====================================
                            Server message
                        ===================================== */}

                        {state?.message && (
                            <div className="px-5 pb-4 sm:px-7 lg:px-8">
                                <div
                                    className={[
                                        "rounded-xl border px-4 py-3 text-sm",
                                        state.success
                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                            : "border-rose-200 bg-rose-50 text-rose-700",
                                    ].join(
                                        " "
                                    )}
                                >
                                    {
                                        state.message
                                    }
                                </div>
                            </div>
                        )}

                        {/* =====================================
                            Footer
                        ===================================== */}

                        <div className="border-t bg-slate-50/60 px-5 py-4 sm:px-7 lg:px-8">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    {currentStep >
                                        1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={
                                                    goPrevious
                                                }
                                                disabled={
                                                    isPending
                                                }
                                                className="h-11 gap-2 rounded-xl px-4 sm:px-5"
                                            >
                                                <ArrowLeft className="size-4" />

                                                <span className="hidden sm:inline">
                                                    Previous
                                                </span>
                                            </Button>
                                        )}
                                </div>

                                <div className="hidden text-xs font-medium text-slate-500 sm:block">
                                    Step{" "}
                                    {
                                        currentStep
                                    }{" "}
                                    of{" "}
                                    {
                                        steps.length
                                    }
                                </div>

                                {currentStep <
                                    steps.length ? (
                                    <Button
                                        type="button"
                                        onClick={
                                            goNext
                                        }
                                        className="h-11 gap-2 rounded-xl bg-blue-600 px-5 font-semibold text-white shadow-sm shadow-blue-200 hover:bg-blue-700 sm:px-6"
                                    >
                                        Continue

                                        <ArrowRight className="size-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        disabled={
                                            isPending
                                        }
                                        className="h-11 gap-2 rounded-xl bg-blue-600 px-5 font-semibold text-white shadow-sm shadow-blue-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:px-6"
                                    >
                                        {isPending ? (
                                            "Creating Account..."
                                        ) : (
                                            <>
                                                Create
                                                Account

                                                <ShieldCheck className="size-4" />
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   Reusable Components
========================================================= */

function Required() {
    return (
        <span className="ml-1 text-rose-500">
            *
        </span>
    );
}

function SectionTitle({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="border-b border-slate-100 pb-5">
            <h3 className="text-base font-semibold text-slate-950 sm:text-lg">
                {title}
            </h3>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                {description}
            </p>
        </div>
    );
}

function InputWrapper({
    icon: Icon,
    children,
}: {
    icon: React.ElementType;
    children: React.ReactNode;
}) {
    return (
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50">
            <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

            {children}
        </div>
    );
}

function ErrorText({
    message,
}: {
    message?: string | null;
}) {
    if (!message) {
        return null;
    }

    return (
        <FieldDescription className="text-xs font-medium text-rose-500">
            {message}
        </FieldDescription>
    );
}

function ReviewSection({
    title,
    items,
}: {
    title: string;
    items: [string, string][];
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="border-b bg-slate-50/80 px-5 py-3">
                <p className="text-sm font-semibold text-slate-900">
                    {title}
                </p>
            </div>

            <div className="grid sm:grid-cols-2">
                {items.map(
                    ([label, value]) => (
                        <div
                            key={label}
                            className="border-b border-slate-100 px-5 py-4"
                        >
                            <p className="text-xs font-medium text-slate-500">
                                {label}
                            </p>

                            <p className="mt-1 break-words text-sm font-semibold text-slate-900">
                                {value ||
                                    "Not provided"}
                            </p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}