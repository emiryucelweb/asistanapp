import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '@/shared/utils/logger';
import { useSearchParams } from 'react-router-dom';
import { 
  MessageCircle, 
  Instagram, 
  Facebook, 
  Globe,
  Clock,
  Search,
  Filter,
  ChevronDown,
  User,
  Users,
  Paperclip,
  Image,
  Video,
  FileText,
  X,
  Send,
  Phone,
  Mail,
  ExternalLink,
  MapPin,
  AlertCircle,
  UserCheck,
  Bot as BotIcon,
  PhoneCall,
  Mic,
  Volume2,
  PhoneIncoming,
  PhoneMissed,
  Maximize2,
  Minimize2
} from 'lucide-react';

// WhatsApp icon component (Lucide doesn't have it, so we'll create a simple one)
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

type Channel = 'instagram' | 'whatsapp' | 'facebook' | 'web' | 'phone';

interface Message {
  id: string;
  text: string;
  sender: 'customer' | 'agent';
  timestamp: Date;
  agentName?: string; // 'Asistan', 'Ahmet (Ekip)', 'Firma Sahibi' vs.
  attachments?: {
    type: 'image' | 'video' | 'file';
    name: string;
    url: string;
  }[];
  isVoiceTranscript?: boolean; // Sesli konuşmadan transkript mi?
  voiceDuration?: number; // Sesli mesaj süresi (saniye)
}

interface Conversation {
  id: string;
  channel: Channel;
  customerName: string;
  customerAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
  needsHelp: boolean; // Asistan yardım istiyor, insan yardımı gerekli
  assignedTo?: 'ai' | 'human'; // Kime atanmış
  assignedAgent?: string; // Hangi ekip üyesine atanmış
  aiStuckReason?: string; // AI neden tıkandı
  isLiveCall?: boolean; // Şu anda canlı arama var mı?
  isUrgent?: boolean; // Acil durum mu?
  callDuration?: number; // Arama süresi (saniye)
  customerProfile: {
    instagram?: {
      username: string;
      profileUrl: string;
    };
    whatsapp?: {
      phoneNumber: string;
    };
    facebook?: {
      name: string;
      profileUrl: string;
    };
    web?: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber?: string;
    };
    phone?: {
      phoneNumber: string;
      callHistory?: {
        date: Date;
        duration: number;
        answeredBy: 'ai' | 'human' | 'missed';
      }[];
    };
  };
}

const channelIcons: Record<Channel, { icon: React.ReactNode; color: string; bg: string }> = {
  instagram: {
    icon: <Instagram className="w-5 h-5" />,
    color: 'text-pink-600',
    bg: 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500'
  },
  whatsapp: {
    icon: <WhatsAppIcon />,
    color: 'text-green-600',
    bg: 'bg-green-500'
  },
  facebook: {
    icon: <Facebook className="w-5 h-5" />,
    color: 'text-blue-600',
    bg: 'bg-blue-600'
  },
  web: {
    icon: <Globe className="w-5 h-5" />,
    color: 'text-orange-600',
    bg: 'bg-orange-500'
  },
  phone: {
    icon: <PhoneCall className="w-5 h-5" />,
    color: 'text-purple-600',
    bg: 'bg-gradient-to-br from-purple-500 to-purple-700'
  }
};

// TODO: Replace with real API call to fetch conversations
// Mock data removed - use backend API endpoints

