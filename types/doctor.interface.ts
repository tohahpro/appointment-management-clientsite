export interface DoctorSpecialty {
    id: string;
    doctorId: string;
    specialitiesId: string;
    specialities: {
        id: string;
        name: string;
        description?: string | null;
    };
}

export interface IDoctor {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string | null;
    contactNumber: string;
    address: string;
    registrationNumber: string;
    experience: number;
    gender: "MALE" | "FEMALE" | "OTHER";
    appointmentFee: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
    averageRating: number;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    doctorSpecialties?: DoctorSpecialty[];
}