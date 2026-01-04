import { useEffect, useState } from 'react';

const checkPwaInstalled = (): boolean => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    const isIOSStandalone = (window.navigator as any).standalone === true;
    return isStandalone || (isIOS && isIOSStandalone);
};

const usePWAInstalled = () => {
    const [isInstalled, setIsInstalled] = useState(checkPwaInstalled());

    useEffect(() => {
        const handler = () => {
            setIsInstalled(checkPwaInstalled());
        };

        window.addEventListener('DOMContentLoaded', handler);
        window.addEventListener('appinstalled', handler);

        return () => {
            window.removeEventListener('DOMContentLoaded', handler);
            window.removeEventListener('appinstalled', handler);
        };
    }, []);

    return isInstalled;
};

export default usePWAInstalled;