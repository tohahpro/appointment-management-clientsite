/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
    FormProvider,
    useFieldArray,
    useForm,
    useFormContext,
} from "react-hook-form";

import {
    Plus,
    Trash2,
    Upload,
} from "lucide-react";

import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { createAppeal } from "@/services/admin/appealManagement";
import { ICategory } from "../../../../../types/appeal.interface";

/* =========================================================
   TYPES
========================================================= */


export interface IAppealFormValues {
    label?: string;
    slug?: string;
    title: string;
    description?: string;
    imageContext?: string;
    categoryId: string;

    heroHighlights: {
        icon: string;
        label?: string;
        order?: number;
    }[];

    islamicQuotes: {
        hadith: string;
        reference?: string;
        order?: number;
    }[];

    matters: {
        title: string;
        description?: string;

        mattersHighlights: {
            icon: string;
            label: string;
            value: string;
            order?: number;
        }[];
    }[];

    supports: {
        title: string;
        category: "Provides" | "Works";

        supportHighlights: {
            icon: string;
            label?: string;
            description: string;
            order?: number;
        }[];
    }[];

    impacts: {
        title: string;

        impactHighlights: {
            value: string;
            label: string;
            order?: number;
        }[];
    }[];

    faqs: {
        question: string;
        answer?: string;
        order?: number;
    }[];

    donationForm: {
        title: string;
        context?: string;

        donationAmountOptions: {
            amount?: number | null;
            title?: string;
            isCustom: boolean;
            isActive: boolean;
            sortOrder: number;
        }[];
    };
}

interface AppealFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    categories: ICategory[];
}

/* =========================================================
   DEFAULT VALUES
========================================================= */

const defaultValues: IAppealFormValues = {
    label: "",
    title: "",
    description: "",
    imageContext: "",
    categoryId: "",

    heroHighlights: [],

    islamicQuotes: [],

    matters: [
        {
            title: "",
            description: "",
            mattersHighlights: [],
        },
    ],

    supports: [],

    impacts: [
        {
            title: "",
            impactHighlights: [],
        },
    ],

    faqs: [],

    donationForm: {
        title: "",
        context: "",
        donationAmountOptions: [],
    },
};

/* =========================================================
   MAIN DIALOG
========================================================= */

export default function AppealFormDialog({
    open,
    onClose,
    onSuccess,
    categories,
}: AppealFormDialogProps) {

    const [appealImage, setAppealImage] = useState<File | null>(null);
    const [impactImage, setImpactImage] = useState<File | null>(null);

    const methods = useForm<IAppealFormValues>({
        defaultValues,
    });

    const {
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        if (!open) {
            reset(defaultValues);
            setAppealImage(null);
            setImpactImage(null);
        }
    }, [open, reset]);

    const handleClose = () => {
        reset(defaultValues);
        setAppealImage(null);
        setImpactImage(null);

        onClose();
    };

    const onSubmit = async (data: IAppealFormValues) => {
        if (!appealImage) {
            toast.error("Appeal image is required");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("data", JSON.stringify(data));
            formData.append("appealImage", appealImage);

            if (impactImage) {
                formData.append("impactImage", impactImage);
            }

            const result = await createAppeal(null, formData);

            if (!result?.success) {
                toast.error(result?.message || "Failed to create appeal",);
                return;
            }

            toast.success("Appeal created successfully");

            reset(defaultValues);

            setAppealImage(null);
            setImpactImage(null);

            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong");
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value) {
                    handleClose();
                }
            }}
        >
            <DialogContent
                className="flex max-h-[95vh] w-[90vw] flex-col gap-0 overflow-hidden p-0"
            >
                {/* HEADER */}

                <DialogHeader className="shrink-0 border-b bg-white px-6 py-5">
                    <DialogTitle className="text-2xl font-bold text-slate-900">
                        Create Appeal
                    </DialogTitle>

                    <DialogDescription>
                        Add appeal content,
                        images, impact details
                        and donation options.
                    </DialogDescription>
                </DialogHeader>

                <FormProvider {...methods}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex min-h-0 flex-1 flex-col"
                    >
                        {/* SCROLL AREA */}

                        <div className="flex-1 overflow-y-auto bg-slate-50">
                            <div className="space-y-6 p-6">
                                <BasicInformation
                                    categories={categories}
                                    appealImage={appealImage}
                                    setAppealImage={setAppealImage}
                                />

                                <HeroHighlights />

                                <IslamicQuotes />

                                <MattersSection />

                                <SupportSection />

                                <ImpactSection
                                    impactImage={
                                        impactImage
                                    }
                                    setImpactImage={
                                        setImpactImage
                                    }
                                />

                                <FaqSection />

                                <DonationFormSection />
                            </div>
                        </div>

                        {/* FOOTER */}

                        <div className="flex shrink-0 items-center justify-end gap-3 border-t bg-white px-6 py-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={
                                    handleClose
                                }
                            >
                                Cancel
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    reset(
                                        defaultValues,
                                    );

                                    setAppealImage(
                                        null,
                                    );

                                    setImpactImage(
                                        null,
                                    );
                                }}
                            >
                                Reset
                            </Button>

                            <Button
                                type="submit"
                                disabled={
                                    isSubmitting
                                }
                            >
                                {isSubmitting
                                    ? "Creating..."
                                    : "Create Appeal"}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}

