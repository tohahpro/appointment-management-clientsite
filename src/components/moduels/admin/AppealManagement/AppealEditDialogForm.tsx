/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
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
import { updateAppeal } from "@/services/admin/appealManagement";
import { IAppeal, ICategory } from "../../../../../types/appeal.interface";

/* =========================================================
   FORM TYPES
========================================================= */

export interface IAppealEditFormValues {
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
        matterImages?: {
            id?: string;
            image: string;
            order?: string;
        }[];
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
        image?: string;

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
    } | null;
}

interface AppealEditFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    appeal: IAppeal;
    categories: ICategory[];
}

/* =========================================================
   MAP DATABASE DATA => FORM DATA
========================================================= */

const mapAppealToForm = (
    appeal: IAppeal,
): IAppealEditFormValues => {

    return {
        label: appeal.label ?? "",
        slug: appeal.slug ?? "",

        title: appeal.title ?? "",

        description:
            appeal.description ?? "",

        imageContext:
            appeal.imageContext ?? "",

        categoryId:
            appeal.categoryId ?? "",

        /* =========================
           HERO
        ========================= */

        heroHighlights:
            appeal.heroHighlights?.map(
                (item) => ({
                    icon:
                        item.icon ?? "",

                    label:
                        item.label ?? "",

                    order:
                        item.order ??
                        undefined,
                }),
            ) ?? [],

        /* =========================
           QUOTES
        ========================= */

        islamicQuotes:
            appeal.islamicQuotes?.map(
                (item) => ({
                    hadith:
                        item.hadith ?? "",

                    reference:
                        item.reference ??
                        "",

                    order:
                        item.order ??
                        undefined,
                }),
            ) ?? [],

        /* =========================
           MATTERS
        ========================= */

        matters:
            appeal.matters?.map(
                (matter) => ({
                    title:
                        matter.title ?? "",

                    description:
                        matter.description ??
                        "",

                    matterImages:
                        matter.matterImages?.map(
                            (item) => ({
                                id: item.id,
                                image: item.image,
                                order:
                                    item.order ??
                                    undefined,
                            }),
                        ) ?? [],

                    mattersHighlights:
                        matter.mattersHighlights?.map(
                            (item) => ({
                                icon:
                                    item.icon ??
                                    "",

                                label:
                                    item.label ??
                                    "",

                                value:
                                    item.value ??
                                    "",

                                order:
                                    item.order ??
                                    undefined,
                            }),
                        ) ?? [],
                }),
            ) ?? [],

        /* =========================
           SUPPORT
        ========================= */

        supports:
            appeal.supports?.map(
                (support) => ({
                    title: support.title ?? "",
                    category: support.category === "Provides" ? "Provides" : "Works",
                    supportHighlights:
                        support.supportHighlights?.map(
                            (item) => ({
                                icon: item.icon ?? "",
                                label: item.label ?? "",
                                description: item.description ?? "",
                                order: item.order ?? undefined,
                            }),
                        ) ?? [],
                }),
            ) ?? [],

        /* =========================
           IMPACT
        ========================= */

        impacts:
            appeal.impacts?.map(
                (impact) => ({
                    title: impact.title ?? "",
                    image: impact.image,
                    impactHighlights:
                        impact.impactHighlights?.map(
                            (item) => ({
                                value: item.value ?? "",
                                label: item.label ?? "",
                                order: item.order ?? undefined,
                            }),
                        ) ?? [],
                }),
            ) ?? [],

        /* =========================
           FAQ
        ========================= */

        faqs:
            appeal.faqs?.map(
                (faq) => ({
                    question: faq.question ?? "",
                    answer: faq.answer ?? "",
                    order: faq.order ?? undefined,
                }),
            ) ?? [],

        /* =========================
           DONATION
        ========================= */

        donationForm:
            appeal.donationForm
                ? {
                    title: appeal.donationForm.title ?? "",
                    context: appeal.donationForm.context ?? "",

                    donationAmountOptions:
                        appeal.donationForm
                            .donationAmountOptions?.map(
                                (option) => ({
                                    amount: option.amount ?? null,
                                    title: option.title ?? "",
                                    isCustom: option.isCustom ?? false,
                                    isActive: option.isActive ?? true,
                                    sortOrder: option.sortOrder ?? 0,
                                }),
                            ) ??
                        [],
                }
                : null,
    };
};

