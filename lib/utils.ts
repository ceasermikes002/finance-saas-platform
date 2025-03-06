import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function convertAmountToMilliunits(amount: number) {
  return Math.round(amount * 1000)
}
export function convertAmountfromilliunits(amount: number) {
  return (amount / 1000)
}

export function formatCurrency(value: number) {
  const finalValue = convertAmountfromilliunits(value)

  return Intl.NumberFormat("en-US" ,{
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(finalValue)
}