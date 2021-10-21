import React, { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import Navbar from '../../components/Navbar/navbar'
import { UserRoom } from '../../userContext/userdetails'
import { BASE_URL } from '../../constants/index'
import { Theme } from '../../userContext/userdetails'
import PersonIcon from '@material-ui/icons/Person';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { PieChart } from 'react-minimal-pie-chart';
import "../../css/account.css";
import axios from 'axios';

const Account = (props) => {

  const history = useHistory();
  var { roomId, setRoomId } = useContext(UserRoom);
  var { theme, setTheme } = useContext(Theme);
  const [boxState, setBoxState] = useState(false);
  const [friends,setFriends] = useState(0);
  const tokenId = localStorage.getItem("tokenId");
  const [banner, setBanner] = useState({});
  useEffect(() => {

    if (!tokenId) {
      history.push("/");
    }
    else {
      axios.post(`${BASE_URL}/home/getinfo`, { id: tokenId }).then((res) => {


        if (res.data.length > 0 && res.data[0].id === tokenId) {
          setBanner({ ...res.data[0] });
          setFriends(res.data[0].friends.length);
        }
        else {
          history.push("/");
        }
      })
    }
  }, [])

  return (
    <>
      <Navbar />
      <div className="account-main center">
        <div className="backdrop-blur account">
          <div className="account-nav">
            <div>
              <img src={banner.profilepic} />
              <p>{banner.username}</p>
            </div>
            <h2>Profile</h2>
          </div>
          <div className="content-main">
            <div className="account-content">
              <table class="table">
                <tbody>
                  <tr>
                    <td><PersonIcon /> Profile</td>
                  </tr>
                  <tr>
                    <td><NotificationsActiveIcon /> Notifications</td>
                  </tr>
                  <tr>
                    <td><PeopleAltIcon /> Friends</td>
                  </tr>

                  <tr>
                    <td><FavoriteIcon /> Liked videos</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="account-info row">
              <div className="col-lg-6">
                <div className="account-box center column">
                  <h6>Video Streak</h6>
                  <div className="center dets">
                    <h1>18</h1>
                    <div>
                      <p>Videos played</p>
                      <p>monthly</p>
                    </div>
                  </div>
                  <Link to="/movies">watch more...</Link>
                </div>
                <div className="account-box center column">
                  <h6>Movies</h6>
                  <div className="pie">
                  <PieChart
                    data={[
                      { title: 'movies', value: 8000, color: '#E38627' },
                    ]}
                    reveal={58}
                    lineWidth={20}
                    lengthAngle={360}
                    rounded
                    animate
                    background="#a7a7a7"
                  />
                  <h3>58%</h3>
                  </div>
                  <p>movies added by you</p>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="account-box center column">
                  <img src={banner.profilepic} />
                  <table class="table">
                    <tbody>
                      <tr>
                        <td>Name: {banner.username}</td>
                      </tr>
                      <tr>
                        <td>Mail: {banner.email}</td>
                      </tr>
                      <tr>
                        <td>friends: {friends}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    </>
  );
}


export default Account;