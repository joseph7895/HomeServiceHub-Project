import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStats, fetchUsers, deleteUser, toggleWorkerApproval } from '../store/adminSlice';
import Loader from '../components/Loader';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, users, loading, error, success } = useSelector((state) => state.admin);
  const [activeTab, setActiveTab] = useState('analytics');

  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      dispatch(fetchStats());
      dispatch(fetchUsers());
    }
  }, [success, dispatch]);

  const handleDeleteUser = (userId, name) => {
    if (window.confirm(`Are you sure you want to permanently delete the account of "${name}"?`)) {
      dispatch(deleteUser(userId));
    }
  };

  const handleToggleApproval = (userId, currentStatus) => {
    const actionStr = currentStatus ? 'Suspend' : 'Approve';
    if (window.confirm(`Are you sure you want to ${actionStr} this worker?`)) {
      dispatch(toggleWorkerApproval({ id: userId, isApproved: !currentStatus }));
    }
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="flex-grow bg-gradient-brand py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Admin Console</h1>
            <p className="text-slate-400 text-sm mt-1 font-light">Monitor platform analytics, manage users, and approve service partners</p>
          </div>
          <button
            onClick={() => { dispatch(fetchStats()); dispatch(fetchUsers()); }}
            className="flex items-center space-x-2 bg-white/5 hover:bg-white/8 text-slate-300 hover:text-white font-semibold py-2 px-4 rounded-xl border border-white/8 transition-all text-xs"
          >
            <span>Refresh</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/25 text-red-300 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-white/8 gap-1">
          {['analytics', 'users', 'workers', 'recent-bookings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-4 text-sm font-semibold capitalize transition-all border-b-2 ${
                activeTab === tab
                  ? 'text-brand-400 border-brand-500'
                  : 'text-slate-500 border-transparent hover:text-slate-300'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* TAB 1: Analytics */}
        {activeTab === 'analytics' && stats && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center space-x-4">
                <span className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 flex-shrink-0 font-bold">
                  $
                </span>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Total Revenue</span>
                  <span className="text-2xl font-bold text-white">₹{stats.totalRevenue}</span>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center space-x-4">
                <span className="p-3 bg-brand-500/10 rounded-xl text-brand-400 flex-shrink-0 font-bold">
                  U
                </span>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Total Users</span>
                  <span className="text-2xl font-bold text-white">
                    {stats.users?.total} <span className="text-[10px] text-slate-400">({stats.users?.workers} Pros)</span>
                  </span>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center space-x-4">
                <span className="p-3 bg-sky-500/10 rounded-xl text-sky-400 flex-shrink-0 font-bold">
                  B
                </span>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Total Bookings</span>
                  <span className="text-2xl font-bold text-white">{stats.bookings?.total}</span>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center space-x-4">
                <span className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 flex-shrink-0 font-bold">
                  C
                </span>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Completed Jobs</span>
                  <span className="text-2xl font-bold text-white">
                    {stats.bookings?.completed} <span className="text-[10px] text-slate-400">done</span>
                  </span>
                </div>
              </div>

            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase">Service Category Popularity</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {stats.categoryStats?.map((c) => (
                  <div key={c._id} className="bg-white/3 p-4 rounded-xl border border-white/5 text-center space-y-1">
                    <span className="text-xs text-slate-400 capitalize block truncate font-medium">{c._id || 'General'}</span>
                    <span className="text-lg font-bold text-brand-400">{c.count} Jobs</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Users */}
        {activeTab === 'users' && (
          <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden animate-fadeIn">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/5 text-left text-xs">
                <thead className="bg-black/20 text-slate-400 uppercase font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Mobile</th>
                    <th className="px-6 py-4">Registered</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-white/3 transition-colors">
                      <td className="px-6 py-4 font-bold text-white">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`}
                            alt={u.name}
                            className="h-6 w-6 rounded-full border border-white/10"
                          />
                          <span>{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{u.email}</td>
                      <td className="px-6 py-4 capitalize">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          u.role === 'admin'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : u.role === 'worker'
                            ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                            : 'bg-white/5 text-slate-400 border border-white/8'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{u.phoneNumber || 'N/A'}</td>
                      <td className="px-6 py-4 text-slate-500">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-6 py-4 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(u._id, u.name)}
                            className="text-red-400 hover:text-red-300 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors font-bold text-xs"
                            title="Delete Account"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Workers */}
        {activeTab === 'workers' && (
          <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden animate-fadeIn">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/5 text-left text-xs">
                <thead className="bg-black/20 text-slate-400 uppercase font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Service Area</th>
                    <th className="px-6 py-4">Rating / Jobs</th>
                    <th className="px-6 py-4">Registered</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {users.filter(u => u.role === 'worker').map((u) => {
                    const isApproved = u.workerProfile?.isApproved !== false;
                    return (
                      <tr key={u._id} className="hover:bg-white/3 transition-colors">
                        <td className="px-6 py-4 font-bold text-white">
                          <div className="flex items-center space-x-2.5">
                            <img
                              src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`}
                              alt={u.name}
                              className="h-6 w-6 rounded-full border border-white/10"
                            />
                            <span>{u.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-400 capitalize">{u.workerProfile?.serviceArea || u.address || 'India'}</td>
                        <td className="px-6 py-4 font-medium text-slate-300">
                          {u.workerProfile ? (
                            <div className="flex items-center space-x-1">
                              <span className="text-amber-400 font-bold text-xs mr-1">★</span>
                              <span>{u.workerProfile.rating > 0 ? u.workerProfile.rating.toFixed(1) : 'New'} ({u.workerProfile.numReviews || 0})</span>
                            </div>
                          ) : 'New'}
                        </td>
                        <td className="px-6 py-4 text-slate-500">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                        <td className="px-6 py-4">
                          {isApproved ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">Active</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 font-bold">Suspended</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleToggleApproval(u._id, isApproved)}
                            className={`py-1.5 px-3 rounded-lg border border-white/8 text-[10px] font-bold transition-all hover:bg-white/5 ${
                              isApproved ? 'text-amber-400 hover:text-amber-300' : 'text-emerald-400 hover:text-emerald-300'
                            }`}
                          >
                            {isApproved ? 'Suspend' : 'Approve'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Recent Bookings */}
        {activeTab === 'recent-bookings' && stats && (
          <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden animate-fadeIn">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/5 text-left text-xs">
                <thead className="bg-black/20 text-slate-400 uppercase font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Professional</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {stats.recentBookings?.map((b) => (
                    <tr key={b._id} className="hover:bg-white/3 transition-colors">
                      <td className="px-6 py-4 font-bold text-white">{b.customer?.name}</td>
                      <td className="px-6 py-4 font-semibold text-slate-300">{b.worker?.name}</td>
                      <td className="px-6 py-4 capitalize text-slate-400">{b.serviceCategory}</td>
                      <td className="px-6 py-4 text-slate-500">{new Date(b.bookingDate).toLocaleDateString('en-IN')}</td>
                      <td className="px-6 py-4 font-bold text-brand-400">₹{b.totalAmount}</td>
                      <td className="px-6 py-4 capitalize">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          b.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400'
                          : b.status === 'cancelled' ? 'bg-red-500/10 text-red-400'
                          : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
