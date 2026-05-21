'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import debounce from 'lodash/debounce'
import { Alert, Spinner } from '@/components/ui'
import { apiGetJobs } from '@/services/JobService'
import {
    EMPTY_FILTERS,
    countActiveFilters,
    buildJobsQueryParams,
    type Filters,
    type JobType,
} from '@/features/jobs'
import JobSearchHero from './_components/JobSearchHero'
import PublicJobFilterBar from './_components/PublicJobFilterBar'
import JobCardGrid from './_components/JobCardGrid'

const DEFAULT_PAGE_SIZE = 12
const DEFAULT_SORT_BY = 'createdAt'
const DEFAULT_SORT_ORDER = 'desc'

type JobsData = {
    meta?: {
        page?: number
        limit?: number
        total?: number
    }
    data?: JobType[]
}

type JobsResponseEnvelope = {
    data?: JobsData
}

const normalizeFiltersFromSearchParams = (searchParams: URLSearchParams) => {
    const next: Filters = { ...EMPTY_FILTERS }
    const searchText =
        searchParams.get('searchTerm') ?? searchParams.get('searchText')
    if (searchText) next.searchText = searchText
    const location = searchParams.get('location')
    if (location) next.location = location
    const salaryRange = searchParams.get('salaryRange')
    if (salaryRange) next.salaryRange = salaryRange
    const experienceLevel = searchParams.get('experienceLevel')
    if (experienceLevel) next.experienceLevel = experienceLevel
    const employmentType = searchParams.get('employmentType')
    if (employmentType) next.employmentType = employmentType
    const remoteInfo = searchParams.get('remoteInfo')
    if (remoteInfo) next.remoteInfo = remoteInfo
    return next
}

const normalizePageFromSearchParams = (searchParams: URLSearchParams) => {
    const raw = Number(searchParams.get('page') ?? 1)
    return Number.isFinite(raw) && raw > 0 ? raw : 1
}

const normalizePageSizeFromSearchParams = (searchParams: URLSearchParams) => {
    const raw = Number(searchParams.get('limit') ?? DEFAULT_PAGE_SIZE)
    return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_PAGE_SIZE
}

const normalizeSortByFromSearchParams = (searchParams: URLSearchParams) => {
    const sortBy = searchParams.get('sortBy') ?? DEFAULT_SORT_BY
    return sortBy.trim() || DEFAULT_SORT_BY
}

const normalizeSortOrderFromSearchParams = (searchParams: URLSearchParams) => {
    const sortOrder = searchParams.get('sortOrder') ?? DEFAULT_SORT_ORDER
    return sortOrder.trim() || DEFAULT_SORT_ORDER
}

const buildPublicJobsQuery = (
    filters: Filters,
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: string,
) =>
    buildJobsQueryParams({
        filters,
        page,
        limit,
        sortBy,
        sortOrder,
    })

const pushJobsQuery = (
    router: ReturnType<typeof useRouter>,
    filters: Filters,
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: string,
) => {
    const query = new URLSearchParams(
        buildPublicJobsQuery(filters, page, limit, sortBy, sortOrder),
    )
    const nextQuery = query.toString()
    router.replace(nextQuery ? `/jobs?${nextQuery}` : '/jobs', {
        scroll: false,
    })
}

