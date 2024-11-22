import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import YouTube from "react-youtube";

const HeadlinePlayer = ({ url = "" }) => {
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const { paused, start } = useSelector((state) => state.settings.game);

  const videoId = String(url).split("=")[1];

  useEffect(() => {
    if (playerRef.current !== null) {
      if (!start) playerRef.current.target.pauseVideo();
      else if (start && !paused && !playing)
        playerRef.current.target.playVideo();
      else if (start && paused && playing)
        playerRef.current.target.pauseVideo();
    }
  }, [paused, start]);

  return (
    <Box>
      <YouTube
        onReady={(e) => (playerRef.current = e)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnd={() => playerRef.current.target.playVideo()}
        videoId={videoId}
        opts={{
          height: "500",
          width: "100%",
          playerVars: {
            loop: 1,
            playlist: videoId,
            autoplay: 1,
            modestbranding: 1,
            rel: 0,
          },
        }}
      />
    </Box>
  );
};

export default HeadlinePlayer;
