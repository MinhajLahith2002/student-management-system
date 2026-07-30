"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { StudentTable } from '@/components/tables/StudentTable';
import { useStudents } from '@/hooks/useStudents';
import { FiSearch, FiFilter, FiDownload, FiPlus } from 'react-icons/fi';
import Link from 'next/link';

export default function StudentsPage() {
  const { students, loading, searchStudents, deleteStudent } = useStudents();
  const [searchTerm, setSearchTerm] = useState('');

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchStudents(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Student Directory</h1>
          <p className="text-slate-500">Manage all students in the system.</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium">
            <FiDownload />
            Export
          </button>
          
          <Link 
            href="/students/add" 
            className="flex-1 sm:flex-none premium-btn premium-btn-primary px-4 py-2 flex items-center justify-center gap-2"
          >
            <FiPlus />
            Add Student
          </Link>
        </div>
      </div>

      <Card className="p-0 overflow-visible">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-800/10">
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, ID, or course..."
              className="premium-input pl-10 bg-white dark:bg-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <FiFilter />
              Filter
            </button>
          </div>
        </div>

        <StudentTable 
          students={students} 
          isLoading={loading && students.length === 0} 
          onDelete={deleteStudent}
        />
      </Card>
    </div>
  );
}
