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
import { useOpenCategory } from '../hooks/use-open-category'
import { insertCategorySchema } from '@/database/schema'
import { useGetCategory } from '../api/use-get-category'
import { useEditCategory } from '../api/use-edit-category'
import { useDeleteCategory } from '../api/use-delete-category'
import { CategoryForm } from './category-form'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = insertCategorySchema.pick({
    name: true,
})

type FormValues = z.infer<typeof formSchema>

export const EditCategorySheet = () => {
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this category",
    )
    const { isOpen, onClose, id } = useOpenCategory()
    const accountQuery = useGetCategory(id)
    const editMutation = useEditCategory(id)
    const deleteMutation =  useDeleteCategory(id)

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
                        Edit Category
                    </SheetTitle>
                    <SheetDescription>
                        Edit the category details
                    </SheetDescription>
                </SheetHeader>
                {isLoading
                    ? (
                        <div className='absolute inset-0 flex items-center justify-center'>
                            <Loader2 className='text-muted-foreground size-4 animate-out' />
                        </div>
                    ) :
                    <CategoryForm onSubmit={onSubmit} disabled={isPending} id={id}
                        defaultValues={defaultValues} onDelete={() => onDelete} />}
            </SheetContent>
        </Sheet>
        </>
    )
}