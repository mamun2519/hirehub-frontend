import adminNavigationConfig from './admin.config'
import recruiterNavigationConfig from './recruiter.config'
import candidateNavigationConfig from './candidate.config'
import { ADMIN, RECRUITER, CANDIDATE } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

export {
    adminNavigationConfig,
    recruiterNavigationConfig,
    candidateNavigationConfig,
}

export function getNavigationConfig(role?: string): NavigationTree[] {
    switch (role) {
        case ADMIN:
            return adminNavigationConfig
        case RECRUITER:
            return recruiterNavigationConfig
        case CANDIDATE:
            return candidateNavigationConfig
        default:
            // Return candidate navigation as standard default
            return candidateNavigationConfig
    }
}

const navigationConfig = getNavigationConfig()

export default navigationConfig

