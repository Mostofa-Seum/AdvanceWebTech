'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
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
            <DashboardProfile sessionUser={user} />
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

function DashboardProfile({ sessionUser }: { sessionUser: any }) {
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionUser?.reviewer?.reviewerId) {
        setLoading(false);
        return;
    }

    // Fetch profile
    axios.get(`http://localhost:3000/reviewer/profile/${sessionUser.reviewer.reviewerId}`)
      .then(res => {
        setProfile(res.data);
        setFormData({
          name: res.data.user?.fullName || '',
          email: res.data.user?.email || '',
          phone: res.data.user?.phone || '',
          address: res.data.user?.address || ''
        });
      })
      .catch(err => {
          console.error(err);
      })
      .finally(() => setLoading(false));
  }, [sessionUser]);

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3000/reviewer/profile/${sessionUser.reviewer.reviewerId}`, formData);
      setIsEditing(false);
      // Update local profile state to reflect changes
      setProfile((prev: any) => ({
        ...prev,
        user: { 
            ...prev?.user, 
            fullName: formData.name, 
            email: formData.email, 
            phone: formData.phone, 
            address: formData.address 
        }
      }));
      // Optional: Update localStorage user object as well so the sidebar updates instantly
      const savedUserStr = localStorage.getItem('user');
      if (savedUserStr) {
          const savedUser = JSON.parse(savedUserStr);
          savedUser.fullName = formData.name;
          savedUser.email = formData.email;
          savedUser.phone = formData.phone;
          savedUser.address = formData.address;
          localStorage.setItem('user', JSON.stringify(savedUser));
          // Note: a page refresh might be needed to update the sidebar if not using global state.
      }
      alert('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    }
  };

  if (loading) return <div className="text-gray-500 text-center mt-12">Loading profile data...</div>;

  if (!profile) return <div className="text-gray-500 text-center mt-12">Unable to load profile data. Ensure you are logged in correctly.</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-2xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">My Profile</h2>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium"
          >
            Update
          </button>
        ) : (
          <div className="space-x-3">
             <button 
                onClick={() => setIsEditing(false)} 
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
             >
                Cancel
             </button>
             <button 
                onClick={handleUpdate} 
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm font-medium"
             >
                Save
             </button>
          </div>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input 
            type="text" 
            disabled={!isEditing}
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className={`block w-full rounded-md shadow-sm p-2.5 border transition-colors ${
                isEditing 
                ? "border-blue-300 focus:border-blue-500 focus:ring-blue-500 bg-white" 
                : "border-gray-200 bg-gray-50 text-gray-600"
            }`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            disabled={!isEditing}
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            className={`block w-full rounded-md shadow-sm p-2.5 border transition-colors ${
                isEditing 
                ? "border-blue-300 focus:border-blue-500 focus:ring-blue-500 bg-white" 
                : "border-gray-200 bg-gray-50 text-gray-600"
            }`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input 
            type="text" 
            disabled={!isEditing}
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
            className={`block w-full rounded-md shadow-sm p-2.5 border transition-colors ${
                isEditing 
                ? "border-blue-300 focus:border-blue-500 focus:ring-blue-500 bg-white" 
                : "border-gray-200 bg-gray-50 text-gray-600"
            }`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input 
            type="text" 
            disabled={!isEditing}
            value={formData.address}
            onChange={e => setFormData({...formData, address: e.target.value})}
            className={`block w-full rounded-md shadow-sm p-2.5 border transition-colors ${
                isEditing 
                ? "border-blue-300 focus:border-blue-500 focus:ring-blue-500 bg-white" 
                : "border-gray-200 bg-gray-50 text-gray-600"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
