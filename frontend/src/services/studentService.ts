import axiosInstance from '@/lib/axios';
import { Student, StudentFormData } from '@/types/student.types';

export const studentService = {
  getAllStudents: async (): Promise<Student[]> => {
    const response = await axiosInstance.get<Student[]>('/students');
    return response.data;
  },

  getStudentById: async (id: string): Promise<Student> => {
    const response = await axiosInstance.get<Student>(`/students/${id}`);
    return response.data;
  },

  createStudent: async (student: StudentFormData): Promise<Student> => {
    const response = await axiosInstance.post<Student>('/students', student);
    return response.data;
  },

  updateStudent: async (id: string, student: StudentFormData): Promise<Student> => {
    const response = await axiosInstance.put<Student>(`/students/${id}`, student);
    return response.data;
  },

  deleteStudent: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/students/${id}`);
  },

  searchStudents: async (query: string): Promise<Student[]> => {
    const response = await axiosInstance.get<Student[]>(`/students/search?query=${query}`);
    return response.data;
  },
};
