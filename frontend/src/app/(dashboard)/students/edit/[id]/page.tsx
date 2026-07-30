"use client";

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { StudentForm } from '@/components/forms/StudentForm';
import { studentService } from '@/services/studentService';
import { Student } from '@/types/student.types';
import { FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function EditStudentPage({ params }: { params: { id: string } }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await studentService.getStudentById(params.id);
        setStudent(data);
      } catch (error) {
        toast.error('Failed to load student details');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [params.id]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/students"
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
        >
          <FiArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Student</h1>
          <p className="text-slate-500">Update the student's registration details.</p>
        </div>
      </div>

      <Card className="p-6 md:p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500">Loading student data...</p>
          </div>
        ) : student ? (
          <StudentForm initialData={student} isEditMode={true} />
        ) : (
          <div className="text-center p-8 text-slate-500">
            Student not found.
          </div>
        )}
      </Card>
    </div>
  );
}
