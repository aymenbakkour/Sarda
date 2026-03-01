'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { FolderPlus, Folder as FolderIcon, MoreVertical, Trash2, Edit2, FileText, Plus, Calendar, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function ContentManager() {
  const { folders, stories, addFolder, deleteFolder, updateFolder, deleteStory } = useStore();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editFolderName, setEditFolderName] = useState('');

  const handleAddFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      addFolder(newFolderName.trim());
      setNewFolderName('');
      setIsAddingFolder(false);
    }
  };

  const handleUpdateFolder = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (editFolderName.trim()) {
      updateFolder(id, editFolderName.trim());
      setEditingFolderId(null);
    }
  };

  const selectedFolder = folders.find(f => f.id === selectedFolderId);
  const folderStories = stories.filter(s => s.folderId === selectedFolderId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'ready': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'published': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'مسودة';
      case 'ready': return 'جاهز للنشر';
      case 'published': return 'منشور';
      default: return status;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Folders Sidebar */}
      <div className={`w-full md:w-80 bg-white border-b md:border-b-0 md:border-l border-slate-200 flex flex-col shrink-0 ${selectedFolder ? 'hidden md:flex' : 'flex h-full'}`}>
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-bold text-lg text-slate-800">المجلدات</h2>
          <button
            onClick={() => setIsAddingFolder(true)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
            title="مجلد جديد"
          >
            <FolderPlus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isAddingFolder && (
            <form onSubmit={handleAddFolder} className="mb-4">
              <input
                type="text"
                autoFocus
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsAddingFolder(false);
                    setNewFolderName('');
                  }
                }}
                placeholder="اسم المجلد... (اضغط Enter للحفظ)"
                className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </form>
          )}

          {folders.length === 0 && !isAddingFolder && (
            <div className="text-center text-slate-500 py-8 text-sm">
              لا توجد مجلدات. أضف مجلداً للبدء.
            </div>
          )}

          {folders.map(folder => (
            <div
              key={folder.id}
              className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                selectedFolderId === folder.id ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50 border border-transparent'
              }`}
              onClick={() => setSelectedFolderId(folder.id)}
            >
              {editingFolderId === folder.id ? (
                <form onSubmit={(e) => handleUpdateFolder(e, folder.id)} className="flex-1 mr-2">
                  <input
                    type="text"
                    autoFocus
                    value={editFolderName}
                    onChange={(e) => setEditFolderName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setEditingFolderId(null);
                      }
                    }}
                    className="w-full px-2 py-1 border border-indigo-300 rounded focus:outline-none text-sm"
                    onClick={(e) => e.stopPropagation()}
                  />
                </form>
              ) : (
                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                  <FolderIcon className={`w-5 h-5 shrink-0 ${selectedFolderId === folder.id ? 'text-indigo-500' : 'text-slate-400'}`} />
                  <span className={`truncate text-sm font-medium ${selectedFolderId === folder.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                    {folder.name}
                  </span>
                </div>
              )}

              <div className="flex items-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditFolderName(folder.name);
                    setEditingFolderId(folder.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50"
                >
                  <Edit2 className="w-4 h-4 md:w-3.5 md:h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('هل أنت متأكد من حذف هذا المجلد وجميع القصص بداخله؟')) {
                      deleteFolder(folder.id);
                      if (selectedFolderId === folder.id) setSelectedFolderId(null);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 md:w-3.5 md:h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stories Area */}
      <div className={`flex-1 bg-slate-50 h-full overflow-y-auto ${!selectedFolder ? 'hidden md:block' : 'block'}`}>
        {selectedFolder ? (
          <div className="p-4 md:p-8 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <button 
                    onClick={() => setSelectedFolderId(null)}
                    className="md:hidden p-1 -mr-1 text-slate-500 hover:text-slate-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{selectedFolder.name}</h1>
                </div>
                <p className="text-slate-500">{folderStories.length} قصة</p>
              </div>
              <Link
                href={`/editor/new?folderId=${selectedFolder.id}`}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-sm w-full md:w-auto"
              >
                <Plus className="w-5 h-5" />
                قصة جديدة
              </Link>
            </div>

            {folderStories.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">لا توجد قصص هنا</h3>
                <p className="text-slate-500 mb-6">ابدأ بكتابة قصتك الأولى في هذا المجلد.</p>
                <Link
                  href={`/editor/new?folderId=${selectedFolder.id}`}
                  className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700"
                >
                  <Plus className="w-5 h-5" />
                  إنشاء قصة
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {folderStories.map((story) => (
                    <motion.div
                      key={story.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow group relative flex flex-col h-64"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getStatusColor(story.status)}`}>
                          {getStatusText(story.status)}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/editor/${story.id}`}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                            title="تعديل"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (confirm('هل أنت متأكد من حذف هذه القصة؟')) {
                                deleteStory(story.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
                        {story.title || 'بدون عنوان'}
                      </h3>
                      
                      <div className="text-slate-500 text-sm line-clamp-3 mb-auto" dangerouslySetInnerHTML={{ __html: story.content || 'لا يوجد محتوى...' }} />
                      
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{story.targetDate ? format(new Date(story.targetDate), 'dd MMM yyyy', { locale: ar }) : 'غير محدد'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{story.publishTime || '--:--'}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 flex-col gap-4">
            <FolderIcon className="w-16 h-16 text-slate-200" />
            <p className="text-lg">اختر مجلداً لاستعراض القصص</p>
          </div>
        )}
      </div>
    </div>
  );
}
