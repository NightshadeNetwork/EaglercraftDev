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
            })
            .catch(error => {
                contentSection.innerHTML = '<p>Failed to load content.</p>';
                console.error('Error loading page:', error);
            });
    };

    // Initial load of the home content
    loadPage('home');
});
