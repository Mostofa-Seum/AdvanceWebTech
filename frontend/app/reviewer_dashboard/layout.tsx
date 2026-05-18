'use client'

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  AcademicCapIcon,
  HomeIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CheckBadgeIcon,
  CreditCardIcon,
  DocumentTextIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

export default function ReviewerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage");
      }
    }
  }, []);

  // ========== PUSHER BEAMS — Browser push notifications ==========
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let beamsClient: any = null;
    let started = false;

    const initBeams = async () => {
      try {
        const instanceId = process.env.NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID;
        if (!instanceId) {
          console.warn('Pusher Beams: No instance ID configured, skipping.');
          return;
        }

        // Dynamically import to avoid Next.js SSR crashes
        const PusherPushNotifications = await import('@pusher/push-notifications-web');
        
        beamsClient = new PusherPushNotifications.Client({ instanceId });
        await beamsClient.start();
        started = true;
        await beamsClient.addDeviceInterest('reviewer-notifications');
        console.log('✅ Pusher Beams: Subscribed to reviewer-notifications');
      } catch (err) {
        console.warn('Pusher Beams init skipped (service worker may not be available in dev):', err);
        started = false;
      }
    };

    initBeams();

    return () => {
      if (beamsClient && started) {
        beamsClient.removeDeviceInterest('reviewer-notifications').catch(() => {});
      }
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/homepage');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/reviewer_dashboard', icon: HomeIcon },
    { name: 'Verify Company', path: '/reviewer_dashboard/verify_company', icon: BuildingOfficeIcon },
    { name: 'Verify Users', path: '/reviewer_dashboard/verify_users', icon: UserGroupIcon },
    { name: 'Work Verifications', path: '/reviewer_dashboard/work_verifications', icon: CheckBadgeIcon },
    { name: 'Payments', path: '/reviewer_dashboard/payments', icon: CreditCardIcon },
    { name: 'Review Reports', path: '/reviewer_dashboard/review_reports', icon: DocumentTextIcon },
  ];

  // Helper to get active tab name for the header
  const getActiveTabName = () => {
    const currentItem = menuItems.find(item => item.path === pathname);
    return currentItem ? currentItem.name : 'Dashboard';
  };

  const activeTabName = getActiveTabName();

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-slate-800 shadow-xl z-50">
        <div className="flex items-center justify-center h-16 bg-blue-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <AcademicCapIcon className="h-6 w-6 text-blue-800" />
            </div>
            <span className="text-white text-xl font-bold">SkillSeed</span>
          </div>
        </div>
        
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors group ${
                    isActive
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="px-4 mt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded-lg transition-colors text-white bg-red-600 hover:bg-red-500 shadow-sm font-medium text-sm cursor-pointer"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
            Log out
          </button>
        </div>
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <img src="https://cdn-icons-png.flaticon.com/512/17003/17003310.png" alt="Admin" className="w-10 h-10 rounded-full" />
              <div className="overflow-hidden">
                <p className="text-white text-sm font-medium truncate">{user ? user.fullName || user.email : 'Loading...'}</p>
                <p className="text-gray-400 text-xs">Reviewer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center">
          <div className="px-6 w-full">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{activeTabName}</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <BellIcon className="h-6 w-6" />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area (Injected via Next.js Layout mechanism) */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
