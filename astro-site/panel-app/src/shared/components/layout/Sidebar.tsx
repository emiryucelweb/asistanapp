 

/**
 * Sidebar Navigation - Stitch AI Design
 * Müşteri Paneli için sabit sidebar
 */
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, MessageCircle, BarChart3, HelpCircle, MousePointer, Bot, X, Send, Sparkles, ChevronLeft, ChevronRight, MessageSquare, Settings, Users } from 'lucide-react';

interface SidebarProps {
  onItemClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  const { t } = useTranslation('common');
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: Home, label: t('sidebar.dashboard'), path: '/admin/dashboard', active: true },
    { icon: MessageCircle, label: t('sidebar.conversations'), path: '/admin/conversations' },
    { icon: MessageSquare, label: t('sidebar.teamChat'), path: '/admin/team/chat', badge: t('sidebar.new') },
    { icon: BarChart3, label: t('sidebar.reports'), path: '/admin/reports' },
    { icon: Settings, label: t('sidebar.settings'), path: '/admin/settings' },
    { icon: Users, label: t('sidebar.team'), path: '/admin/team' },
    { icon: HelpCircle, label: t('sidebar.help'), path: '/admin/help' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <div className={`flex h-full min-h-[700px] flex-col justify-between bg-slate-50 dark:bg-slate-900 p-4 transition-all duration-300 relative ${
        isCollapsed ? 'w-20' : 'w-80'
      }`}>
        {/* Logo */}
        <div className="flex flex-col gap-4">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
              <img src="/logo.svg" alt="AsistanApp" className="w-8 h-8 flex-shrink-0" />
              {!isCollapsed && (
                <h1 className="text-[#0e131b] dark:text-gray-100 text-base font-medium leading-normal whitespace-nowrap">AsistanApp</h1>
              )}
            </div>
            
            {/* Toggle Button */}
            {!isCollapsed && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-600 transition-all"
                title={t('sidebar.collapse')}
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>
          
          {/* Expand Button for Collapsed State */}
          {isCollapsed && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-600 transition-all w-full flex items-center justify-center"
              title={t('sidebar.expand')}
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          )}
          
          {/* Menu Items */}
          <div className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onItemClick}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors relative group ${
                    active ? 'bg-[#e7ecf3] dark:bg-slate-700' : 'hover:bg-[#e7ecf3]/50 dark:hover:bg-slate-700/50'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className="text-[#0e131b] dark:text-gray-100 flex-shrink-0" size={24} />
                  {!isCollapsed && (
                    <div className="flex items-center gap-2 flex-1">
                      <p className="text-[#0e131b] dark:text-gray-100 text-sm font-medium leading-normal whitespace-nowrap">{item.label}</p>
                      {(item as any).badge && (
                        <span className="px-1.5 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded uppercase">
                          {(item as any).badge}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
            
            {/* Asistan ile Konuş - Turuncu */}
            <button
              onClick={() => setIsChatOpen(true)}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-sm mt-2 relative group ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title={isCollapsed ? t('sidebar.talkToAssistant') : ''}
            >
              <Bot className="text-white flex-shrink-0" size={24} />
              {!isCollapsed && (
                <p className="text-white text-sm font-medium leading-normal flex items-center gap-1 whitespace-nowrap">
                  {t('sidebar.talkToAssistant')}
                  <Sparkles className="w-3 h-3" />
                </p>
              )}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  {t('sidebar.talkToAssistant')}
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Demo İste (Bottom) */}
        <div className="flex flex-col gap-1">
          <div className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#e7ecf3]/50 dark:hover:bg-slate-700/50 rounded-xl transition-colors relative group ${
            isCollapsed ? 'justify-center' : ''
          }`}
            title={isCollapsed ? t('sidebar.requestDemo') : ''}
          >
            <MousePointer className="text-[#0e131b] dark:text-gray-100 flex-shrink-0" size={24} />
            {!isCollapsed && (
              <p className="text-[#0e131b] dark:text-gray-100 text-sm font-medium leading-normal whitespace-nowrap">{t('sidebar.requestDemo')}</p>
            )}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                {t('sidebar.requestDemo')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Chat Popup */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-orange-200 dark:border-orange-700 w-full max-w-lg">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-orange-100 dark:border-orange-800 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0e131b] dark:text-gray-100">AsistanApp AI</h3>
                  <p className="text-xs text-orange-600 dark:text-orange-400">{t('aiAssistant.subtitle')}</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-1 hover:bg-white dark:hover:bg-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Chat Messages */}
            <div className="p-5 h-96 overflow-y-auto bg-gradient-to-b from-white to-orange-50/30 dark:from-slate-800 dark:to-slate-900">
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white dark:bg-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-orange-100 dark:border-orange-800 max-w-sm">
                  <p className="text-sm text-[#0e131b] dark:text-gray-100 mb-2">
                    {t('aiAssistant.greeting')}
                  </p>
                  <div className="text-xs text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/30 rounded-lg p-3 mt-2">
                    <p className="font-semibold mb-1">{t('aiAssistant.suggestionsTitle')}</p>
                    <p className="mb-1">• "{t('aiAssistant.suggestion1')}"</p>
                    <p className="mb-1">• "{t('aiAssistant.suggestion2')}"</p>
                    <p className="mb-1">• "{t('aiAssistant.suggestion3')}"</p>
                    <p>• "{t('aiAssistant.suggestion4')}"</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Chat Input */}
            <div className="p-4 border-t border-orange-100 dark:border-orange-800 bg-white dark:bg-slate-800 rounded-b-2xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder={t('aiAssistant.inputPlaceholder')}
                  className="flex-1 px-4 py-3 border-2 border-orange-200 dark:border-orange-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-orange-50/30 dark:bg-orange-900/20 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && chatMessage.trim()) {
                      // TODO: Send message to AI
                      setChatMessage('');
                    }
                  }}
                />
                <button 
                  disabled={!chatMessage.trim()}
                  className="px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

