import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider as ReduxProvider } from "react-redux";
import store from "./redux/store";
import NotificationLoader from "./generic/Loader";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "react-notifications/lib/notifications.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <NotificationLoader />
      <App />
    </ReduxProvider>
  </React.StrictMode>
);
