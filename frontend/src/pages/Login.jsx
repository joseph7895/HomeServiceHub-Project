import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/authSlice';
import Loader from '../components/Loader';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userInfo, loading, error, success } = useSelector((state) => state.auth);

  const redirectPath = location.state?.from?.pathname || '/';

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === 'admin') {
        navigate('/admin');
      } else if (userInfo.role === 'worker') {
        navigate('/worker-dashboard');
      } else {
        navigate(redirectPath);
      }
    }
  }, [userInfo, navigate, redirectPath]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(login({ email, password }));
  };

  return (
    <div className="flex-grow bg-gradient-brand flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md p-8 glass-panel rounded-3xl shadow-2xl border border-white/5">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-xl shadow-brand-700/30 mb-4">
            <span className="text-2xl font-extrabold text-white">H</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Welcome Back</h2>
          <p className="text-slate-400 text-sm mt-1 font-light">Sign in to your HomeServiceHub account</p>
        </div>

        {error && (
          <div className="flex items-start space-x-2.5 bg-red-950/25 border border-red-500/25 text-red-300 p-3.5 rounded-xl mb-6 text-xs">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Email Address</label>
            <div className="flex items-center glass-input rounded-xl px-3.5 py-3">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-slate-200 text-sm focus:outline-none w-full placeholder-slate-600"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 pl-0.5">Password</label>
            <div className="flex items-center glass-input rounded-xl px-3.5 py-3">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent text-slate-200 text-sm focus:outline-none w-full placeholder-slate-600"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 px-4 rounded-xl flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
          >
            {loading ? <Loader size="small" /> : (
              <>
                <span className="text-sm font-bold">Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-white/5 text-sm">
          <span className="text-slate-500">Don't have an account? </span>
          <Link to="/register" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
