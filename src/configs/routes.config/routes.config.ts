import authRoute from './authRoute'
import adminRoute from './adminRoute'
import recruiterRoute from './recruiterRoute'
import candidateRoute from './candidateRoute'
import publicRoute from './publicRoute'
import type { Routes } from '@/@types/routes'

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
    ...adminRoute,
    ...recruiterRoute,
    ...candidateRoute,
}
