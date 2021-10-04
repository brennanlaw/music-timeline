import React, { useState, useEffect } from "react";
import Artist from './Artist';
import { api } from './api.js';
import './style/likes.css';
import './style/main.css';

function EditLikes() {

    const [searchResults, setSearchResults] = useState([]);
    const [likes, setLikes] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [error, setError] = useState("");
    const [searching, setSearching] = useState(false);
    const [updating, setUpdating] = useState(false);

    var handleSearchName = (e) => setSearchName(e.target.value);

    var handleSearch = (e) => {
        e.preventDefault();
        setSearching(true);
        setError("");
        setSearchResults([]);
        api.searchArtist(searchName, (err, artists) => {
            setSearching(false);
            if (err) return setError(err);
            setSearchResults(artists);
        });
    };

    var handleLike = (artistId) => {
        api.like(artistId, (err, artist) => {
            if (err) return console.log(err);
            setLikes([artist, ...likes]);
        });
    };

    var handleUnlike = (artistId) => { 
        api.unlike(artistId, (err, unlikeMessage) => {
            if (err) return console.log(err);
            let newLikes = likes.filter(artist => artist.artistId !== artistId);
            setLikes(newLikes);
        });
    };

    var handleTimelineUpdate = () => { 
        setUpdating(true);
        api.updateTimeline((err, updateMessage) => {
            if (err) return console.log(err);
            setUpdating(false);
            window.location.href = '/';
        });
    };

    var isLiked = (artist) => {
        let likesIds = likes.map(artist => artist.artistId);
        return likesIds.includes(artist.artistId); 
    };

    useEffect(() => {
        api.getLikes((err, artists) => {
            if (err) return console.log(err);
            setLikes(artists);
        });
    }, []);
    
    return (
        <div className="edit_likes_container">

            <div className="artist_list">

                <div className="search_container">
                    <div className="add_likes">
                        <form className="add_like_form" onSubmit={(e) => handleSearch(e)}>
                            <p className="header">Search artist:</p>
                            <input value={searchName} placeholder="artist name" className="form_element" onChange={handleSearchName} required/>
                            <button type="submit" className="btn">Search</button>
                        </form>
                        <div className="error_box">
                            <p>{error}</p>
                        </div>
                    </div>
                </div>

                <div className="search_results_header">
                    <h1 className="header">Search Results ({searchResults.length})</h1>
                    <button style={{"display": searchResults.length>0 ? "block" : "none"}} onClick={() => setSearchResults([])}>Clear results</button>
                </div> 

                { searching ? <div className="load_box"><div className="load"></div></div> :
                    searchResults.map(artist => {
                        let artistItem = <Artist 
                            key={artist.artistId} 
                            artistId={artist.artistId} 
                            name={artist.name} 
                            picture={artist.picture} 
                            handleLike={handleLike}
                            handleUnlike={handleUnlike}
                            liked={isLiked(artist)}
                        />
                        return artistItem;
                    })
                }

            </div>

            <div className="artist_list">
                <div className="update_button_container">
                    <button className="update_button" type="button" onClick={handleTimelineUpdate}>{updating ? <div className="load_box"><div className="load"></div></div> : "Update Timeline"}</button>
                </div>
                
                <h1>My Likes ({likes.length})</h1>
                {
                    likes.map(artist => {
                        let artistItem = <Artist 
                            key={artist.artistId} 
                            artistId={artist.artistId} 
                            name={artist.name} 
                            picture={artist.picture} 
                            handleLike={handleLike}
                            handleUnlike={handleUnlike}
                            liked={true}
                        />
                        return artistItem;
                    })
                }
            </div>

        </div>
    ) 
}

export default EditLikes;