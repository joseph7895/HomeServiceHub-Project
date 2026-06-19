import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkers } from '../store/workerSlice';
import { Link, useSearchParams } from 'react-router-dom';
import Loader from '../components/Loader';

const SERVICE_CATEGORIES = [
  'Electrician',
  'Plumber',
  'Carpenter',
  'Painter',
  'AC Technician',
  'Home Repair',
];

const Home = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { workers, loading, error } = useSelector((state) => state.workers);

  const [skill, setSkill] = useState(searchParams.get('skill') || '');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [radius, setRadius] = useState(15);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const skillParam = searchParams.get('skill');
    if (skillParam) {
      setSkill(skillParam);
      dispatch(fetchWorkers({ skill: skillParam }));
    } else {
      dispatch(fetchWorkers({}));
    }
  }, [searchParams, dispatch]);

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
        setAddress('Current Location (GPS Active)');
        setLocating(false);
      },
      (err) => {
        console.error(err);
        alert('Could not retrieve location. Please grant permission or enter manually.');
        setLocating(false);
      }
    );
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = {};
    if (skill) query.skill = skill;
    if (lat && lng) {
      query.lat = lat;
      query.lng = lng;
      query.radius = radius;
    }
    dispatch(fetchWorkers(query));
  };

  const handleCategoryClick = (category) => {
    setSkill(category);
    dispatch(fetchWorkers({ skill: category, lat, lng, radius }));
  };

  return (
    <div className="flex-grow bg-gradient-brand min-h-screen">

      {/* ─── Animated Background ─── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        {/* Animated Background Image Layer */}
        <div className="hero-image-bg" style={{ backgroundImage: 'url(/hero-bg.png)' }} />

        {/* Floating colour orbs */}
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="hero-orb hero-orb-4" />

        {/* Subtle blueprint grid */}
        <div className="hero-grid" />

        {/* Scanning aurora beam */}
        <div className="hero-aurora" />

        {/* Rising micro-particles */}
        <div className="hero-particles">
          {[
            { x: '5%',  d: '18s', delay: '0s'   },
            { x: '12%', d: '22s', delay: '2s'   },
            { x: '20%', d: '16s', delay: '5s'   },
            { x: '28%', d: '25s', delay: '1s'   },
            { x: '35%', d: '20s', delay: '8s'   },
            { x: '42%', d: '14s', delay: '3s'   },
            { x: '50%', d: '19s', delay: '6s'   },
            { x: '58%', d: '23s', delay: '0.5s' },
            { x: '65%', d: '17s', delay: '4s'   },
            { x: '72%', d: '21s', delay: '7s'   },
            { x: '80%', d: '15s', delay: '2.5s' },
            { x: '87%', d: '24s', delay: '9s'   },
            { x: '93%', d: '13s', delay: '1.5s' },
            { x: '18%', d: '28s', delay: '11s'  },
            { x: '60%', d: '26s', delay: '13s'  },
            { x: '78%', d: '20s', delay: '10s'  },
          ].map((p, i) => (
            <span
              key={i}
              className="hero-particle"
              style={{ '--x': p.x, '--duration': p.d, '--delay': p.delay }}
            />
          ))}
        </div>

        {/* Vignette to keep edges dark */}
        <div className="hero-vignette" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pt-14 pb-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Hero Content & Search */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center space-x-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse"></span>
              <span>India's Most Trusted Home Services Platform</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white">
              Book Verified <span className="text-gradient">Home Service</span><br />Experts Near You
            </h1>
            <p className="max-w-2xl mx-auto lg:mx-0 text-lg text-slate-400 font-light">
              Find skilled electricians, plumbers, carpenters, painters and AC technicians in your city. Transparent pricing, verified professionals, instant booking.
            </p>

            {/* Search Form */}
            <div className="max-w-4xl mx-auto lg:mx-0 mt-8 p-4 glass-panel rounded-2xl shadow-2xl border border-white/5">
              <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="block text-left text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider pl-0.5">Service Type</label>
                  <div className="flex items-center glass-input rounded-xl px-3 py-2.5">
                    <select
                      value={skill}
                      onChange={(e) => setSkill(e.target.value)}
                      className="bg-transparent text-slate-200 text-sm focus:outline-none w-full cursor-pointer"
                    >
                      <option value="" className="bg-slate-900 text-slate-300">All Services</option>
                      {SERVICE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="bg-slate-900 text-slate-300">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-left text-[10px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider pl-0.5">Your Location</label>
                  <div className="flex items-center glass-input rounded-xl px-3 py-1.5">
                    <input
                      type="text"
                      placeholder="Enter locality, city or PIN code"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="bg-transparent text-slate-200 text-sm py-1.5 focus:outline-none w-full placeholder-slate-600"
                    />
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-brand-500 transition-colors text-xs font-semibold"
                      title="Detect my current location"
                    >
                      {locating ? 'Locating...' : 'GPS'}
                    </button>
                  </div>
                  {lat && lng && (
                    <p className="text-[10px] text-brand-500 text-left mt-1 ml-0.5">
                      GPS: {Number(lat).toFixed(4)}, {Number(lng).toFixed(4)} · Radius: {radius} km
                    </p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full btn-primary py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 mt-5"
                  >
                    <span>Search</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Premium Animated Cards Composition */}
          <div className="lg:col-span-5 relative h-[380px] lg:h-[480px] flex items-center justify-center overflow-visible mt-12 lg:mt-0 transform scale-[0.8] sm:scale-90 lg:scale-100 origin-top lg:origin-center">
            {/* Glowing background halo */}
            <div className="absolute w-72 h-72 rounded-full bg-brand-500/10 pulse-glow-ring pointer-events-none" />
            <div className="absolute w-60 h-60 rounded-full bg-accent-500/5 pulse-glow-ring pointer-events-none delay-1000" />
            
            {/* Card 1: Electrician (Top-Right) */}
            <div className="absolute float-card-1 top-4 right-4 w-64 glass-panel border border-white/10 rounded-2xl p-4 shadow-xl hover:border-brand-500/50 transition-all hover:scale-[1.02] duration-300">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img src="https://api.dicebear.com/7.x/initials/svg?seed=Aarav" className="w-10 h-10 rounded-full border-2 border-brand-500" alt="Aarav" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Aarav Sharma</h4>
                  <p className="text-[10px] text-brand-400 font-medium">Electrician Expert</p>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center text-[10px] text-slate-400 border-t border-white/5 pt-2">
                <div className="flex items-center space-x-1">
                  <span className="text-amber-400">★</span>
                  <span className="text-white font-semibold">4.9</span>
                  <span>(120+)</span>
                </div>
                <div className="font-semibold text-emerald-400">₹299/hr</div>
              </div>
            </div>

            {/* Card 2: AC Specialist (Center-Left) */}
            <div className="absolute float-card-2 top-36 left-4 w-64 glass-panel border border-white/10 rounded-2xl p-4 shadow-xl hover:border-accent-500/50 transition-all hover:scale-[1.02] duration-300 z-10">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img src="https://api.dicebear.com/7.x/initials/svg?seed=Vikram" className="w-10 h-10 rounded-full border-2 border-accent-500" alt="Vikram" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Vikram Singh</h4>
                  <p className="text-[10px] text-accent-400 font-medium">AC Specialist</p>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center text-[10px] text-slate-400 border-t border-white/5 pt-2">
                <div className="flex items-center space-x-1">
                  <span className="text-amber-400">★</span>
                  <span className="text-white font-semibold">5.0</span>
                  <span>(180+)</span>
                </div>
                <div className="font-semibold text-emerald-400">₹399/hr</div>
              </div>
            </div>

            {/* Card 3: Plumber (Bottom-Right) */}
            <div className="absolute float-card-3 bottom-8 right-8 w-64 glass-panel border border-white/10 rounded-2xl p-4 shadow-xl hover:border-brand-500/50 transition-all hover:scale-[1.02] duration-300">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img src="https://api.dicebear.com/7.x/initials/svg?seed=Rajesh" className="w-10 h-10 rounded-full border-2 border-brand-500" alt="Rajesh" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Rajesh Kumar</h4>
                  <p className="text-[10px] text-brand-400 font-medium">Plumbing Specialist</p>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center text-[10px] text-slate-400 border-t border-white/5 pt-2">
                <div className="flex items-center space-x-1">
                  <span className="text-amber-400">★</span>
                  <span className="text-white font-semibold">4.8</span>
                  <span>(90+)</span>
                </div>
                <div className="font-semibold text-emerald-400">₹249/hr</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pb-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-2.5">
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                skill.toLowerCase() === cat.toLowerCase()
                  ? 'bg-brand-500/15 text-brand-400 border-brand-500/40 shadow-md shadow-brand-500/10'
                  : 'bg-white/3 text-slate-300 border-white/8 hover:border-white/15 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Worker Cards Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">
            {skill ? `Verified ${skill}s Near You` : 'Verified Service Professionals'}
          </h2>
          <span className="text-sm text-slate-400 font-light bg-white/3 border border-white/5 px-3 py-1 rounded-full">
            {workers.length} found
          </span>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/25 text-red-300 p-4 rounded-xl text-center mb-8 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <Loader size="large" />
        ) : workers.length === 0 ? (
          <div className="glass-panel text-center py-16 rounded-2xl border border-white/5">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 font-bold text-slate-500 text-lg">
              ?
            </div>
            <h3 className="text-lg font-bold">No Professionals Found</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto mt-2 font-light">
              Try broadening your search radius or selecting a different service category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker) => (
              <div key={worker._id} className="glass-card rounded-2xl overflow-hidden p-6 flex flex-col justify-between border border-white/5">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={worker.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${worker.user?.name}`}
                        alt={worker.user?.name}
                        className="h-12 w-12 rounded-full border-2 border-brand-500/50 object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-white leading-snug hover:text-brand-400 transition-colors">
                          <Link to={`/workers/${worker.user?._id}`}>{worker.user?.name}</Link>
                        </h3>
                        <p className="text-xs text-slate-400 capitalize">{worker.serviceArea}</p>
                      </div>
                    </div>
                    {worker.isApproved && (
                      <span className="bg-brand-500/10 border border-brand-500/20 text-brand-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {worker.skills.map((s, idx) => (
                      <span key={idx} className="text-[10px] bg-white/4 text-slate-300 font-semibold px-2 py-0.5 rounded-md border border-white/7">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-3 my-4">
                    <div>
                      <span className="block text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Experience</span>
                      <span className="font-bold text-white text-sm">{worker.experience} Yrs</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Rating</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-amber-400 font-bold text-sm">★</span>
                        <span className="font-bold text-white text-sm">
                          {worker.rating > 0 ? worker.rating.toFixed(1) : 'New'}
                        </span>
                        <span className="text-xs text-slate-500 font-light">({worker.numReviews})</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-3 min-h-[3rem] font-light leading-relaxed">
                    {worker.description || 'Verified professional available for residential and commercial service calls. Quality work guaranteed.'}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Rate</span>
                    <span className="text-lg font-bold text-brand-400">₹{worker.hourlyRate}<span className="text-xs text-slate-400 font-normal">/hr</span></span>
                  </div>
                  <Link
                    to={`/workers/${worker.user?._id}`}
                    className="bg-slate-800/80 hover:bg-slate-700/80 border border-white/8 hover:border-white/15 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center justify-center transition-all"
                  >
                    <span>View Profile</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
