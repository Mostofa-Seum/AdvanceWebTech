'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import StatusBadge from '@/app/components/StatusBadge';

export default function EmployeeEarningsPage() {
  const [data, setData] = useState<{ balance: number; payments: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [employeeId, setEmployeeId] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setEmployeeId(JSON.parse(stored)?.employee?.employeeId || ''); } catch {}
    }
  }, []);

  useEffect(() => {
    if (!employeeId) return;
    fetchEarnings();
  }, [employeeId]);

  const fetchEarnings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/employee/payments?employeeId=${employeeId}`);
      setData(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  if (loading) return <div className="text-gray-500 font-bold uppercase tracking-widest text-center mt-12">Loading earnings…</div>;

  const totalReleased = (data?.payments || [])
    .filter((p) => p.paymentStatus === 'released')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const pendingAmount = (data?.payments || [])
    .filter((p) => p.paymentStatus === 'held' || p.paymentStatus === 'pending')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black text-brand-black uppercase tracking-widest border-b-4 border-brand-black pb-4">MY EARNINGS</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-brand-black p-6 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Available Balance</p>
          <p className="text-4xl font-black text-green-700 mt-2">${Number(data?.balance || 0).toFixed(2)}</p>
        </div>
        <div className="bg-white border-2 border-brand-black p-6 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Total Earned</p>
          <p className="text-4xl font-black text-brand-black mt-2">${totalReleased.toFixed(2)}</p>
        </div>
        <div className="bg-white border-2 border-brand-black p-6 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Pending Payout</p>
          <p className="text-4xl font-black text-brand-red mt-2">${pendingAmount.toFixed(2)}</p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-black text-brand-black uppercase tracking-widest border-b-4 border-brand-black pb-4 mb-4">PAYMENT HISTORY</h3>
        {(!data?.payments || data.payments.length === 0) ? (
          <div className="bg-white border-2 border-brand-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
            <p className="text-brand-red font-bold uppercase tracking-widest">No payments yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border-2 border-brand-black">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-black text-white text-xs font-black uppercase tracking-widest border-b-4 border-brand-black">
                  <th className="p-4">JOB</th>
                  <th className="p-4">FROM</th>
                  <th className="p-4">AMOUNT</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4">DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-brand-black bg-white">
                {data.payments.map((p, idx) => (
                  <tr key={p.paymentId || idx} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm font-bold text-brand-black">{p.job?.title || '—'}</td>
                    <td className="p-4 text-sm">{p.companyUser?.fullName || '—'}</td>
                    <td className="p-4 text-sm font-black text-green-700">${Number(p.amount).toFixed(2)}</td>
                    <td className="p-4"><StatusBadge status={p.paymentStatus} /></td>
                    <td className="p-4 text-xs uppercase tracking-widest text-gray-500">{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
