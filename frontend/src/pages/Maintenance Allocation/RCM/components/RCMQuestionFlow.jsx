// ============================================================================
// Question Flow Component
// ============================================================================
// components/RCMQuestionFlow.jsx

import React from "react";
import CustomSelect from "../../../../ui/Form/CustomSelect";
import { evaluateRCMLogic } from "../utils/rcmLogic";

const RCMQuestionFlow = ({
  questionState,
  setQuestionState,
  finalRCMAns,
  setFinalRCMAns,
}) => {
  const questionsOptions = ["Yes", "No"];

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;

    // Update question state and evaluate logic
    const { updatedState, result } = evaluateRCMLogic(
      questionState,
      name,
      value
    );

    setQuestionState(updatedState);
    setFinalRCMAns(result);
  };

  const {
    questionsF,
    questionsMission,
    questionsOperating,
    questionsDowntime,
    questionsConditional,
    questionIsItCose,
    questionsSensor,
    questionsPreventive,
    questionSensorSafetyMission,
    questionsPFS,
    questionInspection,
    questionFeasible,
  } = questionState;

  return (
    <div style={{ paddingTop: "1rem" }}>
      {/* Safety Question */}
      <QuestionRow
        id="q1"
        name="Is is critical for safety?"
        label="Is is critical for safety?"
        options={questionsOptions}
        onChange={handleQuestionChange}
      />

      {/* Mission Question */}
      {questionsF === "No" && (
        <QuestionRow
          id="q7"
          name="Is it Critical for Mission?"
          label="Is it Critical for Mission?"
          options={questionsOptions}
          onChange={handleQuestionChange}
        />
      )}

      {/* Operating Environment Question */}
      {questionsF === "No" && questionsMission === "No" && (
        <QuestionRow
          id="q9"
          name="Is it critical for operating enviornment?"
          label="Is it critical for operating enviornment?"
          options={questionsOptions}
          onChange={handleQuestionChange}
        />
      )}

      {/* Downtime Question */}
      {questionsF === "No" &&
        questionsMission === "No" &&
        questionsOperating === "No" && (
          <QuestionRow
            id="q12"
            name="Is it critical for downtime?"
            label="Is it critical for downtime?"
            options={questionsOptions}
            onChange={handleQuestionChange}
          />
        )}

      {/* Sensor Based Monitoring (Safety/Mission) */}
      {(questionsF === "Yes" || questionsMission === "Yes") && (
        <QuestionRow
          id="q_sensor_sm"
          name="Is Sensor based condition monitoring available?"
          label="Is Sensor based condition monitoring available?"
          options={questionsOptions}
          onChange={handleQuestionChange}
        />
      )}

      {/* P-F Interval */}
      {questionSensorSafetyMission === "Yes" && (
        <QuestionRow
          id="q_pf"
          name="Is P-F interval sufficiently long?"
          label="Is P-F interval sufficiently long?"
          options={questionsOptions}
          onChange={handleQuestionChange}
        />
      )}

      {/* Inspection Procedure */}
      {(questionSensorSafetyMission === "No" || questionsPFS === "No") && (
        <QuestionRow
          id="q_inspection"
          name="Is Inspection Procedure available?"
          label="Is Inspection Procedure available?"
          options={questionsOptions}
          onChange={handleQuestionChange}
        />
      )}

      {/* Feasible */}
      {questionInspection === "Yes" && (
        <QuestionRow
          id="q_feasible"
          name="Is Feasible?"
          label="Is Feasible?"
          options={questionsOptions}
          onChange={handleQuestionChange}
        />
      )}

      {/* Conditional Monitoring */}
      {((questionsF === "No" &&
        questionsMission === "No" &&
        questionsOperating === "Yes") ||
        (questionsF === "No" &&
          questionsMission === "No" &&
          questionsOperating === "No" &&
          questionsDowntime === "Yes")) && (
        <QuestionRow
          id="q2"
          name="Is conditional Monitoring available?"
          label="Is conditional Monitoring available?"
          options={questionsOptions}
          onChange={handleQuestionChange}
        />
      )}

      {/* Cost Question */}
      {((questionsOperating === "Yes" && questionsConditional === "Yes") ||
        (questionsDowntime === "Yes" && questionsConditional === "Yes")) && (
        <QuestionRow
          id="q_cost"
          name="Is it costly?"
          label="Is it costly?"
          options={questionsOptions}
          onChange={handleQuestionChange}
        />
      )}

      {/* Preventive Maintenance */}
      {(questionsConditional === "No" ||
        questionIsItCose === "Yes" ||
        questionFeasible === "No" ||
        questionInspection === "No") && (
        <QuestionRow
          id="q3"
          name="Is Preventive Maintenance available?"
          label="Is Preventive Maintenance available?"
          options={questionsOptions}
          onChange={handleQuestionChange}
        />
      )}

      {/* Sensor Based Monitoring (Alternative) */}
      {questionsConditional === "Yes" && questionIsItCose === "No" && (
        <QuestionRow
          id="q4"
          name="Is Sensor based Monitoring available?"
          label="Is Sensor based Monitoring available?"
          options={questionsOptions}
          onChange={handleQuestionChange}
        />
      )}

      {/* Cost High */}
      {questionsPreventive === "Yes" && (
        <QuestionRow
          id="q5"
          name="Is the cost is high?"
          label="Is the cost is high?"
          options={questionsOptions}
          onChange={handleQuestionChange}
        />
      )}

      {/* Continuous Monitoring */}
      {((questionIsItCose === "No" && questionsSensor === "Yes") ||
        questionsPFS === "Yes") && (
        <QuestionRow
          id="q6"
          name="Is Continous Monitoring feasible?"
          label="Is Continous Monitoring feasible?"
          options={questionsOptions}
          onChange={handleQuestionChange}
        />
      )}
    </div>
  );
};

// Helper component for consistent question rendering
const QuestionRow = ({ id, name, label, options, onChange }) => (
  <div
    style={{
      marginBottom: "1rem",
      width: "100%",
      display: "flex",
      justifyContent: "space-around",
    }}
  >
    <CustomSelect
      style={{ width: "70rem" }}
      id={id}
      name={name}
      label={label}
      fields={options}
      onChange={onChange}
      value=""
    />
  </div>
);

export default RCMQuestionFlow;
