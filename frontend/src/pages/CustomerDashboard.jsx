import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings, updateBookingStatus } from '../store/bookingSlice';
import { reviewService } from '../services/api';
import Loader from '../components/Loader';

const CustomerDashboard = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.bookings);
  const { userInfo } = useSelector((state) => state.auth);

  const [activeReviewBooking, setActiveReviewBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [alreadyReviewed, setAlreadyReviewed] = useState({});

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      dispatch(updateBookingStatus({ id: bookingId, status: 'cancelled', notes: 'Cancelled by customer' }));
    }
  };

  const handleOpenReview = (booking) => {
    setActiveReviewBooking(booking);
    setRating(5);
    setComment('');
    setReviewFeedback('');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment) return;
    setSubmittingReview(true);
    try {
      await reviewService.createReview({
        bookingId: activeReviewBooking._id,
        rating,
        comment,
      });
      setReviewFeedback('Thank you! Your review has been submitted.');
      setAlreadyReviewed({ ...alreadyReviewed, [activeReviewBooking._id]: true });
      setTimeout(() => {
        setActiveReviewBooking(null);
        dispatch(fetchBookings());
      }, 2500);
    } catch (err) {
      setReviewFeedback(`Failed to submit: ${err.message}`);
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending:     'bg-amber-500/10 border-amber-500/25 text-amber-400',
      accepted:    'bg-sky-500/10 border-sky-500/25 text-sky-400',
      'in-progress': 'bg-indigo-500/10 border-indigo-500/25 text-indigo-400',
      completed:   'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
      cancelled:   'bg-red-500/10 border-red-500/25 text-red-400',
    };
    return badges[status] || 'bg-white/5 text-slate-400';
  };

  return (
    <div className="flex-grow bg-gradient-brand py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white">My Bookings</h1>
            <p className="text-slate-400 text-sm mt-1 font-light">Track your service requests and manage appointments</p>
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
            <h3 className="text-lg font-bold text-white">No Bookings Yet</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto mt-2 font-light">
              You haven't booked any services yet. Search for professionals to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="glass-card rounded-2xl p-6 flex flex-col justify-between space-y-4 border border-white/5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={booking.worker?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${booking.worker?.name}`}
                      alt={booking.worker?.name}
                      className="h-11 w-11 rounded-full border border-white/10 object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-white leading-snug">{booking.worker?.name}</h3>
                      <p className="text-[10px] text-slate-400 capitalize">{booking.serviceCategory}</p>
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
                    <span className="block text-[9px] text-slate-500 uppercase font-semibold tracking-wider">Amount</span>
                    <span className="font-bold text-brand-400">₹{booking.totalAmount}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="block text-[9px] text-slate-500 uppercase font-semibold tracking-wider">Description</span>
                  <p className="text-xs text-slate-400 leading-snug font-light line-clamp-2">{booking.description}</p>
                </div>

                {booking.notes && (
                  <div className="bg-indigo-500/5 border border-indigo-500/10 p-2.5 rounded-lg text-[10px] text-indigo-300 pl-3">
                    <span className="font-bold">Partner Update: </span>
                    <span className="italic">"{booking.notes}"</span>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-white/5">
                  {(booking.status === 'pending' || booking.status === 'accepted') && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="bg-red-500/8 hover:bg-red-500/15 text-red-400 border border-red-500/15 hover:border-red-500/30 text-xs font-semibold py-2 px-4 rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                  )}

                  {booking.status === 'completed' && (
                    alreadyReviewed[booking._id] ? (
                      <span className="text-brand-400 bg-brand-500/8 border border-brand-500/15 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1">
                        <span>Reviewed</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleOpenReview(booking)}
                        className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md transition-all flex items-center space-x-1"
                      >
                        <span>Rate &amp; Review</span>
                      </button>
                    )
                  )}

                  {booking.status === 'cancelled' && (
                    <span className="text-slate-500 text-xs italic">Cancelled</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        {activeReviewBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md p-6 glass-panel rounded-3xl shadow-2xl border border-white/8">
              <h3 className="text-lg font-bold text-white mb-1">Write a Review</h3>
              <p className="text-xs text-slate-400 font-light mb-5">
                Rating for <span className="font-bold text-brand-400">{activeReviewBooking.worker?.name}</span>
              </p>

              {reviewFeedback && (
                <div className={`p-3 rounded-xl text-xs text-center mb-4 border ${
                  reviewFeedback.startsWith('Thank')
                    ? 'bg-emerald-950/20 border-emerald-500/25 text-emerald-300'
                    : 'bg-red-950/20 border-red-500/25 text-red-300'
                }`}>
                  {reviewFeedback}
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2.5 pl-0.5">Your Rating</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        className="p-1 hover:scale-110 transition-transform text-2xl font-bold"
                      >
                        <span className={num <= rating ? 'text-amber-400' : 'text-slate-700'}>★</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Your Comments</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Share your experience — quality, punctuality, professionalism..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="glass-input w-full rounded-xl p-3 text-xs focus:outline-none placeholder-slate-600"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveReviewBooking(null)}
                    className="bg-white/5 hover:bg-white/8 text-slate-400 hover:text-white font-semibold py-2 px-4 rounded-xl text-xs border border-white/8 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="btn-primary py-2.5 px-5 rounded-xl text-xs font-bold disabled:opacity-50"
                  >
                    {submittingReview ? <Loader size="small" /> : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CustomerDashboard;
