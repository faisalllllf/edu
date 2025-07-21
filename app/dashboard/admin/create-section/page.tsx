'use client'
import { useState, useEffect } from 'react'

export default function CreateSectionPage() {
  const [sectionName, setSectionName] = useState('')
  const [selectedClassId, setSelectedClassId] = useState('')
  const [classes, setClasses] = useState<any[]>([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/admin/get-classes')
      .then(res => res.json())
      .then(setClasses)
  }, [])

  const createSection = async () => {
    if (!selectedClassId || !sectionName.trim()) {
      setMessage('Please select a class and enter a section name.')
      return
    }

    const res = await fetch('/api/admin/insert-section', {
      method: 'POST',
      body: JSON.stringify({ name: sectionName.trim(), classId: selectedClassId })
    })

    if (!res.ok) {
      const errorText = await res.text()
      setMessage(errorText)
    } else {
      setSectionName('')
      setMessage('Section created successfully.')
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Create Section</h2>
      
      <select
        onChange={e => {
          setSelectedClassId(e.target.value)
          setMessage('')
        }}
        className="border p-2"
      >
        <option value="">Select Class</option>
        {classes.map(cls => (
          <option key={cls.id} value={cls.id}>{cls.name}</option>
        ))}
      </select>

      <input
        value={sectionName}
        onChange={e => {
          setSectionName(e.target.value)
          setMessage('')
        }}
        placeholder="Section Name"
        className="border p-2 ml-2"
      />

      <button
        onClick={createSection}
        className="ml-2 px-4 py-2 bg-green-600 text-white rounded"
      >
        Add Section
      </button>

      {message && <p className="mt-2 text-red-600">{message}</p>}
    </div>
  )
}
