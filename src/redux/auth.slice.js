import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  user: {
    admin: false,
    cash: 0,
    email: "",
    portfolio: {},
    teamName: "",
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    loginUser: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.isLoggedIn = false;
      state = initialState;
    },
    setTeamDetails: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { loginUser, logoutUser, setTeamDetails } = authSlice.actions;

export default authSlice.reducer;
