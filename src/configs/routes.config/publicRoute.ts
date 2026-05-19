import type { Routes } from '@/@types/routes'

const publicRoute: Routes = {
    '/': {
        key: 'home',
        authority: [],
    },
    '/home': {
        key: 'home',
        authority: [],
    },
}

export default publicRoute
