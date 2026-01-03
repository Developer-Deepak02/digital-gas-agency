"use client";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

export default function RevenueChart({ data }: { data: any[] }) {

	return (
		<>
			<h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Trends</h3>
			<div className="flex-1 w-full min-h-[300px]">
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart
						data={data}
						margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
					>
						{/* ... same chart internals ... */}
						<defs>
							<linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#ea580c" stopOpacity={0.8} />
								<stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
							</linearGradient>
						</defs>
						<CartesianGrid strokeDasharray="3 3" vertical={false} />
						<XAxis
							dataKey="date"
							axisLine={false}
							tickLine={false}
							tick={{ fontSize: 12, fill: "#6b7280" }}
							dy={10}
						/>
						<YAxis
							axisLine={false}
							tickLine={false}
							tick={{ fontSize: 12, fill: "#6b7280" }}
							tickFormatter={(value) => `₹${value}`}
						/>
						<Tooltip
							contentStyle={{
								borderRadius: "8px",
								border: "none",
								boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
							}}
							itemStyle={{ color: "#ea580c", fontWeight: "bold" }}
						/>
						<Area
							type="monotone"
							dataKey="revenue"
							stroke="#ea580c"
							strokeWidth={3}
							fillOpacity={1}
							fill="url(#colorRevenue)"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</>
	);
}
