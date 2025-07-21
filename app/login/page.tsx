'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import './login-font.css'


export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleLogin = async (e: any) => {
    e.preventDefault()
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Login failed')
      return
    }
    router.push(`/dashboard/${data.role.toLowerCase()}`)
  }

  return (
        <div className="min-h-screen w-screen flex flex-col md:flex-row w-full  bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden font-montserrat">
        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-cyan-500 text-white p-10 w-1/2">

          <img src="/logo.png" alt="Business Logo" className="h-16 w-16 rounded-full shadow mb-3 border-2 border-cyan-600 bg-white object-cover" />
             
          <h2 className="text-3xl font-bold mb-2 font-montserrat">Welcome to EduSaaS</h2>
          <p className="text-base leading-relaxed text-center font-montserrat">
            A smart platform for schools – manage classes, teachers, subjects, and exams from one place.
          </p>
          <p className="text-xs mt-8 font-montserrat">© 2025 EduSaaS. All rights reserved.</p>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-12 bg-white">
          <h2 className="text-2xl font-bold text-center text-cyan-700 mb-2 font-montserrat">Sign in to your account</h2>
          <p className="text-sm text-center text-gray-500 mb-6 font-montserrat">Enter your credentials to continue</p>

          <form onSubmit={handleLogin} className="space-y-5 w-full max-w-sm mx-auto font-montserrat">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-base"
              required
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-base"
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="accent-cyan-500"
                />
                Remember me
              </label>
              <a href="#" className="text-cyan-600 hover:underline">Forgot password?</a>
            </div>

            {error && <p className="text-red-500 text-sm text-center font-montserrat">{error}</p>}

            <button
              type="submit"
              className="w-full py-2 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition-all font-montserrat"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6 font-montserrat">
            New user? <a href="#" className="text-cyan-600 font-medium hover:underline">Signup</a>
          </p>
        </div>
      </div>
  
  )
}
