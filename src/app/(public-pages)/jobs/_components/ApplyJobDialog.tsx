'use client'

import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Upload from '@/components/ui/Upload'
import { Form, FormItem, Notification, toast } from '@/components/ui'
import type { JobType } from '@/features/jobs'
import type { ApplicationFormValues } from '@/features/applications'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import { apiApplyJob } from '@/services/ApplicationService'

interface Props {
    job: JobType | null
    isOpen: boolean
    onClose: () => void
}

const MAX_RESUME_SIZE = 5 * 1024 * 1024
const ACCEPTED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const validationSchema = z.object({
    fullName: z.string().trim().min(1, { message: 'Full name is required' }),
    email: z.email({ message: 'Please enter a valid email' }),
    phone: z.string().trim().min(1, { message: 'Phone number is required' }),
    coverLetter: z.string().max(2000, {
        message: 'Cover letter must be 2000 characters or fewer',
    }).optional().or(z.literal('')),
    linkedInUrl: z.string().url({ message: 'Please enter a valid LinkedIn URL' }).optional().or(z.literal('')),
    resume: z
        .custom<File>((value): value is File => value instanceof File, {
            message: 'Resume is required',
        })
        .refine((file) => file.size <= MAX_RESUME_SIZE, {
            message: 'Resume must be 5 MB or smaller',
        }),
})

export default function ApplyJobDialog({ job, isOpen, onClose }: Props) {
    const [submitting, setSubmitting] = useState(false)
    const { session } = useCurrentSession()

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<ApplicationFormValues>({
        resolver: zodResolver(validationSchema) as any,
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            coverLetter: '',
            linkedInUrl: '',
            resume: null,
        },
    })

    useEffect(() => {
        if (isOpen && session?.user) {
            if (session.user.name) {
                setValue('fullName', session.user.name)
            }
            if (session.user.email) {
                setValue('email', session.user.email)
            }
        }
    }, [session, setValue, isOpen])

    const closeDialog = () => {
        reset()
        onClose()
    }

    const onSubmit = async (values: ApplicationFormValues) => {
        if (!job) return

        setSubmitting(true)
        try {
            const formData = new FormData()
            formData.append('jobId', job.id)
            formData.append('fullName', values.fullName.trim())
            formData.append('email', values.email.trim())
            formData.append('phone', values.phone.trim())
            if (values.coverLetter) {
                formData.append('coverLetter', values.coverLetter.trim())
            }
            if (values.linkedInUrl) {
                formData.append('linkedInUrl', values.linkedInUrl.trim())
            }
            if (values.resume) {
                formData.append('file', values.resume)
            }

            await apiApplyJob(formData)

            toast.push(
                <Notification title="Application Submitted" type="success">
                    Your application for {job.title} has been submitted successfully!
                </Notification>,
            )
            closeDialog()
        } catch (error: any) {
            console.error('Failed to submit application:', error)
            const errorMsg = error?.response?.data?.message || 'Failed to submit application. Please try again.'
            toast.push(
                <Notification title="Submission failed" type="danger">
                    {errorMsg}
                </Notification>,
            )
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={closeDialog}
            width={720}
            contentClassName="!p-0 !overflow-hidden sm:!max-h-[85vh]"
        >
            {/* Pinned Premium Header */}
            <div className="px-6 pt-6 pb-4 md:px-8 md:pt-8 md:pb-5 border-b border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950 flex-shrink-0">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary dark:text-primary-mild">
                        Apply now
                    </p>
                    <h2 className="text-xl md:text-2xl font-extrabold text-gray-950 dark:text-white leading-tight">
                        {job?.title ?? 'Select a job first'}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Fill out your information and upload your resume to apply for this job listing.
                    </p>
                </div>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 md:px-8 md:py-6 space-y-5 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                <Form onSubmit={handleSubmit(onSubmit)} id="apply-job-form" className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                        <FormItem
                            label="Full name"
                            invalid={Boolean(errors.fullName)}
                            errorMessage={errors.fullName?.message}
                        >
                            <Controller
                                name="fullName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Your full name"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="Email"
                            invalid={Boolean(errors.email)}
                            errorMessage={errors.email?.message}
                        >
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="email"
                                        placeholder="you@example.com"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <FormItem
                            label="Phone"
                            invalid={Boolean(errors.phone)}
                            errorMessage={errors.phone?.message}
                        >
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="tel"
                                        placeholder="+1 555 123 4567"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="LinkedIn URL"
                            invalid={Boolean(errors.linkedInUrl)}
                            errorMessage={errors.linkedInUrl?.message}
                        >
                            <Controller
                                name="linkedInUrl"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="url"
                                        placeholder="https://linkedin.com/in/your-name"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    <FormItem
                        label="Cover letter"
                        invalid={Boolean(errors.coverLetter)}
                        errorMessage={errors.coverLetter?.message}
                    >
                        <Controller
                            name="coverLetter"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    textArea
                                    rows={4}
                                    placeholder="Tell us why you're interested in this role"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Resume"
                        invalid={Boolean(errors.resume)}
                        errorMessage={errors.resume?.message as string | undefined}
                        extra="PDF, DOC, or DOCX up to 5 MB"
                    >
                        <Controller
                            name="resume"
                            control={control}
                            render={({ field }) => (
                                <Upload
                                    accept=".pdf,.doc,.docx"
                                    uploadLimit={1}
                                    fileList={field.value ? [field.value] : []}
                                    beforeUpload={(fileList) => {
                                        const file = fileList?.[0]
                                        if (!file) return 'Please choose a resume file'
                                        if (!ACCEPTED_TYPES.includes(file.type)) {
                                            return 'Resume must be a PDF, DOC, or DOCX file'
                                        }
                                        if (file.size > MAX_RESUME_SIZE) {
                                            return 'Resume must be 5 MB or smaller'
                                        }
                                        return true
                                    }}
                                    onChange={(files) => field.onChange(files[0] ?? null)}
                                    onFileRemove={() => field.onChange(null)}
                                    showList
                                >
                                    <div className="flex flex-col items-start gap-2 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-left dark:border-gray-800 dark:bg-gray-900 transition-all duration-300 hover:bg-gray-100/50 dark:hover:bg-gray-900/50 cursor-pointer">
                                        <span className="text-sm font-semibold text-gray-950 dark:text-white">
                                            Upload your resume
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            Tap to choose a file from your device.
                                        </span>
                                    </div>
                                </Upload>
                            )}
                        />
                    </FormItem>
                </Form>
            </div>

            {/* Pinned Sticky Footer */}
            <div className="px-6 py-4 md:px-8 md:py-5 border-t border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/30 flex justify-end gap-3 flex-shrink-0">
                <Button
                    type="button"
                    variant="plain"
                    className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800 font-bold transition-all duration-200 shadow-sm rounded-xl h-10 px-4 flex items-center justify-center"
                    onClick={closeDialog}
                >
                    Cancel
                </Button>
                <Button
                    variant="plain"
                    type="submit"
                    form="apply-job-form"
                    className="bg-gray-950 hover:bg-gray-900 text-white font-bold transition-all duration-200 hover:shadow-lg dark:bg-white dark:text-gray-950 dark:hover:bg-gray-50 rounded-xl border-0 h-10 px-5 flex items-center justify-center"
                >
                    Submit application
                </Button>
            </div>
        </Dialog>
    )
}
