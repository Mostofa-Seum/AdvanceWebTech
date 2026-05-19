'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

export default function DashboardProfile() {
  const router = useRouter();
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

  // Password change state 
  const [pwData, setPwData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  // Delete account state
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [sessionUser]);

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3000/reviewer/profile/${sessionUser.reviewer.reviewerId}`, formData);
      setIsEditing(false);
      setProfile((prev: any) => ({
        ...prev,
        user: { ...prev?.user, fullName: formData.name, email: formData.email, phone: formData.phone, address: formData.address }
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
    if (validationError) { setPwError(validationError); return; }
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

  const handleDeleteAccount = async () => {
    if (!deleteConfirmed) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`http://localhost:3000/reviewer/${sessionUser.reviewer.reviewerId}`);
      localStorage.removeItem('user');
      router.push('/homepage');
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to delete account. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <div className="text-gray-500 text-center mt-12">Loading profile data...</div>;
  if (!profile) return <div className="text-gray-500 text-center mt-12">Unable to load profile data. Ensure you are logged in correctly.</div>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto mt-8">

      {/* ── Update Profile ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">My Profile</h2>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium">
              Update
            </button>
          ) : (
            <div className="space-x-3">
              <button onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium">Cancel</button>
              <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm font-medium">Save</button>
            </div>
          )}
        </div>
        <div className="space-y-5">
          {[
            { label: 'Full Name', key: 'name', type: 'text' },
            { label: 'Email', key: 'email', type: 'email' },
            { label: 'Phone', key: 'phone', type: 'text' },
            { label: 'Address', key: 'address', type: 'text' },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                disabled={!isEditing}
                value={(formData as any)[key]}
                onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                className={`block w-full rounded-md shadow-sm p-2.5 border transition-colors ${isEditing ? "border-blue-300 bg-white" : "border-gray-200 bg-gray-50 text-gray-600"}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Change Password ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Change Password</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
            <input type="password" value={pwData.oldPassword} onChange={e => { setPwData({ ...pwData, oldPassword: e.target.value }); setPwError(''); setPwSuccess(''); }} placeholder="Enter your current password" className="block w-full rounded-md shadow-sm p-2.5 border border-gray-300 bg-white transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input type="password" value={pwData.newPassword} onChange={e => { setPwData({ ...pwData, newPassword: e.target.value }); setPwError(''); setPwSuccess(''); }} placeholder="Min. 8 characters" className="block w-full rounded-md shadow-sm p-2.5 border border-gray-300 bg-white transition-colors" />
            <p className="text-xs text-gray-400 mt-1">Must be at least 8 characters.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input type="password" value={pwData.confirmPassword} onChange={e => { setPwData({ ...pwData, confirmPassword: e.target.value }); setPwError(''); setPwSuccess(''); }} placeholder="Re-enter your new password" className="block w-full rounded-md shadow-sm p-2.5 border border-gray-300 bg-white transition-colors" />
          </div>
          {pwError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{pwError}</p>}
          {pwSuccess && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">{pwSuccess}</p>}
          <button onClick={handleChangePassword} disabled={pwLoading} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed">
            {pwLoading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-500 mb-6">
          Permanently delete your reviewer account and all associated data. This action <strong>cannot be undone</strong>.
        </p>
        <label className="flex items-center gap-3 mb-6 cursor-pointer select-none">
          <input
            id="delete-confirm-checkbox"
            type="checkbox"
            checked={deleteConfirmed}
            onChange={e => setDeleteConfirmed(e.target.checked)}
            className="w-4 h-4 accent-red-600 cursor-pointer"
          />
          <span className="text-sm text-gray-700">
            I understand this is permanent and want to delete my account.
          </span>
        </label>
        <button
          id="delete-account-btn"
          onClick={handleDeleteAccount}
          disabled={!deleteConfirmed || deleteLoading}
          className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {deleteLoading ? 'Deleting...' : 'Delete My Account'}
        </button>
      </div>

    </div>
  );
}
