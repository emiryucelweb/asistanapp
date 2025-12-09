// AsistanApp Service Worker - Push Notifications
const CACHE_NAME = 'asistanapp-v1';
const API_BASE_URL = '/api';

// Install service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/static/js/bundle.js',
        '/static/css/main.css',
        '/manifest.json'
      ]);
    })
  );
  self.skipWaiting();
});

// Activate service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Handle push events
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  
  let notificationData;
  
  try {
    notificationData = event.data ? event.data.json() : {};
  } catch (error) {
    console.error('Failed to parse push data:', error);
    notificationData = {
      title: 'AsistanApp',
      message: 'Yeni bildirim aldınız',
      type: 'default'
    };
  }

  const {
    title = 'AsistanApp',
    message = 'Yeni bildirim',
    type = 'default',
    icon = '/icon-192.png',
    badge = '/badge-72.png',
    image,
    url,
    timestamp = new Date().toISOString(),
    actions = []
  } = notificationData;

  const options = {
    body: message,
    icon: icon,
    badge: badge,
    image: image,
    tag: `notification-${Date.now()}`,
    timestamp: new Date(timestamp).getTime(),
    requireInteraction: type === 'urgent',
    vibrate: getVibrationPattern(type),
    actions: actions.slice(0, 2), // Max 2 actions supported
    data: {
      type,
      url,
      timestamp,
      ...notificationData
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received:', event);
  
  event.notification.close();

  const notificationData = event.notification.data || {};
  const action = event.action;

  event.waitUntil(
    handleNotificationAction(action, notificationData)
  );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
  
  // Track notification dismissal
  const notificationData = event.notification.data || {};
  
  fetch(`${API_BASE_URL}/push-notifications/track`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'dismissed',
      notificationId: notificationData.id,
      timestamp: new Date().toISOString()
    })
  }).catch(error => console.error('Failed to track notification dismissal:', error));
});

// Handle background sync
self.addEventListener('sync', (event) => {
  console.log('Background sync event:', event.tag);
  
  if (event.tag === 'background-sync-notifications') {
    event.waitUntil(syncNotifications());
  }
});

// Helper functions
function getVibrationPattern(type) {
  const patterns = {
    'urgent': [200, 100, 200, 100, 200],
    'message': [100, 50, 100],
    'reminder': [300],
    'default': [200]
  };
  
  return patterns[type] || patterns.default;
}

async function handleNotificationAction(action, data) {
  try {
    const clients = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    });

    // Track notification interaction
    await fetch(`${API_BASE_URL}/push-notifications/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: action || 'clicked',
        notificationId: data.id,
        timestamp: new Date().toISOString()
      })
    }).catch(error => console.error('Failed to track notification action:', error));

    // Handle specific actions
    if (action === 'reply' && data.conversationId) {
      // Open quick reply interface
      return openOrFocusWindow(`/conversations/${data.conversationId}?quickReply=true`);
    }

    if (action === 'view' || !action) {
      // Open the relevant page
      const url = data.url || getDefaultUrl(data.type, data);
      return openOrFocusWindow(url);
    }

    if (action === 'dismiss') {
      // Already handled by notification close
      return;
    }

    // Default action - open the app
    return openOrFocusWindow('/');

  } catch (error) {
    console.error('Failed to handle notification action:', error);
    return openOrFocusWindow('/');
  }
}

async function openOrFocusWindow(url) {
  const clients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  });

  // Try to focus existing window with the URL
  for (const client of clients) {
    if (client.url === url && 'focus' in client) {
      return client.focus();
    }
  }

  // Try to focus any existing window and navigate
  if (clients.length > 0) {
    const client = clients[0];
    if ('focus' in client) {
      client.focus();
      // Send message to client to navigate
      client.postMessage({
        type: 'NOTIFICATION_NAVIGATE',
        url: url
      });
      return;
    }
  }

  // Open new window
  return self.clients.openWindow(url);
}

function getDefaultUrl(type, data) {
  switch (type) {
    case 'newMessage':
      return data.conversationId ? `/conversations/${data.conversationId}` : '/conversations';
    case 'assignment':
      return data.conversationId ? `/conversations/${data.conversationId}` : '/conversations';
    case 'customerUpdate':
      return data.customerId ? `/customers/${data.customerId}` : '/customers';
    case 'teamMention':
      return '/team-chat';
    case 'deadlineReminder':
      return '/appointments';
    case 'systemAlert':
      return '/settings';
    default:
      return '/';
  }
}

async function syncNotifications() {
  try {
    // Fetch pending notifications
    const response = await fetch(`${API_BASE_URL}/push-notifications/sync`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to sync notifications');
    }

    const { notifications } = await response.json();

    // Show pending notifications
    for (const notification of notifications) {
      await self.registration.showNotification(notification.title, {
        body: notification.message,
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        data: notification
      });
    }

    console.log(`Synced ${notifications.length} notifications`);
  } catch (error) {
    console.error('Failed to sync notifications:', error);
  }
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  const { type, data } = event.data;

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'CLAIM_CLIENTS':
      self.clients.claim();
      break;
    case 'CACHE_UPDATE':
      event.waitUntil(updateCache(data));
      break;
    default:
      console.log('Unknown message type:', type);
  }
});

async function updateCache(data) {
  try {
    const cache = await caches.open(CACHE_NAME);
    if (data.urls) {
      await cache.addAll(data.urls);
    }
  } catch (error) {
    console.error('Failed to update cache:', error);
  }
}

// Offline fallback
self.addEventListener('fetch', (event) => {
  // Only handle navigation requests in offline mode
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/') || caches.match('/index.html');
      })
    );
  }
});
