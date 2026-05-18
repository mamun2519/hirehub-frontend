import Tooltip from '@/components/ui/Tooltip'
import Menu from '@/components/ui/Menu'
import AuthorityCheck from '@/components/shared/AuthorityCheck'
import VerticalMenuIcon from './VerticalMenuIcon'
import Link from 'next/link'
import Dropdown from '@/components/ui/Dropdown'
import type { CommonProps } from '@/@types/common'
import type { Direction } from '@/@types/theme'
import type { NavigationTree } from '@/@types/navigation'

const { MenuItem } = Menu

interface CollapsedItemProps extends CommonProps {
    nav: NavigationTree
    direction?: Direction
    onLinkClick?: (link: { key: string; title: string; path: string }) => void
    renderAsIcon?: boolean
    userAuthority: string[]
    currentKey?: string
    parentKeys?: string[]
}

interface DefaultItemProps {
    nav: NavigationTree
    onLinkClick?: (link: { key: string; title: string; path: string }) => void
    sideCollapsed?: boolean
    indent?: boolean
    userAuthority: string[]
    showIcon?: boolean
    showTitle?: boolean
}

interface VerticalMenuItemProps extends CollapsedItemProps, DefaultItemProps {}

const CollapsedItem = ({
    nav,
    children,
    direction,
    renderAsIcon,
    onLinkClick,
    userAuthority,
    currentKey,
}: CollapsedItemProps) => {
    return (
        <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
            {renderAsIcon ? (
                <Tooltip
                    title={nav.title}
                    placement={direction === 'rtl' ? 'left' : 'right'}
                >
                    {children}
                </Tooltip>
            ) : (
                <Dropdown.Item active={currentKey === nav.key}>
                    {nav.path ? (
                        <Link
                            className="h-full w-full flex items-center outline-hidden"
                            href={nav.path}
                            target={nav.isExternalLink ? '_blank' : ''}
                            onClick={() =>
                                onLinkClick?.({
                                    key: nav.key,
                                    title: nav.title,
                                    path: nav.path,
                                })
                            }
                        >
                            <span>{nav.title}</span>
                        </Link>
                    ) : (
                        <span>{nav.title}</span>
                    )}
                </Dropdown.Item>
            )}
        </AuthorityCheck>
    )
}

const DefaultItem = (props: DefaultItemProps) => {
    const {
        nav,
        onLinkClick,
        showTitle,
        indent,
        showIcon = true,
        userAuthority,
    } = props

    return (
        <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
            <MenuItem key={nav.key} eventKey={nav.key} dotIndent={indent}>
                <Link
                    href={nav.path}
                    className="flex items-center gap-2 h-full w-full"
                    target={nav.isExternalLink ? '_blank' : ''}
                    onClick={() =>
                        onLinkClick?.({
                            key: nav.key,
                            title: nav.title,
                            path: nav.path,
                        })
                    }
                >
                    {showIcon && <VerticalMenuIcon icon={nav.icon} />}
                    {showTitle && <span>{nav.title}</span>}
                </Link>
            </MenuItem>
        </AuthorityCheck>
    )
}

const VerticalSingleMenuItem = ({
    nav,
    onLinkClick,
    sideCollapsed,
    direction,
    indent,
    renderAsIcon,
    userAuthority,
    showIcon,
    showTitle,
    currentKey,
    parentKeys,
}: Omit<VerticalMenuItemProps, 'title'>) => {
    return (
        <>
            {sideCollapsed ? (
                <CollapsedItem
                    currentKey={currentKey}
                    parentKeys={parentKeys}
                    nav={nav}
                    direction={direction}
                    renderAsIcon={renderAsIcon}
                    userAuthority={userAuthority}
                    onLinkClick={onLinkClick}
                >
                    <DefaultItem
                        nav={nav}
                        sideCollapsed={sideCollapsed}
                        userAuthority={userAuthority}
                        showIcon={showIcon}
                        showTitle={showTitle}
                        onLinkClick={onLinkClick}
                    />
                </CollapsedItem>
            ) : (
                <DefaultItem
                    nav={nav}
                    sideCollapsed={sideCollapsed}
                    userAuthority={userAuthority}
                    showIcon={showIcon}
                    showTitle={showTitle}
                    indent={indent}
                    onLinkClick={onLinkClick}
                />
            )}
        </>
    )
}

export default VerticalSingleMenuItem
