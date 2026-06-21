'use client';

import { useEffect, useState } from 'react';
import { Trash2, XCircle, ExternalLink, Flag } from 'lucide-react';
import { adminService } from '@/services';
import { formatDateShort } from '@/utils';
import toast from 'react-hot-toast';

export default function ReportedLessonsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const data = await adminService.getReports();
      setReports(data.reports || []);
    } catch { toast.error('Failed to load reports'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReports(); }, []);

  const handleIgnore = async (id) => {
    try {
      await adminService.deleteReport(id);
      setReports(reports.filter((r) => r._id !== id));
      toast.success('Report ignored');
    } catch { toast.error('Failed to ignore'); }
  };

  const handleDeleteLesson = async (lessonId, reportId) => {
    if (!confirm('Delete the reported lesson?')) return;
    try {
      await adminService.deleteLesson(lessonId);
      setReports(reports.filter((r) => r._id !== reportId));
      toast.success('Lesson deleted');
    } catch { toast.error('Failed to delete lesson'); }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Reported Lessons</h2>

      {loading ? (
        <div className="animate-pulse space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />)}</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <Flag size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No reports found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <div key={r._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Flag size={16} className="text-red-500" />
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{r.lessonId?.title || 'Deleted Lesson'}</p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{r.reason}</p>
                  <p className="text-xs text-gray-400">Reported by {r.reporterEmail} • {formatDateShort(r.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {r.lessonId && (
                    <>
                      <button onClick={() => handleIgnore(r._id)} className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500 hover:text-violet-600 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <XCircle size={14} /> Ignore
                      </button>
                      <button onClick={() => handleDeleteLesson(r.lessonId._id, r._id)} className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-500 hover:text-red-600 border border-red-200 dark:border-red-800 rounded-lg">
                        <Trash2 size={14} /> Delete Lesson
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
