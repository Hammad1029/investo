import Box from "@mui/material/Box";
import { useFormik } from "formik";
import HorizontalTable from "../generic/HorizontalTable";
import GenericForm from "../generic/GenericForm";
import { Grid, InputAdornment } from "@mui/material";
import * as Yup from "yup";
import { firebaseDB } from "../firebase.config";
import { doc, updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { NotificationManager } from "react-notifications";
import { setLoading } from "../redux/settings.slice";

const StockModal = ({ closeModal, details, currentHeadline }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      quantity: 0,
      amount: 0,
      buySell: "buy",
    },
    validationSchema: Yup.object({
      quantity: Yup.number()
        .min(0.01, "Need atleast 0.01")
        .when("buySell", {
          is: "sell",
          then: (schema) => schema.max(details.owned, "Not enough owned"),
          otherwise: (schema) => schema,
        })
        .required("Quantity is required"),
      amount: Yup.number()
        .when("buySell", {
          is: "buy",
          then: (schema) => schema.max(details.cash, "Not enough cash"),
          otherwise: (schema) => schema,
        })
        .required("Amount is required"),
      buySell: Yup.string().oneOf(["buy", "sell"]).required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        dispatch(setLoading(true));
        const docRef = doc(firebaseDB, "users", user.email);
        await updateDoc(docRef, {
          portfolio: {
            ...user.portfolio,
            [details.name]:
              details.owned +
              (values.buySell === "buy" ? +values.quantity : -values.quantity),
          },
          cash:
            details.cash +
            (values.buySell === "sell" ? +values.amount : -values.amount),
        });
        closeModal();
      } catch (e) {
        console.error(e);
        NotificationManager.error("Something went wrong");
      } finally {
        dispatch(setLoading(false));
      }
    },
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <GenericForm
          formik={formik}
          fieldXs={12}
          formFields={[
            {
              name: "quantity",
              type: "number",
              onChange: (v) =>
                formik.setFieldValue("amount", v * details.price),
              props: {
                InputProps: {
                  endAdornment: (
                    <InputAdornment position="end">Units</InputAdornment>
                  ),
                },
              },
            },
            {
              name: "amount",
              type: "number",
              onChange: (v) =>
                formik.setFieldValue("quantity", v / details.price),
              props: {
                InputProps: {
                  endAdornment: (
                    <InputAdornment position="end">PKR</InputAdornment>
                  ),
                },
              },
            },
            { name: "buySell", type: "select", options: ["buy", "sell"] },
          ]}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <HorizontalTable data={details} />
      </Grid>
    </Grid>
  );
};

export default StockModal;
