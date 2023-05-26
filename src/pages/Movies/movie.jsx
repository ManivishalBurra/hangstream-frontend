import React, { useState, useContext, useEffect, useRef } from 'react';
import { useHistory } from "react-router-dom";
import ReactPlayer from 'react-player'
import Info from '../../components/EpInfo/epinfo'
import Navbar from '../../components/Navbar/Navbar'
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
  const myvideo = useRef(null);
  var { theme,setTheme } = useContext(Theme); 
  var { roomId, setRoomId } = useContext(UserRoom);
  const [boxState, setBoxState] = useState(false);
  const {videoFilePath, setVideoFilePath} = useContext(filePathMovie);
  const history = useHistory();
  const [privateStatus,setPrivateStatus] = useState(false);
  const [ind,setInd] = useState(-1);
  
  useEffect(() => {
   axios.get(`${BASE_URL}/movies/movieslist`).then(async (res) => {

      if (res.data) {
        setMovies(res.data);
      }
    });
  }, []);

  function display(state) {
    setBoxState(false);
    setInd(-1);
  }
  function CreateRoomDiv() {
    setBoxState(true);
  }
  function Startstream(e) {
    
    var str = Number(e.target.id.substring(4));
    var tokenId = localStorage.getItem("tokenId");
    console.log(str)
    const roomid = uuidv4();
    
    if (tokenId) {
      axios.post(`${BASE_URL}/home/roomstream`, { url: movies[str].movieUrl[0], movieName: movies[str].movieName, banner: movies[str].banner, roomid: roomid, id: tokenId, source: "movies" }).then((res) => {
       console.log(res.data)
        if (res.data) {
          setRoomId(roomid);
          setVideoFilePath(movies[str].movieUrl[0]);
          history.push(`/room/${roomid}`);
        }
      })
    }
    else {
      history.push("/");
    }
  }
  function ShowInfo(e) {
    var str = Number(e.target.id.substring(4));
    setInd(str);
  }
  function Movielists(list, index) {
    return <div className=" movie-thumbnail movie-thumbnail-private" style={{height:"330px"}}>
      <div className="movie-tile movie-tile-private" key={index} id={index}>
        <div className="react-player-movies" id="drive-player">
        <img src={list.poster} className="drive-poster" alt="poster"/>
        {list.banner.includes('youtube.com')?
          <ReactPlayer
          ref={myvideo}
          width="100%"
          height="100%"
          url={list.banner}
          loop={true}
          light={true}
          key={"reactplayer"+index}
        />:  
        <iframe 
        src={list.banner+"?t=1552s"}
        width="100%" 
        height="100%"
        frameborder="0" scrolling="no" seamless=""
        title={list.movieName}
        key={"iframe"+index}
        />}
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
        <Tippy content="Episodes & Info">
        <button className="stream-btn" id={"epn-" + index} onClick={ShowInfo}><InfoOutlinedIcon id={"inf-" + index}/></button>
        </Tippy>
        <div className="title-header" id={"ain-" + index}>
        <h6 className="hover-h6" id={"bin-" + index}>{list.movieName.substring(0,16)}</h6>
        <p className="rating-main" id={"cin-" + index}>IMDB: <span className="ratings">{list.ratings}</span></p>
        </div>
        <div>
        <p className="genre" id={"din-" + index}>{list.genres.map((genre,index)=>{
          return <>
          {index<4 && <span>&#8226;{genre}&nbsp;</span>}
          </>
        })}</p>
        </div>
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
    {!privateStatus && <div className="private">
    <Tippy content="Add movies">
      <button onClick={CreateRoomDiv}><AddCircleOutlineIcon/></button>
    </Tippy>
    </div>}
    {boxState &&
        <Box display={display} filePath={false}/>
    }
    {ind>0 && <Info
      img={movies[ind].poster}
      ep={movies[ind].episode}
      movieName={movies[ind].movieName}
      Urls={movies[ind].movieUrl}
      rating={movies[ind].ratings}
      year={movies[ind].year}
      genre={movies[ind].genres}
      plotOutline={movies[ind].plotOutline}
      display={display}
    />}
    </div>
  </>
}

export default Private;