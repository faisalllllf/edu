'use client'
import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Edit3, Layers } from 'lucide-react'
import MarkAttendanceTeachercard from '@/app/components/Teacher/markAttendance'
import ViewAttendanceCardTecaher from '@/app/components/Teacher/viewAttendanceTecaher'

export default function attendancepage() {
 

  return (


  <main className="min-h-screen bg-gray-50 py-3 px-1 font-montserrat">
      <div className="flex items-center gap-2 mb-6 mt-4 m-3 ">
        <Layers className="w-7 h-7 text-cyan-600 " />
        <h1 className="text-xl font-bold text-cyan-700">Manage Attendance</h1>
      </div>
       <div className="w-full  m-3 flex flex-col gap-6">
<MarkAttendanceTeachercard />
       <ViewAttendanceCardTecaher />
     </div>
    </main>

  )
}

