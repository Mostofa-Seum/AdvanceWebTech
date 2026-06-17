'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from '@/lib/axios';
import {
  CheckBadgeIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

export default function VerifyCompanyModule() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
    fetchCompanies();
  }, []);

  async function fetchCompanies() {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/reviewer/companies/pending');
      setCompanies(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (companyId: string, status: string) => {
    if (!sessionUser?.reviewer?.reviewerId) {
      alert('Reviewer session not found. Please log in again.');
      return;
    }
    
    // Optimistically update UI
    setCompanies(prev => prev.filter(c => c.companyId !== companyId));
    
    try {
      await axios.patch(`http://localhost:3000/reviewer/companies/${companyId}/status`, {
        status,
        reviewerId: sessionUser.reviewer.reviewerId
      });
    } catch (err) {
      console.error(err);
      alert('Failed to update company status');
      fetchCompanies(); // Revert on failure
    }
  };

  if (loading) return <div className="text-gray-500 text-center mt-12">Loading pending companies...</div>;

  if (companies.length === 0) return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center mt-8">
      <h2 className="text-2xl font-semibold text-gray-900">All Caught Up!</h2>
      <p className="text-gray-500 mt-2">There are no pending companies waiting for verification.</p>
    </div>
  );

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Pending Company Verifications</h2>
      {companies.map((company) => (
        <div key={company.companyId} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{company.companyName}</h3>
            {company.website && (
               <p className="text-sm text-blue-600 mt-1 hover:underline">
                 <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer">
                   {company.website}
                 </a>
               </p>
            )}
            <p className="text-sm text-gray-600 mt-2 line-clamp-3">
               <strong>Description:</strong> {company.description || 'No description provided.'}
            </p>
          </div>
          <div className="flex space-x-3 shrink-0">
            <Link
              href={`/reviewer_dashboard/verify_company/${company.companyId}`}
              className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-lg transition-colors font-medium text-sm flex items-center"
            >
              <EyeIcon className="w-5 h-5 mr-1" />
              View Details
            </Link>
            <button 
              onClick={() => handleUpdateStatus(company.companyId, 'active')}
              className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 rounded-lg transition-colors font-medium text-sm flex items-center"
            >
              <CheckBadgeIcon className="w-5 h-5 mr-1" />
              Accept
            </button>
            <button 
              onClick={() => handleUpdateStatus(company.companyId, 'rejected')}
              className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg transition-colors font-medium text-sm flex items-center"
            >
              <TrashIcon className="w-5 h-5 mr-1" />
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
