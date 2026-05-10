'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  AcademicCapIcon,
  HomeIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CheckBadgeIcon,
  CreditCardIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  BellIcon,
  ArrowUpIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  CubeIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

export default function ReviewerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage");
      }
    }
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: HomeIcon },
    { name: 'Verify Company', icon: BuildingOfficeIcon },
    { name: 'Verify Users', icon: UserGroupIcon },
    { name: 'Work Verifications', icon: CheckBadgeIcon },
    { name: 'Payments', icon: CreditCardIcon },
    { name: 'Review Reports', icon: DocumentTextIcon },
  ];

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-slate-800 shadow-xl z-50">
        <div className="flex items-center justify-center h-16 bg-blue-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <AcademicCapIcon className="h-6 w-6 text-blue-800" />
            </div>
            <span className="text-white text-xl font-bold">SkillSeed</span>
          </div>
        </div>
        
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors group ${
                  activeTab === item.name
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className={`h-5 w-5 mr-3 ${activeTab === item.name ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'}`} />
                {item.name}
              </button>
            ))}
          </div>
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <img src="https://cdn-icons-png.flaticon.com/512/17003/17003310.png" alt="Admin" className="w-10 h-10 rounded-full" />
              <div className="overflow-hidden">
                <p className="text-white text-sm font-medium truncate">{user ? user.fullName || user.email : 'Loading...'}</p>
                <p className="text-gray-400 text-xs">Reviewer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{activeTab}</h1>
                <p className="text-gray-600 text-sm mt-1">Welcome back, here's what's happening today</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <BellIcon className="h-6 w-6" />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="p-6">
          {activeTab === 'Dashboard' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center mt-8">
              <h2 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h2>
              <p className="text-gray-500 mt-2">Dashboard widgets and data will appear here.</p>
            </div>
          )}

          {activeTab !== 'Dashboard' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center mt-8">
              <h2 className="text-2xl font-semibold text-gray-900">{activeTab}</h2>
              <p className="text-gray-500 mt-2">This module is currently under construction and will be available soon.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
