const clientVersions = {
    'Release 1.8.8': '/1.8/index.html',
    'Release 1.5.2': '/1.5/index.html',
    'Beta 1.3': '/1.3/index.html'
    // Add new versions here in the future
};

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
            const version = document.getElementById('version-selector').value;
            if (version && clientVersions[version]) {
                loadVersionContent(version);
            } else {
                console.error('Invalid version:', version);
                alert('Please select a valid version in the settings.');
            }
        });
    }
};

const loadVersionContent = (version) => {
    const path = clientVersions[version];
    if (!path) {
        console.error('Unknown version:', version);
        alert('This version is not available. Please select a different version in the settings.');
        return;
    }

    window.location.href = path;
};

const initializeSettingsPage = () => {
    const versionSelector = document.getElementById('version-selector');
    const themeSelector = document.getElementById('theme-selector');
    const clientTheme18Selector = document.getElementById('client-theme-1.8');
    const clientTheme15Selector = document.getElementById('client-theme-1.5');

    if (versionSelector) {
        versionSelector.innerHTML = ''; // Clear existing options
        Object.keys(clientVersions).forEach(version => {
            const option = document.createElement('option');
            option.value = version;
            option.textContent = version;
            versionSelector.appendChild(option);
        });
        versionSelector.value = getCookie('version') || Object.keys(clientVersions)[0];
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