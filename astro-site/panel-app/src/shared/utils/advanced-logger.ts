 

/**
 * Advanced Logging System
 * Enterprise-grade structured logging with context
 * 
 * @module shared/utils/advanced-logger
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LogContext {
  timestamp?: string;
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
  stackTrace?: string;
  [key: string]: any;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  context: LogContext;
  timestamp: string;
}

/**
 * Advanced Logger Class
 * Structured logging with context enrichment
 */
class AdvancedLogger {
  private logLevel: LogLevel;
  private buffer: LogEntry[] = [];
  private maxBufferSize = 100;
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.logLevel = import.meta.env.PROD ? LogLevel.INFO : LogLevel.DEBUG;
    this.sessionId = this.generateSessionId();
    this.setupErrorCatching();
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Setup global error catching
   */
  private setupErrorCatching(): void {
    // Catch unhandled errors
    window.addEventListener('error', (event) => {
      this.error('Unhandled error', new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled promise rejection', event.reason as Error);
    });
  }

  /**
   * Set user ID for context enrichment
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * Get session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Set log level
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * Create log entry with context
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    error?: Error,
    context?: LogContext
  ): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: {
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId,
        userId: this.userId,
        environment: import.meta.env.MODE,
        userAgent: navigator.userAgent,
        url: window.location.href,
        ...context,
      },
    };

    // Add stack trace for errors
    if (error) {
      entry.context.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
      entry.context.stackTrace = error.stack;
    }

    return entry;
  }

  /**
   * Add to buffer
   */
  private addToBuffer(entry: LogEntry): void {
    this.buffer.push(entry);
    
    // Keep buffer size manageable
    if (this.buffer.length > this.maxBufferSize) {
      this.buffer.shift();
    }
  }

  /**
   * Send logs to remote service
   */
  private async sendToRemote(_entry: LogEntry): Promise<void> {
    if (!import.meta.env.PROD) return;

    try {
      // ✅ Remote Logging Integration
      // When ready: import { sendLog } from '@/lib/integrations/logging';
      // await sendLog(entry);
      
      // Example: Send to backend logging service
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry),
      // });
    } catch (error) {
      // Fail silently to avoid infinite loops
      console.error('Failed to send log to remote:', error);
    }
  }

  /**
   * Log message
   */
  private log(
    level: LogLevel,
    message: string,
    error?: Error,
    context?: LogContext
  ): void {
    // Check if should log based on level
    if (level < this.logLevel) return;

    const entry = this.createLogEntry(level, message, error, context);
    
    // Add to buffer
    this.addToBuffer(entry);

    // Console output (formatted)
    if (!import.meta.env.PROD || level >= LogLevel.ERROR) {
      this.consoleLog(entry);
    }

    // Send to remote (production only, ERROR and above)
    if (level >= LogLevel.ERROR) {
      this.sendToRemote(entry);
    }

    // ✅ Error Monitoring Integration
    // When ready: import * as Sentry from '@sentry/react';
    // if (level >= LogLevel.ERROR && error) {
    //   Sentry.captureException(error, {
    //     contexts: { custom: entry.context },
    //     level: level === LogLevel.FATAL ? 'fatal' : 'error',
    //   });
    // }
  }

  /**
   * Format console output
   */
  private consoleLog(entry: LogEntry): void {
    const { level, message, context } = entry;
    const levelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'];
    const levelColors = [
      'color: #9CA3AF', // gray
      'color: #3B82F6', // blue
      'color: #F59E0B', // yellow
      'color: #EF4444', // red
      'color: #DC2626; font-weight: bold', // dark red
    ];

    const prefix = `%c[${levelNames[level]}] ${entry.timestamp}`;
    const style = levelColors[level];

    switch (level) {
      case LogLevel.DEBUG:
        console.log(prefix, style, message, context);
        break;
      case LogLevel.INFO:
        console.log(prefix, style, message, context);
        break;
      case LogLevel.WARN:
        console.warn(prefix, style, message, context);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(prefix, style, message, context);
        if (context.error) {
          console.error('Error details:', context.error);
        }
        break;
    }
  }

  /**
   * Public logging methods
   */
  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, undefined, context);
  }

  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, undefined, context);
  }

  warn(message: string, error?: Error, context?: LogContext): void {
    this.log(LogLevel.WARN, message, error, context);
  }

  error(message: string, error: Error, context?: LogContext): void {
    this.log(LogLevel.ERROR, message, error, context);
  }

  fatal(message: string, error: Error, context?: LogContext): void {
    this.log(LogLevel.FATAL, message, error, context);
  }

  /**
   * Get log buffer
   */
  getBuffer(): LogEntry[] {
    return [...this.buffer];
  }

  /**
   * Clear buffer
   */
  clearBuffer(): void {
    this.buffer = [];
  }

  /**
   * Export logs
   */
  exportLogs(): string {
    return JSON.stringify(this.buffer, null, 2);
  }

  /**
   * Download logs as file
   */
  downloadLogs(): void {
    const logs = this.exportLogs();
    const blob = new Blob([logs], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs_${this.sessionId}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Export singleton instance
export const advancedLogger = new AdvancedLogger();

// Export for easy usage
export default advancedLogger;

