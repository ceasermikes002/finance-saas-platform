import { TransactionContent } from "@/components/transaction-content"
import { Suspense } from "react"




const TransactionsPage = () => {
  return(
    <Suspense fallback={<div>Loading...</div>}>
      <TransactionContent/>
    </Suspense>
  )

  
}

export default TransactionsPage 