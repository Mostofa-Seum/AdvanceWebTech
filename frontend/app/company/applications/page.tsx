'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import StatusBadge from '@/app/components/StatusBadge';

export default function CompanyApplicationsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState('');
  const [filter, setFilter] = useState('all');

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
    if (!companyId) return;
    fetchJobsAndApps();
  }, [companyId]);

  const fetchJobsAndApps = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/company/jobs?companyId=${companyId}`);
      const jobs = res.data;
      // For each job load its applications
      const allApps: any[] = [];
      await Promise.all(jobs.map(async (job: any) => {
        try {
          const a = await axios.get(`http://localhost:3000/company/jobs/${job.jobId}/applications?companyId=${companyId}`);
          a.data.forEach((x: any) => allApps.push({ ...x, jobTitle: job.title, jobId: job.jobId }));
        } catch {}
      }));
      setApps(allApps);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'all' ? apps : apps.filter((a) => a.status === filter);

  if (loading) return <div className="text-gray-500 font-bold uppercase tracking-widest text-center mt-12">Loading applicants…</div>;

  const filters = ['all', 'pending', 'accepted', 'rejected'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-brand-black pb-4 gap-4">
        <h2 className="text-3xl font-black text-brand-black uppercase tracking-widest">ALL APPLICANTS</h2>
        <div className="flex flex-wrap gap-3">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 text-xs font-black uppercase tracking-widest border-2 border-brand-black transition-colors ${filter === f ? 'bg-brand-black text-white' : 'bg-white text-brand-black hover:bg-gray-100'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border-2 border-brand-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
          <h2 className="text-2xl font-black text-brand-black uppercase tracking-widest">NO APPLICANTS</h2>
          <p className="text-brand-red font-bold uppercase tracking-widest mt-3">No applications match this filter.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border-2 border-brand-black">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-black text-white text-xs font-black uppercase tracking-widest border-b-4 border-brand-black">
                <th className="p-4">APPLICANT</th>
                <th className="p-4">JOB</th>
                <th className="p-4">SKILLS</th>
                <th className="p-4">STATUS</th>
                <th className="p-4">APPLIED</th>
                <th className="p-4">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-brand-black bg-white">
              {filtered.map((a, idx) => (
                <tr key={a.applicationId || idx} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-bold text-brand-black uppercase tracking-wide">{a.employee?.user?.fullName || 'N/A'}</td>
                  <td className="p-4 text-sm">{a.jobTitle}</td>
                  <td className="p-4 text-xs uppercase tracking-widest text-gray-600">{a.employee?.skills || '—'}</td>
                  <td className="p-4"><StatusBadge status={a.status} /></td>
                  <td className="p-4 text-xs uppercase tracking-widest text-gray-500">{new Date(a.appliedAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <Link href={`/company/jobs/${a.jobId}`} className="text-xs font-black uppercase tracking-widest text-brand-red hover:underline">VIEW JOB</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
