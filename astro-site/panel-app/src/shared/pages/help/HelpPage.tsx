import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '@/shared/utils/logger';
import {
  HelpCircle,
  Search,
  Video,
  FileText,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Book,
  PlayCircle,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Rocket,
  Settings,
  Users,
  BarChart3,
  Send,
  Paperclip,
  Image,
  X
} from 'lucide-react';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

interface VideoTutorial {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  category: string;
  views: number;
}

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  lastUpdate: string;
}

const HelpPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketPriority, setTicketPriority] = useState('normal');
  const [ticketFiles, setTicketFiles] = useState<File[]>([]);

  const categories = [
    { id: 'all', label: t('help.categories.all'), icon: <Book className="w-5 h-5" /> },
    { id: 'getting_started', label: t('help.categories.gettingStarted'), icon: <Rocket className="w-5 h-5" /> },
    { id: 'features', label: t('help.categories.features'), icon: <Lightbulb className="w-5 h-5" /> },
    { id: 'settings', label: t('help.categories.settings'), icon: <Settings className="w-5 h-5" /> },
    { id: 'team', label: t('help.categories.team'), icon: <Users className="w-5 h-5" /> },
    { id: 'analytics', label: t('help.categories.analytics'), icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'troubleshooting', label: t('help.categories.troubleshooting'), icon: <AlertCircle className="w-5 h-5" /> }
  ];

  const faqItems: FAQItem[] = [
    {
      id: '1',
      category: 'getting_started',
      question: t('help.faq.questions.q1'),
      answer: t('help.faq.questions.a1')
    },
    {
      id: '2',
      category: 'getting_started',
      question: t('help.faq.questions.q2'),
      answer: t('help.faq.questions.a2')
    },
    {
      id: '3',
      category: 'features',
      question: t('help.faq.questions.q3'),
      answer: t('help.faq.questions.a3')
    },
    {
      id: '4',
      category: 'features',
      question: t('help.faq.questions.q4'),
      answer: t('help.faq.questions.a4')
    },
    {
      id: '5',
      category: 'features',
      question: t('help.faq.questions.q5'),
      answer: t('help.faq.questions.a5')
    },
    {
      id: '6',
      category: 'settings',
      question: t('help.faq.questions.q6'),
      answer: t('help.faq.questions.a6')
    },
    {
      id: '7',
      category: 'team',
      question: t('help.faq.questions.q7'),
      answer: t('help.faq.questions.a7')
    },
    {
      id: '8',
      category: 'team',
      question: t('help.faq.questions.q8'),
      answer: t('help.faq.questions.a8')
    },
    {
      id: '9',
      category: 'analytics',
      question: t('help.faq.questions.q9'),
      answer: t('help.faq.questions.a9')
    },
    {
      id: '10',
      category: 'analytics',
      question: t('help.faq.questions.q10'),
      answer: t('help.faq.questions.a10')
    },
    {
      id: '11',
      category: 'troubleshooting',
      question: t('help.faq.questions.q11'),
      answer: t('help.faq.questions.a11')
    },
    {
      id: '12',
      category: 'troubleshooting',
      question: t('help.faq.questions.q12'),
      answer: t('help.faq.questions.a12')
    }
  ];

  const videoTutorials: VideoTutorial[] = [
    {
      id: '1',
      title: t('help.videos.tutorials.t1'),
      duration: '5:30',
      thumbnail: 'https://via.placeholder.com/320x180/3b82f6/ffffff?text=Quick+Start',
      category: 'getting_started',
      views: 1250
    },
    {
      id: '2',
      title: t('help.videos.tutorials.t2'),
      duration: '8:45',
      thumbnail: 'https://via.placeholder.com/320x180/8b5cf6/ffffff?text=AI+Setup',
      category: 'getting_started',
      views: 980
    },
    {
      id: '3',
      title: t('help.videos.tutorials.t3'),
      duration: '6:20',
      thumbnail: 'https://via.placeholder.com/320x180/10b981/ffffff?text=Social+Media',
      category: 'features',
      views: 1540
    },
    {
      id: '4',
      title: t('help.videos.tutorials.t4'),
      duration: '7:15',
      thumbnail: 'https://via.placeholder.com/320x180/f59e0b/ffffff?text=Conversations',
      category: 'features',
      views: 870
    },
    {
      id: '5',
      title: t('help.videos.tutorials.t5'),
      duration: '9:30',
      thumbnail: 'https://via.placeholder.com/320x180/ef4444/ffffff?text=Analytics',
      category: 'analytics',
      views: 650
    },
    {
      id: '6',
      title: t('help.videos.tutorials.t6'),
      duration: '6:50',
      thumbnail: 'https://via.placeholder.com/320x180/06b6d4/ffffff?text=Team',
      category: 'team',
      views: 720
    }
  ];

  const supportTickets: SupportTicket[] = [
    {
      id: 'TKT-001',
      subject: t('help.tickets.mockSubjects.s1'),
      status: 'in_progress',
      createdAt: '2024-10-08',
      lastUpdate: t('help.avgResponseValue')
    },
    {
      id: 'TKT-002',
      subject: t('help.tickets.mockSubjects.s2'),
      status: 'resolved',
      createdAt: '2024-10-05',
      lastUpdate: t('time.daysAgo', { count: 3 })
    }
  ];

  const filteredFAQs = faqItems.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredVideos = videoTutorials.filter(video => {
    const matchesCategory = activeCategory === 'all' || video.category === activeCategory;
    return matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{t('help.tickets.status.open')}</span>;
      case 'in_progress':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">{t('help.tickets.status.inProgress')}</span>;
      case 'resolved':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">{t('help.tickets.status.resolved')}</span>;
      default:
        return null;
    }
  };

  const handleSubmitTicket = () => {
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      alert(t('common.help.requiredFields'));
      return;
    }

    logger.debug('Ticket submitted:', { ticketSubject, ticketMessage, ticketPriority });
    alert(t('common.help.ticketCreated'));
    setShowTicketForm(false);
    setTicketSubject('');
    setTicketMessage('');
    setTicketPriority('normal');
  };

  return (
    <div className="flex flex-col max-w-[1600px] mx-auto px-8 py-6 gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <HelpCircle className="w-7 h-7 text-blue-600" />
            {t('help.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{t('help.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowTicketForm(true)}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          {t('help.createTicket')}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('help.stats.totalArticles')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{faqItems.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('help.stats.videoTutorials')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{videoTutorials.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Video className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('help.stats.activeTickets')}</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {supportTickets.filter(t => t.status !== 'resolved').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <MessageCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('help.stats.avgResponseTime')}</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{t('help.avgResponseValue')}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('common.help.searchPlaceholder')}
            className="w-full pl-14 pr-4 py-4 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-lg"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${ activeCategory === category.id ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200' }`}
            >
              {category.icon}
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ Section */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            {t('help.faq.title')}
          </h2>
          <div className="space-y-3">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:bg-slate-900 transition-colors"
                  >
                    <span className="font-medium text-gray-900 dark:text-gray-100 text-left">{faq.question}</span>
                    {expandedFAQ === faq.id ? (
                      <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-8 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">{t('help.faq.noResults')}</p>
              </div>
            )}
          </div>

          {/* Video Tutorials */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mt-8">
            <Video className="w-6 h-6 text-purple-600" />
            {t('help.videos.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{video.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{video.views} {t('help.videos.views')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar - Contact & Tickets */}
        <div className="space-y-4">
          {/* Contact Support */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              {t('help.support.title')}
            </h3>
            <p className="text-blue-100 mb-4 text-sm">
              {t('help.support.description')}
            </p>
            <div className="space-y-3">
              <a
                href="mailto:destek@asistanapp.com"
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                {t('help.support.sendEmail')}
              </a>
              <a
                href="tel:+908501234567"
                className="w-full px-4 py-2.5 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                +90 850 123 4567
              </a>
            </div>
          </div>

          {/* My Tickets */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              {t('help.tickets.title')}
            </h3>
            {supportTickets.length > 0 ? (
              <div className="space-y-3">
                {supportTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="border border-gray-200 dark:border-slate-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-mono text-gray-600 dark:text-gray-400">{ticket.id}</span>
                      {getStatusBadge(ticket.status)}
                    </div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1">{ticket.subject}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('help.tickets.lastUpdate')} {ticket.lastUpdate}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('help.tickets.noTickets')}</p>
            )}
          </div>

          {/* Documentation Links */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Book className="w-5 h-5 text-blue-600" />
              {t('help.documentation.title')}
            </h3>
            <div className="space-y-2">
              <a
                href="https://docs.asistanapp.com/api"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm"
              >
                <span className="text-gray-700 dark:text-gray-300">{t('help.documentation.apiDocs')}</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
              <a
                href="https://docs.asistanapp.com/integration"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm"
              >
                <span className="text-gray-700 dark:text-gray-300">{t('help.documentation.integrationGuide')}</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
              <a
                href="https://docs.asistanapp.com/security"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm"
              >
                <span className="text-gray-700 dark:text-gray-300">{t('help.documentation.security')}</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
              <a
                href="https://docs.asistanapp.com/changelog"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm"
              >
                <span className="text-gray-700 dark:text-gray-300">{t('help.documentation.changelog')}</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showTicketForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('help.ticketForm.title')}</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{t('help.ticketForm.subtitle')}</p>
              </div>
              <button
                onClick={() => {
                  setShowTicketForm(false);
                  setTicketSubject('');
                  setTicketMessage('');
                  setTicketPriority('normal');
                  setTicketFiles([]);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('help.ticketForm.subject')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder={t('common.help.subjectPlaceholder')}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('help.ticketForm.priority')}
                </label>
                <select
                  value={ticketPriority}
                  onChange={(e) => setTicketPriority(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="low">{t('help.ticketForm.priorities.low')}</option>
                  <option value="normal">{t('help.ticketForm.priorities.normal')}</option>
                  <option value="high">{t('help.ticketForm.priorities.high')}</option>
                  <option value="urgent">{t('help.ticketForm.priorities.urgent')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('help.ticketForm.description')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder={t('common.help.messagePlaceholder')}
                  rows={6}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('help.ticketForm.attachments')}
                </label>
                <div className="space-y-3">
                  <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 dark:bg-slate-900">
                    <Paperclip className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t('help.ticketForm.addFile')}
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.txt"
                      onChange={(e) => {
                        if (e.target.files) {
                          setTicketFiles([...ticketFiles, ...Array.from(e.target.files)]);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  
                  {ticketFiles.length > 0 && (
                    <div className="space-y-2">
                      {ticketFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {file.type.startsWith('image/') ? (
                              <Image className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            ) : (
                              <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                            )}
                            <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setTicketFiles(ticketFiles.filter((_, i) => i !== index));
                            }}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-slate-800 rounded transition-colors"
                          >
                            <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-medium mb-1">{t('help.ticketForm.tip.title')}</p>
                    <p>{t('help.ticketForm.tip.text')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowTicketForm(false);
                  setTicketSubject('');
                  setTicketMessage('');
                  setTicketPriority('normal');
                  setTicketFiles([]);
                }}
                className="px-5 py-2.5 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium"
              >
                {t('help.ticketForm.cancel')}
              </button>
              <button
                onClick={handleSubmitTicket}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {t('help.ticketForm.submit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpPage;

