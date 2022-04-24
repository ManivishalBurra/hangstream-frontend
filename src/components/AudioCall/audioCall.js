import React, { useState, useEffect} from "react";
import {config, useMicrophoneAndCameraTracks,useClient,channelName} from "./settings"
import Controls from "./controls"
import Video from "./video";

const AudioCall = (props) => {
    const {setInCall}=props;
    const [users,setUsers] = useState([]);
    const [start,setStart]=useState(false);
    const client =useClient();
    const {ready,tracks}=useMicrophoneAndCameraTracks();

    useEffect(() => {
        console.log("hey just enteered audiocall.js")
        let init =async (name)=>{
            client.on("user-published",async(user,mediaType)=>{
                await client.subscribe(user,mediaType);
                if (mediaType === "video"){
                    setUsers((prevUsers)=>{
                        return [...prevUsers,user];
                    });
                }
                if (mediaType === "audio"){
                    user.audioTrack.play();
                }
            });
            client.on("user-unpublished",(user,mediaType)=>{
                if (mediaType==="audio"){
                    if(user.audioTrack)user.audioTrack.stop();
                }
                if (mediaType === "video"){
                    setUsers((prevUsers)=>{
                        return prevUsers.filter((User)=>User.uid!==user.uid)
                    });
                }
            });
            client.on("user-left",(user)=>{
                setUsers((prevUsers)=>{
                    return prevUsers.filter((User)=>User.uid!==user.uid)
                });
            });
            try{
                await client.join(config.appId,name,config.token,null)
            }catch (error){
                console.log("error")
            }
            if (tracks)await client.publish([tracks[0],tracks[1]]);
            setStart(true);
        }
        if (ready && tracks){
            try{
                init(channelName);
            }catch(error){
                console.log(error)
            }
        }
    },[client,ready,tracks])

    return (
        <>
        <div>
            {ready && tracks && <Controls tracks={tracks} setStart={start} setInCall={setInCall}/>}
        </div>
        {start && tracks && <Video tracks={tracks} users={users}/>}
        </>
    )
};

export default AudioCall;
