'use client';

import { useStore } from '@/lib/store';
import { Folder, FileText, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { folders, stories } = useStore();

  const totalFolders = folders.length;
  const totalStories = stories.length;
  const readyStories = stories.filter(s => s.status === 'ready').length;
  const draftStories = stories.filter(s => s.status === 'draft').length;

  const stats = [
    { name: 'إجمالي المجلدات', value: totalFolders, icon: Folder, color: 'bg-blue-500' },
    { name: 'القصص المكتوبة', value: totalStories, icon: FileText, color: 'bg-indigo-500' },
    { name: 'جاهز للنشر', value: readyStories, icon: CheckCircle, color: 'bg-emerald-500' },
    { name: 'قيد الكتابة (مسودة)', value: draftStories, icon: Clock, color: 'bg-amber-500' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-2">مرحباً بك في سـردة 👋</h1>
        <p className="text-lg text-slate-600">
          مركز القيادة الخاص بك لإدارة المحتوى الصوتي والقصصي. ابدأ بكتابة قصتك التالية!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4"
          >
            <div className={`${stat.color} p-4 rounded-xl text-white`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.name}</p>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-slate-100"
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-4">نظرة سريعة</h2>
        <p className="text-slate-600 leading-relaxed">
          سـردة هو نظام متكامل مصمم خصيصاً لصناع المحتوى. يمكنك البدء بإنشاء مجلد جديد من قسم <strong>إدارة المحتوى</strong>، ثم إضافة نصوصك وقصصك داخله. استخدم <strong>المحرر الذكي</strong> لتنسيق نصوصك، وحدد حالة كل نص وتاريخ نشره لمتابعته لاحقاً في <strong>جدول النشر</strong>.
        </p>
      </motion.div>
    </div>
  );
}
