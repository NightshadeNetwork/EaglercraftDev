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
            let version = getCookie('version');
            if (!version || !clientVersions[version]) {
                version = Object.keys(clientVersions)[0];
            }
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

    fetch(path)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            // Replace the entire body with the new content
            document.body.innerHTML = html;

            // Add the return button
            const returnButton = document.createElement('div');
            returnButton.innerHTML = `
                <style>
                    #return-button {
                        position: fixed;
                        top: 10px;
                        left: 10px;
                        z-index: 9999;
                        width: 30px;
                        height: 30px;
                        background-color: rgba(0, 0, 0, 0.5);
                        border-radius: 5px;
                        cursor: pointer;
                        overflow: hidden;
                        transition: width 0.3s ease;
                    }
                    #return-button:hover {
                        width: 150px;
                    }
                    #return-button::before {
                        content: '↖';
                        font-size: 20px;
                        color: white;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }
                    #return-button::after {
                        content: 'Back to Launcher';
                        color: white;
                        position: absolute;
                        top: 50%;
                        left: 40px;
                        transform: translateY(-50%);
                        white-space: nowrap;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                    }
                    #return-button:hover::after {
                        opacity: 1;
                    }
                </style>
                <div id="return-button"></div>
            `;
            document.body.appendChild(returnButton);

            document.getElementById('return-button').addEventListener('click', () => {
                location.reload();
            });

            // Run any scripts that were in the loaded HTML
            const scripts = document.body.getElementsByTagName('script');
            for (let script of scripts) {
                eval(script.innerHTML);
            }
        })
        .catch(error => {
            console.error('Error loading version content:', error);
            alert('Failed to load the game. Please try again.');
        });
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
        const savedVersion = getCookie('version');
        versionSelector.value = clientVersions[savedVersion] ? savedVersion : Object.keys(clientVersions)[0];
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