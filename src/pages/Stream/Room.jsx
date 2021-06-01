import React, { useState, useEffect, useContext, useRef } from 'react';
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import Navbar from '../../components/Navbar/navbar';
import io from 'socket.io-client';
import SendIcon from '@material-ui/icons/Send';
import { UserRoom } from '../../userContext/userdetails'
import { BASE_URL } from '../../constants/index'
import ReactPlayer from 'react-player'
import "../../css/room.css"
import axios from 'axios';
import receive from "../../sounds/sendmessages.wav"
import send from "../../sounds/sendmessages.wav"
const duration = require("pendel");


const Room = (props) => {
    const history = useHistory();
    var { roomId, setRoomId } = useContext(UserRoom);
    const roomid = props.match.params.roomid;
    const tokenId = localStorage.getItem("tokenId");
    const [banner, setBanner] = useState({});
    const [play, setPlay] = useState(true)
    const [userData, setUserData] = useState({});
    var [typing,setTyping] = useState("");
    var playTime="";
    var localTime="";
    const myvideo = useRef(null);
    const socket = io.connect(BASE_URL);
    var user = localStorage.getItem("tokenId");
    var x="";
    useEffect(async () => {
        if (!tokenId) {
            setRoomId(roomid);
            history.push("/");
        }
        else if (roomid !== roomId) {
            setRoomId(roomid);
            history.push(`/home/${tokenId}`);
        }
        else {
            axios.post(`${BASE_URL}/home/getinfobyroomid`, { roomid: roomId }).then(async (res) => {

                if (res.data) {
                    setBanner({ ...res.data[0] });
                    console.log(banner,"banner");
                    var resp = await axios.post(`${BASE_URL}/home/getinfo`, { id: tokenId });
                    setUserData({...resp.data[0]});
                    x={...resp.data[0]};
                    var userName =x.username;
                    
                    socket.emit("join_room", { userName, roomId });
                }
                else {
                    history.push("/");
                }
            })
        }
    }, []);

    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);

    useEffect(() => {

        socket.on("welcome", payload => {
            if(payload===x.username)
            {
                toast.dark(`${payload}, welcome to the Hangstream`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    });
            }
            else{
            toast.warn(`${payload} has joined the room`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                });
            }
        })

    },[]);


    useEffect(() => {

        socket.on("message", payload => {  

            if (payload.user === tokenId) {
                var msg = new Audio(send);
                console.log(msg);
                msg.play();
            }
            else {
                var msg = new Audio(receive);
                console.log(msg);
                msg.play();
            }

            setChat(chat=>[...chat, payload]);
            setTyping("");
        })

    }, []);

    useEffect(()=>{
        socket.on('timing',payload=>{
           
        if(user!==payload.ID){
           
           playTime= myvideo.current.getCurrentTime();
           var d = new Date();
           localTime=d.toLocaleTimeString();
           var differenceInTime = duration.time(localTime,payload.localTime);
           var syncDifference = Number(differenceInTime.minutes)*60+Number(differenceInTime.seconds);
           var streamerPlayTime = Number(payload.playTime)+syncDifference;
           console.log(Math.abs(streamerPlayTime-playTime));
           if(Math.abs(streamerPlayTime-playTime)>0.7){
           myvideo.current.seekTo(streamerPlayTime,'seconds');
           }
        }
        })
    })

    function TypeMessage(e){
        setMessage(e.target.value);
        var name=userData.username; 

        if(message.length===1){
            setTyping("");
        }
        else{
        socket.emit("typing",{name,user,roomId});
        }
    }
    useEffect(()=>{
        socket.on("typing",payload=>{
            
            if(payload.user!==tokenId){
             var str=payload.name.toLowerCase().split(" ");   
             setTyping(str[0] + " is typing...");
             setTimeout(function(){ setTyping("") }, 2000);
            }

        })
        
    },[])

    const sendMessage = (e) => {
        e.preventDefault();
        console.log(message);
        var profilepic=userData.profilepic;
        socket.emit('message', { message, user ,roomId,profilepic})
        setMessage("");
        setTyping("");
    }

    const AlwaysScrollToBottom = () => {
        const elementRef = useRef();
        useEffect(() => elementRef.current.scrollIntoView());
        return <div ref={elementRef} />;
    };

    function Progress(progress) {
        setPlay(true);
        playTime = progress.playedSeconds;
        
        var d = new Date();
        localTime=d.toLocaleTimeString();
        
        console.log(banner.id);
        var ID = banner.id;
        if(tokenId===banner.id){
        socket.emit('timing',{playTime,roomId,localTime,ID})
        }
        
    }

    function Duration(duration) {
        console.log(duration);
    }

    function End() {
        axios.post(`${BASE_URL}/home/roomstream`,{url:"",movieName:"",banner:banner,roomid:"",id:tokenId}).then((res)=>{
            if(res.data){
            history.push(`/home/${tokenId}`);
            }
        })
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
                            ref={myvideo}
                            url={banner.movieUrl}
                            controls
                            playing={play}
                            progressInterval={3000}
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
                                        <div className="chat-comb"><h6 className="usermsg" style={{ marginLeft: "auto", backgroundColor: "#ffc107" }} key={index}>{chat.message}</h6>
                                        <img src={chat.profilepic} /></div> :
                                        <div className="chat-comb"><img src={chat.profilepic} /><h6 className="usermsg" key={index}>{chat.message}</h6></div>}
                                    <AlwaysScrollToBottom />
                                </>
                                );

                            })}
                            <h6 className="typing">{typing}</h6>
                        </div>

                        <div className="messagebox center">

                            <form autocomplete="off" onSubmit={sendMessage}>
                                <input
                                    autoComplete="off"
                                    name="message"
                                    value={message}
                                    onChange={TypeMessage}
                                    placeholder="Send a message"
                                />
                                <button type="submit"><SendIcon /></button>
                            </form>
                        </div>
                    </div>

                </div>
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
        </>
    );
}
export default Room;