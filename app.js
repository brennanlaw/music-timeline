const express = require('express');
const app = express();
const path = require('path');

const deezerApi = require('./api/deezer.js');
const helper = require('./helper/helper.js');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const validator = require('validator');

const cookie = require('cookie');
const session = require('express-session');
app.use(session({
    secret: 'bntmusictimeline',
    resave: false,
    saveUninitialized: true
}));

const MongoClient = require('mongodb').MongoClient;
const serverUrl = "mongodb+srv://Admin:9JWaUSAowRtMKvw6@bnt.nslr2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

var db = null;

// ================================
const publicUsername = "publicuser";
const chooseLikes = 5; // number of artists chosen from user's likes, to then get related artists
const chooseRelatedArtists = 15; // number of artists to choose from related artists, to then get albums 
// ================================

app.use(function (req, res, next){
    req.username = (req.session.username)? req.session.username : null;
    res.setHeader('Set-Cookie', cookie.serialize('username', req.username, {
        path : '/', 
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: true,
        sameSite: true
    }));
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});

var isAuthenticated = function(req, res, next) {
    if (!req.session.username) return res.status(401).end("access denied");
    next();
};

var checkUsernamePassword = function(req, res, next) {
    if (!validator.isAlphanumeric(req.body.username)) return res.status(400).end("username: bad input");
    if (!validator.isAlphanumeric(req.body.password)) return res.status(400).end("password: bad input");
    next();
};

var checkId = function(req, res, next) {
    if (!validator.isNumeric(req.params.id)) return res.status(400).end("id: bad input");
    next();
};

var checkYear = function(req, res, next) {
    if (!validator.isNumeric(req.params.year)) return res.status(400).end("year: bad input");
    next();
};

var checkName = function(req, res, next) {
    if (!validator.isAlphanumeric(req.body.name.replace(/\s+/g, ''))) return res.status(400).end("name: bad input");
    next();
};


// ================ CREATE ================

app.post('/api/signup/', checkUsernamePassword, function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var dbUsers = db.db("Users");
    dbUsers.collection("Users").findOne({ username: username }, function(err, user) {
        if (err) return res.status(500).end(err.toString());
        if (user) return res.status(409).end("username " + username + " already exists");
        var salt = helper.generateSalt();
        var hash = helper.generateHash(password, salt);
        let newUser = new helper.User(username, salt, hash);
        dbUsers.collection('Users').insertOne(newUser, function (err, insertRes) {
            if (err) return res.status(500).end(err.toString());
            req.session.username = username;
            res.setHeader('Set-Cookie', cookie.serialize('username', username, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7,
                httpOnly: true,
                secure: true,
                sameSite: true
            }));
            return res.json("user " + username + " signed up");
        });
    });
    
});

app.post('/api/signin/', checkUsernamePassword, function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var dbUsers = db.db("Users");
    dbUsers.collection("Users").findOne({ username: username }, function (err, user) {
        if (err) return res.status(500).end(err.toString());
        if (!user) return res.status(404).end('username ' + username + ' does not exist');
        if (user.hash != helper.generateHash(password, user.salt)) return res.status(401).end("Wrong password");
        req.session.username = username;
        res.setHeader('Set-Cookie', cookie.serialize('username', username, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: true,
            secure: true,
            sameSite: true
        }));
        return res.json("user " + username + " signed in");
    });

});

// ================ READ ================

app.get('/api/signout/', function (req, res, next) {
    req.session.destroy();
    res.setHeader('Set-Cookie', cookie.serialize('username', '', {
          path : '/', 
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: true,
          secure: true,
          sameSite: true
    }));
    return res.json("signed out");
});

app.get('/api/user/', function (req, res, next) {
    if (!req.username) return res.status(404).end('User currently not signed in');
    return res.json(req.username);
});

app.get('/api/album/:id', checkId, function (req, res, next) {
    deezerApi.getAlbumInfo(req.params.id, function (err, album) {
        if (err) return res.status(500).end(err.toString());
        res.json(album); // returns raw album object from deezer api
    });
});

app.get('/api/users/timeline/', function (req, res, next) {
    var username = req.username ? req.username : publicUsername;
    var dbUsers = db.db("Users");
    var query = { username: username };
    dbUsers.collection("Users").findOne(query, function(err, user) {
        if (err) return res.status(500).end(err.toString());
        if (!user) return res.status(404).end('username ' + username + ' does not exist');
        var dbAlbums = db.db("Artists");
        query = { albumId: {$in: user.reccAlbums} }; 
        dbAlbums.collection("Albums").find(query).toArray(function(err, albums) {
            if (err) return res.status(500).end(err.toString());
            return res.json(albums);
        });
    });
});

