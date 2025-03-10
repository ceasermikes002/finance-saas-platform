"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, PlusIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transactions'
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions'
import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-delete-transactions'
import { transactions as transactionSchema } from '@/database/schema'
import { useSelectAccount } from '@/features/accounts/hooks/use-select-account'
import { toast } from 'sonner'
import { useBulkCreateTransactions } from '@/features/transactions/api/use-bulk-create'
import { columns } from '@/app/(dashboard)/transactions/columns'
import { ImportCard } from '@/app/(dashboard)/transactions/import-card'
import { UploadButton } from '@/app/(dashboard)/transactions/upload-button'
import { DataTable } from './data-table'


enum VARIANTS {
    LIST = "LIST",
    IMPORT = "IMPORT"
  }
  
  const INITIAL_IMPORT_RESULTS = {
    data: [],
    errors: [],
    meta: {},
  }
  
export const TransactionContent = () => {
    const [AccountDialog, confirm] = useSelectAccount()
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST)
  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    setImportResults(results)
    setVariant(VARIANTS.IMPORT)

  }
  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS)
    setVariant(VARIANTS.LIST)
  }
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS)
  const newTransaction = useNewTransaction()
  const createTransactions = useBulkCreateTransactions()
  const transactionsQuery = useGetTransactions()
  const deleteTransactions = useBulkDeleteTransactions()
  const transactions = transactionsQuery.data || []

  const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending

  const onSubmitImport = async (values: typeof transactionSchema.$inferInsert[]) => {
    const accountId = await confirm();
    if (!accountId) {
        return toast.error("Please select an account to continue");
    }

    const data = values.map((value) => ({
        ...value,
        accountId,
    }));

    createTransactions.mutate(data, {
        onSuccess: () => {
            onCancelImport();
        }
    });
};


  if (transactionsQuery.isLoading) {
    return (
      <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
        <Card className='border-none drop-shadow-sm'>
          <CardHeader>
            <Skeleton className='w-48 h-8' />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className='size-6 text-slate-300 animate-spin' />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    )
  }

  return (
    <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
      <Card className='border-none drop-shadow-sm'>
        <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
          <CardTitle className='text-xl line-clamp-1'>
            Transaction History
          </CardTitle>
          <div className="flex items-center gap-x-2">
            <Button className='w-full lg:w-auto flex flex-col lg:flex-row' onClick={newTransaction.onOpen} size={'sm'}>
              <PlusIcon className='size-4 mr-2' />
              Add new
            </Button>
            <UploadButton onUpload={onUpload} />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={transactions} filterkey='payee' onDelete={(row) => {
            const ids = row.map((r) => r.original.id)
            deleteTransactions.mutate({ ids })
          }} disabled={isDisabled} />
        </CardContent>
      </Card>
    </div>
  )

}