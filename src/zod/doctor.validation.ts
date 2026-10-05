import { z } from "zod";

export const registerDoctorValidationZodSchema = z
    .object({
        name: z
            .string()
            .min(2, "Name must be at least 2 characters"),

        email: z
            .string()
            .email("Please enter a valid email address"),

        password: z
            .string()
            .min(6, "Password must be at least 6 characters"),

        confirmPassword: z
            .string()
            .min(6, "Confirm password is required"),

        contactNumber: z
            .string()
            .min(8, "Please enter a valid contact number"),

        address: z
            .string()
            .min(3, "Address is required"),

        registrationNumber: z
            .string()
            .min(2, "Registration number is required"),

        experience: z
            .number()
            .min(0, "Experience cannot be negative"),

        gender: z
            .string()
            .min(1, "Please select gender"),

        appointmentFee: z
            .number()
            .min(0, "Appointment fee cannot be negative"),

        qualification: z
            .string()
            .min(2, "Qualification is required"),

        currentWorkingPlace: z
            .string()
            .min(2, "Current working place is required"),

        designation: z
            .string()
            .min(2, "Designation is required"),

        specialties: z
            .array(z.string())
            .min(1, "Please select at least one specialty"),
    })
    .refine(
        (data) => data.password === data.confirmPassword,
        {
            path: ["confirmPassword"],
            message: "Passwords do not match",
        }
    );