"use client";

import React, { useState, useMemo } from 'react';
import { Student } from '@/types/student.types';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FiEdit2, FiTrash2, FiEye, FiUsers, FiChevronUp, FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface StudentTableProps {
  students: Student[];
  onDelete: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
  isLoading: boolean;
}

type SortColumn = 'id' | 'name' | 'date';
type SortDirection = 'asc' | 'desc';

export const StudentTable: React.FC<StudentTableProps> = ({ students, onDelete, onBulkDelete, isLoading }) => {
  const router = useRouter();
  
  // Modals state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  // Feature states
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortColumn, setSortColumn] = useState<SortColumn>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sorting logic
  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      let comparison = 0;
      if (sortColumn === 'name') {
        comparison = a.fullName.localeCompare(b.fullName);
      } else if (sortColumn === 'id') {
        comparison = a.studentId.localeCompare(b.studentId);
      } else if (sortColumn === 'date') {
        comparison = new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime();
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [students, sortColumn, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage) || 1;
  // Ensure current page is valid after data changes
  const validCurrentPage = Math.min(currentPage, totalPages);
  
  const paginatedStudents = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    return sortedStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedStudents, validCurrentPage]);

  // Handlers
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to page 1 on sort
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedStudents.length && paginatedStudents.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedStudents.map(s => s.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(deleteId);
        return next;
      });
    }
  };

  const handleBulkDeleteConfirm = () => {
    if (onBulkDelete && selectedIds.size > 0) {
      onBulkDelete(Array.from(selectedIds));
      setSelectedIds(new Set());
      setShowBulkDeleteModal(false);
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

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) return <FiChevronDown className="opacity-0 group-hover:opacity-40 transition-opacity" />;
    return sortDirection === 'asc' ? <FiChevronUp className="text-primary" /> : <FiChevronDown className="text-primary" />;
  };

  return (
    <>
      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-primary/5 border-b border-primary/10 px-6 py-3 flex items-center justify-between animate-in slide-in-from-top-2">
          <span className="text-sm font-medium text-primary">
            {selectedIds.size} student{selectedIds.size > 1 ? 's' : ''} selected
          </span>
          <Button variant="danger" onClick={() => setShowBulkDeleteModal(true)} className="py-1.5 px-3 text-xs">
            <FiTrash2 className="mr-1.5" /> Delete Selected
          </Button>
        </div>
      )}

      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/50 text-xs uppercase tracking-wider text-slate-500 font-semibold bg-slate-50/50 dark:bg-slate-800/20 select-none">
              <th className="px-6 py-4 w-12">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                  checked={paginatedStudents.length > 0 && selectedIds.size === paginatedStudents.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th 
                className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center gap-2">ID <SortIcon column="id" /></div>
              </th>
              <th 
                className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">Student Info <SortIcon column="name" /></div>
              </th>
              <th 
                className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden md:table-cell group"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-2">Course & Date <SortIcon column="date" /></div>
              </th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {paginatedStudents.map((student) => {
              const isSelected = selectedIds.has(student.id);
              return (
                <tr 
                  key={student.id} 
                  className={`transition-colors group ${isSelected ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}
                >
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                      checked={isSelected}
                      onChange={() => toggleSelect(student.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {student.studentId}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center text-primary font-bold shadow-sm shrink-0">
                        {student.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{student.fullName}</span>
                        <span className="text-sm text-slate-500">{student.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex flex-col items-start gap-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                        {student.course}
                      </span>
                      <span className="text-xs text-slate-400 mt-1">
                        Registered: {new Date(student.registrationDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100 sm:opacity-100">
                      <button 
                        onClick={() => setViewStudent(student)}
                        className="p-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 text-slate-400 transition-colors"
                        title="View Details"
                      >
                        <FiEye size={18} />
                      </button>
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
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/10 rounded-b-2xl">
          <span className="text-sm text-slate-500">
            Showing <span className="font-medium text-slate-900 dark:text-white">{((validCurrentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-medium text-slate-900 dark:text-white">{Math.min(validCurrentPage * itemsPerPage, sortedStudents.length)}</span> of <span className="font-medium text-slate-900 dark:text-white">{sortedStudents.length}</span> results
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={validCurrentPage === 1}
              className="p-2 rounded-lg border border-border bg-white dark:bg-slate-900 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              <FiChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium px-2">Page {validCurrentPage} of {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={validCurrentPage === totalPages}
              className="p-2 rounded-lg border border-border bg-white dark:bg-slate-900 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Single Delete Modal */}
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

      {/* Bulk Delete Modal */}
      <Modal 
        isOpen={showBulkDeleteModal} 
        onClose={() => setShowBulkDeleteModal(false)} 
        title="Confirm Bulk Deletion"
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
              <FiTrash2 className="text-red-600 dark:text-red-400" size={24} />
            </div>
            <div>
              <p className="text-slate-700 dark:text-slate-300">
                Are you sure you want to delete <strong>{selectedIds.size}</strong> selected students? This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={() => setShowBulkDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleBulkDeleteConfirm}>Delete All</Button>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={!!viewStudent}
        onClose={() => setViewStudent(null)}
        title="Student Details"
      >
        {viewStudent && (
          <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Student ID</span>
                <span className="font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded inline-block">{viewStudent.studentId}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Registration Date</span>
                <span>{new Date(viewStudent.registrationDate).toLocaleDateString()}</span>
              </div>
              
              <div className="col-span-2 pt-2">
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Full Name</span>
                <span className="text-base font-medium">{viewStudent.fullName}</span>
              </div>
              
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email Address</span>
                <span>{viewStudent.email}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Phone Number</span>
                <span>{viewStudent.phoneNumber}</span>
              </div>
              
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Course</span>
                <span>{viewStudent.course}</span>
              </div>
              <div className="flex gap-8">
                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Age</span>
                  <span>{viewStudent.age}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Gender</span>
                  <span className="capitalize">{viewStudent.gender}</span>
                </div>
              </div>

              <div className="col-span-2 pt-2">
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Address</span>
                <span className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg block border border-border/50">{viewStudent.address}</span>
              </div>
            </div>
            <div className="flex justify-end pt-4 mt-2">
              <Button onClick={() => setViewStudent(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};


