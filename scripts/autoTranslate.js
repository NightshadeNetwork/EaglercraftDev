// Function to get the user's locale
function getUserLocale() {
    return navigator.language || navigator.userLanguage;
}

// Function to load Google Translate script
function loadGoogleTranslate() {
    var script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(script);
}

// Function to initialize Google Translate
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');

    // Automatically translate to user's locale if it's not English
    var userLocale = getUserLocale();
    if (userLocale.toLowerCase().startsWith('en') === false) {
        var languageSelect = document.querySelector('.goog-te-combo');
        if (languageSelect) {
            languageSelect.value = userLocale;
            languageSelect.dispatchEvent(new Event('change'));
        }
    }
}

// Create a container for Google Translate
function createTranslateContainer() {
    var container = document.createElement('div');
    container.id = 'google_translate_element';
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.zIndex = '1000';
    document.body.appendChild(container);
}

// Main function to set up auto-translation
function setupAutoTranslation() {
    createTranslateContainer();
    loadGoogleTranslate();
}

// Run the setup when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', setupAutoTranslation);