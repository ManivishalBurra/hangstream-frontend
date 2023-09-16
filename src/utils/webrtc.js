import * as utils from "./sockets"
import { v4 as uuidv4 } from 'uuid';
const servers = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}

export const startLocalStream = async(localStreamref, customFunc)=>{
  const constraints = {
    video: false,
    audio: false
  }
  navigator.mediaDevices.enumerateDevices()
  .then(event => {
    event.map((item)=>{
      switch(item.kind){
        case 'audioinput':
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
        customFunc({type:"local"})
        console.log(stream)
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


export async function createPeerConnection (localStreamref, peerConnection, webSocketRef, userID, peerId, toSpecificUser, customFunc){

    // peerConnection.current = new RTCPeerConnection(servers);
    let newPeer = new RTCPeerConnection(servers);

    localStreamref.current.getTracks().forEach((track)=>{
      newPeer.addTrack(track, localStreamref.current)
    })
    if(peerId === "")peerId = uuidv4();
    peerConnection.current = [...peerConnection.current, {peer:newPeer, peerId: peerId, toSpecificUser: toSpecificUser}]
    
    newPeer.onicecandidate = (event)=>{
      if(event.candidate){
        utils.SendToSockets({data: JSON.stringify(event.candidate), type: "ice-candidate", room:"webRTC", toSpecificUser: toSpecificUser, user: userID}, webSocketRef)
      }
    }
    
    newPeer.ontrack = async(event) => {
      customFunc({data:event.streams, type: "remote"})
    }
  
    newPeer.onconnectionstatechange = () => {
      const connectionState = newPeer.connectionState;
      console.log(`ramvinay Connection state changed: ${connectionState}`);
      // Handle the connection state change accordingly
    };

    return {peer: newPeer, peerId: peerId, toSpecificUser}
}

export async function connectPeer(webSocketRef, localStreamref, peerConnection, userID, toSpecificUser, customFunc){
  let newPeer =  await createPeerConnection(localStreamref, peerConnection, webSocketRef, userID, userID, toSpecificUser, customFunc)
  // await helper(peerConnection, customFunc, userID, webSocketRef)
  const offer = await newPeer.peer.createOffer()
  await newPeer.peer.setLocalDescription(offer);
  utils.SendToSockets({data: offer.sdp, type: "sdp-offer", room:"webRTC", toSpecificUser:toSpecificUser, user: userID}, webSocketRef)
}

//createPeer with library's webSocket and also create a local stream for them.

export const startWebSocket = async(webSocketRef, localStreamref, peerConnection, userID, Url, customFunc)=>{
  utils.Connect(webSocketRef,"webRTC", userID, Url)
  webSocketRef.current.onmessage = async(m) => {
    const payload = JSON.parse(m.data);
    let peer = null;
    switch (payload.type) {
      case "sdp-offer":
        // if((!payload.data) || payload.data.from === userID)break;
        if(payload.toSpecificUser != userID)break
        peerConnection.current.forEach((p)=>{
          if(p.peerId === payload.data.peerId){
            peer = p
          }
        })
        if(!peer){
          let peerId = payload.data.peerId;
          peer = await createPeerConnection(localStreamref, peerConnection, webSocketRef, userID, peerId, payload.data.from, customFunc)
          // await helper(peerConnection, customFunc, userID, webSocketRef)
        }
        await peer.peer.setRemoteDescription(new RTCSessionDescription(payload.data.offer))
        const answer = await peer.peer.createAnswer();
        await peer.peer.setLocalDescription(answer);
        utils.SendToSockets({data: {answer:answer, from:userID, to:payload.data.from, peerId: peer.peerId}, type: "sdp-answer", room:"test", toSpecificUser: peer.toSpecificUser}, webSocketRef)
        console.log(payload, "sdp-offer ramvinay")
        break
      case "sdp-answer":
        console.log(payload, "ramvinay payload")
        if(payload.data && payload.toSpecificUser === userID){
          peerConnection.current.forEach((p)=>{
            if(p.peerId === payload.data.peerId && p.toSpecificUser === payload.data.from){
              peer = p
            }
          })
          if(!peer)break;
          if(!peer.peer.currentRemoteDescription){
            await peer.peer.setRemoteDescription(payload.data.answer)
          }
        }
        console.log(payload, "answer ramvinay")
        break;
      case "ice-candidate":
        if(payload.toSpecificUser != userID)break;
          peerConnection.current.forEach((p)=>{
            if(payload.toSpecificUser === userID){
              peer = p
            }
          })
          if(!peer)break

          await peer.peer.addIceCandidate(payload.data).then(()=>{
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