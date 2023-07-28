import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  node: {
    id: "",
    type: "",
    data: { label: "" },
    position: { x: 50, y: 50 },
    style: {
      background: "green",
      color: "white",
    },
  },
};
const nodeDetail = createSlice({
  name: "nodedetail",
  initialState: initialState,
  reducers: {
    setNodeDetail(state, action) {
      let node = action.payload;
      if (state.node.id !== node.id) {
        state.node = node;
      }
    }, //Last
  },
});

export const nodeDetailActions = nodeDetail.actions;
export default nodeDetail;
