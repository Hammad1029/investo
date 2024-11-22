import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import moment from "moment";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import YouTube from "react-youtube";
import Counters from "../components/Counters";
import Leaderboard from "../components/Leaderboard";
import { firebaseDB } from "../firebase.config";
import { setLoading } from "../redux/settings.slice";
import HeadlinePlayer from "../components/HeadlinePlayer";
import DebugButton from "../generic/DebugButton";
import { getCurrentHeadline } from "../utils";
import HeadlineSummary from "../components/HeadlineSummary";

const AdminPage = ({ currentHeadline, updateHeadline, ...props }) => {
  const dispatch = useDispatch();

  const gameSettings = useSelector((state) => state.settings.game);
  const {
    end,
    paused,
    start,
    pauses,
    length,
    endAt,
    initial: initialCashAmount,
  } = gameSettings;

  const settingsDoc = doc(firebaseDB, "settings", "settings");

  const pauseUnpause = async () => {
    try {
      dispatch(setLoading(true));
      const currentMoment = moment();
      if (paused) {
        const old = { ...pauses[pauses.length - 1] };
        await updateDoc(settingsDoc, { pauses: arrayRemove(old) });
        await updateDoc(settingsDoc, {
          paused: !paused,
          pauses: arrayUnion({ ...old, to: currentMoment.toDate() }),
          endAt: moment
            .unix(endAt.seconds)
            .add(
              currentMoment.diff(moment.unix(old?.from?.seconds), "seconds"),
              "seconds"
            )
            .toDate(),
        });
      } else
        await updateDoc(settingsDoc, {
          paused: !paused,
          pauses: arrayUnion({
            from: currentMoment.toDate(),
            to: null,
          }),
        });
    } catch (e) {
      console.error(e);
      NotificationManager.error("Something went wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const startGame = async () => {
    try {
      dispatch(setLoading(true));
      const currentMoment = moment();
      await updateDoc(settingsDoc, {
        start: true,
        startedAt: currentMoment.toDate(),
        endAt: currentMoment.clone().add(length, "minute").toDate(),
      });
    } catch (e) {
      console.error(e);
      NotificationManager.error("Something went wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const reset = async () => {
    try {
      dispatch(setLoading(true));
      const now = new Date();
      await updateDoc(settingsDoc, {
        end: false,
        length: length,
        paused: false,
        pauses: [],
        start: false,
        endAt: now,
        startedAt: now,
      });
      const colRef = query(
        collection(firebaseDB, "users"),
        where("admin", "==", false)
      );
      const docs = await getDocs(colRef);
      docs.forEach(async (doc) => {
        const docRef = doc.ref;
        await updateDoc(docRef, { portfolio: {}, cash: initialCashAmount });
      });
    } catch (e) {
      console.error(e);
      NotificationManager.error("Something went wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const endGame = async () => {
    try {
      dispatch(setLoading(true));
      await updateDoc(settingsDoc, {
        end: true,
        endAt: new Date(),
      });
    } catch (e) {
      console.error(e);
      NotificationManager.error("Something went wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const old = { ...pauses[pauses.length - 1] };

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              height: "100%",
              width: "100%",
            }}
          >
            <Typography variant="h5" sx={{ mb: 1 }}>
              Control Panel
            </Typography>
            <ButtonGroup variant="contained" size="large">
              <Button disabled={start} onClick={startGame}>
                Start
              </Button>
              <Button disabled={!start} onClick={pauseUnpause}>
                {`${paused ? "un" : ""}pause`}
              </Button>
              <Button disabled={!start} onClick={endGame}>
                End
              </Button>
              <Button onClick={reset}>Reset</Button>
            </ButtonGroup>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <HeadlineSummary currentHeadline={currentHeadline} />
        </Grid>
        <Grid item xs={12} md={6} sx={{}}>
          <HeadlinePlayer url={currentHeadline.current?.url} />
        </Grid>
        <Grid
          item
          xs={12}
          md={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Counters
            updateHeadline={updateHeadline}
            currentHeadline={currentHeadline}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Leaderboard currentHeadline={currentHeadline.current} />
        </Grid>
      </Grid>
      {/* <HeadlineSummary currentHeadline={currentHeadline} /> */}
    </Box>
  );
};

export default AdminPage;
