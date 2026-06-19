import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings, updateBookingStatus } from '../store/bookingSlice';
import Loader from '../components/Loader';

const WorkerDashboard = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.bookings);
  const { userInfo } = useSelector((state) => state.auth);

  const [activeNoteBookingId, setActiveNoteBookingId] = useState(null);
  const [statusNote, setStatusNote] = useState('');
  const [targetStatus, setTargetStatus] = useState('');

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const handleUpdateStatusTrigger = (bookingId, nextStatus) => {
    setActiveNoteBookingId(bookingId);
    setTargetStatus(nextStatus);
    setStatusNote('');
  };

  const handleSaveStatusUpdate = (e) => {
    e.preventDefault();
    dispatch(
      updateBookingStatus({
        id: activeNoteBookingId,
        status: targetStatus,
        notes: statusNote || `Status updated to ${targetStatus}`,
      })
    );
    setActiveNoteBookingId(null);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending:       'bg-amber-500/10 border-amber-500/25 text-amber-400',
      accepted:      'bg-sky-500/10 border-sky-500/25 text-sky-400',
      'in-progress': 'bg-indigo-500/10 border-indigo-500/25 text-indigo-400',
      completed:     'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
      cancelled:     'bg-red-500/10 border-red-500/25 text-red-400',
    };
    return badges[status] || 'bg-white/5 text-slate-400';
  };

  return (
    <div className="flex-grow bg-gradient-brand py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Left: Worker Profile Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-5">
            <h2 className="text-xs font-bold text-slate-400 tracking-widest uppercase border-b border-white/5 pb-2.5">
              My Profile
            </h2>

            {userInfo && (
              <div className="space-y-4 text-center">
                <img
                  src={userInfo.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${userInfo.name}`}
                  alt={userInfo.name}
                  className="h-16 w-16 rounded-full border-2 border-brand-500/50 object-cover mx-auto"
                />
                <div>
                  <h3 className="font-bold text-white leading-snug">{userInfo.name}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 capitalize">{userInfo.workerProfile?.skills?.join(', ')}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-white/3 p-3 rounded-xl border border-white/5 text-xs">
                  <div>
                    <span className="block text-[9px] text-slate-500 uppercase font-semibold tracking-wider">Rating</span>
                    <div className="flex items-center justify-center space-x-0.5 mt-0.5">
                      <span className="text-amber-400 font-bold text-sm">★</span>
                      <span className="font-bold text-slate-300">
                        {userInfo.workerProfile?.rating > 0 ? userInfo.workerProfile.rating.toFixed(1) : 'New'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-500 uppercase font-semibold tracking-wider">Jobs</span>
                    <span className="font-bold text-slate-300 block mt-0.5">{userInfo.workerProfile?.numReviews || 0}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Bookings */}
        <div className="lg:col-span-3 space-y-8">

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white">Service Requests</h1>
              <p className="text-slate-400 text-sm mt-1 font-light">Accept jobs, update progress, and manage your schedule</p>
            </div>
            <button
              onClick={() => dispatch(fetchBookings())}
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

          {loading ? (
            <Loader size="large" />
          ) : bookings.length === 0 ? (
            <div className="glass-panel text-center py-16 rounded-2xl border border-white/5">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-500 font-bold text-lg">
                Ø
              </div>
              <h3 className="text-lg font-bold text-white">No Service Requests</h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto mt-2 font-light">
                No bookings yet. Keep your profile updated and service area active to receive requests.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookings.map((booking) => (
                <div key={booking._id} className="glass-card rounded-2xl p-6 flex flex-col justify-between space-y-4 border border-white/5">

                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={booking.customer?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${booking.customer?.name}`}
                        alt={booking.customer?.name}
                        className="h-11 w-11 rounded-full border border-white/10 object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-white leading-snug">{booking.customer?.name}</h3>
                        <p className="text-[10px] text-slate-400 truncate">{booking.customer?.phoneNumber || 'No phone provided'}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold border px-2.5 py-1 rounded-full capitalize ${getStatusBadge(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-white/3 p-3 rounded-xl border border-white/5 text-xs">
                    <div>
                      <span className="block text-[9px] text-slate-500 uppercase font-semibold tracking-wider">Date</span>
                      <span className="font-bold text-slate-300">{new Date(booking.bookingDate).toLocaleDateString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-500 uppercase font-semibold tracking-wider">Time</span>
                      <span className="font-bold text-slate-300 truncate block">{booking.bookingTime}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-500 uppercase font-semibold tracking-wider">Earnings</span>
                      <span className="font-bold text-brand-400">₹{booking.totalAmount}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[9px] text-slate-500 uppercase font-semibold tracking-wider">Service Address</span>
                    <p className="text-xs text-slate-300 leading-snug font-light">{booking.address}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[9px] text-slate-500 uppercase font-semibold tracking-wider">Work Description</span>
                    <p className="text-xs text-slate-400 leading-snug font-light line-clamp-2 italic">"{booking.description}"</p>
                  </div>

                  {booking.notes && (
                    <div className="bg-indigo-500/5 border border-indigo-500/10 p-2.5 rounded-lg text-[10px] text-indigo-300 pl-3">
                      <span className="font-bold">Note: </span>
                      <span className="italic">"{booking.notes}"</span>
                    </div>
                  )}

                  {/* Status Actions */}
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-white/5">

                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatusTrigger(booking._id, 'cancelled')}
                          className="bg-red-500/8 hover:bg-red-500/15 text-red-400 border border-red-500/15 text-xs font-semibold py-1.5 px-3 rounded-lg transition-all"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleUpdateStatusTrigger(booking._id, 'accepted')}
                          className="btn-primary text-xs font-bold py-1.5 px-4 rounded-lg"
                        >
                          Accept
                        </button>
                      </>
                    )}

                    {booking.status === 'accepted' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatusTrigger(booking._id, 'cancelled')}
                          className="bg-red-500/8 hover:bg-red-500/15 text-red-400 border border-red-500/15 text-xs font-semibold py-1.5 px-3 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdateStatusTrigger(booking._id, 'in-progress')}
                          className="btn-primary text-xs font-bold py-1.5 px-4 rounded-lg"
                        >
                          Start Work
                        </button>
                      </>
                    )}

                    {booking.status === 'in-progress' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatusTrigger(booking._id, 'cancelled')}
                          className="bg-red-500/8 hover:bg-red-500/15 text-red-400 border border-red-500/15 text-xs font-semibold py-1.5 px-3 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdateStatusTrigger(booking._id, 'completed')}
                          className="bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold py-1.5 px-4 rounded-lg shadow-md transition-all"
                        >
                          Mark Completed
                        </button>
                      </>
                    )}

                    {booking.status === 'completed' && (
                      <span className="text-emerald-400 text-xs font-semibold flex items-center space-x-1">
                        <span>Completed</span>
                      </span>
                    )}

                    {booking.status === 'cancelled' && (
                      <span className="text-red-400 text-xs italic">Cancelled</span>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Status Update Modal */}
      {activeNoteBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 glass-panel rounded-3xl shadow-2xl border border-white/8">
            <h3 className="text-lg font-bold text-white mb-1">Confirm Status Change</h3>
            <p className="text-xs text-slate-400 font-light mb-5 capitalize">
              Update status to: <span className="text-brand-400 font-bold">{targetStatus}</span>
            </p>

            <form onSubmit={handleSaveStatusUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Message to Customer (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. On my way, starting shortly..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="glass-input w-full rounded-xl p-3 text-xs focus:outline-none placeholder-slate-600"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-1">
                <button
                  type="button"
                  onClick={() => setActiveNoteBookingId(null)}
                  className="bg-white/5 hover:bg-white/8 text-slate-400 hover:text-white font-semibold py-2 px-4 rounded-xl text-xs border border-white/8 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2.5 px-5 rounded-xl text-xs font-bold"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default WorkerDashboard;
