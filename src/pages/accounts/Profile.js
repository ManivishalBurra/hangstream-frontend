import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Navbar from "../../components/Navbar/navbar";
import { UserRoom } from "../../userContext/userdetails";
import { BASE_URL } from "../../constants/index";
import { Theme } from "../../userContext/userdetails";
import { PieChart } from "react-minimal-pie-chart";
import "../../css/account.css";
import axios from "axios";
import ProfileShow from "../../components/ContenLoader/profileloader";
const Profile = (props) => {
  return (
    <>
      {!props.name ? (
        <>
          <ProfileShow />
        </>
      ) : (
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
              <h6>Videos</h6>
              <div className="pie">
                <PieChart
                  data={[{ title: "movies", value: 8000, color: "#E38627" }]}
                  reveal={58}
                  lineWidth={20}
                  lengthAngle={360}
                  rounded
                  animate
                  background="#a7a7a7"
                />
                <h3>58%</h3>
              </div>
              <p>videos added by you</p>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="account-box center column">
              <img src={props.profilepic} />
              <table class="table">
                <tbody>
                  <tr>
                    <td>Name: {props.name}</td>
                  </tr>
                  <tr>
                    <td>Mail: {props.email}</td>
                  </tr>
                  <tr>
                    <td>friends: {props.friends}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
