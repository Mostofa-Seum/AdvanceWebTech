import Link from 'next/link';
import UserActions from '@/app/admin/users/[id]/UserActions';

// SSR: This page is a Server Component — data is fetched at request time on the server
export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let user: any = null;
  let error = '';

  try {
    const res = await fetch(`http://localhost:3000/admin/users/${id}`, {
      cache: 'no-store', // Always fetch fresh data (SSR, not ISR)
    });

    if (!res.ok) {
      error = 'User not found';
    } else {
      user = await res.json();
    }
  } catch {
    error = 'Failed to connect to the server';
  }

  if (error || !user) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <Link href="/admin/dashboard" className="text-blue-600 hover:underline text-sm font-medium mb-6 inline-block">
          ← Back to Dashboard
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-xl text-center">
          <p className="text-lg font-semibold">{error || 'User not found'}</p>
        </div>
      </div>
    );
  }

  const statusColor =
    user.status === 'active' ? 'bg-green-100 text-green-700' :
    user.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
    user.status === 'suspended' || user.status === 'rejected' ? 'bg-red-100 text-red-700' :
    'bg-gray-100 text-gray-600';

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      {/* Breadcrumb */}
      <Link href="/admin/dashboard" className="text-blue-600 hover:underline text-sm font-medium inline-flex items-center gap-1">
        ← Back to Dashboard
      </Link>

      {/* User Info Card — Server Rendered */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.fullName}</h1>
              <p className="text-sm text-gray-500 mt-1 font-mono">{user.userId}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold uppercase">
                {user.role}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${statusColor}`}>
                {user.status}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Email Address</p>
            <p className="text-sm text-gray-900 font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Phone Number</p>
            <p className="text-sm text-gray-900">{user.phone || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Address</p>
            <p className="text-sm text-gray-900">{user.address || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Account Created</p>
            <p className="text-sm text-gray-900">
              {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Email Verified</p>
            <p className="text-sm">{user.isEmailVerified ? '✅ Yes' : '❌ No'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Phone Verified</p>
            <p className="text-sm">{user.isPhoneVerified ? '✅ Yes' : '❌ No'}</p>
          </div>
        </div>

        {/* Related Profiles — Server Rendered */}
        {(user.employee || user.reviewer || user.company) && (
          <div className="border-t border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Linked Profiles</h2>
            <div className="space-y-2 text-sm">
              {user.employee && (
                <p className="text-gray-600">
                  <span className="font-medium">Employee ID:</span>{' '}
                  <span className="font-mono text-xs">{user.employee.employeeId}</span>{' | '}
                  <span className="font-medium">Balance:</span> ${user.employee.balance || 0}
                </p>
              )}
              {user.reviewer && (
                <p className="text-gray-600">
                  <span className="font-medium">Reviewer ID:</span>{' '}
                  <span className="font-mono text-xs">{user.reviewer.reviewerId}</span>{' | '}
                  <span className="font-medium">Trust Score:</span> {user.reviewer.trustScore || 0}
                </p>
              )}
              {user.company && (
                <p className="text-gray-600">
                  <span className="font-medium">Company:</span> {user.company.companyName}{' | '}
                  <span className="font-medium">Status:</span> {user.company.status}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Client-side interactive section */}
      <UserActions
        userId={user.userId}
        currentStatus={user.status}
        currentRole={user.role}
        employeeId={user.employee?.employeeId}
        reviewerId={user.reviewer?.reviewerId}
      />

      {/* SSR info badge */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
        <p className="text-xs text-blue-700 font-medium">
          This page is Server-Side Rendered (SSR). User data was fetched on the server at request time.
        </p>
      </div>
    </div>
  );
}
