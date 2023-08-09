import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  L1: false,
  L2: false,
  L3: false,
  L4: false,
  L5: false,
  L6: false,
};

const levelsSlice = createSlice({
  name: "levels",
  initialState,
  reducers: {
    setLevel: (state, action) => {
      const { level, value } = action.payload;
      return {
        ...state,
        [level]: value,
      };
    },
    resetLevels: (state,action) =>{
      return action.payload
    },
  },
});


export const { setLevel,resetLevels } = levelsSlice.actions;
export default levelsSlice.reducer;
