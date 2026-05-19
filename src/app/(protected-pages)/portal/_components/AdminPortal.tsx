'use client'

import React from 'react'
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

type AdminPortalProps = {
    user: {
        name?: string | null
        email?: string | null
    }
}

export default function AdminPortal({ user }: AdminPortalProps) {
    const stats = [
        {
            title: 'Total Platform Users',
            value: '1,248',
            change: '+12.5% this month',
            icon: <PiUsersDuotone className="text-blue-500 text-3xl" />,
            bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        },
        {
            title: 'Active Job Openings',
            value: '342',
            change: '+8.3% this week',
            icon: <PiBriefcaseDuotone className="text-emerald-500 text-3xl" />,
            bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
        },
        {
            title: 'Applications Submitted',
            value: '5,892',
            change: '+15.2% vs last month',
            icon: <PiFileTextDuotone className="text-purple-500 text-3xl" />,
            bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        },
        {
            title: 'System Health Status',
            value: '99.9%',
            change: 'All systems operational',
            icon: <PiShieldCheckDuotone className="text-amber-500 text-3xl" />,
            bgColor: 'bg-amber-50 dark:bg-amber-950/30',
        },
    ]

    const users = [
        { name: 'John Doe', email: 'john@example.com', role: 'recruiter', date: 'May 18, 2026' },
        { name: 'Alice Smith', email: 'alice@example.com', role: 'candidate', date: 'May 18, 2026' },
        { name: 'Bob Johnson', email: 'bob@example.com', role: 'candidate', date: 'May 17, 2026' },
        { name: 'Sarah Lee', email: 'sarah@example.com', role: 'recruiter', date: 'May 16, 2026' },
    ]

    return (
        <div className="flex flex-col gap-6 p-4">
            {/* Header Welcome banner */}
            <div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
                <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                    Welcome to the Command Center, {user.name || 'Administrator'}!
                </h1>
                <p className="text-gray-300 max-w-xl text-sm leading-relaxed">
                    Monitor system performance, review platform statistics, manage active user accounts, and maintain global portal configurations.
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
                                <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                    <PiTrendUpDuotone className="text-emerald-500" />
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
                {/* Recent Users list */}
                <Card className="lg:col-span-2 border border-gray-100 dark:border-gray-800 shadow-sm" header={{ content: 'Recent Platform Registrations', bordered: true }}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800">
                                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase">User</th>
                                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase">Role</th>
                                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase">Registered</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u, i) => (
                                    <tr key={i} className="border-b border-gray-50 dark:border-gray-900 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                                        <td className="py-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sm heading-text">{u.name}</span>
                                                <span className="text-xs text-gray-400">{u.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <Badge
                                                className="capitalize"
                                                content={u.role}
                                                innerClass={u.role === 'recruiter' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'}
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
                <Card className="border border-gray-100 dark:border-gray-800 shadow-sm" header={{ content: 'Administrative Actions', bordered: true }}>
                    <div className="flex flex-col gap-3">
                        <Link href="/portal/users" className="w-full">
                            <Button className="w-full flex items-center justify-center gap-2" variant="default">
                                <PiUsersDuotone className="text-lg" />
                                Manage All Users
                            </Button>
                        </Link>
                        <Link href="/portal/jobs" className="w-full">
                            <Button className="w-full flex items-center justify-center gap-2" variant="default">
                                <PiBriefcaseDuotone className="text-lg" />
                                Monitor Active Jobs
                            </Button>
                        </Link>
                        <Link href="/portal/settings" className="w-full">
                            <Button className="w-full flex items-center justify-center gap-2" variant="plain">
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
