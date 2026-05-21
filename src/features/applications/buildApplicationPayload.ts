import type { JobType } from '@/features/jobs'
import type { ApplicationFormValues, ApplicationPayload } from './types'

export function buildApplicationPayload(
    job: Pick<JobType, 'id' | 'title'>,
    values: ApplicationFormValues,
    resumeFile?: File | null,
): ApplicationPayload {
    const file = resumeFile ?? values.resume

    if (!file) {
        throw new Error('Resume file is required')
    }

    return {
        jobId: job.id,
        jobTitle: job.title,
        applicant: {
            fullName: values.fullName.trim(),
            email: values.email.trim(),
            phone: values.phone.trim(),
            linkedInUrl: values.linkedInUrl.trim() || undefined,
            coverLetter: values.coverLetter.trim() || undefined,
        },
        resume: {
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            file,
        },
        submittedAt: new Date().toISOString(),
    }
}
