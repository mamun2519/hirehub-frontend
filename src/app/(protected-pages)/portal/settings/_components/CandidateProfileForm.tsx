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
} from '@/components/ui'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    PiCheckCircleDuotone,
    PiPlusBold,
    PiBriefcaseDuotone,
    PiGraduationCapDuotone,
    PiCodeBold,
    PiLinkBold,
    PiXBold,
} from 'react-icons/pi'
import ApiService from '@/services/ApiService'
import parseErrorMessage from '@/utils/parseErrorMessage'

const validationSchema = z.object({
    phoneNumber: z
        .string()
        .min(5, { message: 'Please enter a valid contact phone number' }),
    education: z.string().min(2, { message: 'Education history is required' }),
    experience: z
        .string()
        .min(2, { message: 'Professional experience history is required' }),
    resume: z.string().min(5, {
        message: 'Please include your resume details, highlights, or links',
    }),
    githubLink: z
        .string()
        .url({ message: 'Please enter a valid GitHub profile URL' })
        .optional()
        .nullable()
        .or(z.literal('')),
    linkedInLink: z
        .string()
        .url({ message: 'Please enter a valid LinkedIn profile URL' })
        .optional()
        .nullable()
        .or(z.literal('')),
})

type FormSchema = z.infer<typeof validationSchema>

interface CandidateProfileFormProps {
    initialData: {
        id: string
        phoneNumber: string
        education: string
        experience: string
        resume: string
        skills: string[]
        githubLink?: string | null
        linkedInLink?: string | null
    }
    onSuccess?: () => void
}

export default function CandidateProfileForm({
    initialData,
    onSuccess,
}: CandidateProfileFormProps) {
    const [skills, setSkills] = useState<string[]>([])
    const [skillInput, setSkillInput] = useState('')
    const [isSubmitting, setSubmitting] = useState<boolean>(false)
    const [message, setMessage] = useState('')

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<FormSchema>({
        defaultValues: {
            phoneNumber: '',
            education: '',
            experience: '',
            resume: '',
            githubLink: '',
            linkedInLink: '',
        },
        resolver: zodResolver(validationSchema),
    })

    // Reset default values when initial data loads
    useEffect(() => {
        if (initialData) {
            reset({
                phoneNumber: initialData.phoneNumber || '',
                education: initialData.education || '',
                experience: initialData.experience || '',
                resume: initialData.resume || '',
                githubLink: initialData.githubLink || '',
                linkedInLink: initialData.linkedInLink || '',
            })
            setSkills(initialData.skills || [])
        }
    }, [initialData, reset])

    // Skills dynamic operations
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

    const onSubmit = async (values: FormSchema) => {
        setSubmitting(true)
        setMessage('')

        // Build clean payload with non-empty URL social values or nulls
        const payload = {
            phoneNumber: values.phoneNumber,
            education: values.education,
            experience: values.experience,
            resume: values.resume,
            skills: skills,
            githubLink: values.githubLink || null,
            linkedInLink: values.linkedInLink || null,
        }

        try {
            await ApiService.triggerApiSync({
                url: '/profile/candidate',
                method: 'put',
                data: payload,
            })

            toast.push(
                <Notification title="Profile updated!" type="success">
                    Your professional candidate profile has been saved.
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

    return (
        <Card className="border border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl sm:p-6">
            <div className="flex flex-col gap-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        Professional Profile
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                        Configure your candidate identity, education history,
                        skills, experience, and contact detail parameters.
                    </p>
                </div>

                <Form onSubmit={handleSubmit(onSubmit)}>
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

                        {/* Top identity metadata rows */}
                        <div className="grid grid-cols-1 gap-4">
                            <FormItem
                                label="Contact Phone"
                                invalid={Boolean(errors.phoneNumber)}
                                errorMessage={errors.phoneNumber?.message}
                            >
                                <Controller
                                    name="phoneNumber"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="+1 (555) 019-2834"
                                            autoComplete="tel"
                                            className="h-10 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:bg-white"
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>

                        {/* Skill tagging array */}
                        <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-4 bg-gray-50/20 dark:bg-gray-900/20">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                                <PiCodeBold className="text-indigo-500" />
                                Professional Skills & Expertise
                            </h4>

                            {/* Tag displays */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {skills.length === 0 ? (
                                    <span className="text-xs text-gray-400 italic">
                                        No skills listed yet. Add skills below!
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

                            {/* Tag Input */}
                            <div className="flex gap-2 items-center">
                                <Input
                                    value={skillInput}
                                    onChange={(e) =>
                                        setSkillInput(e.target.value)
                                    }
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

                        {/* Education history */}
                        <FormItem
                            label="Education Background"
                            invalid={Boolean(errors.education)}
                            errorMessage={errors.education?.message}
                        >
                            <Controller
                                name="education"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        placeholder="B.Sc. in Computer Science - Stanford University (2018 - 2022)"
                                        rows={3}
                                        className="w-full p-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 focus:bg-white focus:border-indigo-500 rounded-lg text-sm outline-none transition-colors dark:text-gray-200"
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Experience history */}
                        <FormItem
                            label="Professional Experience"
                            invalid={Boolean(errors.experience)}
                            errorMessage={errors.experience?.message}
                        >
                            <Controller
                                name="experience"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        placeholder="Software Engineer - Stripe (2022 - Present)&#10;Full Stack Developer Intern - Vercel (2021)"
                                        rows={3}
                                        className="w-full p-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 focus:bg-white focus:border-indigo-500 rounded-lg text-sm outline-none transition-colors dark:text-gray-200"
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Resume detail parameters */}
                        <FormItem
                            label="Resume Overview & Profile summary"
                            invalid={Boolean(errors.resume)}
                            errorMessage={errors.resume?.message}
                        >
                            <Controller
                                name="resume"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        placeholder="Provide your resume text details, outline highlights, achievements, or paste your public resume hosting URLs..."
                                        rows={4}
                                        className="w-full p-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 focus:bg-white focus:border-indigo-500 rounded-lg text-sm outline-none transition-colors dark:text-gray-200"
                                    />
                                )}
                            />
                        </FormItem>

                        {/* Social profiles group */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormItem
                                label="GitHub Profile link"
                                invalid={Boolean(errors.githubLink)}
                                errorMessage={errors.githubLink?.message}
                            >
                                <Controller
                                    name="githubLink"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            value={field.value || ''}
                                            placeholder="https://github.com/username"
                                            className="h-10 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:bg-white"
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="LinkedIn Profile link"
                                invalid={Boolean(errors.linkedInLink)}
                                errorMessage={errors.linkedInLink?.message}
                            >
                                <Controller
                                    name="linkedInLink"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            value={field.value || ''}
                                            placeholder="https://linkedin.com/in/username"
                                            className="h-10 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:bg-white"
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-center sm:justify-end mt-2 col-span-full">
                            <Button
                                type="submit"
                                variant="solid"
                                loading={isSubmitting}
                                className="bg-primary text-white rounded-lg px-6 py-2 flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow transition-all w-full sm:w-auto"
                            >
                                <PiCheckCircleDuotone className="text-lg" />
                                Save Candidate Profile
                            </Button>
                        </div>
                    </div>
                </Form>
            </div>
        </Card>
    )
}
