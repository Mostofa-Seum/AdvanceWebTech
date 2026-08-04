'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function EmployeeNotificationsPage() {
  const [items, setItems] = useState<any[]>([]);
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
    fetchNotifications();
  }, [employeeId]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/employee/notifications?employeeId=${employeeId}`);
      setItems(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const markAll = async () => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/employee/notifications/read-all?employeeId=${employeeId}`);
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  const markOne = async (id: string) => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/employee/notifications/${id}/read?employeeId=${employeeId}`);
      setItems((prev) => prev.map((n) => (n.notificationId === id ? { ...n, isRead: true } : n)));
    } catch {}
  };

  if (loading) return <div className="text-gray-500 font-bold uppercase tracking-widest text-center mt-12">Loading notifications…</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b-4 border-brand-black pb-4">
        <h2 className="text-3xl font-black text-brand-black uppercase tracking-widest">NOTIFICATIONS</h2>
        {items.some((n) => !n.isRead) && (
          <button onClick={markAll} className="bg-white text-brand-black border-2 border-brand-black hover:bg-gray-100 px-5 py-2 transition-colors text-xs font-black tracking-widest uppercase cursor-pointer">
            MARK ALL READ
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white border-2 border-brand-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
          <h2 className="text-2xl font-black text-brand-black uppercase tracking-widest">NO NOTIFICATIONS</h2>
          <p className="text-brand-red font-bold uppercase tracking-widest mt-3">You're all caught up.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((n) => (
            <div key={n.notificationId} onClick={() => !n.isRead && markOne(n.notificationId)} className={`bg-white border-2 border-brand-black p-6 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)] cursor-pointer ${n.isRead ? 'opacity-70' : 'hover:border-brand-red'}`}>
              <div className="flex items-start justify-between gap-3">
                <p className="text-base font-black uppercase tracking-wide text-brand-black">{n.title}</p>
                {!n.isRead && <span className="w-3 h-3 bg-brand-red flex-shrink-0 mt-1.5" />}
              </div>
              <p className="text-sm text-gray-700 mt-2">{n.message}</p>
              <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
