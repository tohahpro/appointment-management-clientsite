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
    BriefcaseMedical,
    Building2,
    Check,
    CircleUserRound,
    FileBadge2,
    GraduationCap,
    LockKeyhole,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    Stethoscope,
    UserRound,
    WalletCards,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Field,
    FieldDescription,
    FieldLabel,
} from "@/components/ui/field";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { registerDoctor } from "@/services/auth/registerDoctor";

/* =========================================================
   Types
========================================================= */

type Specialty = {
    id: string;
    title: string;
};

type DoctorRegistrationFormProps = {
    specialties: Specialty[];
};

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
    | "credentials"
    | "consultation"
    | "verification";

type Step = {
    id: number;
    key: StepKey;
    title: string;
    shortTitle: string;
    description: string;
    icon: React.ElementType;
};

type DoctorFormData = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;

    contactNumber: string;
    address: string;
    gender: string;
    profilePhoto: File | null;

    registrationNumber: string;
    qualification: string;
    experience: string;

    appointmentFee: string;
    currentWorkingPlace: string;
    designation: string;

    specialties: string[];
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
        description: "Email & secure password",
        icon: LockKeyhole,
    },
    {
        id: 2,
        key: "personal",
        title: "Personal Information",
        shortTitle: "Personal",
        description: "Identity, photo & contact",
        icon: CircleUserRound,
    },
    {
        id: 3,
        key: "credentials",
        title: "Professional Credentials",
        shortTitle: "Credentials",
        description: "Registration & qualifications",
        icon: FileBadge2,
    },
    {
        id: 4,
        key: "consultation",
        title: "Consultation Details",
        shortTitle: "Consultation",
        description: "Workplace, fee & specialty",
        icon: Stethoscope,
    },
    {
        id: 5,
        key: "verification",
        title: "Review & Verification",
        shortTitle: "Verification",
        description: "Review your application",
        icon: ShieldCheck,
    },
];

const initialFormData: DoctorFormData = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",

    contactNumber: "",
    address: "",
    gender: "",
    profilePhoto: null,

    registrationNumber: "",
    qualification: "",
    experience: "",

    appointmentFee: "",
    currentWorkingPlace: "",
    designation: "",

    specialties: [],
};

/* =========================================================
   Field -> Step mapping
========================================================= */

const fieldStepMap: Record<string, number> = {
    name: 1,
    email: 1,
    password: 1,
    confirmPassword: 1,

    contactNumber: 2,
    address: 2,
    gender: 2,
    profilePhoto: 2,
    file: 2,
    registrationNumber: 3,
    qualification: 3,
    experience: 3,
    specialties: 4,
    appointmentFee: 4,
    currentWorkingPlace: 4,
    designation: 4,
};

/* =========================================================
   Component
========================================================= */

