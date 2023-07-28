import React from "react";
import Layout from "./Layout/layout";
import { ReactFlowProvider } from "react-flow-renderer";
const DragNDrop=(props)=>{  
    return (
    <ReactFlowProvider>
      <Layout />
    </ReactFlowProvider>
  );
}

export default DragNDrop;