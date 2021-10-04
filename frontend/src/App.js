import React from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavBar from './NavBar';
import Home from './Home';
import Login from './Login';
import EditLikes from './EditLikes';
import Credits from './Credits';
import Help from './Help';
import './style/main.css';

function App() {
    return (
        <div className="main_container">
            <Router>
                <NavBar />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path='/login' component={Login} />
                    <Route exact path="/likes" component={EditLikes} />
                    <Route exact path="/credits" component={Credits} />
                    <Route exact path="/help" component={Help} />
                </Switch>
                <div className="credits_link"><a href="/credits">Credits</a></div>
            </Router>
        </div>
    );
}

export default App;