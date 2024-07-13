const spotifyConfig = {
    clientId: '',
    redirectUri: 'https://eaglercraft.dev/callback/'
};

const obfuscatedConfig = btoa(JSON.stringify(spotifyConfig));

window.getSpotifyConfig = function() {
    return JSON.parse(atob(obfuscatedConfig));
};
