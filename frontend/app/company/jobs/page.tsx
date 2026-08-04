'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import StatusBadge from '@/app/components/StatusBadge';

export default function CompanyJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string>('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setCompanyId(u?.company?.companyId || '');
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (companyId) fetchJobs();
  }, [companyId]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/company/jobs?companyId=${companyId}`);
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeJob = async (jobId: string) => {
    if (!confirm('Remove this job posting? This cannot be undone.')) return;
    try {
      await axios.delete(`http://localhost:3000/company/jobs/${jobId}?companyId=${companyId}`);
      setJobs((prev) => prev.filter((j) => j.jobId !== jobId));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to remove job');
    }
  };

  if (loading) return <div className="text-gray-500 font-bold uppercase tracking-widest text-center mt-12">Loading your jobs…</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b-4 border-brand-black pb-4">
        <h2 className="text-3xl font-black text-brand-black uppercase tracking-widest">MY JOBS</h2>
        <Link href="/company/jobs/new" className="bg-brand-black text-white hover:bg-brand-red px-6 py-3 transition-colors text-xs font-black tracking-widest uppercase flex items-center cursor-pointer">
          <PlusIcon className="w-5 h-5 mr-2" /> POST A JOB
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white border-2 border-brand-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
          <h2 className="text-4xl font-black text-brand-black uppercase tracking-widest">NO JOBS YET</h2>
          <p className="text-brand-red font-bold uppercase tracking-widest mt-4">Post your first micro-internship to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div key={job.jobId} className="bg-white border-2 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)] flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-black text-brand-black uppercase tracking-tight">{job.title}</h3>
                <StatusBadge status={job.status} />
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">{job.description}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-widest mb-6">
                <span className="text-brand-black">Budget: <span className="text-green-700">${Number(job.budget).toFixed(2)}</span></span>
                <span className="text-brand-black">Category: <span className="text-brand-red">{job.category?.categoryName || 'Uncategorized'}</span></span>
                <span className="text-brand-black">Deadline: <span className="text-gray-700">{new Date(job.deadline).toLocaleDateString()}</span></span>
                <span className="text-brand-black">Applicants: <span className="text-brand-red">{job.applicationsCount ?? 0}</span></span>
              </div>
              <div className="mt-auto flex gap-3">
                <Link href={`/company/jobs/${job.jobId}`} className="flex-1 bg-brand-black text-white hover:bg-brand-red px-4 py-3 transition-colors text-xs font-black tracking-widest uppercase text-center cursor-pointer">
                  VIEW
                </Link>
                <Link href={`/company/jobs/${job.jobId}/edit`} className="flex-1 bg-white text-brand-black border-2 border-brand-black hover:bg-gray-100 px-4 py-3 transition-colors text-xs font-black tracking-widest uppercase text-center cursor-pointer">
                  EDIT
                </Link>
                <button onClick={() => removeJob(job.jobId)} className="bg-white text-brand-red border-2 border-brand-red hover:bg-brand-red hover:text-white px-4 py-3 transition-colors text-xs font-black tracking-widest uppercase cursor-pointer">
                  REMOVE
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
