import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, getProfile, clearError } from '../store/authSlice';
import { uploadService } from '../services/api';
import Loader from '../components/Loader';

const AVAILABLE_SKILLS = [
  'Electrician',
  'Plumber',
  'Carpenter',
  'Painter',
  'AC Technician',
  'Home Repair',
];

const WEEKDAYS = [
  { key: 'monday',    label: 'Mon' },
  { key: 'tuesday',   label: 'Tue' },
  { key: 'wednesday', label: 'Wed' },
  { key: 'thursday',  label: 'Thu' },
  { key: 'friday',    label: 'Fri' },
  { key: 'saturday',  label: 'Sat' },
  { key: 'sunday',    label: 'Sun' },
];

const Profile = () => {
  const dispatch = useDispatch();
  const { userInfo, loading, error, success } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [avatar, setAvatar] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [serviceRadius, setServiceRadius] = useState(10);
  const [description, setDescription] = useState('');
  const [availability, setAvailability] = useState({
    monday: true, tuesday: true, wednesday: true, thursday: true,
    friday: true, saturday: true, sunday: true,
  });

  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || '');
      setPhoneNumber(userInfo.phoneNumber || '');
      setAddress(userInfo.address || '');
      setAvatar(userInfo.avatar || '');
      if (userInfo.location?.coordinates) {
        setLng(userInfo.location.coordinates[0]);
        setLat(userInfo.location.coordinates[1]);
      }
      if (userInfo.role === 'worker' && userInfo.workerProfile) {
        const wp = userInfo.workerProfile;
        setSkills(wp.skills || []);
        setExperience(wp.experience || '');
        setHourlyRate(wp.hourlyRate || '');
        setServiceArea(wp.serviceArea || '');
        setServiceRadius(wp.serviceRadius || 10);
        setDescription(wp.description || '');
        setAvailability(wp.availability || {
          monday: true, tuesday: true, wednesday: true, thursday: true,
          friday: true, saturday: true, sunday: true,
        });
      }
    }
  }, [userInfo]);

  useEffect(() => {
    if (success) {
      setFeedback('Profile updated successfully!');
      const timer = setTimeout(() => {
        setFeedback('');
        dispatch(clearError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) { alert('Geolocation not supported.'); return; }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
      },
      (err) => { console.error(err); alert('Could not capture location.'); }
    );
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const data = await uploadService.uploadImage(file);
      setAvatar(data.url);
      setFeedback('Photo uploaded. Save your profile to apply it.');
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSkillToggle = (skill) => {
    if (skills.includes(skill)) setSkills(skills.filter((s) => s !== skill));
    else setSkills([...skills, skill]);
  };

  const handleAvailabilityToggle = (day) => {
    setAvailability({ ...availability, [day]: !availability[day] });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const payload = {
      name, phoneNumber, address, avatar,
      coordinates: lat && lng ? [Number(lng), Number(lat)] : [0, 0],
    };
    if (userInfo.role === 'worker') {
      payload.skills = skills;
      payload.experience = Number(experience) || 0;
      payload.serviceArea = serviceArea;
      payload.serviceRadius = Number(serviceRadius) || 10;
      payload.hourlyRate = Number(hourlyRate) || 200;
      payload.description = description;
      payload.availability = availability;
    }
    dispatch(updateProfile(payload));
  };

  return (
    <div className="flex-grow bg-gradient-brand py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white">My Profile</h1>
            <p className="text-slate-400 text-sm mt-1 font-light">Update your personal details and service settings</p>
          </div>
          {userInfo && (
            <span className="bg-white/5 text-brand-400 px-4 py-1.5 rounded-full text-xs font-semibold border border-white/8 capitalize">
              {userInfo.role}
            </span>
          )}
        </div>

        {feedback && (
          <div className="flex items-center space-x-2.5 bg-emerald-950/20 border border-emerald-500/25 text-emerald-300 p-4 rounded-xl text-sm">
            <span>{feedback}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center space-x-2.5 bg-red-950/20 border border-red-500/25 text-red-300 p-4 rounded-xl text-sm">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-8">

          {/* Card 1: Basic Info */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
            <h2 className="text-base font-bold text-white tracking-wide border-b border-white/5 pb-3">Personal Information</h2>

            {/* Avatar Upload */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex flex-col items-center space-y-3">
                <div className="relative cursor-pointer">
                  <img
                    src={avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`}
                    alt={name}
                    className="h-24 w-24 rounded-full border-2 border-brand-500/50 object-cover bg-slate-800"
                  />
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black/75 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-brand-500 border-t-transparent"></div>
                    </div>
                  )}
                </div>
                <label className="cursor-pointer bg-brand-600 hover:bg-brand-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg transition-all text-center">
                  Upload Photo
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-bold text-white">{name || 'Your Name'}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{userInfo?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Full Name</label>
                <div className="flex items-center glass-input rounded-xl px-3.5 py-3">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-transparent text-slate-200 text-sm focus:outline-none w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Mobile Number</label>
                <div className="flex items-center glass-input rounded-xl px-3.5 py-3">
                  <input
                    type="text"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-transparent text-slate-200 text-sm focus:outline-none w-full"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Home Address</label>
                <div className="flex items-center glass-input rounded-xl px-3.5 py-3">
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="bg-transparent text-slate-200 text-sm focus:outline-none w-full"
                  />
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  className="w-full bg-white/5 hover:bg-white/8 text-slate-300 hover:text-white font-semibold py-3 px-3 rounded-xl border border-white/8 hover:border-white/15 transition-all text-xs flex items-center justify-center space-x-1.5"
                >
                  <span>Update GPS</span>
                </button>
              </div>
            </div>

            {lat && lng && (
              <p className="text-[10px] text-brand-500 pl-0.5">
                Location: {Number(lng).toFixed(5)}, {Number(lat).toFixed(5)}
              </p>
            )}
          </div>

          {/* Card 2: Worker Details */}
          {userInfo?.role === 'worker' && (
            <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
              <h2 className="text-base font-bold text-white tracking-wide border-b border-white/5 pb-3 flex items-center space-x-2">
                <span>Professional Settings</span>
              </h2>

              {/* Skills */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-3 pl-0.5">Service Skills</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AVAILABLE_SKILLS.map((skill) => {
                    const isSelected = skills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSkillToggle(skill)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                          isSelected
                            ? 'bg-brand-500/15 text-brand-400 border-brand-500/40'
                            : 'bg-white/3 text-slate-400 border-white/5 hover:border-white/12 hover:text-slate-300'
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Years of Experience</label>
                  <div className="flex items-center glass-input rounded-xl px-3.5 py-3">
                    <input
                      type="number"
                      required
                      min="0"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="bg-transparent text-slate-200 text-sm focus:outline-none w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Rate per Hour (₹)</label>
                  <div className="flex items-center glass-input rounded-xl px-3.5 py-3">
                    <span className="text-slate-500 mr-1.5 font-medium text-sm">₹</span>
                    <input
                      type="number"
                      required
                      min="0"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="bg-transparent text-slate-200 text-sm focus:outline-none w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Service Area</label>
                  <div className="flex items-center glass-input rounded-xl px-3.5 py-3">
                    <input
                      type="text"
                      required
                      value={serviceArea}
                      onChange={(e) => setServiceArea(e.target.value)}
                      className="bg-transparent text-slate-200 text-sm focus:outline-none w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Radius slider */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 pl-0.5">
                  Service Radius: <span className="text-brand-400 font-bold">{serviceRadius} km</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="50"
                  step="1"
                  value={serviceRadius}
                  onChange={(e) => setServiceRadius(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
              </div>

              {/* Availability */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2.5 pl-0.5">Working Days</label>
                <div className="flex flex-wrap gap-2">
                  {WEEKDAYS.map(({ key, label }) => {
                    const isAvailable = availability[key];
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleAvailabilityToggle(key)}
                        className={`py-2 px-3.5 rounded-lg text-xs font-semibold border transition-all ${
                          isAvailable
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-sm'
                            : 'bg-white/3 text-slate-500 border-white/5 hover:border-white/12 hover:text-slate-400'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Professional Bio</label>
                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="glass-input w-full rounded-xl p-3.5 text-sm focus:outline-none placeholder-slate-600"
                  placeholder="Describe your expertise, certifications, past projects..."
                ></textarea>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-3 px-8 rounded-xl text-sm font-bold flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? <Loader size="small" /> : <span>Save Changes</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
