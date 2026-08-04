'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import StatusBadge from '@/app/components/StatusBadge';

export default function EmployeeApplicationsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [employeeId, setEmployeeId] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setEmployeeId(JSON.parse(stored)?.employee?.employeeId || ''); } catch {}
    }
  }, []);

  useEffect(() => {
    if (!employeeId) return;
    fetchApps();
  }, [employeeId]);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/employee/applications?employeeId=${employeeId}`);
      setApps(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const withdraw = async (applicationId: string) => {
    if (!confirm('Withdraw this application?')) return;
    try {
      await axios.delete(`http://localhost:3000/employee/applications/${applicationId}?employeeId=${employeeId}`);
      setApps((prev) => prev.filter((a) => a.applicationId !== applicationId));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to withdraw');
    }
  };

  if (loading) return <div className="text-gray-500 font-bold uppercase tracking-widest text-center mt-12">Loading applications…</div>;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black text-brand-black uppercase tracking-widest border-b-4 border-brand-black pb-4">MY APPLICATIONS</h2>

      {apps.length === 0 ? (
        <div className="bg-white border-2 border-brand-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
          <h2 className="text-2xl font-black text-brand-black uppercase tracking-widest">NO APPLICATIONS</h2>
          <p className="text-brand-red font-bold uppercase tracking-widest mt-3">Browse open jobs and apply to get started.</p>
          <Link href="/employee/browse" className="inline-block mt-6 bg-brand-black text-white hover:bg-brand-red px-6 py-3 transition-colors text-xs font-black tracking-widest uppercase cursor-pointer">BROWSE JOBS</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {apps.map((a) => (
            <div key={a.applicationId} className="bg-white border-2 border-brand-black p-6 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-xl font-black text-brand-black uppercase tracking-wide">{a.job?.title || 'Job'}</h3>
                    <StatusBadge status={a.status} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    Company: <span className="text-brand-black">{a.job?.company?.companyName || '—'}</span>
                    <span className="mx-3">•</span>
                    Budget: <span className="text-green-700">${Number(a.job?.budget || 0).toFixed(2)}</span>
                    <span className="mx-3">•</span>
                    Applied: <span className="text-brand-black">{new Date(a.appliedAt).toLocaleDateString()}</span>
                  </p>
                  {a.coverLetter && <p className="text-sm text-gray-700 mt-3 whitespace-pre-wrap line-clamp-3">{a.coverLetter}</p>}
                </div>
                {a.status === 'pending' && (
                  <button onClick={() => withdraw(a.applicationId)} className="bg-white text-brand-red border-2 border-brand-red hover:bg-brand-red hover:text-white px-5 py-3 transition-colors text-xs font-black tracking-widest uppercase cursor-pointer">
                    WITHDRAW
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
