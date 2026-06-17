'use client'

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
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

  async function fetchReports() {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/reviewer/reports/pending');
      setReports(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

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

  if (loading) return <div className="text-gray-500 text-center mt-12">Loading pending reports...</div>;

  if (reports.length === 0) return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center mt-8">
      <h2 className="text-2xl font-semibold text-gray-900">All Caught Up!</h2>
      <p className="text-gray-500 mt-2">There are no pending reports waiting for review.</p>
    </div>
  );

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Pending Reports</h2>
      {reports.map((report) => (
        <div
          key={report.reportId}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between md:items-center gap-4"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Reported Against</span>
              <span className="text-sm font-bold text-gray-900">
                {report.reportedAgainst?.fullName || 'Unknown User'}
              </span>
            </div>

            <p className="text-sm text-gray-700 mt-2">
              <strong className="text-gray-900">Reason:</strong> {report.reason}
            </p>

            {report.details && (
              <p className="text-sm text-gray-600 mt-1">
                <strong className="text-gray-900">Details:</strong> {report.details}
              </p>
            )}

            {report.job && (
              <p className="text-sm text-gray-500 mt-1">
                <strong className="text-gray-900">Job:</strong> {report.job.title || report.job.jobId}
              </p>
            )}

            <p className="text-xs text-gray-400 mt-2">
              Submitted: {new Date(report.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex space-x-3 shrink-0">
            <button
              onClick={() => handleUpdateStatus(report.reportId, 'resolved')}
              className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 rounded-lg transition-colors font-medium text-sm flex items-center"
            >
              <CheckCircleIcon className="w-5 h-5 mr-1" />
              Resolved
            </button>
            <button
              onClick={() => handleUpdateStatus(report.reportId, 'rejected')}
              className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg transition-colors font-medium text-sm flex items-center"
            >
              <XCircleIcon className="w-5 h-5 mr-1" />
              Rejected
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
