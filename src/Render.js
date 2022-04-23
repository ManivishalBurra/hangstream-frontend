import React,{useState} from 'react';
import ReactDOM from 'react-dom';
import {Route, BrowserRouter as Router,Switch} from 'react-router-dom';
import Home from './pages/Home/Home'
import Account from './pages/accounts/account';
import Room from './pages/Stream/Room'
import Login from './pages/Login/Login'
import Movies from './pages/Movies/movie'
import Error from './pages/404/error'
import Audio from './components/AudioCall/audio'
import Drive from './pages/Drive/drive'
import {UserRoom} from './userContext/userdetails'
import {Theme} from './userContext/userdetails'
import {filePathMovie} from './userContext/userdetails'
import {filePathSub} from './userContext/userdetails'
function Render() {
  const [roomId,setRoomId] = useState("");
  const [theme,setTheme]= useState("light-theme");
  const [videoFilePath, setVideoFilePath] = useState("");
  const [subFilePath,setSubFilePath]=useState("");
  return (
    <Router>
     <UserRoom.Provider value={{roomId,setRoomId}}>
     <Theme.Provider value={{theme,setTheme}}>
     <filePathMovie.Provider value={{videoFilePath, setVideoFilePath}}>
     <filePathSub.Provider value={{subFilePath,setSubFilePath}}>
      <Switch>
      <Route exact path="/home/:googleId" component={Home} />
      <Route path="/account" component={Account} />
      <Route  path="/room/:roomid" component={Room} />
      <Route  path="/streamflix" component={Movies} />
      <Route  path="/watch/:movieid" component={Drive} />
      <Route  path="/audio" component={Audio} />
      {/* <Route  path="/private" component={Private} /> */}
      <Route exact path="/" component={Login} />
      <Route  path="*" component={Error} />
      
      </Switch>
      </filePathSub.Provider>
      </filePathMovie.Provider>
      </Theme.Provider>
      </UserRoom.Provider>
    </Router>
  );
}

export default Render;
