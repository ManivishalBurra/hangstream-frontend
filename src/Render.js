import React,{useState} from 'react';
import ReactDOM from 'react-dom';
import {Route, BrowserRouter as Router,Switch} from 'react-router-dom';
import Home from './pages/Home/Home'
import Room from './pages/Stream/Room'
import Login from './pages/Login/Login'
import {UserRoom} from './userContext/userdetails'
function Render() {
  const [roomId,setRoomId] = useState("");
  return (
    <Router>
     <UserRoom.Provider value={{roomId,setRoomId}}>
      <Switch>
      <Route exact path="/home/:googleId" component={Home} />
      <Route  path="/room/:roomid" component={Room} />
      <Route  path="/" component={Login} />
      </Switch>
      </UserRoom.Provider>
    </Router>
  );
}

export default Render;
