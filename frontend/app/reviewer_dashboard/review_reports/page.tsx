'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

export default function ReviewReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/reviewer/reports/pending');
      setReports(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (reportId: string, status: 'resolved' | 'rejected') => {
    // Optimistically remove from the list
    setReports(prev => prev.filter(r => r.reportId !== reportId));

    try {
      await axios.patch(`http://localhost:3000/reviewer/reports/${reportId}/status`, { status });
    } catch (err) {
      console.error(err);
      alert('Failed to update report status');
      fetchReports(); // Revert on failure
    }
  };

  if (loading) return <div className="text-gray-500 font-bold uppercase tracking-widest text-center mt-12">Loading pending reports...</div>;

  if (reports.length === 0) return (
    <div className="bg-white border-2 border-brand-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
      <h2 className="text-4xl font-black text-brand-black uppercase tracking-widest">ALL CAUGHT UP</h2>
      <p className="text-brand-red font-bold uppercase tracking-widest mt-4">There are no pending reports waiting for review.</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black text-brand-black uppercase tracking-widest border-b-4 border-brand-black pb-4">PENDING REPORTS</h2>
      <div className="space-y-6">
        {reports.map((report) => (
          <div
            key={report.reportId}
            className="bg-white p-8 border-2 border-brand-black shadow-[8px_8px_0px_0px_rgba(43,43,43,1)] flex flex-col md:flex-row justify-between md:items-start gap-6"
          >
            <div className="flex-1">
              <div className="flex flex-col gap-2 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-red">REPORTED AGAINST</span>
                <span className="text-2xl font-black text-brand-black uppercase tracking-widest">
                  {report.reportedAgainst?.fullName || 'Unknown User'}
                </span>
              </div>

              <p className="text-sm font-medium text-gray-700 mt-4 p-4 bg-gray-50 border-l-4 border-brand-black">
                <strong className="text-brand-black uppercase tracking-widest text-xs block mb-1">REASON:</strong> {report.reason}
              </p>

              {report.details && (
                <p className="text-sm font-medium text-gray-600 mt-4 p-4 border-l-4 border-gray-300">
                  <strong className="text-brand-black uppercase tracking-widest text-xs block mb-1">DETAILS:</strong> {report.details}
                </p>
              )}

              {report.job && (
                <div className="mt-4 pt-4 border-t-2 border-gray-100">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    <strong className="text-brand-black mr-2">JOB:</strong> {report.job.title || report.job.jobId}
                  </p>
                </div>
              )}

              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-4">
                SUBMITTED: {new Date(report.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex flex-col space-y-4 shrink-0 w-full md:w-48 mt-6 md:mt-0">
              <button
                onClick={() => handleUpdateStatus(report.reportId, 'resolved')}
                className="w-full bg-brand-black text-white hover:bg-green-700 px-6 py-4 transition-colors font-bold text-xs tracking-widest uppercase flex items-center justify-center cursor-pointer"
              >
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                RESOLVED
              </button>
              <button
                onClick={() => handleUpdateStatus(report.reportId, 'rejected')}
                className="w-full bg-white text-brand-black border-2 border-brand-black hover:bg-brand-red hover:text-white hover:border-brand-red px-6 py-4 transition-colors font-bold text-xs tracking-widest uppercase flex items-center justify-center cursor-pointer"
              >
                <XCircleIcon className="w-5 h-5 mr-2" />
                REJECTED
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
