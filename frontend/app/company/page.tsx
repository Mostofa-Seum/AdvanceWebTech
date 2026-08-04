'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function CompanyDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    website: '',
    phone: '',
    address: '',
    email: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');

  // Password change
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwMsg, setPwMsg] = useState('');
  const [pwMsgType, setPwMsgType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        const id = u?.company?.companyId;
        if (id) fetchProfile(id);
      } catch {}
    }
  }, []);

  const fetchProfile = async (id: string) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/company/profile/${id}`);
      setProfile(res.data);
      setFormData({
        companyName: res.data.companyName || '',
        description: res.data.description || '',
        website: res.data.website || '',
        phone: res.data.user?.phone || '',
        address: res.data.user?.address || '',
        email: res.data.user?.email || '',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const saveProfile = async () => {
    const id = profile?.companyId;
    if (!id) return;
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/company/profile/${id}`, formData);
      const updated = { ...profile, companyName: formData.companyName };
      setProfile(updated);
      // Persist updated name into localStorage user
      const stored = localStorage.getItem('user');
      if (stored) {
        const u = JSON.parse(stored);
        u.company = { ...u.company, companyName: formData.companyName };
        localStorage.setItem('user', JSON.stringify(u));
      }
      setMsg('Profile updated successfully');
      setMsgType('success');
      setIsEditing(false);
    } catch (err: any) {
      setMsg(err.response?.data?.message || 'Failed to update profile');
      setMsgType('error');
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg('');
    if (pwForm.newPassword.length < 8) {
      setPwMsg('New password must be at least 8 characters');
      setPwMsgType('error');
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg('Passwords do not match');
      setPwMsgType('error');
      return;
    }
    const id = profile?.companyId;
    if (!id) return;
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/company/profile/${id}/change-password`, {
        oldPassword: pwForm.oldPassword,
        newPassword: pwForm.newPassword,
      });
      setPwMsg('Password changed successfully');
      setPwMsgType('success');
      setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setPwMsg(err.response?.data?.message || 'Failed to change password');
      setPwMsgType('error');
    }
  };

  if (!profile) return <div className="text-gray-500 font-bold uppercase tracking-widest text-center mt-12">Loading company profile...</div>;

  const inputCls = `block w-full rounded-none p-3 border-2 transition-colors focus:outline-none ${
    isEditing
      ? 'border-brand-black focus:border-brand-red bg-white text-brand-black'
      : 'border-gray-200 bg-gray-50 text-gray-500'
  }`;

  return (
    <div className="space-y-12 max-w-5xl">
      {/* Profile */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black text-brand-black uppercase tracking-widest border-b-4 border-brand-black pb-4 flex-1">
            COMPANY PROFILE
          </h2>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="ml-6 bg-brand-black text-white hover:bg-brand-red px-6 py-3 transition-colors text-xs font-black tracking-widest uppercase cursor-pointer">
              EDIT PROFILE
            </button>
          ) : (
            <div className="ml-6 flex gap-3">
              <button onClick={() => setIsEditing(false)} className="bg-white text-brand-black border-2 border-brand-black hover:bg-gray-100 px-6 py-3 transition-colors text-xs font-black tracking-widest uppercase cursor-pointer">
                CANCEL
              </button>
              <button onClick={saveProfile} className="bg-brand-black text-white hover:bg-brand-red px-6 py-3 transition-colors text-xs font-black tracking-widest uppercase cursor-pointer">
                SAVE
              </button>
            </div>
          )}
        </div>

        {msg && (
          <div className={`mb-6 p-4 text-xs font-bold uppercase tracking-widest border-2 ${pwMsgType === 'error' || msgType === 'error' ? 'text-brand-red bg-white border-brand-red' : 'text-white bg-brand-black border-brand-black'}`}>
            {msg}
          </div>
        )}

        <div className="bg-white border-2 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Company Name</label>
              <input type="text" disabled={!isEditing} value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Website</label>
              <input type="text" disabled={!isEditing} value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className={inputCls} placeholder="https://…" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Description</label>
              <textarea rows={4} disabled={!isEditing} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Email</label>
              <input type="email" disabled={!isEditing} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Phone</label>
              <input type="text" disabled={!isEditing} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputCls} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Address</label>
              <input type="text" disabled={!isEditing} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className={inputCls} />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t-2 border-gray-200">
            <div className="p-4 bg-gray-50 border-2 border-brand-black">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Status</p>
              <p className="text-lg font-black text-brand-black uppercase mt-1">{profile.status}</p>
            </div>
            <div className="p-4 bg-gray-50 border-2 border-brand-black">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Trust Score</p>
              <p className="text-lg font-black text-brand-red mt-1">{Number(profile.trustScore || 0).toFixed(1)} ★</p>
            </div>
          </div>
        </div>
      </section>

      {/* Change Password */}
      <section>
        <h2 className="text-3xl font-black text-brand-black uppercase tracking-widest border-b-4 border-brand-black pb-4 mb-6">CHANGE PASSWORD</h2>
        {pwMsg && (
          <div className={`mb-6 p-4 text-xs font-bold uppercase tracking-widest border-2 ${pwMsgType === 'error' ? 'text-brand-red bg-white border-brand-red' : 'text-white bg-brand-black border-brand-black'}`}>
            {pwMsg}
          </div>
        )}
        <form onSubmit={changePassword} className="bg-white border-2 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)] space-y-6 max-w-xl">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Current Password</label>
            <input type="password" required value={pwForm.oldPassword} onChange={(e) => setPwForm({ ...pwForm, oldPassword: e.target.value })} className="block w-full rounded-none p-3 border-2 border-brand-black focus:border-brand-red focus:outline-none bg-white text-brand-black" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">New Password</label>
            <input type="password" required value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} className="block w-full rounded-none p-3 border-2 border-brand-black focus:border-brand-red focus:outline-none bg-white text-brand-black" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Confirm New Password</label>
            <input type="password" required value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} className="block w-full rounded-none p-3 border-2 border-brand-black focus:border-brand-red focus:outline-none bg-white text-brand-black" />
          </div>
          <button type="submit" className="bg-brand-black text-white hover:bg-brand-red px-8 py-4 transition-colors text-xs font-black tracking-widest uppercase cursor-pointer">
            UPDATE PASSWORD
          </button>
        </form>
      </section>
    </div>
  );
}
