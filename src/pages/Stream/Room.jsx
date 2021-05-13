import React, { useState, useEffect, useContext,useRef } from 'react';
import { useHistory } from "react-router-dom";
import Navbar from '../../components/Navbar/navbar';
import io from 'socket.io-client';
import SendIcon from '@material-ui/icons/Send';
import { UserRoom } from '../../userContext/userdetails'
import {BASE_URL} from '../../constants/index'
import ReactScrollableFeed from 'react-scrollable-feed'
import ReactPlayer from 'react-player/youtube'
import "../../css/room.css"
import axios from 'axios';
import receive from "../../sounds/sendmessage.mp3"
import send from "../../sounds/recievemessage.mp3"

const socket = io(BASE_URL);


const Room = (props) => {
    const history = useHistory();
    var { roomId, setRoomId } = useContext(UserRoom);
    const roomid = props.match.params.roomid;
    const tokenId = localStorage.getItem("tokenId");
    const [banner,setBanner] = useState({});
    const [play,setPlay] = useState(false)
    const [time,setTime] = useState(0);
    useEffect(() => {
        if (!tokenId) {
            setRoomId(roomid);
            history.push("/");
        }
        if (roomid !== roomId) {
            setRoomId(roomid);
            history.push(`/home/${tokenId}`);
        }
        axios.post(`${BASE_URL}/home/getinfobyroomid`,{roomid:roomId}).then((res)=>{

            if(res.data){
              setBanner({...res.data[0]});
              console.log(banner);
            }
            else{
              history.push("/"); 
            }
          })
    }, []);
    
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    // const [userTime,setUserTime] = useState(0);
    const [syncTime,setSyncTime] = useState([]);
    var arr=[];

    var user = localStorage.getItem("tokenId");
    useEffect(() => {
        socket.on("message", payload => {
            console.log(chat, "chat");
            console.log(payload, "payload");
            if(payload.user===tokenId)
            {
               var msg = new Audio(send);  
               console.log(msg);
                msg.play();
            }
            else{
               var msg = new Audio(receive);  
               console.log(msg);
                msg.play();
            }
            setChat([...chat, payload]);
            console.log(chat,"chat");
        })

        return () => {
            socket.off("message");
        };
    });
    useEffect(()=>{
        socket.on("time",payload=>{
            console.log(payload,"payload");
        })
    },[])
    function SendTime(time){
        console.log({time,user});
    }

    const sendMessage = (e) => {
        e.preventDefault();
        console.log(message);
        socket.emit('message', { message, user })
        setMessage("");
    }

    const AlwaysScrollToBottom = () => {
        const elementRef = useRef();
        useEffect(() => elementRef.current.scrollIntoView());
        return <div ref={elementRef} />;
      };

    function Progress(progress){
        setPlay(true);
        var userTime=Math.floor(progress.playedSeconds);
        console.log( {userTime,user} );
        socket.emit('time',  {userTime,user} );
    }

    function Duration(duration){
        console.log(duration);
    }

    function End(){
        alert("videoended")
    }

    return (
        <>
            <Navbar />
            <div className="row chat-main">
                <div className="col-lg-9 stream-area">
                    <div className="video-main">
                    <ReactPlayer  
                    width="100%" 
                    height="100%" 
                    url={banner.movieUrl}
                    controls
                    playing={play}    
                    progressInterval="4000"
                    onProgress={Progress}
                    onDuration={Duration}
                    onEnded={End}
                    />
                    </div>
                </div>

                <div className="col-lg-3 chat-area">
                    <div className="chat-box column">
                        <div class="messages" id="msg">
                        
                            {chat.map((chat, index) => {

                                return (<>
                                    {user === chat.user ?
                                        <h6 className="usermsg" style={{ marginLeft: "auto", backgroundColor: "#ffc107" }} key={index}>{chat.message}</h6> :
                                        <h6 className="usermsg" key={index}>{chat.message}</h6>}
                                        <AlwaysScrollToBottom />
                                        </>
                                );

                            })}
                        
                        </div>
                        <div className="messagebox center">

                            <form autocomplete="off" onSubmit={sendMessage}>
                                <input
                                    autoComplete="off"
                                    name="message"
                                    value={message}
                                    onChange={(e) => { setMessage(e.target.value) }}
                                    placeholder="Send a message"
                                />
                                <button type="submit"><SendIcon /></button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
export default Room;