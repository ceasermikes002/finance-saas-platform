"use client"
import React, { Suspense } from 'react'
import { CategoryContent } from '@/components/category-content'

const CategoriesPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryContent/>
    </Suspense>
  )
}

export default CategoriesPage