app.get('/api/users/timeline/:year/', checkYear, function (req, res, next) {
    var username = req.username ? req.username : publicUsername;
    var dbUsers = db.db("Users");
    var query = { username: username };
    dbUsers.collection("Users").findOne(query, function(err, user) {
        if (err) return res.status(500).end(err.toString());
        if (!user) return res.status(404).end('username ' + username + ' does not exist');
        var dbAlbums = db.db("Artists");
        query = { $and: [{ albumId: {$in: user.reccAlbums} }, { year: req.params.year}] }; 
        dbAlbums.collection("Albums").find(query).toArray(function(err, albums) {
            if (err) return res.status(500).end(err.toString());
            return res.json(albums);
        });
    });
});

app.get('/api/users/likes/', isAuthenticated, function (req, res, next) {
    var username = req.username;
    var dbUsers = db.db("Users");
    dbUsers.collection("Users").findOne({ username: username }, function(err, user) {
        if (err) return res.status(500).end(err.toString());
        if (!user) return res.status(404).end('username ' + username + ' does not exist');
        var dbArtists = db.db("Artists");
        var query = { artistId: {$in: user.likedArtists} };
        dbArtists.collection("Artists").find(query).toArray(function(err, artists) {
            if (err) return res.status(500).end(err.toString());
            return res.json(artists);
        });
    });
});


// ================ UPDATE ================

app.patch('/api/search/', checkName, function (req, res, next) {
    deezerApi.getSearchResults(req.body.name, async function (err, artists) {
        if (err) return res.status(500).end(err.toString());
        let artistObjects = [];
        let insertPromises = [];
        for (var i = 0; i < artists.length; i++) {
            var newArtist = new helper.Artist(artists[i].name, artists[i].id, artists[i].picture_medium);
            var insertArtistPromise = (db, newArtist) => {
                return new Promise((resolve, reject) => {
                    var dbArtists = db.db("Artists");
                    let update = { $set: newArtist };
                    dbArtists.collection("Artists").updateOne({ artistId: newArtist.artistId }, update, {upsert: true}, function(err, updateResult) {
                        return err ? reject(err) : resolve(updateResult.upsertedCount);
                    });
                });
            };
            insertPromises.push(insertArtistPromise(db, newArtist));
            artistObjects.push(newArtist);
        }
        try {
            await Promise.all(insertPromises);
            return res.json(artistObjects);
        } catch (e) {
            return res.status(500).end(e.toString());
        }
    });
});

app.patch('/api/users/timeline/update/', isAuthenticated, function (req, res, next) {
    var username = req.username;
    var dbUsers = db.db("Users");
    dbUsers.collection("Users").findOne({ username: username }, function(err, user) { // check user exists
        if (err) return res.status(500).end(err.toString());
        if (!user) return res.status(404).json('username ' + username + ' does not exist');
        let randomLikedArtists = helper.getRandomItems(user.likedArtists, chooseLikes);
        deezerApi.getRelated(randomLikedArtists, function (err, relatedArtists) {   // get artists related to a handful of user's liked artists
            if (err) return res.status(500).end(err.toString());
            relatedArtists = helper.getRandomItems(relatedArtists, chooseRelatedArtists);
            relatedArtists = relatedArtists.map(artist => new helper.Artist(artist.name, artist.id, artist.picture_medium));
            var dbArtists = db.db("Artists");
            dbArtists.collection("Artists").find({ artistId: {$in: user.likedArtists} }).toArray(function(err, userLikedArtists) {
                if (err) return res.status(500).end(err.toString());
                let finalArtists = relatedArtists.concat(userLikedArtists);
                finalArtists = Array.from(new Set(finalArtists.map(a => a.artistId))).map(artistId => finalArtists.find(a => a.artistId === artistId)); // remove dupe artists: https://dev.to/marinamosti/removing-duplicates-in-an-array-of-objects-in-js-with-sets-3fep
                deezerApi.getAlbums(finalArtists, function (err, albums) {  // get all albums from a handful of related artists and user's liked artists
                    if (err) return res.status(500).end(err.toString());
                    dbUsers.collection("Users").updateOne({ username: username },{ $set: {reccAlbums: []} }, async function(err) {
                        if (err) return res.status(500).end(err.toString());
                        let insertPromises = [];
                        for (var i = 0; i < albums.length; i++) {
                            let albumObj = new helper.Album(albums[i].title, albums[i].id, albums[i].artistId, albums[i].artistName, albums[i].release_date.slice(0,4), albums[i].cover_medium);
                            var insertAlbumPromise = (db, albumObj) => {
                                return new Promise((resolve, reject) => {
                                    var dbAlbums = db.db("Artists");
                                    let update = { $set: albumObj };
                                    dbAlbums.collection("Albums").updateOne({ albumId: albumObj.albumId }, update, {upsert: true}, function(err, updateResult) {
                                        return err ? reject(err) : resolve(updateResult.upsertedCount);
                                    });
                                });
                            };
                            var addReccAlbumPromise = (albums, i, dbUsers, username) => {
                                return new Promise((resolve, reject) => {
                                    let update = { $addToSet: {reccAlbums: albums[i].id.toString()} };
                                    dbUsers.collection("Users").updateOne({ username: username }, update, function(err, updateResult) {
                                        return err ? reject(err) : resolve(updateResult.modifiedCount);
                                    });
                                });
                            };
                            insertPromises.push(insertAlbumPromise(db, albumObj)); // upsert albums
                            insertPromises.push(addReccAlbumPromise(albums, i, dbUsers, username)); // update user's recc albums
                        }
                        try {
                            await Promise.all(insertPromises);
                            return res.json("Completed timeline update");
                        } catch (e) {
                            return res.status(500).end(e.toString());
                        }
                    });
                }); 
            });
        });
    }); 
});

