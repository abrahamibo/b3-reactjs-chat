import React from 'react';
import ReactDOM from 'react-dom';
import {Route, BrowserRouter, Link, Switch,  Redirect, withRouter} from 'react-router-dom';
import './index.css';
import firebase from 'firebase';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Home from './App'; // la mon module s'appelle App mais j'ai emvie de lui donner un autre nom qd je l'utilise ici parce que contextuellement c'est la Home
import UploadFile from './components/UploadFileImg'; // la mon module s'appelle App mais j'ai emvie de lui donner un autre nom qd je l'utilise ici parce que contextuellement c'est la Home

const config = {
    apiKey: "AIzaSyBLk-axC5M4HK9HIPC_OvE-UjqP4NdPfYk",
    authDomain: "courvuejs-henry.firebaseapp.com",
    databaseURL: "https://courvuejs-henry.firebaseio.com",
    projectId: "courvuejs-henry",
    storageBucket: "gs://courvuejs-henry.appspot.com",
    // messagingSenderId: "<SENDER_ID>",
};
firebase.initializeApp(config);

// The Header creates links that can be used to navigate
// between routes.
const userisCo =  () => {
    let co;
    let user2 = firebase.auth().currentUser
    firebase.auth().onAuthStateChanged((user) => {
        co = user ? true : false;
    });
    return co = user2 ? true : false;
    // return co;
};
const logout = () => {
    firebase.auth().signOut().then(function () {
    }).catch(function (error) {
    })

    return <Redirect to="/"/>
};
const Header = (props) => (
    <div className={props.root}>
        <AppBar position="static">
            <Toolbar>
                <IconButton className="nav" color="inherit" aria-label="Menu">
                    <MenuIcon />
                    <nav className="navbar">
                        <ul className="navbar-list clearfix">
                            <li className="navbar-item"><Link className="navbar-link" to={`${process.env.PUBLIC_URL}/`}>Home</Link></li>
                            <li className="navbar-item"><Link className="navbar-link" to={`${process.env.PUBLIC_URL}/upload`}>home Upload</Link></li>
                            <li className="navbar-item"><Link className="navbar-link" to={`${process.env.PUBLIC_URL}/about`}>about</Link></li>
                            <li className="navbar-item"><Link className="navbar-link" to={`${process.env.PUBLIC_URL}/logout`}>logout</Link></li>
                        </ul>
                    </nav>
                </IconButton>
                <Typography variant="h6" color="inherit" className={props.grow}>
                    News
                </Typography>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    </div>
);


const PrivateRoute = ({ component: Component, ...rest }) => {
    // console.log(userisCo);
    return (
        <Route {...rest}
               render={props =>
                   userisCo() ? (
                       <Component {...props} />
                   ) : (
                       <Redirect to="/about"/>
                   )
               }
        />)
};

const Main = () => (
    <main className="container">
        <Switch>
            <Route path={`${process.env.PUBLIC_URL}/upload`} component={UploadFile}/>
            <Route path={`${process.env.PUBLIC_URL}/about`} component={About}/>
            <Route path="/logout" component={logout}/>
            <PrivateRoute path={`${process.env.PUBLIC_URL}/`} component={Home}/>
        </Switch>
    </main>

);

const About = () => (
    <div className="about">
        <h1>This is an about page</h1>
    </div>
);
const App = () => (
    <div className="">
        <Header/>
        <Main/>
    </div>
);

ReactDOM.render((
    <BrowserRouter basename={'/'}>
        <App/>
    </BrowserRouter>
), document.getElementById('root'))