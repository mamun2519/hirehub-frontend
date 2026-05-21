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
            <Card className="border border-dashed border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-950">
                <h3 className="text-lg font-bold text-gray-950 dark:text-white">
                    No jobs found
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Try clearing a filter or searching with a different keyword.
                </p>
            </Card>
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
