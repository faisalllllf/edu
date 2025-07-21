'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import AddHolidaysPage from '@/app/components/admin/AddHolidays'
import GetHolidaysPage from '@/app/components/admin/GetHolidays'

export default function AdminHolidaysPage() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 font-montserrat flex flex-col items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl items-start">
        {/* Add Holiday Card */}
        <AddHolidaysPage />

        {/* Get Holidays Card */}
        <GetHolidaysPage />

        {/* Time Card */}
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-6 h-6 text-cyan-600" />
            <span className="text-lg font-semibold text-cyan-700">Current Date & Time</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{now.toLocaleDateString()}</div>
          <div className="text-xl text-gray-600 mt-1 font-mono tracking-widest">
            {now.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </main>
  )
}
