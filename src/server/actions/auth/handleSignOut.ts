'use server'

import { signOut } from '@/auth'
import appConfig from '@/configs/app.config'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

const handleSignOut = async () => {
    try {
        await signOut({ redirect: false })
    } catch (error) {
        // Catch any redirect/error thrown by NextAuth to override it
    }

    // Explicitly delete all auth and token cookies
    const cookieStore = await cookies()
    cookieStore.delete('accessToken')
    cookieStore.delete('authjs.session-token')
    cookieStore.delete('__Secure-authjs.session-token')
    cookieStore.delete('authjs.callback-url')
    cookieStore.delete('__Secure-authjs.callback-url')
    cookieStore.delete('authjs.csrf-token')
    cookieStore.delete('__Secure-authjs.csrf-token')

    redirect(appConfig.unAuthenticatedEntryPath)
}

export default handleSignOut
