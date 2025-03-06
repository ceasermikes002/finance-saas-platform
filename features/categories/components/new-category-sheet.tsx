"use client"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet'
import { z } from 'zod'
import { insertCategorySchema } from '@/database/schema'
import { useCreateCategory } from '../api/use-create-category'
import { CategoryForm } from './category-form'
import { useNewCategory } from '../hooks/use-new-category'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = insertCategorySchema.pick({
    name: true,
})

type FormValues = z.infer<typeof formSchema>

export const NewCategorySheet = () => {
    const { isOpen, onClose } = useNewCategory()
    const mutation = useCreateCategory()
    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose()
            }
        })
    }
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className='space-y-4'>
                <SheetHeader>
                    <SheetTitle>
                        New Category
                    </SheetTitle>
                    <SheetDescription>
                        Create a new category to categorize your accounts
                    </SheetDescription>
                </SheetHeader>
                <CategoryForm onSubmit={onSubmit} disabled={mutation.isPending}
                    defaultValues={{
                        name: '',
                    }} />
            </SheetContent>
        </Sheet>
    )
}

