'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function PaymentsModule() {
  const [payments, setPayments] = useState<any[]>([]);
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
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/reviewer/payments/pending');
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRelease = async (paymentId: string) => {
    if (!sessionUser?.reviewer?.reviewerId) {
      alert('Reviewer session not found. Please log in again.');
      return;
    }
    
    // Optimistically update UI
    setPayments(prev => prev.filter(p => p.paymentId !== paymentId));
    
    try {
      await axios.patch(`http://localhost:3000/reviewer/payments/${paymentId}/release`);
      alert('Payment released successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to release payment');
      fetchPayments(); // Revert on failure
    }
  };

  if (loading) return <div className="text-gray-500 font-bold uppercase tracking-widest text-center mt-12">Loading pending payments...</div>;

  if (payments.length === 0) return (
    <div className="bg-white border-2 border-brand-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
      <h2 className="text-4xl font-black text-brand-black uppercase tracking-widest">ALL CLEAR</h2>
      <p className="text-brand-red font-bold uppercase tracking-widest mt-4">There are no pending payments to process.</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black text-brand-black uppercase tracking-widest border-b-4 border-brand-black pb-4">PENDING PAYMENTS</h2>
      <div className="space-y-6">
        {payments.map((payment) => {
          const job = payment.job;
          const company = job?.company;
          const employeeName = payment.employeeUser?.fullName || 'Unknown Employee';
          
          return (
            <div key={payment.paymentId} className="bg-white p-8 border-2 border-brand-black shadow-[8px_8px_0px_0px_rgba(43,43,43,1)] flex flex-col gap-6">
              <div className="flex justify-between items-start border-b-2 border-gray-200 pb-4">
                <div>
                  <h3 className="text-2xl font-black text-brand-black uppercase tracking-widest">JOB: {job?.title || 'Unknown Job'}</h3>
                  <p className="text-sm font-medium text-gray-700 mt-2 line-clamp-2">
                    <span className="font-bold uppercase tracking-widest text-brand-black mr-2">DESCRIPTION:</span> {job?.description || 'N/A'}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-x-8 gap-y-4">
                    <span className="text-xs font-bold uppercase tracking-widest"><span className="text-brand-black mr-1">STATUS:</span> <span className="text-brand-red">{job?.status}</span></span>
                    <span className="text-xs font-bold uppercase tracking-widest"><span className="text-brand-black mr-1">BUDGET:</span> <span className="text-green-700">${job?.budget}</span></span>
                    <span className="text-xs font-bold uppercase tracking-widest"><span className="text-brand-black mr-1">COMPANY:</span> {company?.companyName || 'Unknown Company'}</span>
                    <span className="text-xs font-bold uppercase tracking-widest"><span className="text-brand-black mr-1">EMPLOYEE:</span> {employeeName}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 border-2 border-brand-black p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h4 className="font-black text-brand-black uppercase tracking-widest mb-2">PAYMENT DETAILS</h4>
                  <p className="text-sm">
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-black mr-2">AMOUNT:</span> <span className="font-black text-lg">${payment.amount}</span> <br />
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-black mr-2 mt-2 inline-block">METHOD:</span> {payment.paymentMethod || 'N/A'}
                  </p>
                </div>
                
                <div className="mt-6 sm:mt-0 w-full sm:w-auto">
                  <button 
                    onClick={() => handleRelease(payment.paymentId)}
                    className="w-full sm:w-auto bg-brand-black text-white hover:bg-brand-red px-8 py-4 transition-colors font-bold text-xs uppercase tracking-widest flex items-center justify-center cursor-pointer"
                  >
                    <CurrencyDollarIcon className="w-5 h-5 mr-3" />
                    TRANSFER TO EMPLOYEE
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
