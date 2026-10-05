"use server";

import { serverFetch } from "@/lib/server-fetch";
import { loginUser } from "./loginUser";
import { registerPatientValidationZodSchema } from "@/zod/patient.validation";

export const registerPatient = async (_currentState: any, formData: FormData): Promise<any> => {
    try {
        // =========================================
        // 1. Prepare validation data
        // =========================================

        const validationData = {
            name: formData.get("name")?.toString() || "",
            email: formData.get("email")?.toString() || "",
            password: formData.get("password")?.toString() || "",
            confirmPassword: formData.get("confirmPassword")?.toString() || "",
            contactNumber: formData.get("contactNumber")?.toString() || "",
            address: formData.get("address")?.toString() || "",
        };

        const validatedFields = registerPatientValidationZodSchema.safeParse(validationData);

        if (!validatedFields.success) {
            return {
                success: false,

                errors: validatedFields.error.issues.map(
                    (issue: any) => ({
                        field: issue.path.join("."),
                        message: issue.message,
                    })
                ),

                formData: validationData,
            };
        }

        const registerData = {
            password: validationData.password,
            patient: {
                name: validationData.name,
                email: validationData.email,
                contactNumber: validationData.contactNumber || undefined,
                address: validationData.address || undefined,
            },
        };

        // =========================================
        // 4. Multipart FormData
        // =========================================

        const newFormData = new FormData();

        newFormData.append("data", JSON.stringify(registerData));

        // =========================================
        // 5. Optional Profile Photo
        // Backend:
        // multerUpload.single("file")
        // =========================================

        const file = formData.get("file");

        if (
            file instanceof File &&
            file.size > 0
        ) {
            newFormData.append(
                "file",
                file
            );
        }

        // =========================================
        // 6. API Request
        // =========================================

        const response = await serverFetch.post("/users/create-patient",
            { body: newFormData }
        );

        const result =
            await response.json();

        // =========================================
        // 7. Auto login after registration
        // =========================================

        if (result.success) {
            await loginUser(
                _currentState,
                formData
            );
        }

        return result;

    } catch (error: any) {
        // Next.js redirect error swallow করবে না
        if (
            error?.digest?.startsWith(
                "NEXT_REDIRECT"
            )
        ) {
            throw error;
        }

        console.error(
            "Patient registration error:",
            error
        );

        return {
            success: false,
            message:
                error?.message ||
                "Patient registration failed",
        };
    }
};