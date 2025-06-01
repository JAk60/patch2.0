import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import EqptStructuring from "../../components/main/EqptStructuring/EqptStructuring";
import { treeDataActions } from "../../store/TreeDataStore";
import CustomizedSnackbars from "../../ui/CustomSnackBar";
import UserSelection from "../../ui/userSelection/userSelection";
import AccessControl from "../Home/AccessControl";
import styles from "./SystemConfiguration.module.css";
const SystemStyles = makeStyles({
	formControl: {
		margin: "2rem",
		minWidth: 200,
	},
	Submit: {
		margin: "2rem",
	},
	buttons: {
		minWidth: 150,
		marginLeft: 10,
		marginTop: 15,
		float: "right",
	},
});

const SystemConfiguration = (props) => {
	const dispatch = useDispatch();
	// let finalTableData = [];
	const setFinalTableData = (d) => {
		// finalTableData = d;
	};
	const systemConfigurationTreeData = useSelector(
		(state) => state.treeData.treeData
	);
	const systemConfigurationData = useSelector(
		(state) => state.treeData.sortTreeData
	);
	const currentSelection = useSelector(
		(state) => state.userSelection.currentSelection
	);
	// const [showSnackBar, setShowSnackBar] = useState(false);
	const [SnackBarMessage, setSnackBarMessage] = useState({
		severity: "error",
		message: "This is awesome",
		showSnackBar: false,
	});
	const SystemClasses = SystemStyles();

	const onHandleSnackClose = () => {
		setSnackBarMessage({
			severity: "error",
			message: "Please Add Systems",
			showSnackBar: false,
		});
	};

	const onSaveButtonClickHandler = () => {
		if (systemConfigurationTreeData.length > 0) {
			fetch("/save_system", {
				method: "POST",
				body: JSON.stringify({
					flatData: systemConfigurationTreeData,
					nestedData: systemConfigurationData,
					dtype: "insertSystem",
				}),
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			})
				.then((res) => {
					return res.json();
				})
				.then((data) => {
					setSnackBarMessage({
						severity: "success",
						message: data.message,
						showSnackBar: true,
					});
				})
				.catch((error) => {
					setSnackBarMessage({
						severity: "error",
						message:
							"Error Occured in System Configuration, Please Try again" +
							error,
						showSnackBar: true,
					});
				});
		} else {
			setSnackBarMessage((prevState) => {
				const data = {
					...prevState,
					message:
						"Error Occured in System Configuration, Please Try again",
					showSnackBar: true,
				};
				return data;
			});
		}
	};

	const sData = useSelector((state) => state.userSelection.componentsData);

	const currentNomenclature = currentSelection["nomenclature"];
	// console.log(sData)S
	const matchingItems = sData.filter(
		(item) =>
			item.nomenclature === currentNomenclature &&
			item.ship_name === currentSelection["shipName"]
	);

	console.log(matchingItems);

	const matchingId = matchingItems[0]?.id;
	const onLoadTreeStructure = () => {
		const payload = {
			nomenclature: currentSelection["nomenclature"],
			ship_name: currentSelection["shipName"],
		};

		if (matchingId) {
			payload.component_id = matchingId;
		}
		console.log(payload);
		fetch("/fetch_system", {
			method: "POST",
			body: JSON.stringify(payload),
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
			.then((res) => res.json())
			.then((d) => {
				console.log(d);
				let treeD = d["treeD"];
				let failureModes = d["failureMode"];
				console.log(failureModes);
				dispatch(
					treeDataActions.setTreeData({
						treeData: treeD,
					})
				);
				dispatch(treeDataActions.setFailureModes(failureModes));
			});

		setSnackBarMessage({
			severity: "success",
			message: "System is Loaded",
			showSnackBar: true,
		});
	};

	return (
		<>
			<AccessControl allowedLevels={["L0"]}>
				<div className={styles.flex}>
					<div className={styles.user}>
						<UserSelection />
						<div className={styles.buttons}>
							<Button
								variant="contained"
								color="primary"
								className={SystemClasses.buttons}
								onClick={onLoadTreeStructure}
							>
								Load Equipment
							</Button>

							<Button
								variant="contained"
								color="primary"
								className={SystemClasses.buttons}
								onClick={onSaveButtonClickHandler}
							>
								Save
							</Button>
						</div>
					</div>
				</div>
				<Switch>
					<Route path="/system_config" exact={true}>
						<EqptStructuring tableUpdate={setFinalTableData} />
					</Route>
				</Switch>
				{SnackBarMessage.showSnackBar && (
					<CustomizedSnackbars
						message={SnackBarMessage}
						onHandleClose={onHandleSnackClose}
					/>
				)}
			</AccessControl>
		</>
	);
};

export default SystemConfiguration;
