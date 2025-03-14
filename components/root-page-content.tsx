"use client"

import { DataCharts } from '@/components/data-charts';
import { DataGrid } from '@/components/data-grid';
export const RootPageContent = () => {
    return (
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
      <DataGrid/>
      <DataCharts/>
    </div>
    )
}