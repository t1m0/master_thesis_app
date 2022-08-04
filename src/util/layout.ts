export function isMobile() {
    return window.navigator.userAgent.includes('Mobi');
}

export function getHeight() {
    return window.innerHeight;
}

export function getWidth() {
    return window.innerWidth;
}

export function getCorrectedHeight() {
    return getHeight() - 200;
}

export function getCorrectedWidth() {
    return getWidth();
}

export function isPortrait() {
    return window.matchMedia("(orientation: portrait)").matches;
}

export function isLandscape() {
    return window.matchMedia("(orientation: landscape)").matches;
}

export function registerOrientationChange(callback: () => void) {
    window.addEventListener("orientationchange", callback, false);
}