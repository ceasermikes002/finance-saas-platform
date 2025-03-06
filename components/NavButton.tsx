import { NavButtonProps } from "@/types/navButton"
import { Button } from "./ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

const NavButton = ({
  href,
  label,
  isActive,
}:NavButtonProps) => {
  return (
    <Button
    asChild
    size={'sm'}
    variant={'outline'}
    className={cn(
      'w-full lg-w-auto justify-between font-normal hover:bg-white/20 hover:text-white border-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-50 outline-none text-white focus:bg-white/30 transition',
      isActive ? 'bg-white/10 text-white' : 'bg-transparent'
    )}>
      <Link href={href}>
          {label}
      </Link>
    </Button>
  )
}

export default NavButton