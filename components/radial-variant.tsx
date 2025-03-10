/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Tooltip,
    Legend,
    RadialBar,
    RadialBarChart,
    ResponsiveContainer
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { Categorytip } from "./category-tooltip";

const COLORS = ["#0062FF", "#12C6FF", "#FF647F", "#FF9354"];

type Props = {
    data: {
        name: string;
        value: number;
    }[];
};

export const RadialVariant = ({ data }: Props) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <RadialBarChart
            cx={'50%'}
            cy={'30%'}
            barSize={10}
            innerRadius={'90%'}
            outerRadius={'40%'}
            data={data.map((item, index) => ({
                ...item,
                fill: COLORS[index % COLORS.length]
            }))}
            >
                <RadialBar
                label={{
                    position: "insideStart",
                    fill: "#fff",
                    fontSize:"12px"
                }}
                background
                dataKey={'value'}
                />
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
                                        {formatCurrency(entry.payload.value)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                />
                <Tooltip content={<Categorytip />} />
            </RadialBarChart>
        </ResponsiveContainer>
    );
};
