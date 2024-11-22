import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./firebase.config";
import { firebaseAuth, firebaseDB } from "./firebase.config";
import MainLayout from "./generic/MainLayout";
import WithModal from "./generic/WithModal";
import AdminPage from "./pages/admin";
import AuthPage from "./pages/auth";
import User from "./pages/user";
import UserDetails from "./pages/userDetails";
import { loginUser, logoutUser, setTeamDetails } from "./redux/auth.slice";
import { setHeadlines } from "./redux/headlines.slice";
import { setLoading, setSettings } from "./redux/settings.slice";
import { getCurrentHeadline, sampleHeadline } from "./utils";
import { Backdrop, Box, CircularProgress } from "@mui/material";

let unSubUser = () => {};
let unSubHeadlines = () => {};
let unSubSettings = () => {};

function App(props) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [dataLoaded, setDataLoaded] = useState([false, false, false]);

  const dispatch = useDispatch();
  const auth = getAuth();

  const everythingLoaded = dataLoaded.every((i) => i === true);

  useEffect(() => {
    if (isLoggedIn) {
      if (everythingLoaded) dispatch(setLoading(false));
      else dispatch(setLoading(true));
    }
  }, [isLoggedIn, everythingLoaded]);

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        dispatch(
          loginUser({
            user: {
              email: user.email,
              uid: user.uid,
            },
          })
        );
        unSubUser = onSnapshot(doc(firebaseDB, "users", user.email), (doc) => {
          const data = doc.data();
          if (data) {
            dispatch(
              setTeamDetails({
                balance: data.balance,
                cash: data.cash,
                email: data.email,
                portfolio: data.portfolio,
                teamName: data.teamName,
                admin: data.admin,
              })
            );
            setDataLoaded((prev) => [true, prev[1], prev[2]]);
          } else if (!data.admin)
            props.openModal({
              title: "Enter team details",
              maxWidth: "sm",
              bodyComp: <UserDetails closeModal={props.closeModal} />,
              noClose: true,
            });
        });

        unSubHeadlines = onSnapshot(
          query(collection(firebaseDB, "headlines"), orderBy("order", "asc")),
          (querySnapshot) => {
            const headlines = [];
            querySnapshot.forEach((doc) => {
              headlines.push(doc.data());
            });
            dispatch(setHeadlines(headlines));
            setDataLoaded((prev) => [prev[0], true, prev[2]]);
          }
        );

        unSubUser = onSnapshot(
          doc(firebaseDB, "settings", "settings"),
          (doc) => {
            const data = doc.data();
            if (data) {
              dispatch(setSettings(data));
              setDataLoaded((prev) => [prev[0], prev[1], true]);
            }
          }
        );
      } else {
        signOut(auth);
        dispatch(logoutUser());
      }
    });

    return () => {
      unSubUser();
      unSubHeadlines();
      unSubSettings();
    };
  }, []);

  const admin = useSelector((state) => state.auth.user.admin);
  const headlines = useSelector((state) => state.headlines.headlines);
  const gameSettings = useSelector((state) => state.settings.game);

  const { start, paused, end } = gameSettings;

  const [currentHeadline, setCurrentHeadline] = useState({
    previous: null,
    current: sampleHeadline,
    next: null,
  });

  useEffect(() => {
    updateHeadline();
  }, [headlines, gameSettings]);

  const updateHeadline = () =>
    start && !end && setCurrentHeadline(getCurrentHeadline());

  return (
    <MainLayout>
      {isLoggedIn ? (
        everythingLoaded ? (
          admin ? (
            <AdminPage
              currentHeadline={currentHeadline}
              updateHeadline={updateHeadline}
            />
          ) : (
            <User
              currentHeadline={currentHeadline}
              updateHeadline={updateHeadline}
            />
          )
        ) : (
          <Box
            sx={{
              minWidth: "100vw",
              mt: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress size={40} color="inherit" />
          </Box>
        )
      ) : (
        <AuthPage />
      )}
    </MainLayout>
  );
}

export default WithModal(App);
