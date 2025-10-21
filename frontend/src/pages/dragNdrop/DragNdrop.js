import React from "react";
import Layout from "./Layout/layout";
import { ReactFlowProvider } from "react-flow-renderer";
import AccessControl from "../Home/AccessControl";
const DragNDrop = (props) => {
  return (
    <AccessControl allowedLevels={['L0','L1', 'L5']}>
      <ReactFlowProvider>
        <Layout />
      </ReactFlowProvider>
    </AccessControl>
  );
}

export default DragNDrop;