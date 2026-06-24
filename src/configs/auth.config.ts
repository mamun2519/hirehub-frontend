import type { NextAuthConfig } from 'next-auth'
import validateCredential from '../server/actions/user/validateCredential'
import Credentials from 'next-auth/providers/credentials'
import Github from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

import type { SignInCredential } from '@/@types/auth'

export default {
    trustHost: true,
    providers: [
        Github({
            clientId: process.env.GITHUB_AUTH_CLIENT_ID,
            clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET,
        }),
        Google({
            clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                /** validate credentials from backend here */
                const user = await validateCredential(
                    credentials as SignInCredential,
                )
                if (!user) {
                    return null
                }
                return {
                    id: user.id,
                    name: user.userName,
                    email: user.email,
                    image: user.avatar,
                    authority: user.authority,
                }
            },
        }),
    ],
    callbacks: {
        async redirect({ url, baseUrl }) {
            let currentBaseUrl = baseUrl
            if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
                currentBaseUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
            } else if (process.env.VERCEL_URL) {
                currentBaseUrl = `https://${process.env.VERCEL_URL}`
            }

            try {
                const parsedUrl = new URL(url)
                const parsedBase = new URL(currentBaseUrl)
                if (
                    parsedUrl.origin === parsedBase.origin ||
                    parsedUrl.origin.includes('localhost') ||
                    parsedUrl.origin.includes('vercel.app')
                ) {
                    return `${parsedBase.origin}${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`
                }
            } catch {
                if (url.startsWith('/')) {
                    return `${currentBaseUrl}${url}`
                }
            }
            return currentBaseUrl
        },
        async jwt({ token, user }) {
            // Persist the authority and accessToken to the token right after signin
            if (user) {
                token.authority = user.authority
                token.accessToken = (user as any).accessToken
                token.avatar = user.image
            }
            return token
        },
        async session({ session, token }) {
            // Send properties to the client
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.sub,
                    authority: token.authority as string[],
                    accessToken: token.accessToken as string,
                    avatar: token.avatar as string | undefined,
                },
            }
        },
    },
} satisfies NextAuthConfig
