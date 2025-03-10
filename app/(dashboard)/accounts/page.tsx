"use client"
import React, { Suspense } from 'react'
import { AccountContent } from '@/components/account-content'



const AccountsPage = () => {
  

  
  return (
    <Suspense fallback={<div>Loading...</div>}>
     <AccountContent/>
    </Suspense>
  )
}

export default AccountsPage