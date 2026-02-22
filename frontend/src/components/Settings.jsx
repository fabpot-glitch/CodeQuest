import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X, User, Lock, Moon, Sun, Mail, Volume2, Shield, Eye, Download,
  LogOut, Bell, Settings as SettingsIcon, Check, Palette, AlertTriangle,
  Zap, Key, EyeOff, RefreshCw, Users, BellRing, Clock, HardDrive,
  ShieldCheck, Monitor, Smartphone, Camera, FileText, FileBarChart,
  ChevronRight, Save, Edit, Upload, Code, Cpu, Battery,
  BatteryCharging, MemoryStick, Trophy, Flame, Award,
  TrendingUp, Globe, Wifi, Database, Activity, Github,
  Twitter, Linkedin, Youtube, Copy, Heart, Star,
  BookOpen, Gift, CreditCard, DollarSign, Headphones,
  MessageSquare, ThumbsUp, ThumbsDown, Flag, MapPin, Briefcase,
  Search, Minus, Plus, Trash2
} from 'lucide-react';

// ─── Local Storage Helpers ─────────────────────────────────────────────────
const LS = {
  get: (key, fallback = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch {}
  }
};

// ─── Default User Data ────────────────────────────────────────────────────
const defaultUser = () => ({
  id: 1,
  username: 'Ram_12',
  email: 'ram12@gmail.com',
  fullName: 'Ram Sharma',
  avatar: null,
  bio: 'Full Stack Developer | Open Source Contributor | Tech Enthusiast',
  location: 'Mumbai, India',
  website: 'https://ram.dev',
  company: 'TechCorp',
  role: 'Pro User',
  joinedDate: '2024-01-15',
  lastLogin: new Date().toISOString(),
  isVerified: true,
  rank: 1,
  streak: 7,
  achievements: 15,
  totalPoints: 2450,
  social: {
    github: 'ramdev',
    twitter: 'ram_12',
    linkedin: 'ram-sharma',
    youtube: '@ramdev'
  }
});

// ─── Default Settings ─────────────────────────────────────────────────────
const defaultSettings = () => ({
  // Appearance
  theme: 'light',
  accentColor: '#667eea',
  fontSize: 'medium',
  density: 'comfortable',
  animations: true,
  reduceMotion: false,
  
  // Notifications
  emailNotifications: true,
  pushNotifications: true,
  soundEnabled: true,
  desktopNotifications: false,
  notificationVolume: 70,
  achievementAlerts: true,
  rankUpdates: true,
  streakReminders: true,
  
  // Privacy
  profileVisibility: 'public',
  activityVisibility: 'friends',
  showOnlineStatus: true,
  showActivity: true,
  showAchievements: true,
  hideEmail: false,
  hideRank: false,
  allowTracking: false,
  twoFactorAuth: false,
  loginAlerts: true,
  
  // Preferences
  language: 'en',
  timezone: 'Asia/Kolkata',
  difficulty: 'medium',
  autoSave: true,
  autoSaveInterval: 5,
  
  // Editor
  fontSizeEditor: 14,
  tabSize: 2,
  lineWrap: true,
  autoComplete: true,
  linting: true,
  formatOnSave: true,
  showLineNumbers: true,
  minimap: true,
  
  // Performance
  hardwareAcceleration: true,
  cacheSize: 500,
  backgroundSync: true,
  preloadAssets: true,
  lowPowerMode: false,
  dataSaver: false,
  animationQuality: 'high',
  networkOptimization: true,
  memoryOptimization: true,
  
  // Accessibility
  highContrast: false,
  largeText: false,
  screenReader: false,
  colorBlindMode: 'none',
  keyboardShortcuts: true,
  focusMode: false,
  dyslexiaFont: false,
  captionsEnabled: false,
  
  // Account
  emailFrequency: 'daily',
  marketingEmails: true,
  newsletter: true,
  sessionDuration: 60,
  
  // Subscription
  subscription: 'pro',
  billingEmail: 'ram12@gmail.com',
  paymentMethod: 'visa',
  lastPayment: '2024-02-15',
  nextBilling: '2024-03-15',
  storageUsed: 2.4,
  storageLimit: 10,
  apiCalls: 1250,
  apiLimit: 5000
});

// ─── Sub-components ───────────────────────────────────────────────────────

// Toggle Switch Component
const Toggle = ({ checked, onChange, color = '#667eea', size = 'md', disabled = false }) => {
  const width = size === 'sm' ? 36 : 44;
  const height = size === 'sm' ? 20 : 24;
  const dotSize = size === 'sm' ? 14 : 18;
  
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      style={{
        width,
        height,
        borderRadius: height / 2,
        background: checked ? color : '#e2e8f0',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        position: 'relative',
        transition: 'background 0.2s',
        opacity: disabled ? 0.5 : 1,
        outline: 'none'
      }}
      role="switch"
      aria-checked={checked}
    >
      <div style={{
        position: 'absolute',
        top: (height - dotSize) / 2,
        left: checked ? width - dotSize - (height - dotSize) / 2 : (height - dotSize) / 2,
        width: dotSize,
        height: dotSize,
        borderRadius: '50%',
        background: '#fff',
        transition: 'left 0.2s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
      }} />
    </button>
  );
};

// Range Slider Component
const RangeSlider = ({ value, min = 0, max = 100, step = 1, onChange, color = '#667eea', showValue = false, unit = '' }) => (
  <div>
    {showValue && (
      <div style={{ fontSize: 12, fontWeight: 600, color, marginBottom: 6 }}>
        {value}{unit}
      </div>
    )}
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      style={{
        width: '100%',
        height: 6,
        borderRadius: 6,
        appearance: 'none',
        background: `linear-gradient(to right, ${color} ${((value - min) / (max - min)) * 100}%, #e2e8f0 ${((value - min) / (max - min)) * 100}%)`,
        cursor: 'pointer',
        outline: 'none'
      }}
    />
  </div>
);

// Pill Selector Component
const PillSelector = ({ value, options, onChange, color = '#667eea' }) => (
  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
    {options.map(option => (
      <button
        key={option.value}
        onClick={() => onChange(option.value)}
        style={{
          padding: '7px 16px',
          borderRadius: 20,
          fontSize: 13,
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s',
          background: value === option.value ? color : '#f1f5f9',
          color: value === option.value ? '#fff' : '#475569',
          boxShadow: value === option.value ? `0 2px 8px ${color}44` : 'none'
        }}
      >
        {option.label}
      </button>
    ))}
  </div>
);

// Input Field Component
const InputField = ({ label, value, onChange, type = 'text', placeholder, error, icon: Icon, disabled = false }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{label}</label>}
    <div style={{ position: 'relative' }}>
      {Icon && (
        <div style={{
          position: 'absolute',
          left: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#94a3b8'
        }}>
          <Icon size={15} />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: '100%',
          padding: Icon ? '10px 12px 10px 36px' : '10px 14px',
          borderRadius: 10,
          border: `1.5px solid ${error ? '#ef4444' : '#e2e8f0'}`,
          fontSize: 13,
          color: '#111827',
          background: disabled ? '#f1f5f9' : '#f8fafc',
          outline: 'none',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
          transition: 'border 0.2s',
          opacity: disabled ? 0.7 : 1,
          cursor: disabled ? 'not-allowed' : 'text'
        }}
      />
    </div>
    {error && <span style={{ fontSize: 11, color: '#ef4444' }}>{error}</span>}
  </div>
);

// Select Field Component
const SelectField = ({ label, value, onChange, options, disabled = false }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{label}</label>}
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      style={{
        padding: '10px 14px',
        borderRadius: 10,
        border: '1.5px solid #e2e8f0',
        fontSize: 13,
        color: '#111827',
        background: disabled ? '#f1f5f9' : '#f8fafc',
        outline: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        opacity: disabled ? 0.7 : 1
      }}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);

// Setting Row Component
const SettingRow = ({ label, sub, left: Left, right, noBorder = false }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: noBorder ? '12px 0 0' : '12px 0',
    borderBottom: noBorder ? 'none' : '1px solid #f1f5f9'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
      {Left}
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#111827' }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
    <div style={{ flexShrink: 0 }}>{right}</div>
  </div>
);

// Section Card Component
const SectionCard = ({ children, style = {} }) => (
  <div style={{
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #e9f0f8',
    padding: '20px 22px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    marginBottom: 16,
    ...style
  }}>
    {children}
  </div>
);

