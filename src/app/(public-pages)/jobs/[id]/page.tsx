'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dayjs from 'dayjs'
import {
    Alert,
    Button,
    Card,
    Spinner,
    toast,
    Notification,
} from '@/components/ui'
import { apiGetJob } from '@/services/JobService'
import type { JobType } from '@/features/jobs'
import ApplyJobDialog from '../_components/ApplyJobDialog'
import {
    PiArrowLeftBold,
    PiBriefcaseBold,
    PiCalendarBold,
    PiCurrencyDollarBold,
    PiGlobeBold,
    PiMapPinBold,
    PiShareNetworkBold,
    PiSparkleBold,
    PiUsersBold,
} from 'react-icons/pi'

const normalizeJobResponse = (response: any): JobType | null => {
    const raw = response?.data?.data ?? response?.data
    return raw ?? null
}

export default function PublicJobDetailPage() {
    const router = useRouter()
    const params = useParams<{ id?: string | string[] }>()
    const jobId = Array.isArray(params.id) ? params.id[0] : params.id

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [job, setJob] = useState<JobType | null>(null)
    const [applyOpen, setApplyOpen] = useState(false)

    useEffect(() => {
        let mounted = true

        const loadJob = async () => {
            if (!jobId) {
                setError('This job listing could not be found.')
                setLoading(false)
                return
            }

            setLoading(true)
            setError('')
            try {
                const response = await apiGetJob<any>(jobId)
                if (!mounted) return
                const jobData = normalizeJobResponse(response)
                if (!jobData) {
                    setError('We could not find that job listing.')
                    setJob(null)
                } else {
                    setJob(jobData)
                }
            } catch (err) {
                if (!mounted) return
                console.error('Failed to load job detail:', err)
                setError('We could not load this job right now.')
                setJob(null)
            } finally {
                if (mounted) setLoading(false)
            }
        }

        void loadJob()

        return () => {
            mounted = false
        }
    }, [jobId])

    const companyName = useMemo(
        () =>
            job?.recruiter?.companyName ??
            job?.recruiter?.user?.name ??
            'HireHub Employer',
        [job],
    )

    const copyLink = async () => {
        if (!job) return
        try {
            await navigator.clipboard.writeText(window.location.href)
            toast.push(
                <Notification title="Link copied" type="success">
                    You can share this listing with anyone now.
                </Notification>,
            )
        } catch {
            toast.push(
                <Notification title="Copy failed" type="danger">
                    We could not copy the link automatically.
                </Notification>,
            )
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-300">
                    <Spinner size="lg" />
                    <span>Loading job details...</span>
                </div>
            </div>
        )
    }

    if (error || !job) {
        return (
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-10 sm:px-6 lg:px-8">
                <Alert
                    type="warning"
                    showIcon
                    title="Job not available"
                    className="rounded-2xl"
                >
                    {error || 'The listing you requested could not be loaded.'}
                </Alert>
                <div className="flex gap-3">
                    <Button
                        variant="plain"
                        className="bg-gray-950 hover:bg-gray-900 text-white font-semibold transition-all duration-300 hover:scale-[1.02] shadow-md shadow-gray-950/10 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-50 dark:shadow-white/5 rounded-xl border-0 h-10 px-4 flex items-center gap-2"
                        onClick={() => router.push('/jobs')}
                    >
                        <PiArrowLeftBold />
                        Back to jobs
                    </Button>
                </div>
            </div>
        )
    }

    const postedDate = dayjs(job.createdAt).isValid()
        ? dayjs(job.createdAt).format('MMM D, YYYY')
        : 'Recently posted'
    const deadline = dayjs(job.applicationDeadline).isValid()
        ? dayjs(job.applicationDeadline).format('MMM D, YYYY')
        : 'Open until filled'

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Button
                        variant="plain"
                        className="bg-white border border-gray-200/60 text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-800 font-bold transition-all duration-300 hover:scale-[1.02] shadow-sm rounded-xl h-10 px-4 flex items-center gap-2 group"
                        onClick={() => router.push('/jobs')}
                    >
                        <PiArrowLeftBold className="transition-transform duration-300 group-hover:-translate-x-1" />
                        Back to jobs
                    </Button>
                    <div className="flex items-center gap-2.5">
                        <Button
                            variant="plain"
                            className="bg-white border border-gray-200/60 text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-800 font-bold transition-all duration-300 hover:scale-[1.02] shadow-sm rounded-xl h-10 px-4 flex items-center gap-2"
                            onClick={copyLink}
                        >
                            <PiShareNetworkBold className="text-base" />
                            Share
                        </Button>
                        <Button
                            variant="plain"
                            className="bg-gray-950 hover:bg-gray-900 text-white font-bold transition-all duration-300 hover:scale-[1.02] shadow-md shadow-gray-950/20 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-50 dark:shadow-white/5 rounded-xl border-0 h-10 px-6 flex items-center justify-center gap-1.5"
                            onClick={() => setApplyOpen(true)}
                        >
                            Apply Now
                        </Button>
                    </div>
                </div>

                <Card className="overflow-hidden border border-gray-200/60 bg-white/60 dark:bg-gray-950/40 dark:border-gray-800/60 backdrop-blur-xl shadow-xl shadow-gray-950/5 rounded-3xl">
                    <div className="relative border-b border-gray-200/60 bg-gradient-to-br from-primary/5 via-white to-indigo-50/20 dark:border-gray-800/60 dark:from-gray-900/40 dark:via-gray-950/60 dark:to-gray-900/40 p-6 md:p-8">
                        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(42,133,255,0.06),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.04),transparent_30%)]" />
                        <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between z-10">
                            <div className="space-y-4.5">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <CompanyMark job={job} />
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-400 dark:text-gray-500">
                                            {companyName}
                                        </p>
                                        <h1 className="mt-1 text-3xl md:text-4xl font-extrabold tracking-tight text-gray-950 dark:text-white bg-gradient-to-r from-gray-950 via-gray-900 to-gray-800 dark:from-white dark:via-gray-100 dark:to-gray-300 bg-clip-text leading-tight">
                                            {job.title}
                                        </h1>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Badge icon={<PiBriefcaseBold />}>
                                        {job.employmentType}
                                    </Badge>
                                    <Badge icon={<PiGlobeBold />}>
                                        {job.remoteInfo}
                                    </Badge>
                                    <Badge icon={<PiSparkleBold />}>
                                        {job.experienceLevel}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid gap-3 rounded-2xl bg-white/60 dark:bg-gray-900/40 border border-gray-200/50 dark:border-gray-800/50 p-4.5 shadow-sm backdrop-blur-md min-w-[240px]">
                                <Stat
                                    icon={<PiMapPinBold />}
                                    label="Location"
                                    value={job.location}
                                />
                                <Stat
                                    icon={<PiCurrencyDollarBold />}
                                    label="Salary"
                                    value={job.salaryRange}
                                />
                                <Stat
                                    icon={<PiUsersBold />}
                                    label="Vacancies"
                                    value={`${job.vacancyCount}`}
                                />
                                <Stat
                                    icon={<PiCalendarBold />}
                                    label="Deadline"
                                    value={deadline}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.85fr)]">
                        <div className="space-y-8">
                            <section className="space-y-3.5">
                                <h2 className="text-xl font-bold text-gray-950 dark:text-white">
                                    Job Description
                                </h2>
                                <div className="prose max-w-none text-gray-600 dark:prose-invert dark:text-gray-300">
                                    <p className="whitespace-pre-wrap leading-7 font-semibold">
                                        {job.description}
                                    </p>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-bold text-gray-950 dark:text-white">
                                    Required skills
                                </h2>
                                <div className="flex flex-wrap gap-2.5">
                                    {job.requiredSkills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="inline-flex items-center rounded-xl bg-gray-50 border border-gray-200/60 px-3.5 py-1.5 text-sm font-semibold text-gray-700 dark:bg-gray-900/40 dark:border-gray-800/60 dark:text-gray-300 hover:border-primary/30 dark:hover:border-primary/40 transition-all duration-300 shadow-sm"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <aside className="space-y-6">
                            <Card className="border border-gray-200/60 bg-gradient-to-br from-primary/3 via-white to-indigo-50/5 dark:from-gray-900/40 dark:via-gray-950/40 dark:to-gray-900/40 p-3 rounded-3xl shadow-sm">
                                <h3 className="text-base font-bold text-gray-950 dark:text-white">
                                    About the Company
                                </h3>
                                <div className="mt-4 flex items-center gap-3.5">
                                    <CompanyMark job={job} />
                                    <div>
                                        <p className="font-extrabold text-gray-950 dark:text-white text-base">
                                            {companyName}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">
                                            Posted {postedDate}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-5 space-y-2.5 text-sm text-gray-600 dark:text-gray-300 font-semibold border-t border-gray-200/60 dark:border-gray-800/60 pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Recruiter:
                                        </span>
                                        <span className="text-gray-900 dark:text-gray-200 truncate max-w-[140px]">
                                            {job.recruiterId ?? 'Not shared'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Deadline:
                                        </span>
                                        <span className="text-gray-900 dark:text-gray-200">
                                            {deadline}
                                        </span>
                                    </div>
                                </div>
                            </Card>

                            <Card className="border border-gray-200/60 bg-white/40 dark:bg-gray-950/40 p-3 rounded-3xl shadow-sm">
                                <h3 className="text-base font-bold text-gray-950 dark:text-white">
                                    Quick facts
                                </h3>
                                <div className="mt-4 space-y-3.5 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-200/60 dark:border-gray-800/60 pt-4 font-semibold">
                                    <StatRow
                                        label="Experience"
                                        value={job.experienceLevel}
                                    />
                                    <StatRow
                                        label="Employment"
                                        value={job.employmentType}
                                    />
                                    <StatRow
                                        label="Work style"
                                        value={job.remoteInfo}
                                    />
                                    <StatRow
                                        label="Posted"
                                        value={postedDate}
                                    />
                                    <StatRow
                                        label="Deadline"
                                        value={deadline}
                                    />
                                </div>
                            </Card>
                        </aside>
                    </div>
                </Card>
            </div>

            <ApplyJobDialog
                job={job}
                isOpen={applyOpen}
                onClose={() => setApplyOpen(false)}
            />
        </div>
    )
}

