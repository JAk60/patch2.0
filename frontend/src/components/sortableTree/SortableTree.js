import React from "react";
import { useDispatch, useSelector } from "react-redux";
import SortableTree from "react-sortable-tree";
import FileExplorerTheme from "react-sortable-tree-theme-full-node-drag";
import 'react-sortable-tree/style.css';
import { treeDataActions } from "../../store/TreeDataStore";

const TreeComponent = (props) => {
  ;
  const dispatch = useDispatch();
  const tData = useSelector((state) => state.treeData.sortTreeData);
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
        onChange={(tData) => onChangeTree(tData)}
        theme={FileExplorerTheme}
        isVirtualized={false}
      />
    </div>
  );
};
export default TreeComponent;
