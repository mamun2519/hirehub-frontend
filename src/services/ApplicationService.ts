import ApiService from './ApiService'

export async function apiApplyJob<T = any>(data: FormData) {
    return ApiService.triggerApiSync<T, FormData>({
        url: '/applications/apply',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}
