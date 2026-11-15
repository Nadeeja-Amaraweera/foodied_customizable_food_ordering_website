import React, { useState, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ToastProvider } from '../../context/ToastContext';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  newOrdersCount?: number;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  subtitle,
  newOrdersCount = 2,
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#2D2D2D] flex flex-col lg:flex-row antialiased">
      {/* Sidebar */}
      <Sidebar
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        newOrdersCount={newOrdersCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          title={title}
          subtitle={subtitle}
          newOrdersCount={newOrdersCount}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

