import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import GenericTable from "../generic/GenericTable";
import WithModal from "../generic/WithModal";
import StockModal from "./StockModal";

const StockTable = ({ balances, currentHeadline, ...props }) => {
  const user = useSelector((state) => state.auth.user);
  const paused = useSelector((state) => state.settings.game.paused);

  return (
    <Box>
      <GenericTable
        title="Market"
        pagination={false}
        data={{
          results:
            currentHeadline?.balances && user?.portfolio
              ? Object.keys(currentHeadline?.balances || {})
                  .sort()
                  .map((item) => {
                    const owned = user.portfolio[item] || 0;
                    const ownershipValue =
                      owned * currentHeadline.balances[item];
                    return {
                      name: item,
                      price: currentHeadline.balances[item],
                      owned,
                      ownershipValue,
                      perc:
                        Number(
                          (ownershipValue / balances.portfolio.balance) * 100
                        ).toFixed(2) + " %  ",
                    };
                  })
              : [],
        }}
        columns={[
          "name",
          "price",
          "owned",
          "ownershipValue",
          {
            id: "perc",
            label: "Percentage of Portfolio",
          },
        ]}
        actions={[
          {
            label: "View details / Buy / Sell",
            disabled: paused,
            callback: (row) => {
              props.openModal({
                title: "Buy / Sell",
                maxWidth: "md",
                bodyComp: (
                  <StockModal
                    closeModal={props.closeModal}
                    details={{
                      ...row,
                      portfolio: balances.portfolio.balance,
                      cash: balances.cash.balance,
                      totalBalance: balances.totalBalance.balance,
                    }}
                    currentHeadline={currentHeadline}
                  />
                ),
              });
            },
          },
        ]}
      />
    </Box>
  );
};

export default WithModal(StockTable);
