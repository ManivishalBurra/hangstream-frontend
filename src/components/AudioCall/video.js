import React, { useState, useEffect, useContext, useRef } from "react";
import { AgoraVideoPlayer } from "agora-rtc-react";

const Video = (props) => {
    const {users,tracks}=props;
    return (<>
        <AgoraVideoPlayer videoTrack={tracks[1]}/>
        {
            users.length>0 && users.map(user=>{
                if(user.videoTrack){
                    return (
                        <AgoraVideoPlayer videoTrack={user.videoTrack} key={user.uid} style={{height:"100%",width:"100%"}}/>
                    )
                }
                else return null;
            })
        }
        </>
    );

};

export default Video;
