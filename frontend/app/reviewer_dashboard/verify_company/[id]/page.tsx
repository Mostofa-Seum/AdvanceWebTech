'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from '@/lib/axios';
import {
  CheckBadgeIcon,
  TrashIcon,
  ArrowLeftIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  IdentificationIcon,
  CalendarIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;

  const [company, setCompany] = useState<any>(null);
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
    if (!companyId) return;
    axios
      .get(`http://localhost:3000/reviewer/companies/${companyId}`)
      .then((res) => setCompany(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [companyId]);

  const handleUpdateStatus = async (status: string) => {
    if (!sessionUser?.reviewer?.reviewerId) {
      alert('Reviewer session not found. Please log in again.');
      return;
    }
    setActionLoading(true);
    try {
      await axios.patch(`http://localhost:3000/reviewer/companies/${companyId}/status`, {
        status,
        reviewerId: sessionUser.reviewer.reviewerId,
      });
      router.push('/reviewer_dashboard/verify_company');
    } catch (err) {
      console.error(err);
      alert('Failed to update company status.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-24">
        <div className="text-gray-500 text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          Loading company details...
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center mt-8">
        <h2 className="text-xl font-semibold text-gray-800">Company not found</h2>
        <Link href="/reviewer_dashboard/verify_company" className="text-blue-600 hover:underline mt-4 inline-block text-sm">
          ← Back to list
        </Link>
      </div>
    );
  }

  const companyRows = [
    {
      icon: GlobeAltIcon,
      label: 'Website',
      value: company.website ? (
        <a
          href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {company.website}
        </a>
      ) : 'Not provided',
    },
    { icon: IdentificationIcon, label: 'Status', value: company.status },
    {
      icon: CalendarIcon,
      label: 'Description',
      value: company.description || 'No description provided.',
    },
  ];

  const ownerRows = company.user ? [
    { icon: UserCircleIcon, label: 'Owner Name', value: company.user.fullName || 'N/A' },
    { icon: EnvelopeIcon, label: 'Owner Email', value: company.user.email || 'N/A' },
    { icon: PhoneIcon, label: 'Owner Phone', value: company.user.phone || 'Not provided' },
  ] : [];

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-6">

      {/* Back button */}
      <Link
        href="/reviewer_dashboard/verify_company"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-1" />
        Back to Pending Companies
      </Link>

      {/* Company header card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <BuildingOfficeIcon className="w-10 h-10 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{company.companyName}</h1>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 capitalize">
              {company.status}
            </span>
          </div>
        </div>

        {/* Company info */}
        <div className="divide-y divide-gray-100">
          {companyRows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-4 py-3">
              <Icon className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <span className="text-sm text-gray-500 w-36 shrink-0">{label}</span>
              <span className="text-sm text-gray-900 font-medium capitalize">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Owner info card */}
      {ownerRows.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-gray-400" />
            Account Owner
          </h2>
          <div className="divide-y divide-gray-100">
            {ownerRows.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 py-3">
                <Icon className="w-5 h-5 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-500 w-36 shrink-0">{label}</span>
                <span className="text-sm text-gray-900 font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex gap-4">
        <button
          onClick={() => handleUpdateStatus('active')}
          disabled={actionLoading}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckBadgeIcon className="w-5 h-5" />
          {actionLoading ? 'Processing...' : 'Accept Company'}
        </button>
        <button
          onClick={() => handleUpdateStatus('rejected')}
          disabled={actionLoading}
          className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <TrashIcon className="w-5 h-5" />
          {actionLoading ? 'Processing...' : 'Reject Company'}
        </button>
      </div>

    </div>
  );
}
