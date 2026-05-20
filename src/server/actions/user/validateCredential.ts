'use server'

import type { SignInCredential } from '@/@types/auth'
import appConfig from '@/configs/app.config'
import axios from 'axios'
import { cookies } from 'next/headers'

const validateCredential = async (values: SignInCredential) => {
    const { email, password } = values

    try {
        const response = await axios.post(
            `${appConfig.serverBaseUrl}${appConfig.apiPrefix}/auth/signin`,
            { email, password }
        )
        const result = response.data
        if (result && result.success && result.data) {
            const { user, accessToken } = result.data

            // Set the accessToken cookie so the client side can read it
            const cookieStore = await cookies()
            cookieStore.set('accessToken', accessToken, {
                path: '/',
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
            })

            return {
                id: user.id,
                userName: user.name || user.email.split('@')[0],
                email: user.email,
                avatar: user.avatar || '',
                authority: [user.role],
                accessToken,
            }
        }
    } catch (error: any) {
        console.error('Validation failed:', error?.response?.data || error.message)
    }

    return null
}

export default validateCredential
