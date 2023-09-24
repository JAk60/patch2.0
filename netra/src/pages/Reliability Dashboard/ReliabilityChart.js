import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
} from "recharts";
import styles from "./rDashboard.module.css";

const CustomTooltipContent = ({ active, payload, label, family }) => {
  if (active && payload && payload.length) {
    const parent = family.find(item => item.equipmentName === label)?.parent;
    console.log(parent, "parent")
    return (
      <div className={styles.customtooltip}>
        <p className={styles.label}>{`${label} : ${payload[0].value}`}</p>
        {parent && <p className="parent">{`${parent}`}</p>}
      </div>
    );
  }
  return null;
};



const ReliabilityChart = ({ data ,family}) => {
  console.log(family, "family");
  let xKey = "name";
  let yKeys = ["Reliability"];
  if (data[0]) {
    xKey = "name";
    yKeys = Object.keys(data[0]);
    yKeys = yKeys.filter((item) => item !== "name");
  }
  let colors=['#86a0ff','#364d9d','#e4ebfe','#374c93']
  return (
    <ResponsiveContainer height="90%" width={"100%"} debounce={50}>
      <BarChart data={[...data]} layout="horizontal" >
        <Tooltip content={<CustomTooltipContent  family={family.equipments}/>} />
        <YAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
        <XAxis
          xAxisId={0}
          dataKey={xKey}
          type="category"
          tickLine={false}
          tick={{ fontSize: 10 }}
          interval={0}
        />
        {yKeys &&
          yKeys.map((yKey, idx) => {
            return (
              <Bar
                dataKey={yKey}
                minPointSize={3}
                barSize={15}
                radius={[3, 3, 0, 0]}
                fill={colors[idx]}
              >
                {data.map((d, idx) => {
                  return <Cell key={d[xKey]} />;
                })}
              </Bar>
            );
          })}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ReliabilityChart;
