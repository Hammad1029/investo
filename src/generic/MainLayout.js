import { Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "../components/Header";
const MainLayout = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Header />
        <Box sx={{ margin: "10px 5px" }}>{props.children}</Box>
        {/* <HeadlineSummary currentHeadline={currentHeadline} /> */}
      </Box>
    </ThemeProvider>
  );
};

export default MainLayout;

const colors = {
  main: "#05244a",
  secondary: "#000505",
};

const theme = createTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: colors.main,
      // dark: will be calculated from palette.primary.main,
      contrastText: "#fff",
      secondaryText: colors.main,
    },
  },
  typography: {
    allVariants: {
      // color: 'white'
    },
  },
});
