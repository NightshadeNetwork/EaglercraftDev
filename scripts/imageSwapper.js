document.addEventListener('DOMContentLoaded', function() {
    // Select the image element
    const logo = document.querySelector('#logo');

    // Check if the logo element exists because apparently that's an issue
    if (!logo) {
        console.error('Unable to find the image element with id "logo"');
        return;
    }

    function updateImage() {
        if (window.innerWidth <= 768) { // Adjust this breakpoint as needed
            logo.src = '/images/logo126x.webp';
            logo.width = 126;
            logo.height = 126;
        } else {
            logo.src = '/images/logo189x.webp';
            logo.width = 189;
            logo.height = 189;
        }
    }

    updateImage();

    window.addEventListener('resize', updateImage); // If you didn't see my last commit, don't touch it.
});