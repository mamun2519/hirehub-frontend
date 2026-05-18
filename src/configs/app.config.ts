export type AppConfig = {
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
}

const appConfig: AppConfig = {
    apiPrefix: '/api',
    authenticatedEntryPath: '/portal',
    unAuthenticatedEntryPath: '/sign-in',
}

export default appConfig
