'use client'

import { Button, Tag } from '@/components/ui'
import DataTable, { ColumnDef } from '@/components/shared/DataTable'
import {
    PiEyeDuotone,
    PiMapPinBold,
    PiBriefcaseBold,
} from 'react-icons/pi'
import dayjs from 'dayjs'
import type { ApplicationResponse } from '@/features/applications'

const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    under_review: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    shortlisted: 'bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800',
    interview_scheduled: 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
    offered: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    rejected: 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
}

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    under_review: 'Under Review',
    shortlisted: 'Shortlisted',
    interview_scheduled: 'Interview Scheduled',
    offered: 'Offered 🎉',
    rejected: 'Not Selected',
}

interface Props {
    applications: ApplicationResponse[]
    loading: boolean
    pageIndex: number
    pageSize: number
    onPaginationChange: (page: number) => void
    onPageSizeChange: (size: number) => void
    onViewStatus: (application: ApplicationResponse) => void
    isRecruiterOrAdmin: boolean
}

export default function ApplicationsTable({
    applications,
    loading,
    pageIndex,
    pageSize,
    onPaginationChange,
    onPageSizeChange,
    onViewStatus,
    isRecruiterOrAdmin,
}: Props) {
    const columns: ColumnDef<ApplicationResponse>[] = [
        {
            header: 'Job Title',
            accessorKey: 'job.title',
            enableSorting: false,
            cell: (props) => {
                const row = props.row.original
                return (
                    <div className="flex flex-col gap-1 py-1">
                        <span className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-tight">
                            {row.job?.title ?? '—'}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <PiMapPinBold className="text-[10px]" />
                            {row.job?.location ?? '—'}
                        </span>
                    </div>
                )
            },
        },
        ...(isRecruiterOrAdmin
            ? [
                  {
                      header: 'Applicant',
                      accessorKey: 'fullName',
                      enableSorting: false,
                      cell: (props: any) => {
                          const row = props.row.original as ApplicationResponse
                          return (
                              <div className="flex flex-col gap-0.5">
                                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{row.fullName}</span>
                                  <span className="text-xs text-gray-400">{row.email}</span>
                              </div>
                          )
                      },
                  },
              ]
            : []),
        {
            header: 'Type',
            accessorKey: 'job.employmentType',
            enableSorting: false,
            cell: (props) => {
                const row = props.row.original
                return (
                    <div className="flex flex-col gap-1">
                        <Tag className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-none text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded">
                            {row.job?.employmentType ?? '—'}
                        </Tag>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <PiBriefcaseBold className="text-[9px]" />
                            {row.job?.experienceLevel ?? '—'}
                        </span>
                    </div>
                )
            },
        },
        {
            header: 'Applied On',
            accessorKey: 'createdAt',
            enableSorting: false,
            cell: (props) => {
                const row = props.row.original
                return (
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {dayjs(row.createdAt).format('MMM DD, YYYY')}
                    </span>
                )
            },
        },
        {
            header: 'Status',
            accessorKey: 'status',
            enableSorting: false,
            cell: (props) => {
                const row = props.row.original
                const style = STATUS_STYLES[row.status] ?? 'bg-gray-100 text-gray-700 border-gray-200'
                return (
                    <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${style}`}
                    >
                        {STATUS_LABELS[row.status] ?? row.status}
                    </span>
                )
            },
        },
        {
            header: 'Action',
            id: 'actions',
            cell: (props) => {
                const row = props.row.original
                return (
                    <Button
                        size="sm"
                        variant="plain"
                        className="flex items-center gap-1.5 text-xs font-bold border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg px-3 py-1.5 h-auto transition-all"
                        onClick={() => onViewStatus(row)}
                    >
                        <PiEyeDuotone className="text-indigo-500 text-sm" />
                        {isRecruiterOrAdmin ? 'Review' : 'View Status'}
                    </Button>
                )
            },
        },
    ]

    return (
        <DataTable
            columns={columns}
            data={applications.slice(0, pageSize)}
            loading={loading}
            noData={applications.length === 0}
            pagingData={{ total: applications.length, pageIndex, pageSize }}
            onPaginationChange={onPaginationChange}
            onSelectChange={onPageSizeChange}
        />
    )
}
