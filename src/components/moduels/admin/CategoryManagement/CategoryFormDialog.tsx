"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { createCategory } from "@/services/admin/categoryManagement";

interface CategoryFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CategoryFormDialog = ({
    open,
    onClose,
    onSuccess,
}: CategoryFormDialogProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    const [isPending, startTransition] = useTransition();

    const resetForm = () => {
        setName("");
        setDescription("");
        setError("");
    };

    const handleClose = () => {
        if (isPending) return;

        resetForm();
        onClose();
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        setError("");

        if (!name.trim()) {
            setError("Category name is required");
            return;
        }

        const formData = new FormData();

        formData.append("name", name.trim());
        formData.append("description", description.trim());

        startTransition(async () => {
            const result = await createCategory(null, formData);

            if (result.success) {
                toast.success(
                    result.message || "Category created successfully"
                );

                resetForm();
                onClose();
                onSuccess();

                return;
            }

            toast.error(result.message || "Failed to create category");
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value) { handleClose() }
            }}
        >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        Add Category
                    </DialogTitle>

                    <DialogDescription>
                        Create a new appeal category.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    {/* Category Name */}
                    <div className="space-y-2">
                        <Label htmlFor="category-name">
                            Category Name

                            <span className="ml-1 text-red-500">
                                *
                            </span>
                        </Label>

                        <Input
                            id="category-name"
                            name="name"
                            type="text"
                            value={name}
                            onChange={(event) => {
                                setName(
                                    event.target.value
                                );

                                if (error) {
                                    setError("");
                                }
                            }}
                            placeholder="Enter category name"
                            disabled={isPending}
                        />

                        {error && (
                            <p className="text-sm font-medium text-red-600">
                                {error}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="category-description">
                            Description
                        </Label>

                        <Textarea
                            id="category-description"
                            name="description"
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            placeholder="Enter category description"
                            rows={4}
                            disabled={isPending}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 border-t pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-[#D23157] text-white hover:bg-[#bd294c]"
                        >
                            {isPending
                                ? "Creating..."
                                : "Create Category"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CategoryFormDialog;