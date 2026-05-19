'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Button, Input, FormItem, Form } from '@/components/ui'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PiArrowLeftBold, PiBriefcaseDuotone } from 'react-icons/pi'
import Link from 'next/link'

type RecruiterFormSchema = {
    name: string
    website: string
    email: string
    location: string
}

const validationSchema = z.object({
    name: z.string().min(1, { message: 'Please enter company name' }),
    website: z
        .string()
        .min(1, { message: 'Please enter website URL' })
        .refine(
            (val) => {
                try {
                    const withProto =
                        val.startsWith('http://') || val.startsWith('https://')
                            ? val
                            : `https://${val}`
                    new URL(withProto)
                    return true
                } catch {
                    return false
                }
            },
            { message: 'Please enter a valid URL (e.g. company.com)' }
        ),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    location: z.string().min(1, { message: 'Please enter company location' }),
})

export default function CreateRecruiterPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<RecruiterFormSchema>({
        defaultValues: {
            name: '',
            website: '',
            email: '',
            location: '',
        },
        resolver: zodResolver(validationSchema),
    })

    const onSubmit = async (values: RecruiterFormSchema) => {
        setIsSubmitting(true)

        // Normalize website prefix for consistency
        const normalizedWebsite =
            values.website.startsWith('http://') || values.website.startsWith('https://')
                ? values.website
                : `https://${values.website}`

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)

            // Show success toast
            toast.push(
                <Notification title="Success" type="success">
                    Recruiter profile for {values.name} was successfully created!
                </Notification>,
                {
                    placement: 'top-center',
                }
            )

            // Redirect back to user management list page
            router.push('/portal/users')
        }, 1200)
    }

    return (
        <div className="flex flex-col gap-6 p-4 max-w-3xl mx-auto">
            {/* Back button and page header */}
            <div className="flex items-center gap-3">
                <Link href="/portal/users">
                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <PiArrowLeftBold className="text-xl" />
                    </button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold heading-text flex items-center gap-2">
                        <PiBriefcaseDuotone className="text-indigo-600 dark:text-indigo-400" />
                        Create Recruiter Account
                    </h1>
                    <p className="text-xs text-gray-400">
                        Create a premium recruiter profile and company identity on HireHub.
                    </p>
                </div>
            </div>

            {/* Form card container */}
            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm mt-2">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-4">
                        {/* Company Name */}
                        <FormItem
                            label="Company Name"
                            invalid={Boolean(errors.name)}
                            errorMessage={errors.name?.message}
                        >
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Enter company name (e.g. Google)"
                                        autoComplete="off"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Website */}
                        <FormItem
                            label="Company Website"
                            invalid={Boolean(errors.website)}
                            errorMessage={errors.website?.message}
                        >
                            <Controller
                                name="website"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Enter website (e.g. google.com)"
                                        autoComplete="off"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Contact Email */}
                        <FormItem
                            label="Contact Email"
                            invalid={Boolean(errors.email)}
                            errorMessage={errors.email?.message}
                        >
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="email"
                                        placeholder="Enter recruiter contact email"
                                        autoComplete="off"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Location */}
                        <FormItem
                            label="Location"
                            invalid={Boolean(errors.location)}
                            errorMessage={errors.location?.message}
                        >
                            <Controller
                                name="location"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        placeholder="Enter corporate office location (e.g. San Francisco, CA)"
                                        autoComplete="off"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Action buttons */}
                        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <Link href="/portal/users">
                                <Button type="button" variant="plain" size="sm">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                variant="solid"
                                type="submit"
                                size="sm"
                                loading={isSubmitting}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Recruiter'}
                            </Button>
                        </div>
                    </div>
                </Form>
            </Card>
        </div>
    )
}
