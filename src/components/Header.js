import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { useState } from "react";

const Header = () => {
  return (
    <AppBar position="sticky">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src={`${process.env.PUBLIC_URL}/bazaar.png`}
          sx={{ height: 80, width: 80 }}
        />
        <Typography sx={{ margin: "0px 30px" }} variant="body2">
          Brought to you by
        </Typography>
        <Box
          component="img"
          onClick={() => window.open("http://www.swifteck.com")}
          src={`${process.env.PUBLIC_URL}/swifteck.png`}
          sx={{ height: 40, width: 40, cursor: "pointer" }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
