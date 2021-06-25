import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useHistory } from "react-router-dom";
import ReactPlayer from 'react-player'
import streamcam from "../../images/streamcam.png";
import Navbar from '../../components/Navbar/navbar'
import {filePathMovie} from '../../userContext/userdetails'
import Tippy from '@tippyjs/react';
import Box from '../../components/Box/Box'
import 'tippy.js/dist/tippy.css';
import { UserRoom } from '../../userContext/userdetails'
import { BASE_URL } from '../../constants/index'
import {Theme} from '../../userContext/userdetails'
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import "../../css/movie.css";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const Private = () => {
  const [movies, setMovies] = useState([]);
  const [clay,setClay] = useState(false);
  var { theme,setTheme } = useContext(Theme); 
  const [buttonStatus, setButtonStatus] = useState(false);
  const [boxState, setBoxState] = useState(false);
  const {videoFilePath, setVideoFilePath} = useContext(filePathMovie);
  const history = useHistory();
  const [banner, setBanner] = useState({});
  const tokenId = localStorage.getItem("tokenId");
  const [privateStatus,setPrivateStatus] = useState(false);
  var arr=[];
  useEffect(() => {
   axios.get(`${BASE_URL}/private/privatelist`).then(async (res) => {

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
    });
    axios.post(`${BASE_URL}/home/getinfo`, { id: tokenId }).then((res) => {
      if (res.data.length > 0 && res.data[0].id === tokenId) {
        setBanner({ ...res.data[0] });
        if(res.data[0].email.includes("@hyderabad.bits-pilani.ac.in"))setPrivateStatus(true);
        else history.push("/movies");
      }
      else {
        history.push("/");
      }
    });
  }, []);

  function display(state) {
    setBoxState(false);
  }
  function CreateRoomDiv() {
    setBoxState(true);
  }
  function Startstream(e) {
    var str = Number(e.target.id.substring(4));
    setVideoFilePath(movies[str].movieUrl);
    history.push("/drive");
  }
  function Movielists(list, index) {
    return <div className=" movie-thumbnail" style={{height:"330px"}}>
      <div className="movie-tile" key={index} id={index}>
        <div className="react-player-movies" id="drive-player">
        <img src={list.poster} className="drive-poster" />
        <iframe 
        src={list.banner+"?t=1552s"}
        width="100%" 
        height="100%"
        frameborder="0" scrolling="no" seamless=""
        />
        </div>
        <h6 className={"non-hover-h6 "+theme+"-h6"}>{list.movieName}</h6>
        <div className="stream-option-main backdrop-blur-black" id={"min-" + index}>
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
    <div id={theme+"-main"} style={{height:"100%"}}>
    <div className="row movie-main" id={theme+"-main"}>
      {movies.map(Movielists)}
    </div>
    {privateStatus && <div className="private">
    <Tippy content="Add movies">
      <button onClick={CreateRoomDiv}><AddCircleOutlineIcon/></button>
    </Tippy>
    </div>}
    {boxState &&
        <Box display={display} filePath={false} private={true}/>
    }
    </div>
  </>
}

export default Private;
