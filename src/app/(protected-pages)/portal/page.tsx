import { auth } from '@/auth'
import AdminPortal from './_components/AdminPortal'
import RecruiterPortal from './_components/RecruiterPortal'
import CandidatePortal from './_components/CandidatePortal'
import { ADMIN, RECRUITER, CANDIDATE } from '@/constants/roles.constant'

export default async function PortalPage() {
    const session = await auth()
    const role = session?.user?.authority?.[0]
    const user = {
        name: session?.user?.name || session?.user?.email?.split('@')[0] || '',
        email: session?.user?.email || '',
    }

    switch (role) {
        case ADMIN:
            return <AdminPortal user={user} />
        case RECRUITER:
            return <RecruiterPortal user={user} />
        case CANDIDATE:
            return <CandidatePortal user={user} />
        default:
            return <CandidatePortal user={user} />
    }
}

