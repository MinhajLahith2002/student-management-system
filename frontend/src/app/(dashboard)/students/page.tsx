"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { StudentTable } from '@/components/tables/StudentTable';
import { useStudents } from '@/hooks/useStudents';
import { FiSearch, FiFilter, FiDownload, FiPlus, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

export default function StudentsPage() {
  const { students, loading, deleteStudent } = useStudents();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Client-side filtering
  const filteredStudents = students.filter(student => {
    const matchesSearch = searchTerm === '' || 
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCourse = selectedCourse === '' || student.course === selectedCourse;
    
    return matchesSearch && matchesCourse;
  });

  // Extract unique courses for the filter dropdown
  const uniqueCourses = Array.from(new Set(students.map(s => s.course))).filter(Boolean);

  const handleExport = () => {
    if (filteredStudents.length === 0) {
      import('react-toastify').then(({ toast }) => toast.info('No students to export'));
      return;
    }

    const headers = ['Student ID', 'Full Name', 'Email', 'Phone Number', 'Course', 'Age', 'Gender', 'Address', 'Registration Date'];
    const csvContent = [
      headers.join(','),
      ...filteredStudents.map(s => [
        s.studentId,
        `"${s.fullName}"`,
        s.email,
        s.phoneNumber,
        `"${s.course}"`,
        s.age,
        s.gender,
        `"${s.address.replace(/"/g, '""')}"`,
        new Date(s.registrationDate).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `students_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 mb-2 transition-colors">
            <FiArrowLeft /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Student Directory</h1>
          <p className="text-slate-500">Manage all students in the system.</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
          >
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
        <div className="p-4 border-b border-border flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-800/10 rounded-t-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, ID, email or course..."
                className="premium-input pl-10 bg-white dark:bg-slate-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${showFilters ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <FiFilter />
                Filter
              </button>
            </div>
          </div>

          {/* Expandable Filter Panel */}
          {showFilters && (
            <div className="pt-4 border-t border-border animate-in slide-in-from-top-2 flex gap-4">
              <div className="w-full max-w-xs">
                <label className="block text-xs font-medium text-slate-500 mb-1">Filter by Course</label>
                <select 
                  className="premium-input bg-white dark:bg-slate-900"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <option value="">All Courses</option>
                  {uniqueCourses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        <StudentTable 
          students={filteredStudents} 
          isLoading={loading && students.length === 0} 
          onDelete={deleteStudent}
        />
      </Card>
    </div>
  );
}
