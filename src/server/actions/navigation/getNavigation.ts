import { auth } from '@/auth'
import { getNavigationConfig } from '@/configs/navigation.config'

export async function getNavigation(role?: string) {
    let resolvedRole = role
    if (!resolvedRole) {
        const session = await auth()
        resolvedRole = session?.user?.authority?.[0]
    }
    return getNavigationConfig(resolvedRole)
}

