'use server'

import { signOut } from '@/auth'
import appConfig from '@/configs/app.config'
import { headers } from 'next/headers'

const handleSignOut = async () => {
    const headersList = await headers()
    const host = headersList.get('host')
    const protocol = host?.includes('localhost') ? 'http' : 'https'
    const redirectTo = `${protocol}://${host}${appConfig.unAuthenticatedEntryPath}`
    await signOut({ redirectTo })
}

export default handleSignOut
