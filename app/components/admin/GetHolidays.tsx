'use client'

import { useState, useEffect } from 'react'
import { CalendarDays, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'

export default function GetHolidaysPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [holidays, setHolidays] = useState<any[]>([])

  const fetchHolidays = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/Get-Holidays')
      const data = await res.json()
      setHolidays(data || [])
    } catch {
      setHolidays([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchHolidays()
  }, [])

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full border border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-2 py-2 hover:bg-cyan-100 rounded-md text-cyan-700 font-semibold transition"
      >
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5" />
          List of Holidays
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      <div
        className={`transition-all duration-500 overflow-hidden ${
          isOpen ? 'max-h-[500px] mt-4' : 'max-h-0'
        }`}
      >
        <div className="flex justify-end items-center my-2">
          <button
            onClick={fetchHolidays}
            className="flex items-center space-x-1 text-cyan-700 hover:text-blue-800"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">Refresh</span>
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : holidays.length > 0 ? (
          <ul className="space-y-2">
            {holidays.map((h, index) => (
              <li
                key={index}
                className="p-3 border border-white rounded-md bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between"
              >
                <p className="font-semibold text-gray-800">{h.name}</p>
                <p className="text-sm text-gray-500">{h.date}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-4">No holidays found.</p>
        )}
      </div>
    </div>
  )
}