app.patch('/api/users/like/:id/', isAuthenticated, checkId, function (req, res, next) {
    var username = req.username;
    var artistId = req.params.id.toString();
    var dbUsers = db.db("Users");
    dbUsers.collection("Users").findOne({ username: username }, function(err, user) {
        if (err) return res.status(500).end(err.toString());
        if (!user) return res.status(404).end('username ' + username + ' does not exist');
        var dbArtists = db.db("Artists");
        dbArtists.collection("Artists").findOne({ artistId: artistId }, function(err, artist) {
            if (err) return res.status(500).end(err.toString());
            if (!artist) return res.status(404).end('artistId ' + artistId + ' does not exist in db yet. Search for artist first or use other like endpoint');
            let update = { $addToSet: {likedArtists: artistId} };
            dbUsers.collection("Users").updateOne({ username: username }, update, function(err, updateResult) {
                if (err) return res.status(500).end(err.toString());
                if (updateResult.modifiedCount != 1) return res.status(409).end("Already liked artist: " + artistId);
                return res.json(artist);
            });
        });
    });
});

app.patch('/api/users/like/deezer/:id/', isAuthenticated, checkId, function (req, res, next) {
    var username = req.username;
    var artistId = req.params.id.toString();
    var dbUsers = db.db("Users");
    dbUsers.collection("Users").findOne({ username: username }, function(err, user) {
        if (err) return res.status(500).end(err.toString());
        if (!user) return res.status(404).end('username ' + username + ' does not exist');
        let update = { $addToSet: {likedArtists: artistId} };
        dbUsers.collection("Users").updateOne({ username: username }, update, function(err, updateResult) {
            if (err) return res.status(500).end(err.toString());
            if (updateResult.modifiedCount != 1) return res.status(409).end("Already liked artist " + artistId);
            deezerApi.getArtist(artistId, (err, artist) => {
                if (err) return res.status(404).end(err.toString());
                var dbArtists = db.db("Artists");
                var newArtist = new helper.Artist(artist.name, artist.id, artist.picture_medium);
                let update = { $set: newArtist };
                dbArtists.collection("Artists").updateOne({ artistId: newArtist.artistId }, update, {upsert: true}, function(err) {
                    if (err) return res.status(500).end(err.toString());
                    return res.json(newArtist);
                });
            });
        });
    });
});

app.patch('/api/users/unlike/:id/', isAuthenticated, checkId, function (req, res, next) {
    var username = req.username;
    var artistId = req.params.id.toString();
    var dbUsers = db.db("Users");
    var query = { username: username };
    dbUsers.collection("Users").findOne(query, function(err, user) {
        if (err) return res.status(500).end(err.toString());
        if (!user) return res.status(404).end('username ' + username + ' does not exist');
        let update = { $pull: {likedArtists: artistId} };
        dbUsers.collection("Users").updateOne(query, update, function(err, updateResult) {
            if (err) return res.status(500).end(err.toString());
            if (updateResult.modifiedCount != 1) return res.status(409).end("Artist was not on liked list");
            return res.json("unliked artist: " + artistId);
        });
    });
});

// ================ DELETE ================


// ================ SERVER ================

const http = require('http');
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'frontend/build')));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res, next) {
      if (req.url === '/signout/') return next();
      res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
    });
}

MongoClient.connect(serverUrl, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, database) {
    if (err) return res.status(500).end(err.toString);
    db = database;
    http.createServer(app).listen(PORT, function (err) {
        if (err) console.log(err);
        else console.log("HTTP server on http://localhost:%s", PORT);
    });
});