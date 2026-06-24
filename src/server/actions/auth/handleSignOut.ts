'use server'

import { signOut } from '@/auth'
import appConfig from '@/configs/app.config'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

const handleSignOut = async () => {
    // Explicitly delete custom accessToken cookie
    const cookieStore = await cookies()
    cookieStore.delete('accessToken')

    // Perform NextAuth sign out and redirect to sign-in page
    await signOut({ redirectTo: '/sign-in' })
}

export default handleSignOut
