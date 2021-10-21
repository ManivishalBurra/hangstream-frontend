import React, { useState, useContext, useEffect } from "react";
import { UserRoom } from "../../userContext/userdetails";
import { BASE_URL } from "../../constants/index";
import { Theme } from "../../userContext/userdetails";
import "../../css/account.css";
import NotificationShow from "../../components/ContenLoader/Notificationloader";
import axios from "axios";
import "../../css/notifications.css";
const Notification = (props) => {
  const tokenId = localStorage.getItem("tokenId");
  const [requests, setRequests] = useState([]);
  const [preloader, setPreloader] = useState(true);
  useEffect(() => {
    axios
      .post(`${BASE_URL}/notifications/getnotifications`, {
        useremail: props.useremail,
      })
      .then((res) => {
        setPreloader(false);
        console.log(res);
        if (res.data.length > 0) {
          if (res.data[0].requests.length > 0)
            setRequests(res.data[0].requests);
        }
      });
  }, []);
  function requestList(list) {
    return (
      <div className="notifications-main">
        <div className="request center">
          <div className="requesterImg">
            <img src={list.senderProfilePic} />
          </div>
          <p>{list.senderName} sent you a request to access your videos</p>
        </div>
        <div className="choicebtn-parent center">
          <button className="choice-btn accept">accept</button>
          <button className="choice-btn reject">reject</button>
        </div>
      </div>
    );
  }
  return (
    <>
      {preloader ? (
        <>
          <NotificationShow />
        </>
      ) : (
        <div className="notifications-tabs">
          <h5>Requests</h5>
          {requests.length > 0 ? (
            requests.map(requestList)
          ) : (
            <p>no new notifications</p>
          )}
        </div>
      )}
    </>
  );
};

export default Notification;
