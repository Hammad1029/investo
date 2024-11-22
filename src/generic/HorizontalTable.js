import {
  Box,
  Button,
  ButtonGroup,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";
import { camelToNormal, dateFormat } from "../utils";

import moment from "moment";

const HorizontalTable = ({
  title = "",
  data = {},
  actions = [],
  ignoreKeys = ["_id", "__v"],
  dateColumns = [],
  actionsHeading = "Actions",
}) => {
  const renderProperty = (key, property) => {
    if (typeof property === "object") {
      if (Array.isArray(property))
        return property.map((i, idx) => (
          <HorizontalTable
            key={`property-array-${idx}`}
            data={i}
            dateColumns={dateColumns}
          />
        ));
      else return <HorizontalTable data={property} dateColumns={dateColumns} />;
    } else
      return dateColumns.includes(key)
        ? moment(property).format(dateFormat)
        : String(property);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        {title !== "" && <CardHeader title={title} />}
      </Box>
      <PerfectScrollbar>
        <Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Property</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ height: "100%" }}>
                {Object.keys(data)
                  .filter((key) => !ignoreKeys.includes(key))
                  .map((key) => (
                    <TableRow key={key}>
                      <TableCell sx={{ fontWeight: "600", padding: 2 }}>
                        {camelToNormal(key)}
                      </TableCell>
                      <TableCell key={data[key]}>
                        {renderProperty(key, data[key])}
                      </TableCell>
                    </TableRow>
                  ))}
                {actions.length > 0 && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: "600" }}>
                      {actionsHeading}
                    </TableCell>
                    {data?.results?.map((row, idx) => (
                      <TableCell key={`actions-${idx}`}>
                        <ButtonGroup size="small" variant="contained">
                          {actions.map((ac) => (
                            <Button
                              key={ac.label}
                              type="button"
                              disabled={
                                ac.disabled !== undefined
                                  ? typeof ac.disabled === "function"
                                    ? ac.disabled(row)
                                    : ac.disabled
                                  : false
                              }
                              onClick={() =>
                                ac.callback
                                  ? ac.callback(row)
                                  : console.log(row)
                              }
                            >
                              {ac.label || ""}
                            </Button>
                          ))}
                        </ButtonGroup>
                      </TableCell>
                    ))}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </PerfectScrollbar>
      <Divider />
    </Box>
  );
};

export default HorizontalTable;
