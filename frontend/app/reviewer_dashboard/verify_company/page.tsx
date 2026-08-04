'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CheckBadgeIcon,
  TrashIcon
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

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/reviewer/companies/pending`);
      setCompanies(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (companyId: string, status: string) => {
    if (!sessionUser?.reviewer?.reviewerId) {
      alert('Reviewer session not found. Please log in again.');
      return;
    }
    
    // Optimistically update UI
    setCompanies(prev => prev.filter(c => c.companyId !== companyId));
    
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/reviewer/companies/${companyId}/status`, {
        status,
        reviewerId: sessionUser.reviewer.reviewerId
      });
    } catch (err) {
      console.error(err);
      alert('Failed to update company status');
      fetchCompanies(); // Revert on failure
    }
  };

  if (loading) return <div className="text-gray-500 font-bold uppercase tracking-widest text-center mt-12">Loading pending companies...</div>;

  if (companies.length === 0) return (
    <div className="bg-white border-2 border-brand-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
      <h2 className="text-4xl font-black text-brand-black uppercase tracking-widest">ALL CAUGHT UP</h2>
      <p className="text-brand-red font-bold uppercase tracking-widest mt-4">There are no pending companies waiting for verification.</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black text-brand-black uppercase tracking-widest border-b-4 border-brand-black pb-4">PENDING COMPANY VERIFICATIONS</h2>
      <div className="space-y-6">
        {companies.map((company) => (
          <div key={company.companyId} className="bg-white p-8 border-2 border-brand-black shadow-[8px_8px_0px_0px_rgba(43,43,43,1)] flex flex-col md:flex-row justify-between md:items-start gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-black text-brand-black uppercase tracking-widest mb-4">{company.companyName}</h3>
              {company.website && (
                 <p className="text-xs font-bold uppercase tracking-widest mt-2 hover:text-brand-red text-gray-500 transition-colors">
                   <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer">
                     {company.website}
                   </a>
                 </p>
              )}
              <p className="text-sm font-medium text-gray-700 mt-6 p-4 bg-gray-50 border-l-4 border-brand-black line-clamp-3">
                 <strong className="text-brand-black uppercase tracking-widest text-xs block mb-1">DESCRIPTION:</strong> {company.description || 'No description provided.'}
              </p>
            </div>
            <div className="flex flex-col space-y-4 shrink-0 w-full md:w-48 mt-6 md:mt-0">
              <button 
                onClick={() => handleUpdateStatus(company.companyId, 'active')}
                className="w-full bg-brand-black text-white hover:bg-green-700 px-6 py-4 transition-colors font-bold text-xs tracking-widest uppercase flex items-center justify-center cursor-pointer"
              >
                <CheckBadgeIcon className="w-5 h-5 mr-2" />
                ACCEPT
              </button>
              <button 
                onClick={() => handleUpdateStatus(company.companyId, 'rejected')}
                className="w-full bg-white text-brand-black border-2 border-brand-black hover:bg-brand-red hover:text-white hover:border-brand-red px-6 py-4 transition-colors font-bold text-xs tracking-widest uppercase flex items-center justify-center cursor-pointer"
              >
                <TrashIcon className="w-5 h-5 mr-2" />
                REJECT
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
