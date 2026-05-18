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
      await axios.patch(`http://localhost:3000/admin/users/${userId}/status`, { status: newStatus });
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
      await axios.delete(`http://localhost:3000/admin/users/${userId}`);
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
      await axios.patch(`http://localhost:3000/admin/employees/${employeeId}/promote`);
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
      await axios.patch(`http://localhost:3000/admin/reviewers/${reviewerId}/demote`);
      setMsg('Reviewer demoted to employee!');
      router.refresh();
    } catch (err: any) {
      setMsg('Error: ' + (err.response?.data?.message || err.message));
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
      <h2 className="text-lg font-semibold text-gray-900">Actions</h2>

      {msg && (
        <p className={`text-sm p-3 rounded-lg ${msg.startsWith('Error') ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {msg}
        </p>
      )}

      {/* Status Management */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => updateStatus(e.target.value)}
            disabled={loading}
            className="block w-48 rounded-md shadow-sm p-2.5 border border-gray-300 focus:border-blue-500 bg-white text-sm"
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="rejected">Rejected</option>
          </select>
          <span className="text-xs text-gray-400">Current: {status}</span>
        </div>
      </div>

      {/* Role Actions */}
      {(currentRole === 'employee' || currentRole === 'reviewer') && (
        <div className="border-t border-gray-200 pt-5">
          <p className="text-sm font-medium text-gray-700 mb-3">Role Management</p>
          <div className="flex gap-3">
            {currentRole === 'employee' && (
              <button onClick={promoteToReviewer} disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium disabled:opacity-50">
                Promote to Reviewer
              </button>
            )}
            {currentRole === 'reviewer' && (
              <button onClick={demoteToEmployee} disabled={loading}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 text-sm font-medium disabled:opacity-50">
                Demote to Employee
              </button>
            )}
          </div>
        </div>
      )}

      {/* Delete */}
      <div className="border-t border-gray-200 pt-5">
        <button onClick={deleteUser} disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-medium disabled:opacity-50">
          Delete User Permanently
        </button>
      </div>
    </div>
  );
}
