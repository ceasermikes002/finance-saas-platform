    import { Button } from "@/components/ui/button";
    import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
    import { JSX, useRef, useState } from "react";
    import { useGetAccounts } from "../api/use-get-accounts";
    import { useCreateAccount } from "../api/use-create-account";
    import { Select } from "@/components/select";

    export const useSelectAccount = (): [() => JSX.Element, () => Promise<string | undefined>] => {
        const accountQuery = useGetAccounts()
        const accountMutation = useCreateAccount()
        const onCreateAccount = (name:string) => accountMutation.mutate({
            name
        })
        const accountOptions = (accountQuery.data ?? [])
        .map((account) => ({
            label: account.name,
            value: account.id,
        }))

        const [promise, setPromise] = useState<{ resolve: (value: string | undefined) => void } | null>(null);
        const selectValue = useRef<string | undefined>('');

        const confirm = () =>
            new Promise<string | undefined>((resolve) => {
                setPromise({
                    resolve: (value) => resolve(value ?? undefined), // Ensure it returns a string or null
                });
            });
        
        

        const handleClose = () => {
            setPromise(null);
        };

        const handleConfirm = () => {
            promise?.resolve(selectValue.current || undefined); // Ensure it returns a string or null
            handleClose();
        };
        

        const handleCancel = () => {
            promise?.resolve(undefined);
            handleClose();
        };

        const ConfirmationDialog = () => {
            return (
                <Dialog open={promise !== null} onOpenChange={handleClose}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{'Select Account'}</DialogTitle>
                            <DialogDescription>{'Please Select an account to continue'}</DialogDescription>
                        </DialogHeader>
                        <Select
                        placeholder="Select an account"
                        options={accountOptions}
                        onCreate={onCreateAccount}
                        onChange={(value) => selectValue.current = value}
                        disabled={accountQuery.isLoading || accountMutation.isPending}
                        />
                        <DialogFooter className="pt-2">
                            <Button onClick={handleCancel} variant="outline">
                                Cancel
                            </Button>
                            <Button onClick={handleConfirm}>
                                Confirm
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            );
        };

        return [ConfirmationDialog, confirm];
    };
