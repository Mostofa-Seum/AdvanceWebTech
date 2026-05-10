'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  AcademicCapIcon,
  HomeIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CheckBadgeIcon,
  CreditCardIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  BellIcon,
  ArrowUpIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  CubeIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

export default function ReviewerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Dashboard');
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

  const menuItems = [
    { name: 'Dashboard', icon: HomeIcon },
    { name: 'Verify Company', icon: BuildingOfficeIcon },
    { name: 'Verify Users', icon: UserGroupIcon },
    { name: 'Work Verifications', icon: CheckBadgeIcon },
    { name: 'Payments', icon: CreditCardIcon },
    { name: 'Review Reports', icon: DocumentTextIcon },
  ];

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
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors group ${
                  activeTab === item.name
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className={`h-5 w-5 mr-3 ${activeTab === item.name ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'}`} />
                {item.name}
              </button>
            ))}
          </div>
        </nav>
        
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
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{activeTab}</h1>
                <p className="text-gray-600 text-sm mt-1">Welcome back, here's what's happening today</p>
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

        {/* Dynamic Content Area */}
        <main className="p-6">
          {activeTab === 'Dashboard' && (
            <DashboardProfile sessionUser={user} />
          )}

          {activeTab === 'Verify Company' && (
            <VerifyCompanyModule sessionUser={user} />
          )}

          {activeTab === 'Verify Users' && (
            <VerifyUserModule sessionUser={user} />
          )}

          {activeTab === 'Work Verifications' && (
            <WorkVerificationsModule sessionUser={user} />
          )}

          {activeTab === 'Payments' && (
            <PaymentsModule sessionUser={user} />
          )}

          {activeTab !== 'Dashboard' && activeTab !== 'Verify Company' && activeTab !== 'Verify Users' && activeTab !== 'Work Verifications' && activeTab !== 'Payments' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center mt-8">
              <h2 className="text-2xl font-semibold text-gray-900">{activeTab}</h2>
              <p className="text-gray-500 mt-2">This module is currently under construction and will be available soon.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function DashboardProfile({ sessionUser }: { sessionUser: any }) {
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionUser?.reviewer?.reviewerId) {
        setLoading(false);
        return;
    }

    // Fetch profile
    axios.get(`http://localhost:3000/reviewer/profile/${sessionUser.reviewer.reviewerId}`)
      .then(res => {
        setProfile(res.data);
        setFormData({
          name: res.data.user?.fullName || '',
          email: res.data.user?.email || '',
          phone: res.data.user?.phone || '',
          address: res.data.user?.address || ''
        });
      })
      .catch(err => {
          console.error(err);
      })
      .finally(() => setLoading(false));
  }, [sessionUser]);

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3000/reviewer/profile/${sessionUser.reviewer.reviewerId}`, formData);
      setIsEditing(false);
      // Update local profile state to reflect changes
      setProfile((prev: any) => ({
        ...prev,
        user: { 
            ...prev?.user, 
            fullName: formData.name, 
            email: formData.email, 
            phone: formData.phone, 
            address: formData.address 
        }
      }));
      // Optional: Update localStorage user object as well so the sidebar updates instantly
      const savedUserStr = localStorage.getItem('user');
      if (savedUserStr) {
          const savedUser = JSON.parse(savedUserStr);
          savedUser.fullName = formData.name;
          savedUser.email = formData.email;
          savedUser.phone = formData.phone;
          savedUser.address = formData.address;
          localStorage.setItem('user', JSON.stringify(savedUser));
          // Note: a page refresh might be needed to update the sidebar if not using global state.
      }
      alert('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    }
  };

  if (loading) return <div className="text-gray-500 text-center mt-12">Loading profile data...</div>;

  if (!profile) return <div className="text-gray-500 text-center mt-12">Unable to load profile data. Ensure you are logged in correctly.</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-2xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">My Profile</h2>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium"
          >
            Update
          </button>
        ) : (
          <div className="space-x-3">
             <button 
                onClick={() => setIsEditing(false)} 
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
             >
                Cancel
             </button>
             <button 
                onClick={handleUpdate} 
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm font-medium"
             >
                Save
             </button>
          </div>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input 
            type="text" 
            disabled={!isEditing}
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className={`block w-full rounded-md shadow-sm p-2.5 border transition-colors ${
                isEditing 
                ? "border-blue-300 focus:border-blue-500 focus:ring-blue-500 bg-white" 
                : "border-gray-200 bg-gray-50 text-gray-600"
            }`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            disabled={!isEditing}
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            className={`block w-full rounded-md shadow-sm p-2.5 border transition-colors ${
                isEditing 
                ? "border-blue-300 focus:border-blue-500 focus:ring-blue-500 bg-white" 
                : "border-gray-200 bg-gray-50 text-gray-600"
            }`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input 
            type="text" 
            disabled={!isEditing}
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
            className={`block w-full rounded-md shadow-sm p-2.5 border transition-colors ${
                isEditing 
                ? "border-blue-300 focus:border-blue-500 focus:ring-blue-500 bg-white" 
                : "border-gray-200 bg-gray-50 text-gray-600"
            }`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input 
            type="text" 
            disabled={!isEditing}
            value={formData.address}
            onChange={e => setFormData({...formData, address: e.target.value})}
            className={`block w-full rounded-md shadow-sm p-2.5 border transition-colors ${
                isEditing 
                ? "border-blue-300 focus:border-blue-500 focus:ring-blue-500 bg-white" 
                : "border-gray-200 bg-gray-50 text-gray-600"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

function VerifyCompanyModule({ sessionUser }: { sessionUser: any }) {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/reviewer/companies/pending');
      setCompanies(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (companyId: string, status: string) => {
    if (!sessionUser?.reviewer?.reviewerId) {
      alert('Reviewer session not found. Please log in again.');
      return;
    }
    
    // Optimistically update UI
    setCompanies(prev => prev.filter(c => c.companyId !== companyId));
    
    try {
      await axios.patch(`http://localhost:3000/reviewer/companies/${companyId}/status`, {
        status,
        reviewerId: sessionUser.reviewer.reviewerId
      });
    } catch (err) {
      console.error(err);
      alert('Failed to update company status');
      fetchCompanies(); // Revert on failure
    }
  };

  if (loading) return <div className="text-gray-500 text-center mt-12">Loading pending companies...</div>;

  if (companies.length === 0) return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center mt-8">
      <h2 className="text-2xl font-semibold text-gray-900">All Caught Up!</h2>
      <p className="text-gray-500 mt-2">There are no pending companies waiting for verification.</p>
    </div>
  );

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Pending Company Verifications</h2>
      {companies.map((company) => (
        <div key={company.companyId} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{company.companyName}</h3>
            {company.website && (
               <p className="text-sm text-blue-600 mt-1 hover:underline">
                 <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer">
                   {company.website}
                 </a>
               </p>
            )}
            <p className="text-sm text-gray-600 mt-2 line-clamp-3">
               <strong>Description:</strong> {company.description || 'No description provided.'}
            </p>
          </div>
          <div className="flex space-x-3 shrink-0">
            <button 
              onClick={() => handleUpdateStatus(company.companyId, 'active')}
              className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 rounded-lg transition-colors font-medium text-sm flex items-center"
            >
              <CheckBadgeIcon className="w-5 h-5 mr-1" />
              Accept
            </button>
            <button 
              onClick={() => handleUpdateStatus(company.companyId, 'rejected')}
              className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg transition-colors font-medium text-sm flex items-center"
            >
              <TrashIcon className="w-5 h-5 mr-1" />
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function VerifyUserModule({ sessionUser }: { sessionUser: any }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/reviewer/users/pending');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (userId: string, status: string, isEmailVerified: boolean, isPhoneVerified: boolean) => {
    if (!sessionUser?.reviewer?.reviewerId) {
      alert('Reviewer session not found. Please log in again.');
      return;
    }
    
    // Optimistically update UI
    setUsers(prev => prev.filter(u => u.userId !== userId));
    
    try {
      await axios.patch(`http://localhost:3000/reviewer/users/${userId}/status`, {
        status,
        isEmailVerified,
        isPhoneVerified,
        reviewerId: sessionUser.reviewer.reviewerId
      });
    } catch (err) {
      console.error(err);
      alert('Failed to update user status');
      fetchUsers(); // Revert on failure
    }
  };

  if (loading) return <div className="text-gray-500 text-center mt-12">Loading pending users...</div>;

  if (users.length === 0) return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center mt-8">
      <h2 className="text-2xl font-semibold text-gray-900">All Caught Up!</h2>
      <p className="text-gray-500 mt-2">There are no pending employee users waiting for verification.</p>
    </div>
  );

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Pending User Verifications</h2>
      {users.map((user) => (
        <div key={user.userId} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{user.fullName || 'No Name Provided'}</h3>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Email:</strong> {user.email}
            </p>
            {user.phone && (
              <p className="text-sm text-gray-600 mt-1">
                <strong>Phone:</strong> {user.phone}
              </p>
            )}
            <p className="text-sm text-gray-600 mt-1">
               <strong>Address:</strong> {user.address || 'N/A'}
            </p>
          </div>
          <div className="flex space-x-3 shrink-0">
            <button 
              onClick={() => handleUpdateStatus(user.userId, 'active', true, true)}
              className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 rounded-lg transition-colors font-medium text-sm flex items-center"
            >
              <CheckBadgeIcon className="w-5 h-5 mr-1" />
              Accept
            </button>
            <button 
              onClick={() => handleUpdateStatus(user.userId, 'rejected', false, false)}
              className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg transition-colors font-medium text-sm flex items-center"
            >
              <TrashIcon className="w-5 h-5 mr-1" />
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function WorkVerificationsModule({ sessionUser }: { sessionUser: any }) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [revisionInputs, setRevisionInputs] = useState<Record<string, string>>({});
  const [showRevisionFor, setShowRevisionFor] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/reviewer/work/pending');
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (submissionId: string, status: string, comments?: string) => {
    if (!sessionUser?.reviewer?.reviewerId) {
      alert('Reviewer session not found. Please log in again.');
      return;
    }
    
    // Optimistically update UI
    setSubmissions(prev => prev.filter(s => s.submissionId !== submissionId));
    
    try {
      await axios.post(`http://localhost:3000/reviewer/work/${submissionId}/review`, {
        status,
        comments: comments || undefined,
        reviewerId: sessionUser.reviewer.reviewerId
      });
      if (showRevisionFor === submissionId) {
        setShowRevisionFor(null);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update submission status');
      fetchSubmissions(); // Revert on failure
    }
  };

  if (loading) return <div className="text-gray-500 text-center mt-12">Loading pending submissions...</div>;

  if (submissions.length === 0) return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center mt-8">
      <h2 className="text-2xl font-semibold text-gray-900">All Caught Up!</h2>
      <p className="text-gray-500 mt-2">There are no pending work submissions waiting for verification.</p>
    </div>
  );

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Pending Work Verifications</h2>
      {submissions.map((sub) => {
        const job = sub.assignedJob?.job;
        return (
          <div key={sub.submissionId} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Job: {job?.title || 'Unknown Job'}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                <strong>Description:</strong> {job?.description || 'N/A'}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-2">Submission Details</h4>
              <p className="text-sm text-gray-700">
                 <strong>Text:</strong> {sub.submissionText || 'No text provided.'}
              </p>
              {sub.fileUrl && (
                 <p className="text-sm text-blue-600 mt-1 hover:underline truncate">
                   <strong>File:</strong> <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer">{sub.fileUrl}</a>
                 </p>
              )}
              {sub.liveLink && (
                 <p className="text-sm text-blue-600 mt-1 hover:underline truncate">
                   <strong>Live Link:</strong> <a href={sub.liveLink.startsWith('http') ? sub.liveLink : `https://${sub.liveLink}`} target="_blank" rel="noopener noreferrer">{sub.liveLink}</a>
                 </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-2 sm:items-center sm:justify-end">
              {showRevisionFor === sub.submissionId ? (
                <div className="flex-1 flex gap-2 w-full">
                  <input 
                    type="text" 
                    placeholder="Enter revision instructions..." 
                    className="flex-1 rounded-lg border border-gray-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    value={revisionInputs[sub.submissionId] || ''}
                    onChange={(e) => setRevisionInputs({...revisionInputs, [sub.submissionId]: e.target.value})}
                  />
                  <button 
                    onClick={() => handleReview(sub.submissionId, 'revision_requested', revisionInputs[sub.submissionId])}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    disabled={!revisionInputs[sub.submissionId]}
                  >
                    Send
                  </button>
                  <button 
                    onClick={() => setShowRevisionFor(null)}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleReview(sub.submissionId, 'approved')}
                    className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 rounded-lg transition-colors font-medium text-sm flex items-center justify-center flex-1 sm:flex-none"
                  >
                    <CheckBadgeIcon className="w-5 h-5 mr-1" />
                    Accept
                  </button>
                  <button 
                    onClick={() => handleReview(sub.submissionId, 'rejected')}
                    className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg transition-colors font-medium text-sm flex items-center justify-center flex-1 sm:flex-none"
                  >
                    <TrashIcon className="w-5 h-5 mr-1" />
                    Reject
                  </button>
                  <button 
                    onClick={() => setShowRevisionFor(sub.submissionId)}
                    className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-4 py-2 rounded-lg transition-colors font-medium text-sm flex items-center justify-center flex-1 sm:flex-none"
                  >
                    <PencilIcon className="w-5 h-5 mr-1" />
                    Revision
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PaymentsModule({ sessionUser }: { sessionUser: any }) {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/reviewer/payments/pending');
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRelease = async (paymentId: string) => {
    if (!sessionUser?.reviewer?.reviewerId) {
      alert('Reviewer session not found. Please log in again.');
      return;
    }
    
    // Optimistically update UI
    setPayments(prev => prev.filter(p => p.paymentId !== paymentId));
    
    try {
      await axios.patch(`http://localhost:3000/reviewer/payments/${paymentId}/release`);
      alert('Payment released successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to release payment');
      fetchPayments(); // Revert on failure
    }
  };

  if (loading) return <div className="text-gray-500 text-center mt-12">Loading pending payments...</div>;

  if (payments.length === 0) return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center mt-8">
      <h2 className="text-2xl font-semibold text-gray-900">All Clear!</h2>
      <p className="text-gray-500 mt-2">There are no pending payments to process.</p>
    </div>
  );

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Pending Payments</h2>
      {payments.map((payment) => {
        const job = payment.job;
        const company = job?.company;
        const employeeName = payment.employeeUser?.fullName || 'Unknown Employee';
        
        return (
          <div key={payment.paymentId} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Job: {job?.title || 'Unknown Job'}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  <strong>Description:</strong> {job?.description || 'N/A'}
                </p>
                <div className="mt-2 text-sm text-gray-700 flex flex-wrap gap-x-6 gap-y-2">
                  <span><strong>Status:</strong> {job?.status}</span>
                  <span><strong>Budget:</strong> ${job?.budget}</span>
                  <span><strong>Company:</strong> {company?.companyName || 'Unknown Company'}</span>
                  <span><strong>Employee:</strong> {employeeName}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h4 className="font-semibold text-blue-900">Payment Details</h4>
                <p className="text-sm text-blue-800 mt-1">
                  <strong>Amount:</strong> ${payment.amount} <br />
                  <strong>Method:</strong> {payment.paymentMethod || 'N/A'}
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0">
                <button 
                  onClick={() => handleRelease(payment.paymentId)}
                  className="bg-blue-600 text-white hover:bg-blue-700 px-5 py-2.5 rounded-lg transition-colors font-medium text-sm shadow-sm flex items-center"
                >
                  <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                  Transfer to Employee
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
