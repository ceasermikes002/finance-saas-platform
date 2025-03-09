"use client"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { useConfirm } from '@/hooks/use-confirm'
import { useOpenTransaction } from '../hooks/use-open-transactions'
import { TransactionForm } from './transaction-form'
import { useEditTransaction } from '../api/use-edit-transaction'
import { useDeleteTransaction } from '../api/use-delete-transaction'
import { insertTransactionSchema } from '@/database/schema'
import { useCreateAccount } from '@/features/accounts/api/use-create-account'
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts'
import { useCreateCategory } from '@/features/categories/api/use-create-category'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { useGetTransaction } from '../api/use-get-transaction'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = insertTransactionSchema.omit({
    id: true,
})

type FormValues = z.infer<typeof formSchema>

export const EditTransactionSheet = () => {
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this transaction",
    )
    const { isOpen, onClose, id } = useOpenTransaction()
    const transactionQuery = useGetTransaction(id)
    const editMutation = useEditTransaction(id)
    const deleteMutation =  useDeleteTransaction(id)

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

    const isPending = editMutation.isPending || deleteMutation.isPending || transactionQuery.isLoading || categoryMutation.isPending || accountMutation.isPending
    const isLoading = transactionQuery.isLoading || transactionQuery.isPending ||categoryQuery.isLoading || accountsQuery.isLoading
    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose()
            }
        })
    }

    const onDelete = async () => {
        const ok = await confirm()

        if(ok) {
            deleteMutation.mutate(undefined, {
                onSuccess() {
                    onClose()
                },
            })
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const defaultValues:any = transactionQuery.data ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: transactionQuery.data.amount,
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,
        date: transactionQuery.data.date ? 
        new Date(transactionQuery.data.date) : new Date(),
    } : {
        accountId: '',
        categoryId: '',
        amount: '', 
        payee: '',
        notes: '',
        date: '',

    }
    return (
        <>
        <ConfirmDialog />
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className='space-y-4'>
                <SheetHeader>
                    <SheetTitle>
                        Edit Transaction
                    </SheetTitle>
                    <SheetDescription>
                        Edit your existing transactions
                    </SheetDescription>
                </SheetHeader>
                {isLoading
                    ? (
                        <div className='absolute inset-0 flex items-center justify-center'>
                            <Loader2 className='text-muted-foreground size-4 animate-out' />
                        </div>
                    ) :
                    <TransactionForm 
                    id={id}
                    defaultValues={defaultValues}
                    onSubmit={onSubmit}
                    onDelete={onDelete}
                    categoryOptions={categoryOptions}
                    accountOptions={accountOptions}
                    onCreateCategory={onCreateCategory}
                    onCreateAccount={onCreateAccount}
                    disabled={isPending} />}
            </SheetContent>
        </Sheet></>
    )
}