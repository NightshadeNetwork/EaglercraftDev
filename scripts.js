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

const loadPage = (page) => {
    fetch(`${page}.html`)
        .then(response => response.text())
        .then(html => {
            const content = document.querySelector('main');
            content.innerHTML = html;
            if (page === 'home') {
                initializePlayButton();
            } else if (page === 'settings') {
                initializeSettingsPage();
            }
        })
        .catch(error => console.error('Error loading page:', error));
};

const initializePlayButton = () => {
    const playButton = document.getElementById('play-button');
    if (playButton) {
        playButton.addEventListener('click', () => {
            const version = getCookie('version');
            if (version) {
                loadVersionContent(version);
            } else {
                console.error('Version not found in cookies!');
            }
        });
    }
};

const loadVersionContent = (version) => {
    const path = version.replace(' ', '-').toLowerCase() + '.html';
    fetch(path)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            document.body.innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading version content:', error);
        });
};

const initializeSettingsPage = () => {
    const versionSelector = document.getElementById('version-selector');
    const themeSelector = document.getElementById('theme-selector');
    const clientTheme18Selector = document.getElementById('client-theme-1.8');
    const clientTheme15Selector = document.getElementById('client-theme-1.5');

    if (versionSelector) {
        versionSelector.value = getCookie('version') || 'Release 1.8.8';
        versionSelector.addEventListener('change', function() {
            setCookie('version', this.value);
        });
    }

    if (themeSelector) {
        themeSelector.value = getCookie('theme') || 'styles/styles.css';
        themeSelector.addEventListener('change', function() {
            setCookie('theme', this.value);
            applyTheme(this.value);
        });
    }

    if (clientTheme18Selector) {
        clientTheme18Selector.value = getCookie('ClientEPK1_8') || 'default-1.8.epk';
        clientTheme18Selector.addEventListener('change', function() {
            setCookie('ClientEPK1_8', this.value);
        });
    }

    if (clientTheme15Selector) {
        clientTheme15Selector.value = getCookie('ClientEPK1_5') || 'default-1.5.epk';
        clientTheme15Selector.addEventListener('change', function() {
            setCookie('ClientEPK1_5', this.value);
        });
    }
};

document.addEventListener('DOMContentLoaded', function() {
    applyTheme(getCookie('theme') || 'styles/styles.css');

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

            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    loadPage('home');
});