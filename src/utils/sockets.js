export const Connect = (webSocketRef,room, user)=>{
  const URL = `ws://localhost:6303/ws/${room}/${user}`;
    webSocketRef.current = new WebSocket(URL);

    webSocketRef.current.onopen = () => {
      console.log('WebSocket connection established');
    };

}

export const SendToSockets = (obj, webSocketRef) => {
    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
      var datas = JSON.stringify(obj)
      console.log('SendToSockets is activated just now with data length: ', datas.length)
      webSocketRef.current.send(datas)
    }
}