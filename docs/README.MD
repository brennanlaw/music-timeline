# Project Title: Music Timeline

## Team Members

- Brennan Law
- Tony Hong

## User API

### Create

- description: User sign up
- request: `POST /api/signup/`
    - content-type: `application/json`
    - body: object
        - username: (string) user's username
        - password: (string) user's password
- response: 200
    - content-type: `application/json`
    - body: user username signed up
- response: 400
    - body: username: bad input
    - body: password: bad input
- response: 409
    - body: username already exist
- response: 500
    - body: mongo error

``` 
$ curl -X POST 
       -H "Content-Type: `application/json`" 
       -d '{"username":"alice","password":"alice"}' 
       http://localhost:3000/signup/'
```

- description: User sign in
- request: `POST /api/signin/`
    - content-type: `application/json`
    - body: object
        - username: (string) user's username
        - password: (string) user's password
- response: 200
    - content-type: `application/json`
    - body: user username signed in
- response: 400
    - body: username: bad input
    - body: password: bad input
- response: 401
    - body: Wrong password
- response: 404
    - body: username does not exist
- response: 500
    - body: mongo error

``` 
$ curl -X POST 
       -H "Content-Type: `application/json`" 
       -d '{"username":"alice","password":"alice"}' 
       http://localhost:5000/signin/'
```

### Read
- description: User sign out
- request: `GET /api/signout/`
- response: 200

``` 
$ curl --request GET
       -H "Content-Type: `application/json`" 
       -d '{"username":"alice","password":"alice"}' 
       http://localhost:3000/signout/'
```

## Database API

### Read

- description: retrieve the word bank from mongodb
- request: `GET /api/user/`
- response: 200
    - content-type: `application/json`
    - body: string
        - username: (string) user's username
- response: 404
    - body: User not logged in

``` 
$ curl --request GET
       http://localhost:5000/api/user/'
``` 

- description: retrieve the album given an id
- request: `GET /api/album/:id/`
- response: 200
    - content-type: `application/json`
    - body: object of albums
        - albumId:    (string) album's Id based off deezer
        - artistId:   (string) Id of the artist based off deezer
        - artistName: (string) name of artist that made album
        - cover:      (string) url link of album image
        - title:      (string) title/name of album
        - year:       (string) year album came out
- response: 400
    - body: id: bad input
- response: 500
    - body: Mongo error

``` 
$ curl --request GET
       http://localhost:5000/api/album/555/'
``` 

- description: retrieves the timeline for a user
- request: `GET /api/users/timeline/`
- response: 200
    - content-type: `application/json`
    - body: list of albums
        - albumId:    (string) album's Id based off deezer
        - artistId:   (string) Id of the artist based off deezer
        - artistName: (string) name of artist that made album
        - cover:      (string) url link of album image
        - title:      (string) title/name of album
        - year:       (string) year album came out
- response: 404
    - body: Username does not exist 
- response: 500
    - body: Mongo error

``` 
$ curl --request GET
       http://localhost:5000/api/users/timeline/'
``` 

- description: retrieves the timeline for a user from a specific year
- request: `GET /api/users/timeline/:year/`
- response: 200
    - content-type: `application/json`
    - body: list of albums
        - albumId:    (string) album's Id based off deezer
        - artistId:   (string) Id of the artist based off deezer
        - artistName: (string) name of artist that made album
        - cover:      (string) url link of album image
        - title:      (string) title/name of album
        - year:       (string) year album came out
- response: 400
    - body: year: bad input
- response: 404
    - body: Username does not exist 
- response: 500
    - body: Mongo error

``` 
$ curl --request GET
       http://localhost:5000/api/users/timeline/2001/'
``` 

- description: retrieves artists that the user has liked before
- request: `GET /api/users/likes/`
- response: 200
    - content-type: `application/json`
    - body: list of artists
        - artistId: (string) Id of the artist based off deezer
        - name:     (string) name of artist
        - picture:  (string) url link of album image
- response: 401
    - body: access denied
- response: 404
    - body: Username does not exist 
- response: 500
    - body: Mongo error

``` 
$ curl --request GET
       http://localhost:5000/api/users/likes/'
``` 

### Update

- description: Given a name return three search results of artists that are similar name if possible
- request: `PATCH /api/search/`
    - content-type: `application/json`
    - body: object
        - name: (string) name of artist user searched
- response: 200
    - content-type: `application/json`
    - body: list of artists
        - artistId: (string) Id of the artist based off deezer
        - name:     (string) name of artist
        - picture:  (string) url link of album image
- response: 400
    - body: name: bad input
- response: 500
    - body: Mongo error

``` 
$ curl -X PATCH
       -H "Content-Type: `application/json`"
       -D '{"name":"alice"}' 
       http://localhost:5000/api/search/'
``` 

- description: Updates the timeline to match what the user currently likes
- request: `PATCH /api/users/timeline/update/`
- response: 200
    - content-type: `text/html`
    - body: Completed timeline update
- response: 401
    - body: access denied
- response: 404
    - body: Username does not exist 
- response: 500
    - body: Mongo error

``` 
$ curl -X PATCH
       http://localhost:5000/api/users/timeline/update/'
``` 

- description: Updates a user liked artists when liking an artist
- request: `PATCH /api/users/like/:id/`
- response: 200
    - content-type: `application/json`
    - body: object of artist
        - artistId: (string) Id of the artist based off deezer
        - name:     (string) name of artist
        - picture:  (string) url link of album image
- response: 400
    - body: id: bad input
- response: 401
    - body: access denied
- response: 404
    - body: Username does not exist 
- response: 409
    - body: Already liked artist
- response: 500
    - body: Mongo error

``` 
$ curl -X PATCH
       http://localhost:5000/api/users/like/555/'
``` 

- description: Updates a user liked artists when liking an artist that is not in the artists Database
- request: `PATCH /api/users/like/deezer/:id/`
- response: 200
    - content-type: `application/json`
    - body: object of artist
        - artistId: (string) Id of the artist based off deezer
        - name:     (string) name of artist
        - picture:  (string) url link of album image
- response: 400
    - body: id: bad input
- response: 401
    - body: access denied
- response: 404
    - body: Username does not exist 
    - body: artistId does not exist in db yet. Search for artist first or use other like endpoint
- response: 409
    - body: Already liked artist
- response: 500
    - body: Mongo error

``` 
$ curl -X PATCH
       http://localhost:5000/api/users/like/deezer/:id/'
``` 

- description: Updates a user liked artists when unliking an artist
- request: `PATCH /api/users/unlike/:id/`
- response: 200
    - content-type: `text/html`
    - body: unliked artist: artistId
        - artistId: (string) Id of the artist based off deezer
- response: 400
    - body: id: bad input
- response: 401
    - body: access denied
- response: 404
    - body: Username does not exist
- response: 409
    - body: Already liked artist
- response: 500
    - body: Mongo error

``` 
$ curl -X PATCH
       http://localhost:5000/api/users/unlike/555/'
``` 