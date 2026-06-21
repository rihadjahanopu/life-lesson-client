'use client';

import { useEffect, useState } from 'react';
import { Users, BookOpen, Heart, Flag, Crown } from 'lucide-react';
import { adminService } from '@/services';
import { formatDateShort } from '@/utils';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentLessons, setRecentLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await adminService.getStats();
        setStats(data.stats);
        setRecentLessons(data.recentLessons || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'blue' },
    { label: 'Total Lessons', value: stats?.totalLessons || 0, icon: BookOpen, color: 'violet' },
    { label: 'Total Favorites', value: stats?.totalFavorites || 0, icon: Heart, color: 'pink' },
    { label: 'Reports', value: stats?.totalReports || 0, icon: Flag, color: 'red' },
    { label: 'Premium Users', value: stats?.premiumUsers || 0, icon: Crown, color: 'yellow' },
  ];

  if (loading) return <div className="animate-pulse space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />)}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <Icon size={24} className={`text-${color}-500 mb-3`} />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Lessons</h3>
        {recentLessons.length > 0 ? (
          <div className="space-y-3">
            {recentLessons.map((l) => (
              <div key={l._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{l.title}</p>
                  <p className="text-xs text-gray-500">{l.creatorName} • {l.category}</p>
                </div>
                <span className="text-xs text-gray-400">{formatDateShort(l.createdAt)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-6">No lessons yet</p>
        )}
      </div>
    </div>
  );
}
