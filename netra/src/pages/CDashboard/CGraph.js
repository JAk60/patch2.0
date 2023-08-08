import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import styles from "./CDashboard.module.css";

const CGraph = ({ graphData, selectedParameterNames }) => {
  // Group the data by parameter name
  const groupedData = graphData.reduce((acc, cur) => {
    if (!acc[cur.name]) {
      acc[cur.name] = {
        equipmentName: cur.name,
        componentName: cur.name,
        parameterName: cur.name,
        data: [],
      };
    }
    acc[cur.name].data.push(cur);
    return acc;
  }, {});

  const paramChartData = Object.values(groupedData);
  console.log(paramChartData);
  const filteredParamChartData = paramChartData.filter((param) => {
    return selectedParameterNames.includes(param.parameterName);
  });
  console.log(filteredParamChartData);
  // Utility function to convert date string to Date object
  const parseDate = (dateString) => {
    const dateParts = dateString.split(", ")[0].split("/");
    const timeParts = dateString.split(", ")[1].split(":");
    const year = parseInt(dateParts[2], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Months are 0-based in JavaScript Date
    const day = parseInt(dateParts[0], 10);
    const hour = parseInt(timeParts[0], 10);
    const minute = parseInt(timeParts[1], 10);
    const second = parseInt(timeParts[2], 10);
    return new Date(year, month, day, hour, minute, second);
  };

  const getDomainByUnit = (unit) => {
    switch (unit) {
      case "RMS":
        return [0, 1000]; // Example domain for RMS unit
      case "kg":
        return [0, 100]; // Example domain for kg unit
      case "deg C":
        return [0, 500]; // Example domain for deg C unit
      // Add more cases for other units as needed
      default:
        return [0, 100]; // Default domain if unit is not recognized
    }
  };
  const sortDataByDate = (data) => {
    return data.sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateA - dateB;
    });
  };
  return (
    <div className={styles.midSection}>
      {filteredParamChartData.map((param) => {
        if (param.data.length === 0) {
          return null;
        }

        const sortedData = sortDataByDate(param.data);

        const minThreshold = parseInt(sortedData[0]?.min_value);
        const maxThreshold = parseInt(sortedData[0]?.max_value);
        const crossingThreshold =
          (sortedData[sortedData.length - 1]?.value ?? 0) < minThreshold ||
          (sortedData[sortedData.length - 1]?.value ?? 0) > maxThreshold;

        const unit = sortedData[0]?.unit;
        const yDomain = getDomainByUnit(unit);

        return (
          <div className={`${styles.rchart}`} key={param.parameterName}>
            <div
              className={`${styles.content} ${
                crossingThreshold ? styles.blinkingChart : ""
              }`}
            >
              <div>
                {crossingThreshold}
                <text
                  x={550 / 2} // Center the text horizontally
                  y={10} // Position the text 10 units from the top
                  textAnchor="middle" // Center the text relative to x position
                  fill="black" // Text color
                  fontSize="12px" // Text font size
                >
                  {param.data[0]?.failure_mode_id}
                </text>
              </div>
              <LineChart width={550} height={300} data={sortedData}>
                <XAxis
                  dataKey="date"
                  tick={false}
                  label={{
                    value: "Date",
                    position: "insideBottom",
                    dy: 10,
                  }}
                  height={45}
                  // Format the XAxis ticks to show formatted dates
                  tickFormatter={(dateString) => {
                    const dateObject = parseDate(dateString);
                    return dateObject.toLocaleDateString();
                  }}
                />
                 <YAxis
                  domain={yDomain}
                  label={{
                    value: `${param.parameterName} (${unit})`,
                    angle: -90,
                    position: "center",
                    dx: -10, // Adjust the label's distance from the axis
                    dy: -10, // Adjust the label's distance from the axis
                    paddingRight: "20px",
                  }}
                  width={80}
                />
                <CartesianGrid horizontal={false} vertical={false} />

                <Line
                  layout="horizontal"
                  dataKey="value"
                  stroke={crossingThreshold ? "red" : "green"}
                />

                <ReferenceLine
                  y={parseInt(minThreshold)}
                  stroke="gray"
                  strokeDasharray="6 6"
                  label={{
                    value: `Min Value: ${minThreshold}`,
                    position: "right",
                    fill: "gray",
                    fontSize: "12px",
                  }}
                />
                <ReferenceLine
                  y={parseInt(maxThreshold)}
                  stroke="gray"
                  strokeDasharray="6 6"
                  label={{
                    value: `Max Value: ${maxThreshold}`,
                    position: "right",
                    fill: "gray",
                    fontSize: "12px",
                  }}
                />
                <Tooltip
                  labelFormatter={(label) => {
                    const dateObject = parseDate(label);
                    const formattedDate = dateObject.toLocaleDateString();
                    const formattedTime = dateObject.toLocaleTimeString();
                    return `${formattedDate} ${formattedTime}`;
                  }}
                />
              </LineChart>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CGraph;
