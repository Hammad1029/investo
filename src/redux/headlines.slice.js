import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  headlines: [],
};

export const headlinesSlice = createSlice({
  name: "headlines",
  initialState: initialState,
  reducers: {
    setHeadlines: (state, action) => {
      state.headlines = action.payload;
    },
  },
});

export const { setHeadlines } = headlinesSlice.actions;

export default headlinesSlice.reducer;
