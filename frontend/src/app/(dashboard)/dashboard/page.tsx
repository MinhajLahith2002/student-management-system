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
        
        <Link 
          href="/students/add" 
          className="premium-btn premium-btn-primary px-4 py-2 flex items-center gap-2"
        >
          <FiUserPlus />
          Add Student
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
          <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <FiUsers size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Students</p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
              {loading ? '-' : totalStudents}
            </h3>
          </div>
        </Card>
        
        <Card className="p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
          <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
            <FiTrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">New Registrations</p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
              {loading ? '-' : recentRegistrations}
            </h3>
          </div>
        </Card>
        
        <Card className="p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
          <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <FiActivity size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Active Courses</p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">12</h3>
          </div>
        </Card>
        
        <Card className="p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300 bg-gradient-to-br from-primary to-secondary text-white border-0">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <FiActivity size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-white/80">System Health</p>
            <h3 className="text-3xl font-bold">100%</h3>
          </div>
        </Card>
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
              {students.slice(0, 5).map((student) => (
                <div key={student.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-semibold">
                      {student.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{student.fullName}</p>
                      <p className="text-xs text-slate-500">{student.course}</p>
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
