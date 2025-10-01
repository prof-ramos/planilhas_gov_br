'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, Calendar, Users, Search, Table } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Overview',
    href: '/',
    icon: Building2,
  },
  {
    name: 'Data Explorer',
    href: '/explorer',
    icon: Table,
  },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <div className="border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-16 items-center px-8">
        <div className="flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">Concursos Públicos</h1>
        </div>
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-2 text-sm font-medium transition-colors hover:text-blue-600 rounded px-3 py-2',
                  pathname === item.href
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500'
                )}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <p className="text-sm text-gray-500">
            Dados oficiais DOU | 2001-2025
          </p>
        </div>
      </div>
    </div>
  )
}
