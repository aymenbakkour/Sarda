'use client';

import { useState, useEffect } from 'react';
import { useStore, StoryStatus } from '@/lib/store';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { Save, ArrowRight, Bold, Italic, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, Heading3, Download, Upload } from 'lucide-react';
import Link from 'next/link';
import mammoth from 'mammoth';

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
    immediatelyRender: false,
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
      publishTime: '',
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

  const handleExportWord = () => {
    if (!editor) return;
    
    // Create a simple HTML document that MS Word can read
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body dir='rtl' style='font-family: Arial, sans-serif;'>";
    const footer = "</body></html>";
    const sourceHTML = header + editor.getHTML() + footer;
    
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `${title || 'document'}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  const handleImportWord = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      if (editor) {
        editor.commands.setContent(result.value);
      }
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    } catch (error) {
      console.error("Error importing word document:", error);
      alert("حدث خطأ أثناء استيراد الملف. تأكد من أنه بصيغة .docx");
    }
    
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between shrink-0 gap-4 md:gap-0">
        <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
          <Link href="/content" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors shrink-0">
            <ArrowRight className="w-5 h-5" />
          </Link>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان القصة..."
            className="text-xl md:text-2xl font-bold text-slate-900 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-slate-300 w-full md:w-96"
          />
        </div>
        <div className="flex flex-wrap items-center justify-start md:justify-end w-full md:w-auto gap-2">
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <button
              onClick={handleExportWord}
              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-md transition-colors"
              title="تصدير كملف Word"
            >
              <Download className="w-4 h-4" />
            </button>
            <label
              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-md transition-colors cursor-pointer"
              title="استيراد ملف Word (.docx)"
            >
              <Upload className="w-4 h-4" />
              <input type="file" accept=".docx" className="hidden" onChange={handleImportWord} />
            </label>
          </div>
          <div className="w-px h-6 bg-slate-200 hidden md:block mx-1"></div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StoryStatus)}
            className="flex-1 md:flex-none bg-slate-100 border-none text-sm font-medium rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 min-w-[100px]"
          >
            <option value="draft">مسودة</option>
            <option value="ready">جاهز للنشر</option>
            <option value="published">منشور</option>
          </select>
          <button
            onClick={handleSave}
            className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-sm min-w-[90px]"
          >
            <Save className="w-4 h-4" />
            حفظ
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 order-2 md:order-1">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="w-full md:w-80 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-4 md:p-6 overflow-y-auto shrink-0 order-1 md:order-2">
          <h3 className="font-bold text-slate-900 mb-4 md:mb-6 text-lg">إعدادات النشر</h3>
          
          <div className="space-y-4 md:space-y-6 flex flex-col sm:flex-row md:flex-col gap-4 sm:gap-6 md:gap-0">
            <div className="flex-1">
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

            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">تاريخ النشر</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
