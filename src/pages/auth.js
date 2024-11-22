import { Box, Container, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import GenericForm from "../generic/GenericForm";
import {
  getAuth,
  inMemoryPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { NotificationManager } from "react-notifications";
import { setLoading } from "../redux/settings.slice";
import { useState } from "react";

const AuthPage = (props) => {
  const auth = getAuth();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        dispatch(setLoading(true));
        await setPersistence(auth, inMemoryPersistence);
        const res = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
      } catch (e) {
        NotificationManager.error("Wrong credentials", "Error");
      } finally {
        dispatch(setLoading(false));
      }
    },
  });

  return (
    <Box
      component="main"
      sx={{
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexGrow: 1,
        minHeight: "100%",
        mt: 10,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ my: 3 }}>
          <Typography color="textPrimary" variant="h4">
            Sign in
          </Typography>
        </Box>
        <GenericForm
          formik={formik}
          formFields={[
            "email",
            {
              name: "password",
              type: "password",
              show: showPassword,
              toggle: toggleShowPassword,
            },
          ]}
          fieldXs={12}
        />
      </Container>
    </Box>
  );
};

export default AuthPage;
