document.addEventListener('DOMContentLoaded', function() {
    // Function to apply theme
    const applyTheme = (theme) => {
        const link = document.getElementById('theme-stylesheet');
        link.href = theme;
    };

    // Function to set a cookie
    const setCookie = (name, value, days = 365) => {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "; expires=" + date.toUTCString();
        document.cookie = name + "=" + (value || "") + expires + ";path=/;SameSite=None;Secure";
    };

    // Function to get a cookie
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

    // Function to load settings from cookies
    const loadSettings = () => {
        // Set default cookies only if they don't exist
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

        applyTheme(getCookie('theme'));
    };

    // Function to save settings to cookies
    const saveSettings = () => {
        const versionSelector = document.getElementById('version-selector');
        const themeSelector = document.getElementById('theme-selector');
        const clientTheme18Selector = document.getElementById('client-theme-1.8');
        const clientTheme15Selector = document.getElementById('client-theme-1.5');

        if (versionSelector) setCookie('version', versionSelector.value);
        if (themeSelector) setCookie('theme', themeSelector.value);
        if (clientTheme18Selector) setCookie('ClientEPK1_8', clientTheme18Selector.value);
        if (clientTheme15Selector) setCookie('ClientEPK1_5', clientTheme15Selector.value);

        applyTheme(themeSelector ? themeSelector.value : getCookie('theme'));
        console.log('Settings saved:', {
            version: getCookie('version'),
            theme: getCookie('theme'),
            clientTheme1_8: getCookie('ClientEPK1_8'),
            clientTheme1_5: getCookie('ClientEPK1_5')
        });
    };

    // Handle tab switching
    const tabs = document.querySelectorAll('nav ul li a');
    const contents = document.querySelectorAll('.content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function(event) {
            // Check if this is the about tab
            if (this.id === 'about-tab') {
                // Let the default behavior happen (open in new tab)
                return;
            }

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

        // Check if the content section exists
        if (!contentSection) {
            console.error(`Content section for ${page} not found`);
            return;
        }

        // Clear and hide all content sections
        contents.forEach(content => {
            content.classList.remove('active');
            content.innerHTML = '';
            content.style.display = 'none';
        });

        // Show the target content section
        contentSection.style.display = 'block';

        fetch(`${page}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok :( ' + response.statusText);
                }
                return response.text();
            })
            .then(html => {
                contentSection.innerHTML = html;
                contentSection.classList.add('active');
                if (page === 'settings') {
                    loadSettings();
                    const versionSelector = document.getElementById('version-selector');
                    const themeSelector = document.getElementById('theme-selector');
                    const clientTheme18Selector = document.getElementById('client-theme-1.8');
                    const clientTheme15Selector = document.getElementById('client-theme-1.5');
                    if (versionSelector && themeSelector && clientTheme18Selector && clientTheme15Selector) {
                        versionSelector.addEventListener('change', saveSettings);
                        themeSelector.addEventListener('change', saveSettings);
                        clientTheme18Selector.addEventListener('change', saveSettings);
                        clientTheme15Selector.addEventListener('change', saveSettings);
                    }
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
                path = './1.8/index.html'
                console.error('Unknown version:', version);
                break;
        }

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

    // Initialize play button functionality
    const initializePlayButton = () => {
        const playButton = document.getElementById('play-button');
        if (playButton) {
            playButton.addEventListener('click', () => {
                const version = getCookie('version');
                if (version) {
                    loadVersionContent(version); // Load the version content in place
                } else {
                    console.error('Version not found in cookies! :(');
                }
            });
        } else {
            console.error('Play button not found :(');
        }
    };

    // Initial load of settings and home content
    loadSettings();
    loadPage('home');
    initializePlayButton(); // Initialize play button on initial load
});