'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Bookmark, Eye, Lock, Crown, Clock } from 'lucide-react';
import { truncateText, formatDateShort, getReadingTime } from '@/utils';
import { useAuth } from '@/context/AuthContext';

export default function LessonCard({ lesson, index = 0 }) {
  const { user } = useAuth();
  const isLocked = lesson.accessLevel === 'premium' && !user?.isPremium;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={`/lessons/${lesson._id}`}>
        <div className="group relative h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300">
          {lesson.image ? (
            <div className="relative h-48 overflow-hidden">
              <img
                src={lesson.image}
                alt={lesson.title}
                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isLocked ? 'blur-sm' : ''}`}
              />
              {isLocked && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Lock size={32} className="mx-auto mb-2" />
                    <p className="text-sm font-medium">Premium Content</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-48 bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-4xl font-bold text-white/30">DLL</span>
            </div>
          )}

          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full">
                {lesson.category}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                {lesson.emotionalTone}
              </span>
              {lesson.accessLevel === 'premium' && (
                <Crown size={14} className="text-yellow-500" />
              )}
            </div>

            <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              {lesson.title}
            </h3>

            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">
              {isLocked ? 'Upgrade to premium to read this lesson...' : truncateText(lesson.description)}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-400 dark:text-gray-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Heart size={14} /> {lesson.likesCount}
                </span>
                <span className="flex items-center gap-1">
                  <Bookmark size={14} /> {lesson.favoritesCount}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={14} /> {lesson.viewsCount}
                </span>
              </div>
              <span className="flex items-center gap-1 text-xs">
                <Clock size={12} /> {getReadingTime(lesson.description)}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              {lesson.creatorPhoto ? (
                <img src={lesson.creatorPhoto} alt="" className="w-6 h-6 rounded-full" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center text-xs text-violet-600 dark:text-violet-300 font-medium">
                  {lesson.creatorName?.[0]}
                </div>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {lesson.creatorName}
              </span>
              <span className="text-xs text-gray-400 ml-auto">
                {formatDateShort(lesson.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