/* =========================================================
   MAIN DIALOG
========================================================= */

export default function AppealEditFormDialog({
    open,
    onClose,
    appeal,
    categories,
    onSuccess,
}: AppealEditFormDialogProps) {

    const [appealImage, setAppealImage] = useState<File | null>(null);
    const [impactImage, setImpactImage] = useState<File | null>(null);
    const [matterImages, setMatterImages] = useState<File[]>([]);

    const methods = useForm<IAppealEditFormValues>({
        defaultValues: {
            label: "",
            slug: "",
            title: "",
            description: "",
            imageContext: "",
            categoryId: "",
            heroHighlights: [],
            islamicQuotes: [],
            matters: [],
            supports: [],
            impacts: [],
            faqs: [],
            donationForm: null,
        },
    });

    const { handleSubmit, reset, formState: { isSubmitting } } = methods;

    useEffect(() => {
        if (!open || !appeal) {
            return;
        }

        const mappedData =
            mapAppealToForm(
                appeal,
            );

        reset(mappedData);

        setAppealImage(null);
        setImpactImage(null);
        setMatterImages([]);
    }, [appeal, open, reset]);

    const handleClose = () => {
        reset(
            mapAppealToForm(appeal),
        );

        setAppealImage(null);
        setImpactImage(null);
        setMatterImages([]);

        onClose();
    };

    /* =========================
       RESET
    ========================= */

    const handleReset = () => {
        reset(mapAppealToForm(appeal));

        setAppealImage(null);
        setImpactImage(null);
        setMatterImages([]);

        toast.success(
            "Original data restored",
        );
    };

    /* =========================
       SUBMIT
    ========================= */

    const onSubmit = async (
        data: IAppealEditFormValues,
    ) => {
        try {
            const formData = new FormData();

            const payload = {
                ...data,
                impacts:
                    data.impacts?.map(
                        ({
                            image,
                            ...impact
                        }) => impact,
                    ) ?? [],
            };

            formData.append("data", JSON.stringify(payload));

            // New hero image selected হলেই পাঠাবে।

            if (appealImage) {
                formData.append("appealImage", appealImage)
            }

            //  New impact image selected হলেই পাঠাবে।
            if (impactImage) {
                formData.append("impactImage", impactImage);
            }

            if (matterImages.length > 0) {
                matterImages.forEach((image) => {
                    formData.append("matterImages", image);
                });
            }

            const result = await updateAppeal(appeal.id, null, formData);

            if (!result?.success) {
                toast.error(
                    result?.message ||
                    "Failed to update appeal",
                );

                return;
            }

            toast.success(result?.message || "Appeal updated successfully",);

            onSuccess();
        } catch (error: any) {
            console.error(error);
            toast.error(error?.message || "Something went wrong");
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(
                value,
            ) => {
                if (!value) {
                    handleClose();
                }
            }}
        >
            <DialogContent
                className="flex max-h-[96vh] w-[97vw] max-w-none 
                flex-col gap-0 overflow-hidden p-0"
            >
                {/* ================= HEADER ================= */}

                <DialogHeader className="shrink-0 border-b bg-white px-6 py-5">
                    <DialogTitle className="text-2xl font-bold text-slate-950">
                        Edit Appeal
                    </DialogTitle>

                    <DialogDescription>
                        Update appeal
                        information, images,
                        content and donation
                        configuration.
                    </DialogDescription>
                </DialogHeader>

                {/* ================= FORM ================= */}

                <FormProvider
                    {...methods}
                >
                    <form
                        onSubmit={handleSubmit(
                            onSubmit,
                        )}
                        className="flex min-h-0 flex-1 flex-col"
                    >
                        {/* ================= SCROLLABLE AREA ================= */}

                        <div className="flex-1 overflow-y-auto bg-slate-50">
                            <div className="space-y-6 p-6">
                                <BasicInformation
                                    categories={
                                        categories
                                    }
                                    currentImage={
                                        appeal?.image
                                    }
                                    newImage={
                                        appealImage
                                    }
                                    setNewImage={
                                        setAppealImage
                                    }
                                />

                                <HeroHighlights />

                                <IslamicQuotes />

                                <MattersSection
                                    newImages={matterImages}
                                    setNewImages={setMatterImages} />

                                <SupportSection />

                                <ImpactSection
                                    currentImage={appeal?.impacts?.[0]?.image}
                                    newImage={
                                        impactImage
                                    }
                                    setNewImage={
                                        setImpactImage
                                    }
                                />

                                <FaqSection />

                                <DonationFormSection />
                            </div>
                        </div>

                        {/* ================= FOOTER ================= */}

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
                                onClick={
                                    handleReset
                                }
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
                                    ? "Updating..."
                                    : "Update Appeal"}
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

function BasicInformation({
    categories,
    currentImage,
    newImage,
    setNewImage,
}: {
    categories: ICategory[];
    currentImage: string;
    newImage: File | null;
    setNewImage: (
        file: File | null,
    ) => void;
}) {

    const { register, watch, setValue } = useFormContext<IAppealEditFormValues>();

    const newImagePreview =
        useMemo(() => {
            if (!newImage) {
                return null;
            }

            return URL.createObjectURL(
                newImage,
            );
        }, [newImage]);

    const preview =
        newImagePreview ||
        currentImage;

    return (
        <FormSection
            title="Basic Information"
            description="Update the main information for this appeal."
        >
            <div className="grid gap-5 md:grid-cols-2">
                {/* Label */}

                <FormItem label="Appeal Label">
                    <Input
                        {...register(
                            "label",
                        )}
                        placeholder="Appeal Label"
                    />
                </FormItem>
                {/* Slug */}

                <FormItem label="Appeal Slug">
                    <Input
                        {...register("slug")}
                        placeholder="Appeal slug"
                    />
                </FormItem>

                {/* Title */}

                <FormItem label="Appeal Title">
                    <Input
                        {...register(
                            "title",
                        )}
                        placeholder="Appeal title"
                    />
                </FormItem>

                {/* Category */}

                <FormItem label="Category">
                    <Select
                        value={
                            watch(
                                "categoryId",
                            ) || ""
                        }
                        onValueChange={(
                            value,
                        ) =>
                            setValue(
                                "categoryId",
                                value,
                                {
                                    shouldDirty:
                                        true,
                                },
                            )
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>

                        <SelectContent>
                            {categories.map(
                                (
                                    category,
                                ) => (
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

                {/* Image */}

                <FormItem label="Appeal Image">
                    <div className="space-y-3">
                        {preview && (
                            <div className="relative h-44 overflow-hidden rounded-xl border bg-slate-100">
                                <Image
                                    src={
                                        preview
                                    }
                                    alt="Appeal image"
                                    fill
                                    className="object-cover"
                                />

                                {!newImage && (
                                    <div className="absolute left-3 top-3 rounded bg-black/70 px-2 py-1 text-[11px] text-white">
                                        Current
                                        Image
                                    </div>
                                )}

                                {newImage && (
                                    <div className="absolute left-3 top-3 rounded bg-green-600 px-2 py-1 text-[11px] text-white">
                                        New
                                        Image
                                    </div>
                                )}
                            </div>
                        )}

                        <label className="flex h-10 cursor-pointer items-center gap-3 rounded-md border border-dashed px-4 hover:bg-slate-50">
                            <Upload className="h-4 w-4 text-slate-500" />

                            <span className="truncate text-sm text-slate-600">
                                {newImage
                                    ? newImage.name
                                    : "Choose new image"}
                            </span>

                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(
                                    event,
                                ) => {
                                    const file =
                                        event
                                            .target
                                            .files?.[0];

                                    setNewImage(
                                        file ??
                                        null,
                                    );
                                }}
                            />
                        </label>

                        {newImage && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-red-500"
                                onClick={() =>
                                    setNewImage(
                                        null,
                                    )
                                }
                            >
                                Keep Current
                                Image
                            </Button>
                        )}
                    </div>
                </FormItem>

                {/* Description */}

                <div className="md:col-span-2">
                    <FormItem label="Description">
                        <Textarea
                            {...register(
                                "description",
                            )}
                            rows={4}
                            placeholder="Appeal description"
                        />
                    </FormItem>
                </div>

                {/* Image Context */}

                <div className="md:col-span-2">
                    <FormItem label="Image Context / Location">
                        <Input
                            {...register(
                                "imageContext",
                            )}
                            placeholder="Image context"
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
        useFormContext<IAppealEditFormValues>();

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
            description="Update appeal hero highlights."
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
                <EmptyState text="No hero highlights." />
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
        useFormContext<IAppealEditFormValues>();

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
            description="Update Hadith and Islamic references."
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
                <EmptyState text="No Islamic quotes." />
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
                                    placeholder="Hadith"
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

function MattersSection({
    newImages,
    setNewImages,
}: {
    newImages: File[];
    setNewImages: (files: File[]) => void;
}) {
    const {
        control,
    } =
        useFormContext<IAppealEditFormValues>();

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
            description="Update matters and statistics."
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
            {fields.length === 0 ? (
                <EmptyState text="No matters." />
            ) : (
                <div className="space-y-5">
                    {fields.map(
                        (
                            field,
                            index,
                        ) => (
                            <MatterItem
                                key={field.id}
                                index={index}
                                onRemove={() => remove(index)}
                                newImages={newImages}
                                setNewImages={setNewImages}
                            />
                        ),
                    )}
                </div>
            )}
        </FormSection>
    );
}

function MatterItem({
    index,
    onRemove,
    newImages,
    setNewImages,
}: {
    index: number;
    onRemove: () => void;
    newImages: File[];
    setNewImages: (files: File[]) => void;
}) {
    const {
        control,
        register,
    } =
        useFormContext<IAppealEditFormValues>();

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
                    onClick={
                        onRemove
                    }
                />
            </div>

            <div className="space-y-4">
                <Input
                    {...register(
                        `matters.${index}.title`,
                    )}
                    placeholder="Title"
                />

                <Textarea
                    {...register(
                        `matters.${index}.description`,
                    )}
                    rows={3}
                    placeholder="Description"
                />
                {/* Matter Images Upload */}
                {index === 0 && (
                    <FormItem label="Matter Images">
                        <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-dashed px-4 py-3 hover:bg-slate-50">
                            <Upload className="h-4 w-4 shrink-0 text-slate-500" />

                            <span className="text-sm text-slate-600">
                                {newImages.length > 0
                                    ? `${newImages.length} image(s) selected`
                                    : "Choose matter images"}
                            </span>

                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={(event) => {
                                    const files = Array.from(
                                        event.target.files ?? [],
                                    );

                                    setNewImages(
                                        files.slice(0, 10),
                                    );

                                    event.target.value = "";
                                }}
                            />
                        </label>
                    </FormItem>
                )}
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
    const {
        control,
    } =
        useFormContext<IAppealEditFormValues>();

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
            description="Update what support provides and how it works."
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
                <EmptyState text="No support sections." />
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
        useFormContext<IAppealEditFormValues>();

    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: `supports.${index}.supportHighlights`,
    });

    const category =
        watch(
            `supports.${index}.category`,
        ) || "Provides";

    return (
        <div className="rounded-xl border bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">
                    Support {index + 1}
                </h3>

                <DeleteButton
                    onClick={
                        onRemove
                    }
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <FormItem label="Title">
                    <Input
                        {...register(
                            `supports.${index}.title`,
                        )}
                        placeholder="Support title"
                    />
                </FormItem>

                <FormItem label="Category">
                    <Select
                        value={
                            category
                        }
                        onValueChange={(
                            value,
                        ) =>
                            setValue(
                                `supports.${index}.category`,
                                value as
                                | "Provides"
                                | "Works",
                                {
                                    shouldDirty:
                                        true,
                                },
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
    currentImage,
    newImage,
    setNewImage,
}: {
    currentImage?: string;

    newImage: File | null;

    setNewImage: (
        file: File | null,
    ) => void;
}) {
    const {
        control,
    } =
        useFormContext<IAppealEditFormValues>();

    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: "impacts",
    });

    const newImagePreview =
        useMemo(() => {
            if (!newImage) {
                return null;
            }

            return URL.createObjectURL(
                newImage,
            );
        }, [newImage]);

    const preview =
        newImagePreview ||
        currentImage;

    return (
        <FormSection
            title="Impact"
            description="Update project impact image and statistics."
            action={
                fields.length === 0 ? (
                    <AddButton
                        label="Add Impact"
                        onClick={() =>
                            append({
                                title: "",
                                image: "",
                                impactHighlights:
                                    [],
                            })
                        }
                    />
                ) : undefined
            }
        >
            {/* Impact Image */}

            <FormItem label="Impact Image">
                <div className="space-y-3">
                    {preview && (
                        <div className="relative h-48 overflow-hidden rounded-xl border bg-slate-100">
                            <Image
                                src={
                                    preview
                                }
                                alt="Impact image"
                                fill
                                className="object-cover"
                            />

                            <div className="absolute left-3 top-3 rounded bg-black/70 px-2 py-1 text-[11px] text-white">
                                {newImage
                                    ? "New Image"
                                    : "Current Image"}
                            </div>
                        </div>
                    )}

                    <label className="flex h-10 cursor-pointer items-center gap-3 rounded-md border border-dashed px-4 hover:bg-slate-50">
                        <Upload className="h-4 w-4 text-slate-500" />

                        <span className="truncate text-sm text-slate-600">
                            {newImage
                                ? newImage.name
                                : "Choose new impact image"}
                        </span>

                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(
                                event,
                            ) => {
                                const file =
                                    event
                                        .target
                                        .files?.[0];

                                setNewImage(
                                    file ??
                                    null,
                                );
                            }}
                        />
                    </label>

                    {newImage && (
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="text-red-500"
                            onClick={() =>
                                setNewImage(
                                    null,
                                )
                            }
                        >
                            Keep Current
                            Image
                        </Button>
                    )}
                </div>
            </FormItem>

            {/* Impact Array */}

            <div className="mt-5 space-y-5">
                {fields.map(
                    (
                        field,
                        index,
                    ) => (
                        <ImpactItem
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
        </FormSection>
    );
}

function ImpactItem({
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
        useFormContext<IAppealEditFormValues>();

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
            <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">
                    Impact {index + 1}
                </h3>

                <DeleteButton
                    onClick={
                        onRemove
                    }
                />
            </div>

            <FormItem label="Impact Title">
                <Input
                    {...register(
                        `impacts.${index}.title`,
                    )}
                    placeholder="Impact title"
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
                                placeholder="Value"
                            />

                            <Input
                                {...register(
                                    `impacts.${index}.impactHighlights.${highlightIndex}.label`,
                                )}
                                placeholder="Label"
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
        useFormContext<IAppealEditFormValues>();

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
            description="Update questions and answers."
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
                <EmptyState text="No FAQs." />
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

                                <div className="grid gap-3 md:grid-cols-[1fr_110px]">
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
        watch,
        setValue,
    } =
        useFormContext<IAppealEditFormValues>();

    const donationForm =
        watch(
            "donationForm",
        );

    if (!donationForm) {
        return (
            <FormSection
                title="Donation Form"
                description="No donation form is currently configured."
            >
                <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                        setValue(
                            "donationForm",
                            {
                                title: "",
                                context: "",
                                donationAmountOptions:
                                    [],
                            },
                            {
                                shouldDirty:
                                    true,
                            },
                        )
                    }
                >
                    <Plus className="mr-2 h-4 w-4" />

                    Add Donation
                    Form
                </Button>
            </FormSection>
        );
    }

    return (
        <DonationFormFields />
    );
}

function DonationFormFields() {
    const {
        control,
        register,
        watch,
        setValue,
    } =
        useFormContext<IAppealEditFormValues>();

    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control,

        // donationForm is checked before this component renders
        name:
            "donationForm.donationAmountOptions" as any,
    });

    return (
        <FormSection
            title="Donation Form"
            description="Update donation form and amount options."
            action={
                <div className="flex gap-2">
                    <AddButton
                        label="Add Amount"
                        onClick={() =>
                            append({
                                amount: 0,
                                title: "",
                                isCustom:
                                    false,
                                isActive:
                                    true,
                                sortOrder:
                                    fields.length +
                                    1,
                            })
                        }
                    />

                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600"
                        onClick={() =>
                            setValue(
                                "donationForm",
                                null,
                                {
                                    shouldDirty:
                                        true,
                                },
                            )
                        }
                    >
                        Remove Form
                    </Button>
                </div>
            }
        >
            <div className="grid gap-5 md:grid-cols-2">
                <FormItem label="Form Title">
                    <Input
                        {...register(
                            "donationForm.title",
                        )}
                        placeholder="Donation form title"
                    />
                </FormItem>

                <FormItem label="Context">
                    <Input
                        {...register(
                            "donationForm.context",
                        )}
                        placeholder="Donation form context"
                    />
                </FormItem>
            </div>

            <div className="mt-6 space-y-3">
                {fields.length === 0 && (
                    <EmptyState text="No donation options." />
                )}

                {fields.map(
                    (
                        field,
                        index,
                    ) => {
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
                                className="grid gap-3 rounded-xl border bg-slate-50 p-4 lg:grid-cols-[130px_1fr_130px_130px_110px_auto]"
                            >
                                {/* Amount */}

                                <Input
                                    type="number"
                                    disabled={
                                        !!isCustom
                                    }
                                    {...register(
                                        `donationForm.donationAmountOptions.${index}.amount`,
                                        {
                                            setValueAs:
                                                (
                                                    value,
                                                ) => {
                                                    if (
                                                        isCustom ||
                                                        value ===
                                                        ""
                                                    ) {
                                                        return null;
                                                    }

                                                    return Number(
                                                        value,
                                                    );
                                                },
                                        },
                                    )}
                                    placeholder="Amount"
                                />

                                {/* Title */}

                                <Input
                                    {...register(
                                        `donationForm.donationAmountOptions.${index}.title`,
                                    )}
                                    placeholder="Option title"
                                />

                                {/* Custom */}

                                <label className="flex cursor-pointer items-center gap-2 rounded-md border bg-white px-3 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={
                                            !!isCustom
                                        }
                                        onChange={(
                                            event,
                                        ) => {
                                            const checked =
                                                event
                                                    .target
                                                    .checked;

                                            setValue(
                                                `donationForm.donationAmountOptions.${index}.isCustom`,
                                                checked,
                                                {
                                                    shouldDirty:
                                                        true,
                                                },
                                            );

                                            if (
                                                checked
                                            ) {
                                                setValue(
                                                    `donationForm.donationAmountOptions.${index}.amount`,
                                                    null,
                                                    {
                                                        shouldDirty:
                                                            true,
                                                    },
                                                );
                                            }
                                        }}
                                    />

                                    Custom
                                </label>

                                {/* Active */}

                                <label className="flex cursor-pointer items-center gap-2 rounded-md border bg-white px-3 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={
                                            !!isActive
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            setValue(
                                                `donationForm.donationAmountOptions.${index}.isActive`,
                                                event
                                                    .target
                                                    .checked,
                                                {
                                                    shouldDirty:
                                                        true,
                                                },
                                            )
                                        }
                                    />

                                    Active
                                </label>

                                {/* Order */}

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
   COMMON COMPONENTS
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
                            {
                                description
                            }
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
    children,
}: {
    label: string;

    children: React.ReactNode;
}) {
    return (
        <div className="space-y-2">
            <Label>
                {label}
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
            onClick={
                onClick
            }
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
            onClick={
                onClick
            }
            className="shrink-0 text-red-500 hover:bg-red-50 hover:text-red-600"
        >
            <Trash2 className="h-4 w-4" />
        </Button>
    );
}

function EmptyState({
    text,
}: {
    text: string;
}) {
    return (
        <div className="rounded-lg border border-dashed bg-slate-50 px-4 py-7 text-center text-sm text-slate-500">
            {text}
        </div>
    );
}