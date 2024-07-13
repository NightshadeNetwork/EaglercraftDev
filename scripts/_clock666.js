document.addEventListener('DOMContentLoaded', (event) => {
    const playerElement = document.getElementById('spotify-player');
    const minimizeButton = document.getElementById('spotify-minimize');

    if (!playerElement || !minimizeButton) {
        console.error('Elements with ID "spotify-player" and/or "spotify-minimize" not found in the DOM.');
        return;
    }

    function toggleMinimize() {
        playerElement.classList.toggle('minimized');

        if (playerElement.classList.contains('minimized')) {
            minimizeButton.innerHTML = '<i class="fas fa-music"></i>';
            minimizeButton.title = 'Expand Spotify Player';
        } else {
            minimizeButton.innerHTML = '<i class="fas fa-minus"></i>';
            minimizeButton.title = 'Minimize Spotify Player';
        }
    }

    minimizeButton.addEventListener('click', toggleMinimize);

    document.addEventListener('click', function(event) {
        const isClickInside = playerElement.contains(event.target);

        if (!isClickInside && !playerElement.classList.contains('minimized')) {
            toggleMinimize();
        }
    });

    playerElement.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});
