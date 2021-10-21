import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useHistory } from "react-router-dom";
import { filePathMovie } from '../../userContext/userdetails'
import 'tippy.js/dist/tippy.css';
import { Theme } from '../../userContext/userdetails'
import { ToastContainer, toast } from "material-react-toastify";

const Drive = () => {
    var { theme, setTheme } = useContext(Theme);
    const { videoFilePath, setVideoFilePath } = useContext(filePathMovie);
    const history = useHistory();
    const tokenId = localStorage.getItem("tokenId");
    useEffect(() => {
        toast.dark(`F11 to fullscreen`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }, [])

    return <>
        <iframe
            src={videoFilePath}
            width="100%"
            height="100%"
            frameborder="0" scrolling="no" seamless=""
        />
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
}

export default Drive;
