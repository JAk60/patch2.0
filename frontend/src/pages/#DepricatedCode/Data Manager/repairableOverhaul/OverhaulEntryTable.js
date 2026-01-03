import { AgGridColumn, AgGridReact } from "ag-grid-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";



const OverhaulEntryTable = (props) => {
    const currSelectedData = useSelector(
        (state) => state.userSelection.currentSelection
    );
    const [currAge, setCurrAge] = useState("0");
    const currNomenclature = currSelectedData.nomenclature;
    const currShipName = currSelectedData.shipName;
    const currEquipmentName = currSelectedData.equipmentName;
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [secondRows, setSecondRows] = useState([]);
    const onGridReady = (params) => {
        setGridApi(params.api);
        // props.setGrid(params.api);
        setGridColumnApi(params.columnApi);
        params.api.sizeColumnsToFit();
    };

    const numOverhaulColumns = [
        <AgGridColumn
            field="nomenclature"
            headerName="Equipment Nomenclature"
            headerTooltip="Equipment Nomenclature"
            width={500}
        // editable={true}
        />,
        <AgGridColumn
            field="runAge"
            headerName="Performed at Running Age (hours)"
            headerTooltip="Performed at Running Age (hours)"
            width={500}
            editable={true}
        />,
    ];

    let secondRowHeight = 120;
    if (secondRows.length > 0 && secondRows.length > 2) {
        secondRowHeight = 200;
    }

    const saveModifiedRows = (params) => {
        const allRowData = [];
        gridApi.forEachNode((node) => allRowData.push(node.data));
        console.log(allRowData);
        props.secondTableDataUpdate(allRowData, true);
    };

    useEffect(() => {
        if (currNomenclature) {
            const payload = {
                ship_name: currShipName,
                equipment_name: currEquipmentName,
                nomenclature: currNomenclature,
            };
            fetch("/api/get_overhaul_hours", {
                method: "POST",
                body: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    if (data.code) {
                        setCurrAge(data.result);
                    } else {
                        setCurrAge("0");
                    }
                });
        } else {
            // Handle the case when currNomenclature is null or empty
            setCurrAge("0"); // Reset currAge to "0"
        }
    }, [currNomenclature]);

    useEffect(() => {
        if (currNomenclature) {
            const newRow = {
                nomenclature: currNomenclature,
                runAge: currAge, // Use the updated currAge state
                shipName: currShipName,
                equipmentName: currEquipmentName
            };
            setSecondRows([newRow]);
            props.tableUpdate({ mainTable: [], subTable: [newRow] });
        } else {
            setSecondRows([]); // Clear the data
        }
    }, [currNomenclature, currAge]);


    return (
        <>
            {currNomenclature && <div
                className="ag-theme-alpine"
                style={{ height: secondRowHeight, width: "100%", marginBottom: "2rem" }}
            >
                <AgGridReact
                    defaultColDef={{
                        flex: 1,
                        resizable: true,
                        filter: true,
                        sortable: true,
                    }}
                    rowData={secondRows}
                    // columnDefs={props.columnDefs}
                    onGridReady={onGridReady}
                    onCellValueChanged={saveModifiedRows}
                >
                    {numOverhaulColumns}
                </AgGridReact>
            </div>
            }
        </>
    )
}

export default OverhaulEntryTable