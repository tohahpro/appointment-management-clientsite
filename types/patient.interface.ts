export interface IPatient {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string | null;
    address?: string | null;
    contactNumber?: string | null;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}