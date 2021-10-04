import React from "react";
import './style/help.css';

function Help() {
    return (
        <div className="help_container">
            <p>
                Welcome to Music Timeline, an album exploration and music discovery tool where users can browse through albums organized in an interactive and customized timeline. 
                Each user's timeline is tailored to them, meaning the albums that appear on their timeline is based on a combination of 
                their liked artists and reccomended artists based on liked artists.
            </p>
            <br/>
            <p>Music Timeline can be used by following these steps:</p>
            <br/>
            <p>1. Click "Sign In" on the navigation bar and sign into your account or create one.</p>
            <br/>
            <p>2. Once signed in, click "Edit Likes" on the navigation bar.</p>
            <br/>
            <p>3. Once on the edit likes page, add artists to your likes by using the search tool.</p>
            <br/>
            <p>4. Once you are satisfied with your liked artists list, click the "Update Timeline" button.</p>
            <br/>
            <br/>
            <p>Demo video:</p>
            <br/>
            <iframe 
                width="560" 
                height="315" 
                src="https://www.youtube.com/embed/1_pUVsk5-lg" 
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen="1">
            </iframe>
        </div>
    ) 
}

export default Help;