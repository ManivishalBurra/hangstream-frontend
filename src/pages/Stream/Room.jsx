import React, { useState, useEffect, useContext,useRef } from 'react';
import { useHistory } from "react-router-dom";
import Navbar from '../../components/Navbar/navbar';
import io from 'socket.io-client';
import SendIcon from '@material-ui/icons/Send';
import { UserRoom } from '../../userContext/userdetails'
import {BASE_URL} from '../../constants/index'
import ReactPlayer from 'react-player'
import "../../css/room.css"
import axios from 'axios';
import receive from "../../sounds/sendmessages.wav"
import send from "../../sounds/sendmessages.wav"

const Room = (props) => {
    const history = useHistory();
    var { roomId, setRoomId } = useContext(UserRoom);
    const roomid = props.match.params.roomid;
    const tokenId = localStorage.getItem("tokenId");
    const [banner,setBanner] = useState({});
    const [play,setPlay] = useState(false)
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
    
    
    

    var user = localStorage.getItem("tokenId");
    const socketRef = useRef()
    useEffect(() => {

        socketRef.current = io.connect(BASE_URL);

        socketRef.current.on("message", payload => {

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
        })

        return () => socketRef.current.disconnect()
        
    },[chat]);


    const sendMessage = (e) => {
        e.preventDefault();
        console.log(message);
        socketRef.current.emit('message', { message, user })
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
        var d= new Date();
        var hour = d.getHours().toString();
        var min = d.getMinutes().toString();
        var sec = d.getSeconds().toString();
        if(hour.length<2)
        {
         hour="0"+hour;
        }
        if(min.length<2)
        {
         min="0"+min;
        }
        if(sec.length<2)
        {
         sec="0"+sec;
        }
        var date = hour+min+sec;
        console.log({userTime,user,date});  
        socketRef.current.emit('time', {userTime,user,date} );
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
                    progressInterval={4000}
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