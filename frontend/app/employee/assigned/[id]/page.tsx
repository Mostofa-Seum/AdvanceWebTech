'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, StarIcon } from '@heroicons/react/24/outline';
import StatusBadge from '@/app/components/StatusBadge';

export default function EmployeeAssignedDetailPage() {
  const params = useParams();
  const assignedJobId = params.id as string;
  const [employeeId, setEmployeeId] = useState('');
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ submissionText: '', fileUrl: '', liveLink: '' });
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');
  const [submitting, setSubmitting] = useState(false);

  // Rating
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingMsg, setRatingMsg] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setEmployeeId(JSON.parse(stored)?.employee?.employeeId || ''); } catch {}
    }
  }, []);

  useEffect(() => {
    if (!employeeId || !assignedJobId) return;
    fetchAssignment();
  }, [employeeId, assignedJobId]);

  const fetchAssignment = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/employee/assigned/${assignedJobId}?employeeId=${employeeId}`);
      setAssignment(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const submitWork = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    if (!form.submissionText && !form.fileUrl && !form.liveLink) {
      setMsg('Provide at least one of: text, file URL, or live link');
      setMsgType('error');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`http://localhost:3000/employee/assigned/${assignedJobId}/submit?employeeId=${employeeId}`, form);
      setMsg('Work submitted successfully! A reviewer will verify it.');
      setMsgType('success');
      setForm({ submissionText: '', fileUrl: '', liveLink: '' });
      fetchAssignment();
    } catch (err: any) {
      setMsg(err.response?.data?.message || 'Failed to submit work');
      setMsgType('error');
    } finally {
      setSubmitting(false);
    }
  };

  const submitRating = async () => {
    setRatingMsg('');
    if (rating < 1 || rating > 5) { setRatingMsg('Select a rating between 1 and 5'); return; }
    const jobId = assignment?.job?.jobId;
    if (!jobId) return;
    try {
      await axios.post(`http://localhost:3000/employee/jobs/${jobId}/rate?employeeId=${employeeId}`, { rating, comment: ratingComment });
      setRatingMsg('Rating submitted successfully');
      setRating(0); setRatingComment('');
    } catch (err: any) {
      setRatingMsg(err.response?.data?.message || 'Failed to submit rating');
    }
  };

  if (loading) return <div className="text-gray-500 font-bold uppercase tracking-widest text-center mt-12">Loading assignment…</div>;
  if (!assignment) return <div className="text-gray-500 font-bold uppercase tracking-widest text-center mt-12">Assignment not found</div>;

  const job = assignment.job;
  const submissions = assignment.submissions || [];
  const canSubmit = assignment.status === 'assigned' || assignment.status === 'in_progress';
  const canRate = job?.status === 'approved' || job?.status === 'paid';

  const inputCls = 'block w-full rounded-none p-3 border-2 border-brand-black focus:border-brand-red focus:ring-0 focus:outline-none bg-white text-sm font-bold text-brand-black';

  return (
    <div className="space-y-8 max-w-4xl">
      <Link href="/employee/assigned" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-black hover:text-brand-red">
        <ArrowLeftIcon className="h-4 w-4" /> BACK TO ASSIGNMENTS
      </Link>

      {/* Job context */}
      <div className="bg-white border-2 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="text-2xl font-black text-brand-black uppercase tracking-tight">{job?.title || 'Job'}</h2>
          <StatusBadge status={assignment.status} />
        </div>
        <p className="text-sm text-gray-700 whitespace-pre-wrap mb-6">{job?.description}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t-2 border-gray-200">
          <div><p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Budget</p><p className="text-lg font-black text-green-700">${Number(job?.budget || 0).toFixed(2)}</p></div>
          <div><p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Company</p><p className="text-lg font-black text-brand-black truncate">{job?.company?.companyName || '—'}</p></div>
          <div><p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Category</p><p className="text-lg font-black text-brand-red">{job?.category?.categoryName || '—'}</p></div>
          <div><p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Assigned</p><p className="text-xs font-bold text-brand-black">{new Date(assignment.assignedAt).toLocaleDateString()}</p></div>
        </div>
      </div>

      {/* Previous submissions */}
      {submissions.length > 0 && (
        <div>
          <h3 className="text-xl font-black text-brand-black uppercase tracking-widest border-b-4 border-brand-black pb-3 mb-4">YOUR SUBMISSIONS</h3>
          <div className="space-y-4">
            {submissions.map((s: any) => (
              <div key={s.submissionId} className="bg-white border-2 border-brand-black p-5 shadow-[4px_4px_0px_0px_rgba(43,43,43,1)]">
                <div className="flex items-center justify-between mb-2">
                  <StatusBadge status={s.status} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{new Date(s.submittedAt).toLocaleString()}</span>
                </div>
                {s.submissionText && <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{s.submissionText}</p>}
                {s.fileUrl && <p className="text-xs font-bold uppercase tracking-widest mt-2"><a href={s.fileUrl} target="_blank" className="text-brand-red">📄 View File</a></p>}
                {s.liveLink && <p className="text-xs font-bold uppercase tracking-widest mt-1"><a href={s.liveLink} target="_blank" className="text-brand-red">🔗 Live Link</a></p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit work form */}
      {canSubmit ? (
        <form onSubmit={submitWork} className="bg-white border-2 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)] space-y-6">
          <h3 className="text-xl font-black text-brand-black uppercase tracking-widest">SUBMIT YOUR WORK</h3>
          {msg && (
            <div className={`p-4 text-xs font-bold uppercase tracking-widest border-2 ${msgType === 'error' ? 'text-brand-red bg-white border-brand-red' : 'text-white bg-brand-black border-brand-black'}`}>{msg}</div>
          )}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Work Description</label>
            <textarea rows={5} value={form.submissionText} onChange={(e) => setForm({ ...form, submissionText: e.target.value })} className={inputCls} placeholder="Describe what you delivered" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">File URL</label>
              <input type="text" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} className={inputCls} placeholder="https://drive.google.com/…" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Live Link</label>
              <input type="text" value={form.liveLink} onChange={(e) => setForm({ ...form, liveLink: e.target.value })} className={inputCls} placeholder="https://your-deployment.com" />
            </div>
          </div>
          <button type="submit" disabled={submitting} className="bg-brand-black text-white hover:bg-brand-red px-8 py-4 transition-colors text-xs font-black tracking-widest uppercase cursor-pointer disabled:opacity-60">
            {submitting ? 'SUBMITTING…' : 'SUBMIT WORK'}
          </button>
        </form>
      ) : (
        <div className="bg-white border-2 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)] text-center">
          <p className="text-lg font-black text-brand-black uppercase tracking-widest">This assignment is {String(assignment.status).toUpperCase()}</p>
          <p className="text-sm text-gray-500 mt-2">No further submissions are needed.</p>
        </div>
      )}

      {/* Rate company */}
      {canRate && (
        <div className="bg-white border-2 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
          <h3 className="text-xl font-black text-brand-black uppercase tracking-widest mb-4">RATE THE COMPANY</h3>
          {ratingMsg && <div className="mb-4 p-3 text-xs font-bold uppercase tracking-widest border-2 border-brand-black bg-gray-50">{ratingMsg}</div>}
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setRating(n)} className={`p-2 border-2 ${rating >= n ? 'border-brand-red text-brand-red' : 'border-gray-300 text-gray-300'} hover:border-brand-red`}>
                <StarIcon className="w-6 h-6" />
              </button>
            ))}
          </div>
          <textarea rows={3} value={ratingComment} onChange={(e) => setRatingComment(e.target.value)} placeholder="Optional comment" className={`${inputCls} mb-4`} />
          <button onClick={submitRating} className="bg-brand-black text-white hover:bg-brand-red px-6 py-3 transition-colors text-xs font-black tracking-widest uppercase cursor-pointer">SUBMIT RATING</button>
        </div>
      )}
    </div>
  );
}
