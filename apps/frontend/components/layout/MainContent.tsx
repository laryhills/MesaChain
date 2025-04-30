'use client';

import { useSidebarStore } from '@/store/useSidebarStore';

export default function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);

  return (
    <main 
      className={`flex-1 transition-all duration-300 ${
        isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
      }`}
    >
      {children}
    </main>
  );
} 