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
  console.log("selectedParameterNames", selectedParameterNames);
  const groupedData = graphData.reduce((acc, cur) => {
    if (!acc[cur.nomenclature]) {
      acc[cur.nomenclature] = {
        equipmentName: cur.component_name,
        nomenclature: cur.nomenclature,
        data: [],
      };
    }
    acc[cur.nomenclature].data.push(cur);
    return acc;
  }, {});
  console.log("groupedData", groupedData);
  const paramChartData = Object.values(groupedData);


  const manipulatedData = {};

  for (const key in groupedData) {
    if (groupedData.hasOwnProperty(key)) {
      const item = groupedData[key];
      const { nomenclature, data } = item;

      if (!manipulatedData[nomenclature]) {
        manipulatedData[nomenclature] = {
          equipmentName: item.equipmentName,
          nomenclature: item.nomenclature,
          data: {},
        };
      }

      data?.forEach(entry => {
        const parameterName = entry.name;
        if (!manipulatedData[nomenclature].data[parameterName]) {
          manipulatedData[nomenclature].data[parameterName] = [];
        }
        manipulatedData[nomenclature].data[parameterName].push(entry);
      });
    }
  }

  console.log("GG", manipulatedData);


  ;
  const parseDate = (dateString) => {
    const dateParts = dateString.split(", ")[0].split("/");
    const timeParts = dateString.split(", ")[1].split(":");
    const year = parseInt(dateParts[2], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[0], 10);
    const hour = parseInt(timeParts[0], 10);
    const minute = parseInt(timeParts[1], 10);
    const second = parseInt(timeParts[2], 10);
    return new Date(year, month, day, hour, minute, second);
  };

  const getDomainByUnit = (unit, minThreshold, maxThreshold) => {
    const adjustedMin = Math.round(minThreshold / 2);
    const adjustedMax = maxThreshold * 1.5;

    switch (unit) {
      case "RMS":
      case "kg":
      case "deg C":
        return [adjustedMin, adjustedMax];
      default:
        return [adjustedMin, adjustedMax];
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
      {selectedParameterNames.map((param) => {
        const { name, nomenclature } = param;
        const paramData = manipulatedData[nomenclature]?.data[name] || [];
        console.log(paramData);
        if (paramData.length === 0) {
          return null;
        }

        const sortedData = sortDataByDate(paramData)
        console.log(sortedData);
        const minThreshold = parseInt(sortedData[0]?.min_value, 10);
        const maxThreshold = parseInt(sortedData[0]?.max_value, 10);
        const crossingThreshold =
          sortedData[sortedData.length - 1]?.value < minThreshold ||
          sortedData[sortedData.length - 1]?.value > maxThreshold;

        const unit = sortedData[0]?.unit;
        const yDomain = getDomainByUnit(unit, minThreshold, maxThreshold);

        return (
          <div className={`${styles.rchart}`} key={`${name}-${nomenclature}`}>
            <div
              className={`${styles.content} ${crossingThreshold ? styles.blinkingChart : ""
                }`}
            >
              <div>
                {crossingThreshold}
                <h1
                  x={550 / 2}
                  y={10}
                  textAnchor="middle"
                  fill="black"
                  fontSize="12px"
                >
                  {paramData[0]?.failure_mode_id}
                  {` (${param.nomenclature})`}
                </h1>
              </div>
              <LineChart width={700} height={400} data={sortedData}>
                <XAxis
                  dataKey="date"
                  tick={false}
                  label={{
                    value: "Date",
                    position: "insideBottom",
                    dy: 10,
                  }}
                  height={45}
                  tickFormatter={(dateString) => {
                    const dateObject = new Date(dateString);
                    return dateObject.toLocaleDateString();
                  }}
                />
                <YAxis
                  domain={yDomain}
                  label={{
                    value: `${name} (${unit})`,
                    angle: -90,
                    position: "center",
                    dx: -30,
                    dy: -10,
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
                  y={minThreshold}
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
                  y={maxThreshold}
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
