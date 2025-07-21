// File: app/(admin)/attendance/MarkTeacherAttendancePage.tsx
"use client"

import MarkAttendanceCard from "@/app/components/admin/MarkAttendanceCard.tsx"
import ClassMOnthlyAttenadceCard from "@/app/components/admin/MonthkyrepotrtclassAndsectionwise"
import MonthlyAttendanceCard from "@/app/components/admin/MonthlyAttendanceCard"
import ViewAttendanceCard from "@/app/components/admin/ViewAttendanceCard"
import { Layers } from "lucide-react"

export default function MarkTeacherAttendancePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-3 px-1 font-montserrat">
      
       <div className="flex items-center gap-2 mb-6 mt-4 m-3 ">
        <Layers className="w-7 h-7 text-cyan-600 " />
        <h1 className="text-xl font-bold text-cyan-700">Teacher Attendance Management</h1>
      </div>
      <div className="w-full m-3 flex flex-col gap-8">
        <MarkAttendanceCard />
        <ViewAttendanceCard />
        <MonthlyAttendanceCard />
       <ClassMOnthlyAttenadceCard/>
      </div>
    </main>
  )
}
