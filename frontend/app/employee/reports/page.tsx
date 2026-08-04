'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function EmployeeReportsPage() {
  const [employeeId, setEmployeeId] = useState('');
  const [assignments, setAssignments] = useState<any[]>([]);
  const [form, setForm] = useState({ againstUserId: '', jobId: '', reason: '', details: '' });
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        const id = u?.employee?.employeeId;
        setEmployeeId(id || '');
        if (id) {
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/employee/assigned?employeeId=${id}`).then((r) => setAssignments(r.data)).catch(() => {});
        }
      } catch {}
    }
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    if (!form.againstUserId || !form.reason) {
      setMsg('Target user and reason are required');
      setMsgType('error');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/employee/reports?employeeId=${employeeId}`, {
        againstUserId: form.againstUserId,
        jobId: form.jobId || undefined,
        reason: form.reason,
        details: form.details || undefined,
      });
      setMsg('Report submitted successfully. A reviewer will look into it.');
      setMsgType('success');
      setForm({ againstUserId: '', jobId: '', reason: '', details: '' });
    } catch (err: any) {
      setMsg(err.response?.data?.message || 'Failed to submit report');
      setMsgType('error');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = 'block w-full rounded-none p-3 border-2 border-brand-black focus:border-brand-red focus:ring-0 focus:outline-none bg-white text-sm font-bold text-brand-black';

  return (
    <div className="space-y-8 max-w-3xl">
      <h2 className="text-3xl font-black text-brand-black uppercase tracking-widest border-b-4 border-brand-black pb-4">FILE A REPORT</h2>

      {msg && (
        <div className={`p-4 text-xs font-bold uppercase tracking-widest border-2 ${msgType === 'error' ? 'text-brand-red bg-white border-brand-red' : 'text-white bg-brand-black border-brand-black'}`}>
          {msg}
        </div>
      )}

      <form onSubmit={submit} className="bg-white border-2 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)] space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">User ID to Report</label>
          <input className={inputCls} value={form.againstUserId} onChange={(e) => setForm({ ...form, againstUserId: e.target.value })} placeholder="Paste the user UUID" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-2">Find the UUID on the user's profile or your assignment details.</p>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Related Job (optional)</label>
          <select className={`${inputCls} uppercase cursor-pointer`} value={form.jobId} onChange={(e) => setForm({ ...form, jobId: e.target.value })}>
            <option value="">— None —</option>
            {assignments.map((a) => (<option key={a.assignedJobId} value={a.job?.jobId}>{a.job?.title}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Reason</label>
          <input className={inputCls} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="e.g. Unresponsive, unpaid, inappropriate" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Details</label>
          <textarea rows={4} className={inputCls} value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} placeholder="Describe what happened" />
        </div>
        <button type="submit" disabled={submitting} className="bg-brand-black text-white hover:bg-brand-red px-8 py-4 transition-colors text-xs font-black tracking-widest uppercase cursor-pointer disabled:opacity-60">
          {submitting ? 'SUBMITTING…' : 'SUBMIT REPORT'}
        </button>
      </form>

      <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
        Reports are reviewed by our reviewer team.{' '}
        <Link href="/employee" className="text-brand-black hover:text-brand-red border-b border-brand-black">Back to dashboard</Link>
      </p>
    </div>
  );
}
