import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useHistory } from "react-router-dom";
import ReactPlayer from 'react-player'
import streamcam from "../../images/streamcam.png";
import Navbar from '../../components/Navbar/navbar'
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { UserRoom } from '../../userContext/userdetails'
import { BASE_URL } from '../../constants/index'
import {Theme} from '../../userContext/userdetails'
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import "../../css/movie.css";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [clay,setClay] = useState(false);
  var { roomId, setRoomId } = useContext(UserRoom);
  var { theme,setTheme } = useContext(Theme); 
  const [buttonStatus, setButtonStatus] = useState(false);
  const myvideo = useRef(null);
  const history = useHistory();
  useEffect(() => {
    axios.get(`${BASE_URL}/movies/movieslist`).then((res) => {

      if (res.data) {
        setMovies(res.data);
      }
      else{

      }
    })
  }, [])
  function PlayTrailer(e) {
    setButtonStatus(true);
    if(myvideo.current.getCurrentTime()<60){
    myvideo.current.seekTo(60,'seconds');
    }
    if(!clay)
    {
      setClay(true);
      
    }
  }
  function StopTrailer(e) {
    setButtonStatus(false);
    
    setClay(false);
  }
  function Startstream(e) {
    var str = Number(e.target.id.substring(4));
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
    return <div className=" movie-thumbnail">
      <div className="movie-tile" onMouseOver={PlayTrailer} onMouseOut={StopTrailer} key={index} id={index}>
        <div className="react-player-movies">
        <ReactPlayer
          ref={myvideo}
          width="100%"
          height="100%"
          url={list.banner}
          playing={clay}
          loop={true}
          light={true}
        />
        </div>
        <h6 className={"non-hover-h6 "+theme+"-h6"}>{list.movieName.substring(0,16)}</h6>
        <div className="stream-option-main backdrop-blur-black">
        <Tippy content="Play" className="tipsy-topsy">
        <button className="stream-btn" key={index} onClick={Startstream} id={"btn-" + index} ><PlayArrowIcon/></button>
        </Tippy>
        <Tippy content="Like" className="tipsy-topsy">
        <button className="stream-btn"><ThumbUpAltIcon/></button>
        </Tippy>
        <Tippy content="Dislike" className="tipsy-topsy">
        <button className="stream-btn"><ThumbDownIcon/></button>
        </Tippy>
        <Tippy content="Info">
        <button className="stream-btn"><InfoOutlinedIcon/></button>
        </Tippy>
        <h6 className="hover-h6">{list.movieName.substring(0,16)}</h6>
        </div>
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
