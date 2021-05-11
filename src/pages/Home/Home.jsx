import React from 'react';
import Navbar from '../../components/Navbar/navbar'
import MicIcon from '@material-ui/icons/Mic';
import VideocamIcon from '@material-ui/icons/Videocam';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import "../../css/home.css";
import streamcam from "../../images/streamcam.png";
import GroupIcon from '@material-ui/icons/Group';
import active from '../../images/active.png';

const Home = ()=>{
    return(
        <>
        <Navbar/>
        <div className="row home-hero">
        <div className="col-lg-8 ">
        <div className="video-banner center column">
        <iframe width="100%" height="100%" src="https://www.youtube.com/embed/Hgc07_BX4_8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;" allowfullscreen></iframe>
        <div className="video-info">
        <h1>Streaming Now!!</h1>
        <p>3 are watching</p>
        </div>
        </div>
        <div className="center stream-choice">
        <button className="stream-option center"><img src={streamcam}/>&nbsp;&nbsp;Start stream</button>
        <button className="setting-btn"><MicIcon/></button>
        <button className="setting-btn"><VideocamIcon/></button>
        <button className="stream-option"><GroupIcon/>&nbsp;&nbsp;Join stream</button>
        </div>
        </div>
        <div className="col-lg-4">

        <div className="friends-list backdrop-blur">
        <table class="table">
  <thead>
    <tr>
      <th>Your friendlist</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><i class="far fa-user-circle"></i>Srikanth</td>
      <td><img src={active}/></td>
    </tr>
    <tr>
      <td><i class="far fa-user-circle"></i>Neeraj</td>
      <td><img src={active}/></td>
    </tr>
    <tr>
      <td><i class="far fa-user-circle"></i>Manikanth</td>
      <td><img src={active}/></td>
    </tr>
    <tr>
      <td><i class="far fa-user-circle"></i>Santosh</td>
      <td><img src={active}/></td>
    </tr>
    <tr>
      <td><i class="far fa-user-circle"></i>Vinay</td>
      <td><img src={active}/></td>
    </tr>
  </tbody>
</table>
        </div>

        </div>
        </div>
        </>
    );
}


export default Home;