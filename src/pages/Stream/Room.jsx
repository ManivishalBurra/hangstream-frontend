import React, { useState, useEffect, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import Navbar from "../../components/Navbar/navbar";
import io from "socket.io-client";
import SendIcon from "@material-ui/icons/Send";
import { UserRoom } from "../../userContext/userdetails";
import { Theme } from "../../userContext/userdetails";
import { filePathMovie } from "../../userContext/userdetails";
import { BASE_URL } from "../../constants/index";
import ReactPlayer from "react-player";
import Box from "../../components/Box/Box";
import "../../css/room.css";
import axios from "axios";
import receive from "../../sounds/receive.mp3";
import send from "../../sounds/sentmessage.mp3";
const duration = require("pendel");
let socket;

const Room = (props) => {
  const history = useHistory();
  var { theme, setTheme } = useContext(Theme);
  var { roomId, setRoomId } = useContext(UserRoom);
  const { videoFilePath, setVideoFilePath } = useContext(filePathMovie);
  const roomid = props.match.params.roomid;
  const tokenId = localStorage.getItem("tokenId");
  const [banner, setBanner] = useState({});
  const [userData, setUserData] = useState({});
  var [typing, setTyping] = useState("");
  const [sentStatus, setSentStatus] = useState(false);
  const [play, setPlay] = useState(false);
  var playTime = "";
  var localTime = "";
  const myvideo = useRef(null);
<<<<<<< HEAD

=======
>>>>>>> 77c078e5bba0542569d9c586e5388552401241fb
  var user = localStorage.getItem("tokenId");
  var x = "";
  const [boxState, setBoxState] = useState(false);

  function display(state) {
    setBoxState(false);
  }

  useEffect(async () => {
    socket = io.connect(BASE_URL);
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
            var userName = x.username;
            socket.emit("join_room", { userName, roomId });
            if (res.data[0].movieUrl === "") {
              setBoxState(true);
            }
          } else {
            history.push("/");
          }
        });
    }
  }, [BASE_URL]);

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("welcome", (payload) => {
      if (payload === x.username) {
        toast.dark(`${payload}, welcome to the Hangstream`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.warn(`${payload} has joined the room`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    });
  }, []);

  useEffect(() => {
    socket.on("message", (payload) => {
      if (payload.user === tokenId) {
        var msg = new Audio(send);
        msg.play();
      } else {
        var msg = new Audio(receive);
        msg.play();
      }

      setChat((chat) => [...chat, payload]);
      setTyping("");
    });
  }, []);

  useEffect(() => {
    socket.on("timing", (payload) => {
      if (user !== payload.ID) {
        playTime = myvideo.current.getCurrentTime();
        var d = new Date();
        localTime = d.toLocaleTimeString();
        var differenceInTime = duration.time(localTime, payload.localTime);
        var syncDifference =
          Number(differenceInTime.minutes) * 60 +
          Number(differenceInTime.seconds);
        var streamerPlayTime = Number(payload.playTime) + syncDifference;
        console.log(payload.movie);
        console.log(Math.abs(streamerPlayTime - playTime));
        if (payload.movie !== "" && Math.abs(streamerPlayTime - playTime) > 1) {
          //for online
          myvideo.current.seekTo(streamerPlayTime, "seconds");
          setPlay(true);
        } else if (Math.abs(streamerPlayTime - playTime) > 1) {
          //for offline
          myvideo.current.seekTo(streamerPlayTime, "seconds");
        }
      }
    });
  }, []);

  function TypeMessage(e) {
    setMessage(e.target.value);
    var name = userData.username;

    if (message.length === 1) {
      setTyping("");
      setSentStatus(false);
    } else if (!sentStatus) {
      socket.emit("typing", { name, user, roomId });
      setSentStatus(true);
    }
  }
  useEffect(() => {
    socket.on("typing", (payload) => {
      if (payload.user !== tokenId) {
        var str = payload.name.toLowerCase().split(" ");
        setTyping(str[0] + " is typing...");
        setTimeout(function () {
          setTyping("");
        }, 3000);
      }
    });
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    var profilepic = userData.profilepic;
    socket.emit("message", { message, user, roomId, profilepic });
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
      socket.emit("timing", { playTime, roomId, localTime, ID, movie });
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
      <div className="row chat-main" id={theme + "-main"}>
        <div className="col-lg-9 stream-area">
          <div className="video-main">
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
            />
          </div>
        </div>

        <div className="col-lg-3 chat-area" id={theme + "-chat"}>
          <div className="chat-box column">
            <div class="messages" id="msg">
              {chat.map((chat, index) => {
                return (
                  <>
                    {user === chat.user ? (
                      <div className="chat-comb">
                        <h6
                          className="usermsg"
                          style={{
                            marginLeft: "auto",
                            backgroundColor: "#ffc107",
                          }}
                          key={index}
                        >
                          {chat.message}
                        </h6>
                        <img src={chat.profilepic} className={theme + "-img"} />
                      </div>
                    ) : (
                      <div className="chat-comb">
                        <img src={chat.profilepic} />
                        <h6 className="usermsg" key={index}>
                          {chat.message}
                        </h6>
                      </div>
                    )}
                    <AlwaysScrollToBottom />
                  </>
                );
              })}
              <h6 className="typing">{typing}</h6>
            </div>

            <div className="messagebox center">
              <form autocomplete="off" onSubmit={sendMessage}>
                <input
                  autoComplete="off"
                  name="message"
                  value={message}
                  onChange={TypeMessage}
                  placeholder="Send a message"
                />
                <button type="submit">
                  <SendIcon />
                </button>
              </form>
            </div>
          </div>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        {boxState && <Box display={display} filePath={true} />}
      </div>
    </>
  );
};
export default Room;
