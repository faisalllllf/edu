'use client'
import { useEffect, useState } from 'react'

export default function AddStudentPage() {
  const [assignment, setAssignment] = useState<any>(null)
  const [name, setName] = useState('')
  const [rollNo, setRollNo] = useState('')
  const [dob, setDob] = useState('')
  const [aadhar, setAadhar] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    fetch('/api/teacher/Get-assignedClassSection')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setAssignment(data.assignment)
        }
      })
  }, [])

  const handleSubmit = async () => {
    setSuccessMsg('')
     setErrorMsg('')
    const res = await fetch('/api/teacher/add-student', {
      method: 'POST',
      body: JSON.stringify({ name, rollNo, dob, aadhar })
    })

    const data = await res.json()
    if (data.success) {
      setSuccessMsg('Student added successfully!')
      setName('')
      setRollNo('')
      setDob('')
      setAadhar('')
    } else {
      setErrorMsg(data.message || 'Failed to add student.')
    }
  }

  function clearAllFileds() {
     setSuccessMsg('')
     setErrorMsg('')
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-cyan-900">Add Student</h1>

      {assignment && (
        <p className="mb-4 text-cyan-700">
          Adding student to: <strong className='text-cyan-900'> {assignment.className} class -  {assignment.sectionName} Section</strong>   which is your Assigned class
        </p>
      )}

      <div className="space-y-4">
        <input className="border p-2 w-full" placeholder="Name" value={name} onChange={e => {
         clearAllFileds();
          setName(e.target.value)}} />
        <input className="border p-2 w-full" placeholder="Roll Number" value={rollNo} onChange={e =>{clearAllFileds();
           setRollNo(e.target.value)}} />
        <input type="date" className="border p-2 w-full" value={dob} onChange={e =>{
          clearAllFileds();
          setDob(e.target.value)} 
        }/>
        <input className="border p-2 w-full" placeholder="Aadhar Number" value={aadhar} onChange={e =>{clearAllFileds(); setAadhar(e.target.value)}} />
      <div className='flex justify-center items-center m-2'>
        <button className="bg-cyan-600  px-4 py-2 rounded text-cyan-700" onClick={handleSubmit}>Add Student</button>
        
        {successMsg && <p className="text-green-600 mt-2">{successMsg}</p>}
         {errorMsg && <p className="text-red-600 mt-2">{errorMsg}</p>}
         </div>
      </div>
    </div>
  )
}
