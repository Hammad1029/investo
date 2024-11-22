import moment from "moment";
import { logoutUser } from "./redux/auth.slice";
import store from "./redux/store";
import _ from "lodash";

export const logout = () => {
  store.dispatch(logoutUser());
  //   Router.push("/login");
};

export const formatCurrency = (amount) => {
  return (
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    })
      .format(amount)
      .replace("$", "") + " PKR"
  );
};

export const updateDashboard = async (req) => {
  //   const {
  //     data: { responseCode, data },
  //   } = await axiosInstance.get(`${getBaseURL(req)}/updateDashboardCalls`);
  //   if (responseCode === "00") store.dispatch(updateData(data));
};

export const getLeaderboardData = (module) => {
  const { teamScores } = store.getState().app;
  const teamIds = Object.keys(module)
    .filter((i) => ["first", "second", "third", "fourth", "fifth"].includes(i))
    .map((i) => module[i]);
  const teams = teamScores
    .filter((i) => teamIds.includes(i.id))
    .map((i) => ({ ...i, name: i.username }));
  return teams;
};

export const camelToNormal = (string) =>
  string.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

export const dateFormat = "YYYY-MM-DD hh:mm:ss a";

export const getCurrentHeadline = () => {
  const headlines = store.getState().headlines.headlines;
  const settings = store.getState().settings.game;

  const returnVal = { previous: null, current: null, next: null };

  const now = moment();
  const startTime = moment.unix(settings.startedAt.seconds);
  const totalPaused = settings.pauses.reduce(
    (acc, i) => acc + ((i.to?.seconds || now.unix()) - i.from.seconds),
    0
  );
  startTime.add(totalPaused, "seconds");
  const timeElapsed = now.diff(startTime, "seconds") + 1;


  let intervalAcc = 0;
  let idx = 0;

  for (const headline of headlines) {
    intervalAcc += headline.interval * 60;
    if (intervalAcc > timeElapsed) {
      returnVal.current = headline;
      if (idx !== headlines.length - 1)
        returnVal.next = startTime.clone().add(intervalAcc, "seconds");
      if (idx !== 0) returnVal.previous = headlines[idx - 1];
      return returnVal;
    }
    idx++;
  }

  if (
    timeElapsed >= intervalAcc &&
    returnVal.current === null &&
    headlines.length >= 1
  )
    returnVal.current = headlines[headlines.length - 1];

  return returnVal;
};

export const sampleHeadline = {
  balances: {},
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  summary: "AYYY RICK ROLLED",
  interval: 10000,
  order: 1,
};
