'use client'

import React, { useState } from 'react'
import { Card, Button, Input, FormItem, Form, Alert } from '@/components/ui'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PiCheckCircleDuotone, PiShieldCheckDuotone } from 'react-icons/pi'
import ApiService from '@/services/ApiService'
import parseErrorMessage from '@/utils/parseErrorMessage'

const validationSchema = z
    .object({
        oldPassword: z
            .string()
            .min(1, { message: 'Current password is required' }),
        newPassword: z.string().min(8, {
            message: 'New password must be at least 8 characters long',
        }),
        confirmPassword: z
            .string()
            .min(1, { message: 'Please confirm your new password' }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "New passwords don't match",
        path: ['confirmPassword'],
    })

type FormSchema = z.infer<typeof validationSchema>

export default function ChangePasswordForm() {
    const [isSubmitting, setSubmitting] = useState<boolean>(false)
    const [message, setMessage] = useState('')

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<FormSchema>({
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        resolver: zodResolver(validationSchema),
    })

    const onSubmit = async (values: FormSchema) => {
        setSubmitting(true)
        setMessage('')

        try {
            await ApiService.triggerApiSync({
                url: '/profile/security',
                method: 'put',
                data: {
                    oldPassword: values.oldPassword,
                    newPassword: values.newPassword,
                    confirmPassword: values.confirmPassword,
                },
            })

            toast.push(
                <Notification title="Password Changed!" type="success">
                    Your password has been changed successfully.
                </Notification>,
            )
            reset()
        } catch (error: any) {
            setMessage(
                parseErrorMessage(error) ||
                    'Failed to change password. Please check your credentials.',
            )
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Card className="border border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl sm:p-6">
            <div className="flex flex-col gap-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <PiShieldCheckDuotone className="text-emerald-500" />
                        Account Security
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                        Change your account password to maintain secure access
                        parameters.
                    </p>
                </div>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {message && (
                            <Alert
                                type="danger"
                                showIcon
                                closable
                                className="col-span-full"
                                onClose={() => setMessage('')}
                            >
                                {message}
                            </Alert>
                        )}

                        {/* Current Password */}
                        <FormItem
                            label="Current Password"
                            invalid={Boolean(errors.oldPassword)}
                            errorMessage={errors.oldPassword?.message}
                        >
                            <Controller
                                name="oldPassword"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="password"
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        className="h-10 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:bg-white"
                                    />
                                )}
                            />
                        </FormItem>

                        {/* New Password */}
                        <FormItem
                            label="New Password"
                            invalid={Boolean(errors.newPassword)}
                            errorMessage={errors.newPassword?.message}
                        >
                            <Controller
                                name="newPassword"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="password"
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        className="h-10 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:bg-white"
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Confirm Password */}
                        <FormItem
                            label="Confirm New Password"
                            invalid={Boolean(errors.confirmPassword)}
                            errorMessage={errors.confirmPassword?.message}
                        >
                            <Controller
                                name="confirmPassword"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="password"
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        className="h-10 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:bg-white"
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
                                Update Password
                            </Button>
                        </div>
                    </div>
                </Form>
            </div>
        </Card>
    )
}
