"use client";

import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { Chart } from "./chart";
import { SpendingPie } from "./spending-pie";

export const DataCharts = () => {
    const { data, isLoading } = useGetSummary();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-12 gap-6">
            {/* Main Chart Section */}
            <div className="col-span-12 lg:col-span-8 bg-white rounded-lg shadow-md p-4">
                <Chart data={data?.days} />
            </div>

            {/* Spending Pie Chart Section */}
            <div className="col-span-12 lg:col-span-4 bg-white rounded-lg shadow-md p-4">
                <SpendingPie data={data?.categories} />
            </div>
        </div>
    );
};
