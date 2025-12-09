 
// NOTE: Infrastructure/utility file - `any` used for generic types & external library interfaces

/**
 * WebSocket Client
 * Real-time notifications and updates
 */
import { io, Socket } from 'socket.io-client';
import { logger } from '@/shared/utils/logger';

class WebSocketClient {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private readonly HEARTBEAT_INTERVAL = 30000; // 30 seconds
  private readonly HEARTBEAT_TIMEOUT = 5000; // 5 seconds

  connect() {
    if (this.socket?.connected) {
      logger.debug('✅ WebSocket already connected');
      return;
    }

    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
    
    this.socket = io(wsUrl, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: this.maxReconnectAttempts,
      // ✅ PRODUCTION READY: Heartbeat/Ping configuration
      // Note: Socket.io handles ping/pong automatically, custom heartbeat implemented below
      // Socket.io v4 auto-manages ping/pong
      // pingInterval: 25000,
      // pingTimeout: 10000,
    });

    this.socket.on('connect', () => {
      logger.debug('✅ WebSocket connected');
      this.reconnectAttempts = 0;
      
      // ✅ Start custom heartbeat mechanism
      this.startHeartbeat();
    });

    this.socket.on('disconnect', (reason) => {
      logger.debug('❌ WebSocket disconnected:', { reason });
      
      // ✅ Stop heartbeat on disconnect
      this.stopHeartbeat();
    });

    this.socket.on('connect_error', (error) => {
      logger.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        logger.error('Max reconnection attempts reached');
        this.disconnect();
      }
    });

    return this.socket;
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * ✅ PRODUCTION READY: Custom heartbeat mechanism
   * Sends periodic ping to server to keep connection alive
   * Useful for detecting stale connections behind proxies/load balancers
   */
  private startHeartbeat() {
    // Clear any existing heartbeat
    this.stopHeartbeat();

    // Send initial ping
    this.sendHeartbeat();

    // Setup periodic heartbeat
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, this.HEARTBEAT_INTERVAL);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private sendHeartbeat() {
    if (!this.socket?.connected) {
      logger.warn('⚠️ Cannot send heartbeat: socket not connected');
      return;
    }

    const startTime = Date.now();

    // Send ping and wait for pong
    this.socket.emit('ping', { timestamp: startTime }, (_response: any) => {
      const latency = Date.now() - startTime;
      logger.debug(`💓 Heartbeat: ${latency}ms`);
      
      // Detect high latency
      if (latency > 1000) {
        logger.warn(`⚠️ High latency detected: ${latency}ms`);
      }
    });

    // Set timeout for pong response
    const timeout = setTimeout(() => {
      if (this.socket?.connected) {
        logger.warn('⚠️ Heartbeat timeout - no pong received');
        // Optionally reconnect on timeout
        // this.socket.disconnect();
        // this.connect();
      }
    }, this.HEARTBEAT_TIMEOUT);

    // Listen for pong
    this.socket.once('pong', () => {
      clearTimeout(timeout);
    });
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    this.socket?.off(event, callback);
  }

  emit(event: string, data?: any) {
    this.socket?.emit(event, data);
  }

  getSocket() {
    return this.socket;
  }
}

export const wsClient = new WebSocketClient();


