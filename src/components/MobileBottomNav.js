import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Eye, Calendar, PhoneCall } from 'lucide-react';

export default function MobileBottomNav() {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Services', path: '/services', icon: Eye },
    { name: 'Appointments', path: '/appointment', icon: Calendar, highlight: true },
    { name: 'Contact', path: '/contact', icon: PhoneCall }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="md:hidden">
      {/* Modern Fixed Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-2xl px-2 py-1.5">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center py-1 px-3.5 rounded-2xl transition-all duration-200 ${
                  active
                    ? 'text-teal-800 font-extrabold scale-105'
                    : 'text-slate-500 hover:text-slate-900 font-medium'
                }`}
              >
                <div
                  className={`p-2 rounded-xl transition-all ${
                    item.highlight
                      ? active
                        ? 'bg-teal-600 text-white shadow-md ring-2 ring-teal-200'
                        : 'bg-teal-50 text-teal-700 border border-teal-200'
                      : active
                      ? 'bg-teal-50 text-teal-700'
                      : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] mt-1 tracking-tight font-bold ${active ? 'text-teal-900' : 'text-slate-600'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
