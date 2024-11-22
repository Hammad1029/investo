import { Button, ButtonGroup } from "@mui/material";

const getLoggable = async (i) => {
  switch (typeof i) {
    case "function":
      return await i();
    case "object":
      return JSON.parse(JSON.stringify(i));
    default:
      return String(i);
  }
};

const DebugButton = ({ logs = [] }) => (
  <ButtonGroup variant="contained">
    {logs.map((i, idx) => (
      <Button
        key={`debug-button-${idx}`}
        onClick={async () => {
          const loggable = await getLoggable(i);
          console.log(loggable);
        }}
      >
        Debug {idx}
      </Button>
    ))}
  </ButtonGroup>
);

export default DebugButton;
