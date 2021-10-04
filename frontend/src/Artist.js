import React from 'react';
import './style/likes.css';

function Artist(props) {

    const artistId = props.artistId;
    const name = props.name;

    var likeUnlikeButton = props.liked ? <button onClick={() => props.handleUnlike(artistId)}>Unlike</button> : <button onClick={() => props.handleLike(artistId)}>Like</button>;

    return (
        <div className="artist_container">
            <div className="artist">
                <div className="artist_info">
                    <img className="artist_picture" src={props.picture} alt={name}></img>
                    <div className="artist_headers"> 
                        <h3 className="artist_name">{name}</h3>
                    </div>
                </div>
                <div className="artist_options">
                    {likeUnlikeButton}
                </div>
            </div>
        </div>
    ) 
}

export default Artist;