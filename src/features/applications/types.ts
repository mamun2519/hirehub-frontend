export interface ApplicationApplicant {
    fullName: string
    email: string
    phone: string
    linkedInUrl?: string
    coverLetter?: string
}

export interface ApplicationResume {
    fileName: string
    fileSize: number
    mimeType: string
    file: File
}

export interface ApplicationPayload {
    jobId: string
    jobTitle: string
    applicant: ApplicationApplicant
    resume: ApplicationResume
    submittedAt: string
}

export interface ApplicationFormValues {
    fullName: string
    email: string
    phone: string
    coverLetter: string
    linkedInUrl: string
    resume: File | null
}
