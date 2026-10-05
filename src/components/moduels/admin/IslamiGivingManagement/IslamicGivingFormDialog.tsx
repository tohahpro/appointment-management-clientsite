/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
    Controller,
    FormProvider,
    useFieldArray,
    useForm,
    useFormContext,
} from "react-hook-form";

import {
    ImageIcon,
    Plus,
    Trash2,
    UploadCloud,
    X,
} from "lucide-react";

import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Attachment,
    AttachmentAction,
    AttachmentActions,
    AttachmentContent,
    AttachmentDescription,
    AttachmentMedia,
    AttachmentTitle,
} from "@/components/ui/attachment";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { IIslamicGiving } from "../../../../../types/islamicGiving.interface";
import { createIslamicGiving, updateIslamicGiving } from "@/services/admin/IslamicGivingManagement";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/* =========================================================
   TYPES
========================================================= */

interface IslamicGivingFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    islamicGiving: IIslamicGiving | null;
}

interface IslamicGivingFormValues {
    pageName: string;
    title: string;

    donationForm: {
        title: string;
        context?: string;
        expectedAmount?: number | null;
        donationEnd?: string | null;

        donationAmountOptions: {
            amount?: number | null;
            title?: string;
            isCustom: boolean;
            isActive: boolean;
            sortOrder: number;
        }[];
    };
}

interface ExistingGivingImage {
    id?: string;
    image: string;
    order?: number;
}

/* =========================================================
   DEFAULT VALUES
========================================================= */

const defaultValues: IslamicGivingFormValues = {
    pageName: "",
    title: "",

    donationForm: {
        title: "",
        context: "",
        expectedAmount: null,
        donationEnd: "",
        donationAmountOptions: [],
    },
};

/* =========================================================
   HELPERS
========================================================= */

const getFormValues = (
    item: IIslamicGiving
): IslamicGivingFormValues => {
    const donationForm = item.donationForms;

    return {
        pageName: item.pageName ?? "",
        title: item.title ?? "",

        donationForm: {
            title: donationForm?.title ?? "",
            context: donationForm?.context ?? "",
            expectedAmount: donationForm?.expectedAmount ?? null,
            donationEnd: donationForm?.donationEnd ? donationForm.donationEnd.split("T")[0] : "",
            donationAmountOptions: donationForm?.donationAmountOptions?.map(
                (option, index) => ({
                    amount: option.isCustom ? null : option.amount ?? null,
                    title: option.title ?? "",
                    isCustom: option.isCustom ?? false,
                    isActive: option.isActive ?? true,
                    sortOrder: option.sortOrder ?? index + 1,
                })
            ) ?? [],
        },
    };
};

const getExistingImages = (item: IIslamicGiving): ExistingGivingImage[] => (item.islamicGivingImages ?? []).map(
    ({ id, image, order }) => ({
        id, image, order: order ?? undefined,
    })
);

const formatFileSize = (bytes: number) => {
    const kb = bytes / 1024;

    if (kb < 1024) {
        return `${kb.toFixed(1)} KB`;
    }
    return `${(kb / 1024).toFixed(2)} MB`;
};

/* =========================================================
   MAIN DIALOG
========================================================= */

