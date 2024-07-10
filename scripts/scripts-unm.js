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

applyTheme(getCookie('theme') || '/styles/default-modern.css');

document.addEventListener('DOMContentLoaded', function() {
    
    const loadSettings = () => {
        if (!getCookie('version')) setCookie('version', 'Release 1.8.8');
        if (!getCookie('theme')) setCookie('theme', '/styles/default-modern.css');
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

        applyTheme(getCookie('theme') || '/styles/default-modern.css');
    };

    const saveSettings = () => {
        const versionSelector = document.getElementById('version-selector');
        const themeSelector = document.getElementById('theme-selector');
        const clientTheme18Selector = document.getElementById('client-theme-1.8');
        const clientTheme15Selector = document.getElementById('client-theme-1.5');

        if (versionSelector) setCookie('version', versionSelector.value);
        if (themeSelector) {
            setCookie('theme', themeSelector.value);
            applyTheme(themeSelector.value);
        }
        if (clientTheme18Selector) setCookie('ClientEPK1_8', clientTheme18Selector.value);
        if (clientTheme15Selector) setCookie('ClientEPK1_5', clientTheme15Selector.value);

        /*console.log('Settings saved:', {
            version: getCookie('version'),
            theme: getCookie('theme'),
            clientTheme1_8: getCookie('ClientEPK1_8'),
            clientTheme1_5: getCookie('ClientEPK1_5')
        });*/
    };

    const tabs = document.querySelectorAll('nav ul li a');
    const contents = document.querySelectorAll('.content');
    const legalTab = document.getElementById('legal-tab');
    const legalSubmenu = document.querySelector('.legal-submenu');


    tabs.forEach(tab => {
        tab.addEventListener('click', function(event) {
            if (this.id === 'about-tab' || this.id === 'discord-tab' || this.id === 'reddit-tab') {
                return;
            }

            event.preventDefault();

            if (this.id === 'legal-tab') {
                this.classList.toggle('active');
                legalSubmenu.classList.toggle('active');
                // Toggle the rotation of the chevron
                const chevron = this.querySelector('.fa-chevron-down');
                if (chevron) {
                    chevron.style.transform = this.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
                }
            } else {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const target = tab.id.split('-')[0];
                loadPage(target);

                legalTab.classList.remove('active');
                legalSubmenu.classList.remove('active');
                const legalChevron = legalTab.querySelector('.fa-chevron-down');
                if (legalChevron) {
                    legalChevron.style.transform = 'rotate(0deg)';
                }
            }
        });
    });

    const legalSubmenuItems = document.querySelectorAll('.legal-submenu li a');
    legalSubmenuItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.stopPropagation(); // Trust me I know what I'm doing :)
        });
    });

    const loadPage = (page) => {
        const contentSection = document.getElementById(page);
        if (!contentSection) {
            console.error(`Content section for ${page} not found`);
            return;
        }

        contents.forEach(content => {
            content.classList.remove('active');
            content.innerHTML = '';
            content.style.display = 'none';
        });

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

    const loadVersionContent = (version) => {
        let path;
        switch (version) {
            case 'Release 1.8.8':
                path = '/1.8/index.html';
                break;
            case 'Beta 1.7.3':
                path = '/1.7/index.html';
                break;
            case 'Release 1.5.2':
                path = '/1.5/index.html';
                break;
            case 'Beta 1.3':
                path = '/1.3/index.html';
                break;
            case 'Alpha 1.2.6':
                path = '/Alpha-1.2/index.html';
                break;
            case 'EaglerForge':
                path = '/EaglerForge/index.html';
                break;
            case 'Resent 4.0':
                path = '/Resent/index.html';
                break;
            case 'Shadow 4.0':
                path = '/Shadow/index.html';
                break;
            case 'Indev':
                path = '/Indev/index.html';
                break;
            default:
                path = '/1.8/index.html'
                console.error('Unknown version:', version, 'launching 1.8 instead.');
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

    const initializePlayButton = () => {
        const playButton = document.getElementById('play-button');
        if (playButton) {
            playButton.addEventListener('click', (e) => {
                if (getCookie('AcceptedTerms') !== 'Yes') {
                    e.preventDefault();
                    alert('Please accept the terms before playing.');
                    showTermsOverlay();
                } else {
                    const version = getCookie('version');
                    if (version) {
                        loadVersionContent(version); 
                    } else {
                        console.error('Version not found in cookies! :(');
                    }
                }
            });
        } else {
            console.error('Play button not found :(');
        }
    };

    const showTermsOverlay = () => {
        const termsOverlay = document.createElement('div');
        termsOverlay.id = 'terms-overlay';
        termsOverlay.innerHTML = `
            <div id="terms-box">
                <h2>Welcome, User</h2>
                <p>Before you proceed, please review and accept our:</p>
                <ul>
                    <li><a href="/terms/" target="_blank">Terms of Service</a></li>
                    <li><a href="/privacy/" target="_blank">Privacy Policy</a></li>
                    <li><a href="/legal/" target="_blank">Legal Disclaimer</a></li>
                    <li><a href="/credits/" target="_blank">Credits</a></li>
                </ul>
                <p>By clicking "Accept", you agree to be bound by these documents.</p>
                <button id="accept-terms">Accept</button>
            </div>
        `;
        document.body.appendChild(termsOverlay);

        const acceptTermsButton = document.getElementById('accept-terms');
        if (acceptTermsButton) {
            acceptTermsButton.addEventListener('click', () => {
                setCookie('AcceptedTerms', 'Yes', 365);
                termsOverlay.remove();
            });
        }
    };

    const checkTermsAcceptance = () => {
        if (getCookie('AcceptedTerms') !== 'Yes') {
            showTermsOverlay();
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
    initializePlayButton();
    checkTermsAcceptance();
});
