'use client'

import React, { useState, useEffect, useCallback } from 'react'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import ApiService from '@/services/ApiService'
import Tabs from '@/components/ui/Tabs'
import Spinner from '@/components/ui/Spinner'
import Alert from '@/components/ui/Alert'
import {
    PiUserDuotone,
    PiBuildingsBold,
    PiBriefcaseDuotone,
    PiShieldCheckDuotone,
} from 'react-icons/pi'

import PersonalInfoForm from './_components/PersonalInfoForm'
import RecruiterProfileForm from './_components/RecruiterProfileForm'
import CandidateProfileForm from './_components/CandidateProfileForm'
import ChangePasswordForm from './_components/ChangePasswordForm'

const { TabList, TabNav, TabContent } = Tabs

export default function SettingsPage() {
    const { session } = useCurrentSession()
    const role = session?.user?.authority?.[0] || 'candidate'

    const [activeTab, setActiveTab] = useState<string>('personal')
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>('')
    const [profileData, setProfileData] = useState<any>(null)

    const fetchProfile = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const response = await ApiService.triggerApiSync<any>({
                url: '/profile',
                method: 'get',
            })
            if (response && response.data) {
                setProfileData(response.data)
            } else {
                setProfileData(null)
            }
        } catch (err: any) {
            console.error('Failed to load profile settings:', err)
            setError(
                'Could not retrieve your profile. Creating details will synchronize your database profile.',
            )
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (session?.user?.id) {
            fetchProfile()
        }
    }, [session?.user?.id, fetchProfile])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Spinner size="lg" className="text-indigo-600" />
                <span className="text-sm font-medium text-gray-500 animate-pulse">
                    Loading your settings and profiles...
                </span>
            </div>
        )
    }

    // Determine initial form data for PersonalInfoForm
    const personalInfoInitial = {
        id: session?.user?.id || '',
        fullName:
            profileData?.user?.name ||
            profileData?.fullName ||
            session?.user?.name ||
            session?.user?.email?.split('@')[0] ||
            '',
        email: profileData?.user?.email || session?.user?.email || '',
        avatar: profileData?.user?.avatar || session?.user?.image || '',
    }

    // Recruiter company profile details fallback
    const recruiterInfoInitial = {
        id: profileData?.id || '',
        companyName: profileData?.companyName || '',
        website: profileData?.website || '',
        description: profileData?.description || '',
        location: profileData?.location || '',
        logo: profileData?.logo || '',
    }

    // Candidate career profile details fallback
    const candidateInfoInitial = {
        id: profileData?.id || '',
        phoneNumber: profileData?.phoneNumber || '',
        education: profileData?.education || '',
        experience: profileData?.experience || '',
        resume: profileData?.resume || '',
        skills: profileData?.skills || [],
        githubLink: profileData?.githubLink || '',
        linkedInLink: profileData?.linkedInLink || '',
    }

    return (
        <div className="flex flex-col gap-6 p-4 md:p-6 max-w-6xl mx-auto">
            {/* Page Header banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl">
                <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10">
                    <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                        Preferences
                    </span>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-3 mb-2 text-white">
                        Settings & Profile Management
                    </h1>
                    <p className="text-slate-300 max-w-xl text-xs md:text-sm leading-relaxed">
                        Customize your account parameters, update role-specific
                        details, manage uploads, and secure password
                        preferences.
                    </p>
                </div>
            </div>

            {error && (
                <Alert
                    type="warning"
                    showIcon
                    closable
                    className="border border-amber-100 bg-amber-50/50"
                >
                    {error}
                </Alert>
            )}

            {/* Responsive Settings Tabs Layout */}
            <Tabs
                value={activeTab}
                onChange={(val) => setActiveTab(val as string)}
                variant="underline"
            >
                <div className="flex flex-col gap-6">
                    {/* Tab Navigation Container */}
                    <div className="border-b border-gray-200 dark:border-gray-800">
                        <TabList className="flex gap-6 overflow-x-auto scrollbar-none pb-0">
                            <TabNav
                                value="personal"
                                className="flex items-center gap-2 py-3 px-1 text-sm font-semibold border-b-2 whitespace-nowrap"
                            >
                                <PiUserDuotone className="text-lg" />
                                Personal Info
                            </TabNav>

                            {role === 'recruiter' && (
                                <TabNav
                                    value="recruiter"
                                    className="flex items-center gap-2 py-3 px-1 text-sm font-semibold border-b-2 whitespace-nowrap"
                                >
                                    <PiBuildingsBold className="text-lg" />
                                    Company Details
                                </TabNav>
                            )}

                            {role === 'candidate' && (
                                <TabNav
                                    value="candidate"
                                    className="flex items-center gap-2 py-3 px-1 text-sm font-semibold border-b-2 whitespace-nowrap"
                                >
                                    <PiBriefcaseDuotone className="text-lg" />
                                    Candidate Profile
                                </TabNav>
                            )}

                            <TabNav
                                value="security"
                                className="flex items-center gap-2 py-3 px-1 text-sm font-semibold border-b-2 whitespace-nowrap"
                            >
                                <PiShieldCheckDuotone className="text-lg" />
                                <span className="text-transparent selection:bg-indigo-500 selection:text-white">Security</span>
                            </TabNav>
                        </TabList>
                    </div>

                    {/* Tab Contents Container */}
                    <div className="transition-all duration-300">
                        <TabContent value="personal">
                            <PersonalInfoForm
                                initialData={personalInfoInitial}
                                role={role}
                                onSuccess={fetchProfile}
                            />
                        </TabContent>

                        {role === 'recruiter' && (
                            <TabContent value="recruiter">
                                <RecruiterProfileForm
                                    initialData={recruiterInfoInitial}
                                    onSuccess={fetchProfile}
                                />
                            </TabContent>
                        )}

                        {role === 'candidate' && (
                            <TabContent value="candidate">
                                <CandidateProfileForm
                                    initialData={candidateInfoInitial}
                                    onSuccess={fetchProfile}
                                />
                            </TabContent>
                        )}

                        <TabContent value="security">
                            <ChangePasswordForm />
                        </TabContent>
                    </div>
                </div>
            </Tabs>
        </div>
    )
}
