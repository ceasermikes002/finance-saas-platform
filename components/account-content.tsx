import { Loader2, PlusIcon } from "lucide-react"
import { DataTable } from "./data-table"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { columns } from "@/app/(dashboard)/accounts/columns"
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete-accounts"
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts"
import { useNewAccount } from "@/features/accounts/hooks/use-new-account"
import { Skeleton } from "./ui/skeleton"

export const AccountContent = () => {
    const newAccount = useNewAccount()
  const accountsQuery = useGetAccounts()
  const deleteAccounts = useBulkDeleteAccounts()
  const accounts = accountsQuery.data || []
  const isDisabled = accountsQuery.isLoading || accountsQuery.isPending


  if (accountsQuery.isLoading) {
    return (
      <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
        <Card className='border-none drop-shadow-sm'>
          <CardHeader>
            <Skeleton className='w-48 h-8' />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className='size-6 text-slate-300 animate-spin'/>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  
    return(
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
        <Card className='border-none drop-shadow-sm'>
          <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
            <CardTitle className='text-xl line-clamp-1'>
              AccountsPage
            </CardTitle>
            <Button onClick={newAccount.onOpen} size={'sm'}>
              <PlusIcon className='size-4 mr-2' />
              Add new
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={accounts} filterkey='name' onDelete={(row) => { 
              const ids = row.map((r) => r.original.id)
              deleteAccounts.mutate({ids})
             }} disabled={isDisabled} />
          </CardContent>
        </Card>
      </div>
    )
}