export default function PublicJobsPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const searchParamsString = searchParams.toString()

    const parsedSearchParams = new URLSearchParams(searchParamsString)
    const [draftFilters, setDraftFilters] = useState<Filters>(() =>
        normalizeFiltersFromSearchParams(parsedSearchParams),
    )
    const [appliedFilters, setAppliedFilters] = useState<Filters>(() =>
        normalizeFiltersFromSearchParams(parsedSearchParams),
    )
    const [currentPage, setCurrentPage] = useState(() =>
        normalizePageFromSearchParams(parsedSearchParams),
    )
    const [pageSize] = useState(() =>
        normalizePageSizeFromSearchParams(parsedSearchParams),
    )
    const [sortBy] = useState(() =>
        normalizeSortByFromSearchParams(parsedSearchParams),
    )
    const [sortOrder] = useState(() =>
        normalizeSortOrderFromSearchParams(parsedSearchParams),
    )
    const [jobs, setJobs] = useState<JobType[]>([])
    const [totalJobs, setTotalJobs] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [retryToken, setRetryToken] = useState(0)
    const resultsSectionRef = useRef<HTMLElement | null>(null)

    const scrollToResults = (offset = 90) => {
        const target = resultsSectionRef.current
        if (!target) return

        const y = window.scrollY + target.getBoundingClientRect().top - offset
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToResults()
    }, [appliedFilters, currentPage])

    useEffect(() => {
        const controller = new AbortController()
        const timer = setTimeout(async () => {
            setLoading(true)
            setError('')
            try {
                const response = await apiGetJobs<JobsResponseEnvelope>(
                    buildPublicJobsQuery(
                        appliedFilters,
                        currentPage,
                        pageSize,
                        sortBy,
                        sortOrder,
                    ),
                )
                if (controller.signal.aborted) return

                const responseData = response?.data
                setJobs(
                    Array.isArray(responseData?.data) ? responseData.data : [],
                )
                setTotalJobs(responseData?.meta?.total ?? 0)
            } catch (err) {
                if (!controller.signal.aborted) {
                    console.error('Failed to load public jobs:', err)
                    setError('We could not load the public job feed right now.')
                    setJobs([])
                    setTotalJobs(0)
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false)
                }
            }
        }, 300)

        return () => {
            controller.abort()
            clearTimeout(timer)
        }
    }, [appliedFilters, currentPage, pageSize, retryToken, sortBy, sortOrder])

    const activeFilterCount = useMemo(
        () => countActiveFilters(appliedFilters),
        [appliedFilters],
    )

    const applyFilters = (nextFilters: Filters) => {
        setAppliedFilters(nextFilters)
        setCurrentPage(1)
        pushJobsQuery(router, nextFilters, 1, pageSize, sortBy, sortOrder)
    }

    const debouncedApplyFilters = useMemo(
        () =>
            debounce((nextFilters: Filters) => {
                setAppliedFilters(nextFilters)
                setCurrentPage(1)
                pushJobsQuery(router, nextFilters, 1, pageSize, sortBy, sortOrder)
            }, 500),
        [router, pageSize, sortBy, sortOrder],
    )

    useEffect(() => {
        return () => {
            debouncedApplyFilters.cancel()
        }
    }, [debouncedApplyFilters])

    const handleFilterChange = (key: keyof Filters, value?: string) => {
        const val = value ?? ''
        const isTextInput = key === 'location' || key === 'searchText'
        const isTyping = value !== undefined

        if (isTextInput && isTyping) {
            setDraftFilters((current) => {
                const next = { ...current, [key]: val }
                debouncedApplyFilters(next)
                return next
            })
        } else {
            setDraftFilters((current) => {
                const next = { ...current, [key]: val }
                debouncedApplyFilters.cancel()
                applyFilters(next)
                return next
            })
        }
    }

    const handleBrowseResults = () => {
        debouncedApplyFilters.cancel()
        applyFilters(draftFilters)
    }

    const handleClearFilters = () => {
        setDraftFilters(EMPTY_FILTERS)
        debouncedApplyFilters.cancel()
        applyFilters(EMPTY_FILTERS)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        pushJobsQuery(router, appliedFilters, page, pageSize, sortBy, sortOrder)
    }

    return (
        <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
                <JobSearchHero
                    filters={draftFilters}
                    totalJobs={totalJobs}
                    activeFilterCount={activeFilterCount}
                    onFilterChange={handleFilterChange}
                    onBrowseResults={handleBrowseResults}
                />

                <PublicJobFilterBar
                    filters={draftFilters}
                    activeFilterCount={activeFilterCount}
                    totalJobs={totalJobs}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />

                {error && (
                    <Alert
                        type="danger"
                        showIcon
                        title="Unable to load jobs"
                        className="rounded-2xl"
                    >
                        {error}
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Try again in a moment.
                        </p>
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={() =>
                                    setRetryToken((token) => token + 1)
                                }
                                className="rounded-xl bg-gray-950 hover:bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-all dark:bg-white dark:text-gray-950 dark:hover:bg-gray-50"
                            >
                                Retry
                            </button>
                        </div>
                    </Alert>
                )}

                <section
                    id="job-results"
                    ref={resultsSectionRef}
                    className="space-y-4"
                >
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-bold text-gray-950 dark:text-white">
                                Latest public jobs
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {totalJobs} listing{totalJobs === 1 ? '' : 's'}{' '}
                                matched
                                {activeFilterCount > 0
                                    ? ' your filters'
                                    : ' the public feed'}
                                .
                            </p>
                        </div>
                        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
                            Page {currentPage} of {Math.max(1, Math.ceil(totalJobs / pageSize))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-80 animate-pulse rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950"
                                />
                            ))}
                            <div className="col-span-full flex items-center justify-center py-6 text-sm text-gray-500 dark:text-gray-400">
                                <Spinner size="lg" />
                                <span className="ml-3">Loading jobs...</span>
                            </div>
                        </div>
                    ) : (
                        <JobCardGrid
                            jobs={jobs}
                            currentPage={currentPage}
                            pageSize={pageSize}
                            totalJobs={totalJobs}
                            onPageChange={handlePageChange}
                        />
                    )}
                </section>
            </div>
        </div>
    )
}
