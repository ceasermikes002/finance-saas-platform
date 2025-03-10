import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, PlusIcon } from 'lucide-react'
import React from 'react'
import { DataTable } from '@/components/data-table'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { useBulkDeleteCategories } from '@/features/categories/api/use-bulk-delete-categories'
import { useNewCategory } from '@/features/categories/hooks/use-new-category'
import { columns } from '@/app/(dashboard)/categories/columns'

export const CategoryContent = () => {
    const newCategory = useNewCategory()
    const categoriesQuery = useGetCategories()
    const deleteCategories = useBulkDeleteCategories()
    const categories = categoriesQuery.data || []
  
    const isDisabled = categoriesQuery.isLoading || categoriesQuery.isPending
  

  if (categoriesQuery.isLoading) {
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
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-16'>
        <Card className='border-none drop-shadow-sm'>
          <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
            <CardTitle className='text-xl line-clamp-1'>
              Categories Page
            </CardTitle>
            <Button onClick={newCategory.onOpen} size={'sm'}>
              <PlusIcon className='size-4 mr-2' />
              Add new
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={categories} filterkey='name' onDelete={(row) => { 
              const ids = row.map((r) => r.original.id)
              deleteCategories.mutate({ids})
             }} disabled={isDisabled} />
          </CardContent>
        </Card>
      </div>
    )
}