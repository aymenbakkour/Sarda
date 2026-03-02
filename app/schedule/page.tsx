'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Calendar as CalendarIcon, Clock, FileText, CheckCircle, AlertCircle, Search, LayoutList, AlignJustify } from 'lucide-react';
import { format, isBefore, isToday, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import Link from 'next/link';
import { motion } from 'motion/react';

export default function SchedulePlanner() {
  const { stories, folders } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'detailed' | 'compact'>('detailed');

  // Filter stories that have a target date and sort them from oldest to newest
  const scheduledStories = stories
    .filter(s => s.targetDate && s.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" /> مسودة</span>;
      case 'ready':
        return <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" /> جاهز للنشر</span>;
      case 'published':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" /> منشور</span>;
      default:
        return null;
    }
  };

  const getFolderName = (folderId: string) => {
    return folders.find(f => f.id === folderId)?.name || 'مجلد محذوف';
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">جدول النشر</h1>
          <p className="text-slate-600">
            تتبع خطة النشر الخاصة بك. يتم عرض النصوص مرتبة زمنياً من الأقدم للأحدث.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث في الجدول..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-10 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shrink-0">
            <button
              onClick={() => setViewMode('detailed')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'detailed' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              title="عرض مفصل"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'compact' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              title="عرض مدمج"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {scheduledStories.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
          <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">لا توجد نصوص مجدولة</h3>
          <p className="text-slate-500 mb-6">قم بتحديد &quot;تاريخ النشر المستهدف&quot; لقصصك لتظهر هنا.</p>
          <Link
            href="/content"
            className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700"
          >
            الذهاب لإدارة المحتوى
          </Link>
        </div>
      ) : (
        <div className="relative border-r-2 border-slate-200 pr-8 space-y-8">
          {scheduledStories.map((story, index) => {
            const date = parseISO(story.targetDate);
            const isPast = isBefore(date, new Date()) && !isToday(date);
            const today = isToday(date);

            return (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className={`absolute -right-[41px] w-5 h-5 rounded-full border-4 border-white shadow-sm ${
                  today ? 'bg-indigo-500' : isPast ? 'bg-slate-400' : 'bg-emerald-500'
                }`} />

                <div className={`bg-white rounded-2xl p-4 sm:p-6 shadow-sm border transition-shadow hover:shadow-md ${
                  today ? 'border-indigo-200 ring-1 ring-indigo-50' : 'border-slate-200'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 sm:p-3 rounded-xl ${today ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-500'}`}>
                        <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">
                          {format(date, 'EEEE، d MMMM yyyy', { locale: ar })}
                        </h3>
                        {today && <span className="text-indigo-600 text-sm font-medium">اليوم</span>}
                      </div>
                    </div>
                    {getStatusBadge(story.status)}
                  </div>

                  <Link href={`/editor/${story.id}`} className="block group">
                    <div className={`bg-slate-50 rounded-xl border border-slate-100 group-hover:border-indigo-200 transition-colors ${viewMode === 'compact' ? 'p-3' : 'p-4'}`}>
                      <h4 className={`font-bold text-slate-800 group-hover:text-indigo-600 transition-colors ${viewMode === 'compact' ? 'text-base' : 'text-xl mb-2'}`}>
                        {story.title || 'بدون عنوان'}
                      </h4>
                      
                      {viewMode === 'detailed' && (
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <FileText className="w-4 h-4" />
                            <span>{getFolderName(story.folderId)}</span>
                          </div>
                          {story.publishTime && (
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              <span>{story.publishTime}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
