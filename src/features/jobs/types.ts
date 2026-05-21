export interface JobRecruiterUser {
    id?: string
    name?: string
    avatar?: string | null
}

export interface JobRecruiter {
    id?: string
    companyName?: string
    logo?: string | null
    website?: string | null
    user?: JobRecruiterUser | null
}

export interface JobType {
    id: string
    title: string
    description: string
    salaryRange: string
    location: string
    employmentType: string
    experienceLevel: string
    remoteInfo: string
    vacancyCount: number
    applicationDeadline: string
    requiredSkills: string[]
    recruiterId?: string
    createdAt: string
    recruiter?: JobRecruiter | null
}

export interface Filters {
    searchText: string
    location: string
    salaryRange: string
    experienceLevel: string
    employmentType: string
    remoteInfo: string
}

export interface SelectOption {
    value: string
    label: string
}

export interface KpiData {
    totalActive: number
    totalVacancies: number
    nearestDeadline: string
}

export const EXPERIENCE_OPTIONS: SelectOption[] = [
    { value: '', label: 'All Experience Levels' },
    { value: 'Entry Level', label: 'Entry Level' },
    { value: 'Mid Level', label: 'Mid Level' },
    { value: 'Senior', label: 'Senior' },
    { value: 'Lead', label: 'Lead / Staff' },
    { value: 'Executive', label: 'Executive' },
]

export const EMPLOYMENT_OPTIONS: SelectOption[] = [
    { value: '', label: 'All Employment Types' },
    { value: 'Full-Time', label: 'Full-Time' },
    { value: 'Part-Time', label: 'Part-Time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Internship', label: 'Internship' },
    { value: 'Freelance', label: 'Freelance' },
]

export const REMOTE_OPTIONS: SelectOption[] = [
    { value: '', label: 'All Work Settings' },
    { value: 'Remote', label: 'Remote' },
    { value: 'On-Site', label: 'On-Site' },
    { value: 'Hybrid', label: 'Hybrid' },
]

export const SALARY_OPTIONS: SelectOption[] = [
    { value: '', label: 'Any Salary' },
    { value: '0-30k', label: 'Up to $30k' },
    { value: '30k-60k', label: '$30k – $60k' },
    { value: '60k-100k', label: '$60k – $100k' },
    { value: '100k-150k', label: '$100k – $150k' },
    { value: '150k+', label: '$150k+' },
]

export const EMPTY_FILTERS: Filters = {
    searchText: '',
    location: '',
    salaryRange: '',
    experienceLevel: '',
    employmentType: '',
    remoteInfo: '',
}

export function countActiveFilters(filters: Filters): number {
    return Object.values(filters).filter((value) => value.trim() !== '').length
}
