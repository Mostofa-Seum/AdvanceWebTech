'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface UserActionsProps {
  userId: string;
  currentStatus: string;
  currentRole: string;
  employeeId?: string;
  reviewerId?: string;
}

export default function UserActions({ userId, currentStatus, currentRole, employeeId, reviewerId }: UserActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus: string) => {
    setLoading(true); setMsg('');
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/admin/users/${userId}/status`, { status: newStatus });
      setStatus(newStatus);
      setMsg(`Status updated to ${newStatus}`);
    } catch (err: any) {
      setMsg('Error: ' + (err.response?.data?.message || err.message));
    } finally { setLoading(false); }
  };

  const deleteUser = async () => {
    if (!confirm('Are you sure you want to permanently delete this user?')) return;
    setLoading(true);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/admin/users/${userId}`);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setMsg('Error: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const promoteToReviewer = async () => {
    if (!employeeId) { setMsg('No employee profile linked.'); return; }
    if (!confirm('Promote this employee to reviewer?')) return;
    setLoading(true);
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/admin/employees/${employeeId}/promote`);
      setMsg('Employee promoted to reviewer!');
      router.refresh();
    } catch (err: any) {
      setMsg('Error: ' + (err.response?.data?.message || err.message));
    } finally { setLoading(false); }
  };

  const demoteToEmployee = async () => {
    if (!reviewerId) { setMsg('No reviewer profile linked.'); return; }
    if (!confirm('Demote this reviewer to employee?')) return;
    setLoading(true);
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/admin/reviewers/${reviewerId}/demote`);
      setMsg('Reviewer demoted to employee!');
      router.refresh();
    } catch (err: any) {
      setMsg('Error: ' + (err.response?.data?.message || err.message));
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-white border-2 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)] space-y-8 mt-8">
      <h2 className="text-3xl font-black text-brand-black uppercase tracking-widest border-b-4 border-brand-black pb-4">ACTIONS</h2>

      {msg && (
        <p className={`text-xs font-bold uppercase tracking-widest p-4 border-2 ${msg.startsWith('Error') ? 'bg-white text-brand-red border-brand-red' : 'bg-brand-black text-white border-brand-black'}`}>
          {msg}
        </p>
      )}

      {/* Status Management */}
      <div>
        <label className="block text-xs font-black text-brand-black uppercase tracking-widest mb-4">UPDATE STATUS</label>
        <div className="flex items-center gap-4">
          <select
            value={status}
            onChange={(e) => updateStatus(e.target.value)}
            disabled={loading}
            className="block w-48 p-4 border-2 border-brand-black focus:border-brand-red focus:ring-0 focus:outline-none bg-white text-sm font-bold uppercase cursor-pointer"
          >
            <option value="pending">PENDING</option>
            <option value="active">ACTIVE</option>
            <option value="suspended">SUSPENDED</option>
            <option value="rejected">REJECTED</option>
          </select>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">CURRENT: {status}</span>
        </div>
      </div>

      {/* Role Actions */}
      {(currentRole === 'employee' || currentRole === 'reviewer') && (
        <div className="border-t-4 border-brand-black pt-8">
          <p className="text-xs font-black text-brand-black uppercase tracking-widest mb-4">ROLE MANAGEMENT</p>
          <div className="flex flex-wrap gap-4">
            {currentRole === 'employee' && (
              <button onClick={promoteToReviewer} disabled={loading}
                className="bg-white text-brand-black border-2 border-brand-black px-6 py-3 hover:bg-brand-black hover:text-white transition-colors text-xs font-black tracking-widest uppercase disabled:opacity-50 cursor-pointer">
                PROMOTE TO REVIEWER
              </button>
            )}
            {currentRole === 'reviewer' && (
              <button onClick={demoteToEmployee} disabled={loading}
                className="bg-white text-brand-black border-2 border-brand-black px-6 py-3 hover:bg-brand-black hover:text-white transition-colors text-xs font-black tracking-widest uppercase disabled:opacity-50 cursor-pointer">
                DEMOTE TO EMPLOYEE
              </button>
            )}
          </div>
        </div>
      )}

      {/* Delete */}
      <div className="border-t-4 border-brand-black pt-8">
        <button onClick={deleteUser} disabled={loading}
          className="bg-brand-red text-white border-2 border-brand-red px-6 py-3 hover:bg-white hover:text-brand-red transition-colors text-xs font-black tracking-widest uppercase disabled:opacity-50 cursor-pointer">
          DELETE USER PERMANENTLY
        </button>
      </div>
    </div>
  );
}
