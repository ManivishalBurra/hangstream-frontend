import React, { useState, useEffect } from "react";
import {useHistory } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { BASE_URL } from "../../constants/index";
import PersonIcon from "@material-ui/icons/Person";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import FavoriteIcon from "@material-ui/icons/Favorite";
import "../../css/account.css";
import axios from "axios";
import Profile from "./Profile";
import Notification from "./Notifications";
const Account = (props) => {
  const history = useHistory();
  const [friends, setFriends] = useState(0);
  const tokenId = localStorage.getItem("tokenId");
  const [user, setUser] = useState({});
  const [clicked, setClicked] = useState("Profile");
  useEffect(() => {
    if (!tokenId) {
      history.push("/");
    } else {
      axios.post(`${BASE_URL}/home/getinfo`, { id: tokenId }).then((res) => {
        if (res.data.length > 0 && res.data[0].id === tokenId) {
          setUser({ ...res.data[0] });
          setFriends(res.data[0].friends.length);
          console.log(user);
        } else {
          history.push("/");
        }
      });
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="account-main center">
        <div className="backdrop-blur account">
          <div className="account-nav">
            <div>
              <img src={user.profilepic} />
              <p>{user.username}</p>
            </div>
            <h2>{clicked}</h2>
          </div>
          <div className="content-main">
            <div className="account-content">
              <table className="table">
                <tbody>
                  <tr>
                    <td
                      onClick={() => {
                        setClicked("Profile");
                      }}
                    >
                      <PersonIcon /> Profile
                    </td>
                  </tr>
                  <tr>
                    <td
                      onClick={() => {
                        setClicked("Notifications");
                      }}
                    >
                      <NotificationsActiveIcon /> Notifications
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <PeopleAltIcon /> Friends
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <FavoriteIcon /> Liked videos
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {clicked === "Profile" && (
              <Profile
                name={user.username}
                email={user.email}
                friends={friends}
                profilepic={user.profilepic}
              />
            )}
            {clicked === "Notifications" && (
              <Notification useremail={user.email} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
