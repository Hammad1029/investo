import SmartToyIcon from "@mui/icons-material/SmartToy";
import {
  Avatar,
  Card,
  CardContent,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import constants from "../constants";

export default ({ cardDetails, sx, children }) => {
  const { name, status, icon, textColor } = {
    ...defaultCard,
    ...(cardDetails || {}),
  };
  return (
    <Card sx={{ ...sx }}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={-2}
        >
          <Stack spacing={3}>
            <Typography color="text.secondary" variant="overline">
              {status}
            </Typography>
            <Stack alignItems="flex-start" direction="row" spacing={2}>
              <Typography variant="subtitle2">{name}</Typography>
            </Stack>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: (theme) => theme.palette.primary.main,
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon style={{ height: "30", width: "30" }}>{icon}</SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

const defaultCard = {
  name: "",
  status: constants.pending, // pending, ongoing, finished
  icon: <SmartToyIcon />,
  textColor: "textPrimary",
};
