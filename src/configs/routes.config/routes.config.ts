import authRoute from './authRoute'
import adminRoute from './adminRoute'
import recruiterRoute from './recruiterRoute'
import candidateRoute from './candidateRoute'
import publicRoute from './publicRoute'
import type { Routes } from '@/@types/routes'
import { ADMIN, RECRUITER } from '@/constants/roles.constant'

export const publicRoutes = publicRoute
export const authRoutes = authRoute

export const protectedRoutes: Routes = {
    '/portal': {
        key: 'portal',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/portal/settings': {
        key: 'portal.settings',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/portal/profile': {
        key: 'portal.profile',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/portal/jobs': {
        key: 'recruiter.jobs',
        authority: [RECRUITER, ADMIN],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/portal/applications': {
        key: 'portal.applications',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    ...adminRoute,
    ...recruiterRoute,
    ...candidateRoute,
}
