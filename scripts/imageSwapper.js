const logo = document.querySelector('#logo');

function updateImage() {
    if (window.innerWidth <= 768) { // Adjust this breakpoint as needed
        logo.src = '/images/logo126.webp';
        logo.width = 126;
        logo.height = 126;
    } else {
        logo.src = '/images/logo189.webp';
        logo.width = 189;
        logo.height = 189;
    }
}

updateImage();

window.addEventListener('resize', updateImage);  // This updates on move, don't touch it.