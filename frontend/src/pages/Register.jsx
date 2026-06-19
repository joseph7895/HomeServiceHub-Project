import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../store/authSlice';
import Loader from '../components/Loader';

const AVAILABLE_SKILLS = [
  'Electrician',
  'Plumber',
  'Carpenter',
  'Painter',
  'AC Technician',
  'Home Repair',
];

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('customer');

  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [locating, setLocating] = useState(false);

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [experience, setExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [description, setDescription] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading, error, success } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === 'admin') navigate('/admin');
      else if (userInfo.role === 'worker') navigate('/worker-dashboard');
      else navigate('/customer-dashboard');
    }
  }, [userInfo, navigate]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        setLocating(false);
      },
      (err) => {
        console.error(err);
        alert('Could not retrieve location. Please type manually or grant permission.');
        setLocating(false);
      }
    );
  };

  const handleSkillToggle = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name,
      email,
      password,
      role,
      phoneNumber,
      address,
      coordinates: lat && lng ? [Number(lng), Number(lat)] : [0, 0],
    };
    if (role === 'worker') {
      payload.skills = selectedSkills;
      payload.experience = Number(experience) || 0;
      payload.serviceArea = serviceArea || address || 'Local Area';
      payload.hourlyRate = Number(hourlyRate) || 200;
      payload.description = description;
    }
    dispatch(register(payload));
  };

  return (
    <div className="flex-grow bg-gradient-brand flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-2xl p-8 glass-panel rounded-3xl shadow-2xl border border-white/5">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-xl shadow-brand-700/30 mb-4">
            <span className="text-2xl font-extrabold text-white">H</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Join HomeServiceHub</h2>
          <p className="text-slate-400 text-sm mt-1 font-light">Register as a homeowner or a service professional</p>
        </div>

        {error && (
          <div className="flex items-start space-x-2.5 bg-red-950/25 border border-red-500/25 text-red-300 p-3.5 rounded-xl mb-6 text-xs">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Role Toggle */}
          <div className="grid grid-cols-2 gap-3 p-1 bg-slate-900/60 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`py-2.5 px-4 rounded-lg font-semibold text-sm transition-all ${
                role === 'customer'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-700/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Homeowner
            </button>
            <button
              type="button"
              onClick={() => setRole('worker')}
              className={`py-2.5 px-4 rounded-lg font-semibold text-sm transition-all ${
                role === 'worker'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-700/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Service Partner
            </button>
          </div>

          {/* Core Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Full Name</label>
              <div className="flex items-center glass-input rounded-xl px-3.5 py-3">
                <input
                  type="text"
                  required
                  placeholder="Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent text-slate-200 text-sm focus:outline-none w-full placeholder-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Email Address</label>
              <div className="flex items-center glass-input rounded-xl px-3.5 py-3">
                <input
                  type="email"
                  required
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-slate-200 text-sm focus:outline-none w-full placeholder-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Password</label>
              <div className="flex items-center glass-input rounded-xl px-3.5 py-3">
                <input
                  type="password"
                  required
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent text-slate-200 text-sm focus:outline-none w-full placeholder-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Mobile Number</label>
              <div className="flex items-center glass-input rounded-xl px-3.5 py-3">
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-transparent text-slate-200 text-sm focus:outline-none w-full placeholder-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Home / Service Address</label>
              <div className="flex items-center glass-input rounded-xl px-3.5 py-3">
                <input
                  type="text"
                  required
                  placeholder="Plot No., Street, Locality, City, PIN"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-transparent text-slate-200 text-sm focus:outline-none w-full placeholder-slate-600"
                />
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={handleDetectLocation}
                className="w-full bg-slate-800/70 hover:bg-slate-700/70 text-slate-300 hover:text-white font-semibold py-3 px-3 rounded-xl border border-white/8 hover:border-white/15 transition-all text-xs flex items-center justify-center space-x-2"
              >
                <span>{lat && lng ? 'GPS Active' : 'Detect Location'}</span>
              </button>
            </div>
          </div>

          {lat && lng && (
            <div className="bg-brand-500/8 border border-brand-500/20 py-2 px-3.5 rounded-lg text-[10px] text-brand-400">
              GPS Coordinates captured — Lng: {Number(lng).toFixed(5)}, Lat: {Number(lat).toFixed(5)}. Used for nearby match search.
            </div>
          )}

          {/* Worker-specific fields */}
          {role === 'worker' && (
            <div className="space-y-5 pt-6 border-t border-white/5">
              <h3 className="text-sm font-bold text-brand-400 tracking-wider uppercase flex items-center space-x-2">
                <span>Professional Details</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 pl-0.5">Skills (Select all that apply)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AVAILABLE_SKILLS.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSkillToggle(skill)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                          isSelected
                            ? 'bg-brand-500/15 text-brand-400 border-brand-500/40'
                            : 'bg-slate-900/50 text-slate-400 border-white/5 hover:border-white/12 hover:text-slate-300'
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Experience (Years)</label>
                  <div className="flex items-center glass-input rounded-xl px-3.5 py-3">
                    <input
                      type="number"
                      required={role === 'worker'}
                      min="0"
                      placeholder="e.g. 5"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="bg-transparent text-slate-200 text-sm focus:outline-none w-full placeholder-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Rate per Hour (₹)</label>
                  <div className="flex items-center glass-input rounded-xl px-3.5 py-3">
                    <span className="text-slate-500 mr-1.5 font-medium text-sm">₹</span>
                    <input
                      type="number"
                      required={role === 'worker'}
                      min="1"
                      placeholder="e.g. 300"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="bg-transparent text-slate-200 text-sm focus:outline-none w-full placeholder-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Service Area</label>
                  <div className="flex items-center glass-input rounded-xl px-3.5 py-3">
                    <input
                      type="text"
                      required={role === 'worker'}
                      placeholder="e.g. Koramangala, Bengaluru"
                      value={serviceArea}
                      onChange={(e) => setServiceArea(e.target.value)}
                      className="bg-transparent text-slate-200 text-sm focus:outline-none w-full placeholder-slate-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Professional Bio</label>
                <textarea
                  required={role === 'worker'}
                  rows="3"
                  placeholder="Describe your expertise, certifications, and the services you offer..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="glass-input w-full rounded-xl p-3.5 text-sm focus:outline-none placeholder-slate-600"
                ></textarea>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3.5 px-4 rounded-xl flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? <Loader size="small" /> : (
              <span className="font-bold text-sm">Create Account</span>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-white/5 text-sm">
          <span className="text-slate-500">Already have an account? </span>
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
