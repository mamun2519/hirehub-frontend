'use server'

import { signOut } from '@/auth'
import appConfig from '@/configs/app.config'
import { redirect } from 'next/navigation'

const handleSignOut = async () => {
    try {
        await signOut({ redirect: false })
    } catch (error) {
        // Catch any redirect/error thrown by NextAuth to override it
    }
    redirect(appConfig.unAuthenticatedEntryPath)
}

export default handleSignOut