export default function DoctorRegistrationForm({
    specialties,
}: DoctorRegistrationFormProps) {
    const [state, formAction, isPending] = useActionState<
        FormState | null,
        FormData
    >(registerDoctor, null);

    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] =
        useState<DoctorFormData>(initialFormData);

    const [localErrors, setLocalErrors] =
        useState<LocalErrors>({});

    const [specialtyToAdd, setSpecialtyToAdd] =
        useState("");

    const fileInputRef =
        useRef<HTMLInputElement | null>(null);

    /* =====================================================
       Derived values
    ===================================================== */

    const progress =
        (currentStep / steps.length) * 100;

    const currentStepData = useMemo(() => {
        return (
            steps.find(
                (step) => step.id === currentStep
            ) ?? steps[0]
        );
    }, [currentStep]);

    const selectedSpecialties = useMemo(() => {
        return specialties.filter((specialty) =>
            formData.specialties.includes(
                specialty.id
            )
        );
    }, [specialties, formData.specialties]);

    const availableSpecialties = useMemo(() => {
        return specialties.filter(
            (specialty) =>
                !formData.specialties.includes(
                    specialty.id
                )
        );
    }, [specialties, formData.specialties]);

    /* =====================================================
       Server validation error -> go to related step
    ===================================================== */

    useEffect(() => {
        if (!state?.errors?.length) return;

        const firstError =
            state.errors[0];

        const errorStep =
            fieldStepMap[firstError.field];

        if (errorStep) {
            setCurrentStep(errorStep);
        }
    }, [state]);

    /* =====================================================
       State update
    ===================================================== */

    const updateField = <
        K extends keyof DoctorFormData,
    >(
        field: K,
        value: DoctorFormData[K]
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        setLocalErrors((prev) => {
            if (!prev[field]) return prev;

            const next = { ...prev };

            delete next[field];

            return next;
        });
    };

    /* =====================================================
       Error helper
    ===================================================== */

    const getFieldError = (
        field: string
    ): string | undefined => {
        if (localErrors[field]) {
            return localErrors[field];
        }

        return state?.errors?.find(
            (error) => error.field === field
        )?.message;
    };

    /* =====================================================
       Step validation
    ===================================================== */

    const validateStep = () => {
        const errors: LocalErrors = {};

        if (currentStep === 1) {
            if (!formData.name.trim()) {
                errors.name =
                    "Doctor name is required";
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

            if (!formData.confirmPassword) {
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

        if (currentStep === 2) {
            if (!formData.contactNumber.trim()) {
                errors.contactNumber =
                    "Contact number is required";
            }

            if (!formData.gender) {
                errors.gender =
                    "Please select gender";
            }

            if (!formData.address.trim()) {
                errors.address =
                    "Address is required";
            }
        }

        if (currentStep === 3) {
            if (
                !formData.registrationNumber.trim()
            ) {
                errors.registrationNumber =
                    "Registration number is required";
            }

            if (!formData.qualification.trim()) {
                errors.qualification =
                    "Qualification is required";
            }

            if (!formData.experience) {
                errors.experience =
                    "Experience is required";
            } else if (
                Number(formData.experience) < 0
            ) {
                errors.experience =
                    "Experience cannot be negative";
            }
        }

        if (currentStep === 4) {
            if (
                formData.specialties.length === 0
            ) {
                errors.specialties =
                    "Please select at least one specialty";
            }

            if (
                !formData.currentWorkingPlace.trim()
            ) {
                errors.currentWorkingPlace =
                    "Current working place is required";
            }

            if (!formData.designation.trim()) {
                errors.designation =
                    "Designation is required";
            }

            if (!formData.appointmentFee) {
                errors.appointmentFee =
                    "Appointment fee is required";
            } else if (
                Number(
                    formData.appointmentFee
                ) < 0
            ) {
                errors.appointmentFee =
                    "Appointment fee cannot be negative";
            }
        }

        setLocalErrors(errors);

        return Object.keys(errors).length === 0;
    };

    /* =====================================================
       Navigation
    ===================================================== */

    const goNext = () => {
        const valid = validateStep();

        if (!valid) {
            return;
        }

        if (
            currentStep <
            steps.length
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
        if (currentStep <= 1) return;

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
       Specialty handlers
    ===================================================== */

    const addSpecialty = (
        specialtyId: string
    ) => {
        if (!specialtyId) return;

        if (
            formData.specialties.includes(
                specialtyId
            )
        ) {
            return;
        }

        updateField("specialties", [
            ...formData.specialties,
            specialtyId,
        ]);

        setSpecialtyToAdd("");
    };

    const removeSpecialty = (
        specialtyId: string
    ) => {
        updateField(
            "specialties",
            formData.specialties.filter(
                (id) =>
                    id !== specialtyId
            )
        );
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

    /* =====================================================
       UI
    ===================================================== */

    return (
        <div className="min-h-screen bg-slate-50/70">
            <div className="mx-auto w-full max-w-[1500px] px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">

                {/* =================================================
                    Mobile Header
                ================================================= */}

                <div className="mb-4 lg:hidden">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                        Practitioner Enrollment
                    </p>

                    <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                        Doctor Registration
                    </h1>

                    <p className="mt-1 max-w-lg text-sm leading-6 text-slate-500">
                        Complete your professional
                        profile to join our healthcare
                        network.
                    </p>
                </div>

                {/* =================================================
                    Mobile Progress
                ================================================= */}

                <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
                    <div className="mb-3 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-medium text-slate-500">
                                Step {currentStep} of{" "}
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
                                                        step.id <
                                                            currentStep
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

                    {/* =================================================
                        Desktop Sidebar
                    ================================================= */}

                    <aside className="sticky top-6 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
                        <div className="p-6 xl:p-7">
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                                Practitioner
                                Enrollment
                            </p>

                            <h1 className="mt-2 text-[26px] font-bold tracking-tight text-slate-950">
                                Doctor Registration
                            </h1>

                            <p className="mt-1.5 text-sm leading-6 text-slate-500">
                                Complete your
                                verified professional
                                profile and start
                                receiving appointments.
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
                            <div>
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
                                        Your
                                        professional
                                        information
                                        will be
                                        reviewed
                                        before
                                        activation.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* =================================================
                        Main Form
                    ================================================= */}

                    <form
                        action={formAction}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                    >
                        {/* =============================================
                            Persistent form values
                            
                            Important:
                            Visible step inputs may unmount.
                            These hidden inputs NEVER unmount.
                        ============================================= */}

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

                        <input
                            type="hidden"
                            name="gender"
                            value={
                                formData.gender
                            }
                        />

                        <input
                            type="hidden"
                            name="registrationNumber"
                            value={
                                formData.registrationNumber
                            }
                        />

                        <input
                            type="hidden"
                            name="qualification"
                            value={
                                formData.qualification
                            }
                        />

                        <input
                            type="hidden"
                            name="experience"
                            value={
                                formData.experience
                            }
                        />

                        <input
                            type="hidden"
                            name="appointmentFee"
                            value={
                                formData.appointmentFee
                            }
                        />

                        <input
                            type="hidden"
                            name="currentWorkingPlace"
                            value={
                                formData.currentWorkingPlace
                            }
                        />

                        <input
                            type="hidden"
                            name="designation"
                            value={
                                formData.designation
                            }
                        />

                        {/* specialties[] */}

                        {formData.specialties.map(
                            (specialtyId) => (
                                <input
                                    key={
                                        specialtyId
                                    }
                                    type="hidden"
                                    name="specialties"
                                    value={
                                        specialtyId
                                    }
                                />
                            )
                        )}

                        {/* =============================================
                            IMPORTANT:
                            File input stays mounted for entire form.
                        ============================================= */}

                        <input
                            ref={fileInputRef}
                            id="doctor-profile-photo"
                            name="file"
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={
                                handleFileChange
                            }
                            className="hidden"
                        />

                        {/* =============================================
                            Header
                        ============================================= */}

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

                        <div className="min-h-[470px] px-5 py-6 sm:px-7 lg:px-8 lg:py-8">

                            {/* =========================================
                                STEP 1
                            ========================================= */}

                            {currentStep ===
                                1 && (
                                    <div className="mx-auto max-w-4xl space-y-6">
                                        <SectionTitle
                                            title="Create your professional account"
                                            description="Use an email address that you regularly check for appointment and verification notifications."
                                        />

                                        <Field>
                                            <FieldLabel>
                                                Full Name
                                                with
                                                Medical
                                                Title
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
                                                    placeholder="e.g. Dr. John Doe"
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
                                                Official
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
                                                    placeholder="e.g. doctor@hospital.com"
                                                    className="h-12 border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0"
                                                />
                                            </InputWrapper>

                                            <FieldDescription>
                                                Used for
                                                appointment
                                                notifications
                                                and secure
                                                account
                                                verification.
                                            </FieldDescription>

                                            <ErrorText
                                                message={getFieldError(
                                                    "email"
                                                )}
                                            />
                                        </Field>

                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <Field>
                                                <FieldLabel>
                                                    Account
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

                            {/* =========================================
                                STEP 2
                            ========================================= */}

                            {currentStep ===
                                2 && (
                                    <div className="mx-auto max-w-4xl space-y-6">
                                        <SectionTitle
                                            title="Personal information"
                                            description="Provide accurate contact information so patients and administrators can identify your profile."
                                        />

                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <Field>
                                                <FieldLabel>
                                                    Contact
                                                    Number
                                                    <Required />
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

                                                <ErrorText
                                                    message={getFieldError(
                                                        "contactNumber"
                                                    )}
                                                />
                                            </Field>

                                            <Field>
                                                <FieldLabel>
                                                    Gender
                                                    <Required />
                                                </FieldLabel>

                                                <Select
                                                    value={
                                                        formData.gender
                                                    }
                                                    onValueChange={(
                                                        value
                                                    ) =>
                                                        updateField(
                                                            "gender",
                                                            value
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="h-12 w-full rounded-xl">
                                                        <SelectValue placeholder="Select gender" />
                                                    </SelectTrigger>

                                                    <SelectContent>
                                                        <SelectItem value="MALE">
                                                            Male
                                                        </SelectItem>

                                                        <SelectItem value="FEMALE">
                                                            Female
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                <ErrorText
                                                    message={getFieldError(
                                                        "gender"
                                                    )}
                                                />
                                            </Field>
                                        </div>

                                        <Field>
                                            <FieldLabel>
                                                Address
                                                <Required />
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

                                            <ErrorText
                                                message={getFieldError(
                                                    "address"
                                                )}
                                            />
                                        </Field>

                                        <Field>
                                            <FieldLabel>
                                                Profile
                                                Photo
                                            </FieldLabel>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                                className="group flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-6 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50/40"
                                            >
                                                <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 group-hover:text-blue-600">
                                                    <CircleUserRound className="size-6" />
                                                </div>

                                                <p className="mt-3 text-sm font-semibold text-slate-800">
                                                    {formData.profilePhoto
                                                        ? formData
                                                            .profilePhoto
                                                            .name
                                                        : "Upload profile photo"}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    PNG,
                                                    JPG or
                                                    WEBP.
                                                </p>
                                            </button>

                                            {formData.profilePhoto && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        updateField(
                                                            "profilePhoto",
                                                            null
                                                        );

                                                        if (
                                                            fileInputRef.current
                                                        ) {
                                                            fileInputRef.current.value =
                                                                "";
                                                        }
                                                    }}
                                                    className="mt-2 gap-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                                >
                                                    <X className="size-4" />
                                                    Remove
                                                    photo
                                                </Button>
                                            )}
                                        </Field>
                                    </div>
                                )}

                            {/* =========================================
                                STEP 3
                            ========================================= */}

                            {currentStep ===
                                3 && (
                                    <div className="mx-auto max-w-4xl space-y-6">
                                        <SectionTitle
                                            title="Professional credentials"
                                            description="Enter your medical registration and academic qualifications exactly as they appear on official documents."
                                        />

                                        <Field>
                                            <FieldLabel>
                                                BMDC /
                                                Medical
                                                Registration
                                                Number
                                                <Required />
                                            </FieldLabel>

                                            <InputWrapper
                                                icon={
                                                    FileBadge2
                                                }
                                            >
                                                <Input
                                                    value={
                                                        formData.registrationNumber
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        updateField(
                                                            "registrationNumber",
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="e.g. A-123456"
                                                    className="h-12 border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0"
                                                />
                                            </InputWrapper>

                                            <ErrorText
                                                message={getFieldError(
                                                    "registrationNumber"
                                                )}
                                            />
                                        </Field>

                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <Field>
                                                <FieldLabel>
                                                    Qualification
                                                    <Required />
                                                </FieldLabel>

                                                <InputWrapper
                                                    icon={
                                                        GraduationCap
                                                    }
                                                >
                                                    <Input
                                                        value={
                                                            formData.qualification
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            updateField(
                                                                "qualification",
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder="MBBS, FCPS, MD"
                                                        className="h-12 border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0"
                                                    />
                                                </InputWrapper>

                                                <ErrorText
                                                    message={getFieldError(
                                                        "qualification"
                                                    )}
                                                />
                                            </Field>

                                            <Field>
                                                <FieldLabel>
                                                    Experience
                                                    <Required />
                                                </FieldLabel>

                                                <InputWrapper
                                                    icon={
                                                        BriefcaseMedical
                                                    }
                                                >
                                                    <Input
                                                        type="number"
                                                        min={
                                                            0
                                                        }
                                                        value={
                                                            formData.experience
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            updateField(
                                                                "experience",
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder="Years of experience"
                                                        className="h-12 border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0"
                                                    />
                                                </InputWrapper>

                                                <ErrorText
                                                    message={getFieldError(
                                                        "experience"
                                                    )}
                                                />
                                            </Field>
                                        </div>

                                        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                                            <div className="flex gap-3">
                                                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-amber-600" />

                                                <div>
                                                    <p className="text-sm font-semibold text-amber-950">
                                                        Credential
                                                        verification
                                                    </p>

                                                    <p className="mt-1 text-xs leading-5 text-amber-800/80">
                                                        Registration
                                                        and
                                                        qualification
                                                        information
                                                        may be
                                                        reviewed
                                                        before
                                                        activation.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            {/* =========================================
                                STEP 4
                            ========================================= */}

                            {currentStep ===
                                4 && (
                                    <div className="mx-auto max-w-4xl space-y-6">
                                        <SectionTitle
                                            title="Consultation information"
                                            description="Tell patients about your specialties, workplace and consultation fee."
                                        />

                                        {/* Specialty Multi Select */}

                                        <Field>
                                            <FieldLabel>
                                                Medical
                                                Specialties
                                                <Required />
                                            </FieldLabel>

                                            <Select
                                                value={
                                                    specialtyToAdd
                                                }
                                                onValueChange={(
                                                    value
                                                ) => {
                                                    setSpecialtyToAdd(
                                                        value
                                                    );

                                                    addSpecialty(
                                                        value
                                                    );
                                                }}
                                            >
                                                <SelectTrigger className="h-12 w-full rounded-xl">
                                                    <SelectValue placeholder="Select a specialty" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    {availableSpecialties.map(
                                                        (
                                                            specialty
                                                        ) => (
                                                            <SelectItem
                                                                key={
                                                                    specialty.id
                                                                }
                                                                value={
                                                                    specialty.id
                                                                }
                                                            >
                                                                {
                                                                    specialty.title
                                                                }
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>

                                            {selectedSpecialties.length >
                                                0 && (
                                                    <div className="flex flex-wrap gap-2 pt-2">
                                                        {selectedSpecialties.map(
                                                            (
                                                                specialty
                                                            ) => (
                                                                <Badge
                                                                    key={
                                                                        specialty.id
                                                                    }
                                                                    variant="secondary"
                                                                    className="gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-blue-700"
                                                                >
                                                                    {
                                                                        specialty.title
                                                                    }

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            removeSpecialty(
                                                                                specialty.id
                                                                            )
                                                                        }
                                                                        className="ml-1 rounded-full p-0.5 hover:bg-blue-100"
                                                                    >
                                                                        <X className="size-3" />
                                                                    </button>
                                                                </Badge>
                                                            )
                                                        )}
                                                    </div>
                                                )}

                                            <ErrorText
                                                message={getFieldError(
                                                    "specialties"
                                                )}
                                            />
                                        </Field>

                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <Field>
                                                <FieldLabel>
                                                    Current
                                                    Working
                                                    Place
                                                    <Required />
                                                </FieldLabel>

                                                <InputWrapper
                                                    icon={
                                                        Building2
                                                    }
                                                >
                                                    <Input
                                                        value={
                                                            formData.currentWorkingPlace
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            updateField(
                                                                "currentWorkingPlace",
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder="e.g. City Hospital"
                                                        className="h-12 border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0"
                                                    />
                                                </InputWrapper>

                                                <ErrorText
                                                    message={getFieldError(
                                                        "currentWorkingPlace"
                                                    )}
                                                />
                                            </Field>

                                            <Field>
                                                <FieldLabel>
                                                    Designation
                                                    <Required />
                                                </FieldLabel>

                                                <InputWrapper
                                                    icon={
                                                        Stethoscope
                                                    }
                                                >
                                                    <Input
                                                        value={
                                                            formData.designation
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            updateField(
                                                                "designation",
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder="e.g. Senior Consultant"
                                                        className="h-12 border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0"
                                                    />
                                                </InputWrapper>

                                                <ErrorText
                                                    message={getFieldError(
                                                        "designation"
                                                    )}
                                                />
                                            </Field>
                                        </div>

                                        <Field>
                                            <FieldLabel>
                                                Appointment
                                                Fee
                                                <Required />
                                            </FieldLabel>

                                            <InputWrapper
                                                icon={
                                                    WalletCards
                                                }
                                            >
                                                <Input
                                                    type="number"
                                                    min={
                                                        0
                                                    }
                                                    value={
                                                        formData.appointmentFee
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        updateField(
                                                            "appointmentFee",
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="e.g. 1000"
                                                    className="h-12 border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0"
                                                />
                                            </InputWrapper>

                                            <FieldDescription>
                                                Enter your
                                                regular
                                                consultation
                                                fee.
                                            </FieldDescription>

                                            <ErrorText
                                                message={getFieldError(
                                                    "appointmentFee"
                                                )}
                                            />
                                        </Field>
                                    </div>
                                )}

                            {/* =========================================
                                STEP 5
                            ========================================= */}

                            {currentStep ===
                                5 && (
                                    <div className="mx-auto max-w-4xl space-y-6">
                                        <SectionTitle
                                            title="Review your registration"
                                            description="Check your information before submitting your doctor application."
                                        />

                                        <ReviewSection
                                            title="Account"
                                            items={[
                                                [
                                                    "Doctor Name",
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
                                                    "Gender",
                                                    formData.gender,
                                                ],
                                                [
                                                    "Address",
                                                    formData.address,
                                                ],
                                            ]}
                                        />

                                        <ReviewSection
                                            title="Professional Credentials"
                                            items={[
                                                [
                                                    "Registration Number",
                                                    formData.registrationNumber,
                                                ],
                                                [
                                                    "Qualification",
                                                    formData.qualification,
                                                ],
                                                [
                                                    "Experience",
                                                    formData.experience
                                                        ? `${formData.experience} years`
                                                        : "",
                                                ],
                                            ]}
                                        />

                                        <ReviewSection
                                            title="Consultation"
                                            items={[
                                                [
                                                    "Specialties",
                                                    selectedSpecialties
                                                        .map(
                                                            (
                                                                item
                                                            ) =>
                                                                item.title
                                                        )
                                                        .join(
                                                            ", "
                                                        ),
                                                ],
                                                [
                                                    "Working Place",
                                                    formData.currentWorkingPlace,
                                                ],
                                                [
                                                    "Designation",
                                                    formData.designation,
                                                ],
                                                [
                                                    "Appointment Fee",
                                                    formData.appointmentFee
                                                        ? `৳${formData.appointmentFee}`
                                                        : "",
                                                ],
                                            ]}
                                        />

                                        <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
                                            <div className="flex gap-3">
                                                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-blue-600" />

                                                <div>
                                                    <p className="text-sm font-semibold text-blue-950">
                                                        Application
                                                        verification
                                                    </p>

                                                    <p className="mt-1 text-sm leading-6 text-blue-800/80">
                                                        By
                                                        submitting
                                                        this
                                                        application,
                                                        you
                                                        confirm
                                                        that the
                                                        provided
                                                        information
                                                        is
                                                        accurate.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                        </div>

                        {/* =============================================
                            API Message
                        ============================================= */}

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

                        {/* =============================================
                            Footer
                        ============================================= */}

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
                                            "Submitting..."
                                        ) : (
                                            <>
                                                Submit
                                                Application
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
   Components
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