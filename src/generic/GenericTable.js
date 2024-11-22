import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";
import { camelToNormal } from "../utils";

const GenericTable = ({
  title = "",
  columns = [],
  data = {},
  sx = {},
  actions = [],
  handlePageChange = () => {},
  pagination = true,
  actionsHeading = "Actions",
}) => {
  return (
    <Card sx={sx}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        {title !== "" && <CardHeader title={title} />}
        {pagination && (
          <TablePagination
            rowsPerPage={data?.pageSize || 0}
            page={(data?.page || 1) - 1}
            count={data?.totalResults || 0}
            component="div"
            rowsPerPageOptions={false}
            onPageChange={(e, p) => handlePageChange(p + 1)}
          />
        )}
      </Box>
      <PerfectScrollbar>
        <Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell key={col.id || col}>
                      {col.label || camelToNormal(col.id || col) || ""}
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell>{actionsHeading}</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody sx={{ height: "100%" }}>
                {data?.results?.map((row, i) => {
                  return (
                    <TableRow hover key={row._id}>
                      {columns.map((col, idx) => (
                        <TableCell key={col.id || col}>
                          {
                            col.sNo === true
                              ? i + 1
                              : col.component
                              ? col.component(row, row[col.id])
                              : row[col.id || col] !== undefined
                              ? col.formatter
                                ? col.formatter(String(row[col.id || col]))
                                : String(row[col.id || col])
                              : col.default || "-" // Replace null/undefined with space
                          }
                        </TableCell>
                      ))}
                      {actions.length > 0 && (
                        <TableCell>
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
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </PerfectScrollbar>
      <Divider />
    </Card>
  );
};

export default GenericTable;
