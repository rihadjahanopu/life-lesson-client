'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit2, Trash2, Eye, Heart, Bookmark } from 'lucide-react';
import { lessonService } from '@/services';
import { formatDateShort } from '@/utils';
import toast from 'react-hot-toast';

export default function MyLessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLessons = async () => {
    try {
      const data = await lessonService.getMyLessons();
      setLessons(data.lessons || []);
    } catch { toast.error('Failed to load lessons'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLessons(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await lessonService.deleteLesson(id);
      setLessons(lessons.filter((l) => l._id !== id));
      toast.success('Lesson deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleToggleVisibility = async (lesson) => {
    try {
      const formData = new FormData();
      formData.append('visibility', lesson.visibility === 'public' ? 'private' : 'public');
      const data = await lessonService.updateLesson(lesson._id, formData);
      setLessons(lessons.map((l) => l._id === lesson._id ? data.lesson : l));
      toast.success(`Lesson is now ${data.lesson.visibility}`);
    } catch { toast.error('Failed to update'); }
  };

  if (loading) return <div className="animate-pulse space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />)}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Lessons</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{lessons.length} lessons created</p>
        </div>
        <Link href="/dashboard/add-lesson" className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-xl hover:bg-violet-700">
          + New Lesson
        </Link>
      </div>

      {lessons.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <Bookmark size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No lessons yet. Create your first one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {lessons.map((lesson) => (
            <div key={lesson._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-start gap-4">
              {lesson.image ? (
                <img src={lesson.image} alt="" className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center flex-shrink-0 text-violet-500 font-bold">DLL</div>
              )}
              <div className="flex-1 min-w-0">
                <Link href={`/lessons/${lesson._id}`} className="font-semibold text-gray-900 dark:text-white hover:text-violet-600 line-clamp-1">{lesson.title}</Link>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="px-2 py-0.5 text-xs bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 rounded-full">{lesson.category}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${lesson.visibility === 'public' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                    {lesson.visibility}
                  </span>
                  {lesson.accessLevel === 'premium' && <span className="px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-full">Premium</span>}
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Eye size={12} /> {lesson.viewsCount}</span>
                  <span className="flex items-center gap-1"><Heart size={12} /> {lesson.likesCount}</span>
                  <span className="flex items-center gap-1"><Bookmark size={12} /> {lesson.favoritesCount}</span>
                  <span>{formatDateShort(lesson.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/dashboard/edit-lesson/${lesson._id}`} className="p-2 text-gray-400 hover:text-violet-600" title="Edit lesson">
                  <Edit2 size={16} />
                </Link>
                <button onClick={() => handleToggleVisibility(lesson)} className="p-2 text-gray-400 hover:text-green-600" title="Toggle visibility">
                  <span className={`text-xs font-medium ${lesson.visibility === 'public' ? 'text-green-500' : 'text-gray-400'}`}>
                    {lesson.visibility === 'public' ? 'Public' : 'Private'}
                  </span>
                </button>
                <button onClick={() => handleDelete(lesson._id)} className="p-2 text-gray-400 hover:text-red-500" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
