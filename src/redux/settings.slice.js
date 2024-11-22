import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  game: {
    end: false,
    length: 120,
    paused: false,
    start: false,
    startedAt: false,
    pauses: [],
    endAt: null,
    defaultUrl: "",
    initial: 0
  },
  loading: false,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState: initialState,
  reducers: {
    setSettings: (state, action) => {
      state.game = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    endGame: (state) => {
      state.game.end = true;
    },
  },
});

export const { setSettings, setLoading, endGame } = settingsSlice.actions;

export default settingsSlice.reducer;
