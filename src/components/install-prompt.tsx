"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Share, Download } from "lucide-react";

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if Android
    const android = /Android/.test(navigator.userAgent);
    setIsAndroid(android);

    // Check if already installed as PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         (window.navigator as any).standalone;

    const dismissData = localStorage.getItem('install-prompt-dismissed');
    let shouldShow = true;
    
    if (dismissData) {
      const { count } = JSON.parse(dismissData);
      if (count < 5) {
        shouldShow = false;
        localStorage.setItem('install-prompt-dismissed', JSON.stringify({ count: count + 1 }));
      } else {
        localStorage.removeItem('install-prompt-dismissed');
      }
    }

    // Android PWA Install Event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isStandalone && shouldShow) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show prompt for iOS if not installed and shouldShow
    if (iOS && !isStandalone && shouldShow) {
      setShowPrompt(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('install-prompt-dismissed', JSON.stringify({ count: 1 }));
  };

  const handleInstallAndroid = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  if (!showPrompt || (!isIOS && !isAndroid)) return null;

  // Android Install Prompt
  if (isAndroid && deferredPrompt) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t-2 border-border p-4 z-50 animate-in slide-in-from-bottom duration-300">
        <div className="max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1.5">
                Install app
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Install Tic2Talk as an app for quick access and offline use!
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleDismiss}
              className="shrink-0"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <Button
            onClick={handleInstallAndroid}
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Install now
          </Button>
        </div>
      </div>
    );
  }

  // iOS Install Prompt
  if (!isIOS) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t-2 border-border p-4 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-md mx-auto">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1.5">
              Add to Home Screen
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Install this app on your iPhone for quick access:
            </p>
            <ol className="text-xs text-muted-foreground space-y-1.5">
              <li className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-semibold">1</span>
                <span>Tap the <Share className="inline w-3.5 h-3.5 mx-0.5" /> Share button below</span>
              </li>

              <li className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-semibold">2</span>
                <span>Tap "More" <svg className="inline w-3.5 h-3.5 mx-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="8" cy="12" r="0.5" fill="currentColor" /><circle cx="12" cy="12" r="0.5" fill="currentColor" /><circle cx="16" cy="12" r="0.5" fill="currentColor" /></svg> and select "Add to Home Screen" <svg className="inline w-3.5 h-3.5 mx-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="4" ry="4" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-semibold">3</span>
                <span>Tap "Add" to finish</span>
              </li>
            </ol>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleDismiss}
            className="shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
