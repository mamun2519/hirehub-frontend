'use client'

import React, { useState, useEffect } from 'react'
import { Card, Button, Badge } from '@/components/ui'
import {
    PiBriefcaseDuotone,
    PiFileTextDuotone,
    PiUsersThreeDuotone,
    PiCalendarDuotone,
    PiPlusCircleDuotone,
    PiGearDuotone,
    PiTrendUpDuotone,
} from 'react-icons/pi'
import Link from 'next/link'
import { apiGetDashboardStats } from '@/services/CommonService'
import Chart from '@/components/shared/Chart'

type RecruiterPortalProps = {
    user: {
        name?: string | null
        email?: string | null
    }
}

interface RecruiterDashboardData {
    kpi: {
        activeJobs: number
        totalApplications: number
        shortlistedCandidates: number
        scheduledInterviews: number
    }
    statusCounts: { status: string; count: number }[]
    jobPopularity: { title: string; applications: number }[]
    growthTimeline: { month: string; applications: number }[]
    recentApplicants: {
        name: string
        role: string
        status: string
        date: string
    }[]
}

export default function RecruiterPortal({ user }: RecruiterPortalProps) {
    const [loading, setLoading] = useState<boolean>(true)
    const [data, setData] = useState<RecruiterDashboardData | null>(null)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await apiGetDashboardStats<{
                    success: boolean
                    data: RecruiterDashboardData
                }>()
                if (response && response.success) {
                    setData(response.data)
                }
            } catch (error) {
                console.error('Error fetching recruiter dashboard statistics:', error)
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-28 bg-gray-100 dark:bg-gray-800 rounded-xl" />
                    ))}
                </div>
                {/* Charts grid skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-96 bg-gray-100 dark:bg-gray-800 rounded-xl" />
                    <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-xl" />
                </div>
            </div>
        )
    }

    const { kpi, statusCounts, jobPopularity, growthTimeline, recentApplicants } = data

    const stats = [
        {
            title: 'My Active Job Posts',
            value: kpi.activeJobs.toLocaleString(),
            change: 'Jobs active on board',
            icon: <PiBriefcaseDuotone className="text-blue-500 text-3xl" />,
            bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        },
        {
            title: 'Total Applications',
            value: kpi.totalApplications.toLocaleString(),
            change: 'All-time submissions',
            icon: <PiFileTextDuotone className="text-emerald-500 text-3xl" />,
            bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
        },
        {
            title: 'Shortlisted Candidates',
            value: kpi.shortlistedCandidates.toLocaleString(),
            change: 'Candidates in shortlist',
            icon: <PiUsersThreeDuotone className="text-purple-500 text-3xl" />,
            bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        },
        {
            title: 'Interviews Scheduled',
            value: kpi.scheduledInterviews.toLocaleString(),
            change: 'Upcoming live rounds',
            icon: <PiCalendarDuotone className="text-amber-500 text-3xl" />,
            bgColor: 'bg-amber-50 dark:bg-amber-950/30',
        },
    ]

    // Donut chart: application status pipeline breakdown
    const statusLabelsMap: Record<string, string> = {
        pending: 'Pending',
        under_review: 'Under Review',
        shortlisted: 'Shortlisted',
        interview_scheduled: 'Interviewing',
        offered: 'Offered',
        rejected: 'Rejected',
    }

    const donutSeries = statusCounts.map((sc) => sc.count)
    const donutLabels = statusCounts.map((sc) => statusLabelsMap[sc.status] || sc.status)
    const donutColors = ['#f59e0b', '#3b82f6', '#10b981', '#6366f1', '#14b8a6', '#ef4444']

    // Bar chart: applications volume per job
    const barXAxis = jobPopularity.map((jp) => jp.title)
    const barSeries = [
        {
            name: 'Applicants',
            data: jobPopularity.map((jp) => jp.applications),
        },
    ]

    // Area chart: applications sent timeline over 6 months
    const areaXAxis = growthTimeline.map((gt) => gt.month)
    const areaSeries = [
        {
            name: 'Applications Received',
            data: growthTimeline.map((gt) => gt.applications),
        },
    ]

    return (
        <div className="flex flex-col gap-6 p-4">
            {/* Header Welcome banner */}
            <div className="bg-gradient-to-r from-teal-950 via-emerald-950 to-teal-950 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
                <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-white">
                    Welcome Back, {user.name || 'Recruiter'}!
                </h1>
                <p className="text-gray-300 max-w-xl text-sm leading-relaxed">
                    Build your dream team today. Review active candidate
                    pipelines, manage your current jobs listings, and schedule
                    upcoming interviews.
                </p>
            </div>

            {/* KPI Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {/* Charts section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Application intake Timeline Area Chart */}
                <Card
                    className="lg:col-span-2 border border-gray-100 dark:border-gray-800 shadow-sm"
                    header={{
                        content: 'Applications Intake Timeline',
                        bordered: true,
                    }}
                >
                    <div className="p-1">
                        <Chart
                            type="area"
                            xAxis={areaXAxis}
                            series={areaSeries}
                            customOptions={{
                                colors: ['#10b981'],
                                stroke: { curve: 'smooth', width: 2.5 },
                                xaxis: {
                                    labels: {
                                        style: {
                                            fontSize: '11px',
                                            colors: '#888',
                                        },
                                    },
                                },
                            }}
                            height={280}
                        />
                    </div>
                </Card>

                {/* Application Status Pipeline Donut */}
                <Card
                    className="border border-gray-100 dark:border-gray-800 shadow-sm"
                    header={{
                        content: 'Applicant Status Breakdown',
                        bordered: true,
                    }}
                >
                    <div className="flex flex-col items-center justify-center h-full pb-6 pt-2">
                        {kpi.totalApplications > 0 ? (
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
                                    donutTitle="Applications"
                                    donutText={String(kpi.totalApplications)}
                                    height={240}
                                />
                                <div className="grid grid-cols-3 gap-y-2 gap-x-1 w-full px-2 mt-4 text-center">
                                    {donutLabels.map((label, i) => (
                                        <div key={i} className="flex flex-col gap-0.5">
                                            <span className="text-[10px] text-gray-400 font-semibold truncate max-w-full">
                                                {label}
                                            </span>
                                            <span
                                                className="text-xs font-extrabold"
                                                style={{ color: donutColors[i] }}
                                            >
                                                {donutSeries[i]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                                <PiFileTextDuotone className="text-5xl opacity-40 mb-2" />
                                <span className="text-sm font-medium">No application data yet</span>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Popularity bar chart & action splits */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Popularity bar chart */}
                <Card
                    className="lg:col-span-2 border border-gray-100 dark:border-gray-800 shadow-sm"
                    header={{
                        content: 'Job Postings Popularity (Applicants / Job)',
                        bordered: true,
                    }}
                >
                    <div className="p-1">
                        {jobPopularity.length > 0 ? (
                            <Chart
                                type="bar"
                                xAxis={barXAxis}
                                series={barSeries}
                                customOptions={{
                                    colors: ['#6366f1'],
                                    plotOptions: {
                                        bar: {
                                            columnWidth: '25%',
                                            borderRadius: 6,
                                        },
                                    },
                                    xaxis: {
                                        labels: {
                                            style: {
                                                fontSize: '10px',
                                                colors: '#888',
                                            },
                                        },
                                    },
                                }}
                                height={280}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <PiBriefcaseDuotone className="text-5xl opacity-40 mb-2" />
                                <span className="text-sm font-medium">No active job listings</span>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Quick actions panel */}
                <Card
                    className="border border-gray-100 dark:border-gray-800 shadow-sm"
                    header={{
                        content: 'Recruiter Hub Actions',
                        bordered: true,
                    }}
                >
                    <div className="flex flex-col gap-3">
                        <Link href="/portal/jobs/new" className="w-full">
                            <Button
                                className="w-full flex items-center justify-center gap-2"
                                variant="solid"
                            >
                                <PiPlusCircleDuotone className="text-lg" />
                                Post a New Job
                            </Button>
                        </Link>
                        <Link href="/portal/jobs" className="w-full">
                            <Button
                                className="w-full flex items-center justify-center gap-2"
                                variant="default"
                            >
                                <PiBriefcaseDuotone className="text-lg" />
                                Manage Current Jobs
                            </Button>
                        </Link>
                        <Link href="/portal/applications" className="w-full">
                            <Button
                                className="w-full flex items-center justify-center gap-2"
                                variant="default"
                            >
                                <PiFileTextDuotone className="text-lg" />
                                View All Applications
                            </Button>
                        </Link>
                        <Link href="/portal/settings" className="w-full">
                            <Button
                                className="w-full flex items-center justify-center gap-2"
                                variant="plain"
                            >
                                <PiGearDuotone className="text-lg" />
                                Recruiter Settings
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>

            {/* Content layout split */}
            <div className="grid grid-cols-1 gap-6">
                {/* Recent Candidates list */}
                <Card
                    className="border border-gray-100 dark:border-gray-800 shadow-sm"
                    header={{
                        content: 'Recent Applicant Pipeline',
                        bordered: true,
                    }}
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800">
                                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase">
                                        Applicant
                                    </th>
                                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase">
                                        Role Applied For
                                    </th>
                                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase">
                                        Status
                                    </th>
                                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase">
                                        Applied
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentApplicants.length > 0 ? (
                                    recentApplicants.map((c, i) => (
                                        <tr
                                            key={i}
                                            className="border-b border-gray-55 dark:border-gray-900 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors"
                                        >
                                            <td className="py-4 font-semibold text-sm heading-text">
                                                {c.name}
                                            </td>
                                            <td className="py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                                                {c.role}
                                            </td>
                                            <td className="py-4">
                                                <Badge
                                                    className="capitalize"
                                                    content={c.status}
                                                    innerClass={
                                                        c.status === 'Interviewing'
                                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                                                            : c.status === 'Shortlisted'
                                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                                                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                                                    }
                                                />
                                            </td>
                                            <td className="py-4 text-xs text-gray-400 font-semibold">
                                                {c.date}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-gray-400 text-sm font-medium">
                                            No applicants in the active pipeline
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    )
}
