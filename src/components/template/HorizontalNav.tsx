'use client'

import HorizontalMenuContent from './HorizontalMenuContent'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import useNavigation from '@/utils/hooks/useNavigation'
import queryRoute from '@/utils/queryRoute'
import { usePathname } from 'next/navigation'

const HorizontalNav = () => {
    const pathname = usePathname()

    const route = queryRoute(pathname)

    const currentRouteKey = route?.key || ''

    const { session } = useCurrentSession()

    const { navigationTree } = useNavigation()

    return (
        <HorizontalMenuContent
            navigationTree={navigationTree}
            routeKey={currentRouteKey}
            userAuthority={session?.user?.authority || []}
        />
    )
}

export default HorizontalNav
