'use client'

import React, { useState, useEffect } from 'react'
import { Card, Button, Input, FormItem, Form, Alert } from '@/components/ui'
import Upload from '@/components/ui/Upload'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Spinner from '@/components/ui/Spinner'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    PiBuildingsBold,
    PiImageSquareBold,
    PiCheckCircleDuotone,
    PiCameraBold,
} from 'react-icons/pi'
import ApiService from '@/services/ApiService'
import parseErrorMessage from '@/utils/parseErrorMessage'
import appConfig from '@/configs/app.config'

const validationSchema = z.object({
    companyName: z.string().min(1, { message: 'Company name is required' }),
    website: z
        .string()
        .url({ message: 'Please enter a valid company website URL' }),
    description: z.string().min(10, {
        message: 'Please enter a brief description (min 10 characters)',
    }),
    location: z.string().min(1, { message: 'Location is required' }),
})

type FormSchema = z.infer<typeof validationSchema>

interface RecruiterProfileFormProps {
    initialData: {
        id: string
        companyName: string
        website: string
        description: string
        location: string
        logo: string
    }
    onSuccess?: () => void
}

export default function RecruiterProfileForm({
    initialData,
    onSuccess,
}: RecruiterProfileFormProps) {
    const [logoUrl, setLogoUrl] = useState<string>('')
    const [isUploading, setUploading] = useState<boolean>(false)
    const [isSubmitting, setSubmitting] = useState<boolean>(false)
    const [message, setMessage] = useState('')

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<FormSchema>({
        defaultValues: {
            companyName: '',
            website: '',
            description: '',
            location: '',
        },
        resolver: zodResolver(validationSchema),
    })

    // Reset default values when initial data loads
    useEffect(() => {
        if (initialData) {
            reset({
                companyName: initialData.companyName || '',
                website: initialData.website || '',
                description: initialData.description || '',
                location: initialData.location || '',
            })
            setLogoUrl(initialData.logo || '')
        }
    }, [initialData, reset])

    // Handle company logo file selection and upload
    const handleLogoUpload = async (files: File[]) => {
        if (files.length === 0) return

        const file = files[0]
        if (!file.type.startsWith('image/')) {
            toast.push(
                <Notification title="Invalid file type" type="danger">
                    Please select an image file.
                </Notification>,
            )
            return
        }

        setUploading(true)
        setMessage('')

        try {
            const formData = new FormData()
            if (logoUrl) {
                formData.append('oldFilePath', logoUrl)
            }
            formData.append('dir', 'company-logo')
            formData.append('file', file)

            const useReplace = Boolean(logoUrl)
            const response = await ApiService.triggerApiSync<{
                success: boolean
                data: { url: string }
            }>({
                url: useReplace ? '/file/replace' : '/file/upload',
                method: useReplace ? 'put' : 'post',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                data: formData as any,
            })

            if (response.success && response.data?.url) {
                setLogoUrl(response.data.url)
                toast.push(
                    <Notification title="Logo Uploaded!" type="success">
                        Company logo uploaded successfully. Don't forget to save
                        changes!
                    </Notification>,
                )
            }
        } catch (err: any) {
            setMessage(parseErrorMessage(err) || 'Failed to upload logo image.')
        } finally {
            setUploading(false)
        }
    }

    const onSubmit = async (values: FormSchema) => {
        if (!logoUrl) {
            setMessage('Company logo is required. Please upload a logo image.')
            return
        }

        setSubmitting(true)
        setMessage('')

        const payload = {
            ...values,
            logo: logoUrl,
        }

        try {
            await ApiService.triggerApiSync({
                url: '/profile/recruiter',
                method: 'put',
                data: payload,
            })

            toast.push(
                <Notification title="Company Details updated!" type="success">
                    Your company identity has been saved successfully.
                </Notification>,
            )

            if (onSuccess) {
                onSuccess()
            }
        } catch (error: any) {
            setMessage(parseErrorMessage(error))
        } finally {
            setSubmitting(false)
        }
    }

    const displayLogoSrc = logoUrl
        ? logoUrl.startsWith('http')
            ? logoUrl
            : `${appConfig.serverBaseUrl}${logoUrl}`
        : ''

    return (
        <Card className="border border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl sm:p-6">
            <div className="flex flex-col gap-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        Company Profile
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                        Configure recruiter identity details and establish your
                        company representation.
                    </p>
                </div>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Company Logo Upload */}
                        <div className="flex flex-col items-center gap-3 w-full md:w-auto">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Company Logo
                            </label>

                            <Upload
                                showList={false}
                                onChange={handleLogoUpload}
                                accept="image/*"
                                className="cursor-pointer"
                            >
                                <div className="group relative w-36 h-36 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden transition-all shadow-inner">
                                    {displayLogoSrc ? (
                                        <img
                                            src={displayLogoSrc}
                                            alt="Company Logo"
                                            className="w-full h-full object-contain p-2"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-4">
                                            <PiBuildingsBold className="text-4xl text-gray-300 mb-1" />
                                            <span className="text-[10px] text-center leading-tight">
                                                Drag logo here or click to
                                                browse
                                            </span>
                                        </div>
                                    )}

                                    {/* Upload overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 select-none">
                                        {isUploading ? (
                                            <Spinner className="text-white text-xl" />
                                        ) : (
                                            <>
                                                <PiCameraBold className="text-2xl" />
                                                <span className="text-[10px] font-medium uppercase tracking-wider">
                                                    Change Logo
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Upload>
                            <p className="text-[10px] text-gray-400 text-center max-w-[150px]">
                                Allowed formats: JPG, PNG, SVG. Max file size:
                                5MB.
                            </p>
                        </div>

                        {/* Company Details Form Fields */}
                        <div className="flex-1 flex flex-col gap-4 w-full">
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

                            {/* Row for Name and Website */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormItem
                                    label="Company Name"
                                    invalid={Boolean(errors.companyName)}
                                    errorMessage={errors.companyName?.message}
                                >
                                    <Controller
                                        name="companyName"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="Google, Inc."
                                                autoComplete="organization"
                                                className="h-10 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:bg-white"
                                            />
                                        )}
                                    />
                                </FormItem>

                                <FormItem
                                    label="Website URL"
                                    invalid={Boolean(errors.website)}
                                    errorMessage={errors.website?.message}
                                >
                                    <Controller
                                        name="website"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="https://company.com"
                                                autoComplete="url"
                                                className="h-10 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:bg-white"
                                            />
                                        )}
                                    />
                                </FormItem>
                            </div>

                            {/* Location */}
                            <FormItem
                                label="HQ Location"
                                invalid={Boolean(errors.location)}
                                errorMessage={errors.location?.message}
                            >
                                <Controller
                                    name="location"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Silicon Valley, CA"
                                            autoComplete="street-address"
                                            className="h-10 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:bg-white"
                                        />
                                    )}
                                />
                            </FormItem>

                            {/* Description */}
                            <FormItem
                                label="Company Description"
                                invalid={Boolean(errors.description)}
                                errorMessage={errors.description?.message}
                            >
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <textarea
                                            {...field}
                                            placeholder="Write a brief overview describing your company culture, products, or core values..."
                                            rows={4}
                                            className="w-full p-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 focus:bg-white focus:border-indigo-500 rounded-lg text-sm outline-none transition-colors dark:text-gray-200"
                                        />
                                    )}
                                />
                            </FormItem>

                            {/* Submit */}
                            <div className="flex justify-center sm:justify-end mt-2 col-span-full">
                                <Button
                                    type="submit"
                                    variant="solid"
                                    loading={isSubmitting}
                                    className="bg-primary text-white rounded-lg px-6 py-2 flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow transition-all w-full sm:w-auto"
                                >
                                    <PiCheckCircleDuotone className="text-lg" />
                                    Save Details
                                </Button>
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        </Card>
    )
}
