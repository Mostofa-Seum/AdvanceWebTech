'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/admin/dashboard" className="text-2xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
          Admin Central
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium">Dashboard</Link>
          <button onClick={handleLogout} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
