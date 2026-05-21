import type { Filters } from './types'

export function mapFiltersToApiParams(filters: Filters): Record<string, string> {
    const params: Record<string, string> = {}

    if (filters.searchText.trim()) params.searchTerm = filters.searchText.trim()
    if (filters.location.trim()) params.location = filters.location.trim()
    if (filters.salaryRange.trim()) params.salaryRange = filters.salaryRange.trim()
    if (filters.experienceLevel.trim()) params.experienceLevel = filters.experienceLevel.trim()
    if (filters.employmentType.trim()) params.employmentType = filters.employmentType.trim()
    if (filters.remoteInfo.trim()) params.remoteInfo = filters.remoteInfo.trim()

    return params
}

export function buildJobsQueryParams(options: {
    filters: Filters
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: string
}): Record<string, string> {
    const params = mapFiltersToApiParams(options.filters)

    if (typeof options.page === 'number') {
        params.page = String(options.page)
    }

    if (typeof options.limit === 'number') {
        params.limit = String(options.limit)
    }

    if (options.sortBy) {
        params.sortBy = options.sortBy
    }

    if (options.sortOrder) {
        params.sortOrder = options.sortOrder
    }

    return params
}
