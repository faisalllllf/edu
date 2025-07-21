'use client'
import { useState } from 'react'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'STUDENT' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(form),
    })

    if (res.ok) {
      setMessage('Registered successfully!')
    } else {
      const err = await res.json()
      setMessage(`Error: ${err.error || 'Registration failed'}`)
    }

    setLoading(false)
  }

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Name" className="border p-2 w-full" onChange={handleChange} required />
        <input name="email" placeholder="Email" className="border p-2 w-full" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="border p-2 w-full" onChange={handleChange} required />
        <select name="role" className="border p-2 w-full" onChange={handleChange}>
          <option value="STUDENT">Student</option>
          <option value="TEACHER">Teacher</option>
          <option value="PARENT">Parent</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </main>
  )
}
