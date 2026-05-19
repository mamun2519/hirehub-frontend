'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Card, Button, Badge, Tabs, Input, Select } from '@/components/ui'
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
import {
    mockRecruiters,
    mockCandidates,
    MockRecruiter,
    MockCandidate,
} from './_mockData/mockUsers'

const { TabList, TabNav, TabContent } = Tabs

export default function UserManagementPage() {
    const [activeTab, setActiveTab] = useState<string>('recruiter')
    const [loading, setLoading] = useState<boolean>(true)
    const [searchText, setSearchText] = useState<string>('')
    const [selectedStatus, setSelectedStatus] = useState<string>('all')

    // Simulate database loading when switching tabs or filters
    useEffect(() => {
        setLoading(true)
        const timer = setTimeout(() => {
            setLoading(false)
        }, 800)
        return () => clearTimeout(timer)
    }, [activeTab, searchText, selectedStatus])

    // Filter Recruiters
    const filteredRecruiters = useMemo(() => {
        return mockRecruiters.filter((rec) => {
            const matchesSearch =
                rec.name.toLowerCase().includes(searchText.toLowerCase()) ||
                rec.email.toLowerCase().includes(searchText.toLowerCase()) ||
                rec.location.toLowerCase().includes(searchText.toLowerCase())
            const matchesStatus =
                selectedStatus === 'all' ||
                rec.status.toLowerCase() === selectedStatus.toLowerCase()
            return matchesSearch && matchesStatus
        })
    }, [searchText, selectedStatus])

    // Filter Candidates
    const filteredCandidates = useMemo(() => {
        return mockCandidates.filter((cand) => {
            const matchesSearch =
                cand.name.toLowerCase().includes(searchText.toLowerCase()) ||
                cand.email.toLowerCase().includes(searchText.toLowerCase()) ||
                cand.role.toLowerCase().includes(searchText.toLowerCase())
            const matchesStatus =
                selectedStatus === 'all' ||
                cand.status.toLowerCase() === selectedStatus.toLowerCase()
            return matchesSearch && matchesStatus
        })
    }, [searchText, selectedStatus])

    // Recruiter Columns
    const recruiterColumns: ColumnDef<MockRecruiter>[] = useMemo(
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
        []
    )

    // Candidate Columns
    const candidateColumns: ColumnDef<MockCandidate>[] = useMemo(
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
                header: 'Specialization / Role',
                accessorKey: 'role',
                cell: (props) => (
                    <span className="text-xs text-gray-700 dark:text-gray-300 flex items-center gap-1 font-medium">
                        <PiBriefcaseDuotone className="text-gray-400" />
                        {props.row.original.role}
                    </span>
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
        []
    )

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'suspended', label: 'Suspended' },
        ...(activeTab === 'candidate' ? [{ value: 'pending', label: 'Pending' }] : []),
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
                            Oversee all registered recruiter profiles and candidate applications. Review their active status, locations, contact credentials, and operational properties.
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
                                setSelectedStatus('all')
                            }}
                            variant="underline"
                        >
                            <TabList>
                                <TabNav value="recruiter">Recruiters</TabNav>
                                <TabNav value="candidate">Candidates</TabNav>
                            </TabList>
                        </Tabs>

                        {activeTab === 'recruiter' && (
                            <Link href="/portal/users/new">
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
                            prefix={<PiMagnifyingGlassDuotone className="text-lg text-gray-400" />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            size="sm"
                        />
                        <div style={{ maxWidth: 200 }}>
                            <Select
                                size="sm"
                                placeholder="Filter by Status"
                                isSearchable={false}
                                options={statusOptions}
                                value={statusOptions.find((opt) => opt.value === selectedStatus)}
                                onChange={(opt) => setSelectedStatus(opt?.value || 'all')}
                            />
                        </div>
                    </div>

                    {/* Dynamic Table listing */}
                    <div className="mt-2">
                        <Tabs value={activeTab}>
                            <TabContent value="recruiter">
                                <DataTable
                                    columns={recruiterColumns}
                                    data={filteredRecruiters}
                                    loading={loading}
                                    noData={filteredRecruiters.length === 0}
                                    pagingData={{
                                        total: filteredRecruiters.length,
                                        pageIndex: 1,
                                        pageSize: 10,
                                    }}
                                />
                            </TabContent>
                            <TabContent value="candidate">
                                <DataTable
                                    columns={candidateColumns}
                                    data={filteredCandidates}
                                    loading={loading}
                                    noData={filteredCandidates.length === 0}
                                    pagingData={{
                                        total: filteredCandidates.length,
                                        pageIndex: 1,
                                        pageSize: 10,
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
