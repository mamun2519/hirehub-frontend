import { ADMIN } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const adminRoute: Routes = {
    '/portal/users': {
        key: 'admin.users',
        authority: [ADMIN],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/portal/users/modify': {
        key: 'admin.users.modify',
        authority: [ADMIN],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
}

export default adminRoute
