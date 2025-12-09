/**
 * Main Layout - Responsive Design (Desktop & Mobile)
 */
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ThemeSwitcher from '@/shared/ui/theme/ThemeSwitcher';
import { Menu, X } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div 
      className="relative flex h-auto min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900 group/design-root overflow-x-hidden transition-colors duration-200" 
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div className={`
        fixed top-0 left-0 h-full w-72 z-50 transform transition-transform duration-300 lg:hidden
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="bg-white dark:bg-slate-800 h-full shadow-2xl overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Menü</h2>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          <Sidebar onItemClick={() => setIsMobileSidebarOpen(false)} />
        </div>
      </div>

      {/* Main Layout Container */}
      <div className="layout-container flex h-full grow flex-col">
        {/* Mobile Header with Hamburger */}
        <div className="lg:hidden sticky top-0 z-30 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileSidebarOpen ? (
                <X className="w-6 h-6 text-gray-900 dark:text-gray-100" />
              ) : (
                <Menu className="w-6 h-6 text-gray-900 dark:text-gray-100" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="AsistanApp" className="w-7 h-7" />
              <h1 className="text-base font-bold text-gray-900 dark:text-gray-100">AsistanApp</h1>
            </div>
            <ThemeSwitcher />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="gap-1 px-2 sm:px-4 lg:px-6 flex flex-1 justify-center py-2 lg:py-5">
          {/* Desktop Sidebar - Hidden on mobile */}
          <div className="layout-content-container flex-col flex-shrink-0 hidden lg:flex">
            <Sidebar />
          </div>

          {/* Main Content - Full width on mobile, flex on desktop */}
          <div className="layout-content-container flex flex-col flex-1 min-w-0 w-full">
            {/* Desktop Header - Hidden on mobile */}
            <div className="hidden lg:block">
              <Header />
            </div>
            
            {/* Page Content */}
            <div className="flex-1">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
