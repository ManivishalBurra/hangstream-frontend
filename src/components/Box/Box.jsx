import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';
import { BASE_URL } from '../../constants/index';
import { UserRoom } from '../../userContext/userdetails'
import { filePathMovie } from '../../userContext/userdetails'
import DescriptionIcon from '@material-ui/icons/Description';
import { ToastContainer, toast } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import SearchIcon from '@material-ui/icons/Search';
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
    function StreamSubmit(e) {
        console.log(e);
        e.preventDefault();
        const roomid = uuidv4();
        axios.post(`${BASE_URL}/home/roomstream`, { url: url, ratings: ratings, movieID: movieID, year: year, plotOutline: plotOutline, genres: genres, movieName: movieName, banner: banner, roomid: roomid, id: tokenId, source: "admin" }).then((res) => {
            if (res.data) {
                setRoomId(roomid);
                history.push(`/room/${roomid}`);
            }
        })

    }

    const [filePath, setFilePath] = useState(false);
    const { videoFilePath, setVideoFilePath } = useContext(filePathMovie);
    const handleVideoUpload = (event) => {
        setVideoFilePath(window.URL.createObjectURL(event.target.files[0]));
        props.display(false)
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
    }

    function GiveSuggestions(e) {
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
                    alert("chi")
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
                setGenres(...genre);
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
    return (
        <div className="login-main box-main center backdrop-blur-black">
            <div className="login-box center column">
                {props.filePath ?
                    <>
                        <label for="file-upload" class="custom-file-upload">
                            Choose local file <DescriptionIcon />
                            <input type="file" onChange={handleVideoUpload} id="file-upload" />
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
                            placeholder="Movie url"
                            value={url}
                            onChange={(e) => { setUrl(e.target.value); setBanner(e.target.value) }}
                            label="Drive url"
                        />
                        <button id="Submit-btn" onClick={StreamSubmit} disabled={enable}>Stream now</button>
                        <a>or</a>
                        <button id="Submit-btn" style={{ marginTop: "10px" }} onClick={StreamFile}>Stream by filepath</button>

                    </form>}
                <CloseIcon className="close-btn" onClick={() => { props.display(false) }} />
            </div>
            {show && <div className="suggestions" style={show?{transition: "0.5s",width:"450px"}:{transition: "0.5s",width:"0"}}>
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