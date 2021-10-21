import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Theme } from "../../userContext/userdetails";
import axios from "axios";
import { ToastContainer, toast } from "material-react-toastify";
import { BASE_URL } from "../../constants/index";
import "../../css/search.css";

const SearchResult = (props) => {
  console.log(props);
  const history = useHistory();
  function SendRequest(e) {
    if (!localStorage.getItem("user_client")) history.push("/");
    else {
      var sender = JSON.parse(localStorage.getItem("user_client"));
      console.log(sender);
      axios
        .post(`${BASE_URL}/notifications/addrequest`, {
          requestemail: e.nativeEvent.path[2].childNodes[1].outerText,
          senderemail: sender.email,
          senderName: sender.username,
          senderPic: sender.profilepic,
        })
        .then((res) => {
          if (res.status) {
            toast.dark(
              `request sent to ${e.nativeEvent.path[2].childNodes[0].outerText}`,
              {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              }
            );
          }
        });
    }
    console.log(e.nativeEvent.path[2].childNodes[1].outerText);
  }

  function Result(list) {
    return (
      <tbody style={{ borderTop: "1px solid #dadada" }}>
        <tr className="result-contents">
          <td>
            <p>{list.username.toLowerCase()}</p>
          </td>
          <td>
            <p>{list.useremail}</p>
          </td>
          <td>
            <button
              className="choice-btn sendrequest-btn"
              onClick={SendRequest}
            >
              send
            </button>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <>
      <div className="search-tab backdrop-blur">
        <table className="search-table">
          <thead>
            <tr className="result-heading">
              <th>Username</th>
              <th>Usermail</th>
              <th>Request</th>
            </tr>
          </thead>
          {props.result.map(Result)}
        </table>
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
    </>
  );
};

export default SearchResult;