/* =========================================================
   BASIC INFORMATION
========================================================= */

function BasicInformation({ categories, appealImage, setAppealImage }: {
    categories: ICategory[];
    appealImage: File | null;
    setAppealImage: (
        file: File | null,
    ) => void;
}) {
    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } =
        useFormContext<IAppealFormValues>();

    return (
        <FormSection
            title="Basic Information"
            description="Add the main information for this appeal."
        >
            <div className="grid gap-5 md:grid-cols-2">
                <FormItem label="Appeal Label">
                    <Input
                        {...register("label")}
                        placeholder="SPONSOR AN ORPHAN"
                    />
                </FormItem>
                <FormItem label="Appeal Slug">
                    <Input
                        {...register("slug")}
                        placeholder="sponsor-an-orphan"
                    />
                </FormItem>

                <FormItem
                    label="Appeal Title"
                    required
                >
                    <Input
                        {...register("title", {
                            required:
                                "Title is required",
                        })}
                        placeholder="Sponsor an Orphan. Change a Life Forever."
                    />

                    {errors.title && (
                        <p className="text-sm text-red-500">
                            {
                                errors.title
                                    .message
                            }
                        </p>
                    )}
                </FormItem>

                <FormItem
                    label="Category"
                    required
                >
                    <Select
                        value={watch(
                            "categoryId",
                        )}
                        onValueChange={(
                            value,
                        ) =>
                            setValue(
                                "categoryId",
                                value,
                                {
                                    shouldValidate:
                                        true,
                                },
                            )
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>

                        <SelectContent>
                            {categories.map(
                                (category) => (
                                    <SelectItem
                                        key={
                                            category.id
                                        }
                                        value={
                                            category.id
                                        }
                                    >
                                        {
                                            category.name
                                        }
                                    </SelectItem>
                                ),
                            )}
                        </SelectContent>
                    </Select>
                </FormItem>

                <FormItem
                    label="Appeal Image"
                    required
                >
                    <label className="flex h-10 cursor-pointer items-center gap-3 rounded-md border border-dashed px-4 hover:bg-slate-50">
                        <Upload className="h-4 w-4 text-slate-500" />

                        <span className="truncate text-sm text-slate-600">
                            {appealImage
                                ? appealImage.name
                                : "Choose appeal image"}
                        </span>

                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                                setAppealImage(
                                    e.target
                                        .files?.[0] ??
                                    null,
                                )
                            }
                        />
                    </label>
                </FormItem>

                <div className="md:col-span-2">
                    <FormItem label="Description">
                        <Textarea
                            {...register(
                                "description",
                            )}
                            rows={4}
                            placeholder="Write appeal description..."
                        />
                    </FormItem>
                </div>

                <div className="md:col-span-2">
                    <FormItem label="Image Context / Location">
                        <Input
                            {...register(
                                "imageContext",
                            )}
                            placeholder="Nessa Foundation Care Center, Sylhet, Bangladesh"
                        />
                    </FormItem>
                </div>
            </div>
        </FormSection>
    );
}

