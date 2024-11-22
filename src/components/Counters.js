import { Box } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CountdownTimer from "./Timers";
import Divider from "@mui/material/Divider";

const Counters = ({
  currentHeadline,
  updateHeadline,
  sx = {},
  divd = true,
}) => {
  const { endAt, paused, start, end } = useSelector(
    (state) => state.settings.game
  );
  const timerActive = start && !paused && !end;

  const [nextHeadlineTime, setNextHeadlineTime] = useState(0);
  const [tradingTimeLeft, setTradingTimeLeft] = useState(0);

  useEffect(() => {
    setNextHeadlineTime(() => {
      const nextHeadline = moment(currentHeadline.next);
      return nextHeadline.isValid() && (timerActive || paused)
        ? nextHeadline.diff(moment(), "seconds")
        : 0;
    });
  }, [currentHeadline, timerActive]);

  useEffect(() => {
    setTradingTimeLeft(() => {
      const endDate = moment.unix(endAt.seconds);
      const valid = endDate.isValid();
      if (valid && (timerActive || paused)) {
        const diff = endDate.diff(moment(), "seconds");
        return diff > 0 ? diff : 0;
      }
      return 0;
    });
  }, [endAt, timerActive]);

  return (
    <Box sx={{ width: "80%", ...sx }}>
      <CountdownTimer
        countdownDescription={
          currentHeadline.next === null
            ? "No more headlines"
            : "Next headline in"
        }
        format="mm:ss"
        onComplete={updateHeadline}
        duration={nextHeadlineTime}
        paused={!timerActive}
      />
      {divd && (
        <Divider
          sx={{
            margin: "20px 0px",
            backgroundColor: "darkgray",
            width: "100%",
          }}
        />
      )}
      <CountdownTimer
        countdownDescription="Trading ends in"
        format="HH:mm:ss"
        duration={tradingTimeLeft}
        paused={!timerActive}
      />
    </Box>
  );
};

export default Counters;
