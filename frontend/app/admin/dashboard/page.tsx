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
  const [modal, setModal] = useState<{isOpen:boolean; type:string; data:any}>({ isOpen: false, type: 'user', data: null });
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

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) { router.push('/login'); return; }
    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin') { router.push('/login'); return; }
      setAdminUser(user);
      setProfileForm({ fullName: user.fullName || '', email: user.email || '', phone: user.phone || '', address: user.address || '' });
    } catch { router.push('/login'); }
  }, []);

  useEffect(() => {
    if (activeTab === 'reviewer-requests') {
      fetchReviewerRequests();
    } else if (activeTab !== 'profile' && activeTab !== 'create-admin') {
      fetchData(activeTab);
    }
  }, [activeTab]);

  // ========== GET — Fetch tab data ==========
  const fetchData = async (tab: TabType) => {
    setLoading(true); setError(''); setData([]);
    try {
      const res = await axios.get(`http://localhost:3000/admin/${tab}`);
      setData(res.data);
    } catch (err: any) {
      setError(`Failed to load ${tab}. ` + (err.response?.data?.message || ''));
    } finally { setLoading(false); }
  };

  // ========== GET — Fetch reviewer requests ==========
  const fetchReviewerRequests = async () => {
    setRequestsLoading(true); setRequestsError(''); setReviewerRequests([]);
    try {
      const res = await axios.get('http://localhost:3000/admin/reviewer-requests');
      setReviewerRequests(res.data);
    } catch (err: any) {
      setRequestsError('Failed to load reviewer requests. ' + (err.response?.data?.message || ''));
    } finally { setRequestsLoading(false); }
  };

  // ========== PATCH — Handle reviewer action ==========
  const handleReviewerAction = async (userId: string, action: 'accept' | 'reject') => {
    if (action === 'reject' && !confirm('Are you sure you want to reject this reviewer request?')) return;
    setActionLoading(userId);
    try {
      await axios.patch(`http://localhost:3000/admin/reviewer-requests/${userId}`, { action });
      setReviewerRequests(prev => prev.filter(r => r.userId !== userId));
    } catch (err: any) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    } finally { setActionLoading(null); }
  };

  // ========== DELETE — Delete user ==========
  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try { await axios.delete(`http://localhost:3000/admin/users/${id}`); fetchData(activeTab); }
    catch (err: any) { alert('Error: ' + (err.response?.data?.message || err.message)); }
  };

  // ========== PATCH — Demote reviewer ==========
  const demoteReviewer = async (id: string) => {
    if (!confirm('Demote this reviewer to employee?')) return;
    try { await axios.patch(`http://localhost:3000/admin/reviewers/${id}/demote`); fetchData(activeTab); }
    catch (err: any) { alert('Error: ' + (err.response?.data?.message || err.message)); }
  };

  // ========== PATCH — Promote employee ==========
  const promoteEmployee = async (id: string) => {
    if (!confirm('Promote this employee to reviewer?')) return;
    try { await axios.patch(`http://localhost:3000/admin/employees/${id}/promote`); fetchData(activeTab); }
    catch (err: any) { alert('Error: ' + (err.response?.data?.message || err.message)); }
  };

  // ========== PATCH — Update status ==========
  const updateStatus = async (id: string, status: string, endpoint: string) => {
    try { await axios.patch(`http://localhost:3000/admin/${endpoint}/${id}/status`, { status }); fetchData(activeTab); }
    catch (err: any) { alert('Error: ' + (err.response?.data?.message || err.message)); }
  };

  // ========== PUT — Update profile ==========
  const handleProfileUpdate = async () => {
    setProfileMsg('');
    try {
      await axios.put(`http://localhost:3000/admin/profile/${adminUser.userId}`, profileForm);
      const updated = { ...adminUser, ...profileForm };
      localStorage.setItem('user', JSON.stringify(updated));
      setAdminUser(updated);
      setProfileMsg('Profile updated successfully!');
    } catch (err: any) { setProfileMsg('Error: ' + (err.response?.data?.message || err.message)); }
  };

  // ========== PATCH — Change password ==========
  const handlePasswordChange = async () => {
    setPwErr(''); setPwMsg('');
    if (!pwForm.oldPassword || !pwForm.newPassword || !pwForm.confirmPassword) { setPwErr('All fields are required.'); return; }
    if (pwForm.newPassword.length < 6) { setPwErr('New password must be at least 6 characters.'); return; }
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwErr('Passwords do not match.'); return; }
    try {
      await axios.patch(`http://localhost:3000/admin/profile/${adminUser.userId}/change-password`, { oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword });
      setPwMsg('Password changed successfully!');
      setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setPwErr(err.response?.data?.message === 'Old password is incorrect' ? 'Old password is incorrect.' : 'Failed to change password.');
    }
  };

  // ========== POST — Create admin account ==========
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
      await axios.post('http://localhost:3000/admin/signup', createForm);
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
        <div className="flex space-x-2 border-b border-gray-200 pb-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-t-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === tab.key ? 'bg-white border border-gray-200 border-b-white -mb-[9px] text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-transparent'}`}>
              {tab.label}
              {tab.key === 'reviewer-requests' && reviewerRequests.length > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {reviewerRequests.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ===================== Profile Tab ===================== */}
        {activeTab === 'profile' && (
          <div className="space-y-6 max-w-2xl">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">My Profile</h2>
              <div className="space-y-5">
                {(['fullName', 'email', 'phone', 'address'] as const).map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field === 'fullName' ? 'Full Name' : field}</label>
                    <input type={field === 'email' ? 'email' : 'text'} value={(profileForm as any)[field]}
                      onChange={e => setProfileForm({ ...profileForm, [field]: e.target.value })}
                      className="block w-full rounded-md shadow-sm p-2.5 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white transition-colors" />
                  </div>
                ))}
                {profileMsg && <p className={`text-sm p-2 rounded ${profileMsg.startsWith('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>{profileMsg}</p>}
                <button onClick={handleProfileUpdate} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">Save Changes</button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Change Password</h2>
              <div className="space-y-5">
                {[{ key: 'oldPassword', label: 'Current Password' }, { key: 'newPassword', label: 'New Password' }, { key: 'confirmPassword', label: 'Confirm New Password' }].map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                    <input type="password" value={(pwForm as any)[f.key]}
                      onChange={e => { setPwForm({ ...pwForm, [f.key]: e.target.value }); setPwErr(''); setPwMsg(''); }}
                      className="block w-full rounded-md shadow-sm p-2.5 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white transition-colors" />
                  </div>
                ))}
                {pwErr && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{pwErr}</p>}
                {pwMsg && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">{pwMsg}</p>}
                <button onClick={handlePasswordChange} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">Update Password</button>
              </div>
            </div>
          </div>
        )}

        {/* ===================== Create Admin Tab (POST) ===================== */}
        {activeTab === 'create-admin' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Create Admin Account</h2>
              <p className="text-sm text-gray-500 mb-6">Add a new administrator to the platform.</p>

              {createErr && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">⚠️ {createErr}</div>}
              {createMsg && <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 p-3 rounded-lg">✓ {createMsg}</div>}

              <form onSubmit={handleCreateAdmin} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input type="text" value={createForm.fullName} onChange={e => setCreateForm({ ...createForm, fullName: e.target.value })}
                    className="block w-full rounded-md shadow-sm p-2.5 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white" placeholder="Admin Name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input type="email" value={createForm.email} onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
                    className="block w-full rounded-md shadow-sm p-2.5 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white" placeholder="admin@skillseed.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <input type="password" value={createForm.password} onChange={e => setCreateForm({ ...createForm, password: e.target.value })}
                    className="block w-full rounded-md shadow-sm p-2.5 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white" placeholder="Min 6 characters" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="text" value={createForm.phone} onChange={e => setCreateForm({ ...createForm, phone: e.target.value })}
                      className="block w-full rounded-md shadow-sm p-2.5 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white" placeholder="Optional" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input type="text" value={createForm.address} onChange={e => setCreateForm({ ...createForm, address: e.target.value })}
                      className="block w-full rounded-md shadow-sm p-2.5 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white" placeholder="Optional" />
                  </div>
                </div>
                <button type="submit" disabled={createLoading}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                  {createLoading ? 'Creating...' : 'Create Admin Account'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ===================== Reviewer Requests Tab ===================== */}
        {activeTab === 'reviewer-requests' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Reviewer Requests</h2>
                <p className="text-sm text-gray-500 mt-1">Users who signed up as reviewers and are awaiting your approval.</p>
              </div>
              <button onClick={fetchReviewerRequests} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium border border-gray-200">
                ↻ Refresh
              </button>
            </div>

            {requestsLoading && (
              <div className="py-20 text-center text-gray-500">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-lg">Loading requests...</p>
              </div>
            )}

            {requestsError && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md mb-6 text-sm">{requestsError}</div>}

            {!requestsLoading && reviewerRequests.length === 0 && !requestsError && (
              <div className="py-20 text-center text-gray-500">
                <div className="text-5xl mb-4">✓</div>
                <p className="text-lg font-medium">No pending requests</p>
                <p className="text-sm mt-1">All reviewer requests have been processed.</p>
              </div>
            )}

            {!requestsLoading && reviewerRequests.length > 0 && (
              <div className="space-y-4">
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

        {/* ===================== Data Tabs (users / companies / reviewers) ===================== */}
        {activeTab !== 'profile' && activeTab !== 'reviewer-requests' && activeTab !== 'create-admin' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 capitalize">Manage {activeTab}</h2>
              {loading && <span className="ml-4 text-sm text-gray-500">Loading...</span>}
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md mb-6 text-sm">{error}</div>}
            {!loading && data.length === 0 && !error && <div className="py-20 text-center text-gray-500"><p className="text-lg">No {activeTab} found</p></div>}

            {!loading && data.length > 0 && (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      <th className="p-4 font-medium">Name</th>
                      <th className="p-4 font-medium">Contact</th>
                      <th className="p-4 font-medium">Role</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
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
                              <Link href={`/admin/users/${userId}`} className="font-semibold text-blue-600 hover:underline">
                                {name}
                              </Link>
                            ) : (
                              <span className="font-semibold text-gray-900">{name}</span>
                            )}
                            <div className="text-xs text-gray-400 font-mono mt-1">{id ? id.substring(0, 8) + '...' : 'N/A'}</div>
                          </td>
                          <td className="p-4 text-sm text-gray-600">{email}</td>
                          <td className="p-4"><span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium uppercase">{role}</span></td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded text-xs font-medium uppercase ${status === 'active' || status === 'approved' ? 'bg-green-100 text-green-700' : status === 'pending' ? 'bg-yellow-100 text-yellow-700' : status === 'suspended' || status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>{status}</span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            {userId && (
                              <Link href={`/admin/users/${userId}`} className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 text-xs font-medium inline-block">View</Link>
                            )}

                            {activeTab === 'users' && role === 'employee' && (
                              <button onClick={() => {
                                const eId = item.employee?.employeeId;
                                if (eId) promoteEmployee(eId);
                                else alert('Employee profile not found.');
                              }} className="bg-green-50 text-green-600 px-3 py-1.5 rounded hover:bg-green-100 text-xs font-medium border border-green-200">Promote</button>
                            )}

                            {activeTab === 'users' && (
                              <button onClick={() => deleteUser(id)} className="bg-red-50 text-red-600 px-3 py-1.5 rounded hover:bg-red-100 text-xs font-medium border border-red-200">Delete</button>
                            )}

                            {activeTab === 'reviewers' && (
                              <button onClick={() => demoteReviewer(id)} className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded hover:bg-orange-100 text-xs font-medium border border-orange-200">Demote</button>
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
    </>
  );
}
