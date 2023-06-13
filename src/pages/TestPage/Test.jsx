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
import * as utils from "../../utils/sockets";
import ReactPlayer from "react-player";
import Box from "../../components/Box/Box";
import "../../css/room.css";
import axios from "axios";
import receive from "../../sounds/receive.mp3";
import send from "../../sounds/sentmessage.mp3";
import { UpCircleOutlined,WechatOutlined,VideoCameraOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
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
  const localStreamref = useRef(null);
  const remoteStreamref = useRef(null);
  var x;
  let peerConnection;
  const [userID, setUserID] = useState(props.match.params.userid)
  const servers = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
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
            localStreamref.current.srcObject = stream;
            const track = stream.getAudioTracks()[0];
            console.log(track, "Media Tracks")
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

  useEffect(()=>{
    utils.Connect(webSocketRef, "test")
    
    webSocketRef.current.onmessage = async(m) => {
      const payload = JSON.parse(m.data);
      switch (payload.type) {
        case "webrtc-offer":
          if(payload.user === userID)break;
          await init()
          await peerConnection.setRemoteDescription(new RTCSessionDescription(payload.data))
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          utils.SendToSockets({data: answer, type: "webrtc-answer", room:"test", user:userID}, webSocketRef)
          break
        case "webrtc-answer":
          if(payload.user === userID)break;
          if(!peerConnection.currentRemoteDescription)await peerConnection.setRemoteDescription(payload.data)
          break;
        case "ice-candidates":
          
          if (peerConnection.remoteDescription) {
              await peerConnection.addIceCandidate(payload.data).then(()=>{
                console.log('ICE candidate added successfully.');
              })
              .catch(error =>{
                console.error('Failed to add ICE candidate:', error);
              })
          }
          
      }
      return () => {
        if (webSocketRef.current) {
          webSocketRef.current.close();
        }
      };
    }
  },[SOCKET_URL])
const init = async() => {
      peerConnection = new RTCPeerConnection(servers);

      remoteStreamref.current.srcObject = new MediaStream;

      localStreamref.current.srcObject.getTracks().forEach((track)=>{
        console.log(localStreamref.current.srcObject, "ref src")
        peerConnection.addTrack(track, localStreamref.current.srcObject)
        console.log(track, "track added")
      })
      
      peerConnection.ontrack = (event) => {
        const [remoteStream] = event.streams;
        remoteStreamref.current.srcObject = remoteStream;
        console.log(remoteStream, "track remotes")
      }

      peerConnection.onicecandidate = (event)=>{
        if(event.candidate){
          utils.SendToSockets({data: event.candidate, type: "ice-candidates", room:"test", user:userID}, webSocketRef)
        }
      }

      peerConnection.onconnectionstatechange = () => {
        const connectionState = peerConnection.connectionState;
        console.log(`Connection state changed: ${connectionState}`);
        // Handle the connection state change accordingly
      };
}

const CreateOffer = async()=>{
    await init()
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    utils.SendToSockets({data: offer, type: "webrtc-offer", room:"test", user:userID}, webSocketRef)
}

const UpdateOffer = async() => {
  console.log(await peerConnection.connectionState)
  console.log(await peerConnection.iceConnectionState)
  console.log(await peerConnection.iceGatheringState)
  console.log(await peerConnection.pendingLocalDescription)
  console.log(await peerConnection.signalingState)
  console.log(await peerConnection)
  console.log(localStreamref.current.srcObject, remoteStreamref.current.srcObject)
}
  return (
    <>
      {/* <Navbar /> */}
      <div className="center chat-main" id={theme + "-main"}>
        <div className="center" style={{ width:"800px", height:"800px"}}>
          <video ref={localStreamref}  autoPlay playsInline controls/>
          <video ref={remoteStreamref}  autoPlay playsInline controls/>
          <button onClick={CreateOffer}>create offer</button>
          <button onClick={UpdateOffer}>create offer</button>
        </div>
      </div>
    </>
  );
};
export default Test;
