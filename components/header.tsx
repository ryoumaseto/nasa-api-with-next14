"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, Image, Camera } from '@mui/icons-material'

const navItems = [
  { href: '/', label: 'ホーム', icon: Home },
  { href: '/apod', label: 'APOD', icon: Image },
  { href: '/mars-rover', label: '火星探査車', icon: Camera },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-50 backdrop-blur-md">
      <nav className="container mx-auto px-4 py-4">
        <ul className="flex justify-center space-x-8">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="relative group">
                <span className="flex items-center text-gray-300 hover:text-white transition-colors">
                  <item.icon className="w-6 h-6 mr-2" />
                  {item.label}
                </span>
                {pathname === item.href && (
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500"
                    layoutId="underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}