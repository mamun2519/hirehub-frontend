'use client'

import { useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import { Notification, Select, Spinner, toast } from '@/components/ui'
import {
    PiXBold,
    PiCheckCircleFill,
    PiClockCountdownDuotone,
    PiFilePdfDuotone,
    PiLinkedinLogoDuotone,
    PiEnvelopeDuotone,
    PiPhoneDuotone,
    PiUserDuotone,
    PiArrowSquareOutDuotone,
    PiCircleDashedDuotone,
    PiSealCheckDuotone,
    PiXCircleFill,
    PiChatsCircleDuotone,
} from 'react-icons/pi'
import type {
    ApplicationResponse,
    ApplicationStatus,
} from '@/features/applications'
import { apiUpdateApplicationStatus } from '@/services/ApplicationService'
import appConfig from '@/configs/app.config'
import dayjs from 'dayjs'

interface Props {
    application: ApplicationResponse | null
    isOpen: boolean
    isRecruiter?: boolean
    onClose: () => void
    onStatusUpdated: (id: string, status: string) => void
}

const STATUS_STEPS: {
    key: string
    label: string
    description: string
}[] = [
    {
        key: 'pending',
        label: 'Submitted',
        description: 'Application received & queued',
    },
    {
        key: 'under_review',
        label: 'Under Review',
        description: 'Recruiter is reviewing your profile',
    },
    {
        key: 'shortlisted',
        label: 'Shortlisted',
        description: 'You have been shortlisted',
    },
    {
        key: 'interview_scheduled',
        label: 'Interview',
        description: 'Interview has been scheduled',
    },
]

const FINAL_STATUSES = ['offered', 'rejected']

type StepState = 'done' | 'active' | 'upcoming'

function getStepState(stepKey: string, currentStatus: string): StepState {
    if (currentStatus === 'offered' || currentStatus === 'rejected') {
        const idx = STATUS_STEPS.findIndex((s) => s.key === stepKey)
        return idx < STATUS_STEPS.length ? 'done' : 'upcoming'
    }
    const currentIdx = STATUS_STEPS.findIndex((s) => s.key === currentStatus)
    const stepIdx = STATUS_STEPS.findIndex((s) => s.key === stepKey)
    if (stepIdx < currentIdx) return 'done'
    if (stepIdx === currentIdx) return 'active'
    return 'upcoming'
}

const STATUS_LABELS: Record<
    string,
    { label: string; color: string; bg: string; ring: string }
> = {
    pending: {
        label: 'Pending',
        color: 'text-amber-600',
        bg: 'bg-amber-50 dark:bg-amber-950/30',
        ring: 'ring-amber-300 dark:ring-amber-700',
    },
    under_review: {
        label: 'Under Review',
        color: 'text-blue-600',
        bg: 'bg-blue-50 dark:bg-blue-950/30',
        ring: 'ring-blue-300 dark:ring-blue-700',
    },
    shortlisted: {
        label: 'Shortlisted',
        color: 'text-violet-600',
        bg: 'bg-violet-50 dark:bg-violet-950/30',
        ring: 'ring-violet-300 dark:ring-violet-700',
    },
    interview_scheduled: {
        label: 'Interview Scheduled',
        color: 'text-indigo-600',
        bg: 'bg-indigo-50 dark:bg-indigo-950/30',
        ring: 'ring-indigo-300 dark:ring-indigo-700',
    },
    offered: {
        label: 'Offered 🎉',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
        ring: 'ring-emerald-300 dark:ring-emerald-700',
    },
    rejected: {
        label: 'Not Selected',
        color: 'text-rose-600',
        bg: 'bg-rose-50 dark:bg-rose-950/30',
        ring: 'ring-rose-300 dark:ring-rose-700',
    },
    accepted: {
        label: 'Accepted 🎉',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
        ring: 'ring-emerald-300 dark:ring-emerald-700',
    },
}

const ALL_STATUS_OPTIONS: { value: string; label: string }[] = [
    { value: 'pending', label: 'Pending' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'interview_scheduled', label: 'Interview Scheduled' },
    { value: 'offered', label: 'Offered' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
]

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function ApplicationStatusDialog({
    application,
    isOpen,
    isRecruiter = false,
    onClose,
    onStatusUpdated,
}: Props) {
    const [updatingStatus, setUpdatingStatus] = useState(false)
    const [pendingStatus, setPendingStatus] = useState<string>('')

    if (!application) return null

    const statusMeta = STATUS_LABELS[application.status] ?? {
        label: application.status,
        color: 'text-gray-600',
        bg: 'bg-gray-100',
        ring: 'ring-gray-300',
    }
    const isFinal = FINAL_STATUSES.includes(application.status)

    const resumeUrl = application.resume
        ? `${appConfig.serverBaseUrl}${application.resume.url}`
        : null

    const handleStatusUpdate = async () => {
        if (!pendingStatus || pendingStatus === application.status) return
        setUpdatingStatus(true)
        try {
            await apiUpdateApplicationStatus(application.id, pendingStatus)
            onStatusUpdated(application.id, pendingStatus)
            toast.push(
                <Notification title="Status Updated" type="success">
                    Application status changed to{' '}
                    <strong>
                        {STATUS_LABELS[pendingStatus]?.label ?? pendingStatus}
                    </strong>
                    .
                </Notification>,
            )
            setPendingStatus('')
        } catch {
            toast.push(
                <Notification title="Update Failed" type="danger">
                    Could not update the application status. Please try again.
                </Notification>,
            )
        } finally {
            setUpdatingStatus(false)
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={720}
            contentClassName="!p-0 !overflow-hidden"
        >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 md:px-8 border-b border-gray-100 dark:border-gray-800/80 flex-shrink-0 bg-gradient-to-r from-indigo-950/5 via-slate-950/5 to-indigo-950/5 dark:from-indigo-950/30 dark:via-gray-950/20 dark:to-indigo-950/30">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-500 dark:text-indigo-400">
                            Application Details
                        </p>
                        <h2 className="text-lg md:text-xl font-extrabold text-gray-950 dark:text-white leading-tight flex items-center gap-3">
                            <span>
                                {application.job?.title ?? 'Unknown Position'}
                            </span>

                            {/* Current status badge */}
                            <span
                                className={`flex-shrink-0 mt-1 px-3 py-1 rounded-full text-xs font-bold ring-1 ${statusMeta.bg} ${statusMeta.color} ${statusMeta.ring}`}
                            >
                                {statusMeta.label}
                            </span>
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            ID:&nbsp;
                            <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                                {application.applicationId}
                            </span>
                            &nbsp;·&nbsp;Applied{' '}
                            {dayjs(application.createdAt).format(
                                'MMM DD, YYYY',
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 md:px-8 md:py-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                {/* ── Progress Stepper ── */}
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                        Application Progress
                    </p>
                    {isFinal ? (
                        <div
                            className={`flex items-center gap-3 p-4 rounded-2xl ring-1 ${statusMeta.bg} ${statusMeta.ring}`}
                        >
                            {application.status === 'offered' ? (
                                <PiSealCheckDuotone
                                    className={`text-3xl flex-shrink-0 ${statusMeta.color}`}
                                />
                            ) : (
                                <PiXCircleFill
                                    className={`text-3xl flex-shrink-0 ${statusMeta.color}`}
                                />
                            )}
                            <div>
                                <p
                                    className={`text-sm font-bold ${statusMeta.color}`}
                                >
                                    {statusMeta.label}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {application.status === 'offered'
                                        ? 'Congratulations! You have received a job offer.'
                                        : 'The recruiter has reviewed your application and decided not to move forward at this time.'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start gap-0 overflow-x-auto pb-1">
                            {STATUS_STEPS.map((step, idx) => {
                                const state = getStepState(
                                    step.key,
                                    application.status,
                                )
                                return (
                                    <div
                                        key={step.key}
                                        className="flex items-start flex-1 min-w-0"
                                    >
                                        <div className="flex flex-col items-center gap-1.5 min-w-0 flex-1">
                                            {/* Circle + connector */}
                                            <div className="flex items-center w-full">
                                                {idx > 0 && (
                                                    <div
                                                        className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${
                                                            state === 'done' ||
                                                            state === 'active'
                                                                ? 'bg-indigo-500'
                                                                : 'bg-gray-200 dark:bg-gray-700'
                                                        }`}
                                                    />
                                                )}
                                                <div
                                                    className={`relative flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                                        state === 'done'
                                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900'
                                                            : state === 'active'
                                                              ? 'bg-indigo-100 dark:bg-indigo-950 ring-2 ring-indigo-500 text-indigo-600 dark:text-indigo-400'
                                                              : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                                                    }`}
                                                >
                                                    {state === 'done' ? (
                                                        <PiCheckCircleFill className="text-lg" />
                                                    ) : state === 'active' ? (
                                                        <PiClockCountdownDuotone className="text-base animate-pulse" />
                                                    ) : (
                                                        <PiCircleDashedDuotone className="text-base" />
                                                    )}
                                                    {state === 'active' && (
                                                        <span className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
                                                    )}
                                                </div>
                                                {idx <
                                                    STATUS_STEPS.length - 1 && (
                                                    <div
                                                        className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${
                                                            state === 'done'
                                                                ? 'bg-indigo-500'
                                                                : 'bg-gray-200 dark:bg-gray-700'
                                                        }`}
                                                    />
                                                )}
                                            </div>
                                            {/* Label below */}
                                            <p
                                                className={`text-center text-[10px] font-semibold px-0.5 leading-tight ${
                                                    state === 'active'
                                                        ? 'text-indigo-600 dark:text-indigo-400'
                                                        : state === 'done'
                                                          ? 'text-indigo-500'
                                                          : 'text-gray-400'
                                                }`}
                                            >
                                                {step.label}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* ── Job Details Summary ── */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                        { label: 'Location', value: application.job?.location },
                        {
                            label: 'Employment',
                            value: application.job?.employmentType,
                        },
                        {
                            label: 'Experience',
                            value: application.job?.experienceLevel,
                        },
                        {
                            label: 'Salary',
                            value: application.job?.salaryRange,
                        },
                        {
                            label: 'Workplace',
                            value: application.job?.remoteInfo,
                        },
                        {
                            label: 'Deadline',
                            value: dayjs(
                                application.job?.applicationDeadline,
                            ).format('MMM DD, YYYY'),
                        },
                    ].map(({ label, value }) => (
                        <div
                            key={label}
                            className="flex flex-col gap-0.5 bg-gray-50 dark:bg-gray-900/60 rounded-xl px-3 py-2.5 border border-gray-100 dark:border-gray-800"
                        >
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                {label}
                            </span>
                            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                                {value ?? '—'}
                            </span>
                        </div>
                    ))}
                </div>

                {/* ── Candidate Info ── */}
                <div className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-900/60 px-4 py-2.5 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                            Applicant
                        </p>
                    </div>
                    <div className="px-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center flex-shrink-0">
                                <PiUserDuotone className="text-indigo-600 text-base" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-semibold">
                                    Full Name
                                </p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                    {application.fullName}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center flex-shrink-0">
                                <PiEnvelopeDuotone className="text-blue-600 text-base" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-semibold">
                                    Email
                                </p>
                                <a
                                    href={`mailto:${application.email}`}
                                    className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline truncate block max-w-[180px]"
                                >
                                    {application.email}
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center flex-shrink-0">
                                <PiPhoneDuotone className="text-emerald-600 text-base" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-semibold">
                                    Phone
                                </p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {application.phone}
                                </p>
                            </div>
                        </div>
                        {application.linkedInUrl && (
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-950 flex items-center justify-center flex-shrink-0">
                                    <PiLinkedinLogoDuotone className="text-sky-600 text-base" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-semibold">
                                        LinkedIn
                                    </p>
                                    <a
                                        href={application.linkedInUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                                    >
                                        View Profile{' '}
                                        <PiArrowSquareOutDuotone className="text-xs" />
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Cover Letter ── */}
                {application.coverLetter && (
                    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="bg-gray-50 dark:bg-gray-900/60 px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                            <PiChatsCircleDuotone className="text-indigo-500 text-base" />
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                Cover Letter
                            </p>
                        </div>
                        <div className="px-4 py-4">
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-nowrap overflow-visible">
                                {application.coverLetter}
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Resume ── */}
                {application.resume && (
                    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="bg-gray-50 dark:bg-gray-900/60 px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                            <PiFilePdfDuotone className="text-rose-500 text-base" />
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                Resume
                            </p>
                        </div>
                        <div className="px-4 py-4">
                            <a
                                href={resumeUrl ?? '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 group rounded-xl border border-gray-100 dark:border-gray-800 hover:border-rose-200 dark:hover:border-rose-800 bg-gray-50 dark:bg-gray-900/40 hover:bg-rose-50/60 dark:hover:bg-rose-950/20 px-4 py-3 transition-all duration-200"
                            >
                                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                    <PiFilePdfDuotone className="text-rose-600 text-xl" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                        {application.resume.fileName}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {formatBytes(
                                            application.resume.fileSize,
                                        )}{' '}
                                        · {application.resume.mimeType}
                                    </p>
                                </div>
                                <PiArrowSquareOutDuotone className="text-gray-400 group-hover:text-rose-500 transition-colors text-lg flex-shrink-0" />
                            </a>
                        </div>
                    </div>
                )}

                {/* ── Recruiter Status Updater ── */}
                {isRecruiter && (
                    <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/60 overflow-hidden bg-indigo-50/50 dark:bg-indigo-950/20">
                        <div className="bg-indigo-100/60 dark:bg-indigo-950/40 px-4 py-2.5 border-b border-indigo-100 dark:border-indigo-900/60">
                            <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
                                Update Status
                            </p>
                        </div>
                        <div className="px-4 py-4">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                Change the application status to reflect where
                                this candidate is in your hiring process.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Select
                                    className="flex-1"
                                    options={ALL_STATUS_OPTIONS}
                                    value={
                                        ALL_STATUS_OPTIONS.find(
                                            (o) =>
                                                o.value ===
                                                (pendingStatus ||
                                                    application.status),
                                        ) ?? ALL_STATUS_OPTIONS[0]
                                    }
                                    onChange={(opt) =>
                                        setPendingStatus(
                                            (
                                                opt as (typeof ALL_STATUS_OPTIONS)[0]
                                            )?.value ?? '',
                                        )
                                    }
                                    isSearchable={false}
                                />
                                <Button
                                    variant="solid"
                                    loading={updatingStatus}
                                    disabled={
                                        !pendingStatus ||
                                        pendingStatus === application.status ||
                                        updatingStatus
                                    }
                                    onClick={handleStatusUpdate}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-5 py-2.5 border-0 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {updatingStatus ? (
                                        <span className="flex items-center gap-2">
                                            <Spinner size="sm" />
                                            Saving…
                                        </span>
                                    ) : (
                                        'Save Status'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 md:px-8 border-t border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/30 flex justify-end gap-3 flex-shrink-0">
                <Button
                    variant="plain"
                    onClick={onClose}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold rounded-xl h-10 px-5 transition-all shadow-sm flex items-center gap-2"
                >
                    <PiXBold className="text-sm" />
                    Close
                </Button>
            </div>
        </Dialog>
    )
}
