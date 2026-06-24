'use client'

import React, { useState, useEffect } from 'react'
import {
    Card,
    Button,
    Input,
    FormItem,
    Form,
    Alert,
    Tag,
    Select,
    DatePicker,
} from '@/components/ui'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    PiCheckCircleDuotone,
    PiPlusBold,
    PiCodeBold,
    PiXBold,
    PiArrowLeftBold,
} from 'react-icons/pi'
import Link from 'next/link'

const validationSchema = z.object({
    title: z.string().min(2, { message: 'Job title must be at least 2 characters' }),
    description: z.string().min(10, { message: 'Job description must be at least 10 characters' }),
    salaryRange: z.string().min(1, { message: 'Salary range is required' }),
    location: z.string().min(1, { message: 'Job location is required' }),
    employmentType: z.string().min(1, { message: 'Employment type is required' }),
    experienceLevel: z.string().min(1, { message: 'Experience level is required' }),
    remoteInfo: z.string().min(1, { message: 'Remote setting is required' }),
    vacancyCount: z.coerce.number().int({ message: 'Vacancy count must be an integer' }),
    applicationDeadline: z
        .any()
        .refine(
            (val) => val instanceof Date && !isNaN(val.getTime()),
            { message: 'Please select a valid deadline date' },
        ),
})

type FormSchema = z.infer<typeof validationSchema>

const employmentTypeOptions = [
    { label: 'Full-time', value: 'Full-time' },
    { label: 'Part-time', value: 'Part-time' },
    { label: 'Contract', value: 'Contract' },
    { label: 'Internship', value: 'Internship' },
    { label: 'Temporary', value: 'Temporary' },
]

const experienceLevelOptions = [
    { label: 'Entry Level', value: 'Entry Level' },
    { label: 'Mid Level', value: 'Mid Level' },
    { label: 'Senior', value: 'Senior' },
    { label: 'Lead / Executive', value: 'Lead / Executive' },
]

const remoteInfoOptions = [
    { label: 'Remote', value: 'Remote' },
    { label: 'Hybrid', value: 'Hybrid' },
    { label: 'On-site', value: 'On-site' },
]

interface JobFormProps {
    initialData?: {
        title: string
        description: string
        salaryRange: string
        location: string
        employmentType: string
        experienceLevel: string
        remoteInfo: string
        vacancyCount: number
        applicationDeadline: string | Date
        requiredSkills: string[]
    }
    onSubmit: (values: any) => Promise<void>
    isSubmitting: boolean
    errorMessage?: string
    submitButtonText?: string
}

