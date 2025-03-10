"use client"
import React, { useState } from 'react'
import NavButton from './NavButton'
import { useMedia } from 'react-use'
import { usePathname, useRouter } from 'next/navigation'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Button } from './ui/button'
import { Menu } from 'lucide-react'

const routes = [
    {
        href: '/',
        label: 'Overview',
    },
    {
        href: '/transactions',
        label: 'Transactions',
    },
    {
        href: '/accounts',
        label: 'Accounts',
    },
    {
        href: '/categories',
        label: 'Categories',
    },
    {
        href: '/settings',
        label: 'Settings',
    },
]

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    const isMobile = useMedia('(max-width: 1023px)', false)
    const pathname = usePathname()
    const onClick = (href:string) => {
        router.push(href)
        setIsOpen(false)
    }


    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={()=>setIsOpen(!isOpen)}>
                <SheetTrigger asChild>
                    <div className='cursor-pointer rounded-md px-3 py-2 font-normal bg-white/10 text-white hover:bg-white/20 hover:text-white border-none focus:visible:ring-transparent focus-visible:ring-white focus-visible:ring-opacity-50 outline-none focus:bg-white/30 transition'>
                        <Menu size={16} />
                    </div>
                </SheetTrigger>
                <SheetContent side={'left'} className='px-2'>
                    <nav className='flex flex-col gap-y-2 pt-6'>
                        {routes.map((route)=>(
                            <Button key={route.href} onClick={()=>onClick(route.href)}  
                            variant={route.href === pathname ? 'secondary' : 'ghost'} size={'sm'}>
                                {route.label}
                            </Button>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        )
    }
    return (
        <nav className='hidden lg:flex items-center gap-x-2 overflow-x-auto'>
            {routes.map((route)=>(
                <NavButton
                key={route.href}
                href={route.href}
                label={route.label}
                isActive={pathname === route.href}
                />
            ))}
        </nav>
    )
}

export default Navigation