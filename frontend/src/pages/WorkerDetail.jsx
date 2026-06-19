import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkerDetail, clearWorkerState } from '../store/workerSlice';
import { createBooking, clearBookingState } from '../store/bookingSlice';
import Loader from '../components/Loader';

const SERVICE_SLOTS = [
  '08:00 AM - 10:00 AM',
  '10:00 AM - 12:00 PM',
  '12:00 PM - 02:00 PM',
  '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM',
];

const WorkerDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentWorker, loading: workerLoading, error: workerError } = useSelector((state) => state.workers);
  const { userInfo } = useSelector((state) => state.auth);
  const { success: bookingSuccess, loading: bookingLoading, error: bookingError } = useSelector((state) => state.bookings);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('2');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    dispatch(fetchWorkerDetail(id));
    return () => {
      dispatch(clearWorkerState());
      dispatch(clearBookingState());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (currentWorker && currentWorker.profile && currentWorker.profile.skills?.length > 0) {
      setSelectedCategory(currentWorker.profile.skills[0]);
    }
  }, [currentWorker]);

  useEffect(() => {
    if (bookingSuccess) {
      setFeedback('Your booking request has been submitted successfully!');
      const timer = setTimeout(() => {
        dispatch(clearBookingState());
        navigate('/customer-dashboard');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [bookingSuccess, navigate, dispatch]);

  if (workerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader size="large" />
      </div>
    );
  }

  if (workerError || !currentWorker) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-900/20 border border-red-500/25 text-red-300 p-4 rounded-xl max-w-md mx-auto text-sm">
          {workerError || 'Worker information could not be retrieved.'}
        </div>
        <Link to="/" className="mt-4 inline-block text-brand-400 font-semibold hover:underline text-sm">
          Return to Search
        </Link>
      </div>
    );
  }

  const { user, profile, reviews } = currentWorker;

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!selectedCategory || !bookingDate || !bookingTime || !address || !description) {
      alert('Please fill all required booking details.');
      return;
    }
    const hourlyRate = profile.hourlyRate || 200;
    const hours = Number(estimatedHours) || 2;
    const totalAmount = hourlyRate * hours;
    dispatch(
      createBooking({
        workerId: user._id,
        serviceCategory: selectedCategory,
        bookingDate,
        bookingTime,
        address,
        description,
        totalAmount,
        coordinates: userInfo?.location?.coordinates || [0, 0],
      })
    );
  };

  return (
    <div className="flex-grow bg-gradient-brand py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: Worker Info */}
        <div className="lg:col-span-2 space-y-6">

          {/* Worker Profile Card */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                alt={user.name}
                className="h-28 w-28 rounded-full border-2 border-brand-500/60 object-cover bg-slate-800"
              />
              <div className="text-center sm:text-left flex-grow">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                  <h1 className="text-2xl font-extrabold text-white">{user.name}</h1>
                  {profile.isApproved && (
                    <span className="inline-flex items-center space-x-1 text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-brand-500/20">
                      <span>Verified Pro</span>
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-400 mt-1.5 flex flex-col justify-center sm:justify-start space-y-1">
                  <span className="capitalize">Service Area: {profile.serviceArea} · within {profile.serviceRadius} km</span>
                  <span>Phone: {user.phoneNumber || 'Not provided'}</span>
                  <span>Email: {user.email}</span>
                </div>

                <div className="flex items-center space-x-1.5 justify-center sm:justify-start mt-3">
                  <span className="text-amber-400 font-bold text-sm">★</span>
                  <span className="font-bold text-white text-sm">
                    {profile.rating > 0 ? profile.rating.toFixed(1) : 'New'}
                  </span>
                  <span className="text-xs text-slate-400 font-light">({profile.numReviews} reviews)</span>
                </div>

                <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-4">
                  {profile.skills?.map((s, idx) => (
                    <span key={idx} className="text-[10px] bg-white/4 text-slate-300 font-bold px-2.5 py-1 rounded-md border border-white/7">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-6 space-y-3">
              <h2 className="text-xs font-bold text-slate-400 tracking-widest uppercase">Professional Bio</h2>
              <p className="text-sm text-slate-400 font-light leading-relaxed">
                {profile.description || 'Verified professional available for residential and commercial jobs. Committed to quality service and customer satisfaction.'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-white/5 pt-6">
              <div>
                <span className="block text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Experience</span>
                <span className="font-bold text-white text-base">{profile.experience} Years</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Hourly Rate</span>
                <span className="font-bold text-brand-400 text-base">₹{profile.hourlyRate}<span className="text-xs text-slate-400 font-normal">/hr</span></span>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <h2 className="text-xs font-bold text-slate-400 tracking-widest uppercase flex items-center space-x-2">
              <span>Weekly Availability</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                const isAvailable = profile.availability?.[day];
                return (
                  <div key={day} className={`p-2.5 rounded-xl border text-center transition-all ${
                    isAvailable
                      ? 'bg-emerald-500/8 border-emerald-500/20 text-emerald-400'
                      : 'bg-white/2 border-white/5 text-slate-600'
                  }`}>
                    <span className="block text-[10px] font-bold uppercase tracking-wider">{day.slice(0, 3)}</span>
                    <span className="text-[9px] font-medium leading-none block mt-1">
                      {isAvailable ? 'Open' : 'Off'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
            <h2 className="text-xs font-bold text-slate-400 tracking-widest uppercase">
              Customer Reviews ({reviews.length})
            </h2>

            {reviews.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No reviews yet. Be the first to book and review this professional.</p>
            ) : (
              <div className="space-y-6 divide-y divide-white/5">
                {reviews.map((review, idx) => (
                  <div key={review._id} className={`pt-6 ${idx === 0 ? 'pt-0' : ''} space-y-2`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={review.customer?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${review.customer?.name}`}
                          alt={review.customer?.name}
                          className="h-8 w-8 rounded-full border border-white/10"
                        />
                        <div>
                          <p className="text-xs font-bold text-white">{review.customer?.name}</p>
                          <p className="text-[9px] text-slate-500">{new Date(review.createdAt).toLocaleDateString('en-IN')}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xs ${i < review.rating ? 'text-amber-400 font-bold' : 'text-slate-700'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 font-light pl-10 italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Booking Panel */}
        <div className="space-y-6">
          {feedback && (
            <div className="flex items-center space-x-2.5 bg-emerald-950/20 border border-emerald-500/25 text-emerald-300 p-4 rounded-xl text-xs">
              <span>{feedback}</span>
            </div>
          )}

          {bookingError && (
            <div className="flex items-center space-x-2.5 bg-red-950/20 border border-red-500/25 text-red-300 p-4 rounded-xl text-xs">
              <span>{bookingError}</span>
            </div>
          )}

          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-5 sticky top-20">
            <h2 className="text-lg font-bold text-white border-b border-white/5 pb-3">Book Appointment</h2>

            {!userInfo ? (
              <div className="text-center py-6 space-y-4">
                <p className="text-xs text-slate-400 font-light">Sign in as a customer to book this professional.</p>
                <Link
                  to="/login"
                  className="block w-full btn-primary py-2.5 rounded-xl text-xs text-center font-bold"
                >
                  Sign In to Book
                </Link>
              </div>
            ) : userInfo.role === 'worker' ? (
              <div className="bg-white/3 border border-white/5 p-4 rounded-xl text-xs text-slate-400 text-center italic">
                Only customers can book appointments.
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Service Required</label>
                  <div className="flex items-center glass-input rounded-xl px-3 py-2.5">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-transparent text-slate-200 text-xs focus:outline-none w-full cursor-pointer"
                    >
                      {profile.skills?.map((s) => (
                        <option key={s} value={s} className="bg-slate-900 text-slate-300">{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Preferred Date</label>
                  <div className="flex items-center glass-input rounded-xl px-3 py-2.5">
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="bg-transparent text-slate-200 text-xs focus:outline-none w-full cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Time Slot</label>
                  <div className="flex items-center glass-input rounded-xl px-3 py-2.5">
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      required
                      className="bg-transparent text-slate-200 text-xs focus:outline-none w-full cursor-pointer"
                    >
                      <option value="" className="bg-slate-900 text-slate-300">Select a slot</option>
                      {SERVICE_SLOTS.map((slot) => (
                        <option key={slot} value={slot} className="bg-slate-900 text-slate-300">{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Service Address</label>
                  <textarea
                    required
                    rows="2"
                    placeholder="Flat/House No., Street, Locality, City, PIN"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="glass-input w-full rounded-xl p-3 text-xs focus:outline-none placeholder-slate-600"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Work Description</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Describe the issue or work required in detail..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="glass-input w-full rounded-xl p-3 text-xs focus:outline-none placeholder-slate-600"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Estimated Duration (Hours)</label>
                  <div className="flex items-center glass-input rounded-xl px-3 py-2.5">
                    <input
                      type="number"
                      required
                      min="1"
                      max="24"
                      value={estimatedHours}
                      onChange={(e) => setEstimatedHours(e.target.value)}
                      className="bg-transparent text-slate-200 text-xs focus:outline-none w-full"
                    />
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Rate</span>
                    <span>₹{profile.hourlyRate}/hr</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Duration</span>
                    <span>{estimatedHours} hrs</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white border-t border-white/5 pt-2">
                    <span>Estimated Total</span>
                    <span className="text-brand-400">₹{(profile.hourlyRate || 200) * (Number(estimatedHours) || 1)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full btn-primary py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {bookingLoading ? <Loader size="small" /> : <span>Confirm Booking</span>}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default WorkerDetail;
