import React, { useState } from 'react';
import { api } from './api.js';
import './style/login.css';

function Login () {
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    var handleUsername = (event) => setUsername(event.target.value);
    var handlePassword = (event) => setPassword(event.target.value);

    var handleSignup = () => {
        if (username === "" || password === "") return setError("Please fill in all fields");
        api.signup(username, password, (err, signupMessage) => {
            if (err) return setError(err);
            window.location.href = '/';
        });
    };

    var handleSignin = () => {
        if (username === "" || password === "") return setError("Please fill in all fields");
        api.signin(username, password, (err, signinMessage) => {
            if (err) return setError(err);
            window.location.href = '/';
        });
    };

    return (
        <form className="login_form">
            <input value={username} placeholder="Username" className="login_input" onChange={handleUsername} required />
            <input value={password} placeholder="Password" className="login_input" onChange={handlePassword} type="password" required/>
            <div className="error_box">
                <p>{error}</p>
            </div>
            <div className="login_form_buttons">
                <button type="button" className="sign_button" onClick={handleSignup}>Sign Up</button>
                <button type="button" className="sign_button" onClick={handleSignin}>Sign In</button>
            </div>
        </form>
    );
}

export default Login;