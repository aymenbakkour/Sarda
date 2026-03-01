'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderOpen, CalendarDays, Info, PenTool } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { name: 'الرئيسية', href: '/', icon: LayoutDashboard },
  { name: 'إدارة المحتوى', href: '/content', icon: FolderOpen },
  { name: 'جدول النشر', href: '/schedule', icon: CalendarDays },
  { name: 'حول المطور', href: '/dev-info', icon: Info },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-slate-900 text-slate-100 h-screen flex flex-col border-l border-slate-800 shrink-0">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-indigo-500 p-2 rounded-lg">
          <PenTool className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">سـردة</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                  : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 text-xs text-slate-500 text-center border-t border-slate-800">
        Sarda CMS v1.0
      </div>
    </div>
  );
}
