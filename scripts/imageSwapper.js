document.addEventListener('DOMContentLoaded', function() {
    const logo = document.getElementById('logo');

    if (!logo) {
        console.error('Unable to find the image element with id "logo"');
        return;
    }

    function literallyLostEveryoneIRLByDoingThisShit() {
        if (window.innerWidth <= 768) {
            logo.src = '/images/logo126x.webp';
            logo.width = 126;
            logo.height = 126;
        } else {
            logo.src = '/images/logo189x.webp';
            logo.width = 189;
            logo.height = 189;
        }
    }

    literallyLostEveryoneIRLByDoingThisShit();

    console.log('Image src set to:', logo.src);
});