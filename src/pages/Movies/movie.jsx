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
  const [ind,setInd] = useState(0);
  const myvideo = useRef(null);
  const history = useHistory();
  var arr=[];
  useEffect(() => {
   axios.get(`${BASE_URL}/movies/movieslist`).then(async (res) => {

      if (res.data) {
        setMovies(res.data);
        var len= await res.data.length;
        console.log(len);
        for(var i=0;i<len;i++)
        {
          arr.push(false);
        }
        console.log(arr);
        setClay(arr);
      }
      else{

      }
    })
  }, [])
  function PlayTrailer(e) {
    var str = Number(e.target.id.substring(4));
    console.log(e.target);
    setButtonStatus(true);
    arr=clay;
    if(str)
    {
     arr[str]=true;
     setInd(str);
    }
    else if(str==0)
    {
      arr[str]=true;
      setInd(str);
    }
    setClay(arr);

    //console.log(clay,"clay");
    if(myvideo.current.getCurrentTime()<60){
    myvideo.current.seekTo(60,'seconds');
    }
  }
  function StopTrailer(e) {
    setButtonStatus(false);
    arr=clay;
    arr[ind]=false;
    setClay(arr);
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
      <div className="movie-tile" key={index} id={index}>
        <div className="react-player-movies">
        <ReactPlayer
          ref={myvideo}
          width="100%"
          height="100%"
          url={list.banner}
          playing={clay[index]}
          loop={true}
          light={true}
        />
        </div>
        <h6 className={"non-hover-h6 "+theme+"-h6"}>{list.movieName.substring(0,16)}</h6>
        <div className="stream-option-main backdrop-blur-black" onMouseOver={PlayTrailer} onMouseOut={StopTrailer} id={"min-" + index}>
        <Tippy content="Play" className="tipsy-topsy">
        <button className="stream-btn" key={index} onClick={Startstream} id={"btn-" + index} ><PlayArrowIcon id={"ftn-" + index}/></button>
        </Tippy>
        <Tippy content="Like" className="tipsy-topsy">
        <button className="stream-btn" id={"tin-" + index}><ThumbUpAltIcon/></button>
        </Tippy>
        <Tippy content="Dislike" className="tipsy-topsy">
        <button className="stream-btn" id={"din-" + index} ><ThumbDownIcon/></button>
        </Tippy>
        <Tippy content="Info">
        <button className="stream-btn"><InfoOutlinedIcon/></button>
        </Tippy>
        <div className="title-header" id={"ain-" + index}>
        <h6 className="hover-h6" id={"bin-" + index}>{list.movieName.substring(0,16)}</h6>
        <p className="rating-main" id={"cin-" + index}>IMDB: <span className="ratings">{list.ratings}</span></p>
        </div>
        <p className="genre" id={"din-" + index}>{list.genres.map((genre,index)=>{
          return <>
          <span>&#8226;{genre}&nbsp;</span>
          </>
        })}</p>
        <p className="plot" id={"ein-" + index}>{list.plotOutline}</p>
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
