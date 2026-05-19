'use client'

import React from 'react'
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

type CandidatePortalProps = {
    user: {
        name?: string | null
        email?: string | null
    }
}

export default function CandidatePortal({ user }: CandidatePortalProps) {
    const stats = [
        {
            title: 'Applications Sent',
            value: '12',
            change: '3 currently under review',
            icon: <PiFileTextDuotone className="text-blue-500 text-3xl" />,
            bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        },
        {
            title: 'Interviews Scheduled',
            value: '2',
            change: 'Next one on Friday',
            icon: <PiCalendarDuotone className="text-emerald-500 text-3xl" />,
            bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
        },
        {
            title: 'Profile Views',
            value: '84',
            change: '+18% increase this week',
            icon: <PiEyeDuotone className="text-purple-500 text-3xl" />,
            bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        },
    ]

    const matchingJobs = [
        {
            title: 'Frontend Engineer (React)',
            company: 'TechCorp Solutions',
            location: 'San Francisco, CA (Hybrid)',
            salary: '$110,000 - $130,000',
            tags: ['React', 'TypeScript', 'Tailwind'],
        },
        {
            title: 'Junior UX/UI Designer',
            company: 'CreativeFlow Studio',
            location: 'New York, NY (Remote)',
            salary: '$80,000 - $95,000',
            tags: ['Figma', 'UI Design', 'Prototyping'],
        },
    ]

    return (
        <div className="flex flex-col gap-6 p-4">
            {/* Header Welcome banner */}
            <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-blue-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
                <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                    Welcome, {user.name || 'Candidate'}!
                </h1>
                <p className="text-gray-300 max-w-xl text-sm leading-relaxed">
                    Discover new possibilities. View matching career opportunities, track status updates of your submitted applications, and optimize your candidate profile.
                </p>
            </div>

            {/* KPI Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                {/* Job Matches */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <h4 className="font-bold text-lg heading-text mb-1">Recommended Jobs For You</h4>
                    {matchingJobs.map((job, index) => (
                        <Card key={index} className="border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex flex-col gap-2">
                                    <div>
                                        <h5 className="font-bold text-base heading-text">{job.title}</h5>
                                        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{job.company}</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <PiMapPinDuotone />
                                            {job.location}
                                        </span>
                                        <span className="flex items-center gap-1">
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
                                    <Button variant="solid" size="sm">
                                        Quick Apply
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Profile Completion & Quick Links */}
                <div className="flex flex-col gap-6">
                    <Card className="border border-gray-100 dark:border-gray-800 shadow-sm" header={{ content: 'Profile Completeness', bordered: true }}>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
                                <span>Strengthen your profile</span>
                                <span>75%</span>
                            </div>
                            <Progress percent={75} showInfo={false} customColorClass="bg-indigo-600" />
                            <p className="text-xs text-gray-400 leading-relaxed mt-1">
                                Candidates with complete profiles are 3x more likely to catch the eye of top recruiters.
                            </p>
                        </div>
                    </Card>

                    <Card className="border border-gray-100 dark:border-gray-800 shadow-sm" header={{ content: 'Candidate Shortcuts', bordered: true }}>
                        <div className="flex flex-col gap-3">
                            <Link href="/portal/jobs" className="w-full">
                                <Button className="w-full flex items-center justify-center gap-2" variant="default">
                                    <PiMagnifyingGlassDuotone className="text-lg" />
                                    Explore Job Market
                                </Button>
                            </Link>
                            <Link href="/portal/applications" className="w-full">
                                <Button className="w-full flex items-center justify-center gap-2" variant="default">
                                    <PiFileTextDuotone className="text-lg" />
                                    Track My Applications
                                </Button>
                            </Link>
                            <Link href="/portal/profile" className="w-full">
                                <Button className="w-full flex items-center justify-center gap-2" variant="plain">
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
