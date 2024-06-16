document.addEventListener('DOMContentLoaded', function() {
    // Handle tab switching
    const tabs = document.querySelectorAll('nav ul li a');
    const contents = document.querySelectorAll('.content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function(event) {
            event.preventDefault();
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const target = tab.id.split('-')[0];
            loadPage(target);
        });
    });

    // Function to load page content using AJAX
    const loadPage = (page) => {
        const contentSection = document.getElementById(page);
        if (contentSection.classList.contains('active')) return;

        contents.forEach(content => content.classList.remove('active'));

        fetch(`${page}.html`)
            .then(response => response.text())
            .then(html => {
                contentSection.innerHTML = html;
                contentSection.classList.add('active');
                if (page === 'settings') {
                    loadSettings();
                }
                if (page === 'home') {
                    initializePlayButton();
                }
            })
            .catch(error => {
                contentSection.innerHTML = '<p>Failed to load content.</p>';
                console.error('Error loading page:', error);
            });
    };

    // Function to save settings to cookies
    const saveSettings = () => {
        const versionSelector = document.getElementById('version-selector').value;
        const themeSelector = document.getElementById('theme-selector').value;
        document.cookie = `version=${versionSelector};path=/;SameSite=None;Secure`;
        document.cookie = `theme=${themeSelector};path=/;SameSite=None;Secure`;
        applyTheme(themeSelector);
        console.log('Settings saved:', { version: versionSelector, theme: themeSelector });
    };

    // Function to load settings from cookies
    const loadSettings = () => {
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
        }, {});

        const versionSelector = document.getElementById('version-selector');
        const themeSelector = document.getElementById('theme-selector');

        if (cookies.version) {
            versionSelector.value = cookies.version;
        } else {
            versionSelector.value = 'Release 1.8.8'; // Default version
        }

        if (cookies.theme) {
            themeSelector.value = cookies.theme;
            applyTheme(cookies.theme);
        }

        document.getElementById('save-settings').addEventListener('click', saveSettings);
    };

    // Function to apply theme
    const applyTheme = (theme) => {
        const link = document.getElementById('theme-stylesheet');
        link.href = theme;
    };

    // Function to load version-specific content into the body
    const loadVersionContent = (version) => {
        let path;
        switch (version) {
            case 'Release 1.8.8':
                path = './1.8/index.html';
                break;
            case 'Release 1.5.2':
                path = './1.5/index.html';
                break;
            case 'Beta 1.3':
                path = './1.3/index.html';
                break;
            default:
                path = ''; // Handle other versions or default behavior
        }

        if (path) {
            fetch(path)
                .then(response => response.text())
                .then(html => {
                    document.body.innerHTML = html;
                })
                .catch(error => {
                    console.error('Error loading version content:', error);
                });
        }
    };

    // Initialize play button functionality
    const initializePlayButton = () => {
        const playButton = document.getElementById('play-button');
        if (playButton) {
            playButton.addEventListener('click', () => {
                const versionCookie = document.cookie.split('; ').find(row => row.startsWith('version='));
                if (versionCookie) {
                    const version = versionCookie.split('=')[1];
                    console.log('Attempting to launch version:', version);
                    // Actual game launching logic here
                    loadVersionContent(version); // Load the version content in place
                } else {
                    console.error('Version not found in cookies');
                }
            });
        } else {
            console.error('Play button not found');
        }
    };

    // Initial load of the home content
    loadPage('home');
});
