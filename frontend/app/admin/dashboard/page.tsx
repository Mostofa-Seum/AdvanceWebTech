'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import ReviewerRequestCard from '@/app/components/admin/ReviewerRequestCard';

type TabType = 'users' | 'companies' | 'reviewers' | 'reviewer-requests' | 'create-admin' | 'profile';

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

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<{ isOpen: boolean; type: string; data: any }>({ isOpen: false, type: 'user', data: null });
  const [adminUser, setAdminUser] = useState<any>(null);

  // Reviewer requests state
  const [reviewerRequests, setReviewerRequests] = useState<ReviewerRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Profile state
  const [profileForm, setProfileForm] = useState({ fullName: '', email: '', phone: '', address: '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwMsg, setPwMsg] = useState('');
  const [pwErr, setPwErr] = useState('');

  // Create Admin state (POST)
  const [createForm, setCreateForm] = useState({ fullName: '', email: '', password: '', phone: '', address: '' });
  const [createMsg, setCreateMsg] = useState('');
  const [createErr, setCreateErr] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  // Pusher notification state
  const [notification, setNotification] = useState<{ message: string; fullName: string; email: string } | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userStr || !token) { router.push('/login'); return; }
    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin') { router.push('/login'); return; }

      // Set the Bearer token for all Axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setAdminUser(user);
      setProfileForm({ fullName: user.fullName || '', email: user.email || '', phone: user.phone || '', address: user.address || '' });
    } catch { router.push('/login'); }
  }, []);

  useEffect(() => {
    if (!adminUser) return;
    if (activeTab === 'reviewer-requests') {
      fetchReviewerRequests();
    } else if (activeTab !== 'profile' && activeTab !== 'create-admin') {
      fetchData(activeTab);
    }
  }, [activeTab, adminUser]);

  // pusher BEAMS — Browser push notifications 
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

        const PusherPushNotifications = await import('@pusher/push-notifications-web');

        beamsClient = new PusherPushNotifications.Client({ instanceId });
        await beamsClient.start();
        started = true;
        await beamsClient.addDeviceInterest('admin-notifications');
        console.log('✅ Pusher Beams: Subscribed to admin-notifications');
      } catch (err) {
        console.warn('Pusher Beams init skipped (service worker may not be available in dev):', err);
        started = false;
      }
    };

    initBeams();

    return () => {
      if (beamsClient && started) {
        beamsClient.removeDeviceInterest('admin-notifications').catch(() => { });
      }
    };
  }, []);

  //  GET — Fetch tab data 
  const fetchData = async (tab: TabType) => {
    setLoading(true); setError(''); setData([]);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/admin/${tab}`);
      setData(res.data);
    } catch (err: any) {
      setError(`Failed to load ${tab}. ` + (err.response?.data?.message || ''));
    } finally { setLoading(false); }
  };

  //  GET — Fetch reviewer requests 
  const fetchReviewerRequests = async () => {
    setRequestsLoading(true); setRequestsError(''); setReviewerRequests([]);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/admin/reviewer-requests`);
      setReviewerRequests(res.data);
    } catch (err: any) {
      setRequestsError('Failed to load reviewer requests. ' + (err.response?.data?.message || ''));
    } finally { setRequestsLoading(false); }
  };

  //  PATCH — Handle reviewer action 
  const handleReviewerAction = async (userId: string, action: 'accept' | 'reject') => {
    if (action === 'reject' && !confirm('Are you sure you want to reject this reviewer request?')) return;
    setActionLoading(userId);
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/admin/reviewer-requests/${userId}`, { action });
      setReviewerRequests(prev => prev.filter(r => r.userId !== userId));
    } catch (err: any) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    } finally { setActionLoading(null); }
  };

  //  DELETE — Delete user 
  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try { await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/admin/users/${id}`); fetchData(activeTab); }
    catch (err: any) { alert('Error: ' + (err.response?.data?.message || err.message)); }
  };

  //  PATCH — Demote reviewer 
  const demoteReviewer = async (id: string) => {
    if (!confirm('Demote this reviewer to employee?')) return;
    try { await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/admin/reviewers/${id}/demote`); fetchData(activeTab); }
    catch (err: any) { alert('Error: ' + (err.response?.data?.message || err.message)); }
  };

  //  PATCH — Promote employee  
  const promoteEmployee = async (id: string) => {
    if (!confirm('Promote this employee to reviewer?')) return;
    try { await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/admin/employees/${id}/promote`); fetchData(activeTab); }
    catch (err: any) { alert('Error: ' + (err.response?.data?.message || err.message)); }
  };

  //  PATCH — Update status 
  const updateStatus = async (id: string, status: string, endpoint: string) => {
    try { await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/admin/${endpoint}/${id}/status`, { status }); fetchData(activeTab); }
    catch (err: any) { alert('Error: ' + (err.response?.data?.message || err.message)); }
  };

  //  PUT — Update profile  
  const handleProfileUpdate = async () => {
    setProfileMsg('');
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/admin/profile/${adminUser.userId}`, profileForm);
      const updated = { ...adminUser, ...profileForm };
      localStorage.setItem('user', JSON.stringify(updated));
      setAdminUser(updated);
      setProfileMsg('Profile updated successfully!');
    } catch (err: any) { setProfileMsg('Error: ' + (err.response?.data?.message || err.message)); }
  };

  //  PATCH — Change password 
  const handlePasswordChange = async () => {
    setPwErr(''); setPwMsg('');
    if (!pwForm.oldPassword || !pwForm.newPassword || !pwForm.confirmPassword) { setPwErr('All fields are required.'); return; }
    if (pwForm.newPassword.length < 6) { setPwErr('New password must be at least 6 characters.'); return; }
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwErr('Passwords do not match.'); return; }
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/admin/profile/${adminUser.userId}/change-password`, { oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword });
      setPwMsg('Password changed successfully!');
      setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setPwErr(err.response?.data?.message === 'Old password is incorrect' ? 'Old password is incorrect.' : 'Failed to change password.');
    }
  };

  //  POST — Create admin account 
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateErr(''); setCreateMsg(''); setCreateLoading(true);
    if (!createForm.fullName || !createForm.email || !createForm.password) {
      setCreateErr('Full Name, Email, and Password are required.');
      setCreateLoading(false);
      return;
    }
    if (createForm.password.length < 6) {
      setCreateErr('Password must be at least 6 characters.');
      setCreateLoading(false);
      return;
    }
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/admin/signup`, createForm);
      setCreateMsg('Admin account created successfully!');
      setCreateForm({ fullName: '', email: '', password: '', phone: '', address: '' });
    } catch (err: any) {
      setCreateErr(err.response?.data?.message || 'Failed to create admin account.');
    } finally { setCreateLoading(false); }
  };

  const tabs: { key: TabType; label: string }[] = [
    { key: 'users', label: 'Users' },
    { key: 'companies', label: 'Companies' },
    { key: 'reviewers', label: 'Reviewers' },
    { key: 'reviewer-requests', label: 'Reviewer Requests' },
    { key: 'create-admin', label: '+ Create Admin' },
    { key: 'profile', label: 'My Profile' },
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 md:p-8 mt-4 space-y-6">
        {/* Tabs */}
        <div className="flex gap-4 border-b-4 border-brand-black pb-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 border-2 border-brand-black text-xs font-black uppercase tracking-widest transition-colors whitespace-nowrap flex items-center gap-3 cursor-pointer ${activeTab === tab.key ? 'bg-brand-black text-white shadow-[4px_4px_0px_0px_rgba(228,22,19,1)]' : 'bg-white text-brand-black hover:bg-brand-red hover:text-white hover:border-brand-red shadow-[4px_4px_0px_0px_rgba(43,43,43,1)] hover:shadow-none translate-x-0 hover:translate-x-[4px] translate-y-0 hover:translate-y-[4px]'}`}>
              {tab.label}
              {tab.key === 'reviewer-requests' && reviewerRequests.length > 0 && (
                <span className="bg-brand-red text-white text-xs font-black px-2 py-1 border-2 border-transparent">
                  {reviewerRequests.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-8 max-w-2xl">
            <div className="bg-white border-2 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
              <h2 className="text-3xl font-black text-brand-black uppercase tracking-widest mb-8 border-b-4 border-brand-black pb-4">MY PROFILE</h2>
              <div className="space-y-6">
                {(['fullName', 'email', 'phone', 'address'] as const).map((field) => (
                  <div key={field}>
                    <label className="block text-xs font-black uppercase tracking-widest text-brand-black mb-2">{field === 'fullName' ? 'Full Name' : field}</label>
                    <input type={field === 'email' ? 'email' : 'text'} value={(profileForm as any)[field]}
                      onChange={e => setProfileForm({ ...profileForm, [field]: e.target.value })}
                      className="block w-full p-4 border-2 border-brand-black focus:border-brand-red focus:ring-0 focus:outline-none bg-white transition-colors text-sm font-bold" />
                  </div>
                ))}
                {profileMsg && <p className={`text-xs font-bold uppercase tracking-widest p-4 border-2 ${profileMsg.startsWith('Error') ? 'bg-white border-brand-red text-brand-red' : 'bg-brand-black text-white border-brand-black'}`}>{profileMsg}</p>}
                <button onClick={handleProfileUpdate} className="bg-brand-black text-white px-8 py-4 hover:bg-brand-red transition-colors text-xs font-black tracking-widest uppercase cursor-pointer">SAVE CHANGES</button>
              </div>
            </div>

            <div className="bg-white border-2 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
              <h2 className="text-3xl font-black text-brand-black uppercase tracking-widest mb-8 border-b-4 border-brand-black pb-4">CHANGE PASSWORD</h2>
              <div className="space-y-6">
                {[{ key: 'oldPassword', label: 'Current Password' }, { key: 'newPassword', label: 'New Password' }, { key: 'confirmPassword', label: 'Confirm New Password' }].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-black uppercase tracking-widest text-brand-black mb-2">{f.label}</label>
                    <input type="password" value={(pwForm as any)[f.key]}
                      onChange={e => { setPwForm({ ...pwForm, [f.key]: e.target.value }); setPwErr(''); setPwMsg(''); }}
                      className="block w-full p-4 border-2 border-brand-black focus:border-brand-red focus:ring-0 focus:outline-none bg-white transition-colors text-sm font-bold" />
                  </div>
                ))}
                {pwErr && <p className="text-xs font-bold uppercase tracking-widest text-brand-red bg-white border-2 border-brand-red px-4 py-3">{pwErr}</p>}
                {pwMsg && <p className="text-xs font-bold uppercase tracking-widest text-white bg-brand-black border-2 border-brand-black px-4 py-3">{pwMsg}</p>}
                <button onClick={handlePasswordChange} className="bg-brand-black text-white px-8 py-4 hover:bg-brand-red transition-colors text-xs font-black tracking-widest uppercase cursor-pointer">UPDATE PASSWORD</button>
              </div>
            </div>
          </div>
        )}

        {/* Create Admin Tab (POST) */}
        {activeTab === 'create-admin' && (
          <div className="max-w-2xl">
            <div className="bg-white border-2 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
              <h2 className="text-3xl font-black text-brand-black uppercase tracking-widest mb-2 border-b-4 border-brand-black pb-4">CREATE ADMIN ACCOUNT</h2>
              <p className="text-sm font-bold text-gray-500 mb-8 mt-4 uppercase">Add a new administrator to the platform.</p>

              {createErr && <div className="mb-6 text-xs font-bold uppercase tracking-widest text-brand-red bg-white border-2 border-brand-red p-4">⚠️ {createErr}</div>}
              {createMsg && <div className="mb-6 text-xs font-bold uppercase tracking-widest text-white bg-brand-black border-2 border-brand-black p-4">✓ {createMsg}</div>}

              <form onSubmit={handleCreateAdmin} className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-brand-black mb-2">Full Name *</label>
                  <input type="text" value={createForm.fullName} onChange={e => setCreateForm({ ...createForm, fullName: e.target.value })}
                    className="block w-full p-4 border-2 border-brand-black focus:border-brand-red focus:ring-0 focus:outline-none bg-white text-sm font-bold" placeholder="ADMIN NAME" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-brand-black mb-2">Email Address *</label>
                  <input type="email" value={createForm.email} onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
                    className="block w-full p-4 border-2 border-brand-black focus:border-brand-red focus:ring-0 focus:outline-none bg-white text-sm font-bold" placeholder="ADMIN@SKILLSEED.COM" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-brand-black mb-2">Password *</label>
                  <input type="password" value={createForm.password} onChange={e => setCreateForm({ ...createForm, password: e.target.value })}
                    className="block w-full p-4 border-2 border-brand-black focus:border-brand-red focus:ring-0 focus:outline-none bg-white text-sm font-bold" placeholder="MIN 6 CHARACTERS" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-brand-black mb-2">Phone</label>
                    <input type="text" value={createForm.phone} onChange={e => setCreateForm({ ...createForm, phone: e.target.value })}
                      className="block w-full p-4 border-2 border-brand-black focus:border-brand-red focus:ring-0 focus:outline-none bg-white text-sm font-bold" placeholder="OPTIONAL" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-brand-black mb-2">Address</label>
                    <input type="text" value={createForm.address} onChange={e => setCreateForm({ ...createForm, address: e.target.value })}
                      className="block w-full p-4 border-2 border-brand-black focus:border-brand-red focus:ring-0 focus:outline-none bg-white text-sm font-bold" placeholder="OPTIONAL" />
                  </div>
                </div>
                <button type="submit" disabled={createLoading}
                  className="bg-brand-black text-white px-8 py-4 hover:bg-brand-red transition-colors text-xs font-black tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-full mt-4">
                  {createLoading ? 'CREATING...' : 'CREATE ADMIN ACCOUNT'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Reviewer Requests Tab */}
        {activeTab === 'reviewer-requests' && (
          <div className="bg-white border-2 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
            <div className="flex items-center justify-between mb-8 border-b-4 border-brand-black pb-4">
              <div>
                <h2 className="text-3xl font-black text-brand-black uppercase tracking-widest">REVIEWER REQUESTS</h2>
                <p className="text-sm font-bold text-gray-500 mt-2 uppercase tracking-widest">Users who signed up as reviewers and are awaiting your approval.</p>
              </div>
              <button onClick={fetchReviewerRequests} className="bg-white text-brand-black border-2 border-brand-black px-6 py-3 hover:bg-brand-black hover:text-white transition-colors text-xs font-black uppercase tracking-widest cursor-pointer">
                ↻ REFRESH
              </button>
            </div>

            {requestsLoading && (
              <div className="py-20 text-center text-brand-black">
                <p className="text-xl font-black uppercase tracking-widest animate-pulse">LOADING REQUESTS...</p>
              </div>
            )}

            {requestsError && <div className="bg-white border-2 border-brand-red text-brand-red font-bold uppercase tracking-widest p-4 mb-6 text-xs">{requestsError}</div>}

            {!requestsLoading && reviewerRequests.length === 0 && !requestsError && (
              <div className="py-20 text-center text-gray-500 border-2 border-dashed border-gray-300">
                <p className="text-2xl font-black uppercase tracking-widest text-brand-black">NO PENDING REQUESTS</p>
                <p className="text-sm font-bold mt-2 uppercase tracking-widest">All reviewer requests have been processed.</p>
              </div>
            )}

            {!requestsLoading && reviewerRequests.length > 0 && (
              <div className="space-y-6">
                {reviewerRequests.map((request) => (
                  <ReviewerRequestCard
                    key={request.userId}
                    request={request}
                    actionLoading={actionLoading}
                    onAccept={(id) => handleReviewerAction(id, 'accept')}
                    onReject={(id) => handleReviewerAction(id, 'reject')}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Data Tabs (users / companies / reviewers)  */}
        {activeTab !== 'profile' && activeTab !== 'reviewer-requests' && activeTab !== 'create-admin' && (
          <div className="bg-white border-2 border-brand-black p-8 shadow-[8px_8px_0px_0px_rgba(43,43,43,1)]">
            <div className="flex items-center mb-8 border-b-4 border-brand-black pb-4">
              <h2 className="text-3xl font-black text-brand-black uppercase tracking-widest">MANAGE {activeTab}</h2>
              {loading && <span className="ml-6 text-xs font-bold text-brand-black uppercase tracking-widest animate-pulse">LOADING...</span>}
            </div>

            {error && <div className="bg-white border-2 border-brand-red text-brand-red font-bold uppercase tracking-widest p-4 mb-6 text-xs">{error}</div>}
            {!loading && data.length === 0 && !error && <div className="py-20 text-center text-brand-black border-2 border-dashed border-gray-300"><p className="text-2xl font-black uppercase tracking-widest">NO {activeTab} FOUND</p></div>}

            {!loading && data.length > 0 && (
              <div className="overflow-x-auto border-2 border-brand-black">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-black text-white text-xs font-black uppercase tracking-widest border-b-4 border-brand-black">
                      <th className="p-4">NAME</th>
                      <th className="p-4">CONTACT</th>
                      <th className="p-4">ROLE</th>
                      <th className="p-4">STATUS</th>
                      <th className="p-4 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-brand-black bg-white">
                    {data.map((item, idx) => {
                      const id = item.userId || item.companyId || item.reviewerId || item.employeeId;
                      const name = item.fullName || item.user?.fullName || item.name || item.companyName || 'N/A';
                      const email = item.email || item.user?.email || 'N/A';
                      const role = item.role || item.user?.role || activeTab.slice(0, -1);
                      const status = item.status || item.user?.status || 'unknown';
                      const userId = item.userId || item.user?.userId;
                      return (
                        <tr key={id || idx} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            {/* Dynamic route link to /admin/users/[id] (SSR page) */}
                            {userId ? (
                              <Link href={`/admin/users/${userId}`} className="font-bold text-brand-black hover:text-brand-red uppercase underline underline-offset-4 decoration-2 decoration-brand-black hover:decoration-brand-red">
                                {name}
                              </Link>
                            ) : (
                              <span className="font-bold text-brand-black uppercase">{name}</span>
                            )}
                            <div className="text-xs text-gray-500 font-bold tracking-widest uppercase mt-2">{id ? id.substring(0, 8) + '...' : 'N/A'}</div>
                          </td>
                          <td className="p-4 text-sm font-bold text-gray-800">{email}</td>
                          <td className="p-4"><span className="px-3 py-1 bg-white border-2 border-brand-black text-brand-black text-xs font-black uppercase tracking-widest">{role}</span></td>
                          <td className="p-4">
                            <span className={`px-3 py-1 text-xs font-black uppercase tracking-widest border-2 border-brand-black ${status === 'active' || status === 'approved' ? 'bg-green-100 text-green-800' : status === 'pending' ? 'bg-yellow-100 text-yellow-800' : status === 'suspended' || status === 'rejected' ? 'bg-white text-brand-red border-brand-red' : 'bg-gray-100 text-gray-800'}`}>{status}</span>
                          </td>
                          <td className="p-4 text-right space-x-3">
                            {userId && (
                              <Link href={`/admin/users/${userId}`} className="bg-brand-black text-white px-4 py-2 hover:bg-brand-red text-xs font-black tracking-widest uppercase inline-block">VIEW</Link>
                            )}

                            {activeTab === 'users' && role === 'employee' && (
                              <button onClick={() => {
                                const eId = item.employee?.employeeId;
                                if (eId) promoteEmployee(eId);
                                else alert('Employee profile not found.');
                              }} className="bg-white text-green-700 border-2 border-green-700 px-4 py-2 hover:bg-green-700 hover:text-white text-xs font-black tracking-widest uppercase cursor-pointer">PROMOTE</button>
                            )}

                            {activeTab === 'users' && (
                              <button onClick={() => deleteUser(id)} className="bg-white text-brand-red border-2 border-brand-red px-4 py-2 hover:bg-brand-red hover:text-white text-xs font-black tracking-widest uppercase cursor-pointer">DELETE</button>
                            )}

                            {activeTab === 'reviewers' && (
                              <button onClick={() => demoteReviewer(id)} className="bg-white text-orange-600 border-2 border-orange-600 px-4 py-2 hover:bg-orange-600 hover:text-white text-xs font-black tracking-widest uppercase cursor-pointer">DEMOTE</button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pusher Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-brand-black text-white border-4 border-brand-red shadow-[8px_8px_0px_0px_rgba(228,22,19,1)] p-6 max-w-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 border-b-2 border-gray-600 pb-2">
                  <span className="text-xl">🔔</span>
                  <p className="font-black text-xs uppercase tracking-widest text-brand-red">NEW REVIEWER REQUEST</p>
                </div>
                <p className="text-sm font-bold mt-4 uppercase">
                  <span className="text-white bg-brand-red px-2 py-1 mr-2">{notification.fullName}</span>
                  WANTS TO JOIN AS A REVIEWER
                </p>
                <p className="text-xs font-bold text-gray-400 mt-2 tracking-widest">{notification.email}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-gray-400 hover:text-brand-red transition-colors text-2xl leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>
            <button
              onClick={() => { setActiveTab('reviewer-requests'); setNotification(null); }}
              className="mt-6 w-full bg-white text-brand-black border-2 border-brand-black text-xs font-black uppercase tracking-widest py-3 hover:bg-brand-red hover:text-white hover:border-brand-red transition-colors cursor-pointer"
            >
              VIEW REQUEST →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
