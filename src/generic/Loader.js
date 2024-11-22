import { NotificationContainer } from "react-notifications";
import { Backdrop, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";

const NotificationLoader = () => {
  const loading = useSelector((state) => state.settings.loading);

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.appBar + 400 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <NotificationContainer />
    </>
  );
};

export default NotificationLoader;
