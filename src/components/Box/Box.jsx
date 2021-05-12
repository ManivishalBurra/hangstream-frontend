import React, { useState, useEffect,useContext } from 'react';
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';
import {BASE_URL} from '../../constants/index';
import { UserRoom } from '../../userContext/userdetails'
import "../../css/box.css"
const Box = (props) => {
    const history = useHistory();
    var { roomId, setRoomId } = useContext(UserRoom);
    const [url, setUrl] = useState("");
    const [movieName, setName] = useState("");
    const [banner, setBanner] = useState("");
    const tokenId = localStorage.getItem("tokenId");
    function StreamSubmit(e){
        console.log(e);
        e.preventDefault();
        const roomid = uuidv4();
        axios.post(`${BASE_URL}/home/roomstream`,{url:url,movieName:movieName,banner:banner,roomid:roomid,id:tokenId}).then((res)=>{
            if(res.data){
            setRoomId(roomid);    
            history.push(`/room/${roomid}`);
            }
        })
    }


    return (
        <div className="login-main box-main center backdrop-blur-black">
            <div className="login-box center column">
                <form className="center column">
                    <input
                        name="Drive url"
                        placeholder="Movie url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        label="Drive url"
                    />
                    <input
                        name="Drive url"
                        placeholder="Movie name"
                        value={movieName}
                        onChange={(e) => setName(e.target.value)}
                        label="Drive url"
                    />
                    <input
                        name="Drive url"
                        placeholder="Movie trailer url"
                        value={banner}
                        onChange={(e) => setBanner(e.target.value)}
                        label="Drive url"
                    />
                    <button id="Submit-btn" onClick={StreamSubmit}>Stream now</button>
                </form>
                <CloseIcon className="close-btn" onClick={()=>{props.display(false)}} />
            </div>
        </div>
    );
    

}

export default Box;