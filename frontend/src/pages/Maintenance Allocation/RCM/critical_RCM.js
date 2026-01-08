// ============================================================================
// Main Container Component
// ============================================================================
// Critical_RCM.jsx

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Button } from "@material-ui/core";
import Navigation from "../../../components/navigation/Navigation";
import { treeDataActions } from "../../../store/TreeDataStore";
import UserSelection from "../../../ui/userSelection/userSelection";
import CustomizedSnackbars from "../../../ui/CustomSnackBar";
import RCMSelectionPanel from "./components/RCMSelectionPanel";
import RCMQuestionFlow from "./components/RCMQuestionFlow";
import RCMResults from "./components/RCMResults";
import RCMActions from "./components/RCMActions";
import styles from "../CreateMaintenance/CreateMaintenance.module.css";

const Critical_RCM = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentSelection = useSelector(
    (state) => state.userSelection.currentSelection
  );
  const AllData = useSelector((state) => state.treeData.treeData);

  // Selection State
  const [fData, setfData] = useState([]);
  const [fDataCritical, setfDataCritical] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedCriticalComponent, setSelectedCriticalComponent] = useState(
    []
  );

  // Question State
  const [questionState, setQuestionState] = useState({
    questionsF: null,
    questionsMission: null,
    questionsOperating: null,
    questionsDowntime: null,
    questionsConditional: null,
    questionIsItCose: null,
    questionsSensor: null,
    questionsPreventive: null,
    questionSensorSafetyMission: null,
    questionsPFS: null,
    questionInspection: null,
    questionFeasible: null,
  });

  const [finalRCMAns, setFinalRCMAns] = useState(null);
  const [tData, setTdata] = useState([]);

  // Snackbar State
  const [snackBarMessage, setSnackBarMessage] = useState({
    severity: "error",
    message: "",
    showSnackBar: false,
  });

  // ============================================================================
  // Handlers
  // ============================================================================

  const handleSnackClose = () => {
    setSnackBarMessage({ ...snackBarMessage, showSnackBar: false });
  };

  const showSnackbar = (severity, message) => {
    setSnackBarMessage({ severity, message, showSnackBar: true });
  };

  const onLoadTreeStructure = () => {
    fetch("/api/fetch_assembly_rcm", {
      method: "POST",
      body: JSON.stringify({
        nomenclature: currentSelection["nomenclature"],
        ship_name: currentSelection["shipName"],
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((d) => {
        const treeD = d["treeD"];
        const failureModes = d["failureMode"];
        setTdata(treeD);
        // In onLoadTreeStructure function:
        const uniqueAsm = Array.from(
          new Map(d["asm"].map((item) => [item.component_id, item])).values()
        );
        setfData(uniqueAsm);

        dispatch(
          treeDataActions.setTreeData({
            treeData: treeD,
            failureModes: failureModes,
          })
        );

        return fetch("/api/save_assembly_rcm", {
          method: "POST",
          body: JSON.stringify({
            system: currentSelection["equipmentName"],
            ship_name: currentSelection["shipName"],
            asm_data: treeD,
          }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
      })
      .then((res) => res.json())
      .then((d) => {
        showSnackbar("success", d.message);
      })
      .catch((err) => {
        showSnackbar("error", "Failed to load tree structure");
      });
  };

  const handleComponentChange = (value) => {
    setSelectedComponent(value);

    if (!value) {
      setfDataCritical([]);
      return;
    }

    const lmuData = [];
    const first_ele = AllData.filter((x) => x.id === value.component_id)[0];
    const pData = [first_ele];

    while (pData.length > 0) {
      const ele = pData.pop();
      const childs = AllData.filter((x) => x.parentId === ele.id);

      if (childs.length === 0) {
        lmuData.push(ele);
      } else {
        pData.push(...childs);
      }
    }

    setfDataCritical(lmuData);
  };

  const handleSaveAndGenerateReport = () => {
    if (selectedCriticalComponent.length === 0) {
      showSnackbar("error", "Please select at least one critical component");
      return;
    }

    if (!finalRCMAns) {
      showSnackbar("error", "Please complete the RCM analysis questions");
      return;
    }

    // First, save the RCM data
    fetch("/api/save_rcm", {
      method: "POST",
      body: JSON.stringify({
        system: currentSelection["equipmentName"],
        ship_name: currentSelection["shipName"],
        assembly: selectedComponent,
        component: selectedCriticalComponent,
        rcm_val: finalRCMAns,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then(() => {
        // Then generate the report
        return fetch("/api/rcm_report", {
          method: "POST",
          body: JSON.stringify({
            nomenclature: currentSelection["nomenclature"],
            ship_name: currentSelection["shipName"],
          }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
      })
      .then((res) => res.json())
      .then(() => {
        showSnackbar(
          "success",
          "Data saved and report generated successfully!"
        );
      })
      .catch(() => {
        showSnackbar("error", "Failed to save data or generate report");
      });
  };

  const handleDownload = () => {
    const system = currentSelection["nomenclature"].replace(/\s/g, "");
    const ship_name = currentSelection["shipName"].replace(/\s/g, "");

    // unique version every time
    const version = Date.now();

    const fileName = `${ship_name}-${system}-${version}.pdf`;
    const filePath = `/${ship_name}-${system}.pdf`;

    const link = document.createElement("a");
    link.href = `${filePath}?v=${version}`;
    link.download = fileName;
    link.rel = "noopener";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showSnackbar("success", "Report downloaded successfully");
  };

  const handleOptimize = () => {
    history.push("/optimize");
  };

  return (
    <>
      <Navigation />
      <div className={styles.userSelection}>
        <UserSelection />
        <Button
          className={styles.btn}
          onClick={onLoadTreeStructure}
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
      </div>

      <div className={styles.content}>
        <div className={styles.rightSectionCrit}>
          <RCMSelectionPanel
            fData={fData}
            fDataCritical={fDataCritical}
            selectedComponent={selectedComponent}
            selectedCriticalComponent={selectedCriticalComponent}
            onComponentChange={handleComponentChange}
            onCriticalComponentChange={setSelectedCriticalComponent}
          />

          <RCMQuestionFlow
            questionState={questionState}
            setQuestionState={setQuestionState}
            finalRCMAns={finalRCMAns}
            setFinalRCMAns={setFinalRCMAns}
          />

          {finalRCMAns && (
            <RCMResults
              currentSelection={currentSelection}
              finalRCMAns={finalRCMAns}
            />
          )}

          <RCMActions
            onSaveAndGenerate={handleSaveAndGenerateReport}
            onDownload={handleDownload}
            onOptimize={handleOptimize}
            hasResults={!!finalRCMAns}
          />
        </div>
      </div>

      {snackBarMessage.showSnackBar && (
        <CustomizedSnackbars
          message={snackBarMessage}
          onHandleClose={handleSnackClose}
        />
      )}
    </>
  );
};

export default Critical_RCM;
