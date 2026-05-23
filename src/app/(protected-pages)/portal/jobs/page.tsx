'use client'

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Card, Notification, toast, Alert, Spinner } from '@/components/ui'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { PiBuildingsBold } from 'react-icons/pi'
import ApiService from '@/services/ApiService'
import { apiGetJobs, apiDeleteJob } from '@/services/JobService'
import dayjs from 'dayjs'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import { ADMIN } from '@/constants/roles.constant'

// ─── Components ───────────────────────────────────────────────────────────────
import JobsHeroBanner from './_components/JobsHeroBanner'
import JobsKpiCards from './_components/JobsKpiCards'
import JobFilterBar from './_components/JobFilterBar'
import JobFilterPanel from './_components/JobFilterPanel'
import JobFilterChips from './_components/JobFilterChips'
import JobsTable from './_components/JobsTable'
import JobDeleteDialog from './_components/JobDeleteDialog'

// ─── Types & Constants ────────────────────────────────────────────────────────
import {
    type JobType,
    type Filters,
    type KpiData,
    EMPTY_FILTERS,
    countActiveFilters,
} from './_components/types'

// ─────────────────────────────────────────────────────────────────────────────
export default function ManageJobsPage() {
    const { session } = useCurrentSession()
    const role = session?.user?.authority?.[0] || 'candidate'

    // ── Core state ────────────────────────────────────────────────────────────
    const [loading, setLoading] = useState(true)
    const [jobs, setJobs] = useState<JobType[]>([])
    const [recruiterId, setRecruiterId] = useState<string | null>(null)
    const [noProfile, setNoProfile] = useState(false)
    const [error, setError] = useState('')

    // ── Filter / table state ──────────────────────────────────────────────────
    const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
    const [showFilters, setShowFilters] = useState(false)
    const [tableLoading, setTableLoading] = useState(false)
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    // ── Delete dialog state ───────────────────────────────────────────────────
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [jobToDelete, setJobToDelete] = useState<JobType | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // ── Fetch: server-side filtered jobs ──────────────────────────────────────
    const fetchJobs = useCallback(
        async (rId: string | null, currentFilters: Filters) => {
            setTableLoading(true)
            try {
                const params: Record<string, any> = {}
                if (rId) {
                    params.recruiterId = rId
                }

                if (currentFilters.searchText.trim())
                    params.searchTerm = currentFilters.searchText.trim()
                if (currentFilters.location.trim())
                    params.location = currentFilters.location.trim()
                if (currentFilters.salaryRange)
                    params.salaryRange = currentFilters.salaryRange
                if (currentFilters.experienceLevel)
                    params.experienceLevel = currentFilters.experienceLevel
                if (currentFilters.employmentType)
                    params.employmentType = currentFilters.employmentType
                if (currentFilters.remoteInfo)
                    params.remoteInfo = currentFilters.remoteInfo

                const response = await apiGetJobs<any>(params)
                const responseData = response?.data
                const rawJobs = responseData?.data ?? responseData
                setJobs(Array.isArray(rawJobs) ? rawJobs : [])
            } catch (err) {
                console.error('Failed to fetch jobs:', err)
            } finally {
                setTableLoading(false)
            }
        },
        [],
    )

    // ── Fetch: recruiter profile → then initial jobs ───────────────────────────
    const loadRecruiterAndJobs = useCallback(async () => {
        setLoading(true)
        setError('')
        setNoProfile(false)
        try {
            if (role === ADMIN) {
                await fetchJobs(null, EMPTY_FILTERS)
            } else {
                const profileRes = await ApiService.triggerApiSync<any>({
                    url: '/profile',
                    method: 'get',
                })

                if (profileRes?.data?.id) {
                    const rId = profileRes.data.id
                    setRecruiterId(rId)
                    await fetchJobs(rId, EMPTY_FILTERS)
                } else {
                    setNoProfile(true)
                }
            }
        } catch (err) {
            console.error('Failed to load profile/jobs:', err)
            setError(
                'Could not retrieve your jobs dashboard. Please try again.',
            )
        } finally {
            setLoading(false)
        }
    }, [fetchJobs, role])

    useEffect(() => {
        if (session) {
            loadRecruiterAndJobs()
        }
    }, [loadRecruiterAndJobs, session])

    // ── Debounced refetch on filter change ────────────────────────────────────
    const triggerDebouncedFetch = useCallback(
        (next: Filters) => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current)
            debounceTimer.current = setTimeout(() => {
                if (role === ADMIN) {
                    setPageIndex(1)
                    fetchJobs(null, next)
                } else if (recruiterId) {
                    setPageIndex(1)
                    fetchJobs(recruiterId, next)
                }
            }, 450)
        },
        [recruiterId, role, fetchJobs],
    )

    // ── Filter handlers ───────────────────────────────────────────────────────
    const handleFilterChange = (key: keyof Filters, value: string) => {
        const next = { ...filters, [key]: value }
        setFilters(next)
        triggerDebouncedFetch(next)
    }

    const handleRemoveFilter = (key: keyof Filters) =>
        handleFilterChange(key, '')

    const handleClearFilters = () => {
        setFilters(EMPTY_FILTERS)
        setPageIndex(1)
        if (role === ADMIN) {
            fetchJobs(null, EMPTY_FILTERS)
        } else if (recruiterId) {
            fetchJobs(recruiterId, EMPTY_FILTERS)
        }
    }

    // ── Delete handlers ───────────────────────────────────────────────────────
    const handleDeleteClick = (job: JobType) => {
        setJobToDelete(job)
        setDeleteDialogOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!jobToDelete) return
        setIsDeleting(true)
        try {
            await apiDeleteJob(jobToDelete.id)
            toast.push(
                <Notification title="Job deleted!" type="success">
                    The job post &quot;{jobToDelete.title}&quot; has been
                    successfully removed.
                </Notification>,
            )
            if (role === ADMIN) {
                await fetchJobs(null, filters)
            } else if (recruiterId) {
                await fetchJobs(recruiterId, filters)
            }
        } catch {
            toast.push(
                <Notification title="Action Failed" type="danger">
                    An error occurred while deleting the job post.
                </Notification>,
            )
        } finally {
            setIsDeleting(false)
            setDeleteDialogOpen(false)
            setJobToDelete(null)
        }
    }

    // ── Derived: pagination slice ─────────────────────────────────────────────
    const paginatedJobs = useMemo(() => {
        const start = (pageIndex - 1) * pageSize
        return jobs.slice(start, start + pageSize)
    }, [jobs, pageIndex, pageSize])

    // ── Derived: KPI metrics ──────────────────────────────────────────────────
    const kpis = useMemo<KpiData>(() => {
        const totalActive = jobs.length
        const totalVacancies = jobs.reduce(
            (sum, job) => sum + (job.vacancyCount || 0),
            0,
        )
        const upcoming = jobs
            .map((j) => dayjs(j.applicationDeadline))
            .filter((d) => d.isAfter(dayjs()))
            .sort((a, b) => (a.isBefore(b) ? -1 : 1))

        const nearestDeadline =
            upcoming.length > 0
                ? upcoming[0].format('MMM DD, YYYY')
                : 'No upcoming deadlines'

        return { totalActive, totalVacancies, nearestDeadline }
    }, [jobs])

    // ── Derived: active filter count ──────────────────────────────────────────
    const activeFilterCount = useMemo(
        () => countActiveFilters(filters),
        [filters],
    )

    // ── Guard screens ─────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Spinner size="lg" className="text-indigo-600" />
                <span className="text-sm font-medium text-gray-500 animate-pulse">
                    Loading Recruiter Jobs Dashboard...
                </span>
            </div>
        )
    }

    if (noProfile) {
        return (
            <div className="max-w-4xl mx-auto p-4 md:p-6 flex flex-col gap-6">
                <Alert
                    type="warning"
                    showIcon
                    title="Company Profile Required"
                    className="border border-amber-100 bg-amber-50/50 rounded-2xl"
                >
                    To manage and publish job opportunities, you must first
                    establish your Recruiter details and company identity.
                    Please navigate to settings to configure your profile.
                </Alert>
                <div className="flex justify-center mt-4">
                    <Link href="/portal/settings">
                        <Button
                            variant="solid"
                            className="bg-primary text-white rounded-lg px-6 py-2 flex items-center gap-2"
                        >
                            <PiBuildingsBold className="text-lg" />
                            Setup Company Profile
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    // ── Main layout ───────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto">
            <JobsHeroBanner role={role} />

            {error && (
                <Alert
                    type="danger"
                    showIcon
                    closable
                    onClose={() => setError('')}
                >
                    {error}
                </Alert>
            )}

            <JobsKpiCards kpis={kpis} />

            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl p-4 md:p-6">
                <div className="flex flex-col gap-5">
                    <JobFilterBar
                        filters={filters}
                        showFilters={showFilters}
                        activeFilterCount={activeFilterCount}
                        totalJobs={jobs.length}
                        onFilterChange={handleFilterChange}
                        onToggleFilters={() => setShowFilters((v) => !v)}
                        onClearFilters={handleClearFilters}
                    />

                    {showFilters && (
                        <JobFilterPanel
                            filters={filters}
                            onFilterChange={handleFilterChange}
                        />
                    )}

                    <JobFilterChips
                        filters={filters}
                        onRemove={handleRemoveFilter}
                    />

                    <JobsTable
                        jobs={jobs}
                        paginatedJobs={paginatedJobs}
                        loading={tableLoading}
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                        onPaginationChange={setPageIndex}
                        onPageSizeChange={(size) => {
                            setPageSize(size)
                            setPageIndex(1)
                        }}
                        onDeleteClick={handleDeleteClick}
                        role={role}
                    />
                </div>
            </Card>

            <JobDeleteDialog
                isOpen={deleteDialogOpen}
                job={jobToDelete}
                isDeleting={isDeleting}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    )
}
