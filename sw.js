// Service Worker for Jagatab PWA
const CACHE_NAME = 'jagatab-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Files to cache for offline functionality
const CACHE_FILES = [
  '/',
  '/index.html',
  '/blog.html',
  '/projects.html',
  '/virtual-assistant.html',
  '/sitemap.xml',
  '/robots.txt',
  '/privacy-policy.html',
  '/terms-of-service.html',
  '/cookie-policy.html',
  '/manifest.json',
  // JavaScript files
  '/js/analytics.js',
  '/js/contact-enhancement.js',
  '/js/performance-optimizer.js',
  // Project pages
  '/project-ai-chatbot-platform.html',
  '/project-invoice-automation-system.html',
  '/project-seo-automation-suite.html',
  // Service pages
  '/services/python-automation-scripts.html',
  '/services/ai-chatbots.html',
  '/services/web-development.html',
  '/services/cloud-automation.html',
  '/services/seo-automation.html',
  '/services/content-automation.html',
  '/services/email-automation.html',
  '/services/business-consultation.html',
  // Blog articles
  '/blog/ai-automation-cambridgeshire-businesses.html',
  '/blog/python-automation-beginners-guide.html',
  '/blog/local-seo-cambridge-businesses.html',
  // External resources
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(CACHE_FILES);
      })
      .then(() => {
        console.log('Service Worker: Cached all files successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Cache failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests (different origin)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse;
        }

        // Try to fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response for caching
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Network failed, try to serve offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            
            // For other requests, return a generic offline response
            return new Response('Offline - Content not available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForm());
  }
});

// Function to sync contact form data when back online
async function syncContactForm() {
  try {
    const formData = await getStoredFormData();
    if (formData.length > 0) {
      for (const data of formData) {
        try {
          await submitFormData(data);
          await removeStoredFormData(data.id);
          console.log('Form data synced successfully');
        } catch (error) {
          console.error('Failed to sync form data:', error);
        }
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Helper functions for form data storage
async function getStoredFormData() {
  // In a real implementation, you'd use IndexedDB
  // For now, return empty array
  return [];
}

async function submitFormData(data) {
  // Submit form data to server
  return fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}

async function removeStoredFormData(id) {
  // Remove synced data from storage
  console.log('Removing synced form data:', id);
}

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update from Jagatab!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Jagatab Notification', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(syncContent());
  }
});

async function syncContent() {
  try {
    // Sync latest content, blog posts, etc.
    console.log('Syncing content in background');
    
    // Update cache with fresh content
    const cache = await caches.open(CACHE_NAME);
    await cache.add('/');
    
    console.log('Content sync completed');
  } catch (error) {
    console.error('Content sync failed:', error);
  }
}

// Error handling
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled promise rejection:', event.reason);
});

console.log('Service Worker: Loaded successfully');
