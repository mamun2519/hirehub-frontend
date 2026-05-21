'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/template/Logo'
import useTheme from '@/utils/hooks/useTheme'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import UserDropdown from '@/components/template/UserProfileDropdown'
import Button from '@/components/ui/Button'
import { TbSun, TbMoon } from 'react-icons/tb'
import { HiMenu, HiX } from 'react-icons/hi'
import { FaGithub, FaTwitter, FaLinkedin, FaFacebook } from 'react-icons/fa'

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { session } = useCurrentSession()
    const mode = useTheme((state) => state.mode)
    const setMode = useTheme((state) => state.setMode)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const toggleTheme = () => {
        setMode(mode === 'dark' ? 'light' : 'dark')
    }

    const navLinks = [
        { label: 'Find Jobs', href: '#' },
        { label: 'Browse Companies', href: '#' },
        { label: 'Pricing', href: '#' },
        { label: 'About Us', href: '#' },
    ]

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Header / Navbar */}
            <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-gray-900/75 border-b border-gray-200/50 dark:border-gray-800/50 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link
                                href="/"
                                className="flex items-center gap-2"
                            >
                                <Logo imgClass="max-h-9" mode={mode} />
                            </Link>
                        </div>

                        {/* Desktop Navigation Links */}
                        <nav className="hidden md:flex space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors duration-200"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Right Actions (Theme + Auth) */}
                        <div className="hidden md:flex items-center space-x-4">
                            {/* Theme Toggle Button */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                                aria-label="Toggle theme"
                            >
                                {mode === 'dark' ? (
                                    <TbSun className="text-xl text-amber-400" />
                                ) : (
                                    <TbMoon className="text-xl" />
                                )}
                            </button>

                            {session ? (
                                <div className="flex items-center gap-4">
                                    <UserDropdown />
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link href="/sign-in">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white cursor-pointer px-3 py-2 transition-colors duration-200">
                                            Sign In
                                        </span>
                                    </Link>
                                    <Link href="/sign-up">
                                        <Button size="sm" variant="solid">
                                            Post a Job
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex md:hidden items-center space-x-2">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                            >
                                {mode === 'dark' ? (
                                    <TbSun className="text-lg text-amber-400" />
                                ) : (
                                    <TbMoon className="text-lg" />
                                )}
                            </button>

                            <button
                                onClick={() =>
                                    setMobileMenuOpen(!mobileMenuOpen)
                                }
                                className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                {mobileMenuOpen ? (
                                    <HiX className="text-2xl" />
                                ) : (
                                    <HiMenu className="text-2xl" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200/50 dark:border-gray-800/50 bg-white dark:bg-gray-900 px-4 pt-2 pb-6 space-y-3 transition-colors duration-300">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-2.5 rounded-xl text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-white transition-all duration-200"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="border-t border-gray-100 dark:border-gray-800 my-2 pt-2"></div>
                        {session ? (
                            <div className="px-3 flex flex-col gap-3">
                                <div className="flex items-center gap-3 py-2">
                                    <UserDropdown />
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        {session.user?.name || 'My Account'}
                                    </span>
                                </div>
                                <Link
                                    href="/portal"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Button block size="md" variant="solid">
                                        Go to Dashboard
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 px-3">
                                <Link
                                    href="/sign-in"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Button block variant="default">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link
                                    href="/sign-up"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Button block variant="solid">
                                        Post a Job
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </header>

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col">{children}</main>

            {/* Premium Multi-column Footer */}
            <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                        {/* Branding Column */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center gap-2">
                                <Logo imgClass="max-h-9" mode={mode} />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
                                Connecting elite talent with world-class
                                companies. Build your dream team or launch your
                                professional journey today.
                            </p>
                            {/* Social Icons */}
                            <div className="flex space-x-4 pt-2">
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
                                >
                                    <FaGithub className="text-lg" />
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
                                >
                                    <FaTwitter className="text-lg" />
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
                                >
                                    <FaLinkedin className="text-lg" />
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
                                >
                                    <FaFacebook className="text-lg" />
                                </a>
                            </div>
                        </div>

                        {/* Column 1: Candidates */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                                For Candidates
                            </h4>
                            <ul className="space-y-2">
                                {[
                                    'Explore Jobs',
                                    'Upload Resume',
                                    'Job Alerts',
                                    'Resources',
                                ].map((item) => (
                                    <li key={item}>
                                        <a
                                            href="#"
                                            className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors"
                                        >
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 2: Employers */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                                For Employers
                            </h4>
                            <ul className="space-y-2">
                                {[
                                    'Post a Job',
                                    'Browse Candidates',
                                    'Pricing Plans',
                                    'Enterprise',
                                ].map((item) => (
                                    <li key={item}>
                                        <a
                                            href="#"
                                            className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors"
                                        >
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 3: Legal & Support */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                                Company & Legal
                            </h4>
                            <ul className="space-y-2">
                                {[
                                    'About Us',
                                    'Contact Support',
                                    'Terms of Service',
                                    'Privacy Policy',
                                ].map((item) => (
                                    <li key={item}>
                                        <a
                                            href="#"
                                            className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors"
                                        >
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 dark:text-gray-500">
                        <div>
                            &copy; {new Date().getFullYear()} HireHub. All
                            rights reserved.
                        </div>
                        <div className="flex space-x-6">
                            <a
                                href="#"
                                className="hover:text-primary dark:hover:text-white transition-colors"
                            >
                                Security
                            </a>
                            <a
                                href="#"
                                className="hover:text-primary dark:hover:text-white transition-colors"
                            >
                                Cookies
                            </a>
                            <a
                                href="#"
                                className="hover:text-primary dark:hover:text-white transition-colors"
                            >
                                Sitemap
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
