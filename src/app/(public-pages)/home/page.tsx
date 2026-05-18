'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import {
    PiCodeDuotone,
    PiMegaphoneDuotone,
    PiPaletteDuotone,
    PiCoinsDuotone,
    PiUsersThreeDuotone,
    PiBriefcaseDuotone,
    PiMagnifyingGlassDuotone,
    PiMapPinDuotone,
    PiBuildingDuotone,
    PiCurrencyDollarDuotone,
    PiArrowRightBold,
    PiBookmarkSimpleDuotone,
    PiBookmarkSimpleFill,
    PiClockDuotone,
    PiStarDuotone
} from 'react-icons/pi'

export default function PublicHomePage() {
    const [searchTitle, setSearchTitle] = useState('')
    const [searchLocation, setSearchLocation] = useState('')
    const [bookmarkedJobs, setBookmarkedJobs] = useState<number[]>([])

    const toggleBookmark = (id: number) => {
        if (bookmarkedJobs.includes(id)) {
            setBookmarkedJobs(bookmarkedJobs.filter((jobId) => jobId !== id))
        } else {
            setBookmarkedJobs([...bookmarkedJobs, id])
        }
    }

    const categories = [
        {
            title: 'Tech & Engineering',
            jobsCount: '1,245 open roles',
            icon: <PiCodeDuotone className="text-3xl text-primary" />,
            bgColor: 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400',
        },
        {
            title: 'UI/UX & Design',
            jobsCount: '854 open roles',
            icon: <PiPaletteDuotone className="text-3xl text-rose-500" />,
            bgColor: 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400',
        },
        {
            title: 'Marketing & Growth',
            jobsCount: '620 open roles',
            icon: <PiMegaphoneDuotone className="text-3xl text-amber-500" />,
            bgColor: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
        },
        {
            title: 'Product Management',
            jobsCount: '342 open roles',
            icon: <PiBriefcaseDuotone className="text-3xl text-emerald-500" />,
            bgColor: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
        },
        {
            title: 'Finance & Accounts',
            jobsCount: '215 open roles',
            icon: <PiCoinsDuotone className="text-3xl text-cyan-500" />,
            bgColor: 'bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400',
        },
        {
            title: 'Human Resources',
            jobsCount: '198 open roles',
            icon: <PiUsersThreeDuotone className="text-3xl text-violet-500" />,
            bgColor: 'bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400',
        },
    ]

    const featuredJobs = [
        {
            id: 1,
            title: 'Senior Frontend Engineer (React/Next.js)',
            company: 'Vercel Inc.',
            location: 'Remote (US/Canada)',
            salary: '$140,000 - $180,000',
            type: 'Full-time',
            posted: '2 hours ago',
            tags: ['React', 'Next.js', 'TailwindCSS'],
            logoColor: 'from-gray-700 to-black',
            initials: 'VC',
        },
        {
            id: 2,
            title: 'Lead Product Designer',
            company: 'Figma',
            location: 'San Francisco, CA (Hybrid)',
            salary: '$160,000 - $210,000',
            type: 'Full-time',
            posted: '1 day ago',
            tags: ['UI/UX', 'Design Systems', 'Figma'],
            logoColor: 'from-purple-500 to-indigo-600',
            initials: 'FG',
        },
        {
            id: 3,
            title: 'Staff Python/Django Engineer',
            company: 'Stripe',
            location: 'Remote (Global)',
            salary: '$150,000 - $190,000',
            type: 'Full-time',
            posted: '3 days ago',
            tags: ['Python', 'Django', 'APIs'],
            logoColor: 'from-blue-500 to-indigo-500',
            initials: 'ST',
        },
        {
            id: 4,
            title: 'Growth Marketing Manager',
            company: 'Linear',
            location: 'New York, NY',
            salary: '$110,000 - $140,000',
            type: 'Full-time',
            posted: '4 days ago',
            tags: ['SEO', 'Google Ads', 'Analytics'],
            logoColor: 'from-neutral-800 to-neutral-900',
            initials: 'LN',
        },
        {
            id: 5,
            title: 'Associate Product Manager',
            company: 'Discord',
            location: 'San Francisco, CA',
            salary: '$120,000 - $150,000',
            type: 'Full-time',
            posted: '5 days ago',
            tags: ['Product Analytics', 'SQL', 'Agile'],
            logoColor: 'from-blue-600 to-purple-600',
            initials: 'DC',
        },
        {
            id: 6,
            title: 'Senior DevOps Architect',
            company: 'Supabase',
            location: 'Remote (Europe)',
            salary: '$130,000 - $170,000',
            type: 'Full-time',
            posted: '1 week ago',
            tags: ['AWS', 'Kubernetes', 'PostgreSQL'],
            logoColor: 'from-emerald-400 to-emerald-600',
            initials: 'SB',
        },
    ]

    return (
        <div className="relative overflow-hidden">
            {/* Background glowing gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-20 dark:opacity-30">
                <div className="absolute top-[-10%] left-[20%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-gradient-to-r from-primary to-indigo-400 blur-[120px]"></div>
                <div className="absolute top-[10%] right-[15%] w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-gradient-to-r from-rose-400 to-purple-500 blur-[100px]"></div>
            </div>

            {/* 1. HERO SECTION */}
            <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-4xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-subtle/30 dark:bg-primary-subtle/10 text-primary dark:text-primary-subtle text-xs font-semibold tracking-wide uppercase">
                        <PiStarDuotone className="text-sm animate-spin-slow" />
                        Next-Gen Elite Talents and Top Tech Roles
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-none">
                        Connecting Elite Talents with{' '}
                        <span className="bg-gradient-to-r from-primary via-indigo-500 to-primary-deep bg-clip-text text-transparent">
                            World-Class Roles
                        </span>
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Discover premium remote and on-site career pathways in technology, design, product, and beyond. Empower your professional journey now.
                    </p>

                    {/* Floating Premium Search Bar */}
                    <div className="pt-4 max-w-3xl mx-auto">
                        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-stretch gap-3 md:gap-2">
                            <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-800">
                                <PiMagnifyingGlassDuotone className="text-xl text-gray-400 flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Job title, keywords, or company..."
                                    value={searchTitle}
                                    onChange={(e) => setSearchTitle(e.target.value)}
                                    className="w-full bg-transparent border-none outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                                />
                            </div>

                            <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-800">
                                <PiMapPinDuotone className="text-xl text-gray-400 flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder="City, state, or remote..."
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                    className="w-full bg-transparent border-none outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                                />
                            </div>

                            <Button variant="solid" className="py-3 px-6 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2">
                                <PiMagnifyingGlassDuotone className="text-lg" />
                                <span>Search Jobs</span>
                            </Button>
                        </div>

                        {/* Popular Keywords */}
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>Popular Searches:</span>
                            {['React', 'Next.js', 'Figma', 'Python', 'Product Manager', 'Kubernetes'].map((kw) => (
                                <span
                                    key={kw}
                                    onClick={() => setSearchTitle(kw)}
                                    className="cursor-pointer px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                                >
                                    {kw}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Stats Counter Row */}
                    <div className="pt-12 sm:pt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto border-t border-gray-200/50 dark:border-gray-800/50">
                        <div>
                            <div className="text-2xl sm:text-3xl font-extrabold text-primary dark:text-primary-subtle">10,000+</div>
                            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Active Listings</div>
                        </div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-extrabold text-primary dark:text-primary-subtle">500+</div>
                            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Top Employers</div>
                        </div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-extrabold text-primary dark:text-primary-subtle">1.2M+</div>
                            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Job Applications</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. CATEGORY SECTION */}
            <section className="bg-white dark:bg-gray-950/40 py-16 lg:py-24 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Browse Roles by Industry Vertical
                        </h2>
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                            Explore tailored job markets, specialized skill sets, and curated roles crafted for you.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((cat, idx) => (
                            <div
                                key={idx}
                                className="group relative bg-white dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-4 rounded-xl ${cat.bgColor} flex-shrink-0 transition-transform group-hover:scale-110 duration-300`}>
                                        {cat.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-white transition-colors">
                                            {cat.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                            {cat.jobsCount}
                                        </p>
                                    </div>
                                </div>
                                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <PiArrowRightBold className="text-primary dark:text-white text-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. FEATURED JOBS SECTION */}
            <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-4">
                    <div className="space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Featured Opportunities
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Premium tech and creative opportunities handpicked for top talents.
                        </p>
                    </div>
                    <Link href="#">
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary dark:text-primary-subtle hover:underline cursor-pointer group">
                            Explore All Positions
                            <PiArrowRightBold className="transition-transform group-hover:translate-x-1" />
                        </span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredJobs.map((job) => {
                        const isBookmarked = bookmarkedJobs.includes(job.id)
                        return (
                            <Card
                                key={job.id}
                                className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                                bodyClass="p-6 flex flex-col justify-between h-full"
                            >
                                <div>
                                    {/* Card Header (Company Info + Save button) */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-11 w-11 rounded-xl bg-gradient-to-tr ${job.logoColor} text-white flex items-center justify-center font-extrabold text-sm tracking-wide`}>
                                                {job.initials}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-xs">
                                                    {job.company}
                                                </h4>
                                                <div className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                                                    <PiMapPinDuotone />
                                                    <span>{job.location}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => toggleBookmark(job.id)}
                                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
                                            aria-label="Bookmark job"
                                        >
                                            {isBookmarked ? (
                                                <PiBookmarkSimpleFill className="text-xl text-rose-500 animate-jump" />
                                            ) : (
                                                <PiBookmarkSimpleDuotone className="text-xl" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Job Title */}
                                    <h3 className="font-bold text-gray-900 dark:text-white mt-4 text-base group-hover:text-primary dark:group-hover:text-primary-subtle transition-colors line-clamp-2">
                                        {job.title}
                                    </h3>

                                    {/* Job Badges & Info */}
                                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                            {job.type}
                                        </span>
                                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-primary-subtle/30 dark:bg-primary-subtle/10 text-primary dark:text-primary-subtle flex items-center gap-0.5">
                                            <PiCurrencyDollarDuotone />
                                            {job.salary}
                                        </span>
                                    </div>

                                    {/* Technical Tags */}
                                    <div className="flex flex-wrap gap-1.5 mt-4">
                                        {job.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[10px] bg-gray-50 dark:bg-gray-850 px-2 py-0.5 rounded border border-gray-100/50 dark:border-gray-800 text-gray-500 dark:text-gray-400"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer of Job Card */}
                                <div className="border-t border-gray-100 dark:border-gray-800/80 mt-6 pt-4 flex items-center justify-between">
                                    <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
                                        <PiClockDuotone />
                                        {job.posted}
                                    </span>
                                    <Link href="/sign-up">
                                        <Button size="sm" variant="default" className="text-xs group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                                            Apply Now
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            </section>

            {/* 4. HOW IT WORKS SECTION */}
            <section className="bg-white dark:bg-gray-950/40 py-16 lg:py-24 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Launch Your Journey in 3 Steps
                        </h2>
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                            Empowering candidates and recruiters with sleek, highly automated career integrations.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connecting line for desktop layout */}
                        <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-primary/30 via-indigo-500/20 to-primary/30 z-0"></div>

                        {[
                            {
                                step: '01',
                                title: 'Build Premium Account',
                                desc: 'Register in seconds, select your primary career vertical, and format your professional bio beautifully.',
                                icon: <PiUsersThreeDuotone className="text-2xl text-primary" />,
                                borderGlow: 'hover:border-primary/50',
                            },
                            {
                                step: '02',
                                title: 'Link & Parse Your CV',
                                desc: 'Drag-and-drop your resume to automatically extract tech tags, core competencies, and career benchmarks.',
                                icon: <PiBriefcaseDuotone className="text-2xl text-indigo-500" />,
                                borderGlow: 'hover:border-indigo-500/50',
                            },
                            {
                                step: '03',
                                title: 'Apply Globally with 1-Click',
                                desc: 'Send tailored applications directly to elite engineering and creative squads. Track responses instantly.',
                                icon: <PiCodeDuotone className="text-2xl text-rose-500" />,
                                borderGlow: 'hover:border-rose-500/50',
                            },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className={`relative z-10 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300 hover:shadow-lg ${item.borderGlow} flex flex-col items-center text-center`}
                            >
                                <span className="absolute top-4 right-4 text-xs font-bold text-gray-200 dark:text-gray-800 tracking-widest font-mono">
                                    {item.step}
                                </span>
                                <div className="h-12 w-12 rounded-xl bg-gray-50 dark:bg-gray-850 flex items-center justify-center border border-gray-100 dark:border-gray-800 mb-6">
                                    {item.icon}
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-base">
                                    {item.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed max-w-xs">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. DOUBLE-SIDED CALL TO ACTION */}
            <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left CTA: Job Seeker */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-indigo-700 text-white p-8 sm:p-12 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                        <div className="absolute right-[-10%] bottom-[-10%] opacity-15 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                            <PiCodeDuotone className="text-[250px]" />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider">
                                For Candidates
                            </div>
                            <h2 className="text-3xl font-extrabold leading-tight">
                                Land Your Dream Technical & Design Role
                            </h2>
                            <p className="text-white/85 text-sm leading-relaxed max-w-md">
                                Build an elite profile, showcase your git projects, upload your credentials, and let top tech agencies approach you directly.
                            </p>
                            <div className="pt-4 flex flex-wrap items-center gap-4">
                                <Link href="/sign-up">
                                    <Button className="bg-white text-primary border-none hover:bg-gray-100 font-semibold px-6 rounded-xl flex items-center gap-2">
                                        <span>Create Candidate Profile</span>
                                        <PiArrowRightBold />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right CTA: Employer */}
                    <div className="relative overflow-hidden rounded-3xl bg-gray-900 dark:bg-black text-white p-8 sm:p-12 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                        <div className="absolute right-[-10%] bottom-[-10%] opacity-15 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                            <PiBuildingDuotone className="text-[250px]" />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary-subtle text-xs font-semibold uppercase tracking-wider">
                                For Employers
                            </div>
                            <h2 className="text-3xl font-extrabold leading-tight">
                                Recruit Elite Engineering Experts
                            </h2>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                                Put your career listings in front of millions of highly skilled, pre-vetted engineers, UX architects, and tech creators.
                            </p>
                            <div className="pt-4 flex flex-wrap items-center gap-4">
                                <Link href="/sign-in">
                                    <Button variant="solid" className="px-6 rounded-xl flex items-center gap-2">
                                        <span>Post a Job Listing</span>
                                        <PiArrowRightBold />
                                    </Button>
                                </Link>
                                <a href="#" className="text-sm font-semibold hover:underline flex items-center gap-1.5 transition-colors">
                                    Explore Recruitment Plans
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
