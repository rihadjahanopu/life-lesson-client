'use client';

import Link from 'next/link';
import { XCircle, ArrowLeft, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <XCircle size={80} className="text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Payment Cancelled</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Your payment was cancelled. You can try again anytime to unlock premium features.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard" className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-purple-700">
            <Crown size={18} /> Try Again
          </Link>
          <Link href="/" className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700">
            <ArrowLeft size={18} /> Go Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
