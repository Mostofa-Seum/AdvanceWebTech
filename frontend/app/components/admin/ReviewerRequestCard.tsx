'use client';

interface ReviewerRequest {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  status: string;
  createdAt: string;
}

interface ReviewerRequestCardProps {
  request: ReviewerRequest;
  actionLoading: string | null;
  onAccept: (userId: string) => void;
  onReject: (userId: string) => void;
}

export default function ReviewerRequestCard({ request, actionLoading, onAccept, onReject }: ReviewerRequestCardProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Full Name</p>
            <p className="text-sm font-semibold text-gray-900">{request.fullName}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Email</p>
            <p className="text-sm text-gray-700">{request.email}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Phone</p>
            <p className="text-sm text-gray-700">{request.phone || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Applied On</p>
            <p className="text-sm text-gray-700">
              {new Date(request.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold uppercase">
            Pending
          </span>
          <button
            onClick={() => onAccept(request.userId)}
            disabled={actionLoading === request.userId}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading === request.userId ? '...' : '✓ Accept'}
          </button>
          <button
            onClick={() => onReject(request.userId)}
            disabled={actionLoading === request.userId}
            className="bg-red-50 text-red-600 px-5 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading === request.userId ? '...' : '✗ Reject'}
          </button>
        </div>
      </div>

      {request.address && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Address</p>
          <p className="text-sm text-gray-600">{request.address}</p>
        </div>
      )}
    </div>
  );
}
