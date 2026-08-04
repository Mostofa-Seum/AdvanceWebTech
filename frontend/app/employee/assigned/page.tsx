'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import StatusBadge from '@/app/components/StatusBadge';

export default function EmployeeAssignedPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
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
    fetchAssigned();
  }, [employeeId]);

  const fetchAssigned = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/employee/assigned?employeeId=${employeeId}`);
      setAssignments(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  if (loading) return <div className="text-gray-500 font-bold uppercase tracking-widest text-center mt-12">Loading assignments…</div>;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black text-brand-black uppercase tracking-widest border-b-4 border-brand-black pb-4">MY ASSIGNMENTS</h2>

      {assignments.length === 0 ? (
        <div className="bg-white border-2 border-brand-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
          <h2 className="text-2xl font-black text-brand-black uppercase tracking-widest">NO ASSIGNMENTS</h2>
          <p className="text-brand-red font-bold uppercase tracking-widest mt-3">When a company accepts your application, the task will appear here.</p>
          <Link href="/employee/browse" className="inline-block mt-6 bg-brand-black text-white hover:bg-brand-red px-6 py-3 transition-colors text-xs font-black tracking-widest uppercase cursor-pointer">BROWSE JOBS</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments.map((a) => (
            <div key={a.assignedJobId} className="bg-white border-2 border-brand-black p-6 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)] flex flex-col">
              <div className="flex justify-between items-start mb-3 gap-2">
                <h3 className="text-xl font-black text-brand-black uppercase tracking-tight">{a.job?.title || 'Job'}</h3>
                <StatusBadge status={a.status} />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
                Company: <span className="text-brand-black">{a.job?.company?.companyName || '—'}</span>
              </p>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">{a.job?.description}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-widest mb-6">
                <span className="text-brand-black">Budget: <span className="text-green-700">${Number(a.job?.budget || 0).toFixed(2)}</span></span>
                <span className="text-brand-black">Category: <span className="text-brand-red">{a.job?.category?.categoryName || '—'}</span></span>
              </div>
              <Link href={`/employee/assigned/${a.assignedJobId}`} className="mt-auto bg-brand-black text-white hover:bg-brand-red px-4 py-3 transition-colors text-xs font-black tracking-widest uppercase text-center cursor-pointer">
                OPEN & SUBMIT WORK
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
