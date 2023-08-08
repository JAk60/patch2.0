import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  L1: false,
  L2: false,
  L3: false,
  L4: false,
  L5: true,
};

const levelsSlice = createSlice({
  name: "levels",
  initialState,
  reducers: {
    setLevel: (state, action) => {
      const { level, value } = action.payload;
      state[level] = value;
    },
  },
});

export const { setLevel } = levelsSlice.actions;
export default levelsSlice.reducer;
