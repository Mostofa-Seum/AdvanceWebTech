'use client'

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
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

  if (loading) return <div className="text-gray-500 text-center mt-12">Loading pending payments...</div>;

  if (payments.length === 0) return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center mt-8">
      <h2 className="text-2xl font-semibold text-gray-900">All Clear!</h2>
      <p className="text-gray-500 mt-2">There are no pending payments to process.</p>
    </div>
  );

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Pending Payments</h2>
      {payments.map((payment) => {
        const job = payment.job;
        const company = job?.company;
        const employeeName = payment.employeeUser?.fullName || 'Unknown Employee';
        
        return (
          <div key={payment.paymentId} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Job: {job?.title || 'Unknown Job'}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  <strong>Description:</strong> {job?.description || 'N/A'}
                </p>
                <div className="mt-2 text-sm text-gray-700 flex flex-wrap gap-x-6 gap-y-2">
                  <span><strong>Status:</strong> {job?.status}</span>
                  <span><strong>Budget:</strong> ${job?.budget}</span>
                  <span><strong>Company:</strong> {company?.companyName || 'Unknown Company'}</span>
                  <span><strong>Employee:</strong> {employeeName}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h4 className="font-semibold text-blue-900">Payment Details</h4>
                <p className="text-sm text-blue-800 mt-1">
                  <strong>Amount:</strong> ${payment.amount} <br />
                  <strong>Method:</strong> {payment.paymentMethod || 'N/A'}
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0">
                <button 
                  onClick={() => handleRelease(payment.paymentId)}
                  className="bg-blue-600 text-white hover:bg-blue-700 px-5 py-2.5 rounded-lg transition-colors font-medium text-sm shadow-sm flex items-center"
                >
                  <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                  Transfer to Employee
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
