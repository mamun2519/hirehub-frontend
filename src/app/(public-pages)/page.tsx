'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import { apiGetJobs } from '@/services/JobService'
import JobCard from './jobs/_components/JobCard'
import type { JobType } from '@/features/jobs'
import {
    PiArrowRightBold,
    PiBriefcaseDuotone,
    PiCodeDuotone,
    PiMagnifyingGlassDuotone,
    PiMapPinDuotone,
    PiPaletteDuotone,
    PiUsersThreeDuotone,
} from 'react-icons/pi'

const normalizeJobsResponse = (response: any): JobType[] => {
    const raw = response?.data?.data ?? response?.data
    return Array.isArray(raw) ? raw : []
}

export default function PublicHomePage() {
    const router = useRouter()
    const [searchTitle, setSearchTitle] = useState('')
    const [searchLocation, setSearchLocation] = useState('')
    const [featuredJobs, setFeaturedJobs] = useState<JobType[]>([])
    const [loadingJobs, setLoadingJobs] = useState(true)

    useEffect(() => {
        let mounted = true

        const loadFeaturedJobs = async () => {
            setLoadingJobs(true)
            try {
                const response = await apiGetJobs<any>({
                    sortBy: 'createdAt',
                    sortOrder: 'desc',
                })
                if (!mounted) return
                setFeaturedJobs(normalizeJobsResponse(response).slice(0, 6))
            } catch (error) {
                if (!mounted) return
                console.error('Failed to load featured jobs:', error)
                setFeaturedJobs([])
            } finally {
                if (mounted) setLoadingJobs(false)
            }
        }

        void loadFeaturedJobs()

        return () => {
            mounted = false
        }
    }, [])

    const categories = [
        {
            title: 'Tech & Engineering',
            keyword: 'engineering',
            jobsCount: '1,245 open roles',
            icon: <PiCodeDuotone className="text-3xl" />,
            className:
                'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-300',
        },
        {
            title: 'UI/UX & Design',
            keyword: 'design',
            jobsCount: '854 open roles',
            icon: <PiPaletteDuotone className="text-3xl" />,
            className:
                'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-300',
        },
        {
            title: 'Product & Growth',
            keyword: 'product',
            jobsCount: '620 open roles',
            icon: <PiBriefcaseDuotone className="text-3xl" />,
            className:
                'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-300',
        },
        {
            title: 'People & Operations',
            keyword: 'operations',
            jobsCount: '342 open roles',
            icon: <PiUsersThreeDuotone className="text-3xl" />,
            className:
                'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-300',
        },
    ]

    const handleSearch = () => {
        const params = new URLSearchParams()
        if (searchTitle.trim()) params.set('searchTerm', searchTitle.trim())
        if (searchLocation.trim()) params.set('location', searchLocation.trim())

        const query = params.toString()
        router.push(query ? `/jobs?${query}` : '/jobs')
    }

    const stats = useMemo(
        () => [
            { label: 'Live roles', value: '10,000+' },
            { label: 'Top employers', value: '500+' },
            { label: 'Applications sent', value: '1.2M+' },
        ],
        [],
    )

    return (
        <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
            <div className="absolute inset-x-0 top-0 h-[540px] pointer-events-none opacity-40 dark:opacity-30">
                <div className="absolute left-[10%] top-[-8%] h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
                <div className="absolute right-[8%] top-[8%] h-96 w-96 rounded-full bg-indigo-400/15 blur-3xl" />
            </div>

            <section className="relative mx-auto flex w-full max-w-5xl items-center flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
                <div className="space-y-6 text-center">
                    <span className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/10 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary shadow-sm dark:bg-gray-900/80 dark:text-primary-subtle">
                        Public job discovery
                    </span>
                    <div className="space-y-4">
                        <h1 className="text-center max-w-3xl text-4xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-5xl lg:text-6xl">
                            Discover roles that fit the way you want to work.
                        </h1>
                        <p className="text-center max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg">
                            Search live openings, explore by skill and location,
                            and jump directly into a detailed posting with one
                            click.
                        </p>
                    </div>

                    <div className="grid gap-3.5 rounded-[28px] border border-white/70 bg-white/85 p-4 shadow-[0_10px_25px_-20px_rgba(15,23,42,0.15)] backdrop-blur dark:border-gray-800/80 dark:bg-gray-950/90 sm:p-5 lg:grid-cols-[1.2fr_1fr_auto]">
                        <label className="relative block">
                            <span className="sr-only">Search jobs</span>
                            <Input
                                value={searchTitle}
                                onChange={(e) => setSearchTitle(e.target.value)}
                                placeholder="Job title, keyword, or company"
                                className="h-12 rounded-2xl border border-gray-200 bg-white pl-11 shadow-sm transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-gray-300 dark:hover:border-gray-600 dark:border-gray-800 dark:bg-gray-900 font-semibold"
                            />
                            <PiMagnifyingGlassDuotone className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
                        </label>

                        <label className="relative block">
                            <span className="sr-only">Location</span>
                            <Input
                                value={searchLocation}
                                onChange={(e) =>
                                    setSearchLocation(e.target.value)
                                }
                                placeholder="City, state, or remote"
                                className="h-12 rounded-2xl border border-gray-200 bg-white pl-11 shadow-sm transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-gray-300 dark:hover:border-gray-600 dark:border-gray-800 dark:bg-gray-900 font-semibold"
                            />
                            <PiMapPinDuotone className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
                        </label>

                        <Button
                            variant="plain"
                            className="h-12 px-6 rounded-2xl bg-gray-950 hover:bg-gray-900 text-white font-semibold transition-all duration-300 hover:scale-[1.02] shadow-md shadow-gray-950/20 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-50 dark:shadow-white/5 border-0 flex items-center justify-center gap-2 group"
                            onClick={handleSearch}
                        >
                            Search Jobs
                            <PiArrowRightBold className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                    </div>

                    <div className="flex flex-wrap items-cente justify-center gap-3">
                        {stats.map((stat) => (
                            <Card
                                key={stat.label}
                                className="min-w-[140px] border border-gray-100 bg-white/85 px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-950/80"
                            >
                                <p className="text-2xl font-extrabold text-primary dark:text-primary-subtle">
                                    {stat.value}
                                </p>
                                <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                                    {stat.label}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative border-y border-gray-100 bg-white py-14 dark:border-gray-800 dark:bg-gray-950/40">
                <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
                    {categories.map((category) => (
                        <Link
                            key={category.title}
                            href={`/jobs?searchTerm=${encodeURIComponent(category.keyword)}`}
                            className="group rounded-3xl border border-gray-100 bg-gray-50 p-6 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900/60"
                        >
                            <div
                                className={`inline-flex rounded-2xl p-4 ${category.className}`}
                            >
                                {category.icon}
                            </div>
                            <h3 className="mt-5 text-lg font-bold text-gray-950 dark:text-white">
                                {category.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {category.jobsCount}
                            </p>
                            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary dark:text-primary-subtle">
                                Explore roles
                                <PiArrowRightBold className="transition-transform group-hover:translate-x-1" />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
                <div className="mb-8 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">
                            Latest picks
                        </p>
                        <h2 className="mt-2 text-2xl font-bold text-gray-950 dark:text-white">
                            Fresh from the public feed
                        </h2>
                    </div>
                    <Link
                        href="/jobs"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary dark:text-primary-subtle"
                    >
                        View all jobs
                        <PiArrowRightBold />
                    </Link>
                </div>

                {loadingJobs ? (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-80 animate-pulse rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950"
                            />
                        ))}
                    </div>
                ) : featuredJobs.length > 0 ? (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {featuredJobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                ) : (
                    <Card className="border border-dashed border-gray-200 bg-white p-8 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
                        No featured jobs are available at the moment.
                    </Card>
                )}
            </section>

            <section className="relative mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
                <Card className="relative overflow-hidden border border-gray-200/60 dark:border-gray-800/60 bg-gradient-to-br from-primary/5 via-white to-indigo-50/20 dark:from-gray-900/60 dark:via-gray-950/60 dark:to-gray-900/60 backdrop-blur-md px-8 py-10 shadow-2xl shadow-primary/5 sm:px-12 sm:py-12 rounded-[2.5rem]">
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(42,133,255,0.08),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_40%)]" />
                    <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between z-10">
                        <div className="space-y-3.5 max-w-2xl">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-primary dark:text-primary-subtle shadow-sm">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                Ready to take the next step?
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950 dark:text-white bg-gradient-to-r from-gray-950 via-gray-900 to-gray-800 dark:from-white dark:via-gray-100 dark:to-gray-300 bg-clip-text leading-tight">
                                Explore every open role on HireHub
                            </h2>
                            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                                Browse our full catalog of curated opportunities, refine with high-fidelity filters, and find a position that perfectly aligns with your preferences.
                            </p>
                        </div>
                        <Button
                            variant="plain"
                            className="h-12 px-7 rounded-2xl bg-gray-950 hover:bg-gray-900 text-white font-bold transition-all duration-300 hover:scale-[1.02] shadow-xl shadow-gray-950/20 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-50 dark:shadow-white/5 border-0 flex items-center justify-center gap-2 group shrink-0 self-start md:self-center"
                            onClick={() => router.push('/jobs')}
                        >
                            Browse all jobs
                            <PiArrowRightBold className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                    </div>
                </Card>
            </section>
        </div>
    )
}
