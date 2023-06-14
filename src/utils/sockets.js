const SOCKET_URL = "localhost:6303";

export const Connect = (webSocketRef,room)=>{
  const URL = `ws://13.239.135.149:6303/ws/${room}`;
    webSocketRef.current = new WebSocket(URL);

    webSocketRef.current.onopen = () => {
      console.log('WebSocket connection established');
    };

}

export const SendToSockets = (obj, webSocketRef) => {
    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
      var datas = JSON.stringify(obj)
      console.log(obj)
      console.log('SendToSockets is activated just now with data length: ', datas.length)
      webSocketRef.current.send(datas)
    }
}