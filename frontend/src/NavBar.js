import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from './api.js';
import './style/navBar.css';

function NavBar() {

    const [signedIn, setSignedIn] = useState(false);

    var handleSignout = () => {
        api.signout((err, signoutMessage) => {
            if (err) return console.log(err);
            window.location.href = '/';
        });
    };

    var signInOutButton = <button className="menu_item" onClick={signedIn ? handleSignout : () => window.location.href = '/login'}>Sign {signedIn ? "Out" : "In"}</button>;
    var editLikesButton = signedIn ? <button className="menu_item" onClick={() => window.location.href = '/likes'}>Edit Likes</button> : null;
    var helpButton = <button className="menu_item" onClick={() => window.location.href = '/help'}>Help</button>;

    useEffect(() => {
        api.isSignedIn((err, username) => {
            if (err) return;
            setSignedIn(true);
        });
    }, []);

    return (
        <div className="nav_bar">

            <div className="nav_bar_start">
                <Link to='/' className="nav_header">
                    <img className="home_icon" src="home_icon.png" alt="Music Timeline"></img>
                Music Timeline</Link>
            </div>

            <div className="nav_bar_end">
                <div className="nav_buttons">
                    {helpButton}
                    {editLikesButton}
                    {signInOutButton}
                </div>
            </div>

        </div>
    )
}

export default NavBar;