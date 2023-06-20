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
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [userID, setUserID] = useState(props.match.params.userid)
  const servers = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
  const peerConnection = useRef(null)

  useEffect(async ()=>{
    utils.Connect(webSocketRef, "test")
    //waiting for signalling server message
    webSocketRef.current.onmessage = async(m) => {
      const payload = JSON.parse(m.data);
      switch (payload.type) {
        case "webrtc-offer":
          if(payload.user === userID)break;
          await init()
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(payload.data))
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          utils.SendToSockets({data: answer, type: "webrtc-answer", room:"test", user:userID}, webSocketRef)
          break
        case "webrtc-answer":
          if(payload.user === userID)break;
          if(!peerConnection.current.currentRemoteDescription)await peerConnection.current.setRemoteDescription(payload.data)
          break;
        case "ice-candidates":
          if (peerConnection.current && peerConnection.current.remoteDescription) {
              await peerConnection.current.addIceCandidate(payload.data).then(()=>{
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

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      setRemoteStream(remoteStream[0]);
    });
  }, []);

const init = async() => {
      
      peerConnection.current = new RTCPeerConnection(servers);

      localStreamref.current.srcObject.getTracks().forEach((track)=>{
        console.log(localStreamref.current.srcObject, "ref src")
        peerConnection.current.addTrack(track, localStreamref.current.srcObject)
        console.log(track, "track added")
      })

      peerConnection.current.onicecandidate = (event)=>{
        if(event.candidate){
          console.log(JSON.stringify(event.candidate).length, "length")
          utils.SendToSockets({data: event.candidate, type: "ice-candidates", room:"test", user:userID}, webSocketRef)
        }
      }

      peerConnection.current.onconnectionstatechange = () => {
        const connectionState = peerConnection.current.connectionState;
        console.log(`Connection state changed: ${connectionState}`);
        // Handle the connection state change accordingly
      };
}

const CreateOffer = async()=>{
    await init()
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    utils.SendToSockets({data: offer, type: "webrtc-offer", room:"test", user:userID}, webSocketRef)
}

const UpdateOffer = async() => {
  console.log(await peerConnection.current.connectionState)
  console.log(await peerConnection.current.iceConnectionState)
  console.log(await peerConnection.current.iceGatheringState)
  console.log(await peerConnection.current.pendingLocalDescription)
  console.log(await peerConnection.current.signalingState)
  console.log(peerConnection.current)
  console.log(localStreamref.current.srcObject, remoteStream)
  localStreamref.current.srcObject.getTracks().forEach((track)=>{
    console.log(track, "track local")
  })
}
  return (
    <>
      {/* <Navbar /> */}
      <div className="center chat-main" id={theme + "-main"}>
        <div className="center" style={{ width:"800px", height:"800px"}}>
          <video key="234"ref={localStreamref} muted={true} autoPlay playsInline controls/>
          {remoteStream &&
          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={remoteStream}
          />
          }
          <button onClick={CreateOffer}>create offer</button>
          <button onClick={UpdateOffer}>create offer</button>
        </div>
      </div>
    </>
  );
};
export default Test;
