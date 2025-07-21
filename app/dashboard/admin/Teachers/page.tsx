// app/dashboard/admin/manage.tsx
'use client'

import AddSubjectPage from "@/app/components/admin/AddSubjects"
import AddTeacherCard from "@/app/components/admin/AddTeacherCard"
import AssignedToTeacher from "@/app/components/admin/AssignedToTeacher"
import AssignSubjectToTeacher from "@/app/components/admin/AssignSubjectToTeacher"
import AssignTeacherToCLassCard from "@/app/components/admin/AssignTeacherToClassCard"
import TeacherSubjectAssignmentsCard from "@/app/components/admin/TeacherSubjectAssignmentsCard"
import { useState } from "react";
import Modal from "@/app/components/Modal";
import ListTeachersCard from "@/app/components/admin/ListTeacher"
import ListSubjectspage from "@/app/components/admin/ListSubjects"
import { Layers } from "lucide-react"



export default function ManagePage() {
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showAddSubject, setShowAddSubject] = useState(false);
  return (

    
    <main className="min-h-screen bg-gray-50 py-3 px-1 font-montserrat">
      <div className="flex items-center gap-2 mb-6 mt-4 m-3 ">
        <Layers className="w-7 h-7 text-cyan-600" />
        <h1 className="text-xl font-bold text-cyan-700">Manage Teachers</h1>
      </div>
      
      
      <div className="w-full  m-3 flex flex-col gap-6">
        {/*
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setShowAddTeacher(true)}
            className="bg-cyan-700 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-cyan-700 transition-all w-auto"
          >
            + Add Teacher
          </button>
          <button
            onClick={() => setShowAddSubject(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition-all"
          >
            + Add Subject
          </button>
        </div>
       */}
        <AddTeacherCard />
         <ListTeachersCard/>
        <AddSubjectPage/>
        <ListSubjectspage />
        <AssignTeacherToCLassCard />
        <AssignSubjectToTeacher />
        <AssignedToTeacher />
        <TeacherSubjectAssignmentsCard />
      </div>
    </main>
  );
}
