import Link from 'next/link';
import { Heart, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DL</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">Digital Life Lessons</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Share your wisdom, learn from others, and grow together through life&apos;s most valuable lessons.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/lessons" className="block text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 text-sm">
                Browse Lessons
              </Link>
              <Link href="/dashboard" className="block text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 text-sm">
                Dashboard
              </Link>
              <Link href="/register" className="block text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 text-sm">
                Get Started
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {['Relationships', 'Career', 'Health', 'Personal Growth'].map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            Made with <Heart size={14} className="text-red-500" /> by Digital Life Lessons
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
