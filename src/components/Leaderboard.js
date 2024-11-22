import { Box, Chip, Paper } from "@mui/material";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useState } from "react";
import { firebaseDB } from "../firebase.config";
import GenericTable from "../generic/GenericTable";
import _ from "lodash";
import { useSelector } from "react-redux";
import { formatCurrency } from "../utils";

const Leaderboard = ({}) => {
  const [teams, setTeams] = useState([]);

  const headlines = useSelector((state) => state.headlines.headlines);
  const currentHeadline = headlines[headlines.length - 1];

  onSnapshot(
    query(collection(firebaseDB, "users"), where("admin", "==", false)),
    (querySnapshot) => {
      const arr = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const obj = {
          teamName: data.teamName,
          teamMembers: data.teamMembers,
          portfolio: Number(
            Object.keys(currentHeadline?.balances || {}).reduce((acc, i) => {
              return (
                acc + currentHeadline.balances[i] * (data.portfolio[i] || 0)
              );
            }, 0)
          ),
        };
        arr.push(obj);
      });
      setTeams(arr);
    }
  );

  return (
    <Box
      sx={{ maxHeight: "80vh", overflow: "scroll" }}
      component={Paper}
      elevation={12}
    >
      <GenericTable
        sx={{}}
        pagination={false}
        title="Leaderboard"
        columns={[
          { id: "position", sNo: true },
          "teamName",
          {
            id: "teamMembers",
            component: (row, val) => (
              <Box>
                {val.split(",").map((mem) => (
                  <Chip label={mem} color="primary" />
                ))}
              </Box>
            ),
          },
          "portfolio",
        ]}
        data={{
          results: _.orderBy(teams, "portfolio", "desc").map((i) => ({
            ...i,
            portfolio: formatCurrency(i.portfolio),
          })),
        }}
      />
    </Box>
  );
};

export default Leaderboard;
