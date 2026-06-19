import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#060b18] text-slate-400 border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2.5 text-white font-extrabold text-lg">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700">
                <span className="text-white font-extrabold text-xs leading-none">H</span>
              </div>
              <span>Home<span className="text-brand-400">ServiceHub</span></span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              India's trusted platform connecting homeowners with skilled local service professionals — fast, safe, and affordable.
            </p>
            <div className="flex items-center space-x-1 text-xs text-slate-600">
              <span className="inline-block w-2 h-2 rounded-full bg-brand-500"></span>
              <span>Made in India</span>
            </div>
          </div>

          {/* Popular Services */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">Popular Services</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/?skill=Plumber" className="hover:text-white transition-colors">Plumbing Services</Link></li>
              <li><Link to="/?skill=Electrician" className="hover:text-white transition-colors">Electrical Work</Link></li>
              <li><Link to="/?skill=Painter" className="hover:text-white transition-colors">Home Painting</Link></li>
              <li><Link to="/?skill=AC Technician" className="hover:text-white transition-colors">AC Servicing</Link></li>
              <li><Link to="/?skill=Carpenter" className="hover:text-white transition-colors">Carpentry</Link></li>
            </ul>
          </div>

          {/* Platform Info */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">Platform</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Become a Partner</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Safety Standards</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>


        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/5 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
          <p>© {new Date().getFullYear()} HomeServiceHub Technologies Pvt. Ltd. All rights reserved.</p>
          <p className="mt-4 md:mt-0 flex items-center space-x-1">
            <span>Crafted with</span>
            <span className="text-brand-500 mx-0.5">&#9829;</span>
            <span>for every Indian home</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
