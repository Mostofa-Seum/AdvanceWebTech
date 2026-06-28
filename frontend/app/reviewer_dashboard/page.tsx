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

  // --- Password change state ---
  const [pwData, setPwData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

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
      const savedUserStr = localStorage.getItem('user');
      if (savedUserStr) {
          const savedUser = JSON.parse(savedUserStr);
          savedUser.fullName = formData.name;
          savedUser.email = formData.email;
          savedUser.phone = formData.phone;
          savedUser.address = formData.address;
          localStorage.setItem('user', JSON.stringify(savedUser));
      }
      alert('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    }
  };

  const validateNewPassword = (password: string): string => {
    if (password.length < 8) return 'New password must be at least 8 characters long.';
    return '';
  };

  const handleChangePassword = async () => {
    setPwError('');
    setPwSuccess('');

    if (!pwData.oldPassword || !pwData.newPassword || !pwData.confirmPassword) {
      setPwError('All password fields are required.');
      return;
    }

    const validationError = validateNewPassword(pwData.newPassword);
    if (validationError) {
      setPwError(validationError);
      return;
    }

    if (pwData.newPassword !== pwData.confirmPassword) {
      setPwError('New password and confirm password do not match.');
      return;
    }

    setPwLoading(true);
    try {
      await axios.patch(
        `http://localhost:3000/reviewer/profile/${sessionUser.reviewer.reviewerId}/change-password`,
        { oldPassword: pwData.oldPassword, newPassword: pwData.newPassword }
      );
      setPwSuccess('Password changed successfully!');
      setPwData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      const msg = error?.response?.data?.message;
      if (msg === 'Old password is incorrect') {
        setPwError('Old password is incorrect. Please try again.');
      } else if (Array.isArray(msg)) {
        setPwError(msg.join(' '));
      } else {
        setPwError('Failed to change password. Please try again.');
      }
    } finally {
      setPwLoading(false);
    }
  };

  if (loading) return <div className="text-gray-500 font-bold uppercase tracking-widest text-center mt-12">Loading profile data...</div>;

  if (!profile) return <div className="text-brand-red font-bold uppercase tracking-widest text-center mt-12">Unable to load profile data. Ensure you are logged in correctly.</div>;

  return (
    <div className="space-y-12 max-w-2xl mx-auto">

      {/* ── Update Profile ── */}
      <div className="bg-white border-2 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
        <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-brand-black">
          <h2 className="text-2xl font-black text-brand-black uppercase tracking-widest">MY PROFILE</h2>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)} 
              className="bg-brand-black text-white px-6 py-3 hover:bg-brand-red transition-colors text-xs font-bold tracking-widest uppercase rounded-none cursor-pointer"
            >
              UPDATE
            </button>
          ) : (
            <div className="flex space-x-3">
               <button 
                  onClick={() => setIsEditing(false)} 
                  className="bg-white text-brand-black border-2 border-brand-black px-6 py-3 hover:bg-gray-100 transition-colors text-xs font-bold tracking-widest uppercase rounded-none cursor-pointer"
               >
                  CANCEL
               </button>
               <button 
                  onClick={handleUpdate} 
                  className="bg-brand-red text-white border-2 border-brand-red px-6 py-3 hover:bg-red-700 transition-colors text-xs font-bold tracking-widest uppercase rounded-none cursor-pointer"
               >
                  SAVE
               </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Full Name</label>
            <input 
              type="text" 
              disabled={!isEditing}
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className={`block w-full rounded-none p-3 border-2 transition-colors focus:outline-none ${
                  isEditing 
                  ? "border-brand-black focus:border-brand-red bg-white text-brand-black" 
                  : "border-gray-200 bg-gray-50 text-gray-500"
              }`}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Email</label>
            <input 
              type="email" 
              disabled={!isEditing}
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className={`block w-full rounded-none p-3 border-2 transition-colors focus:outline-none ${
                  isEditing 
                  ? "border-brand-black focus:border-brand-red bg-white text-brand-black" 
                  : "border-gray-200 bg-gray-50 text-gray-500"
              }`}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Phone</label>
            <input 
              type="text" 
              disabled={!isEditing}
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className={`block w-full rounded-none p-3 border-2 transition-colors focus:outline-none ${
                  isEditing 
                  ? "border-brand-black focus:border-brand-red bg-white text-brand-black" 
                  : "border-gray-200 bg-gray-50 text-gray-500"
              }`}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Address</label>
            <input 
              type="text" 
              disabled={!isEditing}
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
              className={`block w-full rounded-none p-3 border-2 transition-colors focus:outline-none ${
                  isEditing 
                  ? "border-brand-black focus:border-brand-red bg-white text-brand-black" 
                  : "border-gray-200 bg-gray-50 text-gray-500"
              }`}
            />
          </div>
        </div>
      </div>

      {/* ── Change Password ── */}
      <div className="bg-white border-2 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
        <h2 className="text-2xl font-black text-brand-black uppercase tracking-widest mb-8 pb-4 border-b-2 border-brand-black">CHANGE PASSWORD</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Old Password</label>
            <input
              type="password"
              value={pwData.oldPassword}
              onChange={e => { setPwData({...pwData, oldPassword: e.target.value}); setPwError(''); setPwSuccess(''); }}
              placeholder="Enter your current password"
              className="block w-full rounded-none p-3 border-2 border-gray-300 focus:border-brand-red bg-white transition-colors focus:outline-none text-brand-black placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">New Password</label>
            <input
              type="password"
              value={pwData.newPassword}
              onChange={e => { setPwData({...pwData, newPassword: e.target.value}); setPwError(''); setPwSuccess(''); }}
              placeholder="Min. 8 characters"
              className="block w-full rounded-none p-3 border-2 border-gray-300 focus:border-brand-red bg-white transition-colors focus:outline-none text-brand-black placeholder:text-gray-400"
            />
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mt-2">Must be at least 8 characters.</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Confirm New Password</label>
            <input
              type="password"
              value={pwData.confirmPassword}
              onChange={e => { setPwData({...pwData, confirmPassword: e.target.value}); setPwError(''); setPwSuccess(''); }}
              placeholder="Re-enter your new password"
              className="block w-full rounded-none p-3 border-2 border-gray-300 focus:border-brand-red bg-white transition-colors focus:outline-none text-brand-black placeholder:text-gray-400"
            />
          </div>

          {/* Error / Success feedback */}
          {pwError && (
            <div className="text-xs font-bold uppercase tracking-widest text-brand-red bg-brand-red/10 border-l-4 border-brand-red p-3">
              {pwError}
            </div>
          )}
          {pwSuccess && (
            <div className="text-xs font-bold uppercase tracking-widest text-green-700 bg-green-50 border-l-4 border-green-600 p-3">
              {pwSuccess}
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleChangePassword}
              disabled={pwLoading}
              className="w-full bg-brand-black text-white px-6 py-4 hover:bg-brand-red transition-colors text-xs font-bold tracking-widest uppercase rounded-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pwLoading ? 'UPDATING...' : 'UPDATE PASSWORD'}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
