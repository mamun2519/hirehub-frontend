'use client'

import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui'
import type { Filters } from '@/features/jobs'
import {
    PiMagnifyingGlassBold,
    PiMapPinBold,
    PiBriefcaseBold,
    PiArrowRightBold,
} from 'react-icons/pi'

interface Props {
    filters: Filters
    totalJobs: number
    activeFilterCount: number
    onFilterChange: (key: keyof Filters, value: string) => void
    onBrowseResults?: () => void
}

export default function JobSearchHero({
    filters,
    totalJobs,
    activeFilterCount,
    onFilterChange,
    onBrowseResults,
}: Props) {
    return (
        <Card className="relative overflow-hidden border border-gray-200/60 dark:border-gray-800/60 bg-gradient-to-br from-primary/8 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.25)] rounded-3xl">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.1),transparent_30%)]" />
            <div className="relative p-6 md:p-8 lg:p-10 space-y-6">
                <div className="space-y-4 max-w-3xl">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 dark:bg-primary/25 border border-primary/20 dark:border-primary/30 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-primary dark:text-primary-subtle shadow-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                        Public job search
                    </span>
                    <div className="space-y-2.5">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-950 dark:text-white bg-gradient-to-r from-gray-950 via-gray-900 to-gray-800 dark:from-white dark:via-gray-100 dark:to-gray-300 bg-clip-text leading-tight sm:leading-none">
                            Find your next role without logging in.
                        </h1>
                        <p className="max-w-2xl text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                            Search live listings, narrow by location and work
                            style, and jump straight into the details page when
                            a role feels right.
                        </p>
                    </div>
                </div>

                <div className="grid gap-3.5 lg:grid-cols-[1.2fr_1fr_auto]">
                    <label className="relative block">
                        <span className="sr-only">Search jobs</span>
                        <Input
                            value={filters.searchText}
                            onChange={(e) =>
                                onFilterChange('searchText', e.target.value)
                            }
                            placeholder="Search title, skill, or company"
                            className="h-12 pl-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-gray-300 dark:hover:border-gray-700 font-semibold"
                        />
                        <PiMagnifyingGlassBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
                    </label>

                    <label className="relative block">
                        <span className="sr-only">Location</span>
                        <Input
                            value={filters.location}
                            onChange={(e) =>
                                onFilterChange('location', e.target.value)
                            }
                            placeholder="Location or remote"
                            className="h-12 pl-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-gray-300 dark:hover:border-gray-700 font-semibold"
                        />
                        <PiMapPinBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
                    </label>

                    <Button
                        variant="plain"
                        className="h-12 px-6 rounded-2xl bg-gray-950 hover:bg-gray-900 text-white font-semibold transition-all duration-300 hover:scale-[1.02] shadow-xl shadow-gray-950/20 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-50 dark:shadow-white/5 border-0 flex items-center justify-center gap-2 group"
                        onClick={onBrowseResults}
                    >
                        Browse Jobs
                        <PiArrowRightBold className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-gray-900/60 px-4 py-1.5 border border-gray-200/50 dark:border-gray-800/80 shadow-sm font-semibold">
                        <PiBriefcaseBold className="text-primary text-base" />
                        <span>{totalJobs} open roles</span>
                    </span>
                    {activeFilterCount > 0 && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 px-4 py-1.5 font-bold shadow-sm text-xs">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {activeFilterCount} active filter
                            {activeFilterCount === 1 ? '' : 's'}
                        </span>
                    )}
                </div>
            </div>
        </Card>
    )
}
