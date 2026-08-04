'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function EmployeeDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    skills: '',
    experience: '',
    portfolio: '',
    phone: '',
    address: '',
    email: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');

  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwMsg, setPwMsg] = useState('');
  const [pwMsgType, setPwMsgType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        const id = u?.employee?.employeeId;
        if (id) fetchProfile(id);
      } catch {}
    }
  }, []);

  const fetchProfile = async (id: string) => {
    try {
      const res = await axios.get(`http://localhost:3000/employee/profile/${id}`);
      setProfile(res.data);
      setFormData({
        fullName: res.data.user?.fullName || '',
        skills: res.data.skills || '',
        experience: res.data.experience || '',
        portfolio: res.data.portfolio || '',
        phone: res.data.user?.phone || '',
        address: res.data.user?.address || '',
        email: res.data.user?.email || '',
      });
    } catch (err) { console.error(err); }
  };

  const saveProfile = async () => {
    const id = profile?.employeeId;
    if (!id) return;
    try {
      await axios.put(`http://localhost:3000/employee/profile/${id}`, formData);
      // Persist name back into localStorage
      const stored = localStorage.getItem('user');
      if (stored) {
        const u = JSON.parse(stored);
        u.fullName = formData.fullName;
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
    const id = profile?.employeeId;
    if (!id) return;
    try {
      await axios.patch(`http://localhost:3000/employee/profile/${id}/change-password`, {
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

  if (!profile) return <div className="text-gray-500 font-bold uppercase tracking-widest text-center mt-12">Loading employee profile…</div>;

  const inputCls = `block w-full rounded-none p-3 border-2 transition-colors focus:outline-none ${
    isEditing
      ? 'border-brand-black focus:border-brand-red bg-white text-brand-black'
      : 'border-gray-200 bg-gray-50 text-gray-500'
  }`;

  return (
    <div className="space-y-12 max-w-5xl">
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-brand-black p-6 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Available Balance</p>
          <p className="text-3xl font-black text-green-700 mt-2">${Number(profile.balance || 0).toFixed(2)}</p>
        </div>
        <div className="bg-white border-2 border-brand-black p-6 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Trust Score</p>
          <p className="text-3xl font-black text-brand-red mt-2">{Number(profile.trustScore || 0).toFixed(1)} ★</p>
        </div>
        <div className="bg-white border-2 border-brand-black p-6 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Account Status</p>
          <p className="text-3xl font-black text-brand-black mt-2 uppercase">{profile.user?.status || '—'}</p>
        </div>
      </div>

      {/* Profile */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black text-brand-black uppercase tracking-widest border-b-4 border-brand-black pb-4 flex-1">MY PROFILE</h2>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="ml-6 bg-brand-black text-white hover:bg-brand-red px-6 py-3 transition-colors text-xs font-black tracking-widest uppercase cursor-pointer">EDIT PROFILE</button>
          ) : (
            <div className="ml-6 flex gap-3">
              <button onClick={() => setIsEditing(false)} className="bg-white text-brand-black border-2 border-brand-black hover:bg-gray-100 px-6 py-3 transition-colors text-xs font-black tracking-widest uppercase cursor-pointer">CANCEL</button>
              <button onClick={saveProfile} className="bg-brand-black text-white hover:bg-brand-red px-6 py-3 transition-colors text-xs font-black tracking-widest uppercase cursor-pointer">SAVE</button>
            </div>
          )}
        </div>

        {msg && (
          <div className={`mb-6 p-4 text-xs font-bold uppercase tracking-widest border-2 ${msgType === 'error' ? 'text-brand-red bg-white border-brand-red' : 'text-white bg-brand-black border-brand-black'}`}>{msg}</div>
        )}

        <div className="bg-white border-2 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Full Name</label>
              <input type="text" disabled={!isEditing} value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Portfolio URL</label>
              <input type="text" disabled={!isEditing} value={formData.portfolio} onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })} className={inputCls} placeholder="https://…" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Skills (comma separated)</label>
              <input type="text" disabled={!isEditing} value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} className={inputCls} placeholder="React, TypeScript, Node.js" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Experience</label>
              <textarea rows={4} disabled={!isEditing} value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} className={inputCls} placeholder="Describe your relevant experience" />
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
        </div>
      </section>

      {/* Change Password */}
      <section>
        <h2 className="text-3xl font-black text-brand-black uppercase tracking-widest border-b-4 border-brand-black pb-4 mb-6">CHANGE PASSWORD</h2>
        {pwMsg && (
          <div className={`mb-6 p-4 text-xs font-bold uppercase tracking-widest border-2 ${pwMsgType === 'error' ? 'text-brand-red bg-white border-brand-red' : 'text-white bg-brand-black border-brand-black'}`}>{pwMsg}</div>
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
          <button type="submit" className="bg-brand-black text-white hover:bg-brand-red px-8 py-4 transition-colors text-xs font-black tracking-widest uppercase cursor-pointer">UPDATE PASSWORD</button>
        </form>
      </section>
    </div>
  );
}
