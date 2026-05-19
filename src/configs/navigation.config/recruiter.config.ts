import { NAV_ITEM_TYPE_ITEM } from '@/constants/navigation.constant'
import { RECRUITER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const recruiterNavigationConfig: NavigationTree[] = [
    {
        key: 'recruiter.dashboard',
        path: '/portal',
        title: 'Dashboard',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [RECRUITER],
        subMenu: [],
    },
    {
        key: 'recruiter.postJob',
        path: '/portal/jobs/new',
        title: 'Post a Job',
        icon: 'postJob',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [RECRUITER],
        subMenu: [],
    },
    {
        key: 'recruiter.manageJobs',
        path: '/portal/jobs',
        title: 'Manage Jobs',
        icon: 'jobs',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [RECRUITER],
        subMenu: [],
    },
    {
        key: 'recruiter.applications',
        path: '/portal/applications',
        title: 'Applications',
        icon: 'applications',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [RECRUITER],
        subMenu: [],
    },
    {
        key: 'recruiter.settings',
        path: '/portal/settings',
        title: 'Settings',
        icon: 'settings',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [RECRUITER],
        subMenu: [],
    },
]

export default recruiterNavigationConfig
