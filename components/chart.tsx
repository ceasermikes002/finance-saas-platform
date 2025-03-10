import { AreaChart, BarChart, FileSearch, LineChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AreaVariant } from "./area-variant";
import { BarVariant } from "./bar-variant";
import { LineVariant } from "./line-variant";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type Props = {
    data?: {
        date: string;
        income: number;
        expenses: number;
    }[]
}

export const Chart = ({ data = [] }: Props) => {
    const [chartType, setChartType] = useState('area')

    const onTypeChange = (type: string) => {
        setChartType(type)
    }

    const renderChart = () => {
        if (data.length === 0) {
            return (
                <div className="flex flex-col gap-y-4 items-center justify-center h-[350px] w-full">
                    <FileSearch className="size-6 text-muted-foreground"/>
                    <p className="text-muted-foreground text-sm">
                        No data for this period
                    </p>
                </div>
            );
        }

        const charts = {
            line: <LineVariant key="line" data={data} />,
            area: <AreaVariant key="area" data={data} />,
            bar: <BarVariant key="bar" data={data} />
        };

        return charts[chartType as keyof typeof charts];
    };

    return (
        <Card className="border-none drop-shadow-sm">
            <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
                <CardTitle className="text-xl line-clamp-1">
                    Transactions
                </CardTitle>
                <Select defaultValue={chartType} onValueChange={onTypeChange}>
                    <SelectTrigger className="lg:w-auto h-9 rounded-md px-3">
                        <SelectValue placeholder="Select chart type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="area">
                            <div className="flex items-center">
                                <AreaChart className="size-4 mr-2 shrink-0" />
                                <p className="line-clamp-1">Area chart</p>
                            </div>
                        </SelectItem>
                        <SelectItem value="line">
                            <div className="flex items-center">
                                <LineChart className="size-4 mr-2 shrink-0" />
                                <p className="line-clamp-1">Line chart</p>
                            </div>
                        </SelectItem>
                        <SelectItem value="bar">
                            <div className="flex items-center">
                                <BarChart className="size-4 mr-2 shrink-0" />
                                <p className="line-clamp-1">Bar chart</p>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            
            <CardContent>
                {renderChart()}
            </CardContent>
        </Card>
    )
}