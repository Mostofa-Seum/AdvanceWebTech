'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, CheckIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/outline';
import StatusBadge from '@/app/components/StatusBadge';

export default function CompanyJobDetailPage() {
  const params = useParams();
  const jobId = params.id as string;
  const [companyId, setCompanyId] = useState('');
  const [job, setJob] = useState<any>(null);
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingMsg, setRatingMsg] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setCompanyId(JSON.parse(stored)?.company?.companyId || ''); } catch {}
    }
  }, []);

  useEffect(() => {
    if (!companyId || !jobId) return;
    fetchAll();
  }, [companyId, jobId]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [jobRes, appsRes] = await Promise.all([
        axios.get(`http://localhost:3000/company/jobs/${jobId}?companyId=${companyId}`),
        axios.get(`http://localhost:3000/company/jobs/${jobId}/applications?companyId=${companyId}`),
      ]);
      setJob(jobRes.data);
      setApps(appsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const accept = async (applicationId: string) => {
    if (!confirm('Accept this application? An escrow payment will be held and all other applicants rejected.')) return;
    try {
      await axios.patch(`http://localhost:3000/company/applications/${applicationId}/accept?companyId=${companyId}`);
      fetchAll();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to accept application');
    }
  };

  const reject = async (applicationId: string) => {
    if (!confirm('Reject this application?')) return;
    try {
      await axios.patch(`http://localhost:3000/company/applications/${applicationId}/reject?companyId=${companyId}`);
      fetchAll();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to reject application');
    }
  };

  const submitRating = async () => {
    setRatingMsg('');
    if (rating < 1 || rating > 5) { setRatingMsg('Select a rating between 1 and 5'); return; }
    try {
      await axios.post(`http://localhost:3000/company/jobs/${jobId}/rate?companyId=${companyId}`, { rating, comment: ratingComment });
      setRatingMsg('Rating submitted successfully');
      setRating(0); setRatingComment('');
    } catch (err: any) {
      setRatingMsg(err.response?.data?.message || 'Failed to submit rating');
    }
  };

  if (loading) return <div className="text-gray-500 font-bold uppercase tracking-widest text-center mt-12">Loading job…</div>;
  if (!job) return <div className="text-gray-500 font-bold uppercase tracking-widest text-center mt-12">Job not found</div>;

  const canRate = job.status === 'approved' || job.status === 'paid' || job.status === 'submitted';

  return (
    <div className="space-y-10">
      <Link href="/company/jobs" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-black hover:text-brand-red">
        <ArrowLeftIcon className="h-4 w-4" /> BACK TO JOBS
      </Link>

      {/* Job summary */}
      <div className="bg-white border-2 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-3xl font-black text-brand-black uppercase tracking-tight">{job.title}</h2>
          <StatusBadge status={job.status} />
        </div>
        <p className="text-sm text-gray-700 mb-6 whitespace-pre-wrap">{job.description}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t-2 border-gray-200">
          <div><p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Budget</p><p className="text-lg font-black text-green-700">${Number(job.budget).toFixed(2)}</p></div>
          <div><p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Category</p><p className="text-lg font-black text-brand-red">{job.category?.categoryName || '—'}</p></div>
          <div><p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Deadline</p><p className="text-lg font-black text-brand-black">{new Date(job.deadline).toLocaleDateString()}</p></div>
          <div><p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Applicants</p><p className="text-lg font-black text-brand-black">{apps.length}</p></div>
        </div>
      </div>

      {/* Rate employee (only when work approved/done) */}
      {canRate && (
        <div className="bg-white border-2 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
          <h3 className="text-xl font-black text-brand-black uppercase tracking-widest mb-4">RATE THE EMPLOYEE</h3>
          {ratingMsg && <div className="mb-4 p-3 text-xs font-bold uppercase tracking-widest border-2 border-brand-black bg-gray-50">{ratingMsg}</div>}
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setRating(n)} className={`p-2 border-2 ${rating >= n ? 'border-brand-red text-brand-red' : 'border-gray-300 text-gray-300'} hover:border-brand-red`}>
                <StarIcon className="w-6 h-6" />
              </button>
            ))}
          </div>
          <textarea rows={3} value={ratingComment} onChange={(e) => setRatingComment(e.target.value)} placeholder="Optional comment" className="block w-full rounded-none p-3 border-2 border-brand-black focus:border-brand-red focus:outline-none bg-white text-sm font-bold text-brand-black mb-4" />
          <button onClick={submitRating} className="bg-brand-black text-white hover:bg-brand-red px-6 py-3 transition-colors text-xs font-black tracking-widest uppercase cursor-pointer">SUBMIT RATING</button>
        </div>
      )}

      {/* Applicants */}
      <div>
        <h3 className="text-2xl font-black text-brand-black uppercase tracking-widest border-b-4 border-brand-black pb-4 mb-6">APPLICANTS</h3>
        {apps.length === 0 ? (
          <div className="bg-white border-2 border-brand-black p-10 text-center shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
            <p className="text-brand-red font-bold uppercase tracking-widest">No applications yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {apps.map((a) => (
              <div key={a.applicationId} className="bg-white border-2 border-brand-black p-6 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-black text-brand-black uppercase tracking-wide">{a.employee?.user?.fullName || 'Applicant'}</h4>
                      <StatusBadge status={a.status} />
                    </div>
                    {a.coverLetter && <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{a.coverLetter}</p>}
                    {a.employee?.skills && <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-3">Skills: <span className="text-brand-black">{a.employee.skills}</span></p>}
                    {a.employee?.portfolio && <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-1">Portfolio: <a href={a.employee.portfolio} target="_blank" className="text-brand-red">{a.employee.portfolio}</a></p>}
                  </div>
                  {a.status === 'pending' && (
                    <div className="flex gap-3">
                      <button onClick={() => accept(a.applicationId)} className="bg-brand-black text-white hover:bg-green-700 px-5 py-3 transition-colors font-bold text-xs tracking-widest uppercase flex items-center cursor-pointer">
                        <CheckIcon className="w-5 h-5 mr-1" /> ACCEPT
                      </button>
                      <button onClick={() => reject(a.applicationId)} className="bg-white text-brand-black border-2 border-brand-black hover:bg-brand-red hover:text-white hover:border-brand-red px-5 py-3 transition-colors font-bold text-xs tracking-widest uppercase flex items-center cursor-pointer">
                        <XMarkIcon className="w-5 h-5 mr-1" /> REJECT
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
