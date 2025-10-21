import { createSlice } from "@reduxjs/toolkit";
import { getTreeFromFlatData } from "react-sortable-tree";

const initialState = {
  treeData: [],
  sortTreeData: [],
  failureModes: [],
  selectedP: []
};

const treeData = createSlice({
  name: "treeData",
  initialState: initialState,
  reducers: {
    addElement(state, action) {
      state.treeData = [...state.treeData, ...action.payload.data];
      state.sortTreeData = getTreeFromFlatData({
        flatData: state.treeData.map((node) => ({ ...node, title: node.nomenclature })),
        getKey: (node) => node.id, // resolve a node's key
        getParentKey: (node) => node.parent, // resolve a node's parent's key
        rootKey: null, // The value of the parent key when there is no parent (i.e., at root level)
      });
    },
    setTreeData(state, action) {
      state.treeData = action.payload.treeData;
      state.failureModes = action.payload.failureModes;
      state.sortTreeData = getTreeFromFlatData({
        flatData: state.treeData.map((node) => ({ ...node, title: node.nomenclature })),
        getKey: (node) => node.id, // resolve a node's key
        getParentKey: (node) => node.parent, // resolve a node's parent's key
        rootKey: null, // The value of the parent key when there is no parent (i.e., at root level)
      });
    },
    setOnChangeTreeData(state, action) {
      state.sortTreeData = action.payload.treeData;
    },
    addChildElement(state, action) {
      const children = action.payload.children;
      const parentId = action.payload.parentId;
      state.treeData = [...state.treeData, ...children];
      state.treeData.filter((x) => x.id === parentId)[0].lmu = 0;
      state.sortTreeData = getTreeFromFlatData({
        flatData: state.treeData.map((node) => ({ ...node, title: node.nomenclature })),
        getKey: (node) => node.id, // resolve a node's key
        getParentKey: (node) => node.parent, // resolve a node's parent's key
        rootKey: null, // The value of the parent key when there is no parent (i.e., at root level)
      });
    },
    setFailureModes(state, action) {
      state.failureModes = action.payload;
    },
    setP(state, action) {
      state.selectedP = action.payload;
    },
    //End of reducers
  },
});

export const treeDataActions = treeData.actions;
export default treeData;
