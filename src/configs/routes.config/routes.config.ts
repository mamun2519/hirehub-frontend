import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const protectedRoutes: Routes = {
    '/portal': {
        key: 'portal',
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
}

export const publicRoutes: Routes = {}

export const authRoutes = authRoute
