"use client";

import React from 'react';
import { Card } from '@/components/ui/Card';
import { StudentForm } from '@/components/forms/StudentForm';
import { FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

export default function AddStudentPage() {
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add New Student</h1>
          <p className="text-slate-500">Fill in the details to register a new student.</p>
        </div>
      </div>

      <Card className="p-6 md:p-8">
        <StudentForm />
      </Card>
    </div>
  );
}
