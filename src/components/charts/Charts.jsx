import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = [
  "#4F46E5", "white", "#10B981", "#F59E0B",
  "#EF4444", "#8B5CF6", "#14B8A6", "#F97316",
];

export function MonthlyUsersChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-gray-700 dark:text-gray-300">No data available.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
        <XAxis
          dataKey="monthLabel"
          angle={-45}
          textAnchor="end"
          interval={0}
          height={60}
          stroke="white"
        />
        <YAxis stroke="white" />
        <Tooltip
          contentStyle={{ backgroundColor: "var(--color-bg-main)", borderRadius: 8 }}
          labelStyle={{ color: "#4F46E5" }}
          itemStyle={{ color: "#4F46E5" }}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke={COLORS[0]}
          strokeWidth={3}
          activeDot={{ r: 6 }}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function CircleTypesChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-gray-700 dark:text-gray-300">No circle data available.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill={COLORS[6]}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend wrapperStyle={{ color: "var(--color-text-secondary)" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
