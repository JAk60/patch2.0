import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userSelection: {
    shipName: [],
    shipCategory: [],
    shipClass: [],
    command: [],
    department: ["Insma", "WRSTG"],
    equipmentName: [],
    equipmentCode: [],
    nomenclature: [],
    Sensor: [],
    params: []
  },
  currentSelection: {
    shipName: "",
    shipCategory: "",
    shipClass: "",
    command: "",
    department: "",
    equipmentName: "",
    equipmentCode: "",
    nomenclature: "",
    Sensor: []
  },
  overhaulSecond: [],
  overhaulMain: [],
  componentsData: [],
};

const userSelection = createSlice({
  name: "userSelection",
  initialState: initialState,
  reducers: {
    populateParams(state, action) {
      const params = action.payload.params;
      // Update the Redux state with the new params data
      state.userSelection.params = params;
    },
    onChangeLoad(state, action) {
      const { filteredData, currentShipName } = action.payload;

      // Use immer to safely update state
      state.userSelection = {
        ...state.userSelection,
        ...filteredData,
      };
      state.currentSelection = {
        ...state.currentSelection,
        ...currentShipName,
      };
    }
    ,
    onChangeCurrentSelection(state, action) {
      const data = action.payload.selectedData;
      state.currentSelection = { ...state.currentSelection, ...data };
    },
    onReset(state, action) {
      state.currentSelection = {
        shipName: "",
        shipCategory: "",
        shipClass: "",
        command: "",
        department: "",
        equipmentName: "",
        equipmentCode: "",
        nomenclature: ""
      }
    },
    onAddingEquipmentName(state, action) {
      const { filteredData, selectedData } = action.payload;

      // Use immer to safely update state
      state.userSelection = {
        ...state.userSelection,
        ...filteredData,
      };
      state.currentSelection = {
        ...state.currentSelection,
        ...selectedData,
      };
    },
    populateEqName(state, action) {
      const data = action.payload.filteredData;
      state.userSelection = { ...state.userSelection, ...data };
    },
    populateNom(state, action) {
      const data = action.payload.filteredData;
      state.userSelection = { ...state.userSelection, ...data };
    },
    onUpdatingOverhauls(state, action) {
      const overhauls = action.payload.overHauls;
      state.overhaulSecond = [...overhauls];
    },
    onFirstLoad(state, action) {
      const data = action.payload.filteredData;
      state.userSelection = {
        ...state.userSelection,
        ...data,
      };
      const componentsData = action.payload.componentsData;
      state.componentsData = [...componentsData];
    },
    // end of reducers
  },
});

export default userSelection;
export const userActions = userSelection.actions;
