import { Box, Typography } from "@mui/material";

const HeadlineSummary = ({ currentHeadline, sx = {} }) => {
  return (
    <Box sx={{ m: 1 }}>
      <Typography variant="h6" textAlign="center">
        {currentHeadline?.current?.summary || ""}
      </Typography>
    </Box>
  );
};

export default HeadlineSummary;
