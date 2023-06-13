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
import * as utils from "../../utils/sockets"
const duration = require("pendel");

const Room = (props) => {
  
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
  var x;

  useEffect(() => {
    if (!tokenId) {
      setRoomId(roomid);
      history.push("/");
    } else if (roomid !== roomId) {
      setRoomId(roomid);
      history.push(`/home/${tokenId}`);
    } else {
      axios
        .post(`${BASE_URL}/home/getinfobyroomid`, { roomid: roomId })
        .then(async (res) => {
          if (res.data) {
            setBanner({ ...res.data[0] });
            setVideoFilePath(res.data[0].movieUrl);
            var resp = await axios.post(`${BASE_URL}/home/getinfo`, {
              id: tokenId,
            });
            setUserData({ ...resp.data[0] });
            x = { ...resp.data[0] };
            if (res.data[0].movieUrl === "") {
              setBoxState(true);
            }
          } else {
            history.push("/");
          }
        });
    }
  }, [BASE_URL]);

  useEffect(()=>{
    const URL = `ws://${SOCKET_URL}/ws/${roomid}/${tokenId}`;
    webSocketRef.current = new WebSocket(URL);
    const currentPageEndPoint = window.location.pathname;
    if(!currentPageEndPoint.includes("/room/")){
      return
    }
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
      if (webSocketRef.current) {
        webSocketRef.current.close();
        history.push("/")
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    // WebSocket event handlers
    webSocketRef.current.onopen = () => {
      console.log('WebSocket connection established');
      axios.post(`${BASE_URL}/home/getinfo`, {
        id: tokenId,
      }).then(resp => {
        
        utils.SendToSockets({data: resp.data[0].username, room: roomid, user: tokenId, profilepic: "", type: "join"}, webSocketRef)
      })
      
    };

    webSocketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
      axios.post(`${BASE_URL}/home/getinfo`, {
        id: tokenId,
      }).then(resp => {
        utils.SendToSockets({data: resp.data[0].username, room: roomid, user: tokenId, profilepic: "", type: "leave"}, webSocketRef)
      })
    };

    webSocketRef.current.onmessage = (m) => {
      const payload = JSON.parse(m.data);
      switch (payload.type) {
        case "chat":
          InsertReceivedMessage(payload)
          break
        case "info":
          CreateTypingEvent(payload)
          break
        case "timing":
          SyncPlayTrack(payload)
          break
        case "join":
          WelcomeUser(payload)
          break
        case "leave":
          GreetUser(payload)
          break
      }
    return () => {
        if (webSocketRef.current) {
          webSocketRef.current.close();
        }
    };
  };
  },[SOCKET_URL])

  const InsertReceivedMessage = (payload) => {
      if (payload.user === tokenId) {
        let msg = new Audio(send);
        msg.play();
      } else {
        let msg = new Audio(receive);
        msg.play();
      }
      setChat((chat) => [...chat, payload]);
      setTyping("");
  }

  const CreateTypingEvent = (payload) => {
    if (payload.user !== tokenId) {
      setTyping(payload.data);
      setTimeout(function () {
        setTyping("");
      }, 3000);
    }
  }

  const SyncPlayTrack = (payload) => {
    //todo: implement to sync up with international calls as well
    if (user !== payload.user && myvideo.current) {
        playTime = myvideo.current.getCurrentTime();
        var d = new Date();
        localTime = d.toLocaleTimeString();
        var differenceInTime = duration.time(localTime, payload.data.localTime);
        var syncDifference =
          Number(differenceInTime.minutes) * 60 +
          Number(differenceInTime.seconds);
        var streamerPlayTime = Number(payload.data.playTime) + syncDifference;
        if (payload.data.movie !== "" && Math.abs(streamerPlayTime - playTime) > 1) {
          //for online
          myvideo.current.seekTo(streamerPlayTime, "seconds");
          setPlay(true);
        } else if (Math.abs(streamerPlayTime - playTime) > 1) {
          //for offline
          myvideo.current.seekTo(streamerPlayTime, "seconds");
        }
    }
  }

  const WelcomeUser = (payload)=>{
    if (payload.user === tokenId) {
      toast.dark(`${payload.data}, welcome to the Hangstream`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {backgroundColor:"#ffc107"}
      });
    } else {
      toast.dark(`${payload.data} has joined the room`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

  const GreetUser = (payload)=>{
    if (payload.user === tokenId) {
      toast.dark(`Hey ${payload.data}, you left the room`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.warn(`${payload.data} has left the room`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

  function display(state) {
    setBoxState(false);
  }

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  function TypeMessage(e) {
    setMessage(e.target.value);
    var name = (userData.username && userData.username.length > 0) ? userData.username : "Friend";
    utils.SendToSockets({data:name+" is typing", room: roomid, user: tokenId, profilepic: "", type: "info"}, webSocketRef)
  }

  const sendMessage = (e) => {
    e.preventDefault();
    var profilepic = userData.profilepic;
    utils.SendToSockets({data:message, room: roomid, user: tokenId, profilepic: profilepic, type: "chat"}, webSocketRef)
    setMessage("");
    setTyping("");
  };

  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  };

  function Progress(progress) {
    playTime = progress.playedSeconds;
    var d = new Date();
    localTime = d.toLocaleTimeString();
    var ID = banner.id;
    var movie = banner.movieName;
    console.log({ playTime, roomId, localTime, ID, movie });
    if (tokenId === banner.id) {
      utils.SendToSockets({data: { playTime, localTime, movie } , room: roomid, user: tokenId, profilepic: "", type: "timing"}, webSocketRef)

    }
  }

  function Duration(duration) {}

  function End() {
    axios
      .post(`${BASE_URL}/home/roomstream`, {
        url: "",
        movieName: "",
        banner: "",
        roomid: "",
        id: tokenId,
      })
      .then((res) => {
        if (res.data) {
          history.push(`/home/${tokenId}`);
        }
      });
  }
  return (
    <>
      <Navbar />
      <div className="center chat-main" id={theme + "-main"}>
        <div className="col-lg-9 stream-area center">
          <div className="video-main">
            {!videoFilePath.includes("drive.google.com") ? (
              <ReactPlayer
                width="100%"
                height="100%"
                ref={myvideo}
                url={videoFilePath}
                playing={play}
                controls
                progressInterval={4000}
                onProgress={Progress}
                onDuration={Duration}
                onEnded={End}
                config={{
                  file: {
                    tracks: [
                      {
                        kind: "subtitles",
                        src: subFilePath,
                        srcLang: "en",
                        default: true,
                      },
                    ],
                  },
                }}
              />
            ) : (
              <iframe
                src={videoFilePath}
                width="100%"
                height="100%"
                frameborder="0"
                scrolling="no"
                seamless=""
                title={banner.movieName}
                key={"iframeMovieName"}
              />
            )}
          </div>
        </div>

        <div className={chatOpen+ " center"}>
          <button
            className={"chat-open" + " chat-open-corner" + chatOpen}
            onClick={() => {
              if (chatOpen === "chat-area") setChatOpen("chat-area-close");
              else setChatOpen("chat-area");
            }}
          >
            <ChatIcon />
          </button>
          {chatOpen && (
            <div className={"chat-box column "+(!showChat&&"center")} id={theme + "-chat"}>
              {showChat?<div className="messages" id="msg">
                {chat.map((chat, index) => {
                  return (
                    <>
                      {user === chat.user ? (
                        <div className="chat-comb" key={chat.user+index+"chat-comb"}>
                          <h6
                            className="usermsg"
                            style={{
                              marginLeft: "auto",
                              backgroundColor: "#ffc107",
                            }}
                            key={index+user+"usermsg"}
                          >
                            {chat.data}
                          </h6>
                          <img
                            src={chat.profilepic}
                            className={theme + "-img"}
                            alt=""
                            key={chat.data+"img"+index}
                          />
                        </div>
                      ) : (
                        <div className="chat-comb" key={chat.user+"chat-comb"+index}>
                          <img src={chat.profilepic} alt="" key={chat.user+"img"+index}/>
                          <h6 className="usermsg" key={chat.user+"usermsg"+index}>
                            {chat.data}
                          </h6>
                        </div>
                      )}
                      <AlwaysScrollToBottom key={index}/>
                    </>
                  );
                })}
                <h6 className="typing">{typing}</h6>
              </div>:<AudioComp/>}

              <div className="messagebox center">
                <form autoComplete="off" onSubmit={sendMessage}>
                  <input
                    autoComplete="off"
                    name="message"
                    value={message}
                    onChange={TypeMessage}
                    placeholder="Send a message"
                  />
                  <div className="center">
                  <Dropdown
                    overlay={
                      <Menu
                        items={[
                          {
                            label: (
                              <a onClick={()=>setShowChat(true)}>
                              <WechatOutlined />
                              {" "}chat
                              </a>
                              
                            ),
                          },
                          {
                            label: (
                              <a onClick={()=>setShowChat(false)}>
                                <VideoCameraOutlined />
                                {" "}video call
                              </a>
                            ),
                          },
                        ]}
                      />
                    }
                    placement="top"
                    arrow={{ pointAtCenter: true }}
                  >
                    <UpCircleOutlined />
                  </Dropdown>
                  </div>
                  <button type="submit">
                    <SendIcon />
                  </button>
                </form>
              </div>
            </div>
          )}
          {boxState && <Box display={display} filePath={true} />}
        </div>
      </div>
    </>
  );
};
export default Room;
