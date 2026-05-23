import Link from 'next/link'
import { Button } from '@/components/ui'
import { PiPlusBold } from 'react-icons/pi'

interface JobsHeroBannerProps {
    role?: string
}

export default function JobsHeroBanner({ role }: JobsHeroBannerProps) {
    const isAdmin = role === 'admin'
    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl">
            {/* Decorative glows */}
            <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                        {isAdmin ? 'Admin Portal' : 'Recruiter Portal'}
                    </span>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-3 mb-2 text-white">
                        {isAdmin ? 'Platform Vacancies Monitor' : 'Job Posting Dashboard'}
                    </h1>
                    <p className="text-slate-300 max-w-xl text-xs md:text-sm leading-relaxed">
                        {isAdmin
                            ? 'Monitor all platform-wide vacancies, active listing categories, location metrics, and overall recruitment pipeline stats.'
                            : 'Publish new career opportunities, track status, filter and manage recruiter vacancies seamlessly.'}
                    </p>
                </div>

                {!isAdmin && (
                    <div>
                        <Link href="/portal/jobs/new">
                            <Button
                                variant="solid"
                                className="bg-gray-200 hover:bg-gray-300 text-primary font-semibold rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center gap-2 px-5 py-2.5"
                            >
                                <PiPlusBold className="text-base" />
                                Post a Job
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
