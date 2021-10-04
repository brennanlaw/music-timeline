export var api = (function(){

    function send(method, url, data, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status !== 200) callback("[" + xhr.status + "] " + xhr.responseText, null);
            else callback(null, JSON.parse(xhr.responseText));
        };
        xhr.open(method, url, true);
        if (!data) xhr.send();
        else {
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(data));
        }
    }

    var module = {};

    module.signup = (username, password, callback) => {
        let data = {username: username, password: password};
        send('POST', '/api/signup/', data, callback);
    };

    module.signin = (username, password, callback) => {
        let data = {username: username, password: password};
        send('POST', '/api/signin/', data, callback);
    };

    module.signout = (callback) => {
        send('GET', '/api/signout/', null, callback);
    };

    module.isSignedIn = (callback) => {
        send('GET', '/api/user/', null, callback);
    };

    module.getTimeline = (year, callback) => {
        send('GET', '/api/users/timeline/' + year + '/', null, callback);
    };

    module.getLikes = (callback) => {
        send('GET', '/api/users/likes/', null, callback);
    };

    module.getAlbumInfo = (albumId, callback) => {
        send('GET', '/api/album/' + albumId + '/', null, callback);
    };

    module.like = (artistId, callback) => {
        send('PATCH', '/api/users/like/' + artistId + '/', null, callback);
    };
    
    module.unlike = (artistId, callback) => {
        send('PATCH', '/api/users/unlike/' + artistId + '/', null, callback);
    };

    module.searchArtist = (name, callback) => {
        let data = {name: name};
        send('PATCH', '/api/search/', data, callback);
    };

    module.updateTimeline = (callback) => {
        send('PATCH', '/api/users/timeline/update/', null, callback);
    };

    return module;

})();