/* =========================================================
   HERO HIGHLIGHTS
========================================================= */

function HeroHighlights() {
    const {
        control,
        register,
    } =
        useFormContext<IAppealFormValues>();

    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: "heroHighlights",
    });

    return (
        <FormSection
            title="Hero Highlights"
            description="Add highlights displayed in the hero section."
            action={
                <AddButton
                    label="Add Highlight"
                    onClick={() =>
                        append({
                            icon: "",
                            label: "",
                            order:
                                fields.length +
                                1,
                        })
                    }
                />
            }
        >
            {fields.length === 0 ? (
                <EmptyMessage text="No hero highlights added." />
            ) : (
                <div className="space-y-3">
                    {fields.map(
                        (
                            field,
                            index,
                        ) => (
                            <div
                                key={
                                    field.id
                                }
                                className="grid gap-3 rounded-lg border bg-slate-50 p-4 md:grid-cols-[1fr_2fr_110px_auto]"
                            >
                                <Input
                                    {...register(
                                        `heroHighlights.${index}.icon`,
                                    )}
                                    placeholder="Icon"
                                />

                                <Input
                                    {...register(
                                        `heroHighlights.${index}.label`,
                                    )}
                                    placeholder="Label"
                                />

                                <Input
                                    type="number"
                                    {...register(
                                        `heroHighlights.${index}.order`,
                                        {
                                            valueAsNumber:
                                                true,
                                        },
                                    )}
                                    placeholder="Order"
                                />

                                <DeleteButton
                                    onClick={() =>
                                        remove(
                                            index,
                                        )
                                    }
                                />
                            </div>
                        ),
                    )}
                </div>
            )}
        </FormSection>
    );
}

/* =========================================================
   ISLAMIC QUOTES
========================================================= */

function IslamicQuotes() {
    const {
        control,
        register,
    } =
        useFormContext<IAppealFormValues>();

    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: "islamicQuotes",
    });

    return (
        <FormSection
            title="Islamic Quotes"
            description="Add Hadith or Islamic reminders."
            action={
                <AddButton
                    label="Add Quote"
                    onClick={() =>
                        append({
                            hadith: "",
                            reference: "",
                            order:
                                fields.length +
                                1,
                        })
                    }
                />
            }
        >
            {fields.length === 0 ? (
                <EmptyMessage text="No Islamic quotes added." />
            ) : (
                <div className="space-y-4">
                    {fields.map(
                        (
                            field,
                            index,
                        ) => (
                            <div
                                key={
                                    field.id
                                }
                                className="rounded-xl border bg-slate-50 p-4"
                            >
                                <div className="mb-3 flex justify-end">
                                    <DeleteButton
                                        onClick={() =>
                                            remove(
                                                index,
                                            )
                                        }
                                    />
                                </div>

                                <Textarea
                                    {...register(
                                        `islamicQuotes.${index}.hadith`,
                                    )}
                                    rows={3}
                                    placeholder="Hadith..."
                                />

                                <div className="mt-3 grid gap-3 md:grid-cols-[1fr_120px]">
                                    <Input
                                        {...register(
                                            `islamicQuotes.${index}.reference`,
                                        )}
                                        placeholder="Reference"
                                    />

                                    <Input
                                        type="number"
                                        {...register(
                                            `islamicQuotes.${index}.order`,
                                            {
                                                valueAsNumber:
                                                    true,
                                            },
                                        )}
                                        placeholder="Order"
                                    />
                                </div>
                            </div>
                        ),
                    )}
                </div>
            )}
        </FormSection>
    );
}

/* =========================================================
   MATTERS
========================================================= */

