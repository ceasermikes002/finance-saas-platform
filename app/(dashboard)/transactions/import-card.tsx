/* eslint-disable @typescript-eslint/no-explicit-any */
const dateFormat = "yyyy-MM-dd HH:mm:ss"; 
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { ImportTable } from "./import-table"
import { convertAmountToMilliunits } from "@/lib/utils"
import { format, parse } from "date-fns"
const outputFormat = "yyyy-MM-dd"

const requiredOptions = [
  "amount",
  "date",
  "payee",
]

interface SelectedColumnState {
  [key: string]: string | null
}

type Props = {
  data: string[][]
  onCancel: () => void
  onSubmit: (data: any) => void
}

export const ImportCard = ({
  data,
  onCancel,
  onSubmit
}: Props) => {
  const [selectedColums, setSelectedColums] = useState<SelectedColumnState>({})

  const headers = data[0]
  const body = data.slice(1)
  const onTableHeadSelectChange = (
    columnIndex: number,
    value: string | null
  ) => {
    setSelectedColums((prev) => {
      const newSelectedColumns = { ...prev };

      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null
        }
      }
      if (value === "skip") {
        value = null;
      }

      newSelectedColumns[`column_${columnIndex}`] = value
      return newSelectedColumns
    })
  }

  const progress = Object.values(selectedColums).filter(Boolean).length

  const handleContinue = () => {
    const getColumnIndex = (column: string) => Number(column.split("_")[1]); // Convert index to number
  
    const mappedData = {
      headers: headers.map((_header, index) => {
        const columnIndex = getColumnIndex(`column_${index}`);
        return selectedColums[`column_${columnIndex}`] || null;
      }),
      body: body.map((row) => {
        const transformedRow = row.map((cell, index) => {
          const columnIndex = getColumnIndex(`column_${index}`);
          return selectedColums[`column_${columnIndex}`] ? cell : null;
        });
  
        return transformedRow.every((item) => item === null) ? [] : transformedRow;
      }).filter((row) => row.length > 0),
    };
  
    const arrayOfData = mappedData.body.map((row) => {
      return row.reduce((acc: Record<string, any>, cell, index) => {
        const header = mappedData.headers[index];
  
        if (header !== null) {
          acc[header] = cell;
        }
  
        return acc;
      }, {}); // Always start with an empty object to prevent null errors
    });
  
    const formattedData = arrayOfData.map((item) => ({
      ...item,
      amount: convertAmountToMilliunits(parseFloat(item.amount)),
      date: format(parse(item.date, dateFormat, new Date()), outputFormat)
    }))

    onSubmit(formattedData)
  };
  

  return (
    <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
      <Card className='border-none drop-shadow-sm'>
        <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
          <CardTitle className='text-xl line-clamp-1'>
            Import Transaction
          </CardTitle>
          <div className="flex items-center flex-col lg:flex-row gap-x-2">
            <Button onClick={onCancel} size={'sm'} className="w-full lg:w-auto">
              Cancel
            </Button>
            <Button disabled={progress < requiredOptions.length}
              onClick={handleContinue}
            >
              Continue ({progress} / {requiredOptions.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ImportTable
            headers={headers}
            body={body}
            selectedColumns={selectedColums}
            onTableHeadSelectChange={onTableHeadSelectChange}
          />
        </CardContent>
      </Card>
    </div>

  )
}