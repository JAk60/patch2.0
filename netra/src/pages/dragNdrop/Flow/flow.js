import { useSelector, useDispatch } from "react-redux";
import React, { useCallback, useRef, useState } from "react";
import { ContextMenu, ContextMenuTrigger } from "react-contextmenu";
import { v4 as uuid } from "uuid";
import ReactFlow, {
  addEdge,
  removeElements,
  Background,
  ReactFlowProvider,
  Controls,
  isNode,
} from "react-flow-renderer";
import CustomNode from "../CustomNode/CustomNode";
import dagre from "dagre";
import { elementActions } from "../../../store/elements";
import customCSSClasses from "./flow.module.css";
import "./flow.css";
import CustomContextMenu from "../ContextMenu/contextMenu";

const nodeTypes = {
  systemNode: CustomNode,
};

const styles = {
  background: "#EEEEEE",
  width: "100%",
  height: "100%",
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// In order to keep this example simple the node width and height are hardcoded.
// In a real world app you would use the correct width and height values of
// const nodes = useStoreState(state => state.nodes) and then node.__rf.width, node.__rf.height

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (elements, direction = "TB") => {
  debugger;
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

      // unfortunately we need this little hack to pass a slightly different position
      // to notify react flow about the change. Moreover we are shifting the dagre node position
      // (anchor=center center) to the top left so it matches the react flow node anchor point (top left).
      el.position = {
        x: nodeWithPosition.x,
        y: nodeWithPosition.y,
      };
    }

    return el;
  });
};

const Flow = ({reactFlowInstance,reactFlowWrapper,setReactFlowInstance}) => {
  const dispatch = useDispatch();
  
  const ielements = useSelector((state) => state.elements.elements);
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
  const onLoad = (_reactFlowInstance) =>
    setReactFlowInstance(_reactFlowInstance);

  const onLayout = useCallback(
    (direction) => {
      let elements = JSON.parse(JSON.stringify(ielements));
      const layoutedElements = getLayoutedElements(elements, direction);
      dispatch(elementActions.layoutChange({ elements: layoutedElements }));
    },
    [ielements]
  );

  const onContextMenu = (e) => {
    e.preventDefault();
    return <ContextMenu></ContextMenu>;
  };
  const onDrop = (event) => {
    event.preventDefault();
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData("application/reactflow");
    if (type === "systemNode") {
      let isRootNodeExist =
        ielements.filter((x) => x.type === "systemNode").length > 0;
      if (isRootNodeExist) {
        alert("System already exist!!");
        return false;
      }
    }

    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    let style = {};
    if (type === "output") {
      style = {
        border: "2px solid black",
        borderRadius: "5px",
        background: "#DCFFC0",
        borderColor: "black",
      };
    } else {
      style = {
        border: "2px solid black",
        borderRadius: "5px",
        background: "#FFFBDA",
      };
    }
    const newNode = {
      id: uuid(),
      type,
      position,
      data: { label: `Please Define Name` },
      dtype: "node",
      style: style,
    };
    dispatch(elementActions.addElement({ ele: newNode }));
  };

  const onHoverBegin=(event, node)=>{
    // console.log(node)
    let pc=""
    
    if("parallel_comp" in node.data){
      node.data.parallel_comp.map(
        component=>{
          return(
            pc+="<br/>"+component.label
          )
          
        })
      document.getElementById('tooltip').innerHTML=
      `<h4>${node.data.label}</h4>`+"<p>Parallel Components:"+pc+"</p>"
      document.getElementById('tooltip').style.opacity = 1
      }
    
  }
  
  const duringHover=(event,node)=>{
    //console.log(event);
    debugger;
    document.getElementById('tooltip').style.left = event.pageX-20+"px"
    document.getElementById('tooltip').style.top = event.pageY-110+"px"
  }

  const onHoverEnd=(event, node)=>{
    document.getElementById('tooltip').style.opacity = 0
    document.getElementById('tooltip').innerHTML=null
  }

  return (<>
    <ContextMenuTrigger id="same_unique_identifier">
        
      
    <ReactFlowProvider>
      <div className={customCSSClasses.react_flow_pane_parent}>
        <div style={{ height: "98vh", width: "100%" }} ref={reactFlowWrapper}>
          <CustomContextMenu/>
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

            onNodeMouseEnter={onHoverBegin}
            onNodeMouseMove={duringHover}
            onNodeMouseLeave={onHoverEnd}
          >
            <div id="tooltip">
            </div>
            <Controls></Controls>
            <Background></Background>
          </ReactFlow>
        </div>
        <div className={`controls + ' ' + ${customCSSClasses.control_div}`}>
          <button className={customCSSClasses.horizontal} onClick={() => onLayout("LR")}>Horizontal Layout</button>
          <button className={customCSSClasses.vertical} onClick={() => onLayout("TB")}>Vertical Layout</button>
        </div>
      </div>
    </ReactFlowProvider>
    </ContextMenuTrigger>
    </>
  );
};

export default Flow;
