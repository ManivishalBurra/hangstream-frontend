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
  const [toUserID, setToUserID] = useState(props.match.params.touserid)
  const [roomID, setroomID] = useState(props.match.params.roomid)
  const servers = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
  const peerConnection = useRef(null)
  const remPeerConn = useRef(null)
  const dataChannel = useRef(null)
  const receiveChannel = useRef(null)
  const remoteVideoRef = useRef(null);
  useEffect(async ()=>{
    await startLocalStream()
    await startWebSocket()
  },[])

  const startLocalStream = async()=>{
    const constraints = {
      video: true,
      audio: false
    }
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    localStreamref.current = stream
    setLocalStream(stream)
    return stream
  }

  const startWebSocket = async()=>{
    utils.Connect(webSocketRef,roomID, userID)
    webSocketRef.current.onmessage = async(m) => {
      const payload = JSON.parse(m.data);
      const customUser = payload?.customUser
      switch (payload.type) {
        case "sdp-offer":
          remPeerConn.current = new RTCPeerConnection(servers);

          localStreamref.current.getTracks().forEach((track)=>{
            remPeerConn.current.addTrack(track, localStreamref.current)
          })

          remPeerConn.current.onicecandidate = (event)=>{
            if(event.candidate){
              utils.SendToSockets({data: JSON.stringify(event.candidate), type: "ice-candidate", room:roomID, user:userID, toSpecificUser: toUserID, customUser: customUser}, webSocketRef)
            }
          }
          
          remPeerConn.current.ontrack = async(event) => {
            console.log(event, localStreamref.current, "ramvinay remote")
            if (event.streams && event.streams[0]) {
              remoteVideoRef.current.srcObject = event.streams[0];
            }
          };

          remPeerConn.current.onconnectionstatechange = () => {
            const connectionState = remPeerConn.current.connectionState;
            console.log(`Connection state changed: ${connectionState}`);
            // Handle the connection state change accordingly
          };

          await remPeerConn.current.setRemoteDescription(new RTCSessionDescription(payload.data))
          const answer = await remPeerConn.current.createAnswer();
          await remPeerConn.current.setLocalDescription(answer);
          utils.SendToSockets({data: answer.sdp, type: "sdp-answer", room:roomID, user:userID, toSpecificUser: toUserID, customUser: customUser}, webSocketRef)
          console.log(payload, "sdp-offer")
          break
        case "sdp-answer":
          if(!peerConnection.current.currentRemoteDescription)await peerConnection.current.setRemoteDescription(payload.data)
          console.log(payload, "sdp-answer")
          break;
        case "ice-candidate":
          if (customUser != "Mastervishal"){
            await peerConnection.current.addIceCandidate(payload.data).then(()=>{
              console.log('ICE candidate added successfully.');
            })
            .catch(error =>{
              console.error('Failed to add ICE candidate:', error);
            })
          }else{
            await remPeerConn.current.addIceCandidate(payload.data).then(()=>{
              console.log('ICE candidate for remote added successfully.');
            })
            .catch(error =>{
              console.error('Failed to add ICE candidate:', error);
            })

          }
          console.log(payload, "ice-candidate")
          break;
          
      }
      return () => {
        if (webSocketRef.current) {
          webSocketRef.current.close();
        }
      };
    }
  }

  var handleDataChannelOpen = function (event) {
    console.log("dataChannel.OnOpen", event);
  };

  var handleDataChannelMessageReceived = function (event) {
    console.log("dataChannel.OnMessage:", event);
  };

  var handleDataChannelError = function (error) {
    console.log("dataChannel.OnError:", error);
  };

  var handleDataChannelClose = function (event) {
    console.log("dataChannel.OnClose", event);
  };

  const init = async(localStream)=>{
    peerConnection.current = new RTCPeerConnection(servers);

    dataChannel.current = peerConnection.current.createDataChannel('text', {});
    dataChannel.current.onopen = handleDataChannelOpen;
    dataChannel.current.onmessage = handleDataChannelMessageReceived;
    dataChannel.current.onerror = handleDataChannelError;
    dataChannel.current.onclose = handleDataChannelClose;

    peerConnection.current.ondatachannel = (event)=>{
      receiveChannel.current = event.channel;
      receiveChannel.current.onopen = handleDataChannelOpen;
      receiveChannel.current.onmessage = handleDataChannelMessageReceived;
      receiveChannel.current.onerror = handleDataChannelError;
      receiveChannel.current.onclose = handleDataChannelClose;
    }

    localStream.getTracks().forEach((track)=>{
      peerConnection.current.addTrack(track, localStream)
    })

    peerConnection.current.onicecandidate = (event)=>{
      if(event.candidate){
        utils.SendToSockets({data: JSON.stringify(event.candidate), type: "ice-candidate", room:roomID, user:userID, toSpecificUser: toUserID}, webSocketRef)
      }
    }
    
    peerConnection.current.ontrack = async(event) => {
      console.log(event, localStream, "ramvinay")
      let [remoteStream] = event.streams;
      setRemoteStream(remoteStream);
    };

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
    utils.SendToSockets({data: offer.sdp, type: "sdp-offer", room:roomID, user:userID, toSpecificUser: toUserID}, webSocketRef)
  }

  const logs = async() => {
    console.log(peerConnection, "peerconnection")
    localStream.getTracks().forEach((track)=>{
      console.log(track, "local stream's tracks here")
    })
    console.log(await peerConnection.current.connectionState,"peerconnection-connectionState")
    console.log(await peerConnection.current.iceConnectionState,"peerconnection-iceConnectionState")
    console.log(await peerConnection.current.iceGatheringState,"peerconnection-iceGatheringState")
    console.log(await peerConnection.current.pendingLocalDescription,"peerconnection-pendingLocalDescription")
    console.log(await peerConnection.current.signalingState,"peerconnection-signalingState")
    console.log(remoteStream, "remoteStream")
  }

  const HandleChannel = ()=>{
    dataChannel.current.send("Hello World!");
  }

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
          <video ref={remoteVideoRef} autoPlay playsInline />
          <button onClick={createOffer}>create offer</button>
          <button onClick={logs}>create Logs</button>
          <button onClick={HandleChannel}>Handle channel</button>
        </div>
      </div>
    </>
  );
};
export default Test;
