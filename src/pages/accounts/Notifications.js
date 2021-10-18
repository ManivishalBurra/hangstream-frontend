import React, { useState, useContext, useEffect } from "react";
import { UserRoom } from "../../userContext/userdetails";
import { BASE_URL } from "../../constants/index";
import { Theme } from "../../userContext/userdetails";
import "../../css/account.css";
import NotificationShow from "../../components/ContenLoader/Notificationloader";
const Notification = (props) => {
  return (
    <>
      <NotificationShow />
    </>
  );
};

export default Notification;
