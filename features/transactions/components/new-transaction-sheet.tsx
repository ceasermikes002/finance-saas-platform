"use client"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet'
import { useNewTransaction } from '../hooks/use-new-transactions'
import { insertTransactionSchema } from '@/database/schema'
import { z } from 'zod'
import { useCreateTransaction } from '../api/use-create-transaction'
import { useCreateCategory } from '@/features/categories/api/use-create-category'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts'
import { useCreateAccount } from '@/features/accounts/api/use-create-account'
import { TransactionForm } from './transaction-form'
import { Loader2 } from 'lucide-react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = insertTransactionSchema.omit({
    id: true,
})

type FormValues = z.infer<typeof formSchema>



export const NewTransactionsSheet = () => {
    const { isOpen, onClose } = useNewTransaction()
    const createMutation = useCreateTransaction()


    const categoryQuery = useGetCategories()
    const categoryMutation = useCreateCategory()
    const onCreateCategory = (name: string) => categoryMutation.mutate({ name })
    const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
        label: category.name,
        value: category.id,
    }))
    // ACCOUNTS
    const accountsQuery = useGetAccounts()
    const accountMutation = useCreateAccount()
    const onCreateAccount = (name: string) => accountMutation.mutate({ name })
    const accountOptions = (accountsQuery.data ?? []).map((category) => ({
        label: category.name,
        value: category.id,
    }))


    const onSubmit = (values: FormValues) => {
        createMutation.mutate(values, {
            onSuccess: () => {
                onClose()
            }
        })
    }
    const isPending =
        createMutation.isPending ||
        categoryMutation.isPending ||
        accountMutation.isPending;

    const isLoading =
        categoryQuery.isLoading ||
        accountsQuery.isLoading;

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className='space-y-4'>
                <SheetHeader>
                    <SheetTitle>
                        New Transaction
                    </SheetTitle>
                    <SheetDescription>
                        Add a new transaction
                    </SheetDescription>
                </SheetHeader>
                {isLoading ? (
                    < div className='flex justify-center absolute inset-0 items-center'>
                        <Loader2 className='size-4 text-muted-foreground animate-spin' />
                    </div>
                ) : (
                    <TransactionForm
                        onSubmit={onSubmit}
                        categoryOptions={categoryOptions}
                        accountOptions={accountOptions}
                        onCreateCategory={onCreateCategory}
                        onCreateAccount={onCreateAccount}
                        disabled={isPending}
                    />
                )}
            </SheetContent>
        </Sheet>
    )
}
