import React, { useState, useEffect } from "react";
import {useClient} from "./settings"
const Controls = (props) => {
    const client =useClient();
    const {tracks,setStart,setInCall}=props;
    const [trackState,setTrackState]=useState({video:true,audio:true});
    return (
        <p>CONTROLLSSSS</p>
    );

};

export default Controls;
