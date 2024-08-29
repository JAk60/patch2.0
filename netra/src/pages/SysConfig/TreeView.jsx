import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@material-ui/core";
import React, { useCallback, useState } from "react";
import ReactFlow, {
	Background,
	Controls,
	ReactFlowProvider,
} from "react-flow-renderer";
import { useSelector } from "react-redux";
import { transformData } from "./transformData";

const HierarchyTree = ({ nodes, edges, elements, data }) => {
	const [open, setOpen] = useState(false);
	const [selectedNode, setSelectedNode] = useState(null);

	const onNodeClick = useCallback(
		(event, node) => {
			const selectedNodeData = data.find(
				(item) => item.name === node.data.label
			);
			if (selectedNodeData) {
				setSelectedNode(selectedNodeData);
				setOpen(true);
			} else {
				console.error(
					"Node data not found or node label does not match."
				);
			}
		},
		[data]
	);

	const handleClose = () => {
		setOpen(false);
		setSelectedNode(null);
	};

	const onLoad = (_reactFlowInstance) => {
		if (_reactFlowInstance && elements.length > 0) {
			_reactFlowInstance.fitView();
		}
	};

	return (
		<div style={{ height: "100vh", width: "100%" }}>
			<ReactFlowProvider>
				<ReactFlow
					elements={elements}
					onElementClick={onNodeClick}
					onlyRenderVisibleElements={true}
					onLoad={onLoad}
				>
					<Controls
						style={{ marginLeft: "20px", marginBottom: "20px" }}
					/>
					<Background variant="lines" color={"#000000"} />
				</ReactFlow>
			</ReactFlowProvider>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Node Information</DialogTitle>
				<DialogContent>
					{selectedNode && (
						<div>
							<p>Name: {selectedNode.name}</p>
							<p>Nomenclature: {selectedNode.nomenclature}</p>
							<p>Department: {selectedNode.department}</p>
							<p>Command: {selectedNode.command}</p>
							<p>Ship Name: {selectedNode.shipName}</p>
							<p>Ship Class: {selectedNode.shipClass}</p>
							<p>Ship Category: {selectedNode.shipCategory}</p>
							<p>Repair Type: {selectedNode.repairType}</p>
							<p>
								Can Be Replaced By Ship Staff:{" "}
								{selectedNode.canBeReplacedByShipStaff
									? "Yes"
									: "No"}
							</p>
							<p>
								Is System Param Recorded:{" "}
								{selectedNode.isSystemParamRecorded}
							</p>
							<p>PM Applicable: {selectedNode.pmApplicable}</p>
							<p>PM Interval: {selectedNode.pmInterval}</p>
							<p>LMU: {selectedNode.lmu}</p>
						</div>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

function TreeVisualization() {
	const data = useSelector((state) => state.treeData.treeData);

	if (data.length === 0) {
		return (
			<div
				className="App"
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "92vh",
					color: "red"
				}}
			>
				<h2>Please load the equipment in the CREATE SYSTEM tab.</h2>
			</div>
		);
	}

	const { nodes, edges } = transformData(data);
	const elements = [...nodes, ...edges];

	return (
		<HierarchyTree
			nodes={nodes}
			edges={edges}
			elements={elements}
			data={data}
		/>
	);
}

export default TreeVisualization;
