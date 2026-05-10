'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function DashboardProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setSessionUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage");
      }
    } else {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!sessionUser?.reviewer?.reviewerId) {
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
