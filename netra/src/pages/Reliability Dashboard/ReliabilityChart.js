import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Legend,
  Tooltip,
  ReferenceLine
} from "recharts";

const ReliabilityChart = ({ data }) => {
  let xKey="name"
  let yKeys=["Reliability"]
  if(data[0]){
   xKey="name"
   yKeys=Object.keys(data[0])
   //console.log(yKeys) 
   yKeys = yKeys.filter(item => item !== "name")
   //console.log(yKeys)
  }
  const referenceData = [
    {
      name: "Target Reliability",
      reliability: 90.0,
    },
  ];
  let colors=['#86a0ff','#364d9d','#e4ebfe','#374c93']
  console.log("jjjk",[...referenceData,...data]);
  return (
    <ResponsiveContainer height="90%" width={'100%'} debounce={50}>
      <BarChart data={[...data]} layout="horizontal" >
        <Tooltip/>
        <YAxis type="number" domain={[0, 100]} tick={{fontSize: 10}}/>
        <XAxis
          xAxisId={0}
          dataKey={xKey}
          type="category"
          tickLine={false}
          tick={{fontSize: 10}}
          interval={0}
        />
        {yKeys&&yKeys.map((yKey,idx)=>{
          return(
          <Bar dataKey={yKey} minPointSize={2} barSize={15} radius={[3,3,0,0]} fill={colors[idx]}>
          {data.map((d, idx) => {
            return <Cell key={d[xKey]}  />;
          })}
        </Bar>)
        })}
         <ReferenceLine y={90} stroke="red" strokeDasharray="5 5" />
        <Legend/>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ReliabilityChart;