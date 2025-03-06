"use client"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet'
import { AccountForm } from './account-form'
import { insertAccountSchema } from '@/database/schema'
import { z } from 'zod'
import { useOpenAccount } from '../hooks/use-open-account'
import { useGetAccount } from '../api/use-get-account'
import { Loader2 } from 'lucide-react'
import { useEditAccount } from '../api/use-edit-account'
import { useDeleteAccount } from '../api/use-delete-account'
import { useConfirm } from '@/hooks/use-confirm'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = insertAccountSchema.pick({
    name: true,
})

type FormValues = z.infer<typeof formSchema>

export const EditAccountSheet = () => {
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this account",
    )
    const { isOpen, onClose, id } = useOpenAccount()
    const accountQuery = useGetAccount(id)
    const editMutation = useEditAccount(id)
    const deleteMutation =  useDeleteAccount(id)

    const isPending = editMutation.isPending || deleteMutation.isPending
    const isLoading = accountQuery.isLoading || accountQuery.isPending
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

    const defaultValues = accountQuery.data ? {
        name: accountQuery.data.name,
    } : {
        name: '',
    }
    return (
        <>
        <ConfirmDialog />
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className='space-y-4'>
                <SheetHeader>
                    <SheetTitle>
                        Edit Account
                    </SheetTitle>
                    <SheetDescription>
                        Edit the account details
                    </SheetDescription>
                </SheetHeader>
                {isLoading
                    ? (
                        <div className='absolute inset-0 flex items-center justify-center'>
                            <Loader2 className='text-muted-foreground size-4 animate-out' />
                        </div>
                    ) :
                    <AccountForm onSubmit={onSubmit} disabled={isPending} id={id}
                        defaultValues={defaultValues} onDelete={() => onDelete} />}
            </SheetContent>
        </Sheet></>
    )
}