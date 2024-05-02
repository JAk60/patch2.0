import React, { useState } from "react";
import { Modal, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";

const TreeVisualization = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const data = useSelector((state) => state.treeData.sortTreeData);

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  const handleCloseModal = () => {
    setSelectedNode(null);
  };

  const renderNode = (node, level = 0) => {
    return (
      <div
        key={node.id}
        style={{
          marginLeft: `${level * 20}px`,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
        onClick={() => handleNodeClick(node)}
      >
        <div
          style={{
            width: "10px",
            height: "10px",
            backgroundColor: "gray",
            borderRadius: "50%",
            marginRight: "5px",
          }}
        />
        <span>{node.title}</span>
        {node.children && (
          <div style={{ marginLeft: "10px" }}>
            {Array.isArray(node.children)
              ? node.children.map((child) => renderNode(child, level + 1))
              : renderNode(node.children, level + 1)}
          </div>
        )}
      </div>
    );
  };
  if (!data || data.length === 0) {
    return (
      <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
        width: "90vw",
      }}>
        <Typography variant="h5">
          No parent-child relationship found.
        </Typography>
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
        width: "90vw",
      }}
    >
      {renderNode(data["0"])}
      {/* Modal to display when a node is clicked */}
      <Modal open={Boolean(selectedNode)} onClose={handleCloseModal}>
        <div
          style={{
            margin: "auto",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6">
            {selectedNode ? `###### **${selectedNode.name}**` : ""}
          </Typography>
          {selectedNode && (
            <>
              <p>ID: {selectedNode.id}</p>
              <p>Name: {selectedNode.name}</p>
              <p>Nomenclature: {selectedNode.nomenclature}</p>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default TreeVisualization;