import React, { useState, useEffect, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Menu, Dropdown, Button } from "antd";
import "antd/dist/antd.css";
import { toast } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import Navbar from "../../components/Navbar/Navbar";
import SendIcon from "@material-ui/icons/Send";
import ChatIcon from "@material-ui/icons/Chat";
import { UserRoom } from "../../userContext/userdetails";
import { Theme } from "../../userContext/userdetails";
import { filePathMovie } from "../../userContext/userdetails";
import { filePathSub } from "../../userContext/userdetails";
import { BASE_URL, SOCKET_URL } from "../../constants/index";
import ReactPlayer from "react-player";
import Box from "../../components/Box/Box";
import "../../css/room.css";
import axios from "axios";
import receive from "../../sounds/receive.mp3";
import send from "../../sounds/sentmessage.mp3";
import { UpCircleOutlined,WechatOutlined,VideoCameraOutlined } from '@ant-design/icons';
import AudioComp from "../../components/AudioCall/Audio"
const duration = require("pendel");

const Test = (props) => {
  const history = useHistory();
  var { theme, setTheme } = useContext(Theme);
  var { roomId, setRoomId } = useContext(UserRoom);
  const { videoFilePath, setVideoFilePath } = useContext(filePathMovie);
  const { subFilePath, setSubFilePath } = useContext(filePathSub);
  const roomid = props.match.params.roomid;
  const tokenId = localStorage.getItem("tokenId");
  const [banner, setBanner] = useState({});
  const [userData, setUserData] = useState({});
  var [typing, setTyping] = useState("");
  const [play, setPlay] = useState(false);
  const [chatOpen, setChatOpen] = useState("chat-area-close");
  const [showChat,setShowChat] = useState(true)
  const [boxState, setBoxState] = useState(false);
  var playTime = "";
  var localTime = "";
  const myvideo = useRef(null);
  var user = localStorage.getItem("tokenId");
  const webSocketRef = useRef(null);
  const webRTCref = useRef(null);
  var x;
  const [localStream, setLocalStream] = useState()
  let peerConnection = useRef(null);
  useEffect(()=>{
    
    let constraints = {
      'video': false,
      'audio': false
    }
    navigator.mediaDevices.enumerateDevices()
      .then(event => {
        event.map((item)=>{
          switch(item.kind){
            case 'audiooutput':
              constraints.audio = {'echoCancellation': true};
              break;
            case 'videoinput':
              constraints.video = true;
              break;
          }
        })
        navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            console.log('Got MediaStream:', stream);
            setLocalStream(stream)
            webRTCref.current.srcObject = stream;
            const track = stream.getAudioTracks()[0];
            console.log(track)
        })
        .catch(error => {   
            console.error('Error accessing media devices.', error);
        }); 
      })
      .catch(error => {
          console.error(error)
        }
      )
      
  },[])

  // useEffect(()=>{
  //   const URL = `ws://${SOCKET_URL}/ws/${roomid}/${tokenId}`;
  //   webSocketRef.current = new WebSocket(URL);

  //   webSocketRef.current.onopen = () => {
  //     console.log('WebSocket connection established');
  //     // SendToSockets({data: resp.data[0].username, room: roomid, user: tokenId, profilepic: "", type: "join"})
  //   };
  // },[])

  const CreateOffer = async()=>{
      const configuration = {
        iceServers:[
          {urls:["stun:stun.l.google.com:19302"]}
        ]};
      peerConnection = new RTCPeerConnection(configuration);

      const offer = await peerConnection.createOffer();
      console.log(offer);

      await peerConnection.setLocalDescription(offer);
      


      peerConnection.onicecandidate = (async(event)=>{
        if(event.candidate){
          console.log(peerConnection.localDescription, "local description")
        }
      })
  }

const UpdateOffer = async() => {

  console.log(await peerConnection.connectionState)
  console.log(await peerConnection.iceConnectionState)
  console.log(await peerConnection.iceGatheringState)
  console.log(await peerConnection.pendingLocalDescription)
}
  return (
    <>
      {/* <Navbar /> */}
      <div className="center chat-main" id={theme + "-main"}>
        <div className="center" style={{ width:"800px", height:"800px"}}>
          <video ref={webRTCref}  autoPlay playsInline controls/>
          <button onClick={CreateOffer}>create offer</button>
          <button onClick={UpdateOffer}>update offer</button>
        </div>
      </div>
    </>
  );
};
export default Test;