function MattersSection() {
    const { control } =
        useFormContext<IAppealFormValues>();

    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: "matters",
    });

    return (
        <FormSection
            title="Why This Project Matters"
            description="Explain why this appeal is important."
            action={
                <AddButton
                    label="Add Matter"
                    onClick={() =>
                        append({
                            title: "",
                            description: "",
                            mattersHighlights:
                                [],
                        })
                    }
                />
            }
        >
            <div className="space-y-5">
                {fields.map(
                    (field, index) => (
                        <MatterItem
                            key={field.id}
                            index={index}
                            onRemove={() =>
                                remove(index)
                            }
                        />
                    ),
                )}
            </div>
        </FormSection>
    );
}

function MatterItem({
    index,
    onRemove,
}: {
    index: number;
    onRemove: () => void;
}) {
    const {
        control,
        register,
    } =
        useFormContext<IAppealFormValues>();

    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: `matters.${index}.mattersHighlights`,
    });

    return (
        <div className="rounded-xl border bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">
                    Matter {index + 1}
                </h3>

                <DeleteButton
                    onClick={onRemove}
                />
            </div>

            <div className="space-y-4">
                <Input
                    {...register(
                        `matters.${index}.title`,
                    )}
                    placeholder="Section title"
                />

                <Textarea
                    {...register(
                        `matters.${index}.description`,
                    )}
                    rows={3}
                    placeholder="Description"
                />

                <div className="flex items-center justify-between">
                    <Label>
                        Highlights
                    </Label>

                    <AddButton
                        label="Add Highlight"
                        onClick={() =>
                            append({
                                icon: "",
                                label: "",
                                value: "",
                                order:
                                    fields.length +
                                    1,
                            })
                        }
                    />
                </div>

                <div className="space-y-3">
                    {fields.map(
                        (
                            field,
                            highlightIndex,
                        ) => (
                            <div
                                key={
                                    field.id
                                }
                                className="grid gap-3 rounded-lg bg-slate-50 p-3 md:grid-cols-[1fr_2fr_1fr_100px_auto]"
                            >
                                <Input
                                    {...register(
                                        `matters.${index}.mattersHighlights.${highlightIndex}.icon`,
                                    )}
                                    placeholder="Icon"
                                />

                                <Input
                                    {...register(
                                        `matters.${index}.mattersHighlights.${highlightIndex}.label`,
                                    )}
                                    placeholder="Label"
                                />

                                <Input
                                    {...register(
                                        `matters.${index}.mattersHighlights.${highlightIndex}.value`,
                                    )}
                                    placeholder="Value"
                                />

                                <Input
                                    type="number"
                                    {...register(
                                        `matters.${index}.mattersHighlights.${highlightIndex}.order`,
                                        {
                                            valueAsNumber:
                                                true,
                                        },
                                    )}
                                />

                                <DeleteButton
                                    onClick={() =>
                                        remove(
                                            highlightIndex,
                                        )
                                    }
                                />
                            </div>
                        ),
                    )}
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   SUPPORT
========================================================= */

function SupportSection() {
    const { control } =
        useFormContext<IAppealFormValues>();

    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: "supports",
    });

    return (
        <FormSection
            title="Support Sections"
            description="Add what support provides and how it works."
            action={
                <AddButton
                    label="Add Support"
                    onClick={() =>
                        append({
                            title: "",
                            category:
                                "Provides",
                            supportHighlights:
                                [],
                        })
                    }
                />
            }
        >
            {fields.length === 0 ? (
                <EmptyMessage text="No support section added." />
            ) : (
                <div className="space-y-5">
                    {fields.map(
                        (
                            field,
                            index,
                        ) => (
                            <SupportItem
                                key={
                                    field.id
                                }
                                index={
                                    index
                                }
                                onRemove={() =>
                                    remove(
                                        index,
                                    )
                                }
                            />
                        ),
                    )}
                </div>
            )}
        </FormSection>
    );
}

