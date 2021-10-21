import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import ReactPlayer from "react-player";
import MicIcon from "@material-ui/icons/Mic";
import GroupIcon from "@material-ui/icons/Group";
import VideocamIcon from "@material-ui/icons/Videocam";
import streamcam from "../../images/streamcam.png";
import active from "../../images/active.png";
import Navbar from "../../components/Navbar/navbar";
import Box from "../../components/Box/Box";
import { UserRoom } from "../../userContext/userdetails";
import { BASE_URL } from "../../constants/index";
import { Theme } from "../../userContext/userdetails";
import "../../css/home.css";
import axios from "axios";
import FriendsShow from "../../components/ContenLoader/Friendlist";
const Home = (props) => {
  const history = useHistory();
  var { roomId, setRoomId } = useContext(UserRoom);
  var { theme, setTheme } = useContext(Theme);
  const [boxState, setBoxState] = useState(false);
  const tokenId = localStorage.getItem("tokenId");
  const [banner, setBanner] = useState({});
  useEffect(() => {
    if (!tokenId) {
      history.push("/");
    } else if (roomId) {
      axios
        .post(`${BASE_URL}/home/getinfobyroomid`, { roomid: roomId })
        .then((res) => {
          if (res.data) {
            setBanner({ ...res.data[0] });
          } else {
            history.push("/");
          }
        });
    } else {
      axios
        .post(`${BASE_URL}/home/getinfo`, { id: props.match.params.googleId })
        .then((res) => {
          if (
            res.data.length > 0 &&
            res.data[0].id === props.match.params.googleId
          ) {
            // if (!sessionStorage.getItem("user_client")) {
            //   sessionStorage.setItem(
            //     "user_client",
            //     JSON.stringify({ ...res.data[0] })
            //   );
            // }
            console.log(res);
            setBanner({ ...res.data[0] });
          } else {
            history.push("/");
          }
        });
    }
  }, []);

  const [friends, setFriends] = [banner.friends];

  function display(state) {
    setBoxState(false);
  }

  function CreateRoomDiv() {
    setBoxState(true);
  }
  function Joinstream() {
    axios
      .post(`${BASE_URL}/home/addfriend`, {
        id: props.match.params.googleId,
        roomId: banner.roomId,
      })
      .then((res) => {
        if (res.data) {
          history.push(`/room/${banner.roomId}`);
        }
      });
  }
  return (
    <>
      <Navbar />
      <div className="row home-hero" id={theme + "-main"}>
        <div className="col-lg-8 ">
          <div className="video-banner center column">
            <ReactPlayer
              width="100%"
              height="100%"
              url={banner.banner}
              controls={false}
              playing={true}
              loop={true}
            />
            <div className="video-info">
              {banner.movieUrl !== "" ? (
                <h1>Streaming Now!!</h1>
              ) : (
                <h6 style={{ color: "white" }}>
                  Get ready your local movie file,{banner.username} streaming
                  now!!
                </h6>
              )}
            </div>
          </div>
          <div className="center stream-choice">
            <button className="stream-option center" onClick={CreateRoomDiv}>
              <img src={streamcam} />
              &nbsp;&nbsp;Start stream
            </button>
            <button className="setting-btn">
              <MicIcon />
            </button>
            <button className="setting-btn">
              <VideocamIcon />
            </button>
            <button className="stream-option" onClick={Joinstream}>
              <GroupIcon />
              &nbsp;&nbsp;Join stream
            </button>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="friends-list backdrop-blur" id={theme + "-blur"}>
            <table class="table">
              <thead>
                <tr>
                  <th>Your friendlist</th>
                </tr>
              </thead>
              <tbody>
                {friends ? (
                  friends.map((friends, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <i class="far fa-user-circle"></i>
                          {friends}
                        </td>
                        <td>
                          <img src={active} />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <FriendsShow />
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {boxState && <Box display={display} filePath={false} private={false} />}
    </>
  );
};

export default Home;
