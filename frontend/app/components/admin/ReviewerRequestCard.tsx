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
    <div className="border-2 border-brand-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-xs font-black text-brand-black uppercase tracking-widest mb-1">Full Name</p>
            <p className="text-sm font-bold text-gray-800 uppercase">{request.fullName}</p>
          </div>
          <div>
            <p className="text-xs font-black text-brand-black uppercase tracking-widest mb-1">Email</p>
            <p className="text-sm font-bold text-gray-800">{request.email}</p>
          </div>
          <div>
            <p className="text-xs font-black text-brand-black uppercase tracking-widest mb-1">Phone</p>
            <p className="text-sm font-bold text-gray-800">{request.phone || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs font-black text-brand-black uppercase tracking-widest mb-1">Applied On</p>
            <p className="text-sm font-bold text-gray-800 uppercase">
              {new Date(request.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <span className="px-4 py-2 bg-yellow-100 text-yellow-700 border-2 border-brand-black text-xs font-black uppercase tracking-widest">
            PENDING
          </span>
          <button
            onClick={() => onAccept(request.userId)}
            disabled={actionLoading === request.userId}
            className="bg-brand-black text-white px-6 py-3 hover:bg-green-700 transition-colors text-xs font-black tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {actionLoading === request.userId ? '...' : 'ACCEPT'}
          </button>
          <button
            onClick={() => onReject(request.userId)}
            disabled={actionLoading === request.userId}
            className="bg-white text-brand-black px-6 py-3 hover:bg-brand-red hover:text-white transition-colors text-xs font-black tracking-widest uppercase border-2 border-brand-black disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {actionLoading === request.userId ? '...' : 'REJECT'}
          </button>
        </div>
      </div>

      {request.address && (
        <div className="mt-6 pt-4 border-t-4 border-brand-black">
          <p className="text-xs font-black text-brand-black uppercase tracking-widest mb-1">Address</p>
          <p className="text-sm font-bold text-gray-800 uppercase">{request.address}</p>
        </div>
      )}
    </div>
  );
}
