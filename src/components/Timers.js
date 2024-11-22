import { Box, CircularProgress, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import DebugButton from "../generic/DebugButton";

const CountdownTimer = ({
  duration,
  onComplete = () => {},
  countdownDescription,
  format = "ss",
  paused = false,
  sx = {},
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    setTimeLeft(duration);
    if (timerRef.current === null && !paused) startTimer();
  }, [duration]);

  useEffect(() => {
    if (paused) stopInterval();
    else if (!paused && timerRef.current === null) startTimer();
  }, [paused]);

  const stopInterval = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) return prev - 1;
        onComplete();
        stopInterval();
        return prev;
      });
    }, 1000);
  };

  const circularProps = {
    variant: "determinate",
    size: 120,
    thickness: 5,
    value: ~~((timeLeft / duration) * 100),
    secColor: "#d1d1d1",
    get sx() {
      return {
        borderRadius: "50%",
        boxShadow: `inset 0 0 0 ${(this.thickness / 44) * this.size}px ${
          this.secColor
        }`,
      };
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        ...sx,
      }}
    >
      {countdownDescription && (
        <Typography textAlign="center" sx={{ mb: 1 }} variant="h4">
          {countdownDescription}
        </Typography>
      )}
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress {...circularProps} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body1">
            {moment
              .utc(moment.duration(timeLeft, "second").asMilliseconds())
              .format(format)}
          </Typography>
        </Box>
      </Box>
      {timeLeft > 0 && (
        <Typography textAlign="center" sx={{ mt: 1 }} variant="h6">
          Time remaining
        </Typography>
      )}
    </Box>
  );
};

export default CountdownTimer;
