'use client'
import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Edit3, Layers } from 'lucide-react'

import ViewSubjectWiseMarksPage from '@/app/components/Teacher/MySubjectsStudentsMarks'
import ViewclassStudentMarkspage from '@/app/components/Teacher/ViewclassStudentMarkss'
import AddMarksPage from '../add-marks/page'
import AddMarksSubjectPage from '@/app/components/Teacher/AddMarksMYsubject'

export default function marksStudents() {
 

  return (


  <main className="min-h-screen bg-gray-50 py-3 px-1 font-montserrat">
      <div className="flex items-center gap-2 mb-6 mt-4 m-3 ">
        <Layers className="w-7 h-7 text-cyan-600 " />
        <h1 className="text-xl font-bold text-cyan-700">Manage Marks</h1>
      </div>
       <div className="w-full  m-3 flex flex-col gap-6">


 <AddMarksSubjectPage/>

      

<ViewSubjectWiseMarksPage/>
<ViewclassStudentMarkspage/>
       
     </div>
    </main>

  )
}

