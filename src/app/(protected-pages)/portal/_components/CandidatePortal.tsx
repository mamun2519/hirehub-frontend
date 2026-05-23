'use client'

import React, { useState, useEffect } from 'react'
import { Card, Button, Badge, Progress } from '@/components/ui'
import {
    PiBriefcaseDuotone,
    PiFileTextDuotone,
    PiEyeDuotone,
    PiCalendarDuotone,
    PiMapPinDuotone,
    PiCurrencyDollarDuotone,
    PiMagnifyingGlassDuotone,
    PiUserDuotone,
} from 'react-icons/pi'
import Link from 'next/link'
import { apiGetDashboardStats } from '@/services/CommonService'
import Chart from '@/components/shared/Chart'

type CandidatePortalProps = {
    user: {
        name?: string | null
        email?: string | null
    }
}

interface CandidateDashboardData {
    kpi: {
        applicationsSent: number
        interviewsScheduled: number
        profileViews: number
        completeness: number
    }
    recommendedJobs: {
        id: string
        title: string
        company: string
        location: string
        salary: string
        tags: string[]
    }[]
    statusCounts: { status: string; count: number }[]
    growthTimeline: { month: string; applications: number }[]
}

export default function CandidatePortal({ user }: CandidatePortalProps) {
    const [loading, setLoading] = useState<boolean>(true)
    const [data, setData] = useState<CandidateDashboardData | null>(null)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await apiGetDashboardStats<{
                    success: boolean
                    data: CandidateDashboardData
                }>()
                if (response && response.success) {
                    setData(response.data)
                }
            } catch (error) {
                console.error(
                    'Error fetching candidate dashboard statistics:',
                    error,
                )
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading || !data) {
        return (
            <div className="flex flex-col gap-6 p-4 animate-pulse">
                {/* Header skeleton */}
                <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl w-full" />
                {/* KPI stats grid skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="h-28 bg-gray-100 dark:bg-gray-800 rounded-xl"
                        />
                    ))}
                </div>
                {/* Charts & Split skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-96 bg-gray-100 dark:bg-gray-800 rounded-xl" />
                    <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-xl" />
                </div>
            </div>
        )
    }

    const { kpi, recommendedJobs, statusCounts } = data

    const stats = [
        {
            title: 'Applications Sent',
            value: kpi.applicationsSent.toLocaleString(),
            change: 'Jobs you applied for',
            icon: <PiFileTextDuotone className="text-blue-500 text-3xl" />,
            bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        },
        {
            title: 'Interviews Scheduled',
            value: kpi.interviewsScheduled.toLocaleString(),
            change: 'Upcoming review rounds',
            icon: <PiCalendarDuotone className="text-emerald-500 text-3xl" />,
            bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
        },
        {
            title: 'Profile Views',
            value: kpi.profileViews.toLocaleString(),
            change: 'Employer profile reviews',
            icon: <PiEyeDuotone className="text-purple-500 text-3xl" />,
            bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        },
    ]

    // Donut chart status mappings
    const statusLabelsMap: Record<string, string> = {
        pending: 'Pending',
        under_review: 'Under Review',
        shortlisted: 'Shortlisted',
        interview_scheduled: 'Interviewing',
        offered: 'Offered',
        rejected: 'Rejected',
    }

    const donutSeries = statusCounts.map((sc) => sc.count)
    const donutLabels = statusCounts.map(
        (sc) => statusLabelsMap[sc.status] || sc.status,
    )
    const donutColors = [
        '#f59e0b',
        '#3b82f6',
        '#10b981',
        '#6366f1',
        '#14b8a6',
        '#ef4444',
    ]
    const totalAppsCalculated = donutSeries.reduce((a, b) => a + b, 0)

    return (
        <div className="flex flex-col gap-6 p-4">
            {/* Header Welcome banner */}
            <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-blue-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
                <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                    Welcome, {user.name || 'Candidate'}!
                </h1>
                <p className="text-gray-300 max-w-xl text-sm leading-relaxed">
                    Discover new possibilities. View matching career
                    opportunities, track status updates of your submitted
                    applications, and optimize your candidate profile.
                </p>
            </div>

            {/* KPI Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <Card
                        key={idx}
                        className="border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    {stat.title}
                                </span>
                                <h3 className="text-2xl font-bold heading-text">
                                    {stat.value}
                                </h3>
                                <span className="text-xs text-gray-400 mt-1">
                                    {stat.change}
                                </span>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                {stat.icon}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Content layout split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Job Matches */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <h4 className="font-bold text-lg heading-text mb-1 flex items-center gap-2">
                        <PiBriefcaseDuotone className="text-indigo-600 dark:text-indigo-400 text-xl animate-bounce" />
                        Recommended Jobs For You
                    </h4>
                    {recommendedJobs.length > 0 ? (
                        recommendedJobs.map((job, index) => (
                            <Card
                                key={index}
                                className="border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex flex-col gap-2">
                                        <div>
                                            <h5 className="font-bold text-base heading-text">
                                                {job.title}
                                            </h5>
                                            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                                {job.company}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                                            <span className="flex items-center gap-1 font-semibold">
                                                <PiMapPinDuotone />
                                                {job.location}
                                            </span>
                                            <span className="flex items-center gap-1 font-semibold">
                                                <PiCurrencyDollarDuotone />
                                                {job.salary}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {job.tags.map((tag, tIdx) => (
                                                <Badge
                                                    key={tIdx}
                                                    content={tag}
                                                    innerClass="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs py-0.5 px-2 rounded-md font-medium"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/jobs/${job.id}`}
                                            target="_blank"
                                        >
                                            <Button variant="solid" size="sm">
                                                Apply Now
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Card className="border border-gray-100 dark:border-gray-800 shadow-sm py-12 text-center text-gray-400">
                            <span className="text-sm font-semibold">
                                No recommended jobs matching your skills right
                                now. Try updating your skills inventory in
                                profile settings!
                            </span>
                        </Card>
                    )}
                </div>

                {/* Profile Completion & Quick Links */}
                <div className="flex flex-col gap-6">
                    {/* Completeness slider */}
                    <Card
                        className="border border-gray-100 dark:border-gray-800 shadow-sm"
                        header={{
                            content: 'Profile Completeness',
                            bordered: true,
                        }}
                    >
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between text-xs text-gray-500 font-bold">
                                <span>Strengthen your profile</span>
                                <span>{kpi.completeness}%</span>
                            </div>
                            <Progress
                                percent={kpi.completeness}
                                showInfo={false}
                                customColorClass={
                                    kpi.completeness === 100
                                        ? 'bg-emerald-600'
                                        : 'bg-indigo-600'
                                }
                            />
                            <p className="text-xs text-gray-400 leading-relaxed mt-1">
                                {kpi.completeness === 100
                                    ? 'Awesome! Your profile is 100% complete and highly visible to top employers.'
                                    : 'Candidates with complete profiles are 3x more likely to catch the eye of top recruiters.'}
                            </p>
                        </div>
                    </Card>

                    {/* Application Status Chart */}
                    <Card
                        className="border border-gray-100 dark:border-gray-800 shadow-sm"
                        header={{
                            content: 'My Applications Stage Breakdown',
                            bordered: true,
                        }}
                    >
                        <div className="flex flex-col items-center justify-center pb-2 pt-2">
                            {totalAppsCalculated > 0 ? (
                                <>
                                    <Chart
                                        type="donut"
                                        series={donutSeries}
                                        customOptions={{
                                            labels: donutLabels,
                                            colors: donutColors,
                                            plotOptions: {
                                                pie: {
                                                    donut: {
                                                        size: '80%',
                                                    },
                                                },
                                            },
                                        }}
                                        donutTitle="Sent Apps"
                                        donutText={String(totalAppsCalculated)}
                                        height={210}
                                    />
                                    <div className="grid grid-cols-3 gap-y-2 gap-x-1 w-full px-2 mt-4 text-center">
                                        {donutLabels.map((label, i) => (
                                            <div
                                                key={i}
                                                className="flex flex-col gap-0.5"
                                            >
                                                <span className="text-[9px] text-gray-400 font-bold truncate max-w-full">
                                                    {label}
                                                </span>
                                                <span
                                                    className="text-xs font-extrabold"
                                                    style={{
                                                        color: donutColors[i],
                                                    }}
                                                >
                                                    {donutSeries[i]}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                    <PiFileTextDuotone className="text-4xl opacity-30 mb-2" />
                                    <span className="text-xs font-semibold">
                                        No applications submitted yet
                                    </span>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Candidate shortcuts */}
                    <Card
                        className="border border-gray-100 dark:border-gray-800 shadow-sm"
                        header={{
                            content: 'Candidate Shortcuts',
                            bordered: true,
                        }}
                    >
                        <div className="flex flex-col gap-3">
                            <Link href="/portal/jobs" className="w-full">
                                <Button
                                    className="w-full flex items-center justify-center gap-2"
                                    variant="default"
                                >
                                    <PiMagnifyingGlassDuotone className="text-lg" />
                                    Explore Job Market
                                </Button>
                            </Link>
                            <Link
                                href="/portal/applications"
                                className="w-full"
                            >
                                <Button
                                    className="w-full flex items-center justify-center gap-2"
                                    variant="default"
                                >
                                    <PiFileTextDuotone className="text-lg" />
                                    Track My Applications
                                </Button>
                            </Link>
                            <Link href="/portal/profile" className="w-full">
                                <Button
                                    className="w-full flex items-center justify-center gap-2"
                                    variant="plain"
                                >
                                    <PiUserDuotone className="text-lg" />
                                    Edit Resume Profile
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
