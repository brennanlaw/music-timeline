# Project Title: Music Timeline

## Team Members

- Brennan Law
- Tony Hong

## Application Description

Welcome to Music Timeline, an album exploration and music discovery tool where users can browse through albums organized in an interactive and customized timeline. 
Each user's timeline is tailored to them, meaning the albums that appear on their timeline is based on a combination of their liked artists and recomended artists based on liked artists.

### App Demo Video
[https://www.youtube.com/watch?v=1_pUVsk5-lg](https://www.youtube.com/watch?v=1_pUVsk5-lg)

## Beta Version Features

- user registration, sign in and sign out
- interactive timeline that allows users to expand a certain year, giving information on artists/songs/albums from that year
- ability for users to "like" a certain item(artist/song/album)
- ability for users to view all their likes and remove each of them
- timeline updates to reflect recommendations based on users' likes

## Final Version Features

- enhanced information on artists/songs/albums with embeded song files/videos, etc
- ability to search artists by name and ability to like or dislike them
- added a music player to the albums (it will play as a full song when also logged into deezer website)

## Warning Issues
- When trying to play a song using the deezer widgit we found that we get an error "The Content Security Policy directive 'upgrade-insecure-requests' is ignored when delivered in a report-only policy." We tried to add CSP to our backend and frontend but the error was still showing up and when we tried an iframe with Youtube we would get no such errors. This led us to believe that this warning is something that we cannot control and this is something that the deezer api does as it does not want to record when upgrade-insecure-requests occur.

## Technology Involved

- [React](https://reactjs.org/) - frontend
- [Express](https://expressjs.com/) - backend
- [Nodejs](https://nodejs.org/en/) - backend
- [Mongodb](https://www.mongodb.com/) - database

## Top 5 Technnical Challenges

1) Utilizing and learning new frontend libraries (React)
2) Utilizing and learning new backend and database technologies (Mongodb)
3) Integrating several APIs to gather music/artist information and recommendations
4) Building a complicated frontend to accomodate (what will hopefully be) an extensive amount of data
5) Learning application deployment technologies

## Documentation

The API documentation can be found in this repo in the docs/README.MD so that it will not confuse with this README.MD.

## Help Section

NOTICE: Need to disable "Block third-party cookies and site data" as our app relies on the deezer widget to play music from a specific album since it uses those cookied to determine if you are logged into the deezer website since being logged in allows users to hear the full track otherwise they will only be allowed to hear a preview.

![alt text](https://www.chromium.org/_/rsrc/1444426959784/for-testers/bug-reporting-guidelines/uncaught-securityerror-failed-to-read-the-localstorage-property-from-window-access-is-denied-for-this-document/blockthirdpartycookies.png)
