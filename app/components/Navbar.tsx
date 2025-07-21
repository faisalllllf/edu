'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, LogOut, User } from 'lucide-react'
import { Menu as DropdownMenu, Transition } from '@headlessui/react'
import '../login/login-font.css'

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setUser(data)
      })
  }, [])

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
  /*  <nav className="w-full bg-white border-b border-gray-200 text-cyan-700 px-6 py-3 shadow-sm flex items-center justify-between font-montserrat bg-gray-100">
      <div className="flex items-center gap-4 bg-gray-100">
        <button className="md:hidden bg-cyan-50 hover:bg-cyan-100 p-2 rounded-lg transition" onClick={onMenuClick}>
          <Menu className="w-6 h-6" />
        </button>
        
        <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full shadow-md" />
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight hidden sm:block">EduSaaS</h1>
        
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <DropdownMenu as="div" className="relative inline-block text-left">
            <DropdownMenu.Button className="flex items-center gap-2 focus:outline-none">
              <img
                src="/profile.jpg"
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover border border-cyan-700"
              />
            </DropdownMenu.Button>

            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <DropdownMenu.Items className="absolute right-0 mt-2 w-44 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none z-50">
                <div className="px-4 py-3 text-sm text-gray-700">
                  👋 Hello, <strong>{user.name}</strong>
                </div>
                <div className="border-t border-gray-100" />
                <DropdownMenu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`${
                        active ? 'bg-red-100 text-red-600' : 'text-red-500'
                      } w-full text-left px-4 py-2 text-sm flex items-center gap-2`}
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  )}
                </DropdownMenu.Item>
              </DropdownMenu.Items>
            </Transition>
          </DropdownMenu>
        )}
      </div>
    </nav>*/



    <nav className="w-full bg-[#1D2340] text-white px-6 py-3 shadow-sm flex items-center justify-between font-montserrat">
  <div className="flex items-center gap-4">
    <button className="md:hidden text-white hover:text-cyan-300 p-2 rounded-lg transition" onClick={onMenuClick}>
      <Menu className="w-6 h-6" />
    </button>

    <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full shadow-md" />
    <h1 className="text-xl sm:text-2xl font-bold tracking-tight hidden sm:block">EduSaaS</h1>
  </div>

  <div className="flex items-center space-x-4">
    {user && (
      <DropdownMenu as="div" className="relative inline-block text-left">
        <DropdownMenu.Button className="flex items-center gap-2 focus:outline-none">
          <img
            src="/profile.jpg"
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover border border-cyan-400"
          />
        </DropdownMenu.Button>

        <Transition
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <DropdownMenu.Items className="absolute right-0 mt-2 w-44 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none z-50">
            <div className="px-4 py-3 text-sm text-gray-700">
              👋 Hello, <strong>{user.name}</strong>
            </div>
            <div className="border-t border-gray-100" />
            <DropdownMenu.Item>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={`${
                    active ? 'bg-red-100 text-red-600' : 'text-red-500'
                  } w-full text-left px-4 py-2 text-sm flex items-center gap-2`}
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              )}
            </DropdownMenu.Item>
          </DropdownMenu.Items>
        </Transition>
      </DropdownMenu>
    )}
  </div>
</nav>

  )
}
