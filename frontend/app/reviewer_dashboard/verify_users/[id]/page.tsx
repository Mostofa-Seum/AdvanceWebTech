'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import {
  CheckBadgeIcon,
  TrashIcon,
  ArrowLeftIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  IdentificationIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setSessionUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse session user');
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://localhost:3000/reviewer/users/${userId}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleUpdateStatus = async (status: string, isEmailVerified: boolean, isPhoneVerified: boolean) => {
    if (!sessionUser?.reviewer?.reviewerId) {
      alert('Reviewer session not found. Please log in again.');
      return;
    }
    setActionLoading(true);
    try {
      await axios.patch(`http://localhost:3000/reviewer/users/${userId}/status`, {
        status,
        isEmailVerified,
        isPhoneVerified,
        reviewerId: sessionUser.reviewer.reviewerId,
      });
      router.push('/reviewer_dashboard/verify_users');
    } catch (err) {
      console.error(err);
      alert('Failed to update user status.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-24">
        <div className="text-gray-500 text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          Loading user details...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center mt-8">
        <h2 className="text-xl font-semibold text-gray-800">User not found</h2>
        <Link href="/reviewer_dashboard/verify_users" className="text-blue-600 hover:underline mt-4 inline-block text-sm">
          ← Back to list
        </Link>
      </div>
    );
  }

  const infoRows = [
    { icon: EnvelopeIcon, label: 'Email', value: user.email },
    { icon: PhoneIcon, label: 'Phone', value: user.phone || 'Not provided' },
    { icon: MapPinIcon, label: 'Address', value: user.address || 'Not provided' },
    { icon: IdentificationIcon, label: 'Role', value: user.role },
    { icon: CheckBadgeIcon, label: 'Status', value: user.status },
    { icon: CheckBadgeIcon, label: 'Email Verified', value: user.isEmailVerified ? 'Yes' : 'No' },
    { icon: CheckBadgeIcon, label: 'Phone Verified', value: user.isPhoneVerified ? 'Yes' : 'No' },
    { icon: CalendarIcon, label: 'Registered', value: new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
  ];

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-6">

      {/* Back button */}
      <Link
        href="/reviewer_dashboard/verify_users"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-1" />
        Back to Pending Users
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <UserCircleIcon className="w-10 h-10 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.fullName || 'No Name Provided'}</h1>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 capitalize">
              {user.status}
            </span>
          </div>
        </div>

        {/* Info grid */}
        <div className="divide-y divide-gray-100">
          {infoRows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 py-3">
              <Icon className="w-5 h-5 text-gray-400 shrink-0" />
              <span className="text-sm text-gray-500 w-36 shrink-0">{label}</span>
              <span className="text-sm text-gray-900 font-medium capitalize">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex gap-4">
        <button
          onClick={() => handleUpdateStatus('active', true, true)}
          disabled={actionLoading}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckBadgeIcon className="w-5 h-5" />
          {actionLoading ? 'Processing...' : 'Accept User'}
        </button>
        <button
          onClick={() => handleUpdateStatus('rejected', false, false)}
          disabled={actionLoading}
          className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <TrashIcon className="w-5 h-5" />
          {actionLoading ? 'Processing...' : 'Reject User'}
        </button>
      </div>

    </div>
  );
}
