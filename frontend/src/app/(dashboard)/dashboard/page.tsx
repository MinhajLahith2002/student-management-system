"use client";

import React from 'react';
import { Card } from '@/components/ui/Card';
import { useStudents } from '@/hooks/useStudents';
import { FiUsers, FiTrendingUp, FiActivity, FiUserPlus } from 'react-icons/fi';
import Link from 'next/link';

export default function DashboardPage() {
  const { students, loading } = useStudents();

  // Calculate some dummy stats for visual appeal
  const totalStudents = students.length;
  const recentRegistrations = students.filter(
    (s) => new Date(s.registrationDate).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500">Welcome back, Admin. Here's what's happening today.</p>
        </div>
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Students */}
        <Card className="p-6 flex flex-col justify-center gap-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
              <FiUsers size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Students</p>
              <h3 className="text-4xl font-bold text-slate-900 dark:text-white">
                {loading ? '-' : totalStudents}
              </h3>
            </div>
          </div>
        </Card>
        
        {/* Quick Navigation */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <Link href="/students/add" className="block h-full">
            <Card className="h-full p-6 flex flex-col items-center justify-center text-center gap-3 hover:-translate-y-1 transition-transform duration-300 hover:border-primary/50 cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                <FiUserPlus size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">Add Student</h4>
                <p className="text-xs text-slate-500 mt-1">Register a new student</p>
              </div>
            </Card>
          </Link>
          
          <Link href="/students" className="block h-full">
            <Card className="h-full p-6 flex flex-col items-center justify-center text-center gap-3 hover:-translate-y-1 transition-transform duration-300 hover:border-primary/50 cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                <FiUsers size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">View Directory</h4>
                <p className="text-xs text-slate-500 mt-1">Browse and manage all</p>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Students Section */}
      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-bold">Recent Registrations</h2>
          <Link href="/students" className="text-sm text-primary font-medium hover:underline">
            View All
          </Link>
        </div>
        <div className="p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading...</div>
          ) : students.length > 0 ? (
            <div className="divide-y divide-border/50">
              {[...students]
                .sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
                .slice(0, 5)
                .map((student) => (
                <div key={student.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-semibold">
                      {student.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{student.fullName}</p>
                      <p className="text-xs text-slate-500">{student.studentId} • {student.course}</p>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500 hidden sm:block">
                    {new Date(student.registrationDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">No students registered yet.</div>
          )}
        </div>
      </Card>
    </div>
  );
}
