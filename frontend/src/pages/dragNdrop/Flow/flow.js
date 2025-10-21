/* eslint-disable react-hooks/exhaustive-deps */
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
import dagre from "dagre";
import React, { useCallback, useEffect, useState } from "react";
import { ContextMenu, ContextMenuTrigger } from "react-contextmenu";
import ReactFlow, {
	addEdge,
	Background,
	Controls,
	isNode,
	ReactFlowProvider,
	removeElements,
} from "react-flow-renderer";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import { elementActions } from "../../../store/elements";
import CustomNode from "../CustomNode/CustomNode";
import "./flow.css";
import customCSSClasses from "./flow.module.css";

const nodeTypes = {
	systemNode: CustomNode,
};

const styles = {
	background: "#EEEEEE",
	width: "100%",
	height: "100%",
};
const useStyles = makeStyles((theme) => ({
	horizontalButton: {
		background: "rgb(223, 222, 222)",
		width: "150px",
		marginLeft: "0.8rem",
		border: "0",
		borderRadius: "5px",
		color: "Black",
		padding: "10px",
	},
	verticalButton: {
		background: "rgb(223, 222, 222)",
		width: "150px",
		marginLeft: "0.8rem",
		border: "0",
		borderRadius: "5px",
		color: "Black",
		padding: "10px",
	},
	clearButton: {
		background: "rgb(223, 222, 222)",
		width: "150px",
		marginLeft: "0.8rem",
		border: "0",
		borderRadius: "5px",
		color: "Black",
		padding: "10px",
	},
	activeButton: {
		// Add styles for the active button if needed
		// For example, you can add a different background color
		background: "rgb(4, 50, 93)",
		color: "white",
	},
}));
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
// In order to keep this example simple the node width and height are hardcoded.
// In a real world app you would use the correct width and height values of
// const nodes = useStoreState(state => state.nodes) and then node.__rf.width, node.__rf.height

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (elements, direction = "LR") => {
	const isHorizontal = direction === "LR";
	dagreGraph.setGraph({ rankdir: direction });

	elements.forEach((el) => {
		if (isNode(el)) {
			dagreGraph.setNode(el.id, { width: nodeWidth, height: nodeHeight });
		} else {
			dagreGraph.setEdge(el.source, el.target);
		}
	});

	dagre.layout(dagreGraph);

	return elements.map((el) => {
		if (isNode(el)) {
			const nodeWithPosition = dagreGraph.node(el.id);
			el.targetPosition = isHorizontal ? "left" : "top";
			el.sourcePosition = isHorizontal ? "right" : "bottom";

			// Adjust the position to match the react flow node anchor point (top left)
			el.position = {
				x: nodeWithPosition.x,
				y: nodeWithPosition.y,
			};
		}

		return el;
	});
};

