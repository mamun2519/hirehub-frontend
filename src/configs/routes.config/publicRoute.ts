import type { Routes } from '@/@types/routes'

const publicRoute: Routes = {
    '/': {
        key: 'home',
        authority: [],
    },
    '/jobs': {
        key: 'public.jobs',
        authority: [],
    },
    '/jobs/[id]': {
        key: 'public.jobs.detail',
        authority: [],
        dynamicRoute: true,
    },
    '/portal/settings': {
        key: 'portal.settings',
        authority: [],
    },
    '/portal/users': {
        key: 'admin.users',
        authority: [],
    },
    '/portal/jobs': {
        key: 'recruiter.jobs',
        authority: [],
    },
}

export default publicRoute
