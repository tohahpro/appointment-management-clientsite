import { UserRole } from "@/lib/authUtils";
import { IAdmin } from "./admin.interface";
import { IPatient } from "./patient.interface";
import { IDoctor } from "./doctor.interface";

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'DELETED';


export interface UserInfo {
    id: string;
    email: string;
    password: string;
    role: UserRole;
    status: UserStatus;
    admin?: IAdmin;
    patient?: IPatient;
    doctor?: IDoctor;
    createdAt: string;
    updatedAt: string;
}
