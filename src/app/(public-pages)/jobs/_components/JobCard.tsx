'use client'

import Link from 'next/link'
import dayjs from 'dayjs'
import { Card } from '@/components/ui'
import type { JobType } from '@/features/jobs'
import type { ReactNode } from 'react'
import {
    PiArrowRightBold,
    PiBriefcaseBold,
    PiClockBold,
    PiCurrencyDollarBold,
    PiMapPinBold,
    PiUsersBold,
} from 'react-icons/pi'

interface Props {
    job: JobType
}

export default function JobCard({ job }: Props) {
    const companyName =
        job.recruiter?.companyName ??
        job.recruiter?.user?.name ??
        'HireHub Employer'
    const postedDate = dayjs(job.createdAt).isValid()
        ? dayjs(job.createdAt).format('MMM D, YYYY')
        : 'Recently posted'
    const deadline = dayjs(job.applicationDeadline).isValid()
        ? dayjs(job.applicationDeadline).format('MMM D, YYYY')
        : 'Open until filled'

    const getEmploymentTypeStyles = (type: string) => {
        const normalized = type.toLowerCase()
        if (normalized.includes('full')) {
            return 'bg-emerald-50 text-emerald-700 border-emerald-100/80 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30'
        }
        if (normalized.includes('part') || normalized.includes('intern')) {
            return 'bg-blue-50 text-blue-700 border-blue-100/80 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30'
        }
        if (normalized.includes('contract') || normalized.includes('temp')) {
            return 'bg-amber-50 text-amber-700 border-amber-100/80 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30'
        }
        return 'bg-purple-50 text-purple-700 border-purple-100/80 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/30'
    }

    return (
        <Card
            bodyClass="p-0 h-full"
            className="group relative flex h-full flex-col overflow-hidden border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/40 hover:border-primary/25 hover:-translate-y-1.5 hover:scale-[1.015] dark:border-gray-800/80 dark:bg-gray-950/40 dark:backdrop-blur-xl dark:hover:border-primary/30 dark:hover:shadow-primary/5 dark:hover:bg-gray-950/60 @container"
        >
            {/* Elegant gradient glow effect */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/5 blur-3xl transition-opacity duration-300 group-hover:bg-primary/10 dark:bg-primary/10 dark:group-hover:bg-primary/15" />

            <div className="flex h-full flex-col gap-5 p-5 relative">
                {/* Header Section */}
                <div className="flex flex-col gap-3 @[380px]:flex-row @[380px]:items-start @[380px]:justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <CompanyMark job={job} />
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 truncate">
                                {companyName}
                            </p>
                            <h3 className="mt-1 line-clamp-2 text-base font-bold leading-snug text-gray-950 transition-colors group-hover:text-primary dark:text-white dark:group-hover:text-primary-mild sm:text-lg">
                                {job.title}
                            </h3>
                        </div>
                    </div>
                    <span
                        className={`self-start shrink-0 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold shadow-sm transition-all duration-300 ${getEmploymentTypeStyles(job.employmentType)}`}
                    >
                        {job.employmentType}
                    </span>
                </div>

                {/* Meta Pills Grid */}
                <div className="flex flex-wrap gap-2">
                    <Meta icon={<PiMapPinBold />} value={job.location} />
                    <Meta
                        icon={<PiCurrencyDollarBold />}
                        value={job.salaryRange}
                    />
                    <Meta
                        icon={<PiBriefcaseBold />}
                        value={job.experienceLevel}
                    />
                    <Meta
                        icon={<PiClockBold />}
                        value={`Posted ${postedDate}`}
                    />
                    <Meta
                        icon={<PiUsersBold />}
                        value={`${job.vacancyCount} open role${job.vacancyCount === 1 ? '' : 's'}`}
                    />
                </div>

                {/* Description */}
                <p className="line-clamp-3 text-sm leading-relaxed text-gray-600/90 dark:text-gray-300/90">
                    {job.description}
                </p>

                {/* Required Skills */}
                <div className="flex flex-wrap gap-1.5">
                    {job.requiredSkills.slice(0, 4).map((skill) => (
                        <span
                            key={skill}
                            className="inline-flex items-center rounded-lg border border-gray-100 bg-gray-50/50 px-2.5 py-1 text-xs font-semibold text-gray-600 shadow-sm transition-all duration-200 hover:border-gray-200 hover:bg-gray-100/70 hover:text-gray-900 dark:border-gray-800/60 dark:bg-gray-900/30 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-800/80 dark:hover:text-white"
                        >
                            {skill}
                        </span>
                    ))}
                </div>

                {/* Footer Section */}
                <div className="mt-auto flex items-center justify-between gap-4 border-t border-gray-100 pt-4 dark:border-gray-800">
                    <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                            <span>
                                Deadline:{' '}
                                <strong className="font-semibold text-gray-700 dark:text-gray-300">
                                    {deadline}
                                </strong>
                            </span>
                        </div>
                        <p className="pl-3 text-[10px] text-gray-400 dark:text-gray-500">
                            Updated {postedDate}
                        </p>
                    </div>
                    <Link
                        href={`/jobs/${job.id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-gray-950/10 transition-all duration-300 hover:bg-gray-900 hover:shadow-lg hover:scale-[1.02] dark:bg-white dark:text-gray-950 dark:hover:bg-gray-50 dark:shadow-white/5 shrink-0"
                    >
                        View details
                        <PiArrowRightBold className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </Card>
    )
}

function Meta({ icon, value }: { icon: ReactNode; value: string }) {
    if (!value) return null
    return (
        <div className="inline-flex items-center gap-1.5 rounded-lg border border-gray-100/80 bg-gray-50/50 px-2.5 py-1 text-xs font-semibold text-gray-600 shadow-sm transition-all duration-300 hover:border-primary/20 hover:bg-white dark:border-gray-800/80 dark:bg-gray-900/50 dark:text-gray-300 dark:hover:border-primary/30 dark:hover:bg-gray-950">
            <span className="text-sm text-primary dark:text-primary-mild">
                {icon}
            </span>
            <span className="truncate max-w-[150px]">{value}</span>
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
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-gray-100 shadow-sm transition-transform duration-300 group-hover:scale-105 dark:border-gray-800">
                <img
                    src={logo}
                    alt={job.recruiter?.companyName ?? 'Company logo'}
                    className="h-full w-full object-cover"
                />
            </div>
        )
    }

    return (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-indigo-500 text-sm font-bold text-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-primary/20">
            {initials}
        </div>
    )
}
