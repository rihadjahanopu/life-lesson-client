'use client';

import { NAV_LINKS } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, ChevronDown, Crown, Heart, LayoutDashboard, LogOut, Menu, Moon, PlusCircle, Sun, User, UserCircle, X, Users, Flag, Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const dashboardLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/add-lesson', label: 'Add Lesson', icon: PlusCircle },
  { href: '/dashboard/my-lessons', label: 'My Lessons', icon: BookOpen },
  { href: '/dashboard/favorites', label: 'My Favorites', icon: Heart },
  { href: '/dashboard/profile', label: 'Profile', icon: UserCircle },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dashboardDropdown, setDashboardDropdown] = useState(false);
  const { user, loading, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const pathname = usePathname();

  const isOnDashboard = pathname?.startsWith('/dashboard');
  const isOnAdmin = pathname?.startsWith('/admin');

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Digital Life Lessons Logo" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-bold text-lg text-gray-900 dark:text-white hidden sm:block">
              Digital Life Lessons
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors font-medium ${
                  pathname === link.href
                    ? 'text-violet-600 dark:text-violet-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Dashboard dropdown - only for logged in users */}
            {!loading && user && (
              <div className="relative"
                onMouseEnter={() => setDashboardDropdown(true)}
                onMouseLeave={() => setDashboardDropdown(false)}
              >
                <button
                  className={`flex items-center gap-1 transition-colors font-medium ${
                    isOnDashboard
                      ? 'text-violet-600 dark:text-violet-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400'
                  }`}
                >
                  Dashboard <ChevronDown size={14} className={`transition-transform ${dashboardDropdown ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dashboardDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg py-2 z-50"
                    >
                      {dashboardLinks.map(({ href, label, icon: Icon }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setDashboardDropdown(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                            pathname === href
                              ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 font-medium'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <Icon size={16} />
                          {label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Admin Panel Link - only for admins */}
            {!loading && user && user.role === 'admin' && (
              <Link
                href="/admin"
                className={`transition-colors font-medium ${
                  isOnAdmin
                    ? 'text-red-600 dark:text-red-400 font-semibold'
                    : 'text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                }`}
              >
                Admin Panel
              </Link>
            )}
          </div>


          <div className="flex items-center gap-3">
            {!loading && user && !user.isPremium && (
              <Link
                href="/pricing"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-sm"
              >
                <Crown size={14} />
                Upgrade
              </Link>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {!loading && user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.name} className="w-6 h-6 rounded-full" />
                  ) : (
                    <User size={16} />
                  )}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.name}
                  </span>
                  {user.isPremium && <Crown size={14} className="text-yellow-500" />}
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : !loading ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all"
                >
                  Register
                </Link>
              </div>
            ) : null}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
          >
            <div className="px-4 py-3 space-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-2 transition-colors ${
                    pathname === link.href
                      ? 'text-violet-600 font-medium'
                      : 'text-gray-600 dark:text-gray-300 hover:text-violet-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!loading && user ? (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 py-1">Dashboard</p>
                  {dashboardLinks.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 py-2 px-2 rounded-lg transition-colors ${
                        pathname === href
                          ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 font-medium'
                          : 'text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <Icon size={16} />
                      {label}
                    </Link>
                  ))}

                  {user.role === 'admin' && (
                    <>
                      <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                      <Link
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 py-2 px-2 rounded-lg transition-colors ${
                          pathname?.startsWith('/admin')
                            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium'
                            : 'text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        <Crown size={16} />
                        Admin Panel
                      </Link>
                    </>
                  )}

                  <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

                  {!user.isPremium && (
                    <Link
                      href="/pricing"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 py-2 px-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium"
                    >
                      <Crown size={16} /> Upgrade to Premium
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-2 py-2 px-2 text-red-500"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : !loading ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-gray-600 dark:text-gray-300"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-violet-600 font-medium"
                  >
                    Register
                  </Link>
                </>
              ) : null}


            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