const Flow = ({
	reactFlowInstance,
	reactFlowWrapper,
	setReactFlowInstance,
	boolcanvas,
	setBoolCanvas,
	clearCanvas,
	setClearCanvas,
	setIsNodeAddedMap,
	setNomenclature,
	setValue,
	setSelectAllNomenclature,
	setSelectAllEquipments,
}) => {
	const classes = useStyles();
	const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
	const [activeButton, setActiveButton] = useState("LR");
	const dispatch = useDispatch();
	const ielements = useSelector((state) => state.elements.elements);
	const currentShipName = useSelector((state) => state.userSelection.currentSelection.shipName);
	useEffect(() => {
		// Set the default layout to "LR" (left to right)
		const defaultLayoutDirection = "LR";
		let elements = JSON.parse(JSON.stringify(ielements));
		const layoutedElements = getLayoutedElements(
			elements,
			defaultLayoutDirection
		);
		dispatch(elementActions.layoutChange({ elements: layoutedElements }));
	}, [boolcanvas]);

	const handleCloseSnackbar = () => {
		setIsSnackbarOpen(false);
	};


	const onElementsRemove = (elementsToRemove) => {
		let ele = removeElements(elementsToRemove, ielements);
		dispatch(elementActions.removeElement(ele));
	};
	const onConnect = (params) => {
		params.type = "smoothstep";
		params.id = uuid();
		params.dtype = "edge";
		let ele = addEdge(params, ielements);
		dispatch(elementActions.onConnect(ele));
	};
	const onDragOver = (event) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	};
	const onElementClick = (event, node) => {
		dispatch(elementActions.setNodeDetail(node));
	};
	const onLoad = (_reactFlowInstance) => {
		setReactFlowInstance(_reactFlowInstance);

		// Find the main node
		const mainNode = ielements.find((node) => node.type === "systemNode");

		// If a main node is found, connect all components to it
		if (mainNode) {
			const componentNodes = ielements.filter(
				(node) => node.type === "component"
			);
			const edgesToAdd = componentNodes.map((componentNode) => ({
				id: uuid(),
				type: "smoothstep", // Assuming this is the type of edge
				source: mainNode.id,
				target: componentNode.id,
				dtype: "edge",
			}));

			dispatch(elementActions.onConnect(edgesToAdd));
		}
	};

	const onLayout = useCallback(
		(direction) => {
			let elements = JSON.parse(JSON.stringify(ielements));
			const layoutedElements = getLayoutedElements(elements, direction);
			dispatch(
				elementActions.layoutChange({ elements: layoutedElements })
			);
			setActiveButton(direction);
		},
		[ielements]
	);

	const onContextMenu = (e) => {
		e.preventDefault();
		return <ContextMenu></ContextMenu>;
	};
	const onDrop = (event) => {
		event.preventDefault();
		const type = event.dataTransfer.getData("application/reactflow");

		// Check if a root node of type 'systemNode' already exists
		const isRootNodeExist = ielements.some(element => element.type === "systemNode");
		if (type === "systemNode" && isRootNodeExist) {
			alert("System already exists!");
			return;
		}
		// Create the new node with specified properties
		const newNode = {
			id: uuid(),
			type: "component",
			position: { x: 150, y: 150 },
			data: { label: "New Component" },
			dtype: "node",
			style: {
				background: "blue",
				color: "white",
			},
		};

		// Dispatch action to add the new element
		dispatch(elementActions.addElement({ ele: newNode }));
	};


	const onHoverBegin = (event, node) => {

		if ("parallel_comp" in node.data) {

			document.getElementById("tooltip").innerHTML =
				`<h4>ship name: ${currentShipName}</h4>
			<h4>${node.data.label}</h4>
			<div>
				<h3>K/N Configuration</h3>
				<div style="display: flex; flex-direction: column;">
				  <Typography variant="h5">HARBOUR: ${node.data.k} / ${node.data.n}</Typography>
				  <Typography variant="h5">ACTION STATION: ${node.data.k_as} / ${node.data.n}</Typography>
				  <Typography variant="h5">CRUISE: ${node.data.k_c} / ${node.data.n}</Typography>
				  <Typography variant="h5">DEFENSE STATION: ${node.data.k_ds} / ${node.data.n}</Typography>
				  <Typography variant="h5">ENTRY LEAVING HARBOUR: ${node.data.k_elh} / ${node.data.n}</Typography>
				</div>
				<p>Parallel Components: ${node.data.parallel_comp.map((item) => item.label)}</p>
				<hr />
			  </div>`;

			document.getElementById("tooltip").style.opacity = 1;
		}
	};


	const duringHover = (event, node) => {
		document.getElementById("tooltip").style.left = event.pageX - 20 + "px";
		document.getElementById("tooltip").style.top = event.pageY - 110 + "px";
	};

	const onHoverEnd = (event, node) => {
		document.getElementById("tooltip").style.opacity = 0;
		document.getElementById("tooltip").innerHTML = null;
	};
	const handleClear = () => {
		dispatch(elementActions.clearCanvas());
		setIsSnackbarOpen(true);
		setActiveButton("LR");
		setIsNodeAddedMap({});
		setClearCanvas(true);
		setBoolCanvas(true);
		setNomenclature([]);
		setValue([]);
		setSelectAllNomenclature(false);
		setSelectAllEquipments(false);
	};


	return (
		<>
			<ContextMenuTrigger id="same_unique_identifier">
				<ReactFlowProvider>
					<div className={customCSSClasses.react_flow_pane_parent}>
						<div
							style={{ height: "98vh", width: "100%" }}
							ref={reactFlowWrapper}
						>
							<ReactFlow
								style={styles}
								elements={ielements}
								onElementsRemove={onElementsRemove}
								onConnect={onConnect}
								onDrop={onDrop}
								onLoad={onLoad}
								onDragOver={onDragOver}
								nodeTypes={nodeTypes}
								onElementClick={onElementClick}
								onNodeContextMenu={onContextMenu}
								// onNodeDoubleClick={onDoubleClick}
								fitView
								onNodeMouseEnter={onHoverBegin}
								onNodeMouseMove={duringHover}
								onNodeMouseLeave={onHoverEnd}
							>
								<div id="tooltip"></div>
								<Controls></Controls>
								<Background></Background>
							</ReactFlow>
						</div>
						<div
							className={`controls + ' ' + ${customCSSClasses.control_div}`}
						>
							<button
								className={`${classes.horizontalButton} ${activeButton === "LR"
									? classes.activeButton
									: ""
									}`}
								onClick={() => onLayout("LR")}
							>
								Horizontal Layout
							</button>
							<button
								className={`${classes.verticalButton} ${activeButton === "TB"
									? classes.activeButton
									: ""
									}`}
								onClick={() => onLayout("TB")}
							>
								Vertical Layout
							</button>
							<button
								className={`${classes.clearButton}`}
								onClick={handleClear}
							>
								Clear Layout
							</button>

						</div>
					</div>
				</ReactFlowProvider>
			</ContextMenuTrigger>
			<Snackbar
				open={isSnackbarOpen}
				autoHideDuration={3000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			>
				<MuiAlert onClose={handleCloseSnackbar} severity="success">
					Canvas cleared!
				</MuiAlert>
			</Snackbar>
		</>
	);
};

export default Flow;