export default function JobForm({
    initialData,
    onSubmit: onFormSubmit,
    isSubmitting,
    errorMessage: externalErrorMessage,
    submitButtonText = 'Submit Post',
}: JobFormProps) {
    const [skills, setSkills] = useState<string[]>([])
    const [skillInput, setSkillInput] = useState('')
    const [message, setMessage] = useState('')

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<FormSchema>({
        defaultValues: {
            title: '',
            description: '',
            salaryRange: '',
            location: '',
            employmentType: '',
            experienceLevel: '',
            remoteInfo: '',
            vacancyCount: 1,
            applicationDeadline: new Date(),
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(validationSchema) as any,
    })

    // Reset default values when initial data loads
    useEffect(() => {
        if (initialData) {
            reset({
                title: initialData.title || '',
                description: initialData.description || '',
                salaryRange: initialData.salaryRange || '',
                location: initialData.location || '',
                employmentType: initialData.employmentType || '',
                experienceLevel: initialData.experienceLevel || '',
                remoteInfo: initialData.remoteInfo || '',
                vacancyCount: initialData.vacancyCount || 1,
                applicationDeadline: initialData.applicationDeadline
                    ? new Date(initialData.applicationDeadline)
                    : new Date(),
            })
            setSkills(initialData.requiredSkills || [])
        }
    }, [initialData, reset])

    useEffect(() => {
        if (externalErrorMessage) {
            setMessage(externalErrorMessage)
        }
    }, [externalErrorMessage])

    // Skills operations
    const handleAddSkill = (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        const trimmed = skillInput.trim()
        if (trimmed && !skills.includes(trimmed)) {
            setSkills([...skills, trimmed])
            setSkillInput('')
        }
    }

    const handleRemoveSkill = (skillToRemove: string) => {
        setSkills(skills.filter((s) => s !== skillToRemove))
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            handleAddSkill()
        }
    }

    const handleActualSubmit = async (values: any) => {
        if (skills.length === 0) {
            setMessage('At least one required skill is recommended for candidates.')
            return
        }
        setMessage('')
        
        const payload = {
            ...values,
            requiredSkills: skills,
        }

        await onFormSubmit(payload)
    }

    return (
        <Card className="border border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl sm:p-6">
            <div className="flex flex-col gap-6">
                <Form onSubmit={handleSubmit(handleActualSubmit)}>
                    <div className="flex flex-col gap-5">
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

                        {/* Title & Vacancies */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <FormItem
                                    label="Job Title"
                                    invalid={Boolean(errors.title)}
                                    errorMessage={errors.title?.message}
                                >
                                    <Controller
                                        name="title"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="Senior React Developer"
                                                className="h-10 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:bg-white"
                                            />
                                        )}
                                    />
                                </FormItem>
                            </div>

                            <FormItem
                                label="Vacancies"
                                invalid={Boolean(errors.vacancyCount)}
                                errorMessage={errors.vacancyCount?.message}
                            >
                                <Controller
                                    name="vacancyCount"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="number"
                                            placeholder="1"
                                            className="h-10 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:bg-white"
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>

                        {/* Dropdowns */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormItem
                                label="Employment Type"
                                invalid={Boolean(errors.employmentType)}
                                errorMessage={errors.employmentType?.message}
                            >
                                <Controller
                                    name="employmentType"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            options={employmentTypeOptions}
                                            value={employmentTypeOptions.find(
                                                (opt) => opt.value === field.value
                                            )}
                                            onChange={(opt) => field.onChange(opt?.value || '')}
                                            placeholder="Select Type"
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="Experience Level"
                                invalid={Boolean(errors.experienceLevel)}
                                errorMessage={errors.experienceLevel?.message}
                            >
                                <Controller
                                    name="experienceLevel"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            options={experienceLevelOptions}
                                            value={experienceLevelOptions.find(
                                                (opt) => opt.value === field.value
                                            )}
                                            onChange={(opt) => field.onChange(opt?.value || '')}
                                            placeholder="Select Level"
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="Workplace Setting"
                                invalid={Boolean(errors.remoteInfo)}
                                errorMessage={errors.remoteInfo?.message}
                            >
                                <Controller
                                    name="remoteInfo"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            options={remoteInfoOptions}
                                            value={remoteInfoOptions.find(
                                                (opt) => opt.value === field.value
                                            )}
                                            onChange={(opt) => field.onChange(opt?.value || '')}
                                            placeholder="Select Workplace"
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>

                        {/* Location, Salary, Deadline */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                            {...field}
                                            placeholder="Austin, TX or Remote"
                                            className="h-10 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:bg-white"
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="Salary Range"
                                invalid={Boolean(errors.salaryRange)}
                                errorMessage={errors.salaryRange?.message}
                            >
                                <Controller
                                    name="salaryRange"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="$90,000 - $120,000"
                                            className="h-10 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:bg-white"
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="Application Deadline"
                                invalid={Boolean(errors.applicationDeadline)}
                                errorMessage={errors.applicationDeadline?.message as string | undefined}
                            >
                                <Controller
                                    name="applicationDeadline"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            value={field.value}
                                            onChange={(date) => field.onChange(date)}
                                            placeholder="Select Deadline"
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>

                        {/* Skills tag picker */}
                        <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-4 bg-gray-50/20 dark:bg-gray-900/20">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                                <PiCodeBold className="text-indigo-500" />
                                Required Skills & Technologies
                            </h4>

                            <div className="flex flex-wrap gap-2 mb-3">
                                {skills.length === 0 ? (
                                    <span className="text-xs text-gray-400 italic">
                                        No skills added yet. Add critical skills below!
                                    </span>
                                ) : (
                                    skills.map((skill) => (
                                        <Tag
                                            key={skill}
                                            className="bg-indigo-50 border-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-900/50 dark:text-indigo-400 font-semibold px-2.5 py-1 text-xs rounded-full flex items-center gap-1"
                                            suffix={
                                                <span
                                                    className="cursor-pointer hover:text-indigo-900 dark:hover:text-indigo-200 transition-colors ml-1 p-0.5 rounded-full hover:bg-indigo-200/50 dark:hover:bg-indigo-900/50 flex items-center justify-center"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleRemoveSkill(skill)
                                                    }}
                                                >
                                                    <PiXBold className="text-[10px]" />
                                                </span>
                                            }
                                        >
                                            {skill}
                                        </Tag>
                                    ))
                                )}
                            </div>

                            <div className="flex gap-2 items-center">
                                <Input
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type a skill (e.g. React) and press Enter or Comma"
                                    className="h-10 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg text-xs flex-1 focus:bg-white"
                                    autoComplete="off"
                                />
                                <Button
                                    type="button"
                                    onClick={handleAddSkill}
                                    className="h-10 px-4 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <PiPlusBold />
                                </Button>
                            </div>
                        </div>

                        {/* Description */}
                        <FormItem
                            label="Job Description"
                            invalid={Boolean(errors.description)}
                            errorMessage={errors.description?.message}
                        >
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        placeholder="Outline key responsibilities, requirements, benefits, and company values..."
                                        rows={8}
                                        className="w-full p-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 focus:bg-white focus:border-indigo-500 rounded-lg text-sm outline-none transition-colors dark:text-gray-200"
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
                            <Link href="/portal/jobs" className="w-full sm:w-auto">
                                <Button
                                    type="button"
                                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-sm"
                                >
                                    <PiArrowLeftBold />
                                    Back to Manage
                                </Button>
                            </Link>

                            <Button
                                type="submit"
                                variant="solid"
                                loading={isSubmitting}
                                className="bg-primary text-white rounded-lg px-6 py-2 flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow transition-all w-full sm:w-auto"
                            >
                                <PiCheckCircleDuotone className="text-lg" />
                                {submitButtonText}
                            </Button>
                        </div>
                    </div>
                </Form>
            </div>
        </Card>
    )
}
