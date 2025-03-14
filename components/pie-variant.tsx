/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    PieChart,
    Pie,
    Tooltip,
    Legend,
    Cell,
    ResponsiveContainer
} from "recharts";
import { formatPercentage } from "@/lib/utils";
import { Categorytip } from "./category-tooltip";

const COLORS = ["#0062FF", "#12C6FF", "#FF647F", "#FF9354"];

type Props = {
    data: {
        name: string;
        value: number;
    }[];
};

export const PieVariant = ({ data }: Props) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <PieChart>
                <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    content={({ payload }: any) => (
                        <ul className="flex flex-wrap justify-center gap-3 mt-2">
                            {payload.map((entry: any, index: number) => (
                                <li
                                    key={`item-${index}`}
                                    className="flex items-center gap-2 text-sm"
                                >
                                    <span
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="text-muted-foreground">
                                        {entry.value}
                                    </span>
                                    <span className="font-medium">
                                        {formatPercentage(entry.payload.percent * 100)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                />
                <Tooltip content={<Categorytip />} />
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={50}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                >
                    {data.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
};