function SupportItem({
    index,
    onRemove,
}: {
    index: number;
    onRemove: () => void;
}) {
    const {
        control,
        register,
        watch,
        setValue,
    } =
        useFormContext<IAppealFormValues>();

    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: `supports.${index}.supportHighlights`,
    });

    return (
        <div className="rounded-xl border bg-white p-5">
            <div className="mb-5 flex justify-between">
                <h3 className="font-semibold">
                    Support {index + 1}
                </h3>

                <DeleteButton
                    onClick={onRemove}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <FormItem label="Title">
                    <Input
                        {...register(
                            `supports.${index}.title`,
                        )}
                        placeholder="What Your Support Provides"
                    />
                </FormItem>

                <FormItem label="Category">
                    <Select
                        value={watch(
                            `supports.${index}.category`,
                        )}
                        onValueChange={(
                            value,
                        ) =>
                            setValue(
                                `supports.${index}.category`,
                                value as
                                | "Provides"
                                | "Works",
                            )
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="Provides">
                                Provides
                            </SelectItem>

                            <SelectItem value="Works">
                                Works
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </FormItem>
            </div>

            <div className="mt-5 flex items-center justify-between">
                <Label>
                    Support Highlights
                </Label>

                <AddButton
                    label="Add Highlight"
                    onClick={() =>
                        append({
                            icon: "",
                            label: "",
                            description: "",
                            order:
                                fields.length +
                                1,
                        })
                    }
                />
            </div>

            <div className="mt-3 space-y-3">
                {fields.map(
                    (
                        field,
                        highlightIndex,
                    ) => (
                        <div
                            key={
                                field.id
                            }
                            className="grid gap-3 rounded-lg bg-slate-50 p-4 md:grid-cols-2"
                        >
                            <Input
                                {...register(
                                    `supports.${index}.supportHighlights.${highlightIndex}.icon`,
                                )}
                                placeholder="Icon"
                            />

                            <Input
                                {...register(
                                    `supports.${index}.supportHighlights.${highlightIndex}.label`,
                                )}
                                placeholder="Label"
                            />

                            <Input
                                {...register(
                                    `supports.${index}.supportHighlights.${highlightIndex}.description`,
                                )}
                                placeholder="Description"
                            />

                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    {...register(
                                        `supports.${index}.supportHighlights.${highlightIndex}.order`,
                                        {
                                            valueAsNumber:
                                                true,
                                        },
                                    )}
                                    placeholder="Order"
                                />

                                <DeleteButton
                                    onClick={() =>
                                        remove(
                                            highlightIndex,
                                        )
                                    }
                                />
                            </div>
                        </div>
                    ),
                )}
            </div>
        </div>
    );
}

/* =========================================================
   IMPACT
========================================================= */

function ImpactSection({
    impactImage,
    setImpactImage,
}: {
    impactImage: File | null;
    setImpactImage: (
        file: File | null,
    ) => void;
}) {
    const {
        control,
    } =
        useFormContext<IAppealFormValues>();

    const { fields } =
        useFieldArray({
            control,
            name: "impacts",
        });

    return (
        <FormSection
            title="Impact"
            description="Add impact image and statistics."
        >
            <FormItem label="Impact Image">
                <label className="flex h-10 cursor-pointer items-center gap-3 rounded-md border border-dashed px-4 hover:bg-slate-50">
                    <Upload className="h-4 w-4 text-slate-500" />

                    <span className="truncate text-sm text-slate-600">
                        {impactImage
                            ? impactImage.name
                            : "Choose impact image"}
                    </span>

                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                            setImpactImage(
                                e.target
                                    .files?.[0] ??
                                null,
                            )
                        }
                    />
                </label>
            </FormItem>

            <div className="mt-5">
                {fields.map(
                    (field, index) => (
                        <ImpactItem
                            key={field.id}
                            index={index}
                        />
                    ),
                )}
            </div>
        </FormSection>
    );
}

