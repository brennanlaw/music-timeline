import React, { useState, useEffect } from "react";
import { api } from './api.js';
import './style/album.css';
import './style/main.css';

function AlbumDetails(props) {

    const selectedAlbum = props.selectedAlbum;
    const setSelectedAlbum = props.setSelectedAlbum;

    const [loading, setLoading] = useState(true);
    const [album, setAlbum] = useState({});

    useEffect(() => {
        if (!selectedAlbum) return;
        let mounted = true;
        setLoading(true);
        api.getAlbumInfo(selectedAlbum.albumId, (err, album) => {
            if (err) return console.log(err);
            if (!mounted) return;
            setAlbum(album);
            setLoading(false);
        });
        return () => mounted = false; // cleanup function
    }, [selectedAlbum]);

    return (selectedAlbum) ? (
        <div className="album_details_background">
            <div className="album_details">
                <h1>{selectedAlbum.title}</h1>
                {loading ? <div className="load_box"><div className="load"></div></div> :
                    <iframe title="Loading Up the music player"
                        src={"https://www.deezer.com/plugins/player?playlist=true&layout=dark&type=album&id=" + selectedAlbum.albumId}
                        height={(90 + album.nb_tracks*30)}
                        scrolling="yes" 
                        frameBorder="0"
                        >
                    </iframe>
                }
                <button className="album_details_close" onClick={() => setSelectedAlbum(null)}>Close</button>
            </div>
        </div> 
    ): "";
}

export default AlbumDetails