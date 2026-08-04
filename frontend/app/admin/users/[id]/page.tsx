'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import UserActions from '@/app/admin/users/[id]/UserActions';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          setError('Unauthorized. Please log in again.');
        } else {
          setError(err.response?.data?.message || 'User not found');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-brand-black">
        <p className="text-xl font-black uppercase tracking-widest animate-pulse">LOADING USER DATA...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <Link href="/admin/dashboard" className="text-brand-black hover:text-brand-red text-sm font-black uppercase tracking-widest mb-6 inline-flex items-center border-2 border-transparent hover:border-brand-red pb-1 transition-colors">
          ← BACK TO DASHBOARD
        </Link>
        <div className="bg-white border-2 border-brand-red text-brand-red p-8 shadow-[8px_8px_0px_0px_rgba(228,22,19,1)]">
          <p className="text-2xl font-black uppercase tracking-widest">{error || 'USER NOT FOUND'}</p>
        </div>
      </div>
    );
  }

  const statusColor =
    user.status === 'active' ? 'bg-green-100 text-green-800 border-2 border-brand-black' :
    user.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-2 border-brand-black' :
    user.status === 'suspended' || user.status === 'rejected' ? 'bg-white text-brand-red border-2 border-brand-red' :
    'bg-gray-100 text-gray-800 border-2 border-brand-black';

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      {/* Breadcrumb */}
      <Link href="/admin/dashboard" className="text-brand-black hover:text-brand-red text-sm font-black uppercase tracking-widest inline-flex items-center gap-1 border-2 border-transparent hover:border-brand-red pb-1 transition-colors">
        ← BACK TO DASHBOARD
      </Link>

      {/* User Info Card */}
      <div className="bg-white border-2 border-brand-black shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
        <div className="bg-white border-b-4 border-brand-black p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-brand-black uppercase tracking-widest">{user.fullName}</h1>
              <p className="text-sm font-bold text-gray-500 mt-2 uppercase tracking-widest">ID: {user.userId}</p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <span className="px-4 py-2 bg-white text-brand-black border-2 border-brand-black text-xs font-black uppercase tracking-widest">
                {user.role}
              </span>
              <span className={`px-4 py-2 text-xs font-black uppercase tracking-widest ${statusColor}`}>
                {user.status}
              </span>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white">
          <div className="border-2 border-brand-black p-4">
            <p className="text-xs font-black text-brand-black uppercase tracking-widest mb-2 border-b-2 border-brand-black pb-2">EMAIL ADDRESS</p>
            <p className="text-sm font-bold text-brand-black">{user.email}</p>
          </div>
          <div className="border-2 border-brand-black p-4">
            <p className="text-xs font-black text-brand-black uppercase tracking-widest mb-2 border-b-2 border-brand-black pb-2">PHONE NUMBER</p>
            <p className="text-sm font-bold text-brand-black">{user.phone || 'NOT PROVIDED'}</p>
          </div>
          <div className="border-2 border-brand-black p-4">
            <p className="text-xs font-black text-brand-black uppercase tracking-widest mb-2 border-b-2 border-brand-black pb-2">ADDRESS</p>
            <p className="text-sm font-bold text-brand-black">{user.address || 'NOT PROVIDED'}</p>
          </div>
          <div className="border-2 border-brand-black p-4">
            <p className="text-xs font-black text-brand-black uppercase tracking-widest mb-2 border-b-2 border-brand-black pb-2">ACCOUNT CREATED</p>
            <p className="text-sm font-bold text-brand-black uppercase">
              {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="border-2 border-brand-black p-4">
            <p className="text-xs font-black text-brand-black uppercase tracking-widest mb-2 border-b-2 border-brand-black pb-2">EMAIL VERIFIED</p>
            <p className="text-sm font-bold text-brand-black">{user.isEmailVerified ? 'YES' : 'NO'}</p>
          </div>
          <div className="border-2 border-brand-black p-4">
            <p className="text-xs font-black text-brand-black uppercase tracking-widest mb-2 border-b-2 border-brand-black pb-2">PHONE VERIFIED</p>
            <p className="text-sm font-bold text-brand-black">{user.isPhoneVerified ? 'YES' : 'NO'}</p>
          </div>
        </div>

        {/* Linked Profiles */}
        {(user.employee || user.reviewer || user.company) && (
          <div className="border-t-4 border-brand-black p-8 bg-gray-50">
            <h2 className="text-2xl font-black text-brand-black uppercase tracking-widest mb-6">LINKED PROFILES</h2>
            <div className="space-y-4">
              {user.employee && (
                <div className="border-2 border-brand-black bg-white p-4">
                  <p className="text-brand-black font-bold uppercase tracking-widest text-sm">
                    <span className="font-black mr-2">EMPLOYEE ID:</span> {user.employee.employeeId} <br className="md:hidden" />
                    <span className="md:mx-2 text-brand-red">|</span>
                    <span className="font-black mr-2">BALANCE:</span> ${user.employee.balance || 0}
                  </p>
                </div>
              )}
              {user.reviewer && (
                <div className="border-2 border-brand-black bg-white p-4">
                  <p className="text-brand-black font-bold uppercase tracking-widest text-sm">
                    <span className="font-black mr-2">REVIEWER ID:</span> {user.reviewer.reviewerId} <br className="md:hidden" />
                    <span className="md:mx-2 text-brand-red">|</span>
                    <span className="font-black mr-2">TRUST SCORE:</span> {user.reviewer.trustScore || 0}
                  </p>
                </div>
              )}
              {user.company && (
                <div className="border-2 border-brand-black bg-white p-4">
                  <p className="text-brand-black font-bold uppercase tracking-widest text-sm">
                    <span className="font-black mr-2">COMPANY:</span> {user.company.companyName} <br className="md:hidden" />
                    <span className="md:mx-2 text-brand-red">|</span>
                    <span className="font-black mr-2">STATUS:</span> {user.company.status}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Interactive actions */}
      <UserActions
        userId={user.userId}
        currentStatus={user.status}
        currentRole={user.role}
        employeeId={user.employee?.employeeId}
        reviewerId={user.reviewer?.reviewerId}
      />
    </div>
  );
}
