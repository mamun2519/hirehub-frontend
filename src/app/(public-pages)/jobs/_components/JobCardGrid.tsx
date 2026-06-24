'use client'

import { Card, Pagination } from '@/components/ui'
import type { JobType } from '@/features/jobs'
import JobCard from './JobCard'

interface Props {
    jobs: JobType[]
    currentPage: number
    pageSize: number
    totalJobs: number
    onPageChange: (page: number) => void
}

export default function JobCardGrid({
    jobs,
    currentPage,
    pageSize,
    totalJobs,
    onPageChange,
}: Props) {
    if (jobs.length === 0) {
        return (
            <div className="text-xs font-mono text-gray-400 p-4">
                []
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>

            {totalJobs > pageSize && (
                <Pagination
                    className="justify-center"
                    displayTotal
                    total={totalJobs}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onChange={onPageChange}
                />
            )}
        </div>
    )
}
