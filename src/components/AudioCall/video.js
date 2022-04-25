import { AgoraVideoPlayer } from "agora-rtc-react";
import { Grid } from "@material-ui/core";
import { useState, useEffect } from "react";

export default function Video(props) {
  const { users, tracks } = props;
  const [gridSpacing, setGridSpacing] = useState(12);

  useEffect(() => {
    setGridSpacing(Math.max(Math.floor(12 / (users.length + 1)), 4));
  }, [users, tracks]);

  return (
    <Grid container style={{ height: "100%",display:"grid",alignItems:"center",justifyContent:"center",overflowY:"scroll" }}>
      <Grid item xs={gridSpacing}>
        <AgoraVideoPlayer
          videoTrack={tracks[1]}
          style={{ height: "150px", width: "150px",borderRadius:"20px",overflow:"hidden",margin:"10px" }}
        />
      </Grid>
      {users.length > 0 &&
        users.map((user) => {
          if (user.videoTrack) {
            return (
              <Grid item xs={gridSpacing}>
                <AgoraVideoPlayer
                  videoTrack={user.videoTrack}
                  key={user.uid}
                  style={{ height: "150px", width: "150px",borderRadius:"20px",overflow:"hidden",margin:"10px" }}
                />
              </Grid>
            );
          } else return null;
        })}
    </Grid>
  );
}