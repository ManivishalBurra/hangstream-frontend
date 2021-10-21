import React,{useState} from 'react';
import ReactDOM from 'react-dom';
import {Route, BrowserRouter as Router,Switch} from 'react-router-dom';
import Home from './pages/Home/Home'
import Account from './pages/accounts/account';
import Room from './pages/Stream/Room'
import Login from './pages/Login/Login'
import Movies from './pages/Movies/movie'
import Error from './pages/404/error'
import {UserRoom} from './userContext/userdetails'
import {Theme} from './userContext/userdetails'
import {filePathMovie} from './userContext/userdetails'
function Render() {
  const [roomId,setRoomId] = useState("");
  const [theme,setTheme]= useState("light-theme");
  const [videoFilePath, setVideoFilePath] = useState(null);
  return (
    <Router>
     <UserRoom.Provider value={{roomId,setRoomId}}>
     <Theme.Provider value={{theme,setTheme}}>
     <filePathMovie.Provider value={{videoFilePath, setVideoFilePath}}>
      <Switch>
      <Route exact path="/home/:googleId" component={Home} />
      <Route path="/account" component={Account} />
      <Route  path="/room/:roomid" component={Room} />
      <Route  path="/movies" component={Movies} />
      <Route exact path="/" component={Login} />
      <Route  path="*" component={Error} />
      </Switch>
      </filePathMovie.Provider>
      </Theme.Provider>
      </UserRoom.Provider>
    </Router>
  );
}

export default Render;
