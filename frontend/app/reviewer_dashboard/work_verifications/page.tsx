'use client'

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import {
  CheckBadgeIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

export default function WorkVerificationsModule() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [revisionInputs, setRevisionInputs] = useState<Record<string, string>>({});
  const [showRevisionFor, setShowRevisionFor] = useState<string | null>(null);
  const [sessionUser, setSessionUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setSessionUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage");
      }
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function fetchSubmissions() {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/reviewer/work/pending');
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleReview = async (submissionId: string, status: string, comments?: string) => {
    if (!sessionUser?.reviewer?.reviewerId) {
      alert('Reviewer session not found. Please log in again.');
      return;
    }
    
    // Optimistically update UI
    setSubmissions(prev => prev.filter(s => s.submissionId !== submissionId));
    
    try {
      await axios.post(`http://localhost:3000/reviewer/work/${submissionId}/review`, {
        status,
        comments: comments || undefined,
        reviewerId: sessionUser.reviewer.reviewerId
      });
      if (showRevisionFor === submissionId) {
        setShowRevisionFor(null);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update submission status');
      fetchSubmissions(); // Revert on failure
    }
  };

  if (loading) return <div className="text-gray-500 text-center mt-12">Loading pending submissions...</div>;

  if (submissions.length === 0) return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center mt-8">
      <h2 className="text-2xl font-semibold text-gray-900">All Caught Up!</h2>
      <p className="text-gray-500 mt-2">There are no pending work submissions waiting for verification.</p>
    </div>
  );

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Pending Work Verifications</h2>
      {submissions.map((sub) => {
        const job = sub.assignedJob?.job;
        return (
          <div key={sub.submissionId} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Job: {job?.title || 'Unknown Job'}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                <strong>Description:</strong> {job?.description || 'N/A'}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-2">Submission Details</h4>
              <p className="text-sm text-gray-700">
                 <strong>Text:</strong> {sub.submissionText || 'No text provided.'}
              </p>
              {sub.fileUrl && (
                 <p className="text-sm text-blue-600 mt-1 hover:underline truncate">
                   <strong>File:</strong> <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer">{sub.fileUrl}</a>
                 </p>
              )}
              {sub.liveLink && (
                 <p className="text-sm text-blue-600 mt-1 hover:underline truncate">
                   <strong>Live Link:</strong> <a href={sub.liveLink.startsWith('http') ? sub.liveLink : `https://${sub.liveLink}`} target="_blank" rel="noopener noreferrer">{sub.liveLink}</a>
                 </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-2 sm:items-center sm:justify-end">
              {showRevisionFor === sub.submissionId ? (
                <div className="flex-1 flex gap-2 w-full">
                  <input 
                    type="text" 
                    placeholder="Enter revision instructions..." 
                    className="flex-1 rounded-lg border border-gray-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    value={revisionInputs[sub.submissionId] || ''}
                    onChange={(e) => setRevisionInputs({...revisionInputs, [sub.submissionId]: e.target.value})}
                  />
                  <button 
                    onClick={() => handleReview(sub.submissionId, 'revision_requested', revisionInputs[sub.submissionId])}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    disabled={!revisionInputs[sub.submissionId]}
                  >
                    Send
                  </button>
                  <button 
                    onClick={() => setShowRevisionFor(null)}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleReview(sub.submissionId, 'approved')}
                    className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 rounded-lg transition-colors font-medium text-sm flex items-center justify-center flex-1 sm:flex-none"
                  >
                    <CheckBadgeIcon className="w-5 h-5 mr-1" />
                    Accept
                  </button>
                  <button 
                    onClick={() => handleReview(sub.submissionId, 'rejected')}
                    className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg transition-colors font-medium text-sm flex items-center justify-center flex-1 sm:flex-none"
                  >
                    <TrashIcon className="w-5 h-5 mr-1" />
                    Reject
                  </button>
                  <button 
                    onClick={() => setShowRevisionFor(sub.submissionId)}
                    className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-4 py-2 rounded-lg transition-colors font-medium text-sm flex items-center justify-center flex-1 sm:flex-none"
                  >
                    <PencilIcon className="w-5 h-5 mr-1" />
                    Revision
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
