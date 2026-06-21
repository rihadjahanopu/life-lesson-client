'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Heart, Eye, PlusCircle, Crown, TrendingUp, Flame, CalendarDays } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { lessonService, favoriteService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { formatDateShort, calculateStreak } from '@/utils';
import toast from 'react-hot-toast';

export default function DashboardHomePage() {
  const { user } = useAuth();
  const [myLessons, setMyLessons] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonsData, favsData] = await Promise.all([
          lessonService.getMyLessons(),
          favoriteService.getMyFavorites(),
        ]);
        setMyLessons(lessonsData.lessons || []);
        setFavorites(favsData.favorites || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalViews = myLessons.reduce((sum, l) => sum + (l.viewsCount || 0), 0);
  const totalLikes = myLessons.reduce((sum, l) => sum + (l.likesCount || 0), 0);

  // Chart data
  const categoryData = myLessons.reduce((acc, l) => {
    const existing = acc.find((a) => a.name === l.category);
    if (existing) existing.value++;
    else acc.push({ name: l.category, value: 1 });
    return acc;
  }, []);

  const monthlyData = myLessons.reduce((acc, l) => {
    const month = new Date(l.createdAt).toLocaleString('default', { month: 'short' });
    const existing = acc.find((a) => a.month === month);
    if (existing) existing.lessons++;
    else acc.push({ month, lessons: 1 });
    return acc;
  }, []);

  // Streak calculation
  const currentStreak = calculateStreak(myLessons);

  // Build heatmap data: last 15 weeks x 7 days
  const heatmapData = (() => {
    const weeks = 15;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (weeks * 7 - 1));

    // Count lessons per date
    const lessonCounts = {};
    myLessons.forEach((l) => {
      const date = new Date(l.createdAt);
      date.setHours(0, 0, 0, 0);
      const key = date.toISOString().split('T')[0];
      lessonCounts[key] = (lessonCounts[key] || 0) + 1;
    });

    const grid = [];
    for (let d = 0; d < weeks * 7; d++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + d);
      const key = date.toISOString().split('T')[0];
      grid.push({
        date: key,
        count: lessonCounts[key] || 0,
        dayOfWeek: date.getDay(),
      });
    }
    return grid;
  })();

  const getHeatColor = (count) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-700';
    if (count === 1) return 'bg-violet-200 dark:bg-violet-900';
    if (count === 2) return 'bg-violet-400 dark:bg-violet-700';
    if (count === 3) return 'bg-violet-500 dark:bg-violet-600';
    return 'bg-violet-700 dark:bg-violet-500';
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Group heatmap into weeks (columns)
  const heatmapWeeks = [];
  for (let i = 0; i < heatmapData.length; i += 7) {
    heatmapWeeks.push(heatmapData.slice(i, i + 7));
  }

  const COLORS = ['#7c3aed', '#a855f7', '#c084fc', '#e879f9', '#f472b6', '#fb923c'];

  const stats = [
    { label: 'Total Lessons', value: myLessons.length, icon: BookOpen, color: 'violet' },
    { label: 'Total Favorites', value: favorites.length, icon: Heart, color: 'pink' },
    { label: 'Total Views', value: totalViews, icon: Eye, color: 'blue' },
    { label: 'Total Likes', value: totalLikes, icon: TrendingUp, color: 'green' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Welcome back, {user?.name}!</p>
        </div>
        <div className="flex items-center gap-3">
          {!user?.isPremium && (
            <Link href="/pricing" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-xl hover:from-yellow-600 hover:to-orange-600 text-sm">
              <Crown size={16} /> Upgrade
            </Link>
          )}
          <Link href="/dashboard/add-lesson" className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 text-sm">
            <PlusCircle size={16} /> New Lesson
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className={`w-10 h-10 rounded-lg bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center mb-3`}>
              <Icon size={20} className={`text-${color}-600 dark:text-${color}-400`} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '...' : value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Streak + Activity Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Streak Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
            <Flame size={32} className="text-orange-500" />
          </div>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{loading ? '...' : currentStreak}</p>
          <p className="text-sm text-gray-500 mt-1">Day Streak</p>
          <p className="text-xs text-gray-400 mt-2">Keep creating lessons daily to maintain your streak!</p>
        </div>

        {/* Heatmap */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <CalendarDays size={18} /> Activity Heatmap
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span>Less</span>
              <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-700" />
              <div className="w-3 h-3 rounded-sm bg-violet-200 dark:bg-violet-900" />
              <div className="w-3 h-3 rounded-sm bg-violet-400 dark:bg-violet-700" />
              <div className="w-3 h-3 rounded-sm bg-violet-500 dark:bg-violet-600" />
              <div className="w-3 h-3 rounded-sm bg-violet-700 dark:bg-violet-500" />
              <span>More</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="flex gap-1 min-w-fit">
              {/* Day labels */}
              <div className="flex flex-col gap-1 mr-1">
                {dayLabels.map((day, i) => (
                  <div key={day} className="w-8 h-3.5 flex items-center justify-end pr-1">
                    {i % 2 === 1 && <span className="text-[10px] text-gray-400">{day}</span>}
                  </div>
                ))}
              </div>
              {/* Heatmap grid */}
              {heatmapWeeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((day) => (
                    <div
                      key={day.date}
                      className={`w-3.5 h-3.5 rounded-sm ${getHeatColor(day.count)} transition-colors`}
                      title={`${day.date}: ${day.count} lesson(s)`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Lessons by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name }) => name}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-sm text-center py-10">No data yet</p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Monthly Activity</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="lessons" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-sm text-center py-10">No data yet</p>
          )}
        </div>
      </div>

      {/* Recent Lessons */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Lessons</h3>
        {myLessons.length > 0 ? (
          <div className="space-y-3">
            {myLessons.slice(0, 5).map((l) => (
              <Link key={l._id} href={`/lessons/${l._id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{l.title}</p>
                  <p className="text-xs text-gray-500">{l.category} • {formatDateShort(l.createdAt)}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Eye size={12} /> {l.viewsCount}</span>
                  <span className="flex items-center gap-1"><Heart size={12} /> {l.likesCount}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-6">No lessons yet. Start by creating your first lesson!</p>
        )}
      </div>
    </div>
  );
}
