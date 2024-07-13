// Spotify API credentials
const CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID';
const REDIRECT_URI = 'YOUR_REDIRECT_URI';

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
    trackInfo.textContent = `Now playing: ${track.name} by ${track.artists[0].name}`;
  } else {
    trackInfo.textContent = 'No track currently playing';
  }

  const playButton = document.getElementById('spotify-play');
  playButton.textContent = state.paused ? 'Play' : 'Pause';
}

// Authenticate with Spotify
function authenticateSpotify() {
  const scopes = 'streaming user-read-email user-read-private';
  window.location = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}&response_type=token`;
}

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