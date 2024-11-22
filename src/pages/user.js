import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import MoneyIcon from "@mui/icons-material/Money";
import SavingsIcon from "@mui/icons-material/Savings";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { Box, Grid, Typography } from "@mui/material";
import moment from "moment";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import YouTube from "react-youtube";
import Counters from "../components/Counters";
import ModuleCard from "../components/ModuleCard";
import StockTable from "../components/StockTable";
import WithModal from "../generic/WithModal";
import { dateFormat, formatCurrency } from "../utils";
import HeadlinePlayer from "../components/HeadlinePlayer";
import DebugButton from "../generic/DebugButton";
import HeadlineSummary from "../components/HeadlineSummary";

const UserPage = ({ currentHeadline, updateHeadline, ...props }) => {
  const user = useSelector((state) => state.auth.user);

  const {
    start,
    initial: initialCashAmount,
    paused,
    end,
  } = useSelector((state) => state.settings.game);

  const balances =
    currentHeadline.current !== null
      ? getBalances(user, currentHeadline.current.balances, initialCashAmount)
      : false;

  useEffect(() => {
    if (!start || paused || end)
      props.openModal({
        title: "ALERT",
        maxWidth: "sm",
        noClose: true,
        bodyComp: (
          <Typography>
            Game {!start ? "not yet started" : paused ? "paused" : "ended"}
          </Typography>
        ),
      });
    else props.closeModal();
  }, [start, paused, end]);

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12}>
          <HeadlineSummary currentHeadline={currentHeadline} />
        </Grid>
        <Grid item xs={12} md={8} sx={{}}>
          <HeadlinePlayer url={currentHeadline.current?.url} />
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Counters
            updateHeadline={updateHeadline}
            currentHeadline={currentHeadline}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            {Object.keys(balances).map((key) => {
              const balance = balances[key];
              return (
                <Grid item xs={12}>
                  <ModuleCard
                    cardDetails={{
                      name: formatCurrency(balance.balance),
                      status: balance.name,
                      icon: balance.icon,
                      textColor: balance.balance < 0 ? "red" : "green",
                    }}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        <Grid item xs={12} md={8}>
          <StockTable
            balances={balances}
            currentHeadline={currentHeadline.current}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default WithModal(UserPage);

const getBalances = (balances, prices, initialCashAmount) => {
  const totalPortfolio = Object.keys(prices).reduce(
    (acc, i) =>
      prices[i] && balances && balances.portfolio && balances.portfolio[i]
        ? acc + (prices[i] || 0) * (balances?.portfolio[i] || 0)
        : acc,
    0
  );
  const totalBalance = totalPortfolio + balances.cash;
  return {
    given: {
      name: "Given",
      icon: <MonetizationOnIcon />,
      balance: initialCashAmount,
    },
    totalBalance: {
      name: "Total Balance",
      icon: <SavingsIcon />,
      balance: totalBalance,
    },
    cash: {
      name: "Cash",
      icon: <MoneyIcon />,
      balance: balances.cash,
    },
    portfolio: {
      name: "Portfolio",
      icon: <AccountBalanceIcon />,
      balance: totalPortfolio,
    },
    pnl: {
      name: "Profit / Loss",
      icon: <CurrencyExchangeIcon />,
      balance: totalBalance - initialCashAmount,
    },
    spent: {
      name: "Cash Spent",
      icon: <ShoppingCartCheckoutIcon />,
      balance: initialCashAmount - balances.cash,
    },
  };
};
