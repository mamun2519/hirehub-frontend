import { useMemo } from 'react'
import Link from 'next/link'
import { Tag, Badge, Button } from '@/components/ui'
import DataTable, { ColumnDef } from '@/components/shared/DataTable'
import {
    PiMapPinBold,
    PiCurrencyDollarBold,
    PiPencilSimpleBold,
    PiTrashBold,
} from 'react-icons/pi'
import dayjs from 'dayjs'
import type { JobType } from './types'

interface Props {
    jobs: JobType[]
    paginatedJobs: JobType[]
    loading: boolean
    pageIndex: number
    pageSize: number
    onPaginationChange: (page: number) => void
    onPageSizeChange: (size: number) => void
    onDeleteClick: (job: JobType) => void
}

export default function JobsTable({
    jobs,
    paginatedJobs,
    loading,
    pageIndex,
    pageSize,
    onPaginationChange,
    onPageSizeChange,
    onDeleteClick,
}: Props) {
    const columns = useMemo<ColumnDef<JobType>[]>(
        () => [
            {
                header: 'Job Title',
                accessorKey: 'title',
                enableSorting: false,
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex flex-col gap-1 py-1">
                            <span className="font-semibold text-gray-900 dark:text-gray-200 text-sm">
                                {row.title}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                <PiMapPinBold className="text-[10px]" />
                                {row.location}
                            </span>
                        </div>
                    )
                },
            },
            {
                header: 'Workplace',
                accessorKey: 'employmentType',
                enableSorting: false,
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex flex-wrap gap-1">
                            <Tag className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-none font-semibold text-[10px] uppercase tracking-wide px-2 py-0.5 rounded">
                                {row.employmentType}
                            </Tag>
                            <Tag className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-none font-semibold text-[10px] uppercase tracking-wide px-2 py-0.5 rounded">
                                {row.remoteInfo}
                            </Tag>
                        </div>
                    )
                },
            },
            {
                header: 'Experience',
                accessorKey: 'experienceLevel',
                enableSorting: false,
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <Tag className="bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 border-none font-semibold text-[10px] uppercase tracking-wide px-2 py-0.5 rounded">
                            {row.experienceLevel}
                        </Tag>
                    )
                },
            },
            {
                header: 'Salary',
                accessorKey: 'salaryRange',
                enableSorting: false,
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
                            <PiCurrencyDollarBold className="text-sm" />
                            {row.salaryRange || '—'}
                        </span>
                    )
                },
            },
            {
                header: 'Vacancies',
                accessorKey: 'vacancyCount',
                enableSorting: false,
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <Badge
                            className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold px-2 py-1 text-xs rounded border-none"
                            content={`${row.vacancyCount} Open`}
                        />
                    )
                },
            },
            {
                header: 'Deadline',
                accessorKey: 'applicationDeadline',
                cell: (props) => {
                    const row = props.row.original
                    const deadline = dayjs(row.applicationDeadline)
                    const isPassed = deadline.isBefore(dayjs(), 'day')
                    return (
                        <span
                            className={`text-xs font-semibold ${
                                isPassed
                                    ? 'text-rose-500'
                                    : 'text-gray-500 dark:text-gray-400'
                            }`}
                        >
                            {deadline.format('MMM DD, YYYY')}
                            {isPassed && ' (Expired)'}
                        </span>
                    )
                },
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center gap-2">
                            <Link href={`/portal/jobs/edit/${row.id}`}>
                                <Button
                                    size="sm"
                                    className="p-1.5 h-8 w-8 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    title="Edit Job"
                                >
                                    <PiPencilSimpleBold className="text-gray-500 hover:text-indigo-600 text-sm" />
                                </Button>
                            </Link>

                            <Button
                                size="sm"
                                className="p-1.5 h-8 w-8 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-rose-950/20"
                                onClick={() => onDeleteClick(row)}
                                title="Delete Job"
                            >
                                <PiTrashBold className="text-gray-500 hover:text-rose-600 text-sm" />
                            </Button>
                        </div>
                    )
                },
            },
        ],
        [onDeleteClick],
    )

    return (
        <DataTable
            columns={columns}
            data={paginatedJobs}
            loading={loading}
            noData={jobs.length === 0}
            pagingData={{ total: jobs.length, pageIndex, pageSize }}
            onPaginationChange={onPaginationChange}
            onSelectChange={(val) => {
                onPageSizeChange(val)
            }}
        />
    )
}
