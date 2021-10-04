import React, {useState, useEffect} from "react";
import AlbumItem from "./AlbumItem.js";
import AlbumDetails from "./AlbumDetails.js";
import { api } from './api.js';
import './style/album.css';
import './style/main.css';

function AlbumsDisplay(props) {

    const year = props.year;
    const [albumItems, setAlbumItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState(null);

    useEffect(() => {
        setLoading(true);
        api.getTimeline(year, (err, albums) => {
            setLoading(false);
            if (err) return console.log(err);
            setAlbumItems(albums);
        });
    }, [year]);

    return (
        <div className="albums_display">
            {loading ? <div className="load_box"><div className="load"></div></div> :
                <div className="albums_container">
                    {
                        albumItems.length===0 ? <h1>No albums found</h1> : (
                            albumItems.map(album => <AlbumItem key={album.albumId} album={album} setSelectedAlbum={setSelectedAlbum}/>)
                        )
                    }
                </div>
            }
            
            {!selectedAlbum ? "" : (
                <AlbumDetails key={selectedAlbum.albumId} selectedAlbum={selectedAlbum} setSelectedAlbum={setSelectedAlbum}/>
            )}            
        </div>
    ) 
}

export default AlbumsDisplay