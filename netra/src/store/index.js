import { configureStore, combineReducers } from "@reduxjs/toolkit";
import treeData from "./TreeDataStore";
import phase from "./PhaseStore";
import userSelection from "./ApplicationVariable";
import elements from "./elements.js"
import taskData from "./taskStore";
import levelsReducer from "./Levels";
const reducers = combineReducers({
  treeData: treeData.reducer,
  phase: phase.reducer,
  userSelection: userSelection.reducer,
  elements: elements.reducer,
  taskData: taskData.reducer,
  LevelsData: levelsReducer
});

const store = configureStore({
  reducer: reducers,
});

export default store;
