import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, BookOpen, Trophy, User, Shield, LogOut, Sun, Moon
} from 'lucide-react';

const Navbar = ({ darkMode, setDarkMode, user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/problems', icon: BookOpen, label: 'Problems' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/admin', icon: Shield, label: 'Admin', adminOnly: true },
  ];

  return (
    <nav className={`backdrop-blur-xl ${darkMode ? 'bg-slate-900/80' : 'bg-white/80'} rounded-2xl border ${darkMode ? 'border-cyan-500/20' : 'border-blue-200'} shadow-2xl ${darkMode ? 'shadow-cyan-500/10' : 'shadow-blue-500/10'}`}>
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-2">
          {navItems.map((item) => {
            if (item.adminOnly && user?.role !== 'admin') return null;
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`group relative flex items-center space-x-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                    : darkMode 
                      ? 'text-slate-300 hover:bg-slate-800/50 hover:text-cyan-400'
                      : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline font-['Inter'] tracking-tight">{item.label}</span>
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-400 opacity-20 blur-md"></div>
                )}
              </button>
            );
          })}
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
              darkMode 
                ? 'text-amber-400 hover:bg-amber-500/10' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button
            onClick={handleLogout}
            className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
              darkMode 
                ? 'text-rose-400 hover:bg-rose-500/10' 
                : 'text-rose-600 hover:bg-rose-50'
            }`}
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline font-['Inter']">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;