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

const CustomTooltipContent = ({ active, payload, label }) => {
	if (active && payload && payload.length) {
		const data = payload[0].payload;
		return (
			<div className={styles.customtooltip}>
				<p>{`Ship: ${data.ship}`}</p>
				<p>{`Equipment: ${data.equipment}`}</p>
				<p>{`${data.name}: ${data.reliability}`}</p>
			</div>
		);
	}
	return null;
};

const ReliabilityChart = ({ data, family }) => {
	let colors = ["#86a0ff", "#364d9d", "#e4ebfe", "#374c93"];
	console.log(family);
	console.log(data);
	return (
		<ResponsiveContainer height="90%" width={"100%"} debounce={50}>
			<BarChart data={data} layout="horizontal">
				<XAxis dataKey="name" type="category" />
				<YAxis type="number" domain={[0, 100]} />
				<Tooltip content={<CustomTooltipContent />} />
				<Bar
					dataKey="reliability"
					barSize={15}
					minPointSize={3}
					shape={({ payload, x, y, width, height }) => (
						<rect
							width={width}
							height={height}
							x={x}
							y={y}
							fill={colors[3]}
							// Customize the color based on reliability
							stroke={
								payload.reliability > 90 ? "#86a0ff" : "#364d9d"
							} // Optional: Set the border color
						/>
					)}
					radius={[3, 3, 0, 0]}
				>
					{data.map((entry, index) => (
						<Cell key={`cell-${index}`} />
					))}
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	);
};

export default ReliabilityChart;
