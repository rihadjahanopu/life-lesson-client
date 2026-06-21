'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, Check, Sparkles, Zap, Shield, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { paymentService } from '@/services';
import toast from 'react-hot-toast';

const features = [
  { icon: Star, text: 'Access all premium lessons' },
  { icon: Zap, text: 'Create premium content' },
  { icon: Shield, text: 'Priority support' },
  { icon: Sparkles, text: 'Exclusive premium badges' },
  { icon: Check, text: 'Unlimited favorites' },
  { icon: Check, text: 'Advanced analytics' },
  { icon: Check, text: 'Lifetime access — no recurring fees' },
];

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      toast.error('Please login first');
      router.push('/login');
      return;
    }
    if (user.isPremium) {
      toast('You are already a premium member!', { icon: '✨' });
      return;
    }
    setLoading(true);
    try {
      const data = await paymentService.createCheckout();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error('Failed to start checkout');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Payment error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-4">
            <Crown size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Upgrade to Premium
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Unlock exclusive content and premium features
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-violet-500 shadow-xl overflow-hidden">
          {/* Price */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-6 text-center">
            <p className="text-white/80 text-sm font-medium mb-1">One-Time Payment</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-bold text-white">&#2547;1500</span>
            </div>
            <p className="text-white/70 text-sm mt-1">Lifetime Access</p>
          </div>

          {/* Features */}
          <div className="px-8 py-6 space-y-4">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              What&apos;s included:
            </p>
            {features.map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center">
                  <Icon size={16} className="text-violet-600 dark:text-violet-400" />
                </div>
                <span className="text-gray-700 dark:text-gray-300">{text}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="px-8 pb-8">
            {user?.isPremium ? (
              <div className="w-full py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold rounded-xl text-center flex items-center justify-center gap-2">
                <Check size={18} /> You are already Premium
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 transition-all shadow-lg shadow-violet-500/25"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Crown size={18} />
                    Subscribe Now
                  </span>
                )}
              </button>
            )}
            <p className="text-center text-xs text-gray-400 mt-3">
              Pay once • Lifetime access • Secure payment via Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
