import { Button, InputLabel, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, makeStyles } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../../store/ApplicationVariable";
import CustomizedSnackbars from "../../../ui/CustomSnackBar";
import CustomSelect from "../../../ui/Form/CustomSelect";
import styles from "./custom.module.css";

const Custom = () => {
    const [selectedShipName, setShipName] = useState([]);
    const [uniqueEqIds, setUniqueEqIds] = useState([]);
    const [averagedAlphaBeta, setAveragedAlphaBeta] = useState({
        component_name: "Average",
        alpha: 0,
        beta: 0,
    });

    const [userSelectionData, setUserSelectionData] = useState([]);
    const [selectedEqName, setEquipmentName] = useState([]);
    const [eqDataOption, setEqDataOption] = useState([]);
    const [nomenclatureDataOption, setNomenclatureDataOption] = useState([]);
    const [nomenclatureData, setNomenclatureData] = useState([]);
    const [alphaBetaData, setAlphaBetaData] = useState([]);
    const [selectedNomenclatures, setSelectedNomenclatures] = useState([]);

    const dispatch = useDispatch();
    const customSelectData = useSelector(
        (state) => state.userSelection.userSelection
    );

    const currSelectedData = useSelector(
        (state) => state.userSelection.currentSelection
    );
    const [SnackBarMessage, setSnackBarMessage] = useState({
        severity: "error",
        message: "",
        showSnackBar: false,
    });
    const onHandleSnackClose = () => {
        setSnackBarMessage({
            severity: "error",
            message: "",
            showSnackBar: false,
        });
    };

    console.log(currSelectedData);

    const calculateAverage = (data) => {
        const totalAlpha = data.reduce((sum, item) => sum + item.alpha, 0);
        const totalBeta = data.reduce((sum, item) => sum + item.beta, 0);
        const averageAlpha = totalAlpha / data.length;
        const averageBeta = totalBeta / data.length;
        return {
            component_name: "Average",
            alpha: averageAlpha,
            beta: averageBeta,
        };
    };


    useEffect(() => {
        fetch("/api/cm_dashboard", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                const params = data["parameters"];
                const user_selection = data["user_selection"]["data"];
                const eqData = data["user_selection"]["eqData"];
                const eqIds = data["user_selection"]["uniq_eq_data"];
                setUniqueEqIds(eqIds);
                const shipName = [...new Set(user_selection.map((x) => x.shipName))];
                setUserSelectionData(eqData);
                dispatch(userActions.populateParams({ params: params }));
                dispatch(
                    userActions.onChangeLoad({ filteredData: { shipName: shipName } })
                );
            });
    }, []);


    const changeShip = (e) => {
        var filteredEqData = [];

        var xx = userSelectionData
            .filter((x) => x.shipName === e.target.value)
            .map((x) => {
                let id = uniqueEqIds.filter((y) => y.name === x.equipmentName);
                return id[0];
            });
        filteredEqData = [...filteredEqData, ...xx];
        filteredEqData = [...new Set(filteredEqData)]
        console.log(filteredEqData, "This is equipment")
        setEqDataOption(filteredEqData);
        setShipName(e.target.value);
    };

    const dropDownStyle = makeStyles({
        root: {
            paddingLeft: 10,
            background: "#fff",
            border: "1px solid #0263a1",
            borderRadius: "5px",
            width: "320px",
            minHeight: "40px",
            boxShadow: "2px 3px 5px -1px rgba(0,0,0,0.2)",
        },
        inputRoot: {
            width: "100%",
        },
    });

    const classes = dropDownStyle();
    const currShipName = currSelectedData.shipName;
    const currEquipmentName = currSelectedData.equipmentName;
    const currNomenclature = currSelectedData.nomenclature;

    const handleSubmit = () => {
        // Your submit logic here
        console.log("Selected Ship Name:", selectedShipName);
        console.log("Selected Equipment Name:", selectedEqName);
        console.log("nomenclatures", selectedNomenclatures)


        const payload = {
            ship_name: selectedShipName,
            equipments: selectedNomenclatures,
        };
        fetch("/api/get_ship_alpha_beta", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                // Handle the fetched data, e.g. set it to state or perform other actions
                const convertedData = Object.keys(data).map((key) => ({
                    component_name: key,
                    alpha: data[key].alpha,
                    beta: data[key].beta,
                }));
                setAlphaBetaData(convertedData);
                const averagedData = calculateAverage(convertedData);
                setAveragedAlphaBeta(averagedData);
            })
            .catch((error) => {
                console.error("Error fetching alpha and beta values:", error);
            });
    };

    const handleSubmitCurrentShip = () => {
        // Your submit logic here for current ship details
        console.log("Submitting current ship details:", currShipName);

        const payload = {
            ship_name: currShipName,
            equipment_name: currEquipmentName,
            alpha: averagedAlphaBeta.alpha,
            beta: averagedAlphaBeta.beta
        };

        fetch("/api/update_alpha_beta", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                // Handle the response from the backend if needed
                console.log("Backend response:", data);
                setSnackBarMessage({
                    severity: "success",
                    message: data.message,
                    showSnackBar: true,
                })
            })
            .catch((error) => {
                setSnackBarMessage({
                    severity: "error",
                    message: error,
                    showSnackBar: true,
                })
            });
    };

    useEffect(() => {
        const filteredEqData = userSelectionData
            .filter(x => x.shipName === selectedShipName)
            .map(x => {
                const id = uniqueEqIds.find(y => y.nomenclature === x.nomenclature)
                return id ? id : null
            })
            .filter((id) => id !== null);
        console.log(filteredEqData)
        console.log(selectedEqName)

        // const filteredNomenclatures = selectedEqName.map((selectedItem) => {
        //     const matchingItem = filteredEqData.find((item) => item.name === selectedItem.name);
        //     return matchingItem ? matchingItem.nomenclature : null;
        // });
        let filteredNomenclatures = selectedEqName.map((equipment) => {
            const item = filteredEqData.filter(item => item.nomenclature === equipment.nomenclature)
            // const items = item.map((i) => i.nomenclature);
            return item;
        }).flat();


        setSelectedNomenclatures(filteredNomenclatures);
        console.log(filteredNomenclatures);
        const nomenclatures = filteredNomenclatures.map((item) => item.nomenclature);
        setNomenclatureDataOption(nomenclatures);

    }, [selectedEqName, selectedShipName])

    return (
        <div >
            <div className={styles.dropdownSelections}>
                <div style={{ width: "300px" }}>
                    <InputLabel
                        style={{
                            fontWeight: "bold",
                            color: "black",
                            fontSize: "16px",
                            marginBottom: "10px",
                        }}
                    >
                        <Typography variant="h5">Ship Name</Typography>
                    </InputLabel>
                    <CustomSelect
                        fields={customSelectData["shipName"]}
                        onChange={changeShip}
                        value={selectedShipName}
                    />
                </div>
                <div style={{ width: "300px" }}>
                    <InputLabel
                        style={{
                            fontWeight: "bold",
                            color: "black",
                            fontSize: "16px",
                            marginBottom: "10px",
                        }}
                    >
                        <Typography variant="h5">Equipment Name</Typography>

                    </InputLabel>

                    <Autocomplete
                        classes={classes}
                        multiple
                        id="tags-standard"
                        options={eqDataOption}
                        getOptionLabel={(option) => option.name}
                        value={selectedEqName}
                        onChange={(e, value) => setEquipmentName(value)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                InputProps={{ ...params.InputProps, disableUnderline: true }}
                                variant="standard"
                            />
                        )}
                    />
                </div>
                <div style={{ width: "300px" }}>
                    <InputLabel
                        style={{
                            fontWeight: "bold",
                            color: "black",
                            fontSize: "16px",
                            marginBottom: "10px",
                        }}
                    >
                        <Typography variant="h5">Select Nomenclature</Typography>
                    </InputLabel>

                    <Autocomplete
                        classes={classes}
                        multiple
                        id="tags-standard"
                        options={nomenclatureDataOption}
                        getOptionLabel={(option) => option}
                        value={nomenclatureData}
                        onChange={(e, value) => setNomenclatureData(value)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                InputProps={{
                                    ...params.InputProps,
                                    disableUnderline: true,
                                }}
                                variant="standard"
                            />
                        )}
                    />
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: "2.5rem" }}
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </div>
            {alphaBetaData.length > 0 && (
                <TableContainer
                    // className={styles.tableContainer}
                    style={{ margin: "2rem 4% 0 4%", width: "95%" }}
                    component={Paper}
                >
                    <Table className={styles.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell className={styles.tableHeadCell}>Component Name</TableCell>
                                <TableCell className={styles.tableHeadCell}>Alpha</TableCell>
                                <TableCell className={styles.tableHeadCell}>Beta</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {alphaBetaData.map((item) => (
                                <TableRow key={item.component_name} className={styles.tableRow}>
                                    <TableCell>{item.component_name}</TableCell>
                                    <TableCell>{item.alpha.toFixed(6)}</TableCell>
                                    <TableCell>{item.beta.toFixed(6)}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow className={styles.tableTotalRow}>
                                <TableCell className={styles.tableTotalCell}>
                                    {averagedAlphaBeta.component_name}
                                </TableCell>
                                <TableCell className={styles.tableTotalCell}>
                                    {averagedAlphaBeta.alpha.toFixed(6)}
                                </TableCell>
                                <TableCell className={styles.tableTotalCell}>
                                    {averagedAlphaBeta.beta.toFixed(6)}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {currShipName && currEquipmentName && (
                <div>
                    <div className={styles.horizontalTable}>
                        <div className={styles.horizontalTableCell}>
                            <Typography variant="h6"><strong>Ship Name:</strong> {currShipName}</Typography>
                        </div>
                        <div className={styles.horizontalTableCell}>
                            <Typography variant="h6"><strong>Equipment:</strong> {currEquipmentName}</Typography>
                        </div>
                        <div className={styles.horizontalTableCell}>
                            <Typography variant="h6"><strong>Nomenclature:</strong> {currNomenclature}</Typography>
                        </div>
                        <div className={styles.horizontalTableCell}>
                            <Typography variant="h6"><strong>Alpha:</strong> {averagedAlphaBeta.alpha.toFixed(6)}</Typography>
                        </div>
                        <div className={styles.horizontalTableCell}>
                            <Typography variant="h6"><strong>Beta:</strong> {averagedAlphaBeta.beta.toFixed(6)}</Typography>
                        </div>
                    </div>
                    <div
                        style={{
                            margin: "2rem 2rem 2rem 0",
                            display: "flex",
                            justifyContent: "flex-end",
                            paddingBottom: "2rem"
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"

                            onClick={handleSubmitCurrentShip}
                        >
                            Update alpha beta
                        </Button>
                    </div>
                </div>
            )}
            {SnackBarMessage.showSnackBar && (
                <CustomizedSnackbars
                    message={SnackBarMessage}
                    onHandleClose={onHandleSnackClose}
                />
            )}
        </div>
    );
};

export default Custom;
