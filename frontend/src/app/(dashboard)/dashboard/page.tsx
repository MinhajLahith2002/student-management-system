"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { useStudents } from '@/hooks/useStudents';
import { FiUsers, FiUserPlus, FiBook, FiPieChart, FiSearch, FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function DashboardPage() {
  const { students, loading } = useStudents();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Dynamic Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const todayDate = new Date().toLocaleDateString('en-US', dateOptions);

  // 2. Statistics Calculations
  const totalStudents = students.length;
  
  const uniqueCourses = new Set(students.map(s => s.course)).size;
  
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const newEnrollments = students.filter(s => new Date(s.registrationDate).getTime() > thirtyDaysAgo).length;

  const maleCount = students.filter(s => s.gender.toLowerCase() === 'male').length;
  const femaleCount = students.filter(s => s.gender.toLowerCase() === 'female').length;
  const maleRatio = totalStudents > 0 ? Math.round((maleCount / totalStudents) * 100) : 0;
  const femaleRatio = totalStudents > 0 ? Math.round((femaleCount / totalStudents) * 100) : 0;

  // 3. Chart Data Preparation
  // Course Distribution
  const courseCounts = students.reduce((acc, student) => {
    acc[student.course] = (acc[student.course] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const pieData = Object.keys(courseCounts).map(course => ({
    name: course,
    value: courseCounts[course]
  }));
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Registration Trends (last 6 months)
  const monthCounts = students.reduce((acc, student) => {
    const month = new Date(student.registrationDate).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const barData = Object.keys(monthCounts).map(month => ({
    name: month,
    students: monthCounts[month]
  }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/students?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      
      {/* Header & Quick Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-border/50 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{greeting}, Admin!</h1>
          <p className="text-slate-500 mt-1">Today is {todayDate}. Here is what's happening.</p>
        </div>
        
        <form onSubmit={handleSearch} className="w-full lg:w-96 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Quick Search (ID, Name, Course)..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/50 transition-all shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/students/add" className="block">
          <Card className="p-5 flex items-center gap-4 hover:border-primary/50 transition-all cursor-pointer group hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
              <FiUserPlus size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">Add New Student</h4>
              <p className="text-xs text-slate-500 mt-0.5">Register a new enrollment</p>
            </div>
          </Card>
        </Link>
        
        <Link href="/students" className="block">
          <Card className="p-5 flex items-center gap-4 hover:border-primary/50 transition-all cursor-pointer group hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
              <FiUsers size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">View Directory</h4>
              <p className="text-xs text-slate-500 mt-0.5">Browse all student records</p>
            </div>
          </Card>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center gap-4 hover:border-primary/30 transition-colors">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center shrink-0">
            <FiUsers size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Students</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{loading ? '-' : totalStudents}</h3>
          </div>
        </Card>
        
        <Card className="p-5 flex items-center gap-4 hover:border-emerald-500/30 transition-colors">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <FiBook size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Courses</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{loading ? '-' : uniqueCourses}</h3>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 hover:border-amber-500/30 transition-colors">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 flex items-center justify-center shrink-0">
            <FiUserPlus size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">New Enrollments</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{loading ? '-' : newEnrollments}</h3>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 hover:border-purple-500/30 transition-colors">
          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 flex items-center justify-center shrink-0">
            <FiPieChart size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Gender Ratio</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
              {loading ? '-' : <><span className="text-blue-500">{maleRatio}%</span> / <span className="text-pink-500">{femaleRatio}%</span></>}
            </h3>
          </div>
        </Card>
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 flex flex-col min-h-[350px]">
          <h3 className="text-base font-bold mb-6 text-slate-800 dark:text-slate-200">Course Distribution</h3>
          {loading ? (
             <div className="flex-1 flex items-center justify-center text-slate-400">Loading chart...</div>
          ) : students.length === 0 ? (
             <div className="flex-1 flex items-center justify-center text-slate-400">No data available</div>
          ) : (
            <div className="flex-1 flex flex-col w-full min-h-[250px]">
              <div className="flex-1 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-6 shrink-0">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    {entry.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6 flex flex-col min-h-[350px]">
          <h3 className="text-base font-bold mb-6 text-slate-800 dark:text-slate-200">Enrollment Trends</h3>
          {loading ? (
             <div className="flex-1 flex items-center justify-center text-slate-400">Loading chart...</div>
          ) : students.length === 0 ? (
             <div className="flex-1 flex items-center justify-center text-slate-400">No data available</div>
          ) : (
            <div className="flex-1 w-full h-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} allowDecimals={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      {/* Enhanced Recent Activity Row */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-0 overflow-hidden">
          <div className="p-5 border-b border-border flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/10">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Recent Registrations</h2>
            <Link href="/students" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
              View All <FiChevronRight />
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
                  <div key={student.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center text-primary font-bold shadow-sm group-hover:scale-105 transition-transform">
                        {student.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{student.fullName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{student.studentId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div className="hidden sm:block">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                          {student.course}
                        </span>
                      </div>
                      <div className="text-sm text-slate-500">
                        {new Date(student.registrationDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
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
    </div>
  );
}
