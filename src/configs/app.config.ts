export type AppConfig = {
    serverBaseUrl: string
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
}

const appConfig: AppConfig = {
    serverBaseUrl:
        process.env.NEXT_PUBLIC_SERVER_BASE_URL ||
        (process.env.NODE_ENV === 'production'
            ? 'https://hirehub-three.vercel.app'
            : 'http://localhost:5000'),
    apiPrefix: '/api/v1',
    authenticatedEntryPath: '/portal',
    unAuthenticatedEntryPath: '/sign-in',
}

export default appConfig
