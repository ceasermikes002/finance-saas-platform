import { z } from 'zod'
import { Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import {
    Form,
    FormField,
    FormLabel,
    FormItem,
    FormControl,
} from '@/components/ui/form'
import { insertCategorySchema } from '@/database/schema'

const formSchema = insertCategorySchema .pick({
    name: true,
})

type FormValues = z.infer<typeof formSchema>

type Props = {
    id?: string
    defaultValues?: FormValues
    onSubmit: (values: FormValues) => void
    onDelete?: () => void
    disabled?: boolean
}

export const CategoryForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled,
}: Props) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    })
    const handleSubmit = (values: FormValues) => {
        onSubmit(values)
    }

    const handleDelete = () => {
        onDelete?.()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6 pt-6'> 
                <FormField
                    name='name'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Account Name</FormLabel>
                            <FormControl>
                                <Input
                                    disabled={disabled}
                                    placeholder='Food, Travel, etc'
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <div className='space-y-5 flex flex-col'>
                    <Button className='w-full' disabled={disabled}>
                        {id ? "Save Changes" : "Create Category"}
                    </Button>
                    <br /> 
                   {!!id && (
                     <Button type="button" disabled={disabled} onClick={handleDelete} className='w-full mt-7' variant="outline">   
                     <Trash className='size-4 mr-2'/>
                     <span>Delete Category</span>
                 </Button>
                   )}
                </div>
            </form>
        </Form>
    )
}
