import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  taskData: [],
  currentShip: "",
  currentTaskName: ""
};

const taskData = createSlice({
  name: "taskData",
  initialState: initialState,
  reducers: {
    onLoad(state, action) {
      debugger;
      const data = action.payload.taskData;
      // const ship = action.payload.ship;
      state.taskData = {
        ...state.taskData,
        ...data,
      };
    },
    updateCurrentShip(state, action){
      debugger
      const ship = action.payload.ship;
      state.currentShip = ship
      // , "ship": setselectedShipName, "task": setselectedTaskName
    },
    updateCurrentTask(state, action){
      debugger
      const task = action.payload.task;
      state.currentTaskName = task;
      // , "ship": setselectedShipName, "task": setselectedTaskName
    }
    // end of reducers
  },
});

export default taskData;
export const taskActions = taskData.actions;
