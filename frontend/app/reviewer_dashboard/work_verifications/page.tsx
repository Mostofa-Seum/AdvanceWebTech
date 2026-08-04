'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
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

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/reviewer/work/pending`);
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (submissionId: string, status: string, comments?: string) => {
    if (!sessionUser?.reviewer?.reviewerId) {
      alert('Reviewer session not found. Please log in again.');
      return;
    }
    
    // Optimistically update UI
    setSubmissions(prev => prev.filter(s => s.submissionId !== submissionId));
    
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/reviewer/work/${submissionId}/review`, {
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

  if (loading) return <div className="text-gray-500 font-bold uppercase tracking-widest text-center mt-12">Loading pending submissions...</div>;

  if (submissions.length === 0) return (
    <div className="bg-white border-2 border-brand-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
      <h2 className="text-4xl font-black text-brand-black uppercase tracking-widest">ALL CAUGHT UP</h2>
      <p className="text-brand-red font-bold uppercase tracking-widest mt-4">There are no pending work submissions waiting for verification.</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black text-brand-black uppercase tracking-widest border-b-4 border-brand-black pb-4">PENDING WORK VERIFICATIONS</h2>
      <div className="space-y-6">
        {submissions.map((sub) => {
          const job = sub.assignedJob?.job;
          return (
            <div key={sub.submissionId} className="bg-white p-8 border-2 border-brand-black shadow-[8px_8px_0px_0px_rgba(43,43,43,1)] flex flex-col gap-6">
              <div className="border-b-2 border-gray-200 pb-4">
                <h3 className="text-2xl font-black text-brand-black uppercase tracking-widest">JOB: {job?.title || 'Unknown Job'}</h3>
                <p className="text-sm font-medium text-gray-700 mt-2 line-clamp-2">
                  <span className="font-bold uppercase tracking-widest text-brand-black mr-2">DESCRIPTION:</span> {job?.description || 'N/A'}
                </p>
              </div>
              
              <div className="bg-gray-50 border-2 border-brand-black p-6">
                <h4 className="font-black text-brand-black uppercase tracking-widest mb-4">SUBMISSION DETAILS</h4>
                <div className="space-y-4">
                  <p className="text-sm font-medium text-gray-700 p-4 border-l-4 border-brand-black bg-white">
                     <span className="text-xs font-bold uppercase tracking-widest text-brand-black block mb-2">TEXT:</span> {sub.submissionText || 'No text provided.'}
                  </p>
                  {sub.fileUrl && (
                     <p className="text-xs font-bold uppercase tracking-widest text-brand-black p-4 border-l-4 border-gray-300 bg-white">
                       <span className="mr-2">FILE:</span> <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-red truncate block mt-1">{sub.fileUrl}</a>
                     </p>
                  )}
                  {sub.liveLink && (
                     <p className="text-xs font-bold uppercase tracking-widest text-brand-black p-4 border-l-4 border-gray-300 bg-white">
                       <span className="mr-2">LIVE LINK:</span> <a href={sub.liveLink.startsWith('http') ? sub.liveLink : `https://${sub.liveLink}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-red truncate block mt-1">{sub.liveLink}</a>
                     </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:items-center sm:justify-end">
                {showRevisionFor === sub.submissionId ? (
                  <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full">
                    <input 
                      type="text" 
                      placeholder="ENTER REVISION INSTRUCTIONS..." 
                      className="flex-1 rounded-none border-2 border-brand-black p-3 text-xs font-bold tracking-widest uppercase focus:outline-none focus:border-brand-red"
                      value={revisionInputs[sub.submissionId] || ''}
                      onChange={(e) => setRevisionInputs({...revisionInputs, [sub.submissionId]: e.target.value})}
                    />
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleReview(sub.submissionId, 'revision_requested', revisionInputs[sub.submissionId])}
                        className="bg-brand-black text-white px-8 py-3 rounded-none text-xs font-bold tracking-widest uppercase hover:bg-brand-red transition-colors disabled:opacity-50 cursor-pointer"
                        disabled={!revisionInputs[sub.submissionId]}
                      >
                        SEND
                      </button>
                      <button 
                        onClick={() => setShowRevisionFor(null)}
                        className="bg-white text-brand-black border-2 border-brand-black px-8 py-3 rounded-none text-xs font-bold tracking-widest uppercase hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <button 
                      onClick={() => handleReview(sub.submissionId, 'approved')}
                      className="bg-brand-black text-white hover:bg-green-700 px-6 py-4 rounded-none transition-colors font-bold text-xs uppercase tracking-widest flex items-center justify-center flex-1 sm:flex-none cursor-pointer"
                    >
                      <CheckBadgeIcon className="w-5 h-5 mr-2" />
                      ACCEPT
                    </button>
                    <button 
                      onClick={() => handleReview(sub.submissionId, 'rejected')}
                      className="bg-white text-brand-black border-2 border-brand-black hover:bg-brand-red hover:text-white hover:border-brand-red px-6 py-4 rounded-none transition-colors font-bold text-xs uppercase tracking-widest flex items-center justify-center flex-1 sm:flex-none cursor-pointer"
                    >
                      <TrashIcon className="w-5 h-5 mr-2" />
                      REJECT
                    </button>
                    <button 
                      onClick={() => setShowRevisionFor(sub.submissionId)}
                      className="bg-gray-200 text-brand-black border-2 border-brand-black hover:bg-gray-300 px-6 py-4 rounded-none transition-colors font-bold text-xs uppercase tracking-widest flex items-center justify-center flex-1 sm:flex-none cursor-pointer"
                    >
                      <PencilIcon className="w-5 h-5 mr-2" />
                      REVISION
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
