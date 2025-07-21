'use client'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function AssignSubjectPage() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [sections, setSections] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
 const [error, setError] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState('')
  const [selectedSectionId, setSelectedSectionId] = useState('')
  const [selectedTeacherId, setSelectedTeacherId] = useState('')
  const [selectedSubjectId, setSelectedSubjectId] = useState('')
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    fetch('/api/admin/get-teacher').then(res => res.json()).then(setTeachers)
    fetch('/api/admin/get-classes').then(res => res.json()).then(setClasses)
   //  fetch('/api/admin/get-subjects').then(res => res.json()).then(setSubjects)
  }, [])




  useEffect(() => {
    if (selectedClassId) {
      fetch(`/api/admin/get-sections?classId=${selectedClassId}`)
        .then(res => res.json())
        .then(setSections)
    }
  }, [selectedClassId])

/*
  useEffect(() => {
    if (selectedClassId && selectedSectionId) {
      fetch(
        `/api/teacher/assigned-subjects-to-classget?classId=${selectedClassId}&sectionId=${selectedSectionId}`,
      ).then(res => res.json())
        .then(setSubjects)
    } else {
      setSubjects([])
    }
  }, [selectedClassId, selectedSectionId])
*/

  useEffect(() => {
  if (selectedClassId && selectedSectionId) {
    fetch(`/api/teacher/assigned-subjects-to-classget?classId=${selectedClassId}&sectionId=${selectedSectionId}`)
      .then(res => res.json())
      .then(subjectData => {
        console.log('Subject Data:', subjectData);
        if (subjectData.error) {
          setSubjects([]);
        } else if (Array.isArray(subjectData.subjects)) {
          console.log('Subjects:', subjectData.subjects.map((s: any) => s.name)); 
          setSubjects(subjectData.subjects); // or .map(s => s.name) if you want only names
        } else {
          setSubjects([]);
          setError('some error occurred');
        }
      })
      .catch(() => setSubjects([]));
  } else {
    setSubjects([]);
  }
}, [selectedClassId, selectedSectionId]);


console.log('Subjects:', subjects);
  const assignSubject = async () => {
    const res = await fetch('/api/admin/assign-subject', {
      method: 'POST',
      body: JSON.stringify({
        teacherId: selectedTeacherId,
        subjectId: selectedSubjectId,
        classId: selectedClassId,
        sectionId: selectedSectionId
      })
    })


    const data = await res.json()
    if (!res.ok) {

    }
    alert(data.message)
    
    setSelectedTeacherId('')
    setSelectedSectionId('')
    setSelectedSubjectId('')
    setSelectedClassId('')
  }
  return (
    <div className="bg-white p-3 rounded-lg shadow-md">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3  hover:bg-cyan-200 rounded-md text-cyan-700 font-semibold transition"
      >
        <h2 className="text-sm font-bold text-cyan-700 mb-2">Assign Subject to Teacher</h2>
        <span className="transition-transform duration-300">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </span>
      </button>
      {/* Accordion Body */}
      <div
        className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-[1000px] mt-4' : 'max-h-0'
          }`}
      >
        <select value={selectedTeacherId} onChange={e => setSelectedTeacherId(e.target.value)} className="w-full border p-2 mb-2 rounded">
          <option value="">Select Teacher</option>
          {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>

        <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)} className="w-full border p-2 mb-2 rounded">
          <option value="">Select Class</option>
          {classes.map(cls => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
        </select>

        <select value={selectedSectionId} onChange={e => setSelectedSectionId(e.target.value)} className="w-full border p-2 mb-2 rounded">
          <option value="">Select Section</option>
          {sections.map(sec => <option key={sec.id} value={sec.id}>{sec.name}</option>)}
        </select>

        <select value={selectedSubjectId} onChange={e => setSelectedSubjectId(e.target.value)} className="w-full border p-2 mb-2 rounded">
          <option value="">Select Subject</option>
          {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
        </select>

        <div className='flex justify-center items-center'>
          <button onClick={assignSubject} className="bg-cyan-700 text-white px-4 py-2 rounded">Assign</button>
        </div>
      </div>
    </div>
  )
}
