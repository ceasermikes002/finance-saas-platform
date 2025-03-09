"use client"

import { useGetSummary } from "@/features/summary/api/use-get-summary"
import { formatDateRange } from "@/lib/utils"
import { useSearchParams } from "next/navigation"
import { FaPiggyBank } from "react-icons/fa"
import { MdTrendingUp, MdTrendingDown } from "react-icons/md";
import { DataCard, DataCardLoading } from "./data-card"

export const DataGrid = () => {
    const { data, isLoading } = useGetSummary()
    const params = useSearchParams()
    const to = params.get('to') || undefined
    const from = params.get('from') || undefined

    const dateRangeLabel = formatDateRange({ to, from })

    if(isLoading) {
        return(
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-4 mt-8">
                <DataCardLoading/>
                <DataCardLoading/>
                <DataCardLoading/>
            </div>

        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-4 mt-8">
            <DataCard
                title="Remaining"
                value={data?.remainingAmount}
                percentageChange={data?.remainingChange}
                icon={FaPiggyBank}
                dateRange={dateRangeLabel}
            />
            <DataCard
                title="Income"
                value={data?.incomeAmount}
                percentageChange={data?.incomeChange}
                icon={MdTrendingUp}
                dateRange={dateRangeLabel}
            />
            <DataCard
                title="Expenses"
                value={data?.expensesAmount}
                percentageChange={data?.expensesChange}
                icon={MdTrendingDown}
                dateRange={dateRangeLabel}
            />
        </div>
    )
}