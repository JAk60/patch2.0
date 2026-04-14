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

      data?.forEach((entry) => {
        const parameterName = entry.name;
        if (!manipulatedData[nomenclature].data[parameterName]) {
          manipulatedData[nomenclature].data[parameterName] = [];
        }
        manipulatedData[nomenclature].data[parameterName].push(entry);
      });
    }
  }

  const parseDate = (dateString) => {
    if (!dateString) return new Date(0);

    // Try native Date first — handles ISO, "YYYY-MM-DD HH:MM:SS", RFC, etc.
    const d = new Date(dateString);
    if (!isNaN(d)) return d;

    // Fallback: "DD/MM/YYYY, HH:MM:SS" (non-standard, JS can't parse natively)
    const match = dateString.match(
      /^(\d{1,2})\/(\d{1,2})\/(\d{4}),?\s+(\d{2}):(\d{2}):(\d{2})/
    );
    if (match) {
      const [, day, month, year, hour, minute, second] = match;
      const fallback = new Date(year, month - 1, day, hour, minute, second);
      if (!isNaN(fallback)) return fallback;
    }

    console.warn("Could not parse date:", dateString);
    return new Date(0);
  };

  const getDomainByUnit = (unit, minThreshold, maxThreshold) => {
    const range = maxThreshold - minThreshold;
    const padding = range * 0.2;
    const roundedMin = Math.round((minThreshold - padding) * 100) / 100;
    const roundedMax = Math.round((maxThreshold + padding) * 100) / 100;
    return [roundedMin, roundedMax];
  };

  const sortDataByDate = (data) => {
    return data
      .filter((entry) => entry?.date != null)   // ← drop entries missing date
      .sort((a, b) => parseDate(a.date) - parseDate(b.date));
  };

  return (
    <div className={styles.midSection}>
      {selectedParameterNames.map((param) => {
        const { name, nomenclature } = param;
        const paramData = manipulatedData[nomenclature]?.data[name] || [];

        if (paramData.length === 0) {
          return null;
        }

        const sortedData = sortDataByDate(paramData);
        const minThreshold = parseInt(sortedData[0]?.min_value, 10);
        const maxThreshold = parseInt(sortedData[0]?.max_value, 10);
        const lastValue = sortedData[sortedData.length - 1]?.value;
        const crossingThreshold =
          lastValue < minThreshold || lastValue > maxThreshold;

        const unit = sortedData[0]?.unit;
        const yDomain = getDomainByUnit(unit, minThreshold, maxThreshold);

        return (
          <div className={`${styles.rchart}`} key={`${name}-${nomenclature}`}>
            <div
              className={`${styles.content} ${crossingThreshold ? styles.blinkingChart : ""
                }`}
            >
              <div>
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
                    const dateObject = parseDate(dateString);
                    return dateObject.toLocaleDateString();
                  }}
                />
                <YAxis
                  domain={yDomain}
                  tickFormatter={(value) => value.toFixed(2)}
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
                    return `${dateObject.toLocaleDateString()} ${dateObject.toLocaleTimeString()}`;
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