'use client'

import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import signOut from '@/server/actions/auth/handleSignOut'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import { PiUserDuotone, PiSignOutDuotone, PiGearDuotone, PiHouseDuotone } from 'react-icons/pi'
import appConfig from '@/configs/app.config'

import type { JSX } from 'react'

type DropdownList = {
    label: string
    path: string
    icon: JSX.Element
}

const dashboardItem: DropdownList = {
    label: 'Dashboard',
    path: '/portal',
    icon: <PiHouseDuotone />,
}

const portalDropdownItemList: DropdownList[] = [
    {
        label: 'Settings',
        path: '/portal/settings',
        icon: <PiGearDuotone />,
    },
]

const _UserDropdown = () => {
    const pathname = usePathname()
    const { session } = useCurrentSession()

    const isPortalRoute = pathname.startsWith('/portal')
    const dropdownItemList = isPortalRoute
        ? portalDropdownItemList
        : [dashboardItem, ...portalDropdownItemList]

    const handleSignOut = async () => {
        const response = await signOut()
        if (response?.success) {
            window.location.href = appConfig.unAuthenticatedEntryPath
        }
    }

    const displayAvatarSrc = session?.user?.avatar
        ? session.user.avatar.startsWith('http')
            ? session.user.avatar
            : `${appConfig.serverBaseUrl}${session.user.avatar}`
        : ''

    const avatarProps = {
        ...(displayAvatarSrc
            ? { src: displayAvatarSrc }
            : { icon: <PiUserDuotone /> }),
    }

    return (
        <Dropdown
            className="flex"
            toggleClassName="flex items-center"
            renderTitle={
                <div className="cursor-pointer flex items-center">
                    <Avatar size={32} {...avatarProps} />
                </div>
            }
            placement="bottom-end"
        >
            <Dropdown.Item variant="header">
                <div className="py-2 px-3 flex items-center gap-3">
                    <Avatar {...avatarProps} />
                    <div>
                        <div className="font-bold text-gray-900 dark:text-gray-100">
                            {session?.user?.name || 'Anonymous'}
                        </div>
                        <div className="text-xs">
                            {session?.user?.email || 'No email available'}
                        </div>
                    </div>
                </div>
            </Dropdown.Item>
            <Dropdown.Item variant="divider" />
            {dropdownItemList.map((item) => (
                <Dropdown.Item
                    key={item.label}
                    eventKey={item.label}
                    className="px-0"
                >
                    <Link className="flex h-full w-full px-2" href={item.path}>
                        <span className="flex gap-2 items-center w-full">
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.label}</span>
                        </span>
                    </Link>
                </Dropdown.Item>
            ))}
            <Dropdown.Item
                eventKey="Sign Out"
                className="gap-2"
                onClick={handleSignOut}
            >
                <span className="text-xl">
                    <PiSignOutDuotone />
                </span>
                <span>Sign Out</span>
            </Dropdown.Item>
        </Dropdown>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown
