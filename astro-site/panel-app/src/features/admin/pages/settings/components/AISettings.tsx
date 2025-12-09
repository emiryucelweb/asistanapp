import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '@/shared/utils/logger';
import { Sparkles, MessageCircle, AlertCircle, FileText, Save, Upload, X } from 'lucide-react';

interface KnowledgeFile {
  id: number;
  name: string;
  size: string;
  uploadedAt: string;
}

const AISettings: React.FC = () => {
  const { t } = useTranslation('admin');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [aiConfig, setAiConfig] = useState({
    personality: 'professional',
    tone: 'friendly',
    useEmoji: 'sometimes',
    responseLength: 'medium',
    handoffThreshold: 3,
    enableAutoHandoff: true,
    workingHoursOnly: false
  });

  const [messages, setMessages] = useState({
    greeting: t('settings.ai.customMessages.defaultGreeting'),
    goodbye: t('settings.ai.customMessages.defaultGoodbye'),
    busy: t('settings.ai.customMessages.defaultBusy'),
    holiday: t('settings.ai.customMessages.defaultHoliday')
  });

  const [urgentKeywords, setUrgentKeywords] = useState([
    t('settings.ai.urgentKeywords.mockData.urgent'),
    t('settings.ai.urgentKeywords.mockData.complaint'),
    t('settings.ai.urgentKeywords.mockData.cancel'),
    t('settings.ai.urgentKeywords.mockData.problem'),
    t('settings.ai.urgentKeywords.mockData.return'),
    t('settings.ai.urgentKeywords.mockData.pain'),
    t('settings.ai.urgentKeywords.mockData.bleeding'),
    t('settings.ai.urgentKeywords.mockData.hurt')
  ]);

  const [newKeyword, setNewKeyword] = useState('');
  
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>([
    { id: 1, name: 'tedavi-bilgileri.pdf', size: '1.2 MB', uploadedAt: t('system.mockData.time.2hours') || '2 days ago' },
    { id: 2, name: 'fiyat-listesi.xlsx', size: '450 KB', uploadedAt: t('system.mockData.time.1day') || '1 week ago' }
  ]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
      alert(t('settings.ai.messages.settingsSaved'));
    logger.debug('AI config saved:', { aiConfig, messages, urgentKeywords, knowledgeFiles });
  };

  const addKeyword = () => {
    if (!newKeyword.trim()) {
      alert(t('settings.ai.messages.keywordRequired'));
      return;
    }
    if (urgentKeywords.includes(newKeyword.toLowerCase().trim())) {
      alert(t('settings.ai.messages.keywordExists'));
      return;
    }
    setUrgentKeywords([...urgentKeywords, newKeyword.toLowerCase().trim()]);
    setNewKeyword('');
    alert(t('settings.ai.messages.keywordAdded'));
  };

  const removeKeyword = (keyword: string) => {
    if (confirm(t('settings.ai.urgentKeywords.confirmRemove', { keyword }))) {
      setUrgentKeywords(urgentKeywords.filter(k => k !== keyword));
      alert(t('settings.ai.messages.keywordRemoved'));
    }
  };

  const handleUploadFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert(t('settings.ai.messages.fileTooLarge'));
        return;
      }
      const newFile: KnowledgeFile = {
        id: Date.now(),
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        uploadedAt: t('settings.ai.timeAgo.justNow')
      };
      setKnowledgeFiles([...knowledgeFiles, newFile]);
      alert(t('settings.ai.messages.fileUploaded'));
    }
  };

  const handleDeleteFile = (fileId: number) => {
    const file = knowledgeFiles.find(f => f.id === fileId);
    if (file && confirm(t('settings.ai.knowledgeBase.confirmDelete', { fileName: file.name }))) {
      setKnowledgeFiles(knowledgeFiles.filter(f => f.id !== fileId));
      alert(t('settings.ai.messages.fileDeleted'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('settings.ai.title')}</h2>
        <p className="text-sm text-gray-500 mt-1">{t('settings.ai.subtitle')}</p>
      </div>

      {/* AI Personality */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          <Sparkles className="w-5 h-5 inline mr-2 text-purple-500" />
          {t('settings.ai.personality.title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ai-personality" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.ai.personality.assistantPersonality')}</label>
            <select
              id="ai-personality"
              value={aiConfig.personality}
              onChange={(e) => setAiConfig({ ...aiConfig, personality: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            >
              <option value="professional">{t('settings.ai.personality.personalityTypes.professional')}</option>
              <option value="friendly">{t('settings.ai.personality.personalityTypes.friendly')}</option>
              <option value="energetic">{t('settings.ai.personality.personalityTypes.energetic')}</option>
              <option value="formal">{t('settings.ai.personality.personalityTypes.formal')}</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('settings.ai.personality.personalityDesc')}</p>
          </div>
          <div>
            <label htmlFor="ai-tone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.ai.personality.responseTone')}</label>
            <select
              id="ai-tone"
              value={aiConfig.tone}
              onChange={(e) => setAiConfig({ ...aiConfig, tone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            >
              <option value="formal">{t('settings.ai.personality.toneTypes.formal')}</option>
              <option value="friendly">{t('settings.ai.personality.toneTypes.friendly')}</option>
              <option value="technical">{t('settings.ai.personality.toneTypes.technical')}</option>
              <option value="casual">{t('settings.ai.personality.toneTypes.casual')}</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('settings.ai.personality.toneDesc')}</p>
          </div>
          <div>
            <label htmlFor="ai-emoji" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.ai.personality.emojiUsage')}</label>
            <select
              id="ai-emoji"
              value={aiConfig.useEmoji}
              onChange={(e) => setAiConfig({ ...aiConfig, useEmoji: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            >
              <option value="never">{t('settings.ai.personality.emojiTypes.never')}</option>
              <option value="sometimes">{t('settings.ai.personality.emojiTypes.sometimes')}</option>
              <option value="frequently">{t('settings.ai.personality.emojiTypes.frequently')}</option>
            </select>
          </div>
          <div>
            <label htmlFor="ai-response-length" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.ai.personality.responseLength')}</label>
            <select
              id="ai-response-length"
              value={aiConfig.responseLength}
              onChange={(e) => setAiConfig({ ...aiConfig, responseLength: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            >
              <option value="short">{t('settings.ai.personality.lengthTypes.short')}</option>
              <option value="medium">{t('settings.ai.personality.lengthTypes.medium')}</option>
              <option value="long">{t('settings.ai.personality.lengthTypes.long')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Handoff Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          <AlertCircle className="w-5 h-5 inline mr-2 text-amber-500" />
          {t('settings.ai.handoff.title')}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.ai.handoff.autoHandoff')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('settings.ai.handoff.autoHandoffDesc')}</p>
            </div>
            <label htmlFor="ai-auto-handoff" className="relative inline-flex items-center cursor-pointer">
              <span className="sr-only">{t('settings.ai.handoff.autoHandoff')}</span>
              <input
                id="ai-auto-handoff"
                type="checkbox"
                checked={aiConfig.enableAutoHandoff}
                onChange={(e) => setAiConfig({ ...aiConfig, enableAutoHandoff: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-800 after:border-gray-300 dark:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label htmlFor="ai-handoff-threshold" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.ai.handoff.threshold')}</label>
            <div className="flex items-center gap-4">
              <input
                id="ai-handoff-threshold"
                type="range"
                min="1"
                max="10"
                value={aiConfig.handoffThreshold}
                onChange={(e) => setAiConfig({ ...aiConfig, handoffThreshold: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="text-lg font-bold text-blue-600 w-12 text-center">{aiConfig.handoffThreshold}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('settings.ai.handoff.thresholdDesc')}</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.ai.handoff.workingHoursOnly')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('settings.ai.handoff.workingHoursDesc')}</p>
            </div>
            <label htmlFor="ai-working-hours-only" className="relative inline-flex items-center cursor-pointer">
              <span className="sr-only">{t('settings.ai.handoff.workingHoursOnly')}</span>
              <input
                id="ai-working-hours-only"
                type="checkbox"
                checked={aiConfig.workingHoursOnly}
                onChange={(e) => setAiConfig({ ...aiConfig, workingHoursOnly: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-800 after:border-gray-300 dark:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Urgent Keywords */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('settings.ai.urgentKeywords.title')}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('settings.ai.urgentKeywords.description')}</p>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                  placeholder={t('settings.ai.addKeywordPlaceholder')}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
          />
          <button
            onClick={addKeyword}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {t('settings.ai.addKeyword')}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {urgentKeywords.map((keyword) => (
            <span
              key={keyword}
              className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"
            >
              {keyword}
              <button
                onClick={() => removeKeyword(keyword)}
                className="ml-1 hover:text-red-900"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Custom Messages */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          <MessageCircle className="w-5 h-5 inline mr-2 text-blue-500" />
          {t('settings.ai.customMessages.title')}
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="ai-msg-greeting" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.ai.customMessages.greeting')}</label>
            <textarea
              id="ai-msg-greeting"
              value={messages.greeting}
              onChange={(e) => setMessages({ ...messages, greeting: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="ai-msg-goodbye" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.ai.customMessages.goodbye')}</label>
            <textarea
              id="ai-msg-goodbye"
              value={messages.goodbye}
              onChange={(e) => setMessages({ ...messages, goodbye: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="ai-msg-busy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.ai.customMessages.busy')}</label>
            <textarea
              id="ai-msg-busy"
              value={messages.busy}
              onChange={(e) => setMessages({ ...messages, busy: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="ai-msg-holiday" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.ai.customMessages.holiday')}</label>
            <textarea
              id="ai-msg-holiday"
              value={messages.holiday}
              onChange={(e) => setMessages({ ...messages, holiday: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Knowledge Base */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          <FileText className="w-5 h-5 inline mr-2 text-green-500" />
          {t('settings.ai.knowledgeBase.title')}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('settings.ai.knowledgeBase.description')}</p>
        
        {/* Text Input for Knowledge */}
        <div className="mb-6">
          <label htmlFor="ai-knowledge-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.ai.knowledgeBase.textInput')}</label>
          <textarea
            id="ai-knowledge-text"
            placeholder={t('settings.ai.contextPlaceholder')}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
          />
          <div className="mt-2 flex justify-end">
            <button 
              onClick={() => alert(t('settings.ai.messages.contextSaved'))}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {t('settings.ai.knowledgeBase.saveKnowledge')}
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-slate-600 pt-6 mb-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('settings.ai.knowledgeBase.uploadDocument')}</p>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.doc,.docx,.xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />
        <div 
          onClick={handleUploadFile}
          className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('settings.ai.knowledgeBase.uploadDocument')}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('settings.ai.knowledgeBase.uploadDescription')}</p>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleUploadFile();
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            {t('settings.ai.knowledgeBase.selectFile')}
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {knowledgeFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className={`w-5 h-5 ${file.name.endsWith('.pdf') ? 'text-blue-500' : 'text-green-500'}`} />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{file.size} • {file.uploadedAt} {t('settings.ai.knowledgeBase.uploaded')}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDeleteFile(file.id)}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                {t('settings.ai.knowledgeBase.delete')}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium"
        >
          {t('settings.common.cancel')}
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <div className="flex items-center justify-center gap-0.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1 h-1 rounded-full bg-white animate-bounce"
                    style={{
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: '0.6s',
                    }}
                  />
                ))}
              </div>
              {t('settings.common.saving')}
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {t('settings.common.save')}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AISettings;

