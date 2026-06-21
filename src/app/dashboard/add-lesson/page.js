'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ImagePlus, Crown, Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { lessonService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { CATEGORIES, EMOTIONAL_TONES } from '@/constants';
import toast from 'react-hot-toast';

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  emotionalTone: z.string().min(1, 'Emotional tone is required'),
  visibility: z.enum(['public', 'private']),
  accessLevel: z.enum(['free', 'premium']),
});

export default function AddLessonPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [descText, setDescText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { visibility: 'public', accessLevel: 'free' },
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDescChange = (e) => {
    const val = e.target.value;
    setDescText(val);
    setValue('description', val, { shouldValidate: true });
  };

  const handleEmojiClick = (emojiData) => {
    const newText = descText + emojiData.emoji;
    setDescText(newText);
    setValue('description', newText, { shouldValidate: true });
    setShowEmoji(false);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, val]) => formData.append(key, val));
      if (imageFile) formData.append('image', imageFile);

      await lessonService.createLesson(formData);
      toast.success('Lesson created successfully!');
      router.push('/dashboard/my-lessons');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create lesson');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create New Lesson</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Share your wisdom with the world</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input {...register('title')} type="text" placeholder="Enter your lesson title"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <div className="relative">
              <textarea
                value={descText}
                onChange={handleDescChange}
                rows={8}
                placeholder="Write your lesson content..."
                className="w-full px-4 py-2.5 pb-10 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white resize-none"
              />
              <button type="button" onClick={() => setShowEmoji(!showEmoji)}
                className={`absolute bottom-3 right-3 p-2 rounded-lg transition-colors ${showEmoji ? 'bg-violet-100 dark:bg-violet-900 text-violet-600' : 'text-gray-400 hover:text-violet-500 hover:bg-gray-100 dark:hover:bg-gray-600'}`}>
                <Smile size={20} />
              </button>
              {showEmoji && (
                <div className="absolute bottom-12 right-0 z-50">
                  <EmojiPicker onEmojiClick={handleEmojiClick} width={300} height={400} />
                </div>
              )}
            </div>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select {...register('category')}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white">
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Emotional Tone</label>
              <select {...register('emotionalTone')}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white">
                <option value="">Select tone</option>
                {EMOTIONAL_TONES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.emotionalTone && <p className="text-red-500 text-xs mt-1">{errors.emotionalTone.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Visibility</label>
              <select {...register('visibility')}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white">
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Access Level</label>
              <select {...register('accessLevel')}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white">
                <option value="free">Free</option>
                <option value="premium" disabled={!user?.isPremium}>Premium {!user?.isPremium && '(Upgrade required)'}</option>
              </select>
              {!user?.isPremium && (
                <Link href="/pricing" className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 flex items-center gap-1 hover:underline">
                  <Crown size={12} /> Upgrade to create premium lessons
                </Link>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Image</label>
            <div className="relative">
              {imagePreview ? (
                <div className="relative h-48 rounded-xl overflow-hidden">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); }}
                    className="absolute top-2 right-2 px-3 py-1 bg-black/50 text-white text-sm rounded-lg hover:bg-black/70">Remove</button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-violet-400 transition-colors">
                  <ImagePlus size={32} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click to upload an image</p>
                  <p className="text-xs text-gray-400 mt-1">Max 5MB (JPG, PNG, GIF, WebP)</p>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => router.back()}
            className="px-6 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-xl hover:from-violet-700 hover:to-purple-700 disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Lesson'}
          </button>
        </div>
      </form>
    </div>
  );
}
