'use client'

import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui'
import {
    EXPERIENCE_OPTIONS,
    EMPLOYMENT_OPTIONS,
    REMOTE_OPTIONS,
    SALARY_OPTIONS,
    type Filters,
} from '@/features/jobs'
import {
    PiArrowsDownUpBold,
    PiBriefcaseBold,
    PiCurrencyDollarBold,
    PiGlobeBold,
    PiMapPinBold,
    PiSlidersHorizontalBold,
    PiXBold,
} from 'react-icons/pi'
import JobFilterChips from './JobFilterChips'
import type { ReactNode } from 'react'

interface Props {
    filters: Filters
    activeFilterCount: number
    totalJobs: number
    onFilterChange: (key: keyof Filters, value: string) => void
    onClearFilters: () => void
}

export default function PublicJobFilterBar({
    filters,
    activeFilterCount,
    totalJobs,
    onFilterChange,
    onClearFilters,
}: Props) {
    return (
        <Card className="relative z-30 space-y-6 border border-gray-200/60 bg-white/60 dark:bg-gray-950/40 dark:border-gray-800/60 backdrop-blur-xl shadow-xl shadow-gray-950/5 rounded-3xl p-6 md:p-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gray-400 dark:text-gray-500">
                            Explore filters
                        </p>
                    </div>
                    <h2 className="text-xl font-extrabold tracking-tight text-gray-950 dark:text-white mt-1 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-800 dark:from-white dark:via-gray-100 dark:to-gray-300 bg-clip-text">
                        Narrow down {totalJobs} public job listings
                    </h2>
                </div>
                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 dark:bg-primary/20 px-3.5 py-1.5 text-xs font-bold text-primary dark:text-primary-subtle shadow-sm">
                        <PiSlidersHorizontalBold className="text-sm" />
                        {activeFilterCount} active
                    </span>
                    {activeFilterCount > 0 && (
                        <Button
                            size="xs"
                            variant="plain"
                            className="gap-1.5 bg-gray-950 hover:bg-gray-900 text-white font-semibold shadow-md shadow-gray-950/10 transition-all duration-300 rounded-xl hover:scale-[1.02] dark:bg-white dark:text-gray-950 dark:hover:bg-gray-50 dark:shadow-white/5  flex justify-between items-center"
                            onClick={onClearFilters}
                        >
                            <PiXBold className="text-xs" />
                            Clear all
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
                <Field label="Location" icon={<PiMapPinBold />}>
                    <Input
                        value={filters.location}
                        onChange={(e) =>
                            onFilterChange('location', e.target.value)
                        }
                        placeholder="City or remote"
                        className="h-11 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-all duration-250 focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm hover:border-gray-300 dark:hover:border-gray-700 font-semibold"
                    />
                </Field>
                <Field label="Salary" icon={<PiCurrencyDollarBold />}>
                    <Select
                        value={SALARY_OPTIONS.find(
                            (option) => option.value === filters.salaryRange,
                        )}
                        options={SALARY_OPTIONS}
                        onChange={(option: any) =>
                            onFilterChange('salaryRange', option?.value ?? '')
                        }
                        placeholder="Any salary"
                        className="text-sm rounded-xl"
                    />
                </Field>
                <Field label="Experience" icon={<PiArrowsDownUpBold />}>
                    <Select
                        value={EXPERIENCE_OPTIONS.find(
                            (option) =>
                                option.value === filters.experienceLevel,
                        )}
                        options={EXPERIENCE_OPTIONS}
                        onChange={(option: any) =>
                            onFilterChange(
                                'experienceLevel',
                                option?.value ?? '',
                            )
                        }
                        placeholder="Any level"
                        className="text-sm rounded-xl"
                    />
                </Field>
                <Field label="Employment" icon={<PiBriefcaseBold />}>
                    <Select
                        value={EMPLOYMENT_OPTIONS.find(
                            (option) => option.value === filters.employmentType,
                        )}
                        options={EMPLOYMENT_OPTIONS}
                        onChange={(option: any) =>
                            onFilterChange(
                                'employmentType',
                                option?.value ?? '',
                            )
                        }
                        placeholder="Any type"
                        className="text-sm rounded-xl"
                    />
                </Field>
                <Field label="Work style" icon={<PiGlobeBold />}>
                    <Select
                        value={REMOTE_OPTIONS.find(
                            (option) => option.value === filters.remoteInfo,
                        )}
                        options={REMOTE_OPTIONS}
                        onChange={(option: any) =>
                            onFilterChange('remoteInfo', option?.value ?? '')
                        }
                        placeholder="Any setting"
                        className="text-sm rounded-xl"
                    />
                </Field>
            </div>

            <div className="mt-3">
                <JobFilterChips
                    filters={filters}
                    onRemove={onFilterChange as any}
                />
            </div>
        </Card>
    )
}

function Field({
    label,
    icon,
    children,
}: {
    label: string
    icon: ReactNode
    children: ReactNode
}) {
    return (
        <label className="space-y-2 block">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400 dark:text-gray-500">
                <span className="text-primary/70 dark:text-primary-mild/70 text-xs">
                    {icon}
                </span>
                {label}
            </span>
            <div className="relative group/field">{children}</div>
        </label>
    )
}
