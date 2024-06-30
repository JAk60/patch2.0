// export const transformData = (data) => {
//     const nodesMap = new Map();
//     const edges = [];

//     // First pass: create nodes
//     data.forEach((item) => {
//         nodesMap.set(item.component_id, {
//             id: item.component_id,
//             parent_id: item.parent_id,
//             data: { label: item.component_name },
//             position: { x: 0, y: 0 },
//             children: [],
//         });
//     });

//     // Second pass: build tree structure
//     data.forEach((item) => {
//         const node = nodesMap.get(item.component_id);
//         const parent = nodesMap.get(item.parent_id);
//         if (parent) {
//             parent.children.push(node);
//         }
//     });

//     // Find the root node
//     const root = Array.from(nodesMap.values()).find(node => node.parent_id === null);

//     // Set positions recursively
//     const horizontalSpacing = 200;
//     const verticalSpacing = 100;

//     const setPositions = (node, x, y, availableWidth) => {
//         node.position = { x, y };

//         if (node.children.length > 0) {
//             const childrenWidth = availableWidth / node.children.length;
//             let startX = x - (availableWidth / 2) + (childrenWidth / 2);

//             node.children.forEach((child, index) => {
//                 const childX = startX + index * childrenWidth;
//                 setPositions(child, childX, y + verticalSpacing, childrenWidth);

//                 edges.push({
//                     id: `e${node.id}-${child.id}`,
//                     source: node.id,
//                     target: child.id,
//                     animated: true,
//                 });
//             });
//         }
//     };

//     // Calculate the width needed for the entire tree
//     const getTreeWidth = (node) => {
//         if (node.children.length === 0) return horizontalSpacing;
//         return Math.max(
//             horizontalSpacing,
//             node.children.reduce((sum, child) => sum + getTreeWidth(child), 0)
//         );
//     };

//     const treeWidth = getTreeWidth(root);
//     setPositions(root, 0, 0, treeWidth);

//     // Convert nodesMap values to array
//     const nodes = Array.from(nodesMap.values());

//     return { nodes, edges };
// };

export const transformData = (data) => {
    const nodesMap = new Map();
    const edges = [];

    // First pass: create nodes
    data.forEach((item) => {
        nodesMap.set(item.id, {
            id: item.id,
            parent_id: item.parentId,
            data: { label: item.name },
            position: { x: 0, y: 0 },
            children: [],
        });
    });

    // Second pass: build tree structure
    data.forEach((item) => {
        const node = nodesMap.get(item.id);
        const parent = nodesMap.get(item.parentId);
        if (parent) {
            parent.children.push(node);
        }
    });

    // Find the root node
    const root = Array.from(nodesMap.values()).find(node => node.parent_id === null);

    // Set positions recursively
    const horizontalSpacing = 200;
    const verticalSpacing = 100;

    const setPositions = (node, x, y, availableWidth) => {
        node.position = { x, y };

        if (node.children.length > 0) {
            const childrenWidth = availableWidth / node.children.length;
            let startX = x - (availableWidth / 2) + (childrenWidth / 2);

            node.children.forEach((child, index) => {
                const childX = startX + index * childrenWidth;
                setPositions(child, childX, y + verticalSpacing, childrenWidth);

                edges.push({
                    id: `e${node.id}-${child.id}`,
                    source: node.id,
                    target: child.id,
                    animated: true,
                });
            });
        }
    };

    // Calculate the width needed for the entire tree
    const getTreeWidth = (node) => {
        if (node.children.length === 0) return horizontalSpacing;
        return Math.max(
            horizontalSpacing,
            node.children.reduce((sum, child) => sum + getTreeWidth(child), 0)
        );
    };

    const treeWidth = getTreeWidth(root);
    setPositions(root, 0, 0, treeWidth);

    // Convert nodesMap values to array
    const nodes = Array.from(nodesMap.values());

    return { nodes, edges };
};