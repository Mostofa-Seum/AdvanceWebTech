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
    router.push('/');
  };

  const menuItems = [
    { name: 'DASHBOARD', path: '/reviewer_dashboard', icon: HomeIcon },
    { name: 'VERIFY COMPANY', path: '/reviewer_dashboard/verify_company', icon: BuildingOfficeIcon },
    { name: 'VERIFY USERS', path: '/reviewer_dashboard/verify_users', icon: UserGroupIcon },
    { name: 'WORK VERIFICATIONS', path: '/reviewer_dashboard/work_verifications', icon: CheckBadgeIcon },
    { name: 'PAYMENTS', path: '/reviewer_dashboard/payments', icon: CreditCardIcon },
    { name: 'REVIEW REPORTS', path: '/reviewer_dashboard/review_reports', icon: DocumentTextIcon },
  ];

  // Helper to get active tab name for the header
  const getActiveTabName = () => {
    const currentItem = menuItems.find(item => item.path === pathname);
    return currentItem ? currentItem.name : 'DASHBOARD';
  };

  const activeTabName = getActiveTabName();

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-brand-black border-r-4 border-brand-red z-50 flex flex-col">
        <div className="flex items-center justify-center h-20 bg-brand-black border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-brand-red flex items-center justify-center">
              <span className="text-white font-bold text-xl leading-none">S</span>
            </div>
            <span className="text-white text-2xl font-bold tracking-widest uppercase">SkillSeed</span>
          </div>
        </div>
        
        <nav className="mt-8 px-4 flex-1">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`w-full flex items-center px-4 py-3 transition-colors group border-l-4 ${
                    isActive
                      ? 'bg-white/10 text-brand-red border-brand-red'
                      : 'border-transparent text-gray-400 hover:bg-white/5 hover:text-white hover:border-white/50'
                  }`}
                >
                  <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-brand-red' : 'text-gray-500 group-hover:text-white'}`} />
                  <span className="text-xs font-bold tracking-widest">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="px-4 mt-auto mb-4">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 transition-colors text-white bg-brand-black border border-brand-red hover:bg-brand-red text-xs font-bold tracking-widest uppercase cursor-pointer"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
            LOG OUT
          </button>
        </div>
        
        <div className="border-t border-white/10 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-800 border border-gray-600 flex items-center justify-center">
              <UserGroupIcon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-xs font-bold tracking-wider truncate uppercase">{user ? user.fullName || user.email : 'LOADING...'}</p>
              <p className="text-brand-red text-[10px] font-bold tracking-widest uppercase mt-0.5">REVIEWER</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b-4 border-brand-black h-20 flex items-center">
          <div className="px-10 w-full">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black text-brand-black tracking-tight uppercase">{activeTabName}</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button className="p-2 text-brand-black hover:text-brand-red hover:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-brand-black">
                    <BellIcon className="h-6 w-6" />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-brand-red border-2 border-white"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="p-10 flex-1 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
