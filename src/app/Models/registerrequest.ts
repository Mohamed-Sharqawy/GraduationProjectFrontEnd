import { UserRole } from "./user-role";

export interface Registerrequest {
    fullName: string;
    email: string;
    phoneNumber: string;
    whatsappNumber?: string;
    password: string;
    confirmPassword: string;
    role: UserRole;
}
