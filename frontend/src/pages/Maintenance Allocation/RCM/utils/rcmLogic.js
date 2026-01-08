// ============================================================================
// RCM Logic Utility
// ============================================================================
// utils/rcmLogic.js

export const evaluateRCMLogic = (currentState, questionName, answer) => {
  const updatedState = { ...currentState };
  let result = null;

  // Helper to reset specific states
  const resetStates = (statesToReset) => {
    statesToReset.forEach((state) => {
      updatedState[state] = null;
    });
  };

  // Update the current question
  const stateMap = {
    "Is is critical for safety?": "questionsF",
    "Is it Critical for Mission?": "questionsMission",
    "Is it critical for operating enviornment?": "questionsOperating",
    "Is it critical for downtime?": "questionsDowntime",
    "Is conditional Monitoring available?": "questionsConditional",
    "Is it costly?": "questionIsItCose",
    "Is Sensor based Monitoring available?": "questionsSensor",
    "Is Preventive Maintenance available?": "questionsPreventive",
    "Is Sensor based condition monitoring available?":
      "questionSensorSafetyMission",
    "Is P-F interval sufficiently long?": "questionsPFS",
    "Is Inspection Procedure available?": "questionInspection",
    "Is Feasible?": "questionFeasible",
    "Is the cost is high?": "questionsCostHigh",
    "Is Continous Monitoring feasible?": "questionsContinuousMonitoring",
  };

  const stateKey = stateMap[questionName];
  if (stateKey) {
    updatedState[stateKey] = answer;
  }

  // Evaluate logic based on question
  switch (questionName) {
    case "Is is critical for safety?":
      resetStates([
        "questionsMission",
        "questionsOperating",
        "questionsDowntime",
        "questionsConditional",
        "questionIsItCose",
        "questionsSensor",
        "questionsPreventive",
        "questionSensorSafetyMission",
        "questionsPFS",
        "questionInspection",
        "questionFeasible",
      ]);
      break;

    case "Is it Critical for Mission?":
      resetStates([
        "questionsOperating",
        "questionsDowntime",
        "questionSensorSafetyMission",
        "questionsPFS",
        "questionInspection",
        "questionFeasible",
      ]);
      break;

    case "Is Sensor based condition monitoring available?":
      if (answer === "No") {
        resetStates(["questionsPFS"]);
      } else {
        resetStates(["questionInspection", "questionFeasible"]);
      }
      break;

    case "Is P-F interval sufficiently long?":
      if (answer === "Yes") {
        // Will lead to continuous monitoring question
      } else {
        resetStates(["questionFeasible"]);
      }
      break;

    case "Is Inspection Procedure available?":
      resetStates(["questionFeasible"]);
      break;

    case "Is Feasible?":
      if (answer === "Yes") {
        result = "Inspection Based!!";
      }
      break;

    case "Is it critical for downtime?":
      if (answer === "No") {
        result = "Component is non-critical - Run to Failure is recommended!!";
        resetStates([
          "questionsConditional",
          "questionIsItCose",
          "questionsSensor",
        ]);
      } else {
        resetStates([
          "questionsConditional",
          "questionIsItCose",
          "questionsSensor",
        ]);
      }
      break;

    case "Is conditional Monitoring available?":
      resetStates(["questionIsItCose", "questionsSensor"]);
      break;

    case "Is it costly?":
      resetStates(["questionsSensor"]);
      break;

    case "Is Preventive Maintenance available?":
      if (answer === "No") {
        result = "Design Improvement is Recommended!!";
      }
      break;

    case "Is Sensor based Monitoring available?":
      if (answer === "No") {
        result = "Inspection!!";
      }
      break;

    case "Is the cost is high?":
      if (answer === "No") {
        result = "Calendar time based preventive Maintenance!!";
      } else {
        result = "Age based preventive Maintenance!!";
      }
      break;

    case "Is Continous Monitoring feasible?":
      if (answer === "No") {
        result = "Sensor based intermittent monitoring!!";
      } else {
        result = "Sensor based continous monitoring!!";
      }
      break;
  }

  return { updatedState, result };
};
