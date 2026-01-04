interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
}

interface HTMLElement {
    webkitEnterFullscreen?: () => void;
    webkitRequestFullscreen?: () => Promise<void>;
    mozRequestFullScreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
}