"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account"
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account"
import { useConfirm } from "@/hooks/use-confirm"
import { EditIcon, MoreHorizontalIcon, Trash2Icon } from "lucide-react"

type Props = {
    id: string
}

export const Actions = ({id}:Props) => {
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "Are you sure you want to delete this account",
    )
    const deleteMutation =  useDeleteAccount(id)
    const { onOpen } = useOpenAccount()

    const handleDelete = async () => {
        const ok = await confirm()

        if(ok) {
            deleteMutation.mutate()
        }
    }

    return (
        <>
        <ConfirmDialog />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button className="size-8 p-0" variant={'ghost'}>
                <MoreHorizontalIcon className="size-4" />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuItem disabled={deleteMutation.isPending} onClick={() => onOpen(id)}>
                <EditIcon className="size-4 mr-2" />
                Edit
            </DropdownMenuItem>
            <DropdownMenuItem disabled={deleteMutation.isPending} onClick={handleDelete}>
                <Trash2Icon className="size-4 mr-2" />
                Delete
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </>
    )
}