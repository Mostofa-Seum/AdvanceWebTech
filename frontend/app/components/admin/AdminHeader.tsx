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
    <header className="bg-brand-black border-b-4 border-brand-black p-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/admin/dashboard" className="text-2xl font-black text-white uppercase tracking-widest hover:text-brand-red transition-colors flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-red flex justify-center items-center">
             <span className="text-white text-xl">S</span>
          </div>
          ADMIN CENTRAL
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/admin/dashboard" className="text-xs font-bold text-white uppercase tracking-widest hover:text-brand-red transition-colors">DASHBOARD</Link>
          <button onClick={handleLogout} className="bg-white text-brand-black px-6 py-3 border-2 border-brand-black hover:bg-brand-red hover:text-white transition-colors text-xs font-bold uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(228,22,19,1)] hover:shadow-none translate-x-0 hover:translate-x-[4px] translate-y-0 hover:translate-y-[4px]">
            LOGOUT
          </button>
        </div>
      </div>
    </header>
  );
}
