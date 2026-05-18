'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type TabType = 'users' | 'companies' | 'reviewers' | 'profile';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<{isOpen:boolean; type:string; data:any}>({ isOpen: false, type: 'user', data: null });
  const [adminUser, setAdminUser] = useState<any>(null);

  // Profile state
  const [profileForm, setProfileForm] = useState({ fullName: '', email: '', phone: '', address: '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwMsg, setPwMsg] = useState('');
  const [pwErr, setPwErr] = useState('');

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
    if (activeTab !== 'profile') fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab: TabType) => {
    setLoading(true); setError(''); setData([]);
    try {
      const res = await axios.get(`http://localhost:3000/admin/${tab}`);
      setData(res.data);
    } catch (err: any) {
      setError(`Failed to load ${tab}. ` + (err.response?.data?.message || ''));
    } finally { setLoading(false); }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try { await axios.delete(`http://localhost:3000/admin/users/${id}`); fetchData(activeTab); }
    catch (err: any) { alert('Error: ' + (err.response?.data?.message || err.message)); }
  };

  const demoteReviewer = async (id: string) => {
    if (!confirm('Demote this reviewer to employee?')) return;
    try { await axios.patch(`http://localhost:3000/admin/reviewers/${id}/demote`); fetchData(activeTab); }
    catch (err: any) { alert('Error: ' + (err.response?.data?.message || err.message)); }
  };

  const promoteEmployee = async (id: string) => {
    if (!confirm('Promote this employee to reviewer?')) return;
    try { await axios.patch(`http://localhost:3000/admin/employees/${id}/promote`); fetchData(activeTab); }
    catch (err: any) { alert('Error: ' + (err.response?.data?.message || err.message)); }
  };

  const updateStatus = async (id: string, status: string, endpoint: string) => {
    try { await axios.patch(`http://localhost:3000/admin/${endpoint}/${id}/status`, { status }); fetchData(activeTab); }
    catch (err: any) { alert('Error: ' + (err.response?.data?.message || err.message)); }
  };

  const handleLogout = () => { localStorage.removeItem('user'); router.push('/login'); };

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

  const tabs: { key: TabType; label: string }[] = [
    { key: 'users', label: 'Users' }, { key: 'companies', label: 'Companies' },
    { key: 'reviewers', label: 'Reviewers' }, { key: 'profile', label: 'My Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-10">
      <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Admin Central</h1>
          <button onClick={handleLogout} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium">Logout</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 mt-4 space-y-6">
        {/* Tabs */}
        <div className="flex space-x-2 border-b border-gray-200 pb-2">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-t-lg text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-white border border-gray-200 border-b-white -mb-[9px] text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-transparent'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
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

        {/* Data Tabs (users / companies / reviewers) */}
        {activeTab !== 'profile' && (
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
                      return (
                        <tr key={id || idx} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div className="font-semibold text-blue-600 cursor-pointer hover:underline" onClick={() => setModal({ isOpen: true, type: activeTab.slice(0, -1), data: item })}>{name}</div>
                            <div className="text-xs text-gray-400 font-mono mt-1">{id ? id.substring(0, 8) + '...' : 'N/A'}</div>
                          </td>
                          <td className="p-4 text-sm text-gray-600">{email}</td>
                          <td className="p-4"><span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium uppercase">{role}</span></td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded text-xs font-medium uppercase ${status === 'active' || status === 'approved' ? 'bg-green-100 text-green-700' : status === 'pending' ? 'bg-yellow-100 text-yellow-700' : status === 'suspended' || status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>{status}</span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button onClick={() => setModal({ isOpen: true, type: activeTab.slice(0, -1), data: item })} className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 text-xs font-medium">View</button>

                            {/* Promote button for employees (in users tab where role=employee) */}
                            {activeTab === 'users' && role === 'employee' && (
                              <button onClick={() => {
                                // Need to find the employeeId — fetch from user relations
                                const eId = item.employee?.employeeId;
                                if (eId) promoteEmployee(eId);
                                else alert('Employee profile not found. View user details first.');
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
      </main>

      {/* Details Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-900 capitalize">{modal.type} Details</h3>
              <button onClick={() => setModal({ ...modal, isOpen: false })} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div><p className="text-sm font-medium text-gray-500 mb-1">Name</p><p className="text-gray-900">{modal.data.fullName || modal.data.user?.fullName || modal.data.companyName || 'N/A'}</p></div>
                <div><p className="text-sm font-medium text-gray-500 mb-1">Email <span className="text-xs text-gray-400">(Read-only)</span></p><p className="text-gray-900">{modal.data.email || modal.data.user?.email || 'N/A'}</p></div>
                <div><p className="text-sm font-medium text-gray-500 mb-1">Phone</p><p className="text-gray-900">{modal.data.phone || modal.data.user?.phone || 'N/A'}</p></div>
                <div><p className="text-sm font-medium text-gray-500 mb-1">Address</p><p className="text-gray-900">{modal.data.address || modal.data.user?.address || 'N/A'}</p></div>
              </div>
              <hr className="border-gray-200" />

              {/* Status management */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Management</label>
                <select className="block w-full rounded-md shadow-sm p-2.5 border border-gray-300 focus:border-blue-500 bg-white"
                  value={modal.data.status || modal.data.user?.status || 'active'}
                  onChange={(e) => { updateStatus(modal.data.userId || modal.data.companyId || modal.data.reviewerId, e.target.value, activeTab); setModal({ ...modal, isOpen: false }); }}>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  {modal.type === 'company' && <option value="rejected">Rejected</option>}
                </select>
              </div>

              {/* Role actions — only employee ↔ reviewer */}
              {modal.type === 'user' && (modal.data.role === 'employee' || modal.data.role === 'reviewer') && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Role Management</p>
                  {modal.data.role === 'employee' && (
                    <button onClick={() => { const eId = modal.data.employee?.employeeId; if (eId) { promoteEmployee(eId); setModal({ ...modal, isOpen: false }); } else alert('Employee profile not linked.'); }}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium">
                      Promote to Reviewer
                    </button>
                  )}
                  {modal.data.role === 'reviewer' && (
                    <button onClick={() => { const rId = modal.data.reviewer?.reviewerId; if (rId) { demoteReviewer(rId); setModal({ ...modal, isOpen: false }); } else alert('Reviewer profile not linked.'); }}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 text-sm font-medium">
                      Demote to Employee
                    </button>
                  )}
                </div>
              )}

              {modal.type === 'company' && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-md p-3"><p className="text-xs text-yellow-700 font-medium">Company roles cannot be changed.</p></div>
              )}

              <div className="bg-blue-50 border border-blue-100 rounded-md p-3 text-center">
                <p className="text-xs text-blue-700 font-medium">Security Note: User passwords and credentials are not accessible.</p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button onClick={() => setModal({ ...modal, isOpen: false })} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm font-medium">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