function ImpactItem({
    index,
}: {
    index: number;
}) {
    const {
        control,
        register,
    } =
        useFormContext<IAppealFormValues>();

    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: `impacts.${index}.impactHighlights`,
    });

    return (
        <div className="rounded-xl border bg-white p-5">
            <FormItem label="Impact Title">
                <Input
                    {...register(
                        `impacts.${index}.title`,
                    )}
                    placeholder="Sponsorship Impact"
                />
            </FormItem>

            <div className="mt-5 flex items-center justify-between">
                <Label>
                    Impact Highlights
                </Label>

                <AddButton
                    label="Add Highlight"
                    onClick={() =>
                        append({
                            value: "",
                            label: "",
                            order:
                                fields.length +
                                1,
                        })
                    }
                />
            </div>

            <div className="mt-3 space-y-3">
                {fields.map(
                    (
                        field,
                        highlightIndex,
                    ) => (
                        <div
                            key={
                                field.id
                            }
                            className="grid gap-3 rounded-lg bg-slate-50 p-3 md:grid-cols-[1fr_2fr_100px_auto]"
                        >
                            <Input
                                {...register(
                                    `impacts.${index}.impactHighlights.${highlightIndex}.value`,
                                )}
                                placeholder="186+"
                            />

                            <Input
                                {...register(
                                    `impacts.${index}.impactHighlights.${highlightIndex}.label`,
                                )}
                                placeholder="Children in Our Care"
                            />

                            <Input
                                type="number"
                                {...register(
                                    `impacts.${index}.impactHighlights.${highlightIndex}.order`,
                                    {
                                        valueAsNumber:
                                            true,
                                    },
                                )}
                            />

                            <DeleteButton
                                onClick={() =>
                                    remove(
                                        highlightIndex,
                                    )
                                }
                            />
                        </div>
                    ),
                )}
            </div>
        </div>
    );
}

/* =========================================================
   FAQ
========================================================= */

function FaqSection() {
    const {
        control,
        register,
    } =
        useFormContext<IAppealFormValues>();

    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: "faqs",
    });

    return (
        <FormSection
            title="Frequently Asked Questions"
            description="Add common questions and answers."
            action={
                <AddButton
                    label="Add FAQ"
                    onClick={() =>
                        append({
                            question: "",
                            answer: "",
                            order:
                                fields.length +
                                1,
                        })
                    }
                />
            }
        >
            {fields.length === 0 ? (
                <EmptyMessage text="No FAQ added." />
            ) : (
                <div className="space-y-4">
                    {fields.map(
                        (
                            field,
                            index,
                        ) => (
                            <div
                                key={
                                    field.id
                                }
                                className="rounded-xl border bg-slate-50 p-4"
                            >
                                <div className="mb-3 flex justify-end">
                                    <DeleteButton
                                        onClick={() =>
                                            remove(
                                                index,
                                            )
                                        }
                                    />
                                </div>

                                <div className="grid gap-3 md:grid-cols-[1fr_100px]">
                                    <Input
                                        {...register(
                                            `faqs.${index}.question`,
                                        )}
                                        placeholder="Question"
                                    />

                                    <Input
                                        type="number"
                                        {...register(
                                            `faqs.${index}.order`,
                                            {
                                                valueAsNumber:
                                                    true,
                                            },
                                        )}
                                        placeholder="Order"
                                    />
                                </div>

                                <Textarea
                                    className="mt-3"
                                    {...register(
                                        `faqs.${index}.answer`,
                                    )}
                                    rows={3}
                                    placeholder="Answer"
                                />
                            </div>
                        ),
                    )}
                </div>
            )}
        </FormSection>
    );
}

/* =========================================================
   DONATION FORM
========================================================= */

