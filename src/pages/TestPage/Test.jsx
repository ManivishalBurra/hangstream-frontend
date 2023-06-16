import React, { useState, useEffect, useContext, useRef } from "react";
import { Theme } from "../../userContext/userdetails";
import { SOCKET_URL } from "../../constants/index";
import * as utils from "../../utils/sockets";
import * as webRtc from "../../utils/webrtc"
import ReactPlayer from "react-player";
import "../../css/room.css";

const Test = (props) => {
  var { theme, setTheme } = useContext(Theme);
  const webSocketRef = useRef(null);
  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const localStreamref = useRef(null)
  const [userID, setUserID] = useState(props.match.params.userid)
  const servers = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
  const peerConnection = useRef(null)

  useEffect(async ()=>{
    await startLocalStream()
    await startWebSocket()
  },[])

  const startLocalStream = async()=>{
    const constraints = {
      video: false,
      audio: false
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
          localStreamref.current = stream
          setLocalStream(stream)
          return stream
        })
        .catch(error => {
            console.error('Error accessing media devices.', error);
        }); 
      })
      .catch(error => {
          console.error(error)
        }
      )
  }

  const startWebSocket = async()=>{
    utils.Connect(webSocketRef,"test")
    webSocketRef.current.onmessage = async(m) => {
      const payload = JSON.parse(m.data);
      switch (payload.type) {
        case "webrtc-offer":
          if(payload.user === userID)break;
          await init(localStreamref.current)
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(payload.data))
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          utils.SendToSockets({data: answer, type: "webrtc-answer", room:"test", user:userID}, webSocketRef)
          console.log(payload, "webrtc-offer")
          break
        case "webrtc-answer":
          if(payload.user === userID)break;
          if(!peerConnection.current.currentRemoteDescription)await peerConnection.current.setRemoteDescription(payload.data)
          console.log(payload, "webrtc-answer")
          break;
        case "ice-candidates":
          if(payload.user === userID && !peerConnection.current)break;
            await peerConnection.current.addIceCandidate(payload.data).then(()=>{
              console.log('ICE candidate added successfully.');
            })
            .catch(error =>{
              console.error('Failed to add ICE candidate:', error);
            })
          console.log(payload, "ice-candidates")
          break;
          
      }
      return () => {
        if (webSocketRef.current) {
          webSocketRef.current.close();
        }
      };
    }
  }

  const init = async(localStream)=>{
    peerConnection.current = new RTCPeerConnection(servers);
    
    localStream.getTracks().forEach((track)=>{
      peerConnection.current.addTrack(track, localStream)
    })

    peerConnection.current.onicecandidate = (event)=>{
      if(event.candidate){
        utils.SendToSockets({data: event.candidate, type: "ice-candidates", room:"test", user:userID}, webSocketRef)
      }
    }
    
    peerConnection.current.ontrack = async(event) => {
      const [remoteStream] = event.streams;
      setRemoteStream(remoteStream);
    }

    peerConnection.current.onconnectionstatechange = () => {
      const connectionState = peerConnection.current.connectionState;
      console.log(`Connection state changed: ${connectionState}`);
      // Handle the connection state change accordingly
    };
  }

  const createOffer = async() => {
    await init(localStream)
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    utils.SendToSockets({data: offer, type: "webrtc-offer", room:"test", user:userID}, webSocketRef)
  }

  // const logs = async() => {
  //   console.log(peerConnection, "peerconnection")
  //   peerConnection.current.ontrack = async(event) => {
  //     console.log(event)
  //   }
  //   localStream.getTracks().forEach((track)=>{
  //     console.log(track, "local stream's tracks here")
  //   })
  //   console.log(await peerConnection.current.connectionState,"peerconnection-connectionState")
  //   console.log(await peerConnection.current.iceConnectionState,"peerconnection-iceConnectionState")
  //   console.log(await peerConnection.current.iceGatheringState,"peerconnection-iceGatheringState")
  //   console.log(await peerConnection.current.pendingLocalDescription,"peerconnection-pendingLocalDescription")
  //   console.log(await peerConnection.current.signalingState,"peerconnection-signalingState")
  // }

  return (
    <>
      {/* <Navbar /> */}
      <div className="center chat-main" id={theme + "-main"}>
        <div className="center" style={{ width:"800px", height:"800px"}}>
        {localStream &&
          <ReactPlayer
            playing
            height="400px"
            muted
            width="400px"
            url={localStream}
          />
          }
          {remoteStream &&
          <ReactPlayer
            playing
            height="400px"
            width="400px"
            url={remoteStream}
          />
          }
          <button onClick={createOffer}>create offer</button>
        </div>
      </div>
    </>
  );
};
export default Test;
