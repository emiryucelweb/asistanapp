/**
 * useReportsExport Hook Tests
 * 
 * @group hooks
 * @group admin
 * @group reports
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useReportsExport } from '../useReportsExport';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'admin.reports.export.title': 'Raporlar ve Analizler',
        'admin.reports.export.subtitle': 'AsistanApp Yönetim Paneli',
        'admin.reports.export.description': 'Detaylı raporlar ve analizler',
        'admin.reports.export.dateRange': 'Son 30 gün',
        'admin.reports.export.statsTitle': 'Genel İstatistikler',
        'admin.reports.export.totalConversations': 'Toplam Konuşmalar',
        'admin.reports.export.aiSuccessRate': 'AI Başarı Oranı',
        'admin.reports.export.avgResponseTime': 'Ort. Yanıt Süresi',
        'admin.reports.export.customerSatisfaction': 'Müşteri Memnuniyeti',
        'admin.reports.export.note1': 'Not 1: Veriler gerçek zamanlı olarak güncellenir',
        'admin.reports.export.note2': 'Not 2: Raporlar her gün 00:00\'da yenilenir',
        'admin.reports.export.note3': 'Not 3: Detaylı analiz için Excel formatını kullanın',
      };
      return translations[key] || key;
    },
    i18n: { language: 'tr' },
  }),
}));

// Mock export helpers
vi.mock('@/shared/utils/export-helpers-v2', () => ({
  exportToPDF: vi.fn(() => Promise.resolve()),
  exportToExcel: vi.fn(() => Promise.resolve()),
  exportToCSV: vi.fn(() => Promise.resolve()),
}));

// Mock logger
vi.mock('@/shared/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useReportsExport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock DOM element for PDF export
    document.getElementById = vi.fn(() => document.createElement('div'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useReportsExport());

      expect(result.current.isExporting).toBe(false);
      expect(result.current.exportFormat).toBeNull();
    });

    it('should provide all export methods', () => {
      const { result } = renderHook(() => useReportsExport());

      expect(typeof result.current.handleExportPDF).toBe('function');
      expect(typeof result.current.handleExportExcel).toBe('function');
      expect(typeof result.current.handleExportCSV).toBe('function');
    });
  });

  describe('PDF Export', () => {
    it('should set exporting state during PDF export', async () => {
      const { result } = renderHook(() => useReportsExport());

      expect(result.current.isExporting).toBe(false);

      act(() => {
        result.current.handleExportPDF();
      });

      expect(result.current.isExporting).toBe(true);
      expect(result.current.exportFormat).toBe('pdf');

      await waitFor(() => {
        expect(result.current.isExporting).toBe(false);
      });
    });

    it('should call exportToPDF with correct data', async () => {
      const { exportToPDF } = await import('@/shared/utils/export-helpers-v2');
      const { result } = renderHook(() => useReportsExport());

      await act(async () => {
        await result.current.handleExportPDF();
      });

      expect(exportToPDF).toHaveBeenCalledTimes(1);
      expect(exportToPDF).toHaveBeenCalledWith(
        expect.objectContaining({
          config: expect.objectContaining({
            title: 'Raporlar ve Analizler',
            subtitle: 'AsistanApp Yönetim Paneli',
          }),
          stats: expect.objectContaining({
            title: 'Genel İstatistikler',
            items: expect.arrayContaining([
              expect.objectContaining({
                label: expect.any(String),
                value: expect.any(String),
              }),
            ]),
          }),
        })
      );
    });

    it('should reset state after successful export', async () => {
      const { result } = renderHook(() => useReportsExport());

      await act(async () => {
        await result.current.handleExportPDF();
      });

      await waitFor(() => {
        expect(result.current.isExporting).toBe(false);
        expect(result.current.exportFormat).toBeNull();
      });
    });

    it('should handle PDF export errors gracefully', async () => {
      const { exportToPDF } = await import('@/shared/utils/export-helpers-v2');
      vi.mocked(exportToPDF).mockRejectedValueOnce(new Error('Export failed'));

      const { result } = renderHook(() => useReportsExport());

      await expect(async () => {
        await act(async () => {
          await result.current.handleExportPDF();
        });
      }).rejects.toThrow('Export failed');

      expect(result.current.isExporting).toBe(false);
      expect(result.current.exportFormat).toBeNull();
    });

    it('should throw error when reports container not found', async () => {
      document.getElementById = vi.fn(() => null);

      const { result } = renderHook(() => useReportsExport());

      await expect(async () => {
        await act(async () => {
          await result.current.handleExportPDF();
        });
      }).rejects.toThrow('Reports container not found');
    });
  });

  describe('Excel Export', () => {
    it('should set exporting state during Excel export', async () => {
      const { result } = renderHook(() => useReportsExport());

      act(() => {
        result.current.handleExportExcel();
      });

      expect(result.current.isExporting).toBe(true);
      expect(result.current.exportFormat).toBe('excel');

      await waitFor(() => {
        expect(result.current.isExporting).toBe(false);
      });
    });

    it('should call exportToExcel with correct data', async () => {
      const { exportToExcel } = await import('@/shared/utils/export-helpers-v2');
      const { result } = renderHook(() => useReportsExport());

      await act(async () => {
        await result.current.handleExportExcel();
      });

      expect(exportToExcel).toHaveBeenCalledTimes(1);
      expect(exportToExcel).toHaveBeenCalledWith(
        expect.objectContaining({
          config: expect.any(Object),
          stats: expect.any(Object),
        })
      );
    });

    it('should handle Excel export errors', async () => {
      const { exportToExcel } = await import('@/shared/utils/export-helpers-v2');
      vi.mocked(exportToExcel).mockRejectedValueOnce(new Error('Excel export failed'));

      const { result } = renderHook(() => useReportsExport());

      await expect(async () => {
        await act(async () => {
          await result.current.handleExportExcel();
        });
      }).rejects.toThrow('Excel export failed');

      expect(result.current.isExporting).toBe(false);
    });
  });

  describe('CSV Export', () => {
    it('should set exporting state during CSV export', async () => {
      const { result } = renderHook(() => useReportsExport());

      act(() => {
        result.current.handleExportCSV();
      });

      expect(result.current.isExporting).toBe(true);
      expect(result.current.exportFormat).toBe('csv');

      await waitFor(() => {
        expect(result.current.isExporting).toBe(false);
      });
    });

    it('should call exportToCSV with correct data', async () => {
      const { exportToCSV } = await import('@/shared/utils/export-helpers-v2');
      const { result } = renderHook(() => useReportsExport());

      await act(async () => {
        await result.current.handleExportCSV();
      });

      expect(exportToCSV).toHaveBeenCalledTimes(1);
      expect(exportToCSV).toHaveBeenCalledWith(
        expect.objectContaining({
          config: expect.any(Object),
          stats: expect.any(Object),
        })
      );
    });

    it('should handle CSV export errors', async () => {
      const { exportToCSV } = await import('@/shared/utils/export-helpers-v2');
      vi.mocked(exportToCSV).mockRejectedValueOnce(new Error('CSV export failed'));

      const { result } = renderHook(() => useReportsExport());

      await expect(async () => {
        await act(async () => {
          await result.current.handleExportCSV();
        });
      }).rejects.toThrow('CSV export failed');

      expect(result.current.isExporting).toBe(false);
    });
  });

  describe('Concurrent Exports', () => {
    it('should handle concurrent export attempts (last one wins)', async () => {
      const { result } = renderHook(() => useReportsExport());

      // Start first export (non-blocking)
      act(() => {
        result.current.handleExportPDF();
      });

      expect(result.current.isExporting).toBe(true);
      expect(result.current.exportFormat).toBe('pdf');

      // Start second export immediately (will override)
      act(() => {
        result.current.handleExportExcel();
      });

      // Last call wins (no guard in current implementation)
      expect(result.current.exportFormat).toBe('excel');
      
      // Wait for exports to complete
      await waitFor(() => {
        expect(result.current.isExporting).toBe(false);
      });
    });

    it('should allow sequential exports', async () => {
      const { result } = renderHook(() => useReportsExport());

      // First export
      await act(async () => {
        await result.current.handleExportPDF();
      });

      expect(result.current.isExporting).toBe(false);

      // Second export (after first completes)
      await act(async () => {
        await result.current.handleExportExcel();
      });

      expect(result.current.isExporting).toBe(false);
    });
  });

  describe('Export Data Structure', () => {
    it('should include all required config fields', async () => {
      const { exportToPDF } = await import('@/shared/utils/export-helpers-v2');
      const { result } = renderHook(() => useReportsExport());

      await act(async () => {
        await result.current.handleExportPDF();
      });

      const callArgs = vi.mocked(exportToPDF).mock.calls[0][0];

      expect(callArgs.config).toHaveProperty('title');
      expect(callArgs.config).toHaveProperty('subtitle');
      expect(callArgs.config).toHaveProperty('description');
      expect(callArgs.config).toHaveProperty('dateRange');
      expect(callArgs.config).toHaveProperty('metadata');
    });

    it('should include stats with valid structure', async () => {
      const { exportToPDF } = await import('@/shared/utils/export-helpers-v2');
      const { result } = renderHook(() => useReportsExport());

      await act(async () => {
        await result.current.handleExportPDF();
      });

      const callArgs = vi.mocked(exportToPDF).mock.calls[0][0];

      expect(callArgs.stats).toBeDefined();
      expect(callArgs.stats!).toHaveProperty('title');
      expect(callArgs.stats!).toHaveProperty('items');
      expect(Array.isArray(callArgs.stats!.items)).toBe(true);
      expect(callArgs.stats!.items.length).toBeGreaterThan(0);
    });

    it('should include notes for PDF export', async () => {
      const { exportToPDF } = await import('@/shared/utils/export-helpers-v2');
      const { result } = renderHook(() => useReportsExport());

      await act(async () => {
        await result.current.handleExportPDF();
      });

      const callArgs = vi.mocked(exportToPDF).mock.calls[0][0];

      expect(callArgs).toHaveProperty('notes');
      expect(callArgs.notes).toBeDefined();
      expect(Array.isArray(callArgs.notes!)).toBe(true);
      expect(callArgs.notes!.length).toBeGreaterThan(0);
    });
  });

  describe('Logger Integration', () => {
    it('should log successful PDF export', async () => {
      const { logger } = await import('@/shared/utils/logger');
      const { result } = renderHook(() => useReportsExport());

      await act(async () => {
        await result.current.handleExportPDF();
      });

      expect(logger.info).toHaveBeenCalledWith(
        '[ReportsExport] PDF export successful',
        expect.objectContaining({
          filename: 'raporlar.pdf',
        })
      );
    });

    it('should log export errors', async () => {
      const { logger } = await import('@/shared/utils/logger');
      const { exportToPDF } = await import('@/shared/utils/export-helpers-v2');
      
      const error = new Error('Export failed');
      vi.mocked(exportToPDF).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useReportsExport());

      await expect(async () => {
        await act(async () => {
          await result.current.handleExportPDF();
        });
      }).rejects.toThrow();

      expect(logger.error).toHaveBeenCalledWith(
        '[ReportsExport] PDF export failed',
        expect.objectContaining({
          error,
        })
      );
    });
  });

  describe('Performance', () => {
    it('should complete export in reasonable time', async () => {
      const { result } = renderHook(() => useReportsExport());

      const start = performance.now();

      await act(async () => {
        await result.current.handleExportPDF();
      });

      const duration = performance.now() - start;

      // Should complete in less than 1 second (mocked)
      expect(duration).toBeLessThan(1000);
    });

    it('should handle rapid export attempts gracefully', async () => {
      const { result } = renderHook(() => useReportsExport());

      const promises = [];

      // Try to trigger multiple exports rapidly
      for (let i = 0; i < 10; i++) {
        const promise = act(async () => {
          await result.current.handleExportPDF();
        });
        promises.push(promise);
      }

      await Promise.all(promises);

      // Should have completed without errors
      expect(result.current.isExporting).toBe(false);
    });
  });
});

