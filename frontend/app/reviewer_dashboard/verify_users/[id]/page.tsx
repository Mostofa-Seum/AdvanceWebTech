import Link from 'next/link';
import ActionButtons from './ActionButtons'; 
import {
  ArrowLeftIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  IdentificationIcon,
  CalendarIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';

// Next.js calls this on the SERVER at request time
export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // This fetch runs on the SERVER — no useEffect, no loading state needed
  let user: any = null;
  try {
    const res = await fetch(`http://localhost:3000/reviewer/users/${id}`, {
      cache: 'no-store', // always fetch fresh data (SSR, not static)
    });
    if (res.ok) {
      user = await res.json();
    }
  } catch (err) {
    console.error('Server-side fetch failed:', err);
  }

  // 404-style fallback — rendered on server too
  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center mt-8">
        <h2 className="text-xl font-semibold text-gray-800">User not found</h2>
        <Link
          href="/reviewer_dashboard/verify_users"
          className="text-blue-600 hover:underline mt-4 inline-block text-sm"
        >
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
    { icon: IdentificationIcon, label: 'Status', value: user.status },
    {
      icon: CheckBadgeIcon,
      label: 'Email Verified',
      value: user.isEmailVerified ? 'Yes' : 'No',
    },
    {
      icon: CheckBadgeIcon,
      label: 'Phone Verified',
      value: user.isPhoneVerified ? 'Yes' : 'No',
    },
    {
      icon: CalendarIcon,
      label: 'Registered',
      value: new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    },
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
            <h1 className="text-2xl font-bold text-gray-900">
              {user.fullName || 'No Name Provided'}
            </h1>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 capitalize">
              {user.status}
            </span>
          </div>
        </div>

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

      {/*
        ActionButtons is a CLIENT COMPONENT — it uses localStorage + useRouter.
        The server passes userId as a prop so the client component can make the PATCH call.
        This is the "client island" pattern inside an SSR page.
      */}
      <ActionButtons userId={id} />

    </div>
  );
}
