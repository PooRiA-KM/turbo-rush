// Register Service Worker for PWA functionality
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        console.log('[PWA] Service Worker registered:', registration.scope);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // Check every hour

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                console.log('[PWA] New version available');
                showUpdateNotification();
              }
            });
          }
        });
      } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error);
      }
    });
  }
}

// Show update notification
function showUpdateNotification() {
  if ('Notification' in window && Notification.permission === 'granted') {
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration) {
        registration.showNotification('Turbo Rush Update', {
          body: 'A new version is available! Refresh to update.',
          icon: '/icon.svg',
          badge: '/icon.svg',
          requireInteraction: true,
        } as NotificationOptions);
      }
    });
  }
}

// Request notification permission
export async function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    console.log('[PWA] Notification permission:', permission);
    return permission === 'granted';
  }
  return false;
}

// Check if app is installed
export function isAppInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true;
}

// Show install prompt
export function setupInstallPrompt() {
  let deferredPrompt: any;

  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  return async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`[PWA] Install prompt outcome: ${outcome}`);
      deferredPrompt = null;
      return outcome === 'accepted';
    }
    return false;
  };
}