const IslamicGivingFormDialog = ({
    open,
    onClose,
    onSuccess,
    islamicGiving,
}: IslamicGivingFormDialogProps) => {

    const methods = useForm<IslamicGivingFormValues>({ defaultValues, });
    const { handleSubmit, reset, formState: { isSubmitting }, } = methods;

    const [heroImage, setHeroImage,] = useState<File | null>(null);
    const [heroPreview, setHeroPreview] = useState("");
    const [givingImages, setGivingImages] = useState<File[]>([]);
    const [existingGivingImages, setExistingGivingImages,] = useState<ExistingGivingImage[]>([]);

    useEffect(() => {
        if (!open || !islamicGiving) {
            return;
        }

        reset(getFormValues(islamicGiving));
        setHeroImage(null);
        setHeroPreview(islamicGiving.image ?? "");
        setGivingImages([]);
        setExistingGivingImages(
            getExistingImages(islamicGiving)
        );
    }, [open, islamicGiving, reset]);


    const handleClose = () => {
        if (isSubmitting) {
            return;
        }
        reset(defaultValues);

        setHeroImage(null);
        setHeroPreview("");

        setGivingImages([]);
        setExistingGivingImages(
            []
        );

        onClose();
    };

    const handleHeroImage = (file: File | null) => {
        if (!file) return;

        setHeroImage(file);
        setHeroPreview(
            URL.createObjectURL(file)
        );
    };


    const handleGivingImages = (files: FileList | null) => {
        if (!files) return;

        setGivingImages(
            (previous) => [...previous, ...Array.from(files)]
        );
    };

    const onSubmit = async (data: IslamicGivingFormValues) => {
        const isEdit = !!islamicGiving?.id;

        // Create হলে hero image required
        if (!isEdit && !heroImage) {
            toast.error("Main image is required");
            return;
        }

        // Create হলে অন্তত 1টা giving image required
        if (!isEdit && givingImages.length === 0) {
            toast.error("At least one giving image is required");
            return;
        }

        if (givingImages.length > 10) {
            toast.error("Maximum 10 giving images are allowed");
            return;
        }

        try {
            const payload = {
                ...data,

                pageName: data.pageName.trim(),
                title: data.title.trim(),

                donationForm: {
                    ...data.donationForm,

                    title: data.donationForm.title.trim(),

                    context:
                        data.donationForm.context?.trim() || null,

                    expectedAmount:
                        data.donationForm.expectedAmount ?? null,

                    donationEnd:
                        data.donationForm.donationEnd || null,

                    donationAmountOptions:
                        data.donationForm.donationAmountOptions.map(
                            (option, index) => ({
                                amount: option.isCustom
                                    ? null
                                    : Number(option.amount),

                                title:
                                    option.title?.trim() || null,

                                isCustom: option.isCustom,
                                isActive: option.isActive,

                                sortOrder:
                                    option.sortOrder ?? index,
                            })
                        ),
                },
            };

            const formData = new FormData();
            formData.append("data", JSON.stringify(payload));

            if (heroImage) {
                formData.append("image", heroImage);
            }

            givingImages.forEach((file) => {
                formData.append("givingImages", file);
            });

            console.log(payload)

            const result = isEdit ? await updateIslamicGiving(islamicGiving.id, null, formData)
                : await createIslamicGiving(null, formData);

            toast.success(result?.message ||
                `Islamic Giving ${isEdit ? "updated" : "created"} successfully`
            );

            reset(defaultValues);

            setHeroImage(null);
            setHeroPreview("");
            setGivingImages([]);

            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(
                error?.message || "Something went wrong"
            );
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value) { handleClose() }
            }}
        >
            <DialogContent className="flex max-h-[95vh] w-[92vw] flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl">
                {/* HEADER */}

                <DialogHeader className="shrink-0 border-b bg-white px-6 py-5">
                    <DialogTitle className="text-2xl font-bold text-slate-900">
                        Edit Islamic Giving
                    </DialogTitle>

                    <DialogDescription>
                        Update page information,
                        images and donation
                        options.
                    </DialogDescription>
                </DialogHeader>

                <FormProvider
                    {...methods}
                >
                    <form
                        onSubmit={handleSubmit(
                            onSubmit
                        )}
                        className="flex min-h-0 flex-1 flex-col"
                    >
                        {/* SCROLL BODY */}

                        <div className="flex-1 overflow-y-auto bg-slate-50">
                            <div className="space-y-6 p-6">
                                <BasicInformation
                                    heroImage={heroImage}
                                    heroPreview={heroPreview}
                                    onHeroImage={handleHeroImage}
                                />
                                <GivingImagesSection
                                    existingImages={existingGivingImages}
                                    newImages={givingImages}
                                    onAdd={handleGivingImages}
                                    onRemoveExisting={(index) =>
                                        setExistingGivingImages(
                                            (previous) => previous.filter((_, i) => i !== index)
                                        )
                                    }
                                    onRemoveNew={(index) =>
                                        setGivingImages((previous) =>
                                            previous.filter((_, i) => i !== index)
                                        )
                                    }
                                />

                                <DonationFormSection />
                            </div>
                        </div>

                        {/* FOOTER */}

                        <div className="flex shrink-0 justify-end gap-3 border-t bg-white px-6 py-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#D23157] text-white hover:bg-[#bd294c]"
                            >
                                {isSubmitting ? "Processing..." : "Update Islamic Giving"}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
};

