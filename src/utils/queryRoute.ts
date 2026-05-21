import type { Route } from '@/@types/routes'
import { protectedRoutes, publicRoutes } from '@/configs/routes.config'

const routes = { ...publicRoutes, ...protectedRoutes }
const publicRouteEntries = Object.entries(publicRoutes)

const normalizePath = (path: string) =>
    path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path

const matchesDynamicRoute = (
    path: string,
    routePath: string,
) => {
    const inputSegments = path.split('/').filter(Boolean)
    const routeSegments = routePath.split('/').filter(Boolean)

    if (routeSegments.length !== inputSegments.length) {
        return false
    }

    for (let i = 0; i < routeSegments.length; i++) {
        const routeSegment = routeSegments[i]
        const inputSegment = inputSegments[i]

        if (routeSegment.startsWith('[') && routeSegment.endsWith(']')) {
            continue
        }

        if (routeSegment !== inputSegment) {
            return false
        }
    }

    return true
}

export const matchRoute = (path: string): Route | null => {
    const normalizedPath = normalizePath(path)

    if (routes[normalizedPath]) {
        return routes[normalizedPath]
    }

    let bestMatch: Route | null = null
    let highestMatchScore = -1

    for (const [routePath, route] of Object.entries(routes)) {
        if (!route.dynamicRoute) continue

        if (!matchesDynamicRoute(normalizedPath, routePath)) {
            continue
        }

        const routeSegments = routePath.split('/').filter(Boolean)
        const inputSegments = normalizedPath.split('/').filter(Boolean)
        const matchScore = routeSegments.reduce((score, segment, index) => {
            if (segment === inputSegments[index]) {
                return score + 1
            }
            return score
        }, 0)

        if (matchScore > highestMatchScore) {
            highestMatchScore = matchScore
            bestMatch = route
        }
    }

    return bestMatch
}

export const isPublicPath = (path: string): boolean => {
    const normalizedPath = normalizePath(path)

    if (publicRoutes[normalizedPath]) {
        return true
    }

    return publicRouteEntries.some(([routePath, route]) => {
        if (!route.dynamicRoute) return false
        return matchesDynamicRoute(normalizedPath, routePath)
    })
}

export default matchRoute
