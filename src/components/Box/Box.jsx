import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';
import { BASE_URL } from '../../constants/index';
import { UserRoom } from '../../userContext/userdetails'
import {filePathSub} from "../../userContext/userdetails";
import { filePathMovie } from '../../userContext/userdetails'
import DescriptionIcon from '@material-ui/icons/Description';
import { ToastContainer, toast } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import SearchIcon from '@material-ui/icons/Search';
import { default as toWebVTT } from "srt-webvtt";
import "../../css/box.css"
const Box = (props) => {
    const history = useHistory();
    var { roomId, setRoomId } = useContext(UserRoom);
    const [suggestions, setSuggestions] = useState([
        {i:{imageUrl:"https://cdn.dribbble.com/users/2015153/screenshots/6592242/progess-bar2.gif"},
        l:"please wait",
        }
    ]);
    const [url, setUrl] = useState("");
    const [enable,setEnable] = useState(true);
    const [movieName, setName] = useState("");
    const [banner, setBanner] = useState("");
    const tokenId = localStorage.getItem("tokenId");
    const [year, setYear] = useState("");
    const [movieID, setMovieID] = useState("");
    const [plotOutline, setPlotOutline] = useState("");
    const [ratings, setRatings] = useState("");
    const [genres, setGenres] = useState([]);
    const [show,setShow] = useState(false);
    const [image,setImage]=useState("");
    const [movies,setMovies] = useState([]);
    const [mov,setmov]=useState([]);
    const [exist,setExist]=useState(false);
    const [episode,setEpisode]=useState("");
    useEffect(()=>{
            axios.get(`${BASE_URL}/movies/movieslist`).then(async (res) => {

                if (res.data) {
                  setMovies(res.data);
                    
                }
              });
    },[]);
    function StreamSubmit(e) {
        console.log(e);
        e.preventDefault();
        const roomid = uuidv4();
        axios.post(`${BASE_URL}/home/roomstream`, {url: url,roomid:roomid, ratings: ratings, movieID: movieID, year: year, plotOutline: plotOutline, genres: genres, movieName: movieName, banner: banner,id: tokenId,image:image ,source: "admin" }).then((res) => {
            if (res.data) {
                setRoomId(roomid);
                history.push(`/room/${roomid}`);
            }
        })

    }

    const [filePath, setFilePath] = useState(false);
    const {videoFilePath, setVideoFilePath } = useContext(filePathMovie);
    const {subFilePath, setSubFilePath } = useContext(filePathSub);
    const handleVideoUpload = (event) => {
        
        setVideoFilePath(window.URL.createObjectURL(event.target.files[0]));
    };
    const handleSubUpload = (event) => {
        console.log(event)
        try {
            async function asyncCall(){
            const textTrackUrl = await toWebVTT(event.target.files[0]); // this function accepts a parameer of SRT subtitle blob/file object
            setSubFilePath(textTrackUrl)
            console.log(textTrackUrl)
            props.display(false)
            }
            asyncCall()
            // video.textTracks[0].mode = "show"; // Start showing subtitle to your track
          } catch (e) {
            console.error(e.message);
          }
        
    };
    function StreamFile(e) {
        setName("");
        setBanner("");
        setUrl("");
        console.log(e);
        e.preventDefault();
        const roomid = uuidv4();
        axios.post(`${BASE_URL}/home/roomstream`, { url: url, movieName: movieName, banner: banner, roomid: roomid, id: tokenId, source: "admin" }).then((res) => {
            if (res.data) {
                setRoomId(roomid);
                history.push(`/room/${roomid}`);
            }
        })
    }
    function UpdateMovieName(e) {
        setName(e.target.value);
        var m=movies.filter((list)=>{
            var x=list.movieName.replace(/\s+/g, '').trim().toLowerCase();
            return x.includes(e.target.value.replace(/\s+/g, '').trim().toLowerCase());
        })
        setmov(m);
    }

    function GiveSuggestions(e) {
        setExist(false);
        e.preventDefault();
        const options = {
            method: 'GET',
            url: 'https://imdb8.p.rapidapi.com/title/auto-complete',
            params: { q: movieName },
            headers: {
                'x-rapidapi-key': 'fe88b7cda7mshfee26075322cbb7p1eb01cjsn302c1761040b',
                'x-rapidapi-host': 'imdb8.p.rapidapi.com'
            }
        };
        if (movieName !== "") {
            axios.request(options).then(function (response) {
                var x=response.data.d;
                setSuggestions(x);
                console.log(x);
                if(x.length!==0)
                {
                    if(suggestions.length!==0)
                    {
                    console.log(suggestions);
                    setSuggestions(x);
                    setShow(true);
                    }
                    else{
                        setSuggestions([suggestions,...x]);
                        console.log(suggestions);
                    }
                }
            }).catch(function (error) {
                console.error(error);
            });
        }
        else{
            toast.error(`Movie name is empty`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                });
        }
    }
    function UpdateMovieDB(e) {
        var y = String(suggestions[e.target.id].y);
        setYear(y);
        var l = suggestions[e.target.id].l;
        setName(l);
        var id = String(suggestions[e.target.id].id.toString());
        setMovieID(id);
        var img=""
        if(suggestions[e.target.id].i)img = suggestions[e.target.id].i.imageUrl;
        setImage(img);
        if (id.substring(0, 2) !== "tt") {
            setMovieID("");
            setYear("");
        }
        else {
            var options = {
                method: 'GET',
                url: 'https://imdb8.p.rapidapi.com/title/get-overview-details',
                params: { tconst: id, currentCountry: 'US' },
                headers: {
                    'x-rapidapi-key': 'fe88b7cda7mshfee26075322cbb7p1eb01cjsn302c1761040b',
                    'x-rapidapi-host': 'imdb8.p.rapidapi.com'
                }
            };
            if(id.includes("tt"))
            {
            axios.request(options).then(function (response) {
                console.log(response.status);
                var genre = response.data.genres;
                setGenres(genre);
                var plot = response.data.plotOutline.text;
                setPlotOutline(plot);
                var rating = response.data.ratings.rating;
                setRatings(rating)
                console.log({ y, l, id, genre, plot, rating });
                setEnable(false);
            }).catch(function (error) {
                console.error(error);
            });
            }
            else if(id!=="")
            {
                setGenres(["N/A"]);
                setPlotOutline("N/A");
                setRatings("N/A");
                setEnable(false);
            }

        }
    }


    function UpdateEpisode(e) {
        setName(e.target.innerHTML)
        setMovieID(e.target.id);
        setExist(true);
        setEnable(false)
    }


    function PrivateUpload(e){
        e.preventDefault();
        console.log(genres,"genre");
        if(!exist){
        axios.post(`${BASE_URL}/private/upload`, { url: url, ratings: ratings, movieID: movieID, year: year, plotOutline: plotOutline, genres: genres, movieName: movieName, banner: banner,id: tokenId,image:image ,source: "admin" }).then((res) => {
            if (res.data) {
                alert("uploaded");
                props.display(false);
            }
        })
        }
        else{
            axios.post(`${BASE_URL}/private/uploadexist`, { url: url,episode:episode,movieID: movieID}).then((res) => {
                if (res.data) {
                    alert("uploaded");
                    props.display(false);
                }
            })  
        }   
    }




    return (
        <div className="login-main box-main center backdrop-blur-black">
            <div className="login-box center column">
                {exist && <h6>Already exists in our DB,add an episode if you want to...</h6>}
                {props.filePath ?
                    <>
                        <label for="file-upload" class="custom-file-upload">
                            Choose local file <DescriptionIcon />
                            <input type="file" onChange={handleVideoUpload} id="file-upload" />
                        </label>
                        <label for="sub-upload" class="custom-file-upload">
                            Choose subtitle file <DescriptionIcon />
                            <input type="file" onChange={handleSubUpload} id="sub-upload" />
                        </label>

                    </>
                    :

                    <form className="center column">
                        <div className="movie-name center">
                        <input
                            name="movie name"
                            placeholder="Movie name"
                            value={movieName}
                            onChange={UpdateMovieName}
                            label="Drive url"
                        />
                        <button onClick={GiveSuggestions}><SearchIcon /></button>
                        </div>
                        <input
                            name="movie url"
                            placeholder="Url"
                            value={url}
                            onChange={(e) => { setUrl(e.target.value); setBanner(e.target.value) }}
                            label="Drive url"
                        />
                        {exist &&
                            <input
                            name="episode"
                            placeholder="episode no."
                            value={episode}
                            onChange={(e) => { setEpisode(e.target.value);}}
                            />
                        }
                        {!props.private?<><button id="Submit-btn" onClick={StreamSubmit} disabled={enable}>Stream now</button>
                        <a>or</a>
                        <button id="Submit-btn" style={{ marginTop: "10px" }} onClick={StreamFile}>Stream by filepath</button></>
                        :<button id="Submit-btn" onClick={PrivateUpload} disabled={enable}>Upload</button>
                        }
                        
                    </form>}
                <CloseIcon className="close-btn" onClick={() => { props.display(false) }} />
            </div>
            {show ? <div className="suggestions" style={show?{transition: "0.5s",width:"450px"}:{transition: "0.5s",width:"0"}}>
                {suggestions.map((list, index) => {
                    return <>
                        <div className="suggest-main center column">
                            <div className="suggest-img center">
                                {list.i && <img src={list.i.imageUrl} alt={list.l} />}
                            </div>
                            <div className="updateDB-btn" onClick={UpdateMovieDB}>
                                {list.l && <p id={index}>{list.l}</p>}
                            </div>
                        </div>
                    </>
                })}
            </div>:
            <div className="suggestions" style={mov.length>0?{transition: "0.5s",width:"450px"}:{transition: "0.5s",width:"0"}}>
                {mov.map((list, index) => {
                    return <>
                        <div className="suggest-main center column">
                            <div className="suggest-img center">
                                 <img src={list.poster} alt={list.movieName} />
                            </div>
                            <div className="updateDB-btn" onClick={UpdateEpisode}>
                                <p id={list.movieID}>{list.movieName}</p>
                            </div>
                        </div>
                    </>
                })}
            </div>
            }

            <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
        </div>
    );


}

export default Box;