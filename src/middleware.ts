import { auth } from '@/auth'
import {
    authRoutes as _authRoutes,
    publicRoutes as _publicRoutes,
} from '@/configs/routes.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import appConfig from '@/configs/app.config'
import { isPublicPath, matchRoute } from '@/utils/queryRoute'

const publicRoutes = Object.entries(_publicRoutes).map(([key]) => key)
const authRoutes = Object.entries(_authRoutes).map(([key]) => key)

const apiAuthPrefix = `${appConfig.apiPrefix}/auth`

export default auth((req) => {
    const { nextUrl } = req
    const isSignedIn = !!req.auth?.user

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isPublicRoute = isPublicPath(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)

    /** Skip auth middleware for api routes */
    if (isApiAuthRoute) return

    if (isAuthRoute) {
        if (isSignedIn) {
            /** Redirect to authenticated entry path if signed in & path is auth route */
            return Response.redirect(
                new URL(appConfig.authenticatedEntryPath, nextUrl),
            )
        }
        return
    }

    /** Redirect to authenticated entry path if signed in & path is public route */
    if (!isSignedIn && !isPublicRoute) {
        let callbackUrl = nextUrl.pathname
        if (nextUrl.search) {
            callbackUrl += nextUrl.search
        }

        return Response.redirect(
            new URL(
                `${appConfig.unAuthenticatedEntryPath}?${REDIRECT_URL_KEY}=${callbackUrl}`,
                nextUrl,
            ),
        )
    }

    if (isSignedIn && nextUrl.pathname !== '/access-denied' && !nextUrl.pathname.startsWith(appConfig.apiPrefix)) {
        const routeMeta = matchRoute(nextUrl.pathname)
        if (routeMeta && routeMeta.authority && routeMeta.authority.length > 0) {
            const includedRole = routeMeta.authority.some((role) =>
                req.auth?.user?.authority?.includes(role)
            )
            if (!includedRole) {
                return Response.redirect(
                    new URL('/access-denied', nextUrl),
                )
            }
        }
    }
})

export const config = {
    matcher: ['/((?!.+\.[\w]+$|_next).*)', '/', '/(api)(.*)'],
}
