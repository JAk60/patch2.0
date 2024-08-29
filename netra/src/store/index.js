import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSelection from "./ApplicationVariable";
import elements from "./elements.js";
import levelsReducer from "./Levels";
import taskData from "./taskStore";
import treeData from "./TreeDataStore";
const reducers = combineReducers({
  treeData: treeData.reducer,
  userSelection: userSelection.reducer,
  elements: elements.reducer,
  taskData: taskData.reducer,
  LevelsData: levelsReducer
});

const store = configureStore({
  reducer: reducers,
});

export default store;