const ConversationsPage: React.FC = () => {
  const { t, i18n } = useTranslation('admin');
  const [activeTab, setActiveTab] = useState<'assistant' | 'employee' | 'past' | 'phone'>('assistant');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<Channel | 'all'>('all');
  const [filterNeedsHelp, setFilterNeedsHelp] = useState(false); // Filter for AI stuck conversations
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Active conversations - load all at once
  const [activeConversations, setActiveConversations] = useState<Conversation[]>([]);
  
  // Past conversations - load 20 at a time
  const [pastConversations, setPastConversations] = useState<Conversation[]>([]);
  const [pastPage, setPastPage] = useState(1);
  const [hasMorePast, setHasMorePast] = useState(true);
  const PAST_PAGE_SIZE = 20;

  // URL params for deep linking
  const [searchParams, setSearchParams] = useSearchParams();

  // Keyboard shortcuts for fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape: Exit fullscreen or close conversation
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else if (selectedConversation) {
          setSelectedConversation(null);
        }
      }
      // F11: Toggle fullscreen (if conversation is open)
      if (e.key === 'F11' && selectedConversation) {
        e.preventDefault();
        setIsFullscreen(!isFullscreen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, selectedConversation]);

  useEffect(() => {
    // TODO: Load conversations from backend API
    // Example:
    // const fetchConversations = async () => {
    //   const activeData = await api.get('/conversations/active');
    //   setActiveConversations(activeData);
    //   const pastData = await api.get('/conversations/past', { params: { page: 1, limit: PAST_PAGE_SIZE } });
    //   setPastConversations(pastData.conversations);
    //   setHasMorePast(pastData.hasMore);
    // };
    // fetchConversations();
  }, []);

  // Deep linking: Open conversation from URL parameter
  useEffect(() => {
    const conversationIdFromUrl = searchParams.get('openConversation');
    if (conversationIdFromUrl && activeConversations.length > 0) {
      // Find conversation in active list
      const conversation = activeConversations.find(c => c.id === conversationIdFromUrl);
      if (conversation) {
        setSelectedConversation(conversation);
        // Clear URL parameter after opening
        setSearchParams({});
      }
    }
  }, [searchParams, activeConversations, setSearchParams]);

  // Auto-move conversations to past after 30 minutes of inactivity
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const THIRTY_MINUTES = 30 * 60 * 1000;

      setActiveConversations(prev => {
        const stillActive: Conversation[] = [];
        const movedToPast: Conversation[] = [];

        prev.forEach(conv => {
          const timeSinceLastMessage = now - conv.lastMessageTime.getTime();
          if (timeSinceLastMessage > THIRTY_MINUTES) {
            movedToPast.push(conv);
          } else {
            stillActive.push(conv);
          }
        });

        // Move expired conversations to past
        if (movedToPast.length > 0) {
          setPastConversations(oldPast => [...movedToPast, ...oldPast]);
          if (import.meta.env.DEV) {
            logger.debug(`📦 ${movedToPast.length} konuşma geçmişe taşındı (30 dakika inaktif)`);
          }
        }

        return stillActive;
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);
  
  const loadMorePast = () => {
    // TODO: Load more past conversations from backend API
    // Example:
    // const fetchMorePast = async () => {
    //   const nextPage = pastPage + 1;
    //   const pastData = await api.get('/conversations/past', { params: { page: nextPage, limit: PAST_PAGE_SIZE } });
    //   setPastConversations(prev => [...prev, ...pastData.conversations]);
    //   setPastPage(nextPage);
    //   setHasMorePast(pastData.hasMore);
    // };
    // fetchMorePast();
  };
  
  const getFilteredConversations = () => {
    let conversations: Conversation[] = [];
    
    // Helper: Konuşmada gerçek insan (agent) müdahalesi var mı kontrol et (Asistan AI'dır, insan sayılmaz)
    const hasHumanIntervention = (conv: Conversation) => {
      // TODO: Update when backend provides agent type info
      return conv.messages.some(msg => msg.sender === 'agent' && msg.agentName && msg.agentName !== 'AI Assistant');
    };
    
    if (activeTab === 'phone') {
      // Telefon konuşmaları - tüm telefonları göster (aktif + geçmiş)
      conversations = [...activeConversations, ...pastConversations].filter(c => c.channel === 'phone');
    } else if (activeTab === 'assistant') {
      // Asistan tab - Sadece AI tarafından yönetilen, insan müdahalesi OLMAYAN aktif konuşmalar (telefon hariç)
      conversations = activeConversations
        .filter(c => c.channel !== 'phone' && !hasHumanIntervention(c));
    } else if (activeTab === 'employee') {
      // Çalışan tab - Herhangi bir insan müdahalesi olan veya yardım bekleyen aktif konuşmalar (telefon hariç)
      conversations = activeConversations
        .filter(c => c.channel !== 'phone' && (hasHumanIntervention(c) || c.needsHelp || c.assignedTo === 'human'));
    } else if (activeTab === 'past') {
      // Past tab - telefon konuşmalarını hariç tut çünkü onların kendi tab'i var
      conversations = pastConversations
        .filter(c => c.channel !== 'phone');
    }
    
    return conversations.filter(conv => {
      const matchesSearch = conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesChannel = selectedChannel === 'all' || conv.channel === selectedChannel;
      const matchesNeedsHelp = !filterNeedsHelp || conv.needsHelp;
      
      // Telefon tab'ındayken kanal filtresini atlıyoruz
      if (activeTab === 'phone') {
        return matchesSearch && matchesNeedsHelp;
      }
      
      // Diğer tab'larda kanal filtresi uygula
      return matchesSearch && matchesChannel && matchesNeedsHelp;
    });
  };
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return t('conversations.time.now');
    if (diffMins < 60) return t('conversations.time.minutesAgo', { count: diffMins });
    if (diffHours < 24) return t('conversations.time.hoursAgo', { count: diffHours });
    if (diffDays < 7) return t('conversations.time.daysAgo', { count: diffDays });
    
    return date.toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US', { day: '2-digit', month: 'short' });
  };
  
  const handleFileSelect = (type: 'image' | 'video' | 'file') => {
    const input = document.createElement('input');
    input.type = 'file';
    
    if (type === 'image') {
      input.accept = 'image/*';
    } else if (type === 'video') {
      input.accept = 'video/*';
    } else {
      input.accept = '*/*';
    }
    
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      setAttachments(prev => [...prev, ...files]);
      setShowAttachmentMenu(false);
    };
    
    input.click();
  };
  
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSendMessage = () => {
    if (!messageInput.trim() && attachments.length === 0) return;
    
    // TODO: API call to send message
    logger.debug('Sending message:', { text: messageInput, attachments });
    
    setMessageInput('');
    setAttachments([]);
  };
  
  const filteredConversations = getFilteredConversations();
  const needsHelpCount = (activeTab === 'past' ? pastConversations : activeConversations).filter(c => c.needsHelp).length;
  const phoneCallsCount = [...activeConversations, ...pastConversations].filter(c => c.channel === 'phone').length;
  const liveCallsCount = activeConversations.filter(c => c.isLiveCall).length;
  const urgentCallsCount = activeConversations.filter(c => c.isUrgent).length;
  
  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{t('conversations.title')}</h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">{t('conversations.subtitle')}</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Acil Aramalar Alert */}
              {urgentCallsCount > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border-2 border-red-300 rounded-lg animate-pulse">
                  <PhoneCall className="w-4 h-4 text-red-600 animate-bounce" />
                  <span className="text-sm font-bold text-red-900">
                    {urgentCallsCount} {t('conversations.filters.urgentCall')}
                  </span>
                </div>
              )}
              
              {/* Canlı Aramalar */}
              {liveCallsCount > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg">
                  <PhoneIncoming className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">
                    {liveCallsCount} {t('conversations.filters.liveCalls', { count: liveCallsCount })}
                  </span>
                </div>
              )}
              
              {/* Yardım Bekleyenler */}
              {needsHelpCount > 0 && !urgentCallsCount && (
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-900">
                    {needsHelpCount} {t('conversations.filters.needsHelpWaiting', { count: needsHelpCount })}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Search and Channel Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('conversations.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
            
            {/* Channel Filter */}
            <div className="flex items-center gap-1 sm:gap-2 bg-gray-50 dark:bg-slate-900 p-1 rounded-lg border border-gray-200 dark:border-slate-700 overflow-x-auto">
              <button
                onClick={() => setSelectedChannel('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedChannel === 'all'
                    ? 'bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                {t('conversations.filters.all')}
              </button>
              {(Object.keys(channelIcons) as Channel[]).map((channel) => (
                <button
                  key={channel}
                  onClick={() => setSelectedChannel(channel)}
                  className={`p-2 rounded-md transition-colors ${
                    selectedChannel === channel
                      ? `${channelIcons[channel].color} bg-white dark:bg-slate-800 shadow-sm`
                      : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'
                  }`}
                  title={channel}
                >
                  {channelIcons[channel].icon}
                </button>
              ))}
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-4 sm:mt-6">
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-700 p-1 rounded-lg overflow-x-auto">
              <button
                onClick={() => setActiveTab('assistant')}
                className={`px-3 sm:px-6 py-2 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'assistant'
                    ? 'bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <BotIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{t('conversations.tabs.assistant')}</span>
                <span className="sm:hidden">{t('conversations.tabs.assistantShort')}</span>
                <span className="ml-1 px-1.5 sm:px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-full">
                  {activeConversations.filter(c => c.channel !== 'phone' && !c.messages.some(msg => msg.sender === 'agent' && msg.agentName && msg.agentName !== 'AI Assistant')).length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('employee')}
                className={`px-3 sm:px-6 py-2 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'employee'
                    ? 'bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{t('conversations.tabs.employee')}</span>
                <span className="sm:hidden">{t('conversations.tabs.employeeShort')}</span>
                <span className="ml-1 px-1.5 sm:px-2 py-0.5 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 text-xs font-semibold rounded-full">
                  {activeConversations.filter(c => c.channel !== 'phone' && (c.messages.some(msg => msg.sender === 'agent' && msg.agentName && msg.agentName !== 'AI Assistant') || c.needsHelp || c.assignedTo === 'human')).length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-3 sm:px-6 py-2 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === 'past'
                    ? 'bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
                title={t('conversations.autoArchiveInfo')}
              >
                <span className="hidden sm:inline">{t('conversations.tabs.past')}</span>
                <span className="sm:hidden">{t('conversations.tabs.pastShort')}</span>
                <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full">
                  {pastConversations.length}+
                </span>
              </button>
              <button
                onClick={() => setActiveTab('phone')}
                className={`px-3 sm:px-6 py-2 rounded-md text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 whitespace-nowrap ${
                  activeTab === 'phone'
                    ? 'bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <PhoneCall className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{t('conversations.tabs.phone')}</span>
                <span className="sm:hidden">{t('conversations.tabs.phoneShort')}</span>
                <span className={`px-1.5 sm:px-2 py-0.5 text-xs font-semibold rounded-full ${
                  activeTab === 'phone'
                    ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                    : 'bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300'
                }`}>
                  {phoneCallsCount}
                </span>
              </button>
            </div>
            
            {/* Yardım Gerekli Tab */}
            <button 
              onClick={() => setFilterNeedsHelp(!filterNeedsHelp)}
              className={`px-3 sm:px-6 py-2 text-xs sm:text-sm font-medium border rounded-lg transition-all flex items-center gap-1 sm:gap-2 whitespace-nowrap ${
                filterNeedsHelp 
                  ? 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600 shadow-sm'
                  : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30'
              }`}
            >
              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t('conversations.tabs.needsHelp')}</span>
              <span className="sm:hidden">{t('conversations.tabs.needsHelpShort')}</span>
              {needsHelpCount > 0 && (
                <span className={`px-1.5 sm:px-2 py-0.5 text-xs font-semibold rounded-full ${
                  filterNeedsHelp 
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100'
                }`}>
                  {needsHelpCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="divide-y divide-gray-100 dark:divide-slate-700 max-h-[400px] sm:max-h-[500px] lg:max-h-[calc(100vh-240px)] overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{t('conversations.noConversationsFound')}</p>
                </div>
              ) : (
                <>
                  {filteredConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`w-full p-4 hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900 transition-colors text-left relative ${
                        selectedConversation?.id === conversation.id ? 'bg-orange-50' : ''
                      } ${conversation.isUrgent ? 'border-l-4 border-red-500 bg-red-50/30' : conversation.needsHelp ? 'border-l-4 border-amber-500' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Channel Icon */}
                        <div className="relative flex-shrink-0">
                          <div className={`w-12 h-12 ${channelIcons[conversation.channel].bg} rounded-full flex items-center justify-center text-white`}>
                            {conversation.customerAvatar ? (
                              <img src={conversation.customerAvatar} alt="" className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <User className="w-6 h-6" />
                            )}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${channelIcons[conversation.channel].bg} rounded-full flex items-center justify-center text-white border-2 border-white`}>
                            {channelIcons[conversation.channel].icon}
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                                {conversation.customerName}
                              </h3>
                              {conversation.needsHelp && (
                                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" aria-label={t('conversations.needsHelp')} />
                              )}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                              {formatTime(conversation.lastMessageTime)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {conversation.lastMessage}
                          </p>
                          
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {/* ACİL ARAMA - En yüksek öncelik */}
                            {conversation.isUrgent && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                                <PhoneCall className="w-3 h-3" />
                                {t('conversations.badges.urgent')}
                              </span>
                            )}
                            
                            {/* Canlı Arama */}
                            {conversation.isLiveCall && !conversation.isUrgent && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                                <PhoneIncoming className="w-3 h-3 animate-pulse" />
                                {t('conversations.badges.liveCall')}: {formatCallDuration(conversation.callDuration || 0)}
                              </span>
                            )}
                            
                            {conversation.unreadCount > 0 && (
                              <span className="inline-flex items-center justify-center px-2 py-0.5 bg-orange-500 text-white text-xs font-semibold rounded-full">
                                {conversation.unreadCount} {t('conversations.badges.newMessages', { count: conversation.unreadCount })}
                              </span>
                            )}
                            {conversation.needsHelp && !conversation.isLiveCall && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                                <UserCheck className="w-3 h-3" />
                                {conversation.assignedAgent || t('conversations.badges.humanAssistance')}
                              </span>
                            )}
                            {conversation.assignedTo === 'ai' && !conversation.needsHelp && !conversation.isLiveCall && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                                <BotIcon className="w-3 h-3" />
                                {t('conversations.badges.ai')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                  
                  {/* Load More Button for Past Conversations */}
                  {activeTab === 'past' && hasMorePast && (
                    <button
                      onClick={loadMorePast}
                      className="w-full p-4 text-center text-sm font-medium text-orange-600 hover:bg-orange-50 transition-colors"
                    >
                      {t('conversations.loadMore')}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Conversation Detail */}
          <div className={`lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden ${
            isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
          }`}>
            {selectedConversation ? (
              <div className={`flex flex-col ${
                isFullscreen ? 'h-screen' : 'h-[500px] sm:h-[600px] lg:h-[calc(100vh-240px)]'
              }`}>
                {/* Conversation Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className={`w-10 h-10 ${channelIcons[selectedConversation.channel].bg} rounded-full flex items-center justify-center text-white`}>
                          <User className="w-5 h-5" />
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 ${channelIcons[selectedConversation.channel].bg} rounded-full flex items-center justify-center text-white border-2 border-white`}>
                          <div className="scale-75">
                            {channelIcons[selectedConversation.channel].icon}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{selectedConversation.customerName}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {t('conversations.conversation.lastMessage')} {formatTime(selectedConversation.lastMessageTime)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Canlı Arama için Katıl Butonu */}
                      {selectedConversation.isLiveCall && (
                        <button 
                          className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${
                            selectedConversation.isUrgent 
                              ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
                              : 'bg-purple-500 text-white hover:bg-purple-600'
                          }`}
                        >
                          <PhoneCall className="w-4 h-4" />
                          {selectedConversation.isUrgent ? t('conversations.actions.urgentJoinCall') : t('conversations.actions.joinCall')}
                        </button>
                      )}
                      
                      {/* Ata Butonu */}
                      <button 
                        onClick={() => setShowAssignModal(true)}
                        className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center gap-2"
                      >
                        <Users className="w-4 h-4" />
                        {t('conversations.actions.assign')}
                      </button>
                      
                      <button 
                        onClick={() => setShowProfileModal(true)}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        {t('conversations.actions.viewProfile')}
                      </button>
                      
                      {/* Fullscreen Toggle */}
                      <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title={isFullscreen ? t('conversations.fullscreen.exit') : t('conversations.fullscreen.enter')}
                      >
                        {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Acil Arama Alert */}
                {selectedConversation.isUrgent && (
                  <div className="mx-6 mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg animate-pulse">
                    <div className="flex items-start gap-3">
                      <PhoneCall className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0 animate-bounce" />
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-red-900 mb-1">{t('conversations.alerts.urgentTitle')}</h4>
                        <p className="text-sm text-red-800">
                          {t('conversations.alerts.urgentMessage')}
                        </p>
                        <p className="text-xs text-red-700 mt-2 flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {t('conversations.conversation.callDuration')} <strong>{formatCallDuration(selectedConversation.callDuration || 0)}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Canlı Arama Durumu */}
                {selectedConversation.isLiveCall && !selectedConversation.isUrgent && (
                  <div className="mx-6 mt-6 p-4 bg-purple-50 border-l-4 border-purple-500 rounded-r-lg">
                    <div className="flex items-start gap-3">
                      <PhoneIncoming className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-purple-900 mb-1">{t('conversations.alerts.liveCallTitle')}</h4>
                        <p className="text-sm text-purple-800">
                          {selectedConversation.assignedTo === 'ai' 
                            ? t('conversations.alerts.liveCallAiMessage')
                            : t('conversations.alerts.liveCallAgentMessage', { agentName: selectedConversation.assignedAgent })}
                        </p>
                        <p className="text-xs text-purple-700 mt-2 flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {t('conversations.conversation.callDuration')} <strong>{formatCallDuration(selectedConversation.callDuration || 0)}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* AI Stuck Warning */}
                {selectedConversation.needsHelp && selectedConversation.aiStuckReason && !selectedConversation.isLiveCall && (
                  <div className="mx-6 mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 dark:border-amber-600 rounded-r-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200 mb-1">{t('conversations.alerts.aiStuckTitle')}</h4>
                        <p className="text-sm text-amber-800 dark:text-amber-300">{selectedConversation.aiStuckReason}</p>
                        {selectedConversation.assignedAgent && (
                          <p className="text-xs text-amber-700 dark:text-amber-400 mt-2 flex items-center gap-1">
                            <UserCheck className="w-3 h-3" />
                            <strong>{selectedConversation.assignedAgent}</strong> {t('conversations.conversation.takingOver')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {selectedConversation.messages.map((message, _idx) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${message.sender === 'agent' ? 'order-2' : 'order-1'}`}>
                        {/* Sesli konuşma transkripti göstergesi */}
                        {message.isVoiceTranscript && (
                          <div className={`flex items-center gap-2 mb-1 text-xs ${
                            message.sender === 'agent' ? 'justify-end' : 'justify-start'
                          }`}>
                            <Mic className="w-3 h-3 text-purple-500" />
                            <span className="text-purple-600 font-medium">{t('conversations.alerts.voiceTranscript')}</span>
                            {message.voiceDuration && (
                              <span className="text-gray-500 dark:text-gray-400">({formatCallDuration(message.voiceDuration)})</span>
                            )}
                          </div>
                        )}
                        
                        <div
                          className={`rounded-2xl px-4 py-2.5 ${
                            message.sender === 'agent'
                              ? message.isVoiceTranscript 
                                ? 'bg-purple-500 text-white rounded-br-sm'
                                : 'bg-orange-500 text-white rounded-br-sm'
                              : message.isVoiceTranscript
                                ? 'bg-purple-50 dark:bg-purple-900/30 text-gray-900 dark:text-gray-100 border border-purple-200 dark:border-purple-700 rounded-bl-sm'
                                : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-bl-sm'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                        <div className={`flex items-center gap-2 mt-1 px-1 ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                          <p className="text-xs text-gray-400">
                            {message.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {message.sender === 'agent' && message.agentName && (
                            <>
                              <span className="text-xs text-gray-300">•</span>
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                {message.agentName}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Message Input */}
                <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                  {/* Attachments Preview */}
                  {attachments.length > 0 && (
                    <div className="mb-2 sm:mb-3 flex flex-wrap gap-1.5 sm:gap-2">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="relative group bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2"
                        >
                          {file.type.startsWith('image/') && <Image className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />}
                          {file.type.startsWith('video/') && <Video className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />}
                          {!file.type.startsWith('image/') && !file.type.startsWith('video/') && (
                            <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                          )}
                          <span className="text-xs text-gray-700 dark:text-gray-300 max-w-[100px] sm:max-w-[150px] truncate">
                            {file.name}
                          </span>
                          <button
                            onClick={() => removeAttachment(index)}
                            className="ml-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                            aria-label={`${file.name} dosyasını kaldır`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-end gap-1 sm:gap-2">
                    {/* Attachment Menu */}
                    <div className="relative flex-shrink-0">
                      <button
                        onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                        className="p-2 sm:p-2.5 text-gray-600 dark:text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                        title={t('conversations.addFile')}
                        aria-label={t('conversations.addFile')}
                      >
                        <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      
                      {showAttachmentMenu && (
                        <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden z-10 min-w-[160px]">
                          <button
                            onClick={() => handleFileSelect('image')}
                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 sm:gap-3 transition-colors"
                          >
                            <Image className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{t('conversations.attachments.photo')}</span>
                          </button>
                          <button
                            onClick={() => handleFileSelect('video')}
                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 sm:gap-3 transition-colors"
                          >
                            <Video className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{t('conversations.attachments.video')}</span>
                          </button>
                          <button
                            onClick={() => handleFileSelect('file')}
                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 sm:gap-3 transition-colors"
                          >
                            <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{t('conversations.attachments.file')}</span>
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Message Input */}
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder={t('conversations.messagePlaceholder')}
                      className="flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                    
                    {/* Send Button */}
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim() && attachments.length === 0}
                      className="px-3 sm:px-6 py-2 sm:py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 flex-shrink-0"
                      aria-label={t('conversations.sendMessage')}
                    >
                      <Send className="w-4 h-4" />
                      <span className="hidden sm:inline">{t('conversations.actions.send')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[calc(100vh-240px)] flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('conversations.conversation.selectConversation')}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('conversations.conversation.selectToStart')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Profile Modal */}
      {showProfileModal && selectedConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${channelIcons[selectedConversation.channel].bg} rounded-full flex items-center justify-center text-white`}>
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">{selectedConversation.customerName}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize flex items-center gap-1">
                    {channelIcons[selectedConversation.channel].icon}
                    <span className="ml-1">{selectedConversation.channel === 'web' ? 'Web Widget' : selectedConversation.channel.charAt(0).toUpperCase() + selectedConversation.channel.slice(1)}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Instagram Profile */}
              {selectedConversation.customerProfile.instagram && (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-pink-100 dark:border-pink-800">
                    <Instagram className="w-5 h-5 text-pink-600 dark:text-pink-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">{t('conversations.profile.instagram.username')}</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">{selectedConversation.customerProfile.instagram.username}</p>
                      <a
                        href={selectedConversation.customerProfile.instagram.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-medium"
                      >
                        {t('conversations.profile.instagram.visitProfile')}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Phone Profile */}
              {selectedConversation.customerProfile.phone && (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                    <PhoneCall className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">{t('conversations.profile.phone.number')}</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">{selectedConversation.customerProfile.phone.phoneNumber}</p>
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${selectedConversation.customerProfile.phone.phoneNumber.replace(/\s+/g, '')}`}
                          className="inline-flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                        >
                          {t('conversations.profile.phone.call')}
                          <Phone className="w-3 h-3" />
                        </a>
                        {selectedConversation.isLiveCall && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 text-xs font-semibold rounded-full">
                            <PhoneIncoming className="w-3 h-3 animate-pulse" />
                            {t('conversations.profile.phone.liveCall')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* WhatsApp Profile */}
              {selectedConversation.customerProfile.whatsapp && (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                    <Phone className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">{t('conversations.profile.whatsapp.number')}</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">{selectedConversation.customerProfile.whatsapp.phoneNumber}</p>
                      <a
                        href={`tel:${selectedConversation.customerProfile.whatsapp.phoneNumber.replace(/\s+/g, '')}`}
                        className="inline-flex items-center gap-1 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                      >
                        {t('conversations.profile.whatsapp.call')}
                        <Phone className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Facebook Profile */}
              {selectedConversation.customerProfile.facebook && (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                    <Facebook className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">{t('conversations.profile.facebook.profile')}</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">{selectedConversation.customerProfile.facebook.name}</p>
                      <a
                        href={selectedConversation.customerProfile.facebook.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                      >
                        {t('conversations.profile.facebook.visitProfile')}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Web Widget Profile */}
              {selectedConversation.customerProfile.web && (
                <div className="space-y-3">
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800 space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Globe className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{t('conversations.profile.web.title')}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">{t('conversations.profile.web.fullName')}</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {selectedConversation.customerProfile.web.firstName} {selectedConversation.customerProfile.web.lastName}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {t('conversations.profile.web.email')}
                        </p>
                        <a
                          href={`mailto:${selectedConversation.customerProfile.web.email}`}
                          className="text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
                        >
                          {selectedConversation.customerProfile.web.email}
                        </a>
                      </div>
                      
                      {selectedConversation.customerProfile.web.phoneNumber && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {t('conversations.profile.web.phoneOptional')}
                          </p>
                          <a
                            href={`tel:${selectedConversation.customerProfile.web.phoneNumber.replace(/\s+/g, '')}`}
                            className="text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
                          >
                            {selectedConversation.customerProfile.web.phoneNumber}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 rounded-b-2xl">
              <button
                onClick={() => setShowProfileModal(false)}
                className="w-full px-4 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                {t('conversations.actions.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && selectedConversation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full shadow-xl">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {t('conversations.assignModal.title')}
              </h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('conversations.assignModal.selectAgent')}
                </div>
                <div className="space-y-2">
                  {[
                    { id: '1', name: 'Ayşe Yılmaz', avatar: '👩', status: 'online', conversations: 3 },
                    { id: '2', name: 'Mehmet Kaya', avatar: '👨', status: 'online', conversations: 5 },
                    { id: '3', name: 'Zeynep Demir', avatar: '👩', status: 'busy', conversations: 8 },
                    { id: '4', name: 'Ali Yıldız', avatar: '👨', status: 'offline', conversations: 0 },
                  ].map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => {
                        alert(t('conversations.assignedTo', { name: agent.name }));
                        setShowAssignModal(false);
                      }}
                      className="w-full p-3 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{agent.avatar}</div>
                        <div className="text-left">
                          <div className="font-medium text-gray-900 dark:text-white">{agent.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {agent.conversations} {t('conversations.assignModal.activeConversations', { count: agent.conversations })}
                          </div>
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        agent.status === 'online' ? 'bg-green-500' :
                        agent.status === 'busy' ? 'bg-yellow-500' :
                        'bg-gray-400'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 rounded-b-2xl">
              <button
                onClick={() => setShowAssignModal(false)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                {t('conversations.actions.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationsPage;

