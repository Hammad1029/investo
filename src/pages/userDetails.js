import { Box } from "@mui/material";
import GenericForm from "../generic/GenericForm";
import { useFormik } from "formik";
import { getAuth } from "firebase/auth";
import * as Yup from "yup";
import { doc, setDoc } from "firebase/firestore";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/settings.slice";
import { firebaseDB } from "../firebase.config";

const UserDetails = ({ closeModal }) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const dispatch = useDispatch();

  const initialCashAmount = useSelector((state) => state.settings.game.initial);

  const formik = useFormik({
    initialValues: {
      admin: false,
      email: currentUser.email,
      teamName: "",
      teamMembers: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required(),
      teamName: Yup.string().min(3, "Atleast 3 characters").required(),
      teamMembers: Yup.string()
        .matches(
          /^([a-zA-Z]+(?: [a-zA-Z]+)?)(,[a-zA-Z]+(?: [a-zA-Z]+)?)*$/,
          "Comma seperated names"
        )
        .required(),
      admin: Yup.boolean().required(),
    }).required(),
    onSubmit: async (values) => {
      try {
        dispatch(setLoading(true));
        const docRef = doc(firebaseDB, "users", currentUser.email);
        const user = await setDoc(docRef, {
          ...values,
          cash: initialCashAmount,
          portfolio: {},
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
    <Box>
      <GenericForm
        formik={formik}
        fieldXs={12}
        formFields={[
          { name: "email", disabled: true },
          "teamName",
          { name: "teamMembers", label: "Team Members (comma seperated)" },
        ]}
      />
    </Box>
  );
};

export default UserDetails;
