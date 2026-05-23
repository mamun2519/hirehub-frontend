'use client'

import React, { useState, useEffect } from 'react'
import { Card, Button, Badge } from '@/components/ui'
import {
    PiUsersDuotone,
    PiBriefcaseDuotone,
    PiFileTextDuotone,
    PiGearDuotone,
    PiTrendUpDuotone,
    PiShieldCheckDuotone,
} from 'react-icons/pi'
import Link from 'next/link'
import { apiGetDashboardStats } from '@/services/CommonService'
import Chart from '@/components/shared/Chart'

type AdminPortalProps = {
    user: {
        name?: string | null
        email?: string | null
    }
}

interface DashboardData {
    kpi: {
        totalUsers: number
        totalJobs: number
        totalApplications: number
        acceptedApplications: number
        systemHealth: string
    }
    userDistribution: { role: string; count: number }[]
    growthTimeline: {
        month: string
        users: number
        jobs: number
        applications: number
    }[]
    recentUsers: {
        name: string
        email: string
        role: string
        date: string
    }[]
}

export default function AdminPortal({ user }: AdminPortalProps) {
    const [loading, setLoading] = useState<boolean>(true)
    const [data, setData] = useState<DashboardData | null>(null)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await apiGetDashboardStats<{
                    success: boolean
                    data: DashboardData
                }>()
                if (response && response.success) {
                    setData(response.data)
                }
            } catch (error) {
                console.error('Error fetching admin dashboard statistics:', error)
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

    const { kpi, userDistribution, growthTimeline, recentUsers } = data

    const hiringRatio = kpi.totalApplications > 0
        ? ((kpi.acceptedApplications / kpi.totalApplications) * 100).toFixed(1) + '%'
        : '0.0%'

    const stats = [
        {
            title: 'Total Platform Users',
            value: kpi.totalUsers.toLocaleString(),
            change: 'Active registered users',
            icon: <PiUsersDuotone className="text-blue-500 text-3xl" />,
            bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        },
        {
            title: 'Active Job Openings',
            value: kpi.totalJobs.toLocaleString(),
            change: 'Current live jobs',
            icon: <PiBriefcaseDuotone className="text-emerald-500 text-3xl" />,
            bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
        },
        {
            title: 'Applications Submitted',
            value: kpi.totalApplications.toLocaleString(),
            change: 'Candidate applications',
            icon: <PiFileTextDuotone className="text-purple-500 text-3xl" />,
            bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        },
        {
            title: 'Hiring Ratio',
            value: hiringRatio,
            change: `${kpi.acceptedApplications} of ${kpi.totalApplications} hired`,
            icon: <PiShieldCheckDuotone className="text-amber-500 text-3xl" />,
            bgColor: 'bg-amber-50 dark:bg-amber-950/30',
        },
    ]

    // Donut chart settings for User Distribution
    const candidateCount = userDistribution.find((u) => u.role === 'candidate')?.count || 0
    const recruiterCount = userDistribution.find((u) => u.role === 'recruiter')?.count || 0
    const adminCount = userDistribution.find((u) => u.role === 'admin')?.count || 0

    const donutSeries = [candidateCount, recruiterCount, adminCount]
    const donutLabels = ['Candidates', 'Recruiters', 'Admins']
    const donutColors = ['#3b82f6', '#10b981', '#8b5cf6']

    // Area chart settings for Monthly growth
    const xAxisMonths = growthTimeline.map((g) => g.month)
    const areaSeries = [
        {
            name: 'Users Registered',
            data: growthTimeline.map((g) => g.users),
        },
        {
            name: 'Jobs Posted',
            data: growthTimeline.map((g) => g.jobs),
        },
        {
            name: 'Applications Sent',
            data: growthTimeline.map((g) => g.applications),
        },
    ]

    return (
        <div className="flex flex-col gap-6 p-4">
            {/* Header Welcome banner */}
            <div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
                <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-white">
                    Welcome to the Command Center,{' '}
                    {user.name || 'Administrator'}!
                </h1>
                <p className="text-gray-300 max-w-xl text-sm leading-relaxed">
                    Monitor system performance, review platform statistics,
                    manage active user accounts, and maintain global portal
                    configurations.
                </p>
            </div>

            {/* KPI Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <Card
                        key={idx}
                        className="border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col"
                        bodyClass="h-full flex flex-col flex-grow"
                    >
                        <div className="flex flex-col gap-4 h-full flex-grow">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        {stat.title}
                                    </span>
                                    <h3 className="text-2xl font-bold heading-text">
                                        {stat.value}
                                    </h3>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <div className="border-t border-gray-100 dark:border-gray-800/60 pt-2.5 mt-auto flex items-center gap-1 text-xs text-gray-400">
                                <PiTrendUpDuotone className="text-emerald-500" />
                                {stat.change}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Charts section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Growth Timeline Chart */}
                <Card
                    className="lg:col-span-2 border border-gray-100 dark:border-gray-800 shadow-sm"
                    header={{
                        content: 'Platform Intake Growth Timeline',
                        bordered: true,
                    }}
                >
                    <div className="p-1">
                        <Chart
                            type="area"
                            xAxis={xAxisMonths}
                            series={areaSeries}
                            customOptions={{
                                colors: donutColors,
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

                {/* User Role Distribution Chart */}
                <Card
                    className="border border-gray-100 dark:border-gray-800 shadow-sm"
                    header={{
                        content: 'User Role Breakdown',
                        bordered: true,
                    }}
                >
                    <div className="flex flex-col items-center justify-center h-full pb-6 pt-2">
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
                            donutTitle="Total Users"
                            donutText={String(kpi.totalUsers)}
                            height={260}
                        />
                        <div className="grid grid-cols-3 gap-4 w-full px-4 mt-6 text-center">
                            {donutLabels.map((label, i) => (
                                <div key={i} className="flex flex-col gap-0.5">
                                    <span className="text-xs text-gray-400 font-medium">
                                        {label}
                                    </span>
                                    <span
                                        className="text-base font-bold"
                                        style={{ color: donutColors[i] }}
                                    >
                                        {donutSeries[i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Content layout split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Users list */}
                <Card
                    className="lg:col-span-2 border border-gray-100 dark:border-gray-800 shadow-sm"
                    header={{
                        content: 'Recent Platform Registrations',
                        bordered: true,
                    }}
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800">
                                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase">
                                        User
                                    </th>
                                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase">
                                        Role
                                    </th>
                                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase">
                                        Registered
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentUsers.map((u, i) => (
                                    <tr
                                        key={i}
                                        className="border-b border-gray-50 dark:border-gray-900 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors"
                                    >
                                        <td className="py-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sm heading-text">
                                                    {u.name}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {u.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <Badge
                                                className="capitalize"
                                                content={u.role}
                                                innerClass={
                                                    u.role === 'recruiter'
                                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300'
                                                        : u.role === 'admin'
                                                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                                                }
                                            />
                                        </td>
                                        <td className="py-4 text-xs text-gray-500">
                                            {u.date}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Quick actions panel */}
                <Card
                    className="border border-gray-100 dark:border-gray-800 shadow-sm"
                    header={{
                        content: 'Administrative Actions',
                        bordered: true,
                    }}
                >
                    <div className="flex flex-col gap-3">
                        <Link href="/portal/users" className="w-full">
                            <Button
                                className="w-full flex items-center justify-center gap-2"
                                variant="default"
                            >
                                <PiUsersDuotone className="text-lg" />
                                Manage All Users
                            </Button>
                        </Link>
                        <Link href="/portal/jobs" className="w-full">
                            <Button
                                className="w-full flex items-center justify-center gap-2"
                                variant="default"
                            >
                                <PiBriefcaseDuotone className="text-lg" />
                                Monitor Active Jobs
                            </Button>
                        </Link>
                        <Link href="/portal/settings" className="w-full">
                            <Button
                                className="w-full flex items-center justify-center gap-2"
                                variant="plain"
                            >
                                <PiGearDuotone className="text-lg" />
                                Global System Settings
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}
