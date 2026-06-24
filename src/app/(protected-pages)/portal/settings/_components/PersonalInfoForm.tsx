'use client'

import React, { useState, useEffect } from 'react'
import { Card, Button, Input, FormItem, Form, Alert } from '@/components/ui'
import Avatar from '@/components/ui/Avatar'
import Upload from '@/components/ui/Upload'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Spinner from '@/components/ui/Spinner'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    PiUserDuotone,
    PiCameraBold,
    PiCheckCircleDuotone,
} from 'react-icons/pi'
import ApiService from '@/services/ApiService'
import parseErrorMessage from '@/utils/parseErrorMessage'
import appConfig from '@/configs/app.config'

const validationSchema = z.object({
    fullName: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
})

type FormSchema = z.infer<typeof validationSchema>

interface PersonalInfoFormProps {
    initialData: {
        id: string
        fullName: string
        email: string
        avatar?: string | null
    }
    role: string
    onSuccess?: () => void
}

export default function PersonalInfoForm({
    initialData,
    role,
    onSuccess,
}: PersonalInfoFormProps) {
    const [avatarUrl, setAvatarUrl] = useState<string>('')
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
            fullName: '',
            email: '',
        },
        resolver: zodResolver(validationSchema),
    })

    // Reset default values when initial data loads
    useEffect(() => {
        if (initialData) {
            reset({
                fullName: initialData.fullName || '',
                email: initialData.email || '',
            })
            setAvatarUrl(initialData.avatar || '')
        }
    }, [initialData, reset])

    // Handle avatar file selection and upload
    const handleAvatarUpload = async (files: File[]) => {
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
            if (avatarUrl) {
                formData.append('oldFilePath', avatarUrl)
            }
            formData.append('dir', 'profiles')
            formData.append('file', file)

            const useReplace = Boolean(avatarUrl)
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
                setAvatarUrl(response.data.url)
                toast.push(
                    <Notification title="Image Uploaded!" type="success">
                        Avatar uploaded successfully. Don't forget to save
                        changes!
                    </Notification>,
                )
            }
        } catch (err: any) {
            setMessage(
                parseErrorMessage(err) || 'Failed to upload avatar image.',
            )
        } finally {
            setUploading(false)
        }
    }

    const onSubmit = async (values: FormSchema) => {
        setSubmitting(true)
        setMessage('')

        const payload: any = {
            avatar: avatarUrl,
            name: values.fullName,
            // email: values.email,
        }

        try {
            await ApiService.triggerApiSync({
                url: '/profile/personal-info',
                method: 'put',
                data: payload,
            })

            toast.push(
                <Notification title="Profile updated!" type="success">
                    Your personal information has been saved.
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

    const displayAvatarSrc = avatarUrl
        ? avatarUrl.startsWith('http')
            ? avatarUrl
            : `${appConfig.serverBaseUrl}${avatarUrl}`
        : ''

    return (
        <Card className="border border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl overflow-hidden sm:p-6">
            <div className="flex flex-col gap-6">
                <div>
                    <h3 className="text-lg font-bold text-transparent selection:bg-indigo-500 selection:text-white">
                        Personal Information
                    </h3>
                    <p className="text-xs text-gray-900 dark:text-neutral-950 mt-1">
                        Update your account's primary profile photo, full name,
                        and email details.
                    </p>
                </div>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Avatar Upload Container */}
                        <div className="flex flex-col items-center gap-3 w-full md:w-auto">
                            <label className="text-sm font-semibold text-gray-700 dark:text-neutral-950">
                                Profile Picture
                            </label>

                            <Upload
                                showList={false}
                                onChange={handleAvatarUpload}
                                accept="image/*"
                                className={
                                    isUploading
                                        ? 'cursor-not-allowed'
                                        : 'cursor-pointer'
                                }
                                disabled={isUploading}
                            >
                                <div className="group relative w-32 h-32 rounded-full overflow-hidden border-2 border-indigo-100 hover:border-indigo-500 dark:border-gray-700 dark:hover:border-indigo-400 transition-all flex items-center justify-center bg-gray-50 dark:bg-gray-800 shadow-inner">
                                    {displayAvatarSrc ? (
                                        <img
                                            src={displayAvatarSrc}
                                            alt="Avatar"
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                                        />
                                    ) : (
                                        <Avatar
                                            size={128}
                                            className="w-full h-full flex items-center justify-center text-gray-400 bg-transparent"
                                            icon={
                                                <PiUserDuotone className="text-5xl" />
                                            }
                                        />
                                    )}

                                    {/* Upload overlay */}
                                    <div
                                        className={`absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white gap-1 select-none transition-opacity duration-300 ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                    >
                                        {isUploading ? (
                                            <div className="flex flex-col items-center gap-1">
                                                <Spinner className="text-white text-xl" />
                                                <span className="text-[10px] font-medium uppercase tracking-wider">
                                                    Uploading...
                                                </span>
                                            </div>
                                        ) : (
                                            <>
                                                <PiCameraBold className="text-2xl" />
                                                <span className="text-[10px] font-medium uppercase tracking-wider">
                                                    Change
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Upload>

                            <p className="text-[10px] text-gray-400 text-center max-w-[150px]">
                                Allowed formats: JPG, PNG. Max file size: 5MB.
                            </p>
                        </div>

                        {/* Text Fields Form */}
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

                            {/* Full Name */}
                            <FormItem
                                label="Full Name"
                                invalid={Boolean(errors.fullName)}
                                errorMessage={errors.fullName?.message}
                            >
                                <Controller
                                    name="fullName"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter your full name"
                                            autoComplete="name"
                                            className="h-10 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 focus:bg-white focus:border-indigo-500 rounded-lg text-sm"
                                        />
                                    )}
                                />
                            </FormItem>

                            {/* Email */}
                            <FormItem
                                label="Email Address"
                                invalid={Boolean(errors.email)}
                                errorMessage={errors.email?.message}
                            >
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter your email address"
                                            autoComplete="email"
                                            disabled
                                            className="h-10 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 focus:bg-white focus:border-indigo-500 rounded-lg text-sm"
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
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        </Card>
    )
}
