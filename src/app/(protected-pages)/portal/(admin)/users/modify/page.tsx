'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, Button, Input, FormItem, Form, Alert } from '@/components/ui'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PiArrowLeftBold, PiBriefcaseDuotone } from 'react-icons/pi'
import Link from 'next/link'
import ApiService from '@/services/ApiService'
import parseErrorMessage from '@/utils/parseErrorMessage'
import { RECRUITER } from '@/constants/roles.constant'
import Loading from '@/components/shared/Loading'

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
            { message: 'Please enter a valid URL (e.g. company.com)' },
        ),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    location: z.string().min(1, { message: 'Please enter company location' }),
})

function ModifyRecruiterFormContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    const isEditMode = Boolean(id)

    const [isLoadingData, setLoadingData] = useState<boolean>(isEditMode)
    const [isSubmitting, setSubmitting] = useState<boolean>(false)
    const [message, setMessage] = useState('')

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<RecruiterFormSchema>({
        defaultValues: {
            name: '',
            website: '',
            email: '',
            location: '',
        },
        resolver: zodResolver(validationSchema),
    })

    // Fetch existing user data if in edit mode
    useEffect(() => {
        if (id) {
            const loadUser = async () => {
                setLoadingData(true)
                try {
                    const response = await ApiService.triggerApiSync<any>({
                        url: `/users/${id}`,
                        method: 'get',
                    })
                    if (response.success && response.data) {
                        const user = response.data
                        const profile = user.recruiterProfile || {}
                        reset({
                            name:
                                user.name ||
                                profile.companyName ||
                                profile.name ||
                                '',
                            website: profile.website || '',
                            email: user.email || '',
                            location: profile.location || '',
                        })
                    }
                } catch (err: any) {
                    setMessage(parseErrorMessage(err))
                } finally {
                    setLoadingData(false)
                }
            }
            loadUser()
        }
    }, [id, reset])

    const onSubmit = async (values: RecruiterFormSchema) => {
        setSubmitting(true)
        setMessage('')

        // Normalize website prefix for consistency
        const normalizedWebsite =
            values.website.startsWith('http://') ||
            values.website.startsWith('https://')
                ? values.website
                : `https://${values.website}`

        const payload = {
            name: values.name,
            email: values.email,
            website: normalizedWebsite,
            location: values.location,
            role: RECRUITER,
            password: '123456789',
        }

        try {
            if (isEditMode) {
                await ApiService.triggerApiSync({
                    url: `/users/${id}`,
                    method: 'patch',
                    data: payload,
                })
                toast.push(
                    <Notification title="Account updated!" type="success">
                        Recruiter account updated successfully!
                    </Notification>,
                )
            } else {
                await ApiService.triggerApiSync({
                    url: '/users/create',
                    method: 'post',
                    data: payload,
                })
                toast.push(
                    <Notification title="Account created!" type="success">
                        Recruiter account created successfully!
                    </Notification>,
                )
            }
            router.push('/portal/users')
        } catch (error: any) {
            setMessage(parseErrorMessage(error))
        } finally {
            setSubmitting(false)
        }
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
                        {isEditMode
                            ? 'Edit Recruiter Account'
                            : 'Create Recruiter Account'}
                    </h1>
                    <p className="text-xs text-gray-400">
                        {isEditMode
                            ? 'Update this recruiter profile and company identity details'
                            : 'Create a premium recruiter profile and company identity on HireHub.'}
                    </p>
                </div>
            </div>

            {/* Form card container */}
            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm mt-2">
                <Loading loading={isLoadingData} type="cover">
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-4">
                            {message && (
                                <Alert
                                    type="danger"
                                    showIcon
                                    closable
                                    onClose={() => setMessage('')}
                                >
                                    {message}
                                </Alert>
                            )}
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
                                    <Button
                                        type="button"
                                        variant="plain"
                                        size="sm"
                                    >
                                        Cancel
                                    </Button>
                                </Link>
                                <Button
                                    variant="solid"
                                    type="submit"
                                    size="sm"
                                    loading={isSubmitting}
                                >
                                    {isSubmitting
                                        ? isEditMode
                                            ? 'Saving...'
                                            : 'Creating...'
                                        : isEditMode
                                          ? 'Save Changes'
                                          : 'Create Recruiter'}
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Loading>
            </Card>
        </div>
    )
}

export default function ModifyRecruiterPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            }
        >
            <ModifyRecruiterFormContent />
        </Suspense>
    )
}
