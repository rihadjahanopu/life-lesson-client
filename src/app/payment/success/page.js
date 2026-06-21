'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Crown, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function PaymentSuccessPage() {
  const { refreshUser } = useAuth();

  useEffect(() => {
    // Stripe webhook takes a few seconds to process and update isPremium in DB.
    // We retry refreshUser multiple times to make sure we get the updated user.
    refreshUser();

    const delays = [2000, 5000, 10000]; // 2s, 5s, 10s এর পর আবার চেক করবে
    const timers = delays.map((delay) =>
      setTimeout(() => {
        refreshUser();
      }, delay)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Payment Successful!</h1>
        <div className="flex items-center justify-center gap-2 mb-4">
          <Crown size={24} className="text-yellow-500" />
          <span className="text-lg font-medium text-yellow-600">You&apos;re now a Premium member!</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          You now have access to all premium features including creating premium lessons and accessing premium content.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard" className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-purple-700">
            Go to Dashboard <ArrowRight size={18} />
          </Link>
          <Link href="/lessons" className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700">
            Browse Lessons
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
