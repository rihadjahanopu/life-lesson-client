'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, Heart, ExternalLink } from 'lucide-react';
import { favoriteService } from '@/services';
import { formatDateShort } from '@/utils';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const data = await favoriteService.getMyFavorites();
      setFavorites(data.favorites || []);
    } catch { toast.error('Failed to load favorites'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFavorites(); }, []);

  const handleRemove = async (id) => {
    try {
      await favoriteService.remove(id);
      setFavorites(favorites.filter((f) => f._id !== id));
      toast.success('Removed from favorites');
    } catch { toast.error('Failed to remove'); }
  };

  if (loading) return <div className="animate-pulse space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />)}</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Favorites</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{favorites.length} saved lessons</p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <Heart size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No favorites yet. Save lessons you love!</p>
          <Link href="/lessons" className="inline-block mt-4 text-violet-600 font-medium hover:text-violet-700">Browse Lessons</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((fav) => {
            const lesson = fav.lessonId;
            if (!lesson) return null;
            return (
              <div key={fav._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-start gap-4">
                {lesson.image ? (
                  <img src={lesson.image} alt="" className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-pink-100 dark:bg-pink-900 flex items-center justify-center flex-shrink-0 text-pink-500 font-bold">DLL</div>
                )}
                <div className="flex-1 min-w-0">
                  <Link href={`/lessons/${lesson._id}`} className="font-semibold text-gray-900 dark:text-white hover:text-violet-600 line-clamp-1">{lesson.title}</Link>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{lesson.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>{lesson.category}</span>
                    <span>{lesson.creatorName}</span>
                    <span>{formatDateShort(lesson.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/lessons/${lesson._id}`} className="p-2 text-gray-400 hover:text-violet-600"><ExternalLink size={16} /></Link>
                  <button onClick={() => handleRemove(fav._id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
