import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';
import { BASE_URL } from '../../constants/index';
import { UserRoom } from '../../userContext/userdetails'
import { filePathMovie } from '../../userContext/userdetails'
import DescriptionIcon from '@material-ui/icons/Description';
import "../../css/box.css"
const Box = (props) => {
    const history = useHistory();
    var { roomId, setRoomId } = useContext(UserRoom);
    const [url, setUrl] = useState("");
    const [movieName, setName] = useState("");
    const [banner, setBanner] = useState("");
    const tokenId = localStorage.getItem("tokenId");
    function StreamSubmit(e) {
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

    const [filePath, setFilePath] = useState(false);
    const {videoFilePath, setVideoFilePath} = useContext(filePathMovie);
    const handleVideoUpload = (event) => {
        setVideoFilePath(window.URL.createObjectURL(event.target.files[0]));
        props.display(false)
    };

    function StreamFile(e){
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
                        <input
                            name="movie url"
                            placeholder="Movie url"
                            value={url}
                            onChange={(e) => {setUrl(e.target.value);setBanner(e.target.value)}}
                            label="Drive url"
                        />
                        <input
                            name="movie name"
                            placeholder="Movie name"
                            value={movieName}
                            onChange={(e) => setName(e.target.value)}
                            label="Drive url"
                        />
                        <button id="Submit-btn" onClick={StreamSubmit}>Stream now</button>
                        <a>or</a>
                        <button id="Submit-btn" style={{ marginTop: "10px" }} onClick={StreamFile}>Stream by filepath</button>

                    </form>}
                <CloseIcon className="close-btn" onClick={() => { props.display(false) }} />
            </div>
        </div>
    );


}

export default Box;