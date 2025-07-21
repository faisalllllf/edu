'use client'
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

export default function TeacherSubjectAssignmentsCard() {
  const [data, setData] = useState<any[]>([]);
  console.log("TeacherSubjectAssignmentsCard rendered", data);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/teacher-subject-assignments");
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to load");
      }
      const json = await res.json();
      console.log("Fetched data:", json);
      setData(json.assignments);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="bg-white p-3 rounded-lg shadow-md">
     

      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3  hover:bg-cyan-100 rounded-md text-cyan-700 font-semibold transition"
      >
         <h2 className="text-sm font-bold text-cyan-700 mb-2">Teacher with Subject Assignments</h2>
        <span className="transition-transform duration-300">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </span>
      </button>

      {/* Accordion Body */}
      <div
        className={`overflow-hidden transition-all duration-500 ${
          isOpen ? 'max-h-[1000px] mt-4' : 'max-h-0'
        }`}
      >
        

         <div className='flex justify-end items-center m-1'>
        <button
            onClick={load}
            className="flex items-center space-x-1 text-cyan-700 hover:text-blue-800"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">Refresh</span> {/* optional label */}
          </button>

          </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}


        <div className="overflow-x-auto">
          <table className="w-full text-sm table-auto border border-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className=" px-4 py-2">Teacher</th>
                <th className=" px-4 py-2">Class</th>
                <th className=" px-4 py-2">Section</th>
                <th className=" px-4 py-2">Subject</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="text-center bg-gray-50 hover:bg-cyan-100 transition-colors">
                  <td className=" px-4 py-2">{row.teacher_name}</td>
                  <td className=" px-4 py-2">{row.class_name}</td>
                  <td className=" px-4 py-2">{row.section_name}</td>
                  <td className=" px-4 py-2">{row.subject_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
