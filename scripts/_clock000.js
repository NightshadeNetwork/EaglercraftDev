const spotifyConfig = {
    clientId: 'ca84349ab59149b48ea2a88626fde165',
    redirectUri: 'https://eaglercraft.dev/callback/'
};

const obfuscatedConfig = btoa(JSON.stringify(spotifyConfig));

window.getSpotifyConfig = function() {
    return JSON.parse(atob(obfuscatedConfig));
};