export default IslamicGivingFormDialog;


function BasicInformation({ heroImage, heroPreview, onHeroImage }: {
    heroImage: File | null;
    heroPreview: string;
    onHeroImage: (file: File | null) => void;
}) {
    const { control, register, formState: { errors }, } = useFormContext<IslamicGivingFormValues>();

    return (
        <FormSection
            title="Basic Information"
            description="Update the main page information."
        >
            <div className="grid gap-5 md:grid-cols-2">
                <FormItem label="Page Name" required
                >
                    <Controller
                        name="pageName"
                        control={control}
                        rules={{
                            required: "Page name is required",
                        }}
                        render={({ field }) => (
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger className="w-full h-12! rounded">
                                    <SelectValue placeholder="Select page" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="zakat">
                                        Zakat
                                    </SelectItem>

                                    <SelectItem value="zakat-ul-fitr">
                                        Zakat-ul-Fitr
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />

                    {errors.pageName && (
                        <ErrorText
                            text={errors.pageName.message}
                        />
                    )}
                </FormItem>

                <FormItem
                    label="Page Title"
                    required
                >
                    <Input
                        {...register(
                            "title",
                            {
                                required:
                                    "Title is required",
                            }
                        )}
                        placeholder="Give Your Zakat"
                    />

                    {errors.title && (
                        <ErrorText
                            text={
                                errors.title
                                    .message
                            }
                        />
                    )}
                </FormItem>

                <div className="md:col-span-2">
                    <ImageUploadBox
                        title={
                            heroImage
                                ? heroImage.name
                                : "Upload hero image"
                        }
                        description="PNG, JPG, JPEG or WEBP"
                        onChange={(
                            files
                        ) =>
                            onHeroImage(
                                files?.[0] ??
                                null
                            )
                        }
                    />
                </div>

                {heroPreview && (
                    <div className="md:col-span-2">
                        <div className="relative aspect-16/7 overflow-hidden rounded-xl border">
                            <Image
                                src={
                                    heroPreview
                                }
                                alt="Hero"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                )}
            </div>
        </FormSection>
    );
}

/* =========================================================
   GIVING IMAGES
========================================================= */

function GivingImagesSection({
    existingImages,
    newImages,
    onAdd,
    onRemoveExisting,
    onRemoveNew,
}: {
    existingImages: ExistingGivingImage[];
    newImages: File[];

    onAdd: (
        files: FileList | null
    ) => void;

    onRemoveExisting: (
        index: number
    ) => void;

    onRemoveNew: (
        index: number
    ) => void;
}) {
    return (
        <FormSection
            title="Giving Images"
            description="Upload supporting images for this page."
        >
            <ImageUploadBox
                title="Upload giving images"
                description="Select multiple images"
                multiple
                onChange={
                    onAdd
                }
            />

            <div className="mt-5">
                {existingImages.length ===
                    0 &&
                    newImages.length === 0 ? (
                    <EmptyMessage text="No giving images added." />
                ) : (
                    <div className="grid gap-3 md:grid-cols-2">
                        {existingImages.map(
                            (
                                item,
                                index
                            ) => (
                                <ImageAttachment
                                    key={
                                        item.id ??
                                        item.image
                                    }
                                    src={
                                        item.image
                                    }
                                    title={`Giving Image ${index +
                                        1
                                        }`}
                                    description="Existing image"
                                    onRemove={() =>
                                        onRemoveExisting(
                                            index
                                        )
                                    }
                                />
                            )
                        )}

                        {newImages.map(
                            (
                                file,
                                index
                            ) => (
                                <FileAttachment
                                    key={`${file.name}-${file.lastModified}-${index}`}
                                    file={
                                        file
                                    }
                                    onRemove={() =>
                                        onRemoveNew(
                                            index
                                        )
                                    }
                                />
                            )
                        )}
                    </div>
                )}
            </div>
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
        formState: { errors },
    } = useFormContext<IslamicGivingFormValues>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "donationForm.donationAmountOptions",
    });

    return (
        <FormSection
            title="Donation Form"
            description="Configure donation details and amount options."
        >
            <div className="grid gap-4 md:grid-cols-2">
                <FormItem label="Form Title" required>
                    <Input
                        {...register("donationForm.title", {
                            required: "Donation form title is required",
                        })}
                        placeholder="Give Your Zakat"
                    />

                    {errors.donationForm?.title && (
                        <ErrorText
                            text={errors.donationForm.title.message}
                        />
                    )}
                </FormItem>

                <FormItem label="Expected Amount">
                    <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="10000"
                        {...register("donationForm.expectedAmount", {
                            setValueAs: (value) =>
                                value === "" ? null : Number(value),
                        })}
                    />
                </FormItem>

                <FormItem label="Donation End">
                    <Input
                        type="date"
                        {...register("donationForm.donationEnd")}
                    />
                </FormItem>

                <div className="md:col-span-2">
                    <FormItem label="Context">
                        <Textarea
                            rows={4}
                            className="resize-none"
                            {...register("donationForm.context")}
                            placeholder="Write donation context..."
                        />
                    </FormItem>
                </div>
            </div>

            {/* Amount Options Header */}
            <div className="mt-6 flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="font-semibold">
                        Donation Amount Options
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        Add preset or custom donation amounts.
                    </p>
                </div>

                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                        append({
                            amount: 0,
                            title: "",
                            isCustom: false,
                            isActive: true,
                            sortOrder: fields.length + 1,
                        })
                    }
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Amount
                </Button>
            </div>

            {/* Options */}
            <div className="mt-4 space-y-4">
                {fields.length === 0 && (
                    <EmptyMessage text="No donation amount options added." />
                )}

                {fields.map((field, index) => {
                    const isCustom = watch(
                        `donationForm.donationAmountOptions.${index}.isCustom`
                    );

                    const isActive = watch(
                        `donationForm.donationAmountOptions.${index}.isActive`
                    );

                    return (
                        <div
                            key={field.id}
                            className="rounded-xl border bg-slate-50 p-4"
                        >
                            {/* Header */}
                            <div className="mb-4 flex items-center justify-between">
                                <h4 className="text-sm font-semibold">
                                    Donation Option {index + 1}
                                </h4>

                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => remove(index)}
                                    className="h-8 w-8 text-red-500 hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* One Row */}
                            <div className="flex flex-wrap items-end gap-4">
                                {/* Amount */}
                                <div className="min-w-37.5 flex-1">
                                    <Label className="mb-2 block">
                                        Amount
                                    </Label>

                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        disabled={isCustom}
                                        placeholder={
                                            isCustom
                                                ? "Custom"
                                                : "Amount"
                                        }
                                        {...register(
                                            `donationForm.donationAmountOptions.${index}.amount`,
                                            {
                                                setValueAs: (value) =>
                                                    isCustom ||
                                                        value === ""
                                                        ? null
                                                        : Number(value),
                                            }
                                        )}
                                    />
                                </div>

                                {/* Sort Order */}
                                <div className="w-30">
                                    <Label className="mb-2 block">
                                        Sort Order
                                    </Label>

                                    <Input
                                        type="number"
                                        min="0"
                                        {...register(
                                            `donationForm.donationAmountOptions.${index}.sortOrder`,
                                            {
                                                valueAsNumber: true,
                                            }
                                        )}
                                        placeholder="1"
                                    />
                                </div>

                                {/* Custom */}
                                <label className="flex h-10 cursor-pointer items-center gap-2 rounded-md border bg-white px-3">
                                    <input
                                        type="checkbox"
                                        checked={isCustom}
                                        onChange={(e) => {
                                            setValue(
                                                `donationForm.donationAmountOptions.${index}.isCustom`,
                                                e.target.checked
                                            );

                                            if (e.target.checked) {
                                                setValue(
                                                    `donationForm.donationAmountOptions.${index}.amount`,
                                                    null
                                                );
                                            }
                                        }}
                                    />

                                    <span className="text-sm">
                                        Custom
                                    </span>
                                </label>

                                {/* Active */}
                                <label className="flex h-10 cursor-pointer items-center gap-2 rounded-md border bg-white px-3">
                                    <input
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={(e) =>
                                            setValue(
                                                `donationForm.donationAmountOptions.${index}.isActive`,
                                                e.target.checked
                                            )
                                        }
                                    />

                                    <span className="text-sm">
                                        Active
                                    </span>
                                </label>
                            </div>

                            {/* Title */}
                            <div className="mt-4">
                                <Label className="mb-2 block">
                                    Title
                                </Label>

                                <Textarea
                                    rows={3}
                                    className="resize-none bg-white"
                                    placeholder="Write donation option title..."
                                    {...register(
                                        `donationForm.donationAmountOptions.${index}.title`
                                    )}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </FormSection>
    );
}


//    IMAGE UPLOAD

function ImageUploadBox({
    title,
    description,
    multiple = false,
    onChange,
}: {
    title: string;
    description?: string;
    multiple?: boolean;

    onChange: (
        files: FileList | null
    ) => void;
}) {
    return (
        <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-slate-50 p-6 text-center transition hover:bg-slate-100">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border bg-white">
                <UploadCloud className="h-5 w-5 text-slate-500" />
            </div>

            <p className="text-sm font-semibold">
                {title}
            </p>

            {description && (
                <p className="mt-1 text-xs text-muted-foreground">
                    {description}
                </p>
            )}

            <input
                type="file"
                accept="image/*"
                multiple={
                    multiple
                }
                hidden
                onChange={(e) => {
                    onChange(
                        e.target.files
                    );

                    e.target.value =
                        "";
                }}
            />
        </label>
    );
}

/* =========================================================
   EXISTING IMAGE ATTACHMENT
========================================================= */

function ImageAttachment({
    src,
    title,
    description,
    onRemove,
}: {
    src: string;
    title: string;
    description?: string;
    onRemove: () => void;
}) {
    return (
        <Attachment
            state="done"
            orientation="horizontal"
            className="bg-white"
        >
            <AttachmentMedia
                variant="image"
                className="overflow-hidden"
            >
                <img
                    src={src}
                    alt={title}
                    className="h-full w-full object-cover"
                />
            </AttachmentMedia>

            <AttachmentContent>
                <AttachmentTitle>
                    {title}
                </AttachmentTitle>

                <AttachmentDescription>
                    {description}
                </AttachmentDescription>
            </AttachmentContent>

            <AttachmentActions>
                <AttachmentAction
                    type="button"
                    onClick={
                        onRemove
                    }
                >
                    <X className="h-4 w-4" />
                </AttachmentAction>
            </AttachmentActions>
        </Attachment>
    );
}


function FileAttachment({ file, onRemove }: {
    file: File;
    onRemove: () => void;
}) {
    const [preview, setPreview] = useState("");

    useEffect(() => {
        const url = URL.createObjectURL(file);

        setPreview(url);

        return () =>
            URL.revokeObjectURL(url);
    }, [file]);

    return (
        <Attachment
            state="idle"
            orientation="horizontal"
            className="bg-white"
        >
            <AttachmentMedia
                variant="image"
                className="overflow-hidden"
            >
                {preview ? (
                    <img
                        src={preview}
                        alt={file.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <ImageIcon className="h-4 w-4" />
                )}
            </AttachmentMedia>

            <AttachmentContent>
                <AttachmentTitle className="truncate">
                    {file.name}
                </AttachmentTitle>

                <AttachmentDescription>
                    {formatFileSize(
                        file.size
                    )}
                    {" · "}
                    Ready to upload
                </AttachmentDescription>
            </AttachmentContent>

            <AttachmentActions>
                <AttachmentAction
                    type="button"
                    onClick={onRemove}
                >
                    <X className="h-4 w-4" />
                </AttachmentAction>
            </AttachmentActions>
        </Attachment>
    );
}

/* =========================================================
   SMALL REUSABLE UI
========================================================= */

function FormSection({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-6 border-b pb-5">
                <h2 className="text-lg font-semibold">
                    {title}
                </h2>

                {description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
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


function ErrorText({ text }: { text?: string; }) {
    if (!text) return null;
    return (
        <p className="text-sm text-red-500">            {text}        </p>
    );
}

function EmptyMessage({ text }: { text: string }) {
    return (
        <div className="rounded-lg border border-dashed bg-slate-50 px-4 py-8 text-center text-sm text-muted-foreground">
            {text}
        </div>
    );
}