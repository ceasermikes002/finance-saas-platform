import { z } from 'zod'
import { Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { insertTransactionSchema } from '@/database/schema'

import {
    Form,
    FormField,
    FormLabel,
    FormItem,
    FormControl,
} from '@/components/ui/form'
import { Select } from '@/components/select'
import { DatePicker } from '@/components/date-picker'
import { Textarea } from '@/components/ui/textarea'
import { AmountInput } from '@/components/amount-input'
import { convertAmountToMilliunits } from '@/lib/utils'

const formSchema = z.object({
    date: z.coerce.date(),
    accountId: z.string(),
    categoryId: z.string().nullable().optional(),
    amount: z.string(),
    payee: z.string(),
    notes: z.string().nullable().optional(),
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apiSchema = insertTransactionSchema.omit({
    id: true
})

type FormValues = z.infer<typeof formSchema>
type ApiFormValues = z.infer<typeof apiSchema>

type Props = {
    id?: string
    defaultValues?: FormValues
    onSubmit: (values: ApiFormValues) => void
    onDelete?: () => void
    disabled?: boolean
    accountOptions: { label: string; value: string; }[]
    categoryOptions: { label: string; value: string; }[]
    onCreateAccount: (name: string) => void
    onCreateCategory: (name: string) => void
}

export const TransactionForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled,
    accountOptions,
    categoryOptions,
    onCreateAccount,
    onCreateCategory
}: Props) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    })
    const handleSubmit = (values: FormValues) => {
        const amount = parseFloat(values.amount)
        const amountInMilliunits = convertAmountToMilliunits(amount)

        onSubmit({
            ...values,
            amount: amountInMilliunits,
        })
    }

    const handleDelete = () => {
        onDelete?.()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6 pt-6'>
                {/* Date */}
                <FormField
                    name='date'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <DatePicker
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={disabled}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    name='accountId'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Account</FormLabel>
                            <FormControl>
                                <Select
                                    placeholder='Select an account'
                                    options={accountOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={disabled}
                                    onCreate={onCreateAccount}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                {/* Category Form */}
                <FormField
                    name='categoryId'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Category
                            </FormLabel>
                            <FormControl>
                                <Select
                                    placeholder='Select a category'
                                    options={categoryOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={disabled}
                                    onCreate={onCreateCategory}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                {/* Payee field */}
                <FormField
                    name='payee'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Payee</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='Add a payee'
                                    disabled={disabled}
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    name='amount'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <AmountInput
                                    {...field}
                                    placeholder='0.00'
                                    disabled={disabled}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />


                <FormField
                    name='notes'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    value={field.value ?? ""}
                                    placeholder='Add optional notes'
                                    disabled={disabled}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />


                <div className='space-y-5 flex flex-col'>
                    <Button className='w-full' disabled={disabled} type='submit'>
                        {id ? "Save Changes" : "Create Transaction"}
                    </Button>
                    <br />
                    {!!id && (
                        <Button type="button" disabled={disabled} onClick={handleDelete} className='w-full mt-7' variant="outline">
                            <Trash className='size-4 mr-2' />
                            <span>Delete Account</span>
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    )
}
