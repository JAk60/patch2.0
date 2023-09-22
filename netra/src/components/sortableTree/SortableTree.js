import React, { useState, useEffect } from "react";
import SortableTree, { getTreeFromFlatData } from "react-sortable-tree";
import FileExplorerTheme from "react-sortable-tree-theme-full-node-drag";
import treeDataT from "./SortableTreeData";
import { treeDataActions } from "../../store/TreeDataStore";
import { useSelector, useDispatch } from "react-redux";
import 'react-sortable-tree/style.css' 

const TreeComponent = (props) => {
  debugger;
  const dispatch = useDispatch();
  const fData = useSelector((state) => state.treeData.treeData);
  const tData = useSelector((state) => state.treeData.sortTreeData);
  let treeData = getTreeFromFlatData({
    flatData: fData.map((node) => ({ ...node, title: node.name })),
    getKey: (node) => node.id, // resolve a node's key
    getParentKey: (node) => node.parent, // resolve a node's parent's key
    rootKey: null, // The value of the parent key when there is no parent (i.e., at root level)
  });
  const [treeDataS, setTreeData] = useState(treeData);
  const onChangeTree = (treeD) => {
    dispatch(
      treeDataActions.setOnChangeTreeData({
        treeData: treeD,
      })
    );
  };
  console.log("tdata", tData)
  return (
    <div style={{ height: props.height }}>
      <SortableTree
        treeData={tData}
        // onChange={(treeDataS) => setTreeData(treeDataS)}
        onChange={(tData) => onChangeTree(tData)}
        theme={FileExplorerTheme}
        isVirtualized={false}
      />
    </div>
  );
};
export default TreeComponent;
