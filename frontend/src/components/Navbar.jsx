import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const getDashboardPath = () => {
    if (!userInfo) return '/login';
    if (userInfo.role === 'admin') return '/admin';
    if (userInfo.role === 'worker') return '/worker-dashboard';
    return '/customer-dashboard';
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 shadow-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-white font-extrabold text-xl tracking-wide group">
              <span className="font-sans">
                HomeService<span className="text-brand-500">Hub</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/') ? 'text-brand-400 bg-brand-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Find Services
            </Link>

            {userInfo ? (
              <>
                <Link
                  to={getDashboardPath()}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive('/admin') || isActive('/worker-dashboard') || isActive('/customer-dashboard')
                      ? 'text-brand-400 bg-brand-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Dashboard
                </Link>

                <Link
                  to="/profile"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive('/profile') ? 'text-brand-400 bg-brand-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
                >
                  Sign Out
                </button>

                <div className="flex items-center space-x-2.5 pl-4 border-l border-white/10 ml-2">
                  <img
                    src={userInfo.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${userInfo.name}`}
                    alt={userInfo.name}
                    className="h-8 w-8 rounded-full border-2 border-brand-500/60 object-cover"
                  />
                  <div className="text-xs">
                    <p className="font-semibold text-white leading-tight">{userInfo.name}</p>
                    <p className="text-slate-400 capitalize text-[10px]">{userInfo.role}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 ml-2">
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/5"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-brand-700/20 hover:shadow-brand-500/25 transition-all active:scale-95"
                >
                  Join Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs font-semibold"
              aria-label="Toggle menu"
            >
              {isOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0a0f1e]/95 border-t border-white/5 px-4 pt-3 pb-5 space-y-1">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium ${
              isActive('/') ? 'text-brand-400 bg-brand-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Find Services
          </Link>

          {userInfo ? (
            <>
              <Link
                to={getDashboardPath()}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium ${
                  isActive('/admin') || isActive('/worker-dashboard') || isActive('/customer-dashboard')
                    ? 'text-brand-400 bg-brand-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Dashboard
              </Link>

              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium ${
                  isActive('/profile') ? 'text-brand-400 bg-brand-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                My Profile
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-3 border-t border-white/5 flex flex-col space-y-2 px-1">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-white py-2.5 px-4 text-sm font-medium rounded-lg hover:bg-white/5"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="bg-brand-600 hover:bg-brand-500 text-white text-center py-2.5 rounded-lg text-sm font-semibold transition-all"
              >
                Join Free
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
