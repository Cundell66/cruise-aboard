
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';

export function CookieConsentBanner() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            setShowBanner(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'granted');
        if (typeof window.gtag !== 'undefined') {
            window.gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
        setShowBanner(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie_consent', 'denied');
        if (typeof window.gtag !== 'undefined') {
             window.gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
        setShowBanner(false);
    };

    if (!showBanner) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg p-4 animate-in slide-in-from-bottom-5 duration-500">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Cookie className="h-6 w-6 text-primary hidden sm:block" />
                    <p className="text-sm text-muted-foreground text-center sm:text-left">
                        We use cookies to enhance your experience. By clicking "Accept", you agree to our use of cookies for analytics. For more information, please see our <Link href="/cookies" className="underline hover:text-primary">Cookie Policy</Link>.
                    </p>
                </div>
                <div className="flex gap-4 shrink-0">
                    <Button variant="outline" onClick={handleDecline}>Decline</Button>
                    <Button onClick={handleAccept}>Accept</Button>
                </div>
            </div>
        </div>
    );
}
