/**
 * Mobile device detection and optimization utilities
 */

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

export function getOptimalCameraResolution(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: 1280, height: 720 };
  }

  const isMobile = window.innerWidth < 768;
  
  if (isMobile) {
    return { width: 640, height: 480 };
  }
  
  return { width: 1280, height: 720 };
}

export function supportsVibration(): boolean {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
}

export function vibrate(duration: number = 50): void {
  if (supportsVibration()) {
    navigator.vibrate(duration);
  }
}

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if running as PWA
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

export function preventAccidentalClose(active: boolean): void {
  if (typeof window === 'undefined') return;

  const handler = (e: BeforeUnloadEvent) => {
    if (active) {
      e.preventDefault();
      e.returnValue = '';
      return '';
    }
  };

  if (active) {
    window.addEventListener('beforeunload', handler);
  } else {
    window.removeEventListener('beforeunload', handler);
  }
}
