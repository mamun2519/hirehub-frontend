export type AppConfig = {
    serverBaseUrl: string
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
}

const appConfig: AppConfig = {
    serverBaseUrl: 'http://localhost:5000',
    apiPrefix: '/api/v1',
    authenticatedEntryPath: '/portal',
    unAuthenticatedEntryPath: '/sign-in',
}

export default appConfig
