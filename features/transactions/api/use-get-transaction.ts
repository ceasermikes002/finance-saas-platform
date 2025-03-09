import { client } from '@/lib/hono';
import { convertAmountfromilliunits } from '@/lib/utils';
import {useQuery} from '@tanstack/react-query';
    
export const useGetTransaction = (id?: string) => {
    const query = useQuery({
        enabled: !!id,
        queryKey: ['summary', { id }],
        queryFn: async () => {
            const response = await client.api.transactions[":id"].$get({ 
                param: { id }
             })
                if(!response.ok) {
                    throw new Error("Failed to fetch transaction");
                }
            const { data } = await response.json()
            return {
                ...data,
                amount: convertAmountfromilliunits(data.amount)
            }
        }
    })
    return query    
}