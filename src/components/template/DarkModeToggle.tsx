'use client'

import withHeaderItem from '@/utils/hoc/withHeaderItem'
import useTheme from '@/utils/hooks/useTheme'
import { PiSunDuotone, PiMoonDuotone } from 'react-icons/pi'
import classNames from '@/utils/classNames'

const _DarkModeToggle = ({ className }: { className?: string }) => {
    const mode = useTheme((state) => state.mode)
    const setMode = useTheme((state) => state.setMode)

    const toggleMode = () => {
        setMode(mode === 'dark' ? 'light' : 'dark')
    }

    return (
        <button
            className={classNames(
                'text-2xl cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 outline-none focus:outline-none flex items-center justify-center',
                className
            )}
            onClick={toggleMode}
            aria-label="Toggle Dark Mode"
        >
            {mode === 'dark' ? (
                <PiSunDuotone className="text-amber-500 transition-transform duration-300 hover:rotate-45" />
            ) : (
                <PiMoonDuotone className="text-slate-700 dark:text-slate-300 transition-transform duration-300 hover:-rotate-12" />
            )}
        </button>
    )
}

const DarkModeToggle = withHeaderItem(_DarkModeToggle)

export default DarkModeToggle
