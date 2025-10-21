import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

const initialState = {
  elements: [],
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
  selectedNodeParent: "",
  selectedNodeParentName: "",
  selectedNodeSiblings: [],
};

const elements = createSlice({
  name: "elements",
  initialState: initialState,
  reducers: {
    addElement(state, action) {
      ;
      let ele = action.payload.ele;

      // Check if the added element is a component (excluding main nodes)
      if (ele.type === "component") {
        // Find the main node
        const mainNode = state.elements.find(node => node.type === "systemNode");

        // If a main node is found, add a connection from the main node to the new component
        if (mainNode) {
          state.elements.push({
            id: uuid(),
            type: "smoothstep", // Assuming this is the type of edge
            source: mainNode.id,
            target: ele.id,
            dtype: "edge",
          });
        }
      }

      state.elements.push(ele);
    },
    removeElement(state, action) {
      let ele = action.payload;
      state.elements = ele;
    },
    onConnect(state, action) {
      let ele = action.payload;
      state.elements = ele;
    },
    onHandleNameChange(state, action) {
      console.log(state.elements);
      let nodeName = action.payload.nodeName;
      let node = action.payload.node;
      state.elements.filter((x) => x.id === node.id)[0].data.label = nodeName;
      state.node.data.label = nodeName;
    },
    layoutChange(state, action) {
      let elements = action.payload.elements;
      state.elements = elements;
    },
    clearCanvas(state) {
      state.elements = []; // Clear the elements array
    },
    setNodeDetail(state, action) {
      let node = action.payload;
      state.node = node;
      const edgeSource = state.elements.filter(
        (x) => x.dtype === "edge" && x.target === state.node.id
      );
      if (edgeSource.length > 0) {
        state.selectedNodeParent = edgeSource[0].source;
        const filteredParent = state.elements.filter(
          (x) => x.id === edgeSource[0].source
        );
        state.selectedNodeParentName = filteredParent[0].data.label;
        const filteredSiblingsids = state.elements.filter(
          (x) =>
            x.dtype === "edge" &&
            x.source === edgeSource[0].source &&
            x.target !== state.node.id
        );
        state.selectedNodeSiblings = filteredSiblingsids.map((item, index) => {
          const filteredItem = state.elements.filter(
            (x) => x.id === item.target
          );
          if (filteredItem.length > 0) {
            return filteredItem[0];
          }
        });
      } else {
        state.selectedNodeParentName = "";
      }
    },
    updateParallelComponent(state, action) {
      const parallel_comp = action.payload.parallel_comp || []; // Check for null and set to empty array if null
      const color = action.payload.color;
      const data = {
        ...state.node.data,
        k: Number(action.payload.k),
        k_elh: Number(action.payload.k_elh),
        k_c: Number(action.payload.k_c),
        k_ds: Number(action.payload.k_ds),
        k_as: Number(action.payload.k_as),
        n: parallel_comp.length + 1,
        parallel_comp: parallel_comp,
      };
      let style = {
        background: color,
        border: "1px solid black",
        borderRadius: "5px",
        borderColor: "black",
        padding: '20px'
      };
      let edgeStyle = { stroke: color };
      //CHANGE COLOR OF SELECTED NODE
      let selectedNodeIndex = state.elements.findIndex(data => data.id === state.node.id)
      state.elements[selectedNodeIndex] = {
        ...state.elements[selectedNodeIndex],
        data,
        style
      }
      //OLD LOGIC - ADDS DUPLICATE NODES
      // const ele = state.elements.map((item, index) => {
      //   if (item.id === state.node.id) {
      //     return {
      //       ...item,
      //       data,
      //       style,
      //     };
      //   }
      //   return item;
      // });
      //CHANGE COLOR OF PARALLEL NODES AND UPDATE PARALLEL COMPS
      const ele2 = parallel_comp.map((item, index) => {
        const p_ele_index = state.elements.findIndex(
          (x) => x.id === item.value
        );
        state.elements[p_ele_index] = {
          ...state.elements[p_ele_index],
          style,
          data: {
            ...state.elements[p_ele_index].data,
            k: Number(action.payload.k),
            k_elh: Number(action.payload.k_elh),
            k_c: Number(action.payload.k_c),
            k_ds: Number(action.payload.k_ds),
            k_as: Number(action.payload.k_as),
            n: parallel_comp.length + 1,
            parallel_comp: [...parallel_comp.filter(pc => pc.value !== item.value), { value: state.node.id, label: data.label }]
          }
        };
      });
      //CHANGE EDGE COLORS
      const ele3 = parallel_comp.map((item, index) => {
        const edgeId = state.elements.findIndex(
          (x) =>
            x.target === item.value && x.source === state.selectedNodeParent
        );
        state.elements[edgeId] = {
          ...state.elements[edgeId],
          style: edgeStyle,
          type: "smoothstep",
          animated: false,
        };
      });

      //Changing color of edge to clicked node
      let clickedNodeEdgeIndex = state.elements.findIndex(
        (x) => x.target === state.node.id
      );
      if (clickedNodeEdgeIndex !== -1) {
        state.elements[clickedNodeEdgeIndex] = {
          ...state.elements[clickedNodeEdgeIndex],
          style: edgeStyle,
          animated: false,
          type: "smoothstep",
        };
      }
      // state.elements = [...ele, ...ele2, ...ele3, clickedNodeEdge];
      // state.elements = [...state.elements, clickedNodeEdge];
    },
    onUpdateKNHandler(state, action) {
      const selectedNodes = action.payload.nodes;
      let color = action.payload.color;
      let edgeStyle = { stroke: color };
      const ele1 = selectedNodes.map((item, index) => {
        const filtered_item = state.elements.filter(
          (x) => x.id === item.value
        )[0];
        const data = { ...filtered_item.data, k: 2, n: 4, swR: 0.8 };
        return {
          ...filtered_item,
          data: data,
        };
      });
      //Update Edge
      const edge1 = selectedNodes.map((item, index) => {
        const filterEdge = state.elements.filter(
          (x) => x.target === item.value
        )[0];
        return {
          ...filterEdge,
          style: edgeStyle,
          animated: true,
        };
      });
      state.elements = [...state.elements, ...ele1, ...edge1];
    },
    onRestoreHandler(state, action) {
      const elements = action.payload.elements;
      state.elements = elements;
    }, //Last line
  },
});

export const elementActions = elements.actions;
export default elements;