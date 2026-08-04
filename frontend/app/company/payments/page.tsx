'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import StatusBadge from '@/app/components/StatusBadge';

export default function CompanyPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setCompanyId(JSON.parse(stored)?.company?.companyId || ''); } catch {}
    }
  }, []);

  useEffect(() => {
    if (!companyId) return;
    fetchPayments();
  }, [companyId]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/company/payments?companyId=${companyId}`);
      setPayments(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const release = async (paymentId: string) => {
    if (!confirm('Release this escrow payment for final settlement?')) return;
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/company/payments/${paymentId}/release?companyId=${companyId}`);
      fetchPayments();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to release payment');
    }
  };

  if (loading) return <div className="text-gray-500 font-bold uppercase tracking-widest text-center mt-12">Loading payments…</div>;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black text-brand-black uppercase tracking-widest border-b-4 border-brand-black pb-4">ESCROW PAYMENTS</h2>

      {payments.length === 0 ? (
        <div className="bg-white border-2 border-brand-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
          <h2 className="text-4xl font-black text-brand-black uppercase tracking-widest">NO PAYMENTS</h2>
          <p className="text-brand-red font-bold uppercase tracking-widest mt-4">Payments appear here once you accept an application.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {payments.map((p) => (
            <div key={p.paymentId} className="bg-white border-2 border-brand-black p-6 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-brand-black uppercase tracking-wide">{p.job?.title || 'Job'}</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-1">Employee: <span className="text-brand-black">{p.employeeUser?.fullName || 'N/A'}</span></p>
                  <div className="mt-3 flex flex-wrap gap-6 items-center">
                    <span className="text-2xl font-black text-green-700">${Number(p.amount).toFixed(2)}</span>
                    <StatusBadge status={p.paymentStatus} />
                  </div>
                </div>
                <div className="flex items-center">
                  {p.paymentStatus === 'held' && (
                    <button onClick={() => release(p.paymentId)} className="bg-brand-black text-white hover:bg-brand-red px-6 py-4 transition-colors font-bold text-xs tracking-widest uppercase flex items-center cursor-pointer">
                      <CurrencyDollarIcon className="w-5 h-5 mr-2" /> RELEASE ESCROW
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
