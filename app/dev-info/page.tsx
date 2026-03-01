'use client';

import { useStore } from '@/lib/store';
import { Download, Upload, Info, Code, Database, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { useRef } from 'react';

export default function DevInfo() {
  const { folders, stories, importData } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = { folders, stories };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sarda-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.folders && data.stories) {
          if (confirm('سيتم استبدال جميع البيانات الحالية بالبيانات المستوردة. هل أنت متأكد؟')) {
            importData(data);
            alert('تم استيراد البيانات بنجاح!');
          }
        } else {
          alert('ملف النسخة الاحتياطية غير صالح.');
        }
      } catch (error) {
        alert('حدث خطأ أثناء قراءة الملف.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-2">حول المطور</h1>
        <p className="text-slate-600">
          معلومات عن مطور النظام وأدوات متقدمة لإدارة قاعدة البيانات.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Developer Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-indigo-100 p-4 rounded-2xl text-indigo-600">
              <Code className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">أيمن بكور</h2>
              <p className="text-slate-500 font-medium">مطور النظام</p>
            </div>
          </div>
          
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              تم تطوير نظام <strong>سـردة (Sarda)</strong> ليكون الأداة المثالية لصناع المحتوى الصوتي والقصصي.
            </p>
            <p>
              يهدف النظام إلى توفير بيئة عمل خالية من التشتت، مع أدوات متكاملة لإدارة المحتوى من الفكرة وحتى النشر.
            </p>
            <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-sm text-slate-500">
              <Info className="w-4 h-4" />
              <span>الإصدار 1.0.0</span>
            </div>
          </div>
        </motion.div>

        {/* Database Tools */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-600">
              <Database className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">إدارة البيانات</h2>
              <p className="text-slate-500 font-medium">النسخ الاحتياطي والاستعادة</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800 text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p>
                يتم حفظ بياناتك محلياً على هذا المتصفح. يُنصح بأخذ نسخة احتياطية بشكل دوري لضمان عدم فقدانها.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                <Download className="w-5 h-5" />
                تصدير نسخة احتياطية (JSON)
              </button>

              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  ref={fileInputRef}
                  className="hidden"
                  id="import-file"
                />
                <label
                  htmlFor="import-file"
                  className="flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-indigo-500 hover:text-indigo-600 text-slate-700 px-6 py-3 rounded-xl font-medium transition-colors cursor-pointer"
                >
                  <Upload className="w-5 h-5" />
                  استيراد نسخة احتياطية
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
