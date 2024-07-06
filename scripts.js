const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

const setCookie = (name, value, days = 365) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "") + expires + ";path=/;SameSite=None;Secure";
};

const applyTheme = (theme) => {
    const link = document.getElementById('theme-stylesheet');
    if (link) {
        link.href = theme;
    }
};

applyTheme(getCookie('theme') || 'styles/styles.css');
document.addEventListener('DOMContentLoaded', function() {

    const loadSettings = () => {
        if (!getCookie('version')) setCookie('version', 'Release 1.8.8');
        if (!getCookie('theme')) setCookie('theme', 'styles/styles.css');
        if (!getCookie('ClientEPK1_8')) setCookie('ClientEPK1_8', 'default-1.8.epk');
        if (!getCookie('ClientEPK1_5')) setCookie('ClientEPK1_5', 'default-1.5.epk');

        const versionSelector = document.getElementById('version-selector');
        const themeSelector = document.getElementById('theme-selector');
        const clientTheme18Selector = document.getElementById('client-theme-1.8');
        const clientTheme15Selector = document.getElementById('client-theme-1.5');

        // Set form values from cookies, if the elements exist
        if (versionSelector) versionSelector.value = getCookie('version');
        if (themeSelector) themeSelector.value = getCookie('theme');
        if (clientTheme18Selector) clientTheme18Selector.value = getCookie('ClientEPK1_8');
        if (clientTheme15Selector) clientTheme15Selector.value = getCookie('ClientEPK1_5');
    };

    const loadPage = (page) => {
        const contents = document.querySelectorAll('.content');
        contents.forEach(content => {
            content.classList.remove('active');
        });
        const activeContent = document.getElementById(page);
        if (activeContent) {
            activeContent.classList.add('active');
        }
    };

    const tabs = document.querySelectorAll('nav ul li a');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function(event) {
            const tabId = this.id;
            if (tabId === 'about-tab' || tabId === 'discord-tab' || tabId === 'reddit-tab') {
                return;
            }

            event.preventDefault();
            const page = tabId.replace('-tab', '');
            loadPage(page);
        });
    });

    const loadVersionContent = (version) => {
        const path = version + '.html';
        if (path) {
            fetch(path)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.text();
                })
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    document.open();
                    document.write(doc.documentElement.outerHTML);
                    document.close();
                })
                .catch(error => {
                    console.error('Error loading version content:', error);
                    console.error('Error name:', error.name);
                    console.error('Error message:', error.message);
                    console.error('Error stack:', error.stack);
                });
        }
    };

    const initializePlayButton = () => {
        const playButton = document.getElementById('play-button');
        if (playButton) {
            //console.log('Play button found and initialized');
            playButton.addEventListener('click', () => {
                const version = getCookie('version');
                if (version) {
                    loadVersionContent(version); 
                } else {
                    console.error('Version not found in cookies! :(');
                }
            });
        } else {
            console.error('Play button not found :(');
            setTimeout(initializePlayButton, 100);
        }
    };

    loadSettings();
    const themeSelector = document.getElementById('theme-selector');
    if (themeSelector) {
        themeSelector.addEventListener('change', function() {
            setCookie('theme', this.value);
            applyTheme(this.value);
        });
    }
    loadPage('home');
    //initializePlayButton();
});
