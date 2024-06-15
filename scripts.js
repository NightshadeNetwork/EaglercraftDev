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
        document.cookie = `version=${versionSelector};path=/`;
        document.cookie = `theme=${themeSelector};path=/`;
        applyTheme(themeSelector);
        alert('Settings saved!');
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
        }

        if (cookies.theme) {
            themeSelector.value = cookies.theme;
            applyTheme(cookies.theme);
        }

        document.getElementById('save-settings').addEventListener('click', saveSettings);
    };

    // Function to apply theme
    const applyTheme = (theme) => {
        document.querySelectorAll('link[rel=stylesheet]').forEach((link) => {
            if (link.href.includes('styles')) {
                link.href = theme;
            }
        });
    };

    // Initial load of the home content
    loadPage('home');
});
