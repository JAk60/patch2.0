import { createSlice } from "@reduxjs/toolkit";
import { MProwData } from "../pages/Phase_Manager/PhasetableData";

const initialState = {
  phase: [],
};

const phase = createSlice({
  name: "phase",
  initialState: initialState,
  reducers: {
    setPhase(state, action) {
      const phaseData = action.payload.phaseData;
      state.phase = [...state.phase, ...phaseData];
    },
    addPhase(state, action) {
      const newPhase = action.payload.newPhase;
      state.phase = [...state.phase, ...newPhase];
    },
    loadPhase(state, action) {
      const phase_data = action.payload.newPhase;
      // state.phase = [...phase_data];
      state.phase = phase_data;
    },
    //End of Reducers
  },
});

export default phase;
export const phaseActions = phase.actions;
