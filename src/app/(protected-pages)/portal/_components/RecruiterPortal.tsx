'use client'

import React from 'react'
import { Card, Button, Badge } from '@/components/ui'
import {
    PiBriefcaseDuotone,
    PiFileTextDuotone,
    PiUsersThreeDuotone,
    PiCalendarDuotone,
    PiPlusCircleDuotone,
    PiGearDuotone,
} from 'react-icons/pi'
import Link from 'next/link'

type RecruiterPortalProps = {
    user: {
        name?: string | null
        email?: string | null
    }
}

export default function RecruiterPortal({ user }: RecruiterPortalProps) {
    const stats = [
        {
            title: 'My Active Job Posts',
            value: '8',
            change: '+1 post this week',
            icon: <PiBriefcaseDuotone className="text-blue-500 text-3xl" />,
            bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        },
        {
            title: 'Total Applications',
            value: '124',
            change: '+24 new applicants',
            icon: <PiFileTextDuotone className="text-emerald-500 text-3xl" />,
            bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
        },
        {
            title: 'Shortlisted Candidates',
            value: '15',
            change: '5 scheduled for interview',
            icon: <PiUsersThreeDuotone className="text-purple-500 text-3xl" />,
            bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        },
        {
            title: 'Interviews Scheduled',
            value: '3',
            change: 'All set for this week',
            icon: <PiCalendarDuotone className="text-amber-500 text-3xl" />,
            bgColor: 'bg-amber-50 dark:bg-amber-950/30',
        },
    ]

    const candidates = [
        { name: 'Michael Chang', role: 'Senior React Developer', status: 'Applied', date: '2 hours ago' },
        { name: 'Sophia Loren', role: 'UX Designer', status: 'Shortlisted', date: '1 day ago' },
        { name: 'David Miller', role: 'Full Stack Engineer', status: 'Interviewing', date: '2 days ago' },
        { name: 'Emma Wilson', role: 'Product Manager', status: 'Applied', date: '3 days ago' },
    ]

    return (
        <div className="flex flex-col gap-6 p-4">
            {/* Header Welcome banner */}
            <div className="bg-gradient-to-r from-teal-950 via-emerald-950 to-teal-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
                <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                    Welcome Back, {user.name || 'Recruiter'}!
                </h1>
                <p className="text-gray-300 max-w-xl text-sm leading-relaxed">
                    Build your dream team today. Review active candidate pipelines, manage your current jobs listings, and schedule upcoming interviews.
                </p>
            </div>

            {/* KPI Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <Card key={idx} className="border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
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
                {/* Recent Candidates list */}
                <Card className="lg:col-span-2 border border-gray-100 dark:border-gray-800 shadow-sm" header={{ content: 'Recent Applicant Pipeline', bordered: true }}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800">
                                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase">Applicant</th>
                                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase">Role Applied For</th>
                                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase">Status</th>
                                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase">Applied</th>
                                </tr>
                            </thead>
                            <tbody>
                                {candidates.map((c, i) => (
                                    <tr key={i} className="border-b border-gray-50 dark:border-gray-900 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                                        <td className="py-4 font-semibold text-sm heading-text">
                                            {c.name}
                                        </td>
                                        <td className="py-4 text-sm text-gray-600 dark:text-gray-300">
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
                                        <td className="py-4 text-xs text-gray-400">
                                            {c.date}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Quick actions panel */}
                <Card className="border border-gray-100 dark:border-gray-800 shadow-sm" header={{ content: 'Recruiter Hub Actions', bordered: true }}>
                    <div className="flex flex-col gap-3">
                        <Link href="/portal/jobs/new" className="w-full">
                            <Button className="w-full flex items-center justify-center gap-2" variant="solid">
                                <PiPlusCircleDuotone className="text-lg" />
                                Post a New Job
                            </Button>
                        </Link>
                        <Link href="/portal/jobs" className="w-full">
                            <Button className="w-full flex items-center justify-center gap-2" variant="default">
                                <PiBriefcaseDuotone className="text-lg" />
                                Manage Current Jobs
                            </Button>
                        </Link>
                        <Link href="/portal/applications" className="w-full">
                            <Button className="w-full flex items-center justify-center gap-2" variant="default">
                                <PiFileTextDuotone className="text-lg" />
                                View All Applications
                            </Button>
                        </Link>
                        <Link href="/portal/settings" className="w-full">
                            <Button className="w-full flex items-center justify-center gap-2" variant="plain">
                                <PiGearDuotone className="text-lg" />
                                Recruiter Settings
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}
