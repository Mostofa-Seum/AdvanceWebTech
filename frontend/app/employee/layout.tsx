'use client'

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  BellIcon,
  ExclamationTriangleIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import NotificationsBell from '@/app/components/NotificationsBell';

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!userStr || !token) {
      router.push('/login');
      return;
    }
    try {
      const parsed = JSON.parse(userStr);
      if (parsed.role !== 'employee') {
        router.push('/login');
        return;
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(parsed);
    } catch {
      router.push('/login');
    }
  }, [router]);

  // Pusher Beams — employee notifications
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let beamsClient: any = null;
    let started = false;

    const initBeams = async () => {
      try {
        const instanceId = process.env.NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID;
        if (!instanceId) return;
        const PusherPushNotifications = await import('@pusher/push-notifications-web');
        beamsClient = new PusherPushNotifications.Client({ instanceId });
        await beamsClient.start();
        started = true;
        await beamsClient.addDeviceInterest('employee-notifications');
      } catch {
        started = false;
      }
    };

    initBeams();

    return () => {
      if (beamsClient && started) {
        beamsClient.removeDeviceInterest('employee-notifications').catch(() => {});
      }
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/');
  };

  const menuItems = [
    { name: 'DASHBOARD', path: '/employee', icon: HomeIcon },
    { name: 'BROWSE JOBS', path: '/employee/browse', icon: MagnifyingGlassIcon },
    { name: 'APPLICATIONS', path: '/employee/applications', icon: DocumentTextIcon },
    { name: 'MY ASSIGNMENTS', path: '/employee/assigned', icon: BriefcaseIcon },
    { name: 'EARNINGS', path: '/employee/earnings', icon: CurrencyDollarIcon },
    { name: 'NOTIFICATIONS', path: '/employee/notifications', icon: BellIcon },
    { name: 'REPORTS', path: '/employee/reports', icon: ExclamationTriangleIcon },
  ];

  const getActiveTabName = () => {
    const currentItem = menuItems.find((item) => pathname === item.path || (item.path !== '/employee' && pathname.startsWith(item.path)));
    return currentItem ? currentItem.name : 'DASHBOARD';
  };

  const activeTabName = getActiveTabName();

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-brand-black border-r-4 border-brand-red z-50 flex flex-col">
        <div className="flex items-center justify-center h-20 bg-brand-black border-b border-white/10">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-brand-red flex items-center justify-center">
              <span className="text-white font-bold text-xl leading-none">S</span>
            </div>
            <span className="text-white text-2xl font-bold tracking-widest uppercase">SkillSeed</span>
          </Link>
        </div>

        <nav className="mt-8 px-4 flex-1">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.path || (item.path !== '/employee' && pathname.startsWith(item.path));
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
              <UserIcon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-xs font-bold tracking-wider truncate uppercase">{user ? user.fullName || user.email : 'LOADING...'}</p>
              <p className="text-brand-red text-[10px] font-bold tracking-widest uppercase mt-0.5">EMPLOYEE</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex flex-col min-h-screen">
        <header className="bg-white border-b-4 border-brand-black h-20 flex items-center sticky top-0 z-40">
          <div className="px-10 w-full">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black text-brand-black tracking-tight uppercase">{activeTabName}</h1>
              </div>
              <div className="flex items-center space-x-4">
                <NotificationsBell role="employee" idKey="employeeId" />
              </div>
            </div>
          </div>
        </header>

        <main className="p-10 flex-1 bg-white">{children}</main>
      </div>
    </div>
  );
}
