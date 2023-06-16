const SOCKET_URL = "localhost:6303";

export const Connect = (webSocketRef,room)=>{
  const URL = `wss://0e5f-2405-201-c02f-81e4-40c2-233c-3d08-7875.ngrok-free.app/ws/${room}`;
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