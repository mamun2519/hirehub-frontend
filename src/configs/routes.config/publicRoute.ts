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
}

export default publicRoute