function DonationFormSection() {
    const {
        control,
        register,
        watch,
        setValue,
    } =
        useFormContext<IAppealFormValues>();

    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: "donationForm.donationAmountOptions",
    });

    return (
        <FormSection
            title="Donation Form"
            description="Configure donation amounts."
            action={
                <AddButton
                    label="Add Amount"
                    onClick={() =>
                        append({
                            amount: 0,
                            title: "",
                            isCustom: false,
                            isActive: true,
                            sortOrder:
                                fields.length +
                                1,
                        })
                    }
                />
            }
        >
            <div className="grid gap-5 md:grid-cols-2">
                <FormItem label="Form Title">
                    <Input
                        {...register(
                            "donationForm.title",
                        )}
                        placeholder="Sponsor a Child Today"
                    />
                </FormItem>

                <FormItem label="Context">
                    <Input
                        {...register(
                            "donationForm.context",
                        )}
                        placeholder="Your monthly support provides..."
                    />
                </FormItem>
            </div>

            <div className="mt-5 space-y-3">
                {fields.length === 0 && (
                    <EmptyMessage text="No donation amount added." />
                )}

                {fields.map(
                    (field, index) => {
                        const isCustom =
                            watch(
                                `donationForm.donationAmountOptions.${index}.isCustom`,
                            );

                        const isActive =
                            watch(
                                `donationForm.donationAmountOptions.${index}.isActive`,
                            );

                        return (
                            <div
                                key={
                                    field.id
                                }
                                className="grid gap-3 rounded-xl border bg-slate-50 p-4 lg:grid-cols-[130px_1fr_130px_130px_100px_auto]"
                            >
                                <Input
                                    type="number"
                                    disabled={
                                        isCustom
                                    }
                                    {...register(
                                        `donationForm.donationAmountOptions.${index}.amount`,
                                        {
                                            setValueAs:
                                                (
                                                    value,
                                                ) =>
                                                    isCustom ||
                                                        value ===
                                                        ""
                                                        ? null
                                                        : Number(
                                                            value,
                                                        ),
                                        },
                                    )}
                                    placeholder="Amount"
                                />

                                <Input
                                    {...register(
                                        `donationForm.donationAmountOptions.${index}.title`,
                                    )}
                                    placeholder="Essential Care"
                                />

                                <label className="flex cursor-pointer items-center gap-2 rounded-md border bg-white px-3 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={
                                            isCustom
                                        }
                                        onChange={(
                                            e,
                                        ) => {
                                            setValue(
                                                `donationForm.donationAmountOptions.${index}.isCustom`,
                                                e
                                                    .target
                                                    .checked,
                                            );

                                            if (
                                                e
                                                    .target
                                                    .checked
                                            ) {
                                                setValue(
                                                    `donationForm.donationAmountOptions.${index}.amount`,
                                                    null,
                                                );
                                            }
                                        }}
                                    />

                                    Custom
                                </label>

                                <label className="flex cursor-pointer items-center gap-2 rounded-md border bg-white px-3 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={
                                            isActive
                                        }
                                        onChange={(
                                            e,
                                        ) =>
                                            setValue(
                                                `donationForm.donationAmountOptions.${index}.isActive`,
                                                e
                                                    .target
                                                    .checked,
                                            )
                                        }
                                    />

                                    Active
                                </label>

                                <Input
                                    type="number"
                                    {...register(
                                        `donationForm.donationAmountOptions.${index}.sortOrder`,
                                        {
                                            valueAsNumber:
                                                true,
                                        },
                                    )}
                                    placeholder="Order"
                                />

                                <DeleteButton
                                    onClick={() =>
                                        remove(
                                            index,
                                        )
                                    }
                                />
                            </div>
                        );
                    },
                )}
            </div>
        </FormSection>
    );
}

/* =========================================================
   REUSABLE
========================================================= */

function FormSection({
    title,
    description,
    action,
    children,
}: {
    title: string;
    description?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-start">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                        {title}
                    </h2>

                    {description && (
                        <p className="mt-1 text-sm text-slate-500">
                            {description}
                        </p>
                    )}
                </div>

                {action}
            </div>

            {children}
        </section>
    );
}

function FormItem({
    label,
    required,
    children,
}: {
    label: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-2">
            <Label>
                {label}

                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}
            </Label>

            {children}
        </div>
    );
}

function AddButton({
    label,
    onClick,
}: {
    label: string;
    onClick: () => void;
}) {
    return (
        <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onClick}
        >
            <Plus className="mr-2 h-4 w-4" />

            {label}
        </Button>
    );
}

function DeleteButton({
    onClick,
}: {
    onClick: () => void;
}) {
    return (
        <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onClick}
            className="shrink-0 text-red-500 hover:bg-red-50 hover:text-red-600"
        >
            <Trash2 className="h-4 w-4" />
        </Button>
    );
}

function EmptyMessage({
    text,
}: {
    text: string;
}) {
    return (
        <div className="rounded-lg border border-dashed bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            {text}
        </div>
    );
}