// Section Title Component
const SectionTitle = ({ icon: Icon, iconColor, title, sub }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
    <div style={{
      width: 40,
      height: 40,
      borderRadius: 12,
      background: iconColor + '18',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Icon size={20} color={iconColor} />
    </div>
    <div>
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>{title}</h3>
      {sub && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6b7280' }}>{sub}</p>}
    </div>
  </div>
);

// Button Component
const Button = ({ children, onClick, variant = 'primary', disabled = false, icon: Icon, style = {}, size = 'md' }) => {
  const [hover, setHover] = useState(false);
  const padding = size === 'sm' ? '8px 14px' : '10px 20px';
  const fontSize = size === 'sm' ? 12 : 14;
  
  const variants = {
    primary: {
      background: hover ? '#5a67d8' : '#667eea',
      color: '#fff',
      boxShadow: '0 2px 10px rgba(102,126,234,0.3)'
    },
    secondary: {
      background: hover ? '#e2e8f0' : '#f1f5f9',
      color: '#374151',
      border: '1px solid #e2e8f0'
    },
    danger: {
      background: hover ? '#dc2626' : '#ef4444',
      color: '#fff',
      boxShadow: '0 2px 8px rgba(239,68,68,0.3)'
    },
    ghost: {
      background: hover ? '#f1f5f9' : 'transparent',
      color: '#6b7280'
    },
    success: {
      background: hover ? '#059669' : '#10b981',
      color: '#fff',
      boxShadow: '0 2px 8px rgba(16,185,129,0.3)'
    },
    warning: {
      background: hover ? '#d97706' : '#f59e0b',
      color: '#fff'
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding,
        borderRadius: 10,
        fontSize,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        transition: 'all 0.2s',
        opacity: disabled ? 0.6 : 1,
        fontFamily: 'inherit',
        ...variants[variant],
        ...style
      }}
    >
      {Icon && <Icon size={15} />}
      {children}
    </button>
  );
};

// Modal Wrapper Component
const ModalWrapper = ({ open, onClose, title, children, width = 480, subtitle }) => {
  if (!open) return null;
  
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16
    }}>
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)'
        }}
      />
      <div style={{
        position: 'relative',
        width: `min(${width}px, 100%)`,
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#fff',
        borderRadius: 20,
        padding: 28,
        boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
        animation: 'modalSlideIn 0.3s ease'
      }}>
        <style>{`
          @keyframes modalSlideIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 24
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#111827' }}>{title}</h3>
            {subtitle && <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              borderRadius: 8,
              display: 'flex',
              color: '#6b7280'
            }}
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Toast Component
const Toast = ({ toasts, removeToast }) => (
  <div style={{
    position: 'fixed',
    top: 20,
    right: 20,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  }}>
    <style>{`
      @keyframes toastSlideIn {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
      }
    `}</style>
    {toasts.map(toast => (
      <div
        key={toast.id}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 18px',
          borderRadius: 14,
          background: toast.type === 'error' ? '#fef2f2' :
                     toast.type === 'warning' ? '#fffbeb' :
                     toast.type === 'info' ? '#eff6ff' : '#f0fdf4',
          border: `1.5px solid ${
            toast.type === 'error' ? '#fca5a5' :
            toast.type === 'warning' ? '#fde68a' :
            toast.type === 'info' ? '#93c5fd' : '#86efac'
          }`,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          animation: 'toastSlideIn 0.3s ease',
          minWidth: 260,
          maxWidth: 360
        }}
      >
        <span style={{ fontSize: 18 }}>
          {toast.type === 'error' ? '❌' :
           toast.type === 'warning' ? '⚠️' :
           toast.type === 'info' ? 'ℹ️' : '✅'}
        </span>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#111827', flex: 1 }}>
          {toast.message}
        </span>
        <button
          onClick={() => removeToast(toast.id)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#94a3b8',
            padding: 2
          }}
        >
          <X size={14} />
        </button>
      </div>
    ))}
  </div>
);

// User Avatar Component
const UserAvatar = ({ user, size = 44 }) => {
  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.username?.slice(0, 2).toUpperCase() || 'U';
  
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.4,
      fontWeight: 700,
      color: '#fff',
      flexShrink: 0,
      overflow: 'hidden',
      border: '2px solid #e0f2fe',
      boxShadow: '0 2px 8px rgba(102,126,234,0.3)'
    }}>
      {user?.avatar ? (
        <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        initials
      )}
    </div>
  );
};

// Password Strength Indicator
const PasswordStrength = ({ password }) => {
  const getStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^a-zA-Z0-9]/)) score++;
    return score;
  };

  const strength = getStrength();
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const colors = ['#ef4444', '#ef4444', '#f59e0b', '#f59e0b', '#10b981', '#10b981'];
  
  if (!password) return null;
  
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 4,
              background: i <= strength ? colors[strength] : '#e2e8f0',
              transition: 'background 0.3s'
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: colors[strength] }}>
        {labels[strength]}
      </span>
    </div>
  );
};

// ─── Main Settings Component ───────────────────────────────────────────────
const Settings = ({ isOpen = true, onClose }) => {
  // ── State ─────────────────────────────────────────────────────────────────
  const [settings, setSettings] = useState(() => ({
    ...defaultSettings(),
    ...LS.get('userSettings', {})
  }));
  
  const [savedSettings, setSavedSettings] = useState(() => ({
    ...defaultSettings(),
    ...LS.get('userSettings', {})
  }));
  
  const [user, setUser] = useState(() => LS.get('userData', null) || defaultUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!LS.get('userData', null));
  
  // UI State
  const [activeSection, setActiveSection] = useState('appearance');
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  // Refs
  const fileInputRef = useRef(null);
  const importInputRef = useRef(null);
  
  // Modal State
  const [modals, setModals] = useState({
    profile: false,
    password: false,
    twoFactor: false,
    export: false,
    import: false,
    logout: false,
    deleteAccount: false,
    sessions: false,
    billing: false
  });
  
  // Form State
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    company: user?.company || ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    remember: false
  });
  
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm: ''
  });
  
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [importData, setImportData] = useState('');
  const [formErrors, setFormErrors] = useState({});
  
  // Data State
  const [sessions, setSessions] = useState([
    { id: 1, device: 'Chrome on Windows', location: 'Mumbai, India', lastActive: '2 min ago', current: true, ip: '192.168.1.101', browser: 'Chrome 121' },
    { id: 2, device: 'Safari on iPhone 15', location: 'Delhi, India', lastActive: '1 hr ago', current: false, ip: '10.0.0.42', browser: 'Safari 17' },
    { id: 3, device: 'Firefox on MacBook', location: 'Bangalore, India', lastActive: '2 days ago', current: false, ip: '172.16.0.5', browser: 'Firefox 122' }
  ]);
  
  const [billingHistory, setBillingHistory] = useState([
    { id: 1, date: '2024-02-15', amount: 29.99, plan: 'Pro Monthly', status: 'paid' },
    { id: 2, date: '2024-01-15', amount: 29.99, plan: 'Pro Monthly', status: 'paid' },
    { id: 3, date: '2023-12-15', amount: 29.99, plan: 'Pro Monthly', status: 'paid' }
  ]);

  // ── Computed Properties ──────────────────────────────────────────────────
  const hasChanges = JSON.stringify(settings) !== JSON.stringify(savedSettings);
  const accentColor = settings.accentColor || '#667eea';
  const unreadCount = 3; // This would come from notifications

  // ── Toast Helpers ────────────────────────────────────────────────────────
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // ── Setting Helpers ──────────────────────────────────────────────────────
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ── Modal Helpers ────────────────────────────────────────────────────────
  const openModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
    // Reset form errors when closing
    setFormErrors({});
  };

  // ── Validation ───────────────────────────────────────────────────────────
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/.test(phone);
  };

  // ── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    const theme = settings.theme === 'auto'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : settings.theme;
    
    root.setAttribute('data-theme', theme);
    root.style.setProperty('--accent-color', accentColor);
  }, [settings.theme, accentColor]);

  // ── Save Settings ────────────────────────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    LS.set('userSettings', settings);
    setSavedSettings({ ...settings });
    setIsSaving(false);
    addToast('Settings saved successfully!');
  };

  const handleReset = () => {
    const defaults = defaultSettings();
    setSettings(defaults);
    LS.set('userSettings', defaults);
    setSavedSettings(defaults);
    addToast('Settings reset to defaults', 'warning');
  };

  const handleCancel = () => {
    setSettings({ ...savedSettings });
    if (onClose) onClose();
  };

  // ── Authentication ───────────────────────────────────────────────────────
  const handleLogin = async () => {
    const errors = {};
    if (!loginForm.email) errors.email = 'Email is required';
    else if (!validateEmail(loginForm.email)) errors.email = 'Invalid email format';
    if (!loginForm.password) errors.password = 'Password is required';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    await new Promise(resolve => setTimeout(resolve, 800));
    const userData = { ...defaultUser(), email: loginForm.email, lastLogin: new Date().toISOString() };
    LS.set('userData', userData);
    setUser(userData);
    setIsAuthenticated(true);
    closeModal('login');
    setLoginForm({ email: '', password: '', remember: false });
    setFormErrors({});
    addToast(`Welcome back, ${userData.username}! 👋`);
  };

  const handleRegister = async () => {
    const errors = {};
    if (!registerForm.username) errors.username = 'Username is required';
    else if (registerForm.username.length < 3) errors.username = 'Username must be at least 3 characters';
    if (!registerForm.email) errors.email = 'Email is required';
    else if (!validateEmail(registerForm.email)) errors.email = 'Invalid email format';
    if (!registerForm.password) errors.password = 'Password is required';
    else if (registerForm.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (registerForm.password !== registerForm.confirm) errors.confirm = 'Passwords do not match';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    const userData = {
      id: Date.now(),
      username: registerForm.username,
      email: registerForm.email,
      fullName: registerForm.username,
      avatar: null,
      bio: 'New here — just getting started!',
      location: '',
      website: '',
      company: '',
      role: 'Beginner',
      joinedDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isVerified: false,
      rank: 999,
      streak: 0,
      achievements: 0,
      totalPoints: 0,
      social: { github: '', twitter: '', linkedin: '', youtube: '' }
    };
    
    LS.set('userData', userData);
    setUser(userData);
    setIsAuthenticated(true);
    closeModal('register');
    setRegisterForm({ username: '', email: '', password: '', confirm: '' });
    setFormErrors({});
    addToast(`Account created! Welcome, ${userData.username} 🎉`);
  };

  const handleLogout = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    LS.remove('userData');
    LS.remove('rememberMe');
    setUser(null);
    setIsAuthenticated(false);
    closeModal('logout');
    setActiveSection('appearance');
    addToast('Logged out successfully', 'info');
  };

  // ── Profile Management ───────────────────────────────────────────────────
  const handleProfileUpdate = async () => {
    const errors = {};
    if (!profileForm.fullName) errors.fullName = 'Full name is required';
    if (!profileForm.email) errors.email = 'Email is required';
    else if (!validateEmail(profileForm.email)) errors.email = 'Invalid email format';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    await new Promise(resolve => setTimeout(resolve, 600));
    const updatedUser = {
      ...user,
      ...profileForm,
      avatar: avatarPreview || user?.avatar
    };
    
    LS.set('userData', updatedUser);
    setUser(updatedUser);
    closeModal('profile');
    setAvatarPreview(null);
    setFormErrors({});
    addToast('Profile updated successfully!');
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      addToast('Image must be less than 5MB', 'error');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarPreview(event.target.result);
    };
    reader.readAsDataURL(file);
    addToast('Photo selected — save profile to apply', 'info');
  };

  // ── Password Management ──────────────────────────────────────────────────
  const handlePasswordChange = async () => {
    const errors = {};
    if (!passwordForm.current) errors.current = 'Current password is required';
    if (!passwordForm.new) errors.new = 'New password is required';
    else if (passwordForm.new.length < 8) errors.new = 'Password must be at least 8 characters';
    if (passwordForm.new !== passwordForm.confirm) errors.confirm = 'Passwords do not match';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    await new Promise(resolve => setTimeout(resolve, 800));
    closeModal('password');
    setPasswordForm({ current: '', new: '', confirm: '' });
    setFormErrors({});
    addToast('Password changed successfully! 🔒');
  };

  // ── Two Factor Authentication ────────────────────────────────────────────
  const handleEnable2FA = async () => {
    if (!twoFactorCode || twoFactorCode.length !== 6) {
      setFormErrors({ code: 'Enter a valid 6-digit code' });
      return;
    }
    
    await new Promise(resolve => setTimeout(resolve, 600));
    updateSetting('twoFactorAuth', true);
    closeModal('twoFactor');
    setTwoFactorCode('');
    setFormErrors({});
    addToast('Two-factor authentication enabled! 🛡️');
  };

  const handleDisable2FA = () => {
    updateSetting('twoFactorAuth', false);
    addToast('Two-factor authentication disabled', 'warning');
  };

  // ── Session Management ───────────────────────────────────────────────────
  const revokeSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    addToast('Session revoked');
  };

  const revokeAllOtherSessions = () => {
    setSessions(prev => prev.filter(s => s.current));
    addToast('All other sessions revoked');
  };

  // ── Export / Import ──────────────────────────────────────────────────────
  const handleExport = (format) => {
    const data = format === 'json'
      ? JSON.stringify({ settings, user, exportedAt: new Date().toISOString() }, null, 2)
      : ['Setting,Value', ...Object.entries(settings).map(([key, val]) => `${key},${val}`)].join('\n');
    
    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `settings-${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    closeModal('export');
    addToast(`Exported as ${format.toUpperCase()}`);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        const importedSettings = imported.settings || imported;
        setSettings(prev => ({ ...prev, ...importedSettings }));
        addToast('Settings imported successfully!');
      } catch {
        addToast('Invalid file format', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImportText = () => {
    try {
      const parsed = JSON.parse(importData);
      const importedSettings = parsed.settings || parsed;
      setSettings(prev => ({ ...prev, ...importedSettings }));
      closeModal('import');
      setImportData('');
      addToast('Settings imported successfully!');
    } catch {
      setFormErrors({ import: 'Invalid JSON format' });
    }
  };

  // ── Account Deletion ─────────────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      setFormErrors({ delete: 'Please type DELETE to confirm' });
      return;
    }
    
    await new Promise(resolve => setTimeout(resolve, 800));
    LS.remove('userData');
    LS.remove('userSettings');
    LS.remove('rememberMe');
    setUser(null);
    setIsAuthenticated(false);
    closeModal('deleteAccount');
    setDeleteConfirm('');
    setFormErrors({});
    setActiveSection('appearance');
    addToast('Account deleted. Sorry to see you go 👋', 'warning');
  };

  // ── Billing ──────────────────────────────────────────────────────────────
  const handleCancelSubscription = () => {
    addToast('Subscription cancelled. You will be downgraded at the end of the billing period.', 'warning');
    closeModal('billing');
  };

  // ── Performance ──────────────────────────────────────────────────────────
  const optimizePerformance = () => {
    updateSetting('hardwareAcceleration', true);
    updateSetting('networkOptimization', true);
    updateSetting('memoryOptimization', true);
    updateSetting('animationQuality', 'high');
    updateSetting('lowPowerMode', false);
    updateSetting('dataSaver', false);
    addToast('Optimized for best performance! ⚡');
  };

  const enablePowerSaver = () => {
    updateSetting('lowPowerMode', true);
    updateSetting('animationQuality', 'low');
    updateSetting('preloadAssets', false);
    updateSetting('backgroundSync', false);
    updateSetting('hardwareAcceleration', false);
    updateSetting('dataSaver', true);
    addToast('Power saver mode enabled 🔋', 'info');
  };

  const clearCache = () => {
    addToast('Cache cleared!');
  };

  // ── Test Functions ───────────────────────────────────────────────────────
  const testNotification = () => {
    addToast('🔔 Test notification - sounds are working!', 'info');
    if (settings.desktopNotifications && Notification.permission === 'granted') {
      new Notification('Test Notification', { body: 'Notifications are working correctly.' });
    } else if (settings.desktopNotifications && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };

  // ── Navigation Sections ──────────────────────────────────────────────────
  const sections = [
    { id: 'appearance', label: 'Appearance', icon: Palette, color: '#8b5cf6' },
    { id: 'profile', label: 'Profile', icon: User, color: '#ec4899', auth: true },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: '#3b82f6' },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield, color: '#10b981' },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon, color: '#f59e0b' },
    { id: 'editor', label: 'Editor', icon: Code, color: '#6366f1' },
    { id: 'performance', label: 'Performance', icon: Zap, color: '#f97316' },
    { id: 'accessibility', label: 'Accessibility', icon: Eye, color: '#06b6d4' },
    { id: 'account', label: 'Account', icon: Key, color: '#ef4444', auth: true },
    { id: 'billing', label: 'Billing', icon: CreditCard, color: '#8b5cf6', auth: true }
  ];

  const filteredSections = sections.filter(s =>
    s.label.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!s.auth || isAuthenticated)
  );

  // ── Render ───────────────────────────────────────────────────────────────
  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        
        .settings-panel {
          animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .nav-item:hover {
          background: ${accentColor}14;
        }
        
        .nav-item.active {
          background: ${accentColor}14;
          border-left-color: ${accentColor};
          color: ${accentColor};
        }
        
        .section-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        
        input:focus, select:focus, textarea:focus {
          border-color: ${accentColor} !important;
          box-shadow: 0 0 0 3px ${accentColor}20 !important;
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={handleCancel}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(4px)',
          zIndex: 999
        }}
      />

      {/* Main Panel */}
      <div className="settings-panel" style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: 'min(780px, 100vw)',
        height: '100vh',
        background: '#f8fafc',
        borderLeft: '1px solid #e2e8f0',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${accentColor}, #764ba2)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <SettingsIcon size={20} color="#fff" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>Settings</h2>
              <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>Customize your experience</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {hasChanges && (
              <span style={{
                fontSize: 11,
                background: '#fffbeb',
                color: '#d97706',
                padding: '4px 10px',
                borderRadius: 20,
                border: '1px solid #fde68a',
                fontWeight: 600
              }}>
                Unsaved changes
              </span>
            )}
            {!isAuthenticated && (
              <span style={{
                fontSize: 11,
                background: '#fef3c7',
                color: '#92400e',
                padding: '4px 10px',
                borderRadius: 20,
                border: '1px solid #fde68a',
                fontWeight: 600
              }}>
                Guest Mode
              </span>
            )}
            <button
              onClick={handleCancel}
              style={{
                background: '#f1f5f9',
                border: 'none',
                cursor: 'pointer',
                padding: 8,
                borderRadius: 8,
                display: 'flex',
                color: '#6b7280'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Sidebar Navigation */}
          <div style={{
            width: 220,
            background: '#fff',
            borderRight: '1px solid #f1f5f9',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            overflowY: 'auto'
          }}>
            {/* Search */}
            <div style={{ padding: '16px 12px 8px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8'
                }} />
                <input
                  type="text"
                  placeholder="Search settings..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px 8px 32px',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: 12,
                    background: '#f8fafc',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Navigation Items */}
            <nav style={{ padding: '8px 8px 16px' }}>
              {filteredSections.map(section => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                const isLocked = section.auth && !isAuthenticated;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => !isLocked && setActiveSection(section.id)}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: 'none',
                      cursor: isLocked ? 'not-allowed' : 'pointer',
                      background: isActive ? `${accentColor}14` : 'transparent',
                      borderLeft: `3px solid ${isActive ? accentColor : 'transparent'}`,
                      marginBottom: 2,
                      opacity: isLocked ? 0.5 : 1,
                      color: isActive ? accentColor : '#4b5563',
                      fontWeight: isActive ? 600 : 500,
                      fontSize: 13,
                      transition: 'all 0.2s'
                    }}
                  >
                    <Icon size={16} color={isActive ? accentColor : section.color} />
                    <span style={{ flex: 1, textAlign: 'left' }}>{section.label}</span>
                    {isLocked && <Lock size={12} color="#94a3b8" />}
                  </button>
                );
              })}
            </nav>

            {/* Quick Actions */}
            <div style={{
              padding: '16px 12px',
              borderTop: '1px solid #f1f5f9',
              marginTop: 'auto'
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8 }}>
                Quick Actions
              </div>
              <button
                onClick={() => isAuthenticated ? openModal('export') : addToast('Login required', 'error')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 10px',
                  borderRadius: 6,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  color: '#6b7280',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <Download size={12} /> Export Settings
              </button>
              <button
                onClick={() => isAuthenticated ? importInputRef.current?.click() : addToast('Login required', 'error')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 10px',
                  borderRadius: 6,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  color: '#6b7280',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <Upload size={12} /> Import Settings
              </button>
              <button
                onClick={handleReset}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 10px',
                  borderRadius: 6,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  color: '#ef4444',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <RefreshCw size={12} /> Reset to Defaults
              </button>
            </div>

            {/* User Card */}
            {isAuthenticated && user ? (
              <div style={{
                padding: '16px 12px',
                borderTop: '1px solid #f1f5f9',
                background: '#f9fafb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <UserAvatar user={user} size={36} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{user.username}</div>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>{user.email}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 600,
                    background: '#fef9c3',
                    color: '#92400e',
                    padding: '2px 8px',
                    borderRadius: 12
                  }}>
                    🏆 Rank #{user.rank}
                  </span>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 600,
                    background: '#fee2e2',
                    color: '#b91c1c',
                    padding: '2px 8px',
                    borderRadius: 12
                  }}>
                    🔥 {user.streak} days
                  </span>
                </div>
              </div>
            ) : (
              <div style={{
                padding: '16px 12px',
                borderTop: '1px solid #f1f5f9',
                textAlign: 'center'
              }}>
                <User size={32} color="#94a3b8" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 4 }}>
                  Guest Mode
                </div>
                <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 12 }}>
                  Sign in to save settings
                </div>
                <Button
                  onClick={() => openModal('login')}
                  variant="primary"
                  size="sm"
                  style={{ width: '100%' }}
                >
                  Sign In
                </Button>
              </div>
            )}
          </div>

          {/* Content Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 24px 32px',
            background: '#f8fafc'
          }}>
            {/* Guest Banner */}
            {!isAuthenticated && activeSection !== 'appearance' && activeSection !== 'notifications' && 
             activeSection !== 'preferences' && activeSection !== 'performance' && activeSection !== 'accessibility' && (
              <div style={{
                display: 'flex',
                gap: 12,
                padding: '14px 18px',
                background: '#fffbeb',
                border: '1.5px solid #fde68a',
                borderRadius: 12,
                marginBottom: 24
              }}>
                <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>Guest Mode</div>
                  <div style={{ fontSize: 12, color: '#a16207', marginTop: 2 }}>
                    <button
                      onClick={() => openModal('login')}
                      style={{ color: accentColor, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                    >
                      Sign in
                    </button> to access profile, account, and billing settings.
                  </div>
                </div>
              </div>
            )}

            {/* ── Appearance Section ── */}
            {activeSection === 'appearance' && (
              <>
                <SectionTitle icon={Palette} iconColor="#8b5cf6" title="Appearance" sub="Customize the look and feel" />

                <SectionCard>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Theme</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {[
                      { value: 'light', icon: Sun, label: 'Light' },
                      { value: 'dark', icon: Moon, label: 'Dark' },
                      { value: 'auto', icon: Globe, label: 'System' }
                    ].map(({ value, icon: Icon, label }) => (
                      <button
                        key={value}
                        onClick={() => updateSetting('theme', value)}
                        style={{
                          padding: '16px 12px',
                          borderRadius: 12,
                          border: `2px solid ${settings.theme === value ? accentColor : '#e2e8f0'}`,
                          background: settings.theme === value ? `${accentColor}08` : '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 8
                        }}
                      >
                        <Icon size={22} color={settings.theme === value ? accentColor : '#94a3b8'} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: settings.theme === value ? accentColor : '#6b7280' }}>
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Accent Color</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 16 }}>
                    Choose your highlight color
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    {[
                      { color: '#667eea', label: 'Purple' },
                      { color: '#3b82f6', label: 'Blue' },
                      { color: '#10b981', label: 'Green' },
                      { color: '#f59e0b', label: 'Orange' },
                      { color: '#ef4444', label: 'Red' },
                      { color: '#ec4899', label: 'Pink' },
                      { color: '#8b5cf6', label: 'Violet' }
                    ].map(({ color, label }) => (
                      <button
                        key={color}
                        onClick={() => updateSetting('accentColor', color)}
                        title={label}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: color,
                          border: `3px solid ${settings.accentColor === color ? '#1e293b' : 'transparent'}`,
                          cursor: 'pointer',
                          boxShadow: settings.accentColor === color ? `0 0 0 2px ${color}40` : 'none'
                        }}
                      />
                    ))}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: '#6b7280' }}>Custom:</span>
                      <input
                        type="color"
                        value={settings.accentColor}
                        onChange={e => updateSetting('accentColor', e.target.value)}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          border: '2px solid #e2e8f0',
                          cursor: 'pointer',
                          padding: 0
                        }}
                      />
                    </div>
                  </div>
                </SectionCard>

                <SectionCard>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Font Size</div>
                  <PillSelector
                    value={settings.fontSize}
                    onChange={v => updateSetting('fontSize', v)}
                    color={accentColor}
                    options={[
                      { value: 'small', label: 'Small' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'large', label: 'Large' }
                    ]}
                  />
                </SectionCard>

                <SectionCard>
                  <SettingRow
                    label="Enable Animations"
                    sub="Smooth transitions throughout the app"
                    left={<Zap size={16} color="#8b5cf6" />}
                    right={<Toggle checked={settings.animations} onChange={() => toggleSetting('animations')} color={accentColor} />}
                  />
                  <SettingRow
                    label="Reduce Motion"
                    sub="Disable motion effects"
                    left={<Eye size={16} color="#06b6d4" />}
                    right={<Toggle checked={settings.reduceMotion} onChange={() => toggleSetting('reduceMotion')} color={accentColor} />}
                    noBorder
                  />
                </SectionCard>
              </>
            )}

            {/* ── Profile Section ── */}
            {activeSection === 'profile' && isAuthenticated && (
              <>
                <SectionTitle icon={User} iconColor="#ec4899" title="Profile" sub="Manage your personal information" />

                <SectionCard>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                      <UserAvatar user={user} size={72} />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          background: accentColor,
                          border: '2px solid #fff',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <Camera size={12} color="#fff" />
                      </button>
                    </div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>{user.fullName}</div>
                      <div style={{ fontSize: 13, color: '#6b7280' }}>@{user.username} · {user.email}</div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        {user.isVerified && (
                          <span style={{
                            background: '#dbeafe',
                            color: '#2563eb',
                            fontSize: 11,
                            fontWeight: 600,
                            padding: '2px 10px',
                            borderRadius: 20
                          }}>
                            ✓ Verified
                          </span>
                        )}
                        <span style={{
                          background: '#f3e8ff',
                          color: '#9333ea',
                          fontSize: 11,
                          fontWeight: 600,
                          padding: '2px 10px',
                          borderRadius: 20
                        }}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard>
                  <Button
                    onClick={() => {
                      setProfileForm({
                        fullName: user.fullName,
                        username: user.username,
                        email: user.email,
                        bio: user.bio,
                        location: user.location,
                        website: user.website,
                        company: user.company
                      });
                      openModal('profile');
                    }}
                    variant="secondary"
                    icon={Edit}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Edit Profile
                  </Button>
                </SectionCard>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <SectionCard>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Account Stats</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: 13, color: '#6b7280' }}>Member since</span>
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>
                          {new Date(user.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: 13, color: '#6b7280' }}>Last login</span>
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>Just now</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: 13, color: '#6b7280' }}>Rank</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#667eea' }}>#{user.rank}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 13, color: '#6b7280' }}>Streak</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#f97316' }}>{user.streak} days</span>
                      </div>
                    </div>
                  </SectionCard>

                  <SectionCard>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Quick Actions</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <button
                        onClick={() => openModal('password')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '10px',
                          borderRadius: 8,
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          cursor: 'pointer',
                          width: '100%',
                          textAlign: 'left'
                        }}
                      >
                        <Lock size={16} color="#6b7280" />
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#111827', flex: 1 }}>Change Password</span>
                        <ChevronRight size={14} color="#94a3b8" />
                      </button>
                      <button
                        onClick={settings.twoFactorAuth ? handleDisable2FA : () => openModal('twoFactor')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '10px',
                          borderRadius: 8,
                          background: settings.twoFactorAuth ? '#f0fdf4' : '#f8fafc',
                          border: '1px solid #e2e8f0',
                          cursor: 'pointer',
                          width: '100%',
                          textAlign: 'left'
                        }}
                      >
                        <ShieldCheck size={16} color={settings.twoFactorAuth ? '#10b981' : '#6b7280'} />
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#111827', flex: 1 }}>Two-Factor Auth</span>
                        {settings.twoFactorAuth && <Check size={14} color="#10b981" />}
                      </button>
                    </div>
                  </SectionCard>
                </div>

                <SectionCard>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Social Profiles</div>
                  {[
                    { icon: Github, label: 'GitHub', value: user.social?.github, color: '#333' },
                    { icon: Twitter, label: 'Twitter', value: user.social?.twitter, color: '#1DA1F2' },
                    { icon: Linkedin, label: 'LinkedIn', value: user.social?.linkedin, color: '#0077B5' },
                    { icon: Youtube, label: 'YouTube', value: user.social?.youtube, color: '#FF0000' }
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <Icon size={16} color={color} />
                      <span style={{ fontSize: 13, color: '#6b7280', width: 70 }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#111827', flex: 1 }}>
                        {value ? `@${value}` : 'Not connected'}
                      </span>
                      <button style={{ fontSize: 12, color: accentColor, background: 'none', border: 'none', cursor: 'pointer' }}>
                        {value ? 'Edit' : 'Connect'}
                      </button>
                    </div>
                  ))}
                </SectionCard>
              </>
            )}

            {/* ── Notifications Section ── */}
            {activeSection === 'notifications' && (
              <>
                <SectionTitle icon={Bell} iconColor="#3b82f6" title="Notifications" sub="Control how you get notified" />

                <SectionCard>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Notification Channels</div>
                  <SettingRow
                    label="Email Notifications"
                    sub="Receive updates via email"
                    left={<Mail size={16} color="#3b82f6" />}
                    right={<Toggle checked={settings.emailNotifications} onChange={() => toggleSetting('emailNotifications')} color={accentColor} />}
                  />
                  <SettingRow
                    label="Push Notifications"
                    sub="Browser push notifications"
                    left={<BellRing size={16} color="#6366f1" />}
                    right={<Toggle checked={settings.pushNotifications} onChange={() => toggleSetting('pushNotifications')} color={accentColor} />}
                  />
                  <SettingRow
                    label="Desktop Notifications"
                    sub="System notifications"
                    left={<Monitor size={16} color="#10b981" />}
                    right={<Toggle checked={settings.desktopNotifications} onChange={() => toggleSetting('desktopNotifications')} color={accentColor} />}
                  />
                  <SettingRow
                    label="Sound Effects"
                    sub="Play sounds for notifications"
                    left={<Volume2 size={16} color="#f59e0b" />}
                    right={<Toggle checked={settings.soundEnabled} onChange={() => toggleSetting('soundEnabled')} color={accentColor} />}
                    noBorder
                  />
                </SectionCard>

                <SectionCard>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Volume</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: accentColor }}>{settings.notificationVolume}%</span>
                    </div>
                    <RangeSlider
                      value={settings.notificationVolume}
                      onChange={v => updateSetting('notificationVolume', v)}
                      color={accentColor}
                    />
                  </div>
                  <Button onClick={testNotification} variant="secondary" size="sm" icon={Volume2}>
                    Test Notification
                  </Button>
                </SectionCard>

                <SectionCard>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Alert Types</div>
                  <SettingRow
                    label="Achievement Alerts"
                    sub="When you earn new badges"
                    left={<Award size={16} color="#f59e0b" />}
                    right={<Toggle checked={settings.achievementAlerts} onChange={() => toggleSetting('achievementAlerts')} color={accentColor} />}
                  />
                  <SettingRow
                    label="Rank Updates"
                    sub="When your ranking changes"
                    left={<TrendingUp size={16} color="#10b981" />}
                    right={<Toggle checked={settings.rankUpdates} onChange={() => toggleSetting('rankUpdates')} color={accentColor} />}
                  />
                  <SettingRow
                    label="Streak Reminders"
                    sub="Daily reminders to keep your streak"
                    left={<Flame size={16} color="#ef4444" />}
                    right={<Toggle checked={settings.streakReminders} onChange={() => toggleSetting('streakReminders')} color={accentColor} />}
                    noBorder
                  />
                </SectionCard>
              </>
            )}

            {/* ── Privacy & Security Section ── */}
            {activeSection === 'privacy' && (
              <>
                <SectionTitle icon={Shield} iconColor="#10b981" title="Privacy & Security" sub="Control your data and security" />

                <SectionCard>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Security</div>
                  <SettingRow
                    label="Two-Factor Authentication"
                    sub={settings.twoFactorAuth ? '✓ Active - extra secure' : 'Add an extra security layer'}
                    left={<ShieldCheck size={16} color={settings.twoFactorAuth ? '#10b981' : '#94a3b8'} />}
                    right={<Toggle checked={settings.twoFactorAuth} onChange={settings.twoFactorAuth ? handleDisable2FA : () => openModal('twoFactor')} color={accentColor} />}
                  />
                  <SettingRow
                    label="Login Alerts"
                    sub="Email me on new device sign-ins"
                    left={<Mail size={16} color="#3b82f6" />}
                    right={<Toggle checked={settings.loginAlerts} onChange={() => toggleSetting('loginAlerts')} color={accentColor} />}
                    noBorder
                  />
                </SectionCard>

                <SectionCard>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Profile Visibility</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 16 }}>
                    Who can see your profile
                  </div>
                  <PillSelector
                    value={settings.profileVisibility}
                    onChange={v => updateSetting('profileVisibility', v)}
                    color={accentColor}
                    options={[
                      { value: 'public', label: '🌐 Public' },
                      { value: 'friends', label: '👥 Friends' },
                      { value: 'private', label: '🔒 Private' }
                    ]}
                  />
                </SectionCard>

                <SectionCard>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Activity Visibility</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 16 }}>
                    Who can see your activity
                  </div>
                  <PillSelector
                    value={settings.activityVisibility}
                    onChange={v => updateSetting('activityVisibility', v)}
                    color={accentColor}
                    options={[
                      { value: 'public', label: '🌐 Public' },
                      { value: 'friends', label: '👥 Friends' },
                      { value: 'private', label: '🔒 Private' }
                    ]}
                  />
                </SectionCard>

                <SectionCard>
                  <SettingRow
                    label="Show Online Status"
                    sub="Let others see when you're active"
                    left={<Wifi size={16} color="#10b981" />}
                    right={<Toggle checked={settings.showOnlineStatus} onChange={() => toggleSetting('showOnlineStatus')} color={accentColor} />}
                  />
                  <SettingRow
                    label="Show Activity"
                    sub="Display your coding activity"
                    left={<Activity size={16} color="#6366f1" />}
                    right={<Toggle checked={settings.showActivity} onChange={() => toggleSetting('showActivity')} color={accentColor} />}
                  />
                  <SettingRow
                    label="Show Achievements"
                    sub="Display badges on your profile"
                    left={<Trophy size={16} color="#f59e0b" />}
                    right={<Toggle checked={settings.showAchievements} onChange={() => toggleSetting('showAchievements')} color={accentColor} />}
                  />
                  <SettingRow
                    label="Hide Email"
                    sub="Keep your email private"
                    left={<EyeOff size={16} color="#ef4444" />}
                    right={<Toggle checked={settings.hideEmail} onChange={() => toggleSetting('hideEmail')} color={accentColor} />}
                  />
                  <SettingRow
                    label="Hide Rank"
                    sub="Don't display your rank"
                    left={<Shield size={16} color="#8b5cf6" />}
                    right={<Toggle checked={settings.hideRank} onChange={() => toggleSetting('hideRank')} color={accentColor} />}
                  />
                  <SettingRow
                    label="Allow Tracking"
                    sub="Help improve the app with usage data"
                    left={<Database size={16} color="#94a3b8" />}
                    right={<Toggle checked={settings.allowTracking} onChange={() => toggleSetting('allowTracking')} color={accentColor} />}
                    noBorder
                  />
                </SectionCard>

                <SectionCard>
                  <button
                    onClick={() => openModal('sessions')}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Monitor size={18} color={accentColor} />
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Active Sessions</div>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>{sessions.length} device(s) signed in</div>
                      </div>
                    </div>
                    <ChevronRight size={16} color="#94a3b8" />
                  </button>
                </SectionCard>
              </>
            )}

            {/* ── Preferences Section ── */}
            {activeSection === 'preferences' && (
              <>
                <SectionTitle icon={SettingsIcon} iconColor="#f59e0b" title="Preferences" sub="Language, region, and more" />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <SectionCard style={{ margin: 0 }}>
                    <SelectField
                      label="Language"
                      value={settings.language}
                      onChange={v => updateSetting('language', v)}
                      options={[
                        { value: 'en', label: 'English' },
                        { value: 'es', label: 'Spanish' },
                        { value: 'fr', label: 'French' },
                        { value: 'de', label: 'German' },
                        { value: 'hi', label: 'Hindi' },
                        { value: 'zh', label: 'Chinese' }
                      ]}
                    />
                  </SectionCard>
                  <SectionCard style={{ margin: 0 }}>
                    <SelectField
                      label="Timezone"
                      value={settings.timezone}
                      onChange={v => updateSetting('timezone', v)}
                      options={[
                        { value: 'Asia/Kolkata', label: 'India (IST)' },
                        { value: 'America/New_York', label: 'New York (EST)' },
                        { value: 'America/Los_Angeles', label: 'Los Angeles (PST)' },
                        { value: 'Europe/London', label: 'London (GMT)' },
                        { value: 'Europe/Paris', label: 'Paris (CET)' },
                        { value: 'Asia/Tokyo', label: 'Tokyo (JST)' }
                      ]}
                    />
                  </SectionCard>
                </div>

                <SectionCard>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Default Difficulty</div>
                  <PillSelector
                    value={settings.difficulty}
                    onChange={v => updateSetting('difficulty', v)}
                    color={accentColor}
                    options={[
                      { value: 'beginner', label: '🌱 Beginner' },
                      { value: 'medium', label: '🌿 Intermediate' },
                      { value: 'hard', label: '🔥 Advanced' }
                    ]}
                  />
                </SectionCard>

                <SectionCard>
                  <SettingRow
                    label="Auto Save"
                    sub="Automatically save changes"
                    left={<Save size={16} color="#10b981" />}
                    right={<Toggle checked={settings.autoSave} onChange={() => toggleSetting('autoSave')} color={accentColor} />}
                  />
                  {settings.autoSave && (
                    <div style={{ paddingTop: 14 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                        Save interval: <span style={{ color: accentColor, fontWeight: 700 }}>{settings.autoSaveInterval} min</span>
                      </div>
                      <RangeSlider
                        value={settings.autoSaveInterval}
                        min={1}
                        max={30}
                        onChange={v => updateSetting('autoSaveInterval', v)}
                        color={accentColor}
                      />
                    </div>
                  )}
                </SectionCard>
              </>
            )}

            {/* ── Editor Section ── */}
            {activeSection === 'editor' && (
              <>
                <SectionTitle icon={Code} iconColor="#6366f1" title="Editor" sub="Customize your coding environment" />

                <SectionCard>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <Code size={18} color="#6366f1" />
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Editor Settings</div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                      Font Size: <span style={{ color: accentColor, fontWeight: 700 }}>{settings.fontSizeEditor}px</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <button
                        onClick={() => updateSetting('fontSizeEditor', Math.max(8, settings.fontSizeEditor - 1))}
                        style={{ width: 30, height: 30, borderRadius: 8, background: '#f1f5f9', border: '1px solid #e2e8f0', cursor: 'pointer' }}
                      >
                        <Minus size={14} />
                      </button>
                      <div style={{ flex: 1 }}>
                        <RangeSlider
                          value={settings.fontSizeEditor}
                          min={8}
                          max={24}
                          onChange={v => updateSetting('fontSizeEditor', v)}
                          color={accentColor}
                        />
                      </div>
                      <button
                        onClick={() => updateSetting('fontSizeEditor', Math.min(24, settings.fontSizeEditor + 1))}
                        style={{ width: 30, height: 30, borderRadius: 8, background: '#f1f5f9', border: '1px solid #e2e8f0', cursor: 'pointer' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Tab Size</div>
                    <PillSelector
                      value={String(settings.tabSize)}
                      onChange={v => updateSetting('tabSize', Number(v))}
                      color={accentColor}
                      options={[
                        { value: '2', label: '2 spaces' },
                        { value: '4', label: '4 spaces' },
                        { value: '8', label: '8 spaces' }
                      ]}
                    />
                  </div>

                  <SettingRow
                    label="Line Wrap"
                    sub="Wrap long lines of code"
                    right={<Toggle checked={settings.lineWrap} onChange={() => toggleSetting('lineWrap')} color={accentColor} />}
                  />
                  <SettingRow
                    label="Auto Complete"
                    sub="Show intelligent code suggestions"
                    right={<Toggle checked={settings.autoComplete} onChange={() => toggleSetting('autoComplete')} color={accentColor} />}
                  />
                  <SettingRow
                    label="Linting"
                    sub="Highlight errors in real-time"
                    right={<Toggle checked={settings.linting} onChange={() => toggleSetting('linting')} color={accentColor} />}
                  />
                  <SettingRow
                    label="Format on Save"
                    sub="Auto-format code when saving"
                    right={<Toggle checked={settings.formatOnSave} onChange={() => toggleSetting('formatOnSave')} color={accentColor} />}
                  />
                  <SettingRow
                    label="Show Line Numbers"
                    sub="Display line numbers in the gutter"
                    right={<Toggle checked={settings.showLineNumbers} onChange={() => toggleSetting('showLineNumbers')} color={accentColor} />}
                  />
                  <SettingRow
                    label="Minimap"
                    sub="Show code overview minimap"
                    right={<Toggle checked={settings.minimap} onChange={() => toggleSetting('minimap')} color={accentColor} />}
                    noBorder
                  />
                </SectionCard>
              </>
            )}

            {/* ── Performance Section ── */}
            {activeSection === 'performance' && (
              <>
                <SectionTitle icon={Zap} iconColor="#f97316" title="Performance" sub="Optimize speed and resource usage" />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <Button onClick={optimizePerformance} variant="primary" icon={Zap} style={{ padding: '14px', justifyContent: 'center', borderRadius: 14 }}>
                    ⚡ Optimize All
                  </Button>
                  <Button onClick={enablePowerSaver} variant="success" icon={BatteryCharging} style={{ padding: '14px', justifyContent: 'center', borderRadius: 14 }}>
                    🔋 Power Saver
                  </Button>
                </div>

                <SectionCard>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Hardware</div>
                  <SettingRow
                    label="Hardware Acceleration"
                    sub="Use GPU for smoother UI"
                    left={<Cpu size={16} color="#3b82f6" />}
                    right={<Toggle checked={settings.hardwareAcceleration} onChange={() => toggleSetting('hardwareAcceleration')} color={accentColor} />}
                  />
                  <SettingRow
                    label="Memory Optimization"
                    sub="Reduce RAM usage"
                    left={<MemoryStick size={16} color="#f59e0b" />}
                    right={<Toggle checked={settings.memoryOptimization} onChange={() => toggleSetting('memoryOptimization')} color={accentColor} />}
                  />
                </SectionCard>

                <SectionCard>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Network</div>
                  <SettingRow
                    label="Network Optimization"
                    sub="Optimize data transfer"
                    left={<Wifi size={16} color="#10b981" />}
                    right={<Toggle checked={settings.networkOptimization} onChange={() => toggleSetting('networkOptimization')} color={accentColor} />}
                  />
                  <SettingRow
                    label="Background Sync"
                    sub="Sync data in the background"
                    left={<RefreshCw size={16} color="#8b5cf6" />}
                    right={<Toggle checked={settings.backgroundSync} onChange={() => toggleSetting('backgroundSync')} color={accentColor} />}
                  />
                  <SettingRow
                    label="Preload Assets"
                    sub="Load resources before needed"
                    left={<Download size={16} color="#06b6d4" />}
                    right={<Toggle checked={settings.preloadAssets} onChange={() => toggleSetting('preloadAssets')} color={accentColor} />}
                  />
                  <SettingRow
                    label="Data Saver"
                    sub="Reduce data usage"
                    left={<Smartphone size={16} color="#f97316" />}
                    right={<Toggle checked={settings.dataSaver} onChange={() => toggleSetting('dataSaver')} color={accentColor} />}
                    noBorder
                  />
                </SectionCard>

                <SectionCard>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Cache Size</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
                    Current: <strong style={{ color: accentColor }}>{settings.cacheSize} MB</strong>
                  </div>
                  <RangeSlider
                    value={settings.cacheSize}
                    min={50}
                    max={2000}
                    step={50}
                    onChange={v => updateSetting('cacheSize', v)}
                    color={accentColor}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', marginTop: 4, marginBottom: 16 }}>
                    <span>50 MB</span>
                    <span>2 GB</span>
                  </div>
                  <Button onClick={clearCache} variant="secondary" size="sm" icon={Trash2}>
                    Clear Cache Now
                  </Button>
                </SectionCard>
              </>
            )}

            {/* ── Accessibility Section ── */}
            {activeSection === 'accessibility' && (
              <>
                <SectionTitle icon={Eye} iconColor="#06b6d4" title="Accessibility" sub="Make the interface work for you" />

                <SectionCard>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Vision</div>
                  <SettingRow
                    label="High Contrast"
                    sub="Increase visual contrast"
                    left={<Eye size={16} color="#3b82f6" />}
                    right={<Toggle checked={settings.highContrast} onChange={() => toggleSetting('highContrast')} color={accentColor} />}
                  />
                  <SettingRow
                    label="Large Text"
                    sub="Increase font size"
                    left={<EyeOff size={16} color="#8b5cf6" />}
                    right={<Toggle checked={settings.largeText} onChange={() => toggleSetting('largeText')} color={accentColor} />}
                  />
                  <SettingRow
                    label="Screen Reader Support"
                    sub="Optimize for screen readers"
                    left={<Volume2 size={16} color="#10b981" />}
                    right={<Toggle checked={settings.screenReader} onChange={() => toggleSetting('screenReader')} color={accentColor} />}
                  />
                  <SettingRow
                    label="Reduce Motion"
                    sub="Disable animations"
                    left={<Zap size={16} color="#ef4444" />}
                    right={<Toggle checked={settings.reduceMotion} onChange={() => toggleSetting('reduceMotion')} color={accentColor} />}
                  />
                </SectionCard>

                <SectionCard>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Color Blind Mode</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 16 }}>
                    Adjust colors for color vision deficiency
                  </div>
                  <PillSelector
                    value={settings.colorBlindMode}
                    onChange={v => updateSetting('colorBlindMode', v)}
                    color={accentColor}
                    options={[
                      { value: 'none', label: 'None' },
                      { value: 'protanopia', label: 'Protanopia' },
                      { value: 'deuteranopia', label: 'Deuteranopia' },
                      { value: 'tritanopia', label: 'Tritanopia' }
                    ]}
                  />
                </SectionCard>

                <SectionCard>
                  <SettingRow
                    label="Focus Mode"
                    sub="Hide distracting elements"
                    left={<Eye size={16} color="#6366f1" />}
                    right={<Toggle checked={settings.focusMode} onChange={() => toggleSetting('focusMode')} color={accentColor} />}
                  />
                  <SettingRow
                    label="Keyboard Shortcuts"
                    sub="Enable keyboard navigation"
                    left={<Code size={16} color="#3b82f6" />}
                    right={<Toggle checked={settings.keyboardShortcuts} onChange={() => toggleSetting('keyboardShortcuts')} color={accentColor} />}
                  />
                  <SettingRow
                    label="Captions"
                    sub="Show captions for media"
                    left={<FileText size={16} color="#f97316" />}
                    right={<Toggle checked={settings.captionsEnabled} onChange={() => toggleSetting('captionsEnabled')} color={accentColor} />}
                    noBorder
                  />
                </SectionCard>
              </>
            )}

            {/* ── Account Section ── */}
            {activeSection === 'account' && isAuthenticated && (
              <>
                <SectionTitle icon={Key} iconColor="#ef4444" title="Account" sub="Manage your account settings" />

                <SectionCard>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Email Preferences</div>
                  <SelectField
                    label="Email Digest Frequency"
                    value={settings.emailFrequency}
                    onChange={v => updateSetting('emailFrequency', v)}
                    options={[
                      { value: 'never', label: 'Never' },
                      { value: 'daily', label: 'Daily Digest' },
                      { value: 'weekly', label: 'Weekly Summary' },
                      { value: 'monthly', label: 'Monthly Report' }
                    ]}
                  />
                  <SettingRow
                    label="Marketing Emails"
                    sub="Receive product updates"
                    left={<Mail size={16} color="#3b82f6" />}
                    right={<Toggle checked={settings.marketingEmails} onChange={() => toggleSetting('marketingEmails')} color={accentColor} />}
                  />
                  <SettingRow
                    label="Newsletter"
                    sub="Weekly tips and highlights"
                    left={<Bell size={16} color="#8b5cf6" />}
                    right={<Toggle checked={settings.newsletter} onChange={() => toggleSetting('newsletter')} color={accentColor} />}
                    noBorder
                  />
                </SectionCard>

                <SectionCard>
                  <SelectField
                    label="Session Timeout"
                    value={String(settings.sessionDuration)}
                    onChange={v => updateSetting('sessionDuration', Number(v))}
                    options={[
                      { value: '15', label: '15 minutes' },
                      { value: '30', label: '30 minutes' },
                      { value: '60', label: '1 hour' },
                      { value: '120', label: '2 hours' },
                      { value: '0', label: 'Never timeout' }
                    ]}
                  />
                </SectionCard>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                  <SectionCard style={{ cursor: 'pointer', margin: 0 }} onClick={() => openModal('export')}>
                    <div style={{ textAlign: 'center', padding: '8px 0' }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: '#dbeafe',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 10px'
                      }}>
                        <Download size={22} color="#2563eb" />
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Export My Data</div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>JSON or CSV format</div>
                    </div>
                  </SectionCard>
                  <SectionCard style={{ cursor: 'pointer', margin: 0 }} onClick={() => importInputRef.current?.click()}>
                    <div style={{ textAlign: 'center', padding: '8px 0' }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: '#dcfce7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 10px'
                      }}>
                        <Upload size={22} color="#16a34a" />
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Import Settings</div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>From JSON file</div>
                    </div>
                  </SectionCard>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <button
                    onClick={() => openModal('logout')}
                    style={{
                      padding: '20px 16px',
                      borderRadius: 14,
                      background: '#fff7ed',
                      border: '1.5px solid #fed7aa',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = '#ffedd5'}
                    onMouseOut={e => e.currentTarget.style.background = '#fff7ed'}
                  >
                    <LogOut size={24} color="#ea580c" />
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Log Out</span>
                    <span style={{ fontSize: 11, color: '#ea580c' }}>End your session</span>
                  </button>
                  <button
                    onClick={() => openModal('deleteAccount')}
                    style={{
                      padding: '20px 16px',
                      borderRadius: 14,
                      background: '#fef2f2',
                      border: '1.5px solid #fca5a5',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = '#fee2e2'}
                    onMouseOut={e => e.currentTarget.style.background = '#fef2f2'}
                  >
                    <Trash2 size={24} color="#dc2626" />
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Delete Account</span>
                    <span style={{ fontSize: 11, color: '#dc2626' }}>Permanent — cannot be undone</span>
                  </button>
                </div>
              </>
            )}

            {/* ── Billing Section ── */}
            {activeSection === 'billing' && isAuthenticated && (
              <>
                <SectionTitle icon={CreditCard} iconColor="#8b5cf6" title="Billing" sub="Manage your subscription and payments" />

                <SectionCard>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Current Plan</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>Your subscription details</div>
                    </div>
                    <span style={{
                      background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                      color: '#fff',
                      padding: '4px 12px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}>
                      {settings.subscription}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ background: '#f8fafc', borderRadius: 10, padding: 12 }}>
                      <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Billing Email</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{settings.billingEmail}</div>
                    </div>
                    <div style={{ background: '#f8fafc', borderRadius: 10, padding: 12 }}>
                      <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Payment Method</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', textTransform: 'capitalize' }}>
                        {settings.paymentMethod} **** 4242
                      </div>
                    </div>
                    <div style={{ background: '#f8fafc', borderRadius: 10, padding: 12 }}>
                      <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Last Payment</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                        {new Date(settings.lastPayment).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    <div style={{ background: '#f8fafc', borderRadius: 10, padding: 12 }}>
                      <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Next Billing</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                        {new Date(settings.nextBilling).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Usage</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>Resource consumption</div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                      <span style={{ color: '#6b7280' }}>Storage</span>
                      <span style={{ fontWeight: 600, color: '#111827' }}>{settings.storageUsed} GB / {settings.storageLimit} GB</span>
                    </div>
                    <div style={{ width: '100%', height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{
                        width: `${(settings.storageUsed / settings.storageLimit) * 100}%`,
                        height: '100%',
                        background: accentColor,
                        borderRadius: 4
                      }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                      <span style={{ color: '#6b7280' }}>API Calls</span>
                      <span style={{ fontWeight: 600, color: '#111827' }}>{settings.apiCalls} / {settings.apiLimit.toLocaleString()}</span>
                    </div>
                    <div style={{ width: '100%', height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{
                        width: `${(settings.apiCalls / settings.apiLimit) * 100}%`,
                        height: '100%',
                        background: accentColor,
                        borderRadius: 4
                      }} />
                    </div>
                  </div>
                </SectionCard>

                <SectionCard>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Billing History</div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <th style={{ textAlign: 'left', padding: '8px 4px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Date</th>
                          <th style={{ textAlign: 'left', padding: '8px 4px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Plan</th>
                          <th style={{ textAlign: 'left', padding: '8px 4px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Amount</th>
                          <th style={{ textAlign: 'left', padding: '8px 4px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Status</th>
                          <th style={{ textAlign: 'left', padding: '8px 4px', fontSize: 12, fontWeight: 600, color: '#6b7280' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {billingHistory.map(item => (
                          <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '10px 4px', fontSize: 13, color: '#111827' }}>
                              {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td style={{ padding: '10px 4px', fontSize: 13, color: '#111827' }}>{item.plan}</td>
                            <td style={{ padding: '10px 4px', fontSize: 13, fontWeight: 600, color: '#111827' }}>${item.amount}</td>
                            <td style={{ padding: '10px 4px' }}>
                              <span style={{
                                background: item.status === 'paid' ? '#dcfce7' : '#fee2e2',
                                color: item.status === 'paid' ? '#166534' : '#991b1b',
                                fontSize: 11,
                                fontWeight: 600,
                                padding: '2px 10px',
                                borderRadius: 20,
                                textTransform: 'capitalize'
                              }}>
                                {item.status}
                              </span>
                            </td>
                            <td style={{ padding: '10px 4px' }}>
                              <button style={{ fontSize: 12, color: accentColor, background: 'none', border: 'none', cursor: 'pointer' }}>
                                Download
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </SectionCard>

                <SectionCard>
                  <Button
                    onClick={handleCancelSubscription}
                    variant="danger"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Cancel Subscription
                  </Button>
                </SectionCard>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e2e8f0',
          background: '#fff',
          display: 'flex',
          gap: 10,
          flexShrink: 0
        }}>
          <Button onClick={handleCancel} variant="secondary" style={{ flex: 1 }}>
            Cancel
          </Button>
          <Button onClick={handleReset} variant="ghost" icon={RefreshCw} style={{ flex: 1 }}>
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            variant="primary"
            icon={isSaving ? null : Save}
            style={{ flex: 2 }}
          >
            {isSaving ? 'Saving...' : hasChanges ? 'Save Changes' : 'Saved'}
          </Button>
        </div>
      </div>

      {/* Hidden Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleAvatarUpload}
      />
      <input
        ref={importInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleImport}
      />

      {/* ── Modals ───────────────────────────────────────────────────────── */}

      {/* Login Modal */}
      <ModalWrapper open={modals.login} onClose={() => closeModal('login')} title="Sign In" subtitle="Welcome back!">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <InputField
            label="Email"
            type="email"
            value={loginForm.email}
            onChange={(v) => setLoginForm(p => ({ ...p, email: v }))}
            placeholder="you@example.com"
            error={formErrors.email}
            icon={Mail}
          />
          <InputField
            label="Password"
            type="password"
            value={loginForm.password}
            onChange={(v) => setLoginForm(p => ({ ...p, password: v }))}
            placeholder="••••••••"
            error={formErrors.password}
            icon={Lock}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={loginForm.remember}
                onChange={(e) => setLoginForm(p => ({ ...p, remember: e.target.checked }))}
                style={{ accentColor }}
              />
              Remember me
            </label>
            <button style={{ color: accentColor, fontSize: 12, background: 'none', border: 'none', cursor: 'pointer' }}>
              Forgot password?
            </button>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <Button onClick={() => { closeModal('login'); openModal('register'); }} variant="secondary" style={{ flex: 1 }}>
              Create Account
            </Button>
            <Button onClick={handleLogin} variant="primary" style={{ flex: 2 }}>
              Sign In
            </Button>
          </div>
        </div>
      </ModalWrapper>

      {/* Register Modal */}
      <ModalWrapper open={modals.register} onClose={() => closeModal('register')} title="Create Account" subtitle="Join thousands of developers">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <InputField
            label="Username"
            value={registerForm.username}
            onChange={(v) => setRegisterForm(p => ({ ...p, username: v }))}
            placeholder="coolcoder_42"
            error={formErrors.username}
            icon={User}
          />
          <InputField
            label="Email"
            type="email"
            value={registerForm.email}
            onChange={(v) => setRegisterForm(p => ({ ...p, email: v }))}
            placeholder="you@example.com"
            error={formErrors.email}
            icon={Mail}
          />
          <div>
            <InputField
              label="Password"
              type="password"
              value={registerForm.password}
              onChange={(v) => setRegisterForm(p => ({ ...p, password: v }))}
              placeholder="Min 6 characters"
              error={formErrors.password}
              icon={Lock}
            />
            <PasswordStrength password={registerForm.password} />
          </div>
          <InputField
            label="Confirm Password"
            type="password"
            value={registerForm.confirm}
            onChange={(v) => setRegisterForm(p => ({ ...p, confirm: v }))}
            placeholder="Repeat your password"
            error={formErrors.confirm}
            icon={ShieldCheck}
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <Button onClick={() => { closeModal('register'); openModal('login'); }} variant="secondary" style={{ flex: 1 }}>
              Sign In
            </Button>
            <Button onClick={handleRegister} variant="primary" style={{ flex: 2 }}>
              Create Account 🚀
            </Button>
          </div>
        </div>
      </ModalWrapper>

      {/* Edit Profile Modal */}
      <ModalWrapper open={modals.profile} onClose={() => closeModal('profile')} title="Edit Profile" subtitle="Update your information" width={540}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px', background: '#f8fafc', borderRadius: 12 }}>
            <div style={{ position: 'relative' }}>
              <UserAvatar user={avatarPreview ? { avatar: avatarPreview } : user} size={64} />
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  background: accentColor,
                  border: '2px solid #fff',
                  borderRadius: '50%',
                  width: 22,
                  height: 22,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Camera size={10} color="#fff" />
              </button>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Profile Photo</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>JPG, PNG, GIF • Max 5MB</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <InputField
              label="Full Name"
              value={profileForm.fullName}
              onChange={(v) => setProfileForm(p => ({ ...p, fullName: v }))}
              error={formErrors.fullName}
            />
            <InputField
              label="Username"
              value={profileForm.username}
              onChange={(v) => setProfileForm(p => ({ ...p, username: v }))}
              disabled
            />
          </div>
          <InputField
            label="Email"
            type="email"
            value={profileForm.email}
            onChange={(v) => setProfileForm(p => ({ ...p, email: v }))}
            error={formErrors.email}
            icon={Mail}
          />
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Bio</label>
            <textarea
              value={profileForm.bio}
              onChange={(e) => setProfileForm(p => ({ ...p, bio: e.target.value }))}
              rows={3}
              placeholder="Tell us about yourself..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1.5px solid #e2e8f0',
                fontSize: 13,
                color: '#111827',
                background: '#f8fafc',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <InputField
              label="Location"
              value={profileForm.location}
              onChange={(v) => setProfileForm(p => ({ ...p, location: v }))}
              placeholder="City, Country"
            />
            <InputField
              label="Website"
              value={profileForm.website}
              onChange={(v) => setProfileForm(p => ({ ...p, website: v }))}
              placeholder="https://example.com"
            />
          </div>
          <InputField
            label="Company"
            value={profileForm.company}
            onChange={(v) => setProfileForm(p => ({ ...p, company: v }))}
            placeholder="Your company"
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <Button onClick={() => closeModal('profile')} variant="secondary" style={{ flex: 1 }}>
              Cancel
            </Button>
            <Button onClick={handleProfileUpdate} variant="primary" icon={Save} style={{ flex: 2 }}>
              Save Profile
            </Button>
          </div>
        </div>
      </ModalWrapper>

      {/* Change Password Modal */}
      <ModalWrapper open={modals.password} onClose={() => closeModal('password')} title="Change Password" subtitle="Choose a strong password">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <InputField
            label="Current Password"
            type="password"
            value={passwordForm.current}
            onChange={(v) => setPasswordForm(p => ({ ...p, current: v }))}
            error={formErrors.current}
            icon={Lock}
          />
          <div>
            <InputField
              label="New Password"
              type="password"
              value={passwordForm.new}
              onChange={(v) => setPasswordForm(p => ({ ...p, new: v }))}
              error={formErrors.new}
              icon={ShieldCheck}
            />
            <PasswordStrength password={passwordForm.new} />
          </div>
          <InputField
            label="Confirm New Password"
            type="password"
            value={passwordForm.confirm}
            onChange={(v) => setPasswordForm(p => ({ ...p, confirm: v }))}
            error={formErrors.confirm}
            icon={Check}
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <Button onClick={() => closeModal('password')} variant="secondary" style={{ flex: 1 }}>
              Cancel
            </Button>
            <Button onClick={handlePasswordChange} variant="primary" icon={Lock} style={{ flex: 2 }}>
              Change Password
            </Button>
          </div>
        </div>
      </ModalWrapper>

      {/* Two-Factor Modal */}
      <ModalWrapper open={modals.twoFactor} onClose={() => closeModal('twoFactor')} title="Enable Two-Factor Auth" subtitle="Add an extra security layer">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12, padding: '14px 16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12 }}>
            <AlertTriangle size={16} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 13, color: '#92400e' }}>
              Use an authenticator app like Google Authenticator, Authy, or 1Password.
            </span>
          </div>
          <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'monospace', letterSpacing: 4, marginBottom: 8 }}>
              A1B2 C3D4 E5F6
            </div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Scan this code with your authenticator app</div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
              Enter 6-digit verification code
            </label>
            <input
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              placeholder="000000"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 12,
                border: `1.5px solid ${formErrors.code ? '#ef4444' : '#e2e8f0'}`,
                fontSize: 24,
                textAlign: 'center',
                fontFamily: 'monospace',
                letterSpacing: 12,
                background: '#f8fafc',
                outline: 'none'
              }}
            />
            {formErrors.code && <span style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{formErrors.code}</span>}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <Button onClick={() => closeModal('twoFactor')} variant="secondary" style={{ flex: 1 }}>
              Cancel
            </Button>
            <Button onClick={handleEnable2FA} variant="success" icon={ShieldCheck} style={{ flex: 2 }}>
              Enable 2FA
            </Button>
          </div>
        </div>
      </ModalWrapper>

      {/* Sessions Modal */}
      <ModalWrapper open={modals.sessions} onClose={() => closeModal('sessions')} title="Active Sessions" subtitle="Manage your devices" width={540}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          {sessions.map(session => (
            <div
              key={session.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: 12,
                background: session.current ? '#eff6ff' : '#f8fafc',
                border: `1.5px solid ${session.current ? '#bfdbfe' : '#e2e8f0'}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: session.current ? '#dbeafe' : '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {session.device.includes('iPhone') || session.device.includes('Android') ? (
                    <Smartphone size={18} color={session.current ? accentColor : '#94a3b8'} />
                  ) : (
                    <Monitor size={18} color={session.current ? accentColor : '#94a3b8'} />
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{session.device}</div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>{session.location} · {session.ip}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Last active: {session.lastActive}</div>
                </div>
              </div>
              {session.current ? (
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  background: '#dbeafe',
                  color: '#1e40af',
                  padding: '3px 10px',
                  borderRadius: 20
                }}>
                  This device
                </span>
              ) : (
                <Button onClick={() => revokeSession(session.id)} variant="danger" size="sm">
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
        {sessions.filter(s => !s.current).length > 0 && (
          <Button onClick={revokeAllOtherSessions} variant="danger" icon={LogOut} style={{ width: '100%', justifyContent: 'center' }}>
            Revoke All Other Sessions
          </Button>
        )}
      </ModalWrapper>

      {/* Export Modal */}
      <ModalWrapper open={modals.export} onClose={() => closeModal('export')} title="Export Data" subtitle="Download your settings" width={400}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <button
            onClick={() => handleExport('json')}
            style={{
              padding: '22px 16px',
              borderRadius: 14,
              background: '#dbeafe',
              border: '1.5px solid #2563eb22',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'none'}
          >
            <FileText size={30} color="#2563eb" />
            <div style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>JSON</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Recommended</div>
          </button>
          <button
            onClick={() => handleExport('csv')}
            style={{
              padding: '22px 16px',
              borderRadius: 14,
              background: '#dcfce7',
              border: '1.5px solid #16a34a22',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'none'}
          >
            <FileBarChart size={30} color="#16a34a" />
            <div style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>CSV</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Spreadsheet</div>
          </button>
        </div>
      </ModalWrapper>

      {/* Import Modal */}
      <ModalWrapper open={modals.import} onClose={() => closeModal('import')} title="Import Settings" subtitle="Paste JSON data" width={440}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <textarea
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            placeholder="Paste JSON array of settings here..."
            rows={8}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 10,
              border: `1.5px solid ${formErrors.import ? '#ef4444' : '#e2e8f0'}`,
              fontSize: 12,
              fontFamily: 'monospace',
              background: '#f8fafc',
              resize: 'vertical',
              outline: 'none'
            }}
          />
          {formErrors.import && <span style={{ fontSize: 11, color: '#ef4444' }}>{formErrors.import}</span>}
          <div style={{ display: 'flex', gap: 10 }}>
            <Button onClick={() => closeModal('import')} variant="secondary" style={{ flex: 1 }}>
              Cancel
            </Button>
            <Button onClick={handleImportText} variant="primary" icon={Save} style={{ flex: 2 }}>
              Import
            </Button>
          </div>
        </div>
      </ModalWrapper>

      {/* Logout Modal */}
      <ModalWrapper open={modals.logout} onClose={() => closeModal('logout')} title="Log Out" width={420}>
        <div style={{ display: 'flex', gap: 12, padding: '14px 16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, marginBottom: 20 }}>
          <AlertTriangle size={16} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 13, color: '#92400e' }}>You'll be signed out. Any unsaved changes will be lost.</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button onClick={() => closeModal('logout')} variant="secondary" style={{ flex: 1 }}>
            Stay Signed In
          </Button>
          <Button onClick={handleLogout} variant="danger" icon={LogOut} style={{ flex: 1 }}>
            Log Out
          </Button>
        </div>
      </ModalWrapper>

      {/* Delete Account Modal */}
      <ModalWrapper 
        open={modals.deleteAccount} 
        onClose={() => {
          closeModal('deleteAccount'); 
          setDeleteConfirm('');
        }} 
        title="Delete Account" 
        width={440}
      >
        <div style={{ display: 'flex', gap: 12, padding: '14px 16px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 12, marginBottom: 20 }}>
          <AlertTriangle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 13, color: '#991b1b', fontWeight: 600 }}>
            This is permanent and cannot be undone. All your data will be deleted forever.
          </span>
        </div>
        <InputField
          label='Type "DELETE" in capitals to confirm'
          value={deleteConfirm}
          onChange={setDeleteConfirm}
          placeholder="DELETE"
          error={formErrors.delete}
        />
        <div style={{ height: 4, borderRadius: 4, background: '#f1f5f9', marginTop: 10, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            borderRadius: 4,
            background: deleteConfirm === 'DELETE' ? '#ef4444' : '#fca5a5',
            width: `${Math.min(100, (deleteConfirm.length / 6) * 100)}%`,
            transition: 'width 0.2s'
          }} />
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <Button 
            onClick={() => {
              closeModal('deleteAccount'); 
              setDeleteConfirm('');
            }} 
            variant="secondary" 
            style={{ flex: 1 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteAccount} 
            variant="danger" 
            icon={Trash2} 
            style={{ flex: 1 }} 
            disabled={deleteConfirm !== 'DELETE'}
          >
            Delete Account
          </Button>
        </div>
      </ModalWrapper>

      {/* Toast Container */}
      <Toast toasts={toasts} removeToast={removeToast} />
    </>
  );
};

export default Settings;