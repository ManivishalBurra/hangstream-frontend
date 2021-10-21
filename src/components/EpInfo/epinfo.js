import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from "react-router-dom";
import "../../css/Info.css"
import CloseIcon from '@material-ui/icons/Close';
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import {filePathMovie} from '../../userContext/userdetails'


const Info = (props) => {
    const {videoFilePath, setVideoFilePath} = useContext(filePathMovie);
    const history = useHistory();
    useEffect(()=>{
        console.log(props);
    },[])
    function Todrive(e) {
        var str = Number(e.target.id.substring(4));
        setVideoFilePath(props.Urls[str]);
        history.push("/watch");
    }
    return <>
    <div className="login-main box-main center backdrop-blur-black" >
        <div className="Info-main">
          <div className="movie-summary center column">
            <div className="poster-info">
                <img src={props.img} />
            </div>
            <p>{props.movieName+"-"} <span>{props.year}</span></p>
            <p>IMDB: <span style={{color:"green"}}>{props.rating}</span></p>
          </div>
          <div className="center rtng">
            <p><span style={{fontWeight:"bold"}}>Plot:</span> {props.plotOutline}</p>
          </div>
          <div className="episodes">
            <h6>Episodes</h6>
              {
               props.ep.map((list,index)=>{
                   return <div onClick={Todrive} id={"eps-"+index} className="center eps"><PlayCircleFilledWhiteIcon style={{fontSize:"40px"}}/><button id={"bps-"+index} >{list}</button></div>
               })   
              }
            </div>
        <CloseIcon className="close-btn info-close" onClick={() => { props.display(false) }} />
        </div>
    </div>
    </>


}

export default Info;