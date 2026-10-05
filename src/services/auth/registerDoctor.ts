"use server";

import { serverFetch } from "@/lib/server-fetch";
import { loginUser } from "./loginUser";
import { registerDoctorValidationZodSchema } from "@/zod/doctor.validation";

export const registerDoctor = async (
    _currentState: any,
    formData: FormData
): Promise<any> => {
    try {
        // =========================================
        // Get specialties
        // =========================================

        const specialties = formData
            .getAll("specialties")
            .map((item) => item.toString())
            .filter(Boolean);

        // =========================================
        // Prepare validation data
        // =========================================

        const validationData = {
            name: formData.get("name")?.toString() || "",
            email: formData.get("email")?.toString() || "",
            password: formData.get("password")?.toString() || "",
            confirmPassword:
                formData.get("confirmPassword")?.toString() || "",

            contactNumber:
                formData.get("contactNumber")?.toString() || "",

            address:
                formData.get("address")?.toString() || "",

            registrationNumber:
                formData.get("registrationNumber")?.toString() || "",

            experience: Number(
                formData.get("experience") || 0
            ),

            gender:
                formData.get("gender")?.toString() || "",

            appointmentFee: Number(
                formData.get("appointmentFee") || 0
            ),

            qualification:
                formData.get("qualification")?.toString() || "",

            currentWorkingPlace:
                formData
                    .get("currentWorkingPlace")
                    ?.toString() || "",

            designation:
                formData.get("designation")?.toString() || "",

            specialties,
        };

        // =========================================
        // Validate
        // =========================================

        const validatedFields = registerDoctorValidationZodSchema.safeParse(validationData);

        if (!validatedFields.success) {
            return {
                success: false,
                formData: validationData,
            };
        }

        // =========================================
        // API payload
        // =========================================

        const registerData = {
            password: validationData.password,

            doctor: {
                name: validationData.name,
                email: validationData.email,
                contactNumber:
                    validationData.contactNumber,
                address: validationData.address,

                registrationNumber:
                    validationData.registrationNumber,

                experience:
                    validationData.experience,

                gender:
                    validationData.gender,

                appointmentFee:
                    validationData.appointmentFee,

                qualification:
                    validationData.qualification,

                currentWorkingPlace:
                    validationData.currentWorkingPlace,

                designation:
                    validationData.designation,

                specialties:
                    validationData.specialties,
            },
        };

        // =========================================
        // Multipart form data
        // =========================================

        const newFormData = new FormData();

        newFormData.append(
            "data",
            JSON.stringify(registerData)
        );

        const file = formData.get("file");

        if (file instanceof File && file.size > 0) {
            newFormData.append("file", file);
        }

        // =========================================
        // API Request
        // =========================================

        const response = await serverFetch.post(
            "/users/create-doctor",
            {
                body: newFormData,
            }
        );

        const result = await response.json();

        // =========================================
        // Login after registration
        // =========================================

        if (result.success) {
            await loginUser(_currentState, formData);
        }

        return result;
    } catch (error: any) {
        // Next.js redirect error swallow করা যাবে না
        if (
            error?.digest?.startsWith(
                "NEXT_REDIRECT"
            )
        ) {
            throw error;
        }

        console.error("Doctor registration error:", error);

        return {
            success: false,
            message:
                error?.message ||
                "Doctor registration failed",
        };
    }
};