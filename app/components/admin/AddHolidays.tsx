'use client'

import { useState } from 'react'
import { Plus, ChevronUp, ChevronDown } from 'lucide-react'

export default function AddHolidaysPage() {
  const [newName, setNewName] = useState('')
  const [newDate, setNewDate] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const addHoliday = async () => {
    setStatus('')
    if (!newName || !newDate) {
      setStatus('Name and date required')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/post-holidays', {
        method: 'POST',
        body: JSON.stringify({ name: newName, date: newDate })
      })

      const data = await res.json()
      if (data.success) {
        setNewName('')
        setNewDate('')
        setStatus('✅ Holiday added')
        setTimeout(() => setStatus(''), 2000)
      } else {
        setStatus('❌ Failed to add holiday')
      }
    } catch {
      setStatus('❌ Failed to add holiday')
    }

    setLoading(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full border border-gray-200 " >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-2 py-2 hover:bg-cyan-100 rounded-md text-cyan-700 font-semibold transition"
      >
        <div className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New Holiday
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      <div
        className={`transition-all duration-500 overflow-hidden ${
          isOpen ? 'max-h-[500px] mt-4' : 'max-h-0'
        }`}
      >
        <input
          type="text"
          placeholder="Holiday Name"
          value={newName}
          onChange={(e) => {
            setStatus('')
            setNewName(e.target.value)
          }}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
        />
        <input
          type="date"
          value={newDate}
          onChange={(e) => {
            setStatus('')
            setNewDate(e.target.value)
          }}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
        />

        <button
          onClick={addHoliday}
          className="w-full bg-cyan-600 hover:bg-cyan-900 text-cyan-800 py-2 rounded font-semibold transition"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Holiday'}
        </button>

        {status && (
          <p className={`mt-3 text-sm ${status.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {status}
          </p>
        )}
      </div>
    </div>
  )
}
