'use client';

import { useState, useEffect } from 'react';
import { useStore, StoryStatus } from '@/lib/store';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { Save, ArrowRight, Bold, Italic, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, Heading3 } from 'lucide-react';
import Link from 'next/link';

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50 rounded-t-xl">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-slate-200 ${editor.isActive('bold') ? 'bg-slate-200 text-indigo-600' : 'text-slate-600'}`}
        title="عريض"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-slate-200 ${editor.isActive('italic') ? 'bg-slate-200 text-indigo-600' : 'text-slate-600'}`}
        title="مائل"
      >
        <Italic className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-slate-300 mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-slate-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-slate-200 text-indigo-600' : 'text-slate-600'}`}
        title="عنوان 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-slate-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-200 text-indigo-600' : 'text-slate-600'}`}
        title="عنوان 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-slate-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-slate-200 text-indigo-600' : 'text-slate-600'}`}
        title="عنوان 3"
      >
        <Heading3 className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-slate-300 mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-slate-200 ${editor.isActive('bulletList') ? 'bg-slate-200 text-indigo-600' : 'text-slate-600'}`}
        title="قائمة منقطة"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-slate-200 ${editor.isActive('orderedList') ? 'bg-slate-200 text-indigo-600' : 'text-slate-600'}`}
        title="قائمة مرقمة"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-slate-300 mx-1" />
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`p-2 rounded hover:bg-slate-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-slate-200 text-indigo-600' : 'text-slate-600'}`}
        title="محاذاة لليمين"
      >
        <AlignRight className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-2 rounded hover:bg-slate-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-slate-200 text-indigo-600' : 'text-slate-600'}`}
        title="توسيط"
      >
        <AlignCenter className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-2 rounded hover:bg-slate-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-slate-200 text-indigo-600' : 'text-slate-600'}`}
        title="محاذاة لليسار"
      >
        <AlignLeft className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function EditorPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { stories, addStory, updateStory, folders } = useStore();
  
  const id = params.id as string;
  const isNew = id === 'new';
  const folderIdParam = searchParams.get('folderId');

  const existingStory = !isNew ? stories.find(s => s.id === id) : null;

  const [title, setTitle] = useState(existingStory?.title || '');
  const [status, setStatus] = useState<StoryStatus>(existingStory?.status || 'draft');
  const [targetDate, setTargetDate] = useState(existingStory?.targetDate || '');
  const [publishTime, setPublishTime] = useState(existingStory?.publishTime || '');
  const [folderId, setFolderId] = useState(existingStory?.folderId || folderIdParam || '');

  useEffect(() => {
    if (!isNew && !existingStory) {
      router.push('/content');
    }
  }, [existingStory, isNew, router]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'right',
      }),
    ],
    content: existingStory?.content || '<p dir="rtl"></p>',
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[500px] p-6 text-right',
        dir: 'rtl',
      },
    },
  });

  const handleSave = () => {
    if (!folderId) {
      alert('الرجاء اختيار مجلد أولاً');
      return;
    }

    const storyData = {
      title,
      content: editor?.getHTML() || '',
      status,
      targetDate,
      publishTime,
      folderId,
    };

    if (isNew) {
      addStory(storyData);
      router.push('/content');
    } else {
      updateStory(id, storyData);
      router.push('/content');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/content" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <ArrowRight className="w-5 h-5" />
          </Link>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان القصة..."
            className="text-2xl font-bold text-slate-900 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-slate-300 w-96"
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StoryStatus)}
            className="bg-slate-100 border-none text-sm font-medium rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="draft">مسودة</option>
            <option value="ready">جاهز للنشر</option>
            <option value="published">منشور</option>
          </select>
          <button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            حفظ
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="w-80 bg-white border-r border-slate-200 p-6 overflow-y-auto shrink-0">
          <h3 className="font-bold text-slate-900 mb-6 text-lg">إعدادات النشر</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">المجلد</label>
              <select
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="" disabled>اختر مجلداً...</option>
                {folders.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">تاريخ النشر المستهدف</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">وقت النشر</label>
              <input
                type="time"
                value={publishTime}
                onChange={(e) => setPublishTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
