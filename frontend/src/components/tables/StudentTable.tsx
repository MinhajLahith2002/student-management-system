"use client";

import React, { useState } from 'react';
import { Student } from '@/types/student.types';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FiEdit2, FiTrash2, FiEye, FiUsers } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface StudentTableProps {
  students: Student[];
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export const StudentTable: React.FC<StudentTableProps> = ({ students, onDelete, isLoading }) => {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Loading students data...</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="w-full p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <FiUsers className="text-slate-400" size={24} />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-1">No Students Found</h3>
        <p className="text-slate-500 max-w-sm mb-6">There are currently no students matching your criteria or the database is empty.</p>
        <Button onClick={() => router.push('/students/add')}>Add New Student</Button>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/50 text-xs uppercase tracking-wider text-slate-500 font-semibold bg-slate-50/50 dark:bg-slate-800/20">
              <th className="px-6 py-4 rounded-tl-xl">ID</th>
              <th className="px-6 py-4">Student Info</th>
              <th className="px-6 py-4 hidden md:table-cell">Course & Date</th>
              <th className="px-6 py-4 text-right rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {students.map((student) => (
              <tr 
                key={student.id} 
                className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
              >
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                    {student.studentId}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900 dark:text-slate-100">{student.fullName}</span>
                    <span className="text-sm text-slate-500">{student.email} • {student.phoneNumber}</span>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{student.course}</span>
                    <span className="text-xs text-slate-400">
                      Added {new Date(student.registrationDate).toLocaleDateString()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => router.push(`/students/edit/${student.id}`)}
                      className="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 text-slate-400 transition-colors"
                      title="Edit"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button 
                      onClick={() => setDeleteId(student.id)}
                      className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 text-slate-400 transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        title="Confirm Deletion"
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
              <FiTrash2 className="text-red-600 dark:text-red-400" size={24} />
            </div>
            <div>
              <p className="text-slate-700 dark:text-slate-300">
                Are you sure you want to delete this student record? This action cannot be undone and all associated data will be permanently removed.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>Delete Student</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};


