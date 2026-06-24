'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Alert, Card, Input, Select, Spinner } from '@/components/ui'
import { PiMagnifyingGlassDuotone, PiFileTextDuotone } from 'react-icons/pi'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import { apiGetApplications } from '@/services/ApplicationService'
import type { ApplicationResponse } from '@/features/applications'

// ── Sub-components ─────────────────────────────────────────────────────────
import ApplicationsHeroBanner from './_components/ApplicationsHeroBanner'
import ApplicationsKpiCards from './_components/ApplicationsKpiCards'
import ApplicationsTable from './_components/ApplicationsTable'
import ApplicationMobileCard from './_components/ApplicationMobileCard'
import ApplicationStatusDialog from './_components/ApplicationStatusDialog'

const STATUS_FILTER_OPTIONS = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'interview_scheduled', label: 'Interview Scheduled' },
    { value: 'offered', label: 'Offered' },
    { value: 'rejected', label: 'Not Selected' },
    { value: 'accepted', label: 'Accepted' },
]

export default function ApplicationsPage() {
    const { session } = useCurrentSession()
    const role = session?.user?.authority?.[0] ?? 'candidate'
    const isRecruiterOrAdmin = role === 'recruiter' || role === 'admin'
    const userName =
        session?.user?.name || session?.user?.email?.split('@')[0] || ''

    // ── State ──────────────────────────────────────────────────────────────
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [applications, setApplications] = useState<ApplicationResponse[]>([])
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize] = useState(3)

    // Dialog state
    const [selectedApp, setSelectedApp] = useState<ApplicationResponse | null>(
        null,
    )
    const [dialogOpen, setDialogOpen] = useState(false)

    // ── Fetch ──────────────────────────────────────────────────────────────
    const fetchApplications = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const response = await apiGetApplications<any>()
            const raw = response?.data ?? response
            setApplications(Array.isArray(raw) ? raw : [])
        } catch (err: any) {
            console.error('Failed to fetch applications:', err)
            setError(
                err?.response?.data?.message ??
                    'Could not load applications. Please try again.',
            )
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (session?.user?.id) {
            fetchApplications()
        }
    }, [session?.user?.id, fetchApplications])

    // ── Filtering ──────────────────────────────────────────────────────────
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        return applications.filter((app) => {
            const matchesSearch =
                !q ||
                app.job?.title?.toLowerCase().includes(q) ||
                app.fullName?.toLowerCase().includes(q) ||
                app.job?.location?.toLowerCase().includes(q) ||
                app.applicationId?.toLowerCase().includes(q)
            const matchesStatus = !statusFilter || app.status === statusFilter
            return matchesSearch && matchesStatus
        })
    }, [applications, search, statusFilter])

    // reset page on filter change
    useEffect(() => {
        setPageIndex(1)
    }, [search, statusFilter])

    // ── Dialog Handlers ────────────────────────────────────────────────────
    const handleViewStatus = (app: ApplicationResponse) => {
        setSelectedApp(app)
        setDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setDialogOpen(false)
        setSelectedApp(null)
    }

    const handleStatusUpdated = (id: string, newStatus: string) => {
        setApplications((prev) =>
            prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
        )
        // Also update selectedApp so the dialog reflects the change in real-time
        setSelectedApp((prev) =>
            prev && prev.id === id ? { ...prev, status: newStatus } : prev,
        )
    }

    // ── Loading guard ──────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Spinner size="lg" className="text-indigo-600" />
                <span className="text-sm font-medium text-gray-500 animate-pulse">
                    Loading applications…
                </span>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto">
            {/* Hero banner */}
            <ApplicationsHeroBanner
                userName={userName}
                isRecruiterOrAdmin={isRecruiterOrAdmin}
            />

            {/* Error alert */}
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

            {/* KPI Cards */}
            <ApplicationsKpiCards
                applications={applications}
                isRecruiterOrAdmin={isRecruiterOrAdmin}
            />

            {/* Main content card */}
            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl">
                <div className="flex flex-col gap-5">
                    {/* Filters row */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Result count badge */}
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-3.25 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-semibold text-gray-500 dark:text-gray-400 flex-shrink-0">
                            <PiFileTextDuotone className="text-indigo-400 text-sm" />
                            {filtered.length} result
                            {filtered.length !== 1 ? 's' : ''}
                        </div>
                        {/* Search */}
                        <div className="relative flex-1">
                            <PiMagnifyingGlassDuotone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
                            <Input
                                id="applications-search"
                                placeholder={
                                    isRecruiterOrAdmin
                                        ? 'Search by job, candidate or ID…'
                                        : 'Search by job title, location or ID…'
                                }
                                className="pl-9 pr-4 h-10 text-sm rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Status filter */}
                        <Select
                            id="applications-status-filter"
                            className="min-w-[180px] flex-shrink-0"
                            options={STATUS_FILTER_OPTIONS}
                            value={
                                STATUS_FILTER_OPTIONS.find(
                                    (o) => o.value === statusFilter,
                                ) ?? STATUS_FILTER_OPTIONS[0]
                            }
                            onChange={(opt) =>
                                setStatusFilter(
                                    (opt as (typeof STATUS_FILTER_OPTIONS)[0])
                                        ?.value ?? '',
                                )
                            }
                            isSearchable={false}
                            placeholder="All Statuses"
                        />
                    </div>

                    {/* Empty state */}
                    {filtered.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center">
                                <PiFileTextDuotone className="text-indigo-400 text-3xl" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                                    {search || statusFilter
                                        ? 'No matching applications found'
                                        : isRecruiterOrAdmin
                                          ? 'No applications received yet'
                                          : "You haven't applied to any jobs yet"}
                                </p>
                                <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                                    {search || statusFilter
                                        ? 'Try adjusting your search or status filter.'
                                        : isRecruiterOrAdmin
                                          ? 'Applications submitted to your jobs will appear here.'
                                          : 'Browse the job listings and start applying!'}
                                </p>
                            </div>
                        </div>
                    )}

                    {filtered.length > 0 && (
                        <>
                            {/* Desktop table — hidden on mobile */}
                            <div className="hidden md:block">
                                <ApplicationsTable
                                    applications={filtered}
                                    loading={false}
                                    pageIndex={pageIndex}
                                    pageSize={pageSize}
                                    onPaginationChange={setPageIndex}
                                    onPageSizeChange={(size) => {
                                        // pageSize is fixed but kept for API compatibility
                                        setPageIndex(1)
                                    }}
                                    onViewStatus={handleViewStatus}
                                    isRecruiterOrAdmin={isRecruiterOrAdmin}
                                />
                            </div>

                            {/* Mobile cards — hidden on md+ */}
                            <div className="flex flex-col gap-3 md:hidden">
                                {filtered
                                    .slice(
                                        (pageIndex - 1) * pageSize,
                                        pageIndex * pageSize,
                                    )
                                    .map((app) => (
                                        <ApplicationMobileCard
                                            key={app.id}
                                            application={app}
                                            isRecruiterOrAdmin={
                                                isRecruiterOrAdmin
                                            }
                                            onViewStatus={handleViewStatus}
                                        />
                                    ))}

                                {/* Mobile pagination */}
                                {filtered.length > pageSize && (
                                    <div className="flex items-center justify-between pt-2">
                                        <button
                                            onClick={() =>
                                                setPageIndex((p) =>
                                                    Math.max(1, p - 1),
                                                )
                                            }
                                            disabled={pageIndex === 1}
                                            className="px-4 py-2 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                                        >
                                            ← Prev
                                        </button>
                                        <span className="text-xs text-gray-400 font-semibold">
                                            Page {pageIndex} of{' '}
                                            {Math.ceil(
                                                filtered.length / pageSize,
                                            )}
                                        </span>
                                        <button
                                            onClick={() =>
                                                setPageIndex((p) =>
                                                    Math.min(
                                                        Math.ceil(
                                                            filtered.length /
                                                                pageSize,
                                                        ),
                                                        p + 1,
                                                    ),
                                                )
                                            }
                                            disabled={
                                                pageIndex >=
                                                Math.ceil(
                                                    filtered.length / pageSize,
                                                )
                                            }
                                            className="px-4 py-2 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                                        >
                                            Next →
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </Card>

            {/* Application Details Dialog */}
            <ApplicationStatusDialog
                application={selectedApp}
                isOpen={dialogOpen}
                isRecruiter={role === 'recruiter'}
                onClose={handleCloseDialog}
                onStatusUpdated={handleStatusUpdated}
            />
        </div>
    )
}
