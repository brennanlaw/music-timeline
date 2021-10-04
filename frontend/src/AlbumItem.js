import React, { useState } from "react";

import './style/album.css';

function AlbumItem(props) {

    const album = props.album;

    const [hover, setHover] = useState(false); 

    return (
        <div className="album_item"  >
            <img 
                style={hover ? {opacity:0.5,"cursor":"pointer"}:{}} 
                className="album_item_img" 
                src={album.cover} 
                alt={album.title}  
                onClick={() => {setHover(false); props.setSelectedAlbum(album)}} 
                onMouseOver={() => setHover(true)} 
                onMouseLeave={() => setHover(false)} 
            />
            <div className="album_info">
                <p className="album_title">{album.title}</p>
                <p className="album_artist">{album.artistName}</p>
            </div>
        </div>
    )
}

export default AlbumItem