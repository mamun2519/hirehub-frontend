import { NAV_ITEM_TYPE_ITEM } from '@/constants/navigation.constant'
import { CANDIDATE } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const candidateNavigationConfig: NavigationTree[] = [
    {
        key: 'candidate.dashboard',
        path: '/portal',
        title: 'Dashboard',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [CANDIDATE],
        subMenu: [],
    },
    {
        key: 'candidate.findJobs',
        path: '/portal/jobs',
        title: 'Find Jobs',
        icon: 'findJobs',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [CANDIDATE],
        subMenu: [],
    },
    {
        key: 'candidate.appliedJobs',
        path: '/portal/applications',
        title: 'Applied Jobs',
        icon: 'appliedJobs',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [CANDIDATE],
        subMenu: [],
    },
    {
        key: 'candidate.profile',
        path: '/portal/profile',
        title: 'My Profile',
        icon: 'profile',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [CANDIDATE],
        subMenu: [],
    },
    {
        key: 'candidate.settings',
        path: '/portal/settings',
        title: 'Settings',
        icon: 'settings',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [CANDIDATE],
        subMenu: [],
    },
]

export default candidateNavigationConfig
