const fetch = require("node-fetch");

module.exports = {
    getRelated: async function (artistIds, callback) {
        let fetches = [];
        for (var i = 0; i < artistIds.length; i++) {
            fetches.push(fetch("https://api.deezer.com/artist/" + artistIds[i] + "/related?limit=5"));
        }
        try {
            let responses = await Promise.all(fetches);
            let resJson = responses.map(res => res.json());
            let data = await Promise.all(resJson);
            let relatedArtists = data.map(d => d.data);
            let result = [...new Set(relatedArtists.flat())];
            callback(null, result);
        } catch (err) {
            callback(err, null);
        }
    },

    getAlbums: async function (artists, callback) {
        let fetches = [];
        for (var i = 0; i < artists.length; i++) {
            fetches.push(fetch("https://api.deezer.com/artist/" + artists[i].artistId + "/albums"));
        }
        try {
            let responses = await Promise.all(fetches);
            let resJson = responses.map(res => res.json());
            let data = await Promise.all(resJson);
            let albums = data.map((albumItems, i) => {
                var artistAlbums = albumItems.data;
                artistAlbums.map(album => {
                    album.artistId = artists[i].artistId;
                    album.artistName = artists[i].name;
                });
                artistAlbums = artistAlbums.filter(album => album.record_type == 'album');
                artistAlbums = artistAlbums.sort((a,b) => b.fans - a.fans);
                if (artistAlbums.length > 10) artistAlbums = artistAlbums.slice(0,10);
                return artistAlbums;
            });
            callback(null, albums.flat());
        } catch (err) {
            callback(err, null);
        }
    },

    getArtist: async function (artistId, callback) {
        try {
            let res = await fetch("https://api.deezer.com/artist/" + artistId);
            if (!res.ok) callback("[" + res.status + "] " + res.statusText, null);
            let data = await res.json();
            if (data.error) callback("Deezer artist ID not found", null);
            callback(null, data);
        } catch(err) {
            callback(err, null);
        }
    },

    getAlbumInfo: async function (albumId, callback) {
        try {
            let res = await fetch("https://api.deezer.com/album/" + albumId);
            if (!res.ok) callback("[" + res.status + "] " + res.statusText, null);
            let data = await res.json();
            if (data.error) callback("Deezer album ID not found", null);
            callback(null, data);
        } catch(err) {
            callback(err, null);
        }
    },

    getSearchResults: async function (searchName, callback) {
        try {
            let res = await fetch("https://api.deezer.com/search/artist?q=" + searchName);
            if (!res.ok) callback("[" + res.status + "] " + res.statusText, null);
            let data = await res.json();
            if (data.total==0) callback("No search results", null);
            callback(null, data.data.slice(0,3));
        } catch(err) {
            callback(err, null);
        }
    }
};