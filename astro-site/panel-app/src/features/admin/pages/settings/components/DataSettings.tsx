import React from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '@/shared/utils/logger';
import { Database, Download, Upload, Trash2, RefreshCw } from 'lucide-react';

const DataSettings: React.FC = () => {
  const { t } = useTranslation('admin');
  const handleExportCustomers = () => {
    const link = document.createElement('a');
    link.href = '#';
    link.download = `musteriler_${new Date().toISOString().split('T')[0]}.xlsx`;
    alert(t('settings.data.messages.customersExporting', { fileName: link.download }));
    logger.debug('Exporting customers to Excel...');
  };

  const handleExportAppointments = () => {
    const link = document.createElement('a');
    link.href = '#';
    link.download = `randevular_${new Date().toISOString().split('T')[0]}.xlsx`;
    alert(t('settings.data.messages.appointmentsExporting', { fileName: link.download }));
    logger.debug('Exporting appointments to Excel...');
  };

  const handleExportMessages = () => {
    const link = document.createElement('a');
    link.href = '#';
    link.download = `mesajlar_${new Date().toISOString().split('T')[0]}.csv`;
    alert(t('settings.data.messages.messagesExporting', { fileName: link.download }));
    logger.debug('Exporting messages to CSV...');
  };

  const handleExportReports = () => {
    const link = document.createElement('a');
    link.href = '#';
    link.download = `raporlar_${new Date().toISOString().split('T')[0]}.pdf`;
    alert(t('settings.data.messages.reportsExporting', { fileName: link.download }));
    logger.debug('Exporting reports to PDF...');
  };

  const handleImportCustomers = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        alert(t('settings.data.messages.customersImporting', { 
          fileName: file.name, 
          size: (file.size / 1024).toFixed(2) 
        }));
        logger.debug('Importing customers from:', { fileName: file.name });
      }
    };
    input.click();
  };

  const handleImportAppointments = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        alert(t('settings.data.messages.appointmentsImporting', { fileName: file.name }));
        logger.debug('Importing appointments from:', { fileName: file.name });
      }
    };
    input.click();
  };

  const handleManualBackup = async () => {
    const confirmed = confirm(t('settings.data.confirmManualBackup'));
    if (confirmed) {
      alert(t('settings.data.manualBackupStarted'));
      logger.debug('Manual backup started at:', { timestamp: new Date().toISOString() });
    }
  };

  const handleDownloadLastBackup = () => {
    const link = document.createElement('a');
    link.href = '#';
    link.download = `yedek_15_01_2025_03_00.zip`;
    alert(t('settings.data.messages.lastBackupDownloading', { fileName: link.download }));
  };

  const handleBulkDelete = () => {
    if (confirm(t('settings.data.confirmBulkDelete'))) {
      const doubleConfirm = confirm(t('settings.data.messages.doubleConfirmDelete'));
      if (doubleConfirm) {
        alert(t('settings.data.bulkDeleteCancelled'));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('settings.data.title')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('settings.data.subtitle')}</p>
      </div>

      {/* Export Data */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          <Download className="w-5 h-5 inline mr-2 text-blue-500" />
          {t('settings.data.export.title')}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('settings.data.export.description')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleExportCustomers}
            className="p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.data.export.customers')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.data.export.formats.excel')}</p>
              </div>
            </div>
          </button>

          <button
            onClick={handleExportAppointments}
            className="p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.data.export.appointments')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.data.export.formats.excel')}</p>
              </div>
            </div>
          </button>

          <button
            onClick={handleExportMessages}
            className="p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.data.export.messages')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.data.export.formats.csv')}</p>
              </div>
            </div>
          </button>

          <button 
            onClick={handleExportReports}
            className="p-4 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.data.export.reports')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.data.export.formats.pdf')}</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Import Data */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          <Upload className="w-5 h-5 inline mr-2 text-green-500" />
          {t('settings.data.import.title')}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('settings.data.import.description')}</p>
        <div className="space-y-3">
          <button
            onClick={handleImportCustomers}
            className="w-full p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.data.import.uploadCustomers')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.data.import.uploadCustomersDesc')}</p>
              </div>
            </div>
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">{t('settings.data.import.select')}</span>
          </button>

          <button 
            onClick={handleImportAppointments}
            className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.data.import.bulkAppointments')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.data.import.bulkAppointmentsDesc')}</p>
              </div>
            </div>
            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">{t('settings.data.import.select')}</span>
          </button>
        </div>

        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-800 dark:text-amber-300" dangerouslySetInnerHTML={{ __html: t('settings.data.import.templateNote') }} />
        </div>
      </div>

      {/* Manual Backup */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          <Database className="w-5 h-5 inline mr-2 text-purple-500" />
          {t('settings.data.backup.title')}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('settings.data.backup.description')}</p>
        <button
          onClick={handleManualBackup}
          className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          {t('settings.data.backup.backupNow')}
        </button>
        <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('settings.data.backup.lastBackup')}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('settings.data.backup.lastBackupInfo')}</p>
            </div>
            <button 
              onClick={handleDownloadLastBackup}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              {t('settings.data.backup.download')}
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Delete */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border-2 border-red-200 dark:border-red-800 p-6">
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-4">
          <Trash2 className="w-5 h-5 inline mr-2" />
          {t('settings.data.bulkDelete.title')}
        </h3>
        <p className="text-sm text-red-700 dark:text-red-400 mb-4" dangerouslySetInnerHTML={{ __html: t('settings.data.bulkDelete.description') }} />
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label htmlFor="data-delete-start-date" className="block text-sm font-medium text-red-900 dark:text-red-300 mb-2">{t('settings.data.bulkDelete.startDate')}</label>
            <input
              id="data-delete-start-date"
              type="date"
              className="w-full px-4 py-2 border border-red-300 dark:border-red-700 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="data-delete-end-date" className="block text-sm font-medium text-red-900 dark:text-red-300 mb-2">{t('settings.data.bulkDelete.endDate')}</label>
            <input
              id="data-delete-end-date"
              type="date"
              className="w-full px-4 py-2 border border-red-300 dark:border-red-700 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            />
          </div>
        </div>
        <button
          onClick={handleBulkDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          {t('settings.data.bulkDelete.delete')}
        </button>
      </div>
    </div>
  );
};

export default DataSettings;

