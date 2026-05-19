import {
    PiHouseLineDuotone,
    PiArrowsInDuotone,
    PiBookOpenUserDuotone,
    PiBookBookmarkDuotone,
    PiAcornDuotone,
    PiBagSimpleDuotone,
    PiMagnifyingGlassDuotone,
    PiUserDuotone,
    PiGearDuotone,
    PiPlusCircleDuotone,
    PiBriefcaseDuotone,
    PiFileTextDuotone,
    PiUsersDuotone,
} from 'react-icons/pi'
import type { JSX } from 'react'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <PiHouseLineDuotone />,
    singleMenu: <PiAcornDuotone />,
    collapseMenu: <PiArrowsInDuotone />,
    groupSingleMenu: <PiBookOpenUserDuotone />,
    groupCollapseMenu: <PiBookBookmarkDuotone />,
    groupMenu: <PiBagSimpleDuotone />,
    // Role-specific navigation icons
    findJobs: <PiMagnifyingGlassDuotone />,
    appliedJobs: <PiBookBookmarkDuotone />,
    profile: <PiUserDuotone />,
    settings: <PiGearDuotone />,
    postJob: <PiPlusCircleDuotone />,
    jobs: <PiBriefcaseDuotone />,
    applications: <PiFileTextDuotone />,
    users: <PiUsersDuotone />,
}

export default navigationIcon

