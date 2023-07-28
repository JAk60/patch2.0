import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Legend,
  Tooltip
} from "recharts";

const clickEvent = (id) => {
  alert("You have clicked " + id);
};

// const TiltedAxisTick = (props) => {

//   const { x, y, stroke, payload } = props;

//   return (
//     <g transform={`translate(${x},${y})`}>
//       <text
//         x={0}
//         y={0}
//         dy={16}
//         textAnchor="end"
//         fill="#666"
//         transform="rotate(-90)">
//           {payload.value}
//       </text>
//     </g>
//   );

// };

const BarGraph = ({ data}) => {
  let xKey="name"
  let yKeys=["Reliability"]
  if(data[0]){
   xKey="name"
   yKeys=Object.keys(data[0])
   //console.log(yKeys) 
   yKeys = yKeys.filter(item => item !== "name")
   //console.log(yKeys)
  }
  let colors=['#86a0ff','#364d9d','#e4ebfe','#374c93']
  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
        <Tooltip/>
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
        <YAxis
          yAxisId={0}
          dataKey={xKey}
          type="category"
          tickLine={false}
          tick={{ fontSize: 10 }}
          interval={0}
        />
        {yKeys&&yKeys.map((yKey,idx)=>{
          return(
        <Bar dataKey={yKey} minPointSize={2} barSize={15} radius={[0, 3, 3, 0]} fill={colors[idx]}>
          {data.map((d, idx) => {
            return (
              <Cell
                key={d[xKey]}
                onClick={() => clickEvent(idx)}
              />
            );
          })}
        </Bar>)}
        )}
        <Legend/>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarGraph;