function Badge({
    children,
    icon,
}: {
    children: React.ReactNode
    icon?: React.ReactNode
}) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 dark:bg-primary/20 dark:border-primary/30 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.05em] text-primary dark:text-white shadow-sm">
            {icon && <span className="text-xs">{icon}</span>}
            {children}
        </span>
    )
}

function Stat({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode
    label: string
    value: string
}) {
    return (
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
            <span className="text-primary/70 dark:text-primary-mild/75 text-base">
                {icon}
            </span>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                    {label}
                </p>
                <p className="font-bold text-gray-950 dark:text-white mt-0.5">
                    {value}
                </p>
            </div>
        </div>
    )
}

function StatRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-gray-200/40 dark:border-gray-800/40 pb-2.5 last:border-0 last:pb-0">
            <span className="text-gray-500 dark:text-gray-400">{label}</span>
            <span className="font-bold text-gray-900 dark:text-gray-200 text-right">
                {value}
            </span>
        </div>
    )
}

function CompanyMark({ job }: { job: JobType }) {
    const logo = job.recruiter?.logo
    const initials = (
        job.recruiter?.companyName ??
        job.recruiter?.user?.name ??
        'HH'
    )
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('')

    if (logo) {
        return (
            <img
                src={logo}
                alt={job.recruiter?.companyName ?? 'Company logo'}
                className="h-14 w-14 rounded-2xl border border-gray-200 object-cover shadow-sm dark:border-gray-800"
            />
        )
    }

    return (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-indigo-500 text-base font-bold text-white shadow-md">
            {initials}
        </div>
    )
}
