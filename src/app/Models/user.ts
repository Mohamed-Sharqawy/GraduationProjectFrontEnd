import { UserRole } from "./user-role";

export interface User {
    id: string;
    fullName: string;
    phoneNumber: string;
    whatsappNumber?: string;
    role: UserRole;
    isVerified: boolean;
    token: string
}
