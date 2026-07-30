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

const studentSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  course: z.string().min(2, 'Course is required'),
  age: z.coerce.number().min(16, 'Age must be at least 16').max(100, 'Invalid age'),
  gender: z.string().min(1, 'Gender is required'),
  address: z.string().min(5, 'Address is required'),
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
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: initialData || {
      fullName: '',
      email: '',
      phoneNumber: '',
      course: '',
      age: 18,
      gender: '',
      address: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          placeholder="e.g. John Doe"
          {...register('fullName')}
          error={errors.fullName?.message}
        />
        
        <Input
          label="Email Address"
          type="email"
          placeholder="e.g. john@example.com"
          {...register('email')}
          error={errors.email?.message}
        />
        
        <Input
          label="Phone Number"
          placeholder="e.g. 1234567890"
          {...register('phoneNumber')}
          error={errors.phoneNumber?.message}
        />
        
        <Input
          label="Course"
          placeholder="e.g. Computer Science"
          {...register('course')}
          error={errors.course?.message}
        />
        
        <Input
          label="Age"
          type="number"
          placeholder="e.g. 20"
          {...register('age')}
          error={errors.age?.message}
        />
        
        <div className="w-full flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
            Gender
          </label>
          <select 
            className={`premium-input ${errors.gender ? 'border-red-500' : ''}`}
            {...register('gender')}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <span className="text-sm text-red-500 ml-1">{errors.gender.message}</span>
          )}
        </div>
        
        <div className="md:col-span-2">
          <Input
            label="Address"
            placeholder="e.g. 123 Main St, City"
            {...register('address')}
            error={errors.address?.message}
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
        <Button type="submit" isLoading={isLoading}>
          {isEditMode ? 'Save Changes' : 'Add Student'}
        </Button>
      </div>
    </form>
  );
};
