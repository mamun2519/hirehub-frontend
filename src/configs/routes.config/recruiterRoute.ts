import { RECRUITER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const recruiterRoute: Routes = {
    '/portal/jobs/new': {
        key: 'recruiter.jobs.new',
        authority: [RECRUITER],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/portal/jobs/edit/[id]': {
        key: 'recruiter.jobs.edit',
        authority: [RECRUITER],
        dynamicRoute: true,
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
}

export default recruiterRoute
