import React, { useState, useEffect, useContext, useRef } from "react";
import AudioCall from "../AudioCall/audioCall";

const Audio = (props) => {
    const [inCall,setInCall] = useState(false);
    return (
        <>
        <button
            onClick={()=>setInCall(true)}
        >
            Join call
        </button>
        {inCall?<AudioCall setInCall={setInCall}/>:"waiting bro"}
        </>
    );

};

export default Audio;
