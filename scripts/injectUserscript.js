function injectMobileUserscript() {
    const script = document.createElement('script');
    script.src = '/scripts/eaglermobile.user.js';
    script.type = 'text/javascript';
    document.head.appendChild(script);
}

function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

if (isMobileDevice()) {
    injectMobileUserscript();
}
