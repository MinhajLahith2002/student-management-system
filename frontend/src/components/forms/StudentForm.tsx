"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { studentService } from '@/services/studentService';
import { Student, StudentFormData } from '@/types/student.types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { FiUser, FiMail, FiPhone, FiMapPin, FiBook, FiCalendar, FiUsers } from 'react-icons/fi';

const studentSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  course: z.string().min(2, 'Course is required'),
  age: z.number().min(16, 'Age must be at least 16').max(100, 'Invalid age'),
  gender: z.string().min(1, 'Gender is required'),
  address: z.string().min(5, 'Address is required'),
  registrationDate: z.string().min(1, 'Registration date is required'),
});

interface StudentFormProps {
  initialData?: Student;
  isEditMode?: boolean;
}

export const StudentForm: React.FC<StudentFormProps> = ({ initialData, isEditMode = false }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    mode: 'onChange',
    defaultValues: initialData || {
      fullName: '',
      email: '',
      phoneNumber: '',
      course: '',
      age: 18,
      gender: '',
      address: '',
      registrationDate: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        registrationDate: initialData.registrationDate 
          ? new Date(initialData.registrationDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: StudentFormData) => {
    setIsLoading(true);
    try {
      if (isEditMode && initialData) {
        await studentService.updateStudent(initialData.id, data);
        toast.success('Student updated successfully!');
      } else {
        await studentService.createStudent(data);
        toast.success('Student added successfully!');
      }
      router.push('/students');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred while saving the student.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      
      {/* Personal Details Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border/50 text-slate-800 dark:text-slate-200">
          <FiUser className="text-primary" />
          <h3 className="font-semibold">Personal Details</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Full Name"
              placeholder="e.g. John Doe"
              icon={<FiUser size={18} />}
              {...register('fullName')}
              error={errors.fullName?.message}
            />
          </div>
          <Input
            label="Age"
            type="number"
            placeholder="e.g. 20"
            icon={<FiUser size={18} />}
            {...register('age', { valueAsNumber: true })}
            error={errors.age?.message}
          />
          <div className="w-full flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
              Gender
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <FiUsers size={18} />
              </div>
              <select 
                className={`premium-input pl-10 ${errors.gender ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : ''}`}
                {...register('gender')}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {errors.gender && (
              <span className="text-sm text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">{errors.gender.message}</span>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border/50 text-slate-800 dark:text-slate-200">
          <FiPhone className="text-primary" />
          <h3 className="font-semibold">Contact Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. john@example.com"
            icon={<FiMail size={18} />}
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Phone Number"
            placeholder="e.g. 1234567890"
            icon={<FiPhone size={18} />}
            {...register('phoneNumber')}
            error={errors.phoneNumber?.message}
          />
          <div className="md:col-span-2">
            <Input
              label="Address"
              placeholder="e.g. 123 Main St, City, Country"
              icon={<FiMapPin size={18} />}
              {...register('address')}
              error={errors.address?.message}
            />
          </div>
        </div>
      </div>

      {/* Academic Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border/50 text-slate-800 dark:text-slate-200">
          <FiBook className="text-primary" />
          <h3 className="font-semibold">Academic Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
              Course
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <FiBook size={18} />
              </div>
              <select 
                className={`premium-input pl-10 ${errors.course ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : ''}`}
                {...register('course')}
              >
                <option value="">Select Course</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Data Science">Data Science</option>
                <option value="Business Administration">Business Administration</option>
              </select>
            </div>
            {errors.course && (
              <span className="text-sm text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">{errors.course.message}</span>
            )}
          </div>
          <Input
            label="Registration Date"
            type="date"
            icon={<FiCalendar size={18} />}
            {...register('registrationDate')}
            error={errors.registrationDate?.message}
          />
        </div>
      </div>

      <div className="flex gap-4 justify-end mt-8 border-t border-border pt-6">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={() => router.push('/students')}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading} disabled={!isValid || isLoading}>
          {isEditMode ? 'Save Changes' : 'Add Student'}
        </Button>
      </div>
    </form>
  );
};
