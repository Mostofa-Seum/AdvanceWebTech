'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { CheckBadgeIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ActionButtonsProps {
  userId: string;
}

export default function ActionButtons({ userId }: ActionButtonsProps) {
  const router = useRouter();
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

  const handleUpdateStatus = async (
    status: string,
    isEmailVerified: boolean,
    isPhoneVerified: boolean
  ) => {
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

  return (
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
  );
}
