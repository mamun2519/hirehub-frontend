import ApiService from './ApiService'

export async function apiGetDashboardStats<T = any>() {
    return ApiService.triggerApiSync<T>({
        url: '/dashboard',
        method: 'get',
    })
}

export async function apiGetNotificationCount() {
    return ApiService.triggerApiSync<{
        count: number
    }>({
        url: '/notifications/count',
        method: 'get',
    })
}

export async function apiGetNotificationList() {
    return ApiService.triggerApiSync<
        {
            id: string
            target: string
            description: string
            date: string
            image: string
            type: number
            location: string
            locationLabel: string
            status: string
            readed: boolean
        }[]
    >({
        url: '/notifications',
        method: 'get',
    })
}

export async function apiGetSearchResult<T>(params: { query: string }) {
    return ApiService.triggerApiSync<T>({
        url: '/search',
        method: 'get',
        params,
    })
}
