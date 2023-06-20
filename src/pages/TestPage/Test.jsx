import React, { useState, useEffect, useContext, useRef } from "react";
import { Theme } from "../../userContext/userdetails";
import * as utils from "../../utils/sockets";
import * as webRtc from "../../utils/webrtc"
import ReactPlayer from "react-player";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import "../../css/room.css";

const Test = (props) => {
  var { theme, setTheme } = useContext(Theme);
  const webSocketRef = useRef(null);
  const localStreamref = useRef(null);
  const peerConnection = useRef([]);
  const peersRef = useRef([]);
  const [localStream, setLocalStream] = useState(false);
  const [peers, setPeers] = useState([]);
  const [userID, setUserID] = useState(uuidv4())

  const customFunc = (event)=>{
    if(event.type==="remote"){
      const remoteStream = event.data[0];
      let duplicate = false
      peersRef.current.forEach((peer)=>{
        if(remoteStream.id===peer.stream.id){
          duplicate = true
        }
      })
      if(duplicate)return
      const newPeer = { peerConnection, stream: remoteStream };
      setPeers((prevPeers) => [...prevPeers, newPeer]);
      peersRef.current.push({ peerConnection, stream: remoteStream });
      console.log(peersRef, "peersref")
    }
    else if(event.type==="local"){
      setLocalStream(true)
    }
  }

  useEffect(async ()=>{
    await webRtc.startLocalStream(localStreamref, customFunc)
    await webRtc.startWebSocket(webSocketRef, localStreamref, peerConnection, userID, customFunc)
    console.log(localStreamref, "current strream")
  },[])


  const createOffer = async() => {
    axios.get(`http://localhost:6303/getsocketusers`).then(async (res)=>{
      res.data.map(async (data)=>{
        if(data.user != userID){
          await webRtc.connectPeer(webSocketRef, localStreamref, peerConnection, userID, data.user, customFunc)   
        }
      })
    })
    // await webRtc.connectPeer(webSocketRef, localStreamref, peerConnection, userID, customFunc)
  }
  const update = ()=>{
    console.log(peers, 'remote anta')
    console.log(peerConnection, "peerconnection")
  }

  return (
    <>
      {/* <Navbar /> */}
      <div className="center chat-main" id={theme + "-main"}>
        <div className="center" style={{ width:"800px", height:"800px"}}>
        {localStream &&
          <div style={{display:"flex",flexDirection:"column"}}>
          <ReactPlayer
            playing
            height="200px"
            muted
            width="200px"
            url={localStreamref.current}
          />
          <p>{localStreamref.current.id}</p>
          </div>
          }
          {peers && peers.map((values)=>{
              return(  
                <div style={{display:"flex",flexDirection:"column"}}>
                <ReactPlayer
                playing
                height="400px"
                width="400px"
                url={values.stream}
                key={values.stream.id}
              />
              <p>{values.stream.id}</p>
              </div>
              )
            })
          }
          <button onClick={createOffer}>create offer</button>
          <button onClick={update}>udpate offer</button>
        </div>
      </div>
    </>
  );
};
export default Test;
