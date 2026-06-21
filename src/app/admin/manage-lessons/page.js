'use client';

import { useEffect, useState } from 'react';
import { Search, Trash2, Star, CheckCircle, Eye } from 'lucide-react';
import { adminService } from '@/services';
import { formatDateShort } from '@/utils';
import toast from 'react-hot-toast';

export default function ManageLessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLessons = async () => {
    try {
      const data = await adminService.getLessons({ search });
      setLessons(data.lessons || []);
    } catch { toast.error('Failed to load lessons'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLessons(); }, [search]);

  const handleFeature = async (id) => {
    try {
      const data = await adminService.toggleFeature(id);
      setLessons(lessons.map((l) => l._id === id ? { ...l, isFeatured: data.isFeatured } : l));
      toast.success(data.message);
    } catch { toast.error('Failed to toggle feature'); }
  };

  const handleReview = async (id) => {
    try {
      await adminService.reviewLesson(id);
      setLessons(lessons.map((l) => l._id === id ? { ...l, isReviewed: true } : l));
      toast.success('Lesson reviewed');
    } catch { toast.error('Failed to review'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this lesson?')) return;
    try {
      await adminService.deleteLesson(id);
      setLessons(lessons.filter((l) => l._id !== id));
      toast.success('Lesson deleted');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Lessons</h2>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search lessons..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white" />
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />)}</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Lesson</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Category</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Author</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((l) => (
                  <tr key={l._id} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <td className="p-4">
                      <p className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">{l.title}</p>
                      <p className="text-xs text-gray-500">{formatDateShort(l.createdAt)} • <Eye size={10} className="inline" /> {l.viewsCount}</p>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{l.category}</td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{l.creatorName}</td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {l.isFeatured && <span className="px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-full">Featured</span>}
                        {l.isReviewed && <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full">Reviewed</span>}
                        {l.accessLevel === 'premium' && <span className="px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full">Premium</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleFeature(l._id)} className={`p-1.5 ${l.isFeatured ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500`} title="Feature"><Star size={16} /></button>
                        {!l.isReviewed && <button onClick={() => handleReview(l._id)} className="p-1.5 text-gray-400 hover:text-green-500" title="Review"><CheckCircle size={16} /></button>}
                        <button onClick={() => handleDelete(l._id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
