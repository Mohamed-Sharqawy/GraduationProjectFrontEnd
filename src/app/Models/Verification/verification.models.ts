export interface VerificationFiles {
    idCardFront: File | null;
    idCardBack: File | null;
    selfieWithId: File | null;
}

export interface VerificationStatus {
    isVerified: boolean;
    status: 'pending' | 'approved' | 'rejected' | 'not_submitted';
    submittedAt?: Date;
}
