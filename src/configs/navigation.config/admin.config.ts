import {
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'
import { ADMIN } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const adminNavigationConfig: NavigationTree[] = [
    {
        key: 'admin.dashboard',
        path: '/portal',
        title: 'Dashboard',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN],
        subMenu: [],
    },
    {
        key: 'admin.users',
        path: '/portal/users',
        title: 'Manage Users',
        icon: 'users',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN],
        subMenu: [],
    },
    {
        key: 'admin.settings',
        path: '/portal/settings',
        title: 'Settings',
        icon: 'settings',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN],
        subMenu: [],
    },
    /* {
        key: 'admin.users',
        path: '',
        title: 'Manage Users',
        icon: 'users',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [ADMIN],
        subMenu: [
            {
                key: 'admin.users.list',
                path: '/portal/users',
                title: 'User List',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN],
                subMenu: [],
            },
            {
                key: 'admin.users.create',
                path: '/portal/users/new',
                title: 'Create User',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN],
                subMenu: [],
            },
        ],
    }, */
    /* {
        key: 'admin.groupMenu',
        path: '',
        title: 'Group Menu',
        icon: 'groupMenu',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [ADMIN],
        subMenu: [
            {
                key: 'admin.groupMenu.item1',
                path: '',
                title: 'Dummy Item 1',
                icon: 'singleMenu',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN],
                subMenu: [],
            },
            {
                key: 'admin.groupMenu.item2',
                path: '',
                title: 'Dummy Item 2',
                icon: 'singleMenu',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN],
                subMenu: [],
            },
        ],
    }, */
]

export default adminNavigationConfig
