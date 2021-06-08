import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useHistory } from "react-router-dom";
import ReactPlayer from 'react-player'
import streamcam from "../../images/streamcam.png";
import Navbar from '../../components/Navbar/navbar'
import { UserRoom } from '../../userContext/userdetails'
import { BASE_URL } from '../../constants/index'
import {Theme} from '../../userContext/userdetails'
import "../../css/movie.css";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [play, setPlay] = useState(false);
  var { roomId, setRoomId } = useContext(UserRoom);
  var { theme,setTheme } = useContext(Theme); 
  const [buttonStatus, setButtonStatus] = useState(false);
  const myvideo = useRef(null);
  const history = useHistory();
  useEffect(() => {
    axios.get(`${BASE_URL}/movies/movieslist`).then((res) => {
      console.log(res.data,"res data");
      if (res.data) {
        setMovies(res.data);
      }
      else{
        console.log("error ocoored");
      }
    })
  }, [])
  function PlayTrailer(e) {
    setButtonStatus(true);
  }
  function StopTrailer(e) {
    setTimeout(() => setPlay(false), 1000);
    setButtonStatus(false)
  }
  function Startstream(e) {
    var str = e.target.id.substring(4);
    var tokenId = localStorage.getItem("tokenId");
    const roomid = uuidv4();
    if (tokenId) {
      axios.post(`${BASE_URL}/home/roomstream`, { url: movies[str].movieUrl, movieName: movies[str].movieName, banner: movies[str].banner, roomid: roomid, id: tokenId, source: "movies" }).then((res) => {
        if (res.data) {
          setRoomId(roomid);
          history.push(`/room/${roomid}`);
        }
      })
    }
    else {
      history.push("/");
    }
  }
  function Movielists(list, index) {
    return <div className="col-lg-3 center movie-thumbnail">
      <div className="movie-tile" onMouseOver={PlayTrailer} onMouseOut={StopTrailer} key={index} id={index}>
      
        <ReactPlayer
          ref={myvideo}
          width="100%"
          height="100%"
          url={list.banner}
          playing={play}
          loop={true}
          light={true}
          style={{borderRadius:"12px"}}
        />
        <button className={"stream-option center stream-btns "+theme+"-img"} key={index} onClick={Startstream} id={"btn-" + index}><img src={streamcam} />&nbsp;&nbsp;Watch now</button>
        <h6 className={theme+"-img"}>{list.movieName}</h6>
      </div>
    </div>
  }
  return <>
    <Navbar />
    <div className="row movie-main" id={theme+"-main"}>

      {movies.map(Movielists)}

    </div>


  </>
}

export default Movies;
