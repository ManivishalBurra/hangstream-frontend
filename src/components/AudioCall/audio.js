import React, { useState, useEffect, useContext, useRef } from "react";
import { Button } from "@material-ui/core";
import VideoCall from "./VideoCall";

const Audio = (props) => {
    const [inCall,setInCall] = useState(false);
    return (
        <div className="App" style={{ height: "100%" }}>
        {inCall ? (
          <VideoCall setInCall={setInCall} />
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setInCall(true)}
          >
            Join Call
          </Button>
        )}
      </div>
    );

};

export default Audio;
