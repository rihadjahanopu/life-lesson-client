'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Bookmark, Eye, Clock, Share2, Flag, Lock, Crown, Send, ArrowLeft, FileDown, Smile } from 'lucide-react';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, LinkedinShareButton, FacebookIcon, TwitterIcon, WhatsappIcon, LinkedinIcon } from 'react-share';
import jsPDF from 'jspdf';
import EmojiPicker from 'emoji-picker-react';
import { lessonService, favoriteService, commentService, reportService, paymentService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { formatDate, getReadingTime } from '@/utils';
import LessonCard from '@/components/LessonCard';
import { DetailSkeleton } from '@/components/Skeleton';
import toast from 'react-hot-toast';

export default function LessonDetailsPage() {
  const params = useParams();
  const { user } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [relatedLessons, setRelatedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [showCommentEmoji, setShowCommentEmoji] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const data = await lessonService.getLesson(params.id);
        setLesson(data.lesson);
        setIsLiked(data.isLiked);
        setIsFavorited(data.isFavorited);

        const [commentsData, relatedData] = await Promise.all([
          commentService.getByLesson(params.id).catch(() => ({ comments: [] })),
          lessonService.getRelated(params.id).catch(() => ({ lessons: [] })),
        ]);
        setComments(commentsData.comments || []);
        setRelatedLessons(relatedData.lessons || []);
      } catch {
        toast.error('Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [params.id]);

  const handleExportPDF = () => {
    if (lesson.accessLevel === 'premium' && !user?.isPremium) {
      toast.error('Please upgrade to premium to download this lesson');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let y = margin;

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    const titleLines = doc.splitTextToSize(lesson.title, maxWidth);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 10 + 5;

    // Meta info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text(`By ${lesson.creatorName || 'Unknown'} • ${formatDate(lesson.createdAt)} • ${lesson.category} • ${lesson.emotionalTone}`, margin, y);
    y += 10;

    // Divider
    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // Content
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50);
    const contentLines = doc.splitTextToSize(lesson.description, maxWidth);

    for (let i = 0; i < contentLines.length; i++) {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(contentLines[i], margin, y);
      y += 7;
    }

    // Footer
    y += 10;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Generated from Digital Life Lessons', margin, y);

    doc.save(`${lesson.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
    toast.success('PDF downloaded!');
  };

  const handleLike = async () => {
    if (!user) return toast.error('Please login to like');
    try {
      const data = await lessonService.toggleLike(params.id);
      setIsLiked(data.liked);
      setLesson((prev) => ({ ...prev, likesCount: data.likesCount }));
    } catch { toast.error('Failed to like'); }
  };

  const handleFavorite = async () => {
    if (!user) return toast.error('Please login to save');
    try {
      const data = await favoriteService.toggle(params.id);
      setIsFavorited(data.favorited);
      toast.success(data.message);
    } catch { toast.error('Failed to save'); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const data = await commentService.add(params.id, commentText);
      setComments([data.comment, ...comments]);
      setCommentText('');
      toast.success('Comment added');
    } catch { toast.error('Failed to add comment'); }
  };

  const handleCommentEmoji = (emojiData) => {
    const emoji = emojiData?.emoji || '';
    if (emoji) {
      setCommentText((prev) => prev + emoji);
    }
    setShowCommentEmoji(false);
  };

  const handleUpgrade = async () => {
    try {
      const data = await paymentService.createCheckout();
      window.location.href = data.url;
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to create checkout session';
      toast.error(msg);
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    if (!reportReason.trim()) return;
    try {
      await reportService.report(params.id, reportReason);
      toast.success('Report submitted');
      setShowReport(false);
      setReportReason('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to report');
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-10"><DetailSkeleton /></div>;
  if (!lesson) return <div className="text-center py-20"><p className="text-gray-500">Lesson not found</p></div>;

  const isLocked = lesson.accessLevel === 'premium' && !user?.isPremium;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/lessons" className="inline-flex items-center gap-2 text-gray-500 hover:text-violet-600 mb-6">
        <ArrowLeft size={18} /> Back to Lessons
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {lesson.image && (
          <div className="relative rounded-2xl overflow-hidden mb-8 h-64 md:h-80">
            <img src={lesson.image} alt={lesson.title} className={`w-full h-full object-cover ${isLocked ? 'blur-md' : ''}`} />
            {isLocked && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <Lock size={48} className="mx-auto mb-3" />
                  <p className="text-lg font-semibold">Premium Content</p>
                  <button onClick={handleUpgrade} className="mt-3 inline-flex items-center gap-2 px-6 py-2 bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-400">
                    <Crown size={16} /> Upgrade to Premium
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full">{lesson.category}</span>
          <span className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">{lesson.emotionalTone}</span>
          {lesson.accessLevel === 'premium' && <span className="px-3 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full flex items-center gap-1"><Crown size={12} /> Premium</span>}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{lesson.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <div className="flex items-center gap-2">
            {lesson.creatorPhoto ? <img src={lesson.creatorPhoto} alt="" className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center text-sm text-violet-600">{lesson.creatorName?.[0]}</div>}
            <span>{lesson.creatorName}</span>
          </div>
          <span>{formatDate(lesson.createdAt)}</span>
          <span className="flex items-center gap-1"><Clock size={14} /> {getReadingTime(lesson.description)}</span>
          <span className="flex items-center gap-1"><Eye size={14} /> {lesson.viewsCount} views</span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isLiked ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
            <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} /> {lesson.likesCount}
          </button>
          <button onClick={handleFavorite} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isFavorited ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
            <Bookmark size={18} fill={isFavorited ? 'currentColor' : 'none'} /> Save
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <FacebookShareButton url={shareUrl}><FacebookIcon size={32} round /></FacebookShareButton>
            <TwitterShareButton url={shareUrl}><TwitterIcon size={32} round /></TwitterShareButton>
            <LinkedinShareButton url={shareUrl}><LinkedinIcon size={32} round /></LinkedinShareButton>
            <WhatsappShareButton url={shareUrl}><WhatsappIcon size={32} round /></WhatsappShareButton>
          </div>
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <FileDown size={18} /> PDF
          </button>
          {user && <button onClick={() => setShowReport(!showReport)} className="p-2 text-gray-400 hover:text-red-500"><Flag size={18} /></button>}
        </div>

        {/* Report form */}
        {showReport && (
          <form onSubmit={handleReport} className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800">
            <textarea value={reportReason} onChange={(e) => setReportReason(e.target.value)} placeholder="Why are you reporting this lesson?" rows={3}
              className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none" />
            <div className="flex gap-2 mt-2">
              <button type="submit" className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">Submit Report</button>
              <button type="button" onClick={() => setShowReport(false)} className="px-4 py-2 text-sm text-gray-500">Cancel</button>
            </div>
          </form>
        )}

        {/* Content */}
        <div className={`prose prose-lg dark:prose-invert max-w-none ${isLocked ? 'blur-sm select-none pointer-events-none' : ''}`}>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{lesson.description}</p>
        </div>

        {/* Comments */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Comments ({lesson.commentsCount})</h2>

          {user && (
            <form onSubmit={handleComment} className="mb-8">
              <div className="flex gap-3 items-center">
                <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a comment..."
                  className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white" />
                <button type="button" onClick={() => setShowCommentEmoji(!showCommentEmoji)}
                  className={`p-3 rounded-xl border transition-colors ${showCommentEmoji ? 'bg-violet-100 dark:bg-violet-900 border-violet-300 dark:border-violet-700 text-violet-600' : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 hover:text-violet-500 hover:border-violet-300'}`}>
                  <Smile size={20} />
                </button>
                <button type="submit" className="px-4 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700"><Send size={18} /></button>
              </div>
              {showCommentEmoji && (
                <div className="mt-2">
                  <EmojiPicker onEmojiClick={handleCommentEmoji} width="100%" height={400} />
                </div>
              )}
            </form>
          )}

          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c._id} className="flex gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                {c.userPhoto ? <img src={c.userPhoto} alt="" className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center text-sm text-violet-600">{c.userName?.[0]}</div>}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-gray-900 dark:text-white">{c.userName}</span>
                    <span className="text-xs text-gray-400">{formatDate(c.createdAt)}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{c.text}</p>
                </div>
              </div>
            ))}
            {comments.length === 0 && <p className="text-gray-500 text-sm">No comments yet.</p>}
          </div>
        </div>

        {/* Related Lessons */}
        {relatedLessons.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Related Lessons</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedLessons.map((l, i) => <LessonCard key={l._id} lesson={l} index={i} />)}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
