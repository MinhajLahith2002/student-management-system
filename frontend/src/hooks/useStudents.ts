"use client";

import { useState, useEffect, useCallback } from 'react';
import { studentService } from '@/services/studentService';
import { Student } from '@/types/student.types';
import { toast } from 'react-toastify';

export const useStudents = (initialFetch = true) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentService.getAllStudents();
      setStudents(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch students');
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchStudents = async (query: string) => {
    setLoading(true);
    try {
      if (!query.trim()) {
        await fetchStudents();
        return;
      }
      const data = await studentService.searchStudents(query);
      setStudents(data);
    } catch (err: any) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      await studentService.deleteStudent(id);
      setStudents(students.filter((s) => s.id !== id));
      toast.success('Student deleted successfully');
    } catch (err: any) {
      toast.error('Failed to delete student');
    }
  };

  const bulkDeleteStudents = async (ids: string[]) => {
    try {
      // Execute all deletions concurrently
      await Promise.all(ids.map(id => studentService.deleteStudent(id)));
      // Filter out all deleted ids
      setStudents(students.filter(s => !ids.includes(s.id)));
      toast.success(`${ids.length} students deleted successfully`);
    } catch (err: any) {
      toast.error('Failed to delete some students');
    }
  };

  useEffect(() => {
    if (initialFetch) {
      fetchStudents();
    }
  }, [fetchStudents, initialFetch]);

  return { students, loading, error, fetchStudents, searchStudents, deleteStudent, bulkDeleteStudents };
};
