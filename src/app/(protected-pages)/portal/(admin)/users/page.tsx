'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Card, Button, Badge, Tabs, Input, Select } from '@/components/ui'
import { RECRUITER, CANDIDATE } from '@/constants/roles.constant'
import {
    PiPlusBold,
    PiMagnifyingGlassDuotone,
    PiUsersDuotone,
    PiEnvelopeDuotone,
    PiGlobeDuotone,
    PiMapPinDuotone,
    PiPhoneDuotone,
    PiBriefcaseDuotone,
} from 'react-icons/pi'
import DataTable, { ColumnDef } from '@/components/shared/DataTable'
import ApiService from '@/services/ApiService'
import debounce from 'lodash/debounce'

export interface Recruiter {
    id: string
    name: string // Company name
    website: string
    email: string
    location: string
    status: 'Active' | 'Suspended'
    createdAt: string
}

export interface Candidate {
    id: string
    name: string
    email: string
    role: string
    phone: string
    status: 'Active' | 'Suspended' | 'Pending'
    createdAt: string
}

const { TabList, TabNav, TabContent } = Tabs

export default function UserManagementPage() {
    const [activeTab, setActiveTab] = useState<string>(RECRUITER)
    const [loading, setLoading] = useState<boolean>(true)
    const [searchText, setSearchText] = useState<string>('')
    const [debouncedSearchText, setDebouncedSearchText] = useState<string>('')
    const [selectedStatus, setSelectedStatus] = useState<string>('all')
    const [recruiters, setRecruiters] = useState<Recruiter[]>([])
    const [candidates, setCandidates] = useState<Candidate[]>([])

    const [pageIndex, setPageIndex] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [total, setTotal] = useState<number>(0)

    const handleDebounceSearch = useMemo(
        () =>
            debounce((val: string) => {
                setDebouncedSearchText(val)
            }, 500),
        [],
    )

    useEffect(() => {
        return () => {
            handleDebounceSearch.cancel()
        }
    }, [handleDebounceSearch])

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const response = await ApiService.fetchDataWithAxios<{
                success: boolean
                data: {
                    meta: { page: number; limit: number; total: number }
                    data: any[]
                }
            }>({
                url: '/users/',
                method: 'get',
                params: {
                    role: activeTab,
                    search: debouncedSearchText || undefined,
                    page: pageIndex,
                    limit: pageSize,
                },
            })
            if (
                response.success &&
                response.data &&
                Array.isArray(response.data.data)
            ) {
                const usersList = response.data.data
                setTotal(response.data.meta.total)

                if (activeTab === RECRUITER) {
                    const recruitersData = usersList.map((user) => {
                        const profile = user.recruiterProfile || {}
                        return {
                            id: user.id.slice(0, 8).toUpperCase(),
                            name: profile.name || 'N/A',
                            website: profile.website || '',
                            email: user.email,
                            location: profile.location || 'N/A',
                            status: 'Active' as const,
                            createdAt: new Date(
                                user.createdAt,
                            ).toLocaleDateString(),
                        }
                    })
                    setRecruiters(recruitersData)
                } else if (activeTab === CANDIDATE) {
                    const candidatesData = usersList.map((user) => {
                        const profile = user.candidateProfile || {}
                        return {
                            id: user.id.slice(0, 8).toUpperCase(),
                            name: profile.fullName || 'N/A',
                            email: user.email,
                            role:
                                profile.skills && profile.skills.length > 0
                                    ? profile.skills.join(', ')
                                    : 'Candidate',
                            phone: profile.phoneNumber || 'N/A',
                            status: 'Active' as const,
                            createdAt: new Date(
                                user.createdAt,
                            ).toLocaleDateString(),
                        }
                    })
                    setCandidates(candidatesData)
                }
            }
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [activeTab, debouncedSearchText, pageIndex, pageSize])

    // Filter Recruiters
    const filteredRecruiters = useMemo(() => {
        return recruiters.filter((rec) => {
            const matchesStatus =
                selectedStatus === 'all' ||
                rec.status.toLowerCase() === selectedStatus.toLowerCase()
            return matchesStatus
        })
    }, [recruiters, selectedStatus])

    // Filter Candidates
    const filteredCandidates = useMemo(() => {
        return candidates.filter((cand) => {
            const matchesStatus =
                selectedStatus === 'all' ||
                cand.status.toLowerCase() === selectedStatus.toLowerCase()
            return matchesStatus
        })
    }, [candidates, selectedStatus])

    // Recruiter Columns
    const recruiterColumns: ColumnDef<Recruiter>[] = useMemo(
        () => [
            {
                header: 'ID',
                accessorKey: 'id',
                cell: (props) => (
                    <span className="font-bold text-gray-700 dark:text-gray-300">
                        {props.row.original.id}
                    </span>
                ),
            },
            {
                header: 'Company / Name',
                accessorKey: 'name',
                cell: (props) => (
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                            {props.row.original.name}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <PiEnvelopeDuotone /> {props.row.original.email}
                        </span>
                    </div>
                ),
            },
            {
                header: 'Website',
                accessorKey: 'website',
                cell: (props) => (
                    <a
                        href={props.row.original.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-xs flex items-center gap-1 font-medium"
                    >
                        <PiGlobeDuotone className="text-sm" />
                        {props.row.original.website.replace('https://', '')}
                    </a>
                ),
            },
            {
                header: 'Location',
                accessorKey: 'location',
                cell: (props) => (
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <PiMapPinDuotone className="text-gray-400" />
                        {props.row.original.location}
                    </span>
                ),
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const status = props.row.original.status
                    return (
                        <Badge
                            content={status}
                            innerClass={
                                status === 'Active'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                                    : 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300'
                            }
                        />
                    )
                },
            },
            {
                header: 'Registered',
                accessorKey: 'createdAt',
                cell: (props) => (
                    <span className="text-xs text-gray-500">
                        {props.row.original.createdAt}
                    </span>
                ),
            },
        ],
        [],
    )

    // Candidate Columns
    const candidateColumns: ColumnDef<Candidate>[] = useMemo(
        () => [
            {
                header: 'ID',
                accessorKey: 'id',
                cell: (props) => (
                    <span className="font-bold text-gray-700 dark:text-gray-300">
                        {props.row.original.id}
                    </span>
                ),
            },
            {
                header: 'Candidate',
                accessorKey: 'name',
                cell: (props) => (
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                            {props.row.original.name}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <PiEnvelopeDuotone /> {props.row.original.email}
                        </span>
                    </div>
                ),
            },
            {
                header: 'Phone',
                accessorKey: 'phone',
                cell: (props) => (
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <PiPhoneDuotone className="text-gray-400" />
                        {props.row.original.phone}
                    </span>
                ),
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const status = props.row.original.status
                    return (
                        <Badge
                            content={status}
                            innerClass={
                                status === 'Active'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                                    : status === 'Pending'
                                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                                      : 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300'
                            }
                        />
                    )
                },
            },
            {
                header: 'Registered',
                accessorKey: 'createdAt',
                cell: (props) => (
                    <span className="text-xs text-gray-500">
                        {props.row.original.createdAt}
                    </span>
                ),
            },
        ],
        [],
    )

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'suspended', label: 'Suspended' },
        ...(activeTab === CANDIDATE
            ? [{ value: 'pending', label: 'Pending' }]
            : []),
    ]

    return (
        <div className="flex flex-col gap-6 p-4">
            {/* Header Welcome banner */}
            <div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-white flex items-center gap-2">
                            <PiUsersDuotone className="text-primary-light" />
                            User Management
                        </h1>
                        <p className="text-gray-300 max-w-xl text-sm leading-relaxed">
                            Oversee all registered recruiter profiles and
                            candidate applications. Review their active status,
                            locations, contact credentials, and operational
                            properties.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter controls + Listing Card */}
            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex flex-col gap-6">
                    {/* Tabs navigation & Action Button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                        <Tabs
                            value={activeTab}
                            onChange={(val) => {
                                setActiveTab(val as string)
                                setSearchText('')
                                handleDebounceSearch.cancel()
                                setDebouncedSearchText('')
                                setPageIndex(1)
                                setSelectedStatus('all')
                            }}
                            variant="underline"
                        >
                            <TabList>
                                <TabNav value={RECRUITER}>Recruiters</TabNav>
                                <TabNav value={CANDIDATE}>Candidates</TabNav>
                            </TabList>
                        </Tabs>

                        {activeTab === RECRUITER && (
                            <Link href="/portal/users/modify">
                                <Button
                                    variant="solid"
                                    className="flex items-center gap-2"
                                    size="sm"
                                >
                                    <PiPlusBold />
                                    Create Recruiter
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Quick Filters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <Input
                            placeholder="Search by name, email, location..."
                            prefix={
                                <PiMagnifyingGlassDuotone className="text-lg text-gray-400" />
                            }
                            value={searchText}
                            onChange={(e) => {
                                const val = e.target.value
                                setSearchText(val)
                                setPageIndex(1)
                                handleDebounceSearch(val)
                            }}
                            size="sm"
                        />
                        <div style={{ maxWidth: 200 }}>
                            <Select
                                size="sm"
                                placeholder="Filter by Status"
                                isSearchable={false}
                                options={statusOptions}
                                value={statusOptions.find(
                                    (opt) => opt.value === selectedStatus,
                                )}
                                onChange={(opt) =>
                                    setSelectedStatus(opt?.value || 'all')
                                }
                            />
                        </div>
                    </div>

                    {/* Dynamic Table listing */}
                    <div className="mt-2">
                        <Tabs value={activeTab}>
                            <TabContent value={RECRUITER}>
                                <DataTable
                                    columns={recruiterColumns}
                                    data={filteredRecruiters}
                                    loading={loading}
                                    noData={filteredRecruiters.length === 0}
                                    pagingData={{
                                        total,
                                        pageIndex,
                                        pageSize,
                                    }}
                                    onPaginationChange={(page) => setPageIndex(page)}
                                    onSelectChange={(size) => {
                                        setPageSize(size)
                                        setPageIndex(1)
                                    }}
                                />
                            </TabContent>
                            <TabContent value={CANDIDATE}>
                                <DataTable
                                    columns={candidateColumns}
                                    data={filteredCandidates}
                                    loading={loading}
                                    noData={filteredCandidates.length === 0}
                                    pagingData={{
                                        total,
                                        pageIndex,
                                        pageSize,
                                    }}
                                    onPaginationChange={(page) => setPageIndex(page)}
                                    onSelectChange={(size) => {
                                        setPageSize(size)
                                        setPageIndex(1)
                                    }}
                                />
                            </TabContent>
                        </Tabs>
                    </div>
                </div>
            </Card>
        </div>
    )
}
