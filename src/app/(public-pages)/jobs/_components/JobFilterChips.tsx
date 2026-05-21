'use client'

import { SALARY_OPTIONS, type Filters } from '@/features/jobs'
import { PiXBold } from 'react-icons/pi'

interface Props {
    filters: Filters
    onRemove: (key: keyof Filters) => void
}

export default function JobFilterChips({ filters, onRemove }: Props) {
    const hasActive =
        filters.searchText ||
        filters.location ||
        filters.salaryRange ||
        filters.experienceLevel ||
        filters.employmentType ||
        filters.remoteInfo

    if (!hasActive) return null

    return (
        <div className="flex flex-wrap gap-2">
            {filters.searchText && (
                <Chip
                    label={`Search: ${filters.searchText}`}
                    onRemove={() => onRemove('searchText')}
                />
            )}
            {filters.location && (
                <Chip
                    label={`Location: ${filters.location}`}
                    onRemove={() => onRemove('location')}
                />
            )}
            {filters.salaryRange && (
                <Chip
                    label={`Salary: ${
                        SALARY_OPTIONS.find(
                            (option) => option.value === filters.salaryRange,
                        )?.label ?? filters.salaryRange
                    }`}
                    onRemove={() => onRemove('salaryRange')}
                />
            )}
            {filters.experienceLevel && (
                <Chip
                    label={`Experience: ${filters.experienceLevel}`}
                    onRemove={() => onRemove('experienceLevel')}
                />
            )}
            {filters.employmentType && (
                <Chip
                    label={`Type: ${filters.employmentType}`}
                    onRemove={() => onRemove('employmentType')}
                />
            )}
            {filters.remoteInfo && (
                <Chip
                    label={`Setting: ${filters.remoteInfo}`}
                    onRemove={() => onRemove('remoteInfo')}
                />
            )}
        </div>
    )
}

function Chip({
    label,
    onRemove,
}: {
    label: string
    onRemove: () => void
}) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary dark:text-primary-subtle dark:border-primary/30 dark:bg-primary/15">
            {label}
            <button
                type="button"
                onClick={onRemove}
                className="rounded-full p-0.5 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
                aria-label={`Remove ${label}`}
            >
                <PiXBold className="text-[10px]" />
            </button>
        </span>
    )
}
