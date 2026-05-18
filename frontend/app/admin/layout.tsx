import type { Metadata } from 'next';
import AdminHeader from '@/app/components/admin/AdminHeader';

export const metadata: Metadata = {
  title: 'Admin Dashboard - SkillSeed',
  description: 'SkillSeed Administration Panel — Manage users, companies, reviewers and platform settings.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <AdminHeader />
      <main className="pb-10">
        {children}
      </main>
    </div>
  );
}
