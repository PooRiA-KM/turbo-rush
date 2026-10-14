// PWA utilities

// Detect browser
export function isSafari(): boolean {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export function isChrome(): boolean {
  return /Chrome/i.test(navigator.userAgent) && !/Edge|Edg/i.test(navigator.userAgent);
}

export function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || 
    (window.navigator as any).standalone === true;
}

// Check if app can be installed (Chrome/Edge only)
export function canInstall(): boolean {
  if (isIOS() || isSafari()) return false;
  if (isStandalone()) return false;
  return true;
}

// Setup install prompt (Chrome/Edge only)
export function setupInstallPrompt(): (() => Promise<boolean>) | null {
  if (!canInstall()) return null;

  let deferredPrompt: any = null;

  const handler = (e: Event) => {
    e.preventDefault();
    deferredPrompt = e;
  };

  window.addEventListener('beforeinstallprompt', handler);

  return async () => {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    return outcome === 'accepted';
  };
}

// Get install instructions based on browser
export function getInstallInstructions(): { title: string; steps: string[] } | null {
  if (isStandalone()) return null;

  if (isIOS()) {
    return {
      title: 'Install on iPhone/iPad',
      steps: [
        'Make sure you\'re using Safari (not Chrome)',
        'Tap the Share button (⬆️) at the bottom of Safari',
        'Scroll down and tap "Add to Home Screen"',
        'Tap "Add" to confirm',
        'The app icon will appear on your home screen',
      ],
    };
  }

  if (isSafari()) {
    return {
      title: 'Install on Mac',
      steps: [
        'Click the Share button in the Safari toolbar',
        'Click "Add to Dock"',
        'Click "Add" to confirm',
      ],
    };
  }

  if (isChrome()) {
    return {
      title: 'Install on Chrome',
      steps: [
        'Tap the menu button (⋮) in the top right',
        'Tap "Install app" or "Add to Home screen"',
        'Tap "Install" to confirm',
      ],
    };
  }

  return {
    title: 'Install App',
    steps: [
      'Look for the install icon in the address bar',
      'Or use your browser\'s "Add to Home Screen" option',
    ],
  };
}
