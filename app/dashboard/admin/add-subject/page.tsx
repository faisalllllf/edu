'use client'
import { useState } from 'react'

export default function AddSubjectPage() {
  const [subjectName, setSubjectName] = useState('')
  const [status, setStatus] = useState('')
const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/add-subject', {
      method: 'POST',
      body: JSON.stringify({ name: subjectName })
    })

    
    const data = await res.json()
    if (data.success) {
      setStatus('✅ Subject added successfully')
      setSubjectName('')
      setLoading(false);
    } else {
      setStatus(`❌ ${data.message || 'Error adding subject'}`)
      setLoading(false);
    }

  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Add New Subject</h2>

      <input
        type="text"
        value={subjectName}
        onChange={e =>{
             setSubjectName(e.target.value)
             setStatus("");            }}
        placeholder="Enter subject name"
        className="border px-4 py-2 w-64"
      />

      <button onClick={handleSubmit} className="ml-2 px-4 py-2 bg-green-600 text-white rounded">
         {loading ? <span className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full">Adding.....</span>: 'Add Subject'}
      </button>

      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  )
}
