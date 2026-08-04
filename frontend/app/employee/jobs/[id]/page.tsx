'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import StatusBadge from '@/app/components/StatusBadge';

export default function EmployeeJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const [employeeId, setEmployeeId] = useState('');
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState('');
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setEmployeeId(JSON.parse(stored)?.employee?.employeeId || ''); } catch {}
    }
  }, []);

  useEffect(() => {
    if (!employeeId || !jobId) return;
    fetchJob();
  }, [employeeId, jobId]);

  const fetchJob = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/employee/jobs/${jobId}?employeeId=${employeeId}`);
      setJob(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const apply = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    setSubmitting(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/employee/jobs/${jobId}/apply?employeeId=${employeeId}`, { coverLetter });
      setMsg('Application submitted successfully!');
      setMsgType('success');
      fetchJob();
    } catch (err: any) {
      setMsg(err.response?.data?.message || 'Failed to apply');
      setMsgType('error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-gray-500 font-bold uppercase tracking-widest text-center mt-12">Loading job…</div>;
  if (!job) return <div className="text-gray-500 font-bold uppercase tracking-widest text-center mt-12">Job not found</div>;

  const myApp = job.myApplication;

  return (
    <div className="space-y-8 max-w-4xl">
      <Link href="/employee/browse" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-black hover:text-brand-red">
        <ArrowLeftIcon className="h-4 w-4" /> BACK TO BROWSE
      </Link>

      {/* Job detail */}
      <div className="bg-white border-2 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
        <div className="flex items-start justify-between mb-4 gap-4">
          <h2 className="text-3xl font-black text-brand-black uppercase tracking-tight">{job.title}</h2>
          <StatusBadge status={job.status} />
        </div>
        <p className="text-sm text-gray-700 whitespace-pre-wrap mb-6">{job.description}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t-2 border-gray-200">
          <div><p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Budget</p><p className="text-lg font-black text-green-700">${Number(job.budget).toFixed(2)}</p></div>
          <div><p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Category</p><p className="text-lg font-black text-brand-red">{job.category?.categoryName || '—'}</p></div>
          <div><p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Deadline</p><p className="text-lg font-black text-brand-black">{new Date(job.deadline).toLocaleDateString()}</p></div>
          <div><p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Company</p><p className="text-lg font-black text-brand-black truncate">{job.company?.companyName || '—'}</p></div>
        </div>
      </div>

      {/* Apply form OR status */}
      {job.status !== 'open' ? (
        <div className="bg-white border-2 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)] text-center">
          <p className="text-xl font-black text-brand-red uppercase tracking-widest">This job is no longer accepting applications.</p>
        </div>
      ) : myApp ? (
        <div className="bg-white border-2 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-xl font-black text-brand-black uppercase tracking-widest">YOUR APPLICATION</h3>
            <StatusBadge status={myApp.status} />
          </div>
          {myApp.coverLetter && <p className="text-sm text-gray-700 whitespace-pre-wrap">{myApp.coverLetter}</p>}
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-4">Applied on {new Date(myApp.appliedAt).toLocaleString()}</p>
        </div>
      ) : (
        <form onSubmit={apply} className="bg-white border-2 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)] space-y-6">
          <h3 className="text-xl font-black text-brand-black uppercase tracking-widest">APPLY FOR THIS JOB</h3>
          {msg && (
            <div className={`p-4 text-xs font-bold uppercase tracking-widest border-2 ${msgType === 'error' ? 'text-brand-red bg-white border-brand-red' : 'text-white bg-brand-black border-brand-black'}`}>{msg}</div>
          )}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brand-black mb-2">Cover Letter</label>
            <textarea rows={6} value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder="Explain why you're a great fit for this task…" className="block w-full rounded-none p-3 border-2 border-brand-black focus:border-brand-red focus:outline-none bg-white text-sm font-bold text-brand-black" />
          </div>
          <button type="submit" disabled={submitting} className="bg-brand-black text-white hover:bg-brand-red px-8 py-4 transition-colors text-xs font-black tracking-widest uppercase cursor-pointer disabled:opacity-60">
            {submitting ? 'SUBMITTING…' : 'SUBMIT APPLICATION'}
          </button>
        </form>
      )}
    </div>
  );
}
