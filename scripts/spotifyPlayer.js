const config = window.getSpotifyConfig();
const CLIENT_ID = config.clientId;
const REDIRECT_URI = config.redirectUri;

// Spotify Web Player SDK
let player;

// Initialize Spotify
window.onSpotifyWebPlaybackSDKReady = () => {
  const token = getAccessToken();
  player = new Spotify.Player({
    name: 'Eaglercraft Spotify Player',
    getOAuthToken: cb => { cb(token); }
  });

  // Error handling
  player.addListener('initialization_error', ({ message }) => { console.error(message); });
  player.addListener('authentication_error', ({ message }) => { console.error(message); });
  player.addListener('account_error', ({ message }) => { console.error(message); });
  player.addListener('playback_error', ({ message }) => { console.error(message); });

  // Playback status updates
  player.addListener('player_state_changed', state => {
    console.log(state);
    updatePlayerUI(state);
  });

  // Ready
  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
    setDeviceId(device_id);
  });

  // Connect to the player
  player.connect();
};

// Get the access token from the URL hash
function getAccessToken() {
  const hash = window.location.hash
    .substring(1)
    .split('&')
    .reduce((initial, item) => {
      if (item) {
        var parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1]);
      }
      return initial;
    }, {});

  return hash.access_token;
}

// Set the device ID for playback
function setDeviceId(deviceId) {
  localStorage.setItem('spotify_device_id', deviceId);
}

// Update the player UI based on the current state
function updatePlayerUI(state) {
    if (!state) return;

    const trackInfo = document.getElementById('track-info');
    if (state.track_window.current_track) {
        const track = state.track_window.current_track;
        trackInfo.textContent = `${track.name} - ${track.artists[0].name}`;
    } else {
        trackInfo.textContent = 'No track currently playing';
    }

    const playButton = document.getElementById('spotify-play');
    const playIcon = playButton.querySelector('i');
    if (state.paused) {
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
    } else {
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
    }
}

// Authenticate with Spotify
function authenticateSpotify() {
    const config = window.getSpotifyConfig();
    const scopes = 'streaming user-read-email user-read-private';
    window.location = `https://accounts.spotify.com/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=token`;
}

// And when you need to use the token:
const accessToken = localStorage.getItem('spotify_access_token');

// Play a track
function playTrack(trackUri) {
  const deviceId = localStorage.getItem('spotify_device_id');
  fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessToken()}`
    },
    body: JSON.stringify({ uris: [trackUri] })
  });
}

// Add event listeners for player controls
document.getElementById('spotify-login').addEventListener('click', authenticateSpotify);
document.getElementById('spotify-play').addEventListener('click', () => player.togglePlay());
document.getElementById('spotify-next').addEventListener('click', () => player.nextTrack());
document.getElementById('spotify-previous').addEventListener('click', () => player.previousTrack());

// Load the Spotify Web Playback SDK
const script = document.createElement('script');
script.src = 'https://sdk.scdn.co/spotify-player.js';
document.body.appendChild(script);

// Get the player and minimize button elements
const player = document.getElementById('spotify-player');
const minimizeButton = document.getElementById('spotify-minimize');

// Function to toggle minimize state
function toggleMinimize() {
    player.classList.toggle('minimized');

    // Change the icon and title based on the current state
    if (player.classList.contains('minimized')) {
        minimizeButton.innerHTML = '<i class="fas fa-music"></i>';
        minimizeButton.title = 'Expand Spotify Player';
    } else {
        minimizeButton.innerHTML = '<i class="fas fa-minus"></i>';
        minimizeButton.title = 'Minimize Spotify Player';
    }
}

// Add click event listener to the minimize button
minimizeButton.addEventListener('click', toggleMinimize);

// Optional: Minimize player when clicking outside
document.addEventListener('click', function(event) {
    const isClickInside = player.contains(event.target);

    if (!isClickInside && !player.classList.contains('minimized')) {
        toggleMinimize();
    }
});

// Prevent player from minimizing when clicking inside it
player.addEventListener('click', function(event) {
    event.stopPropagation();
});