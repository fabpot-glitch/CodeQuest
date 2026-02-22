// src/pages/MyContests.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, Users, Trophy, Award, Star,
  Search, CheckCircle, AlertCircle, ChevronRight,
  CalendarDays, Target, BarChart, Bookmark, Bell,
  Plus, Eye, X, DollarSign, Lock, Globe,
  BellRing, BellOff, Download, Medal, BarChart2, Zap
} from 'lucide-react';

// ─── SHARED MODAL SHELL ───────────────────────────────────────────────────────
const Modal = ({ onClose, children, wide }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? 'max-w-3xl' : 'max-w-2xl'} max-h-[90vh] overflow-hidden flex flex-col`}>
      {children}
    </div>
  </div>
);

const ModalHeader = ({ title, subtitle, gradient, icon: Icon, onClose }) => (
  <div className={`bg-gradient-to-r ${gradient} px-6 py-5 flex items-center justify-between flex-shrink-0`}>
    <div className="flex items-center gap-3">
      {Icon && (
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
      )}
      <div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {subtitle && <p className="text-white/75 text-sm mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg text-white transition-colors">
      <X className="w-5 h-5" />
    </button>
  </div>
);

// ─── 1. REMINDERS MODAL ───────────────────────────────────────────────────────
const REMINDER_OPTIONS = [
  { value: '1440', label: '1 day before' },
  { value: '180',  label: '3 hours before' },
  { value: '60',   label: '1 hour before' },
  { value: '30',   label: '30 minutes before' },
  { value: '10',   label: '10 minutes before' },
];

const RemindersModal = ({ onClose, contests }) => {
  const upcomingRegistered = contests.filter(c => c.status === 'upcoming' && c.isRegistered);

  const [reminders, setReminders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('contestReminders') || '{}'); }
    catch { return {}; }
  });
  const [saved, setSaved] = useState(false);
  const [notifPerm, setNotifPerm] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const requestPermission = async () => {
    if (typeof Notification === 'undefined') return;
    const p = await Notification.requestPermission();
    setNotifPerm(p);
  };

  const toggle = (contestId, minutes) => {
    const key = `${contestId}_${minutes}`;
    setReminders(prev => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = { contestId, minutes, setAt: Date.now() };
      return next;
    });
    setSaved(false);
  };

  const isSet = (contestId, minutes) => !!reminders[`${contestId}_${minutes}`];
  const activeCount = Object.keys(reminders).length;

  const saveAll = () => {
    localStorage.setItem('contestReminders', JSON.stringify(reminders));
    if (notifPerm === 'granted') {
      new Notification('🔔 Reminders Saved', {
        body: `${activeCount} reminder${activeCount !== 1 ? 's' : ''} are now active.`
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Contest Reminders" subtitle="Choose when to be notified before each contest"
        gradient="from-purple-600 to-violet-600" icon={Bell} onClose={onClose} />

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {/* Notification permission */}
        {notifPerm !== 'granted' ? (
          <div className={`flex items-start gap-3 p-4 rounded-xl border ${notifPerm === 'denied' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
            <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${notifPerm === 'denied' ? 'text-red-500' : 'text-amber-500'}`} />
            <div className="flex-1">
              <p className={`text-sm font-semibold ${notifPerm === 'denied' ? 'text-red-700' : 'text-amber-700'}`}>
                {notifPerm === 'denied' ? 'Notifications blocked in browser' : 'Enable browser notifications for alerts'}
              </p>
              <p className={`text-xs mt-0.5 ${notifPerm === 'denied' ? 'text-red-600' : 'text-amber-600'}`}>
                {notifPerm === 'denied' ? 'Open browser settings to allow notifications from this site.' : 'You\'ll receive a pop-up alert before each contest starts.'}
              </p>
            </div>
            {notifPerm !== 'denied' && (
              <button onClick={requestPermission} className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs rounded-lg font-semibold transition-colors whitespace-nowrap">
                Enable Now
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <p className="text-sm text-green-700 font-medium">Browser notifications are enabled ✓</p>
          </div>
        )}

        {/* Contest reminder rows */}
        {upcomingRegistered.length === 0 ? (
          <div className="text-center py-12">
            <BellOff className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No upcoming registered contests</p>
            <p className="text-gray-400 text-sm mt-1">Register for a contest first to set reminders</p>
          </div>
        ) : (
          upcomingRegistered.map(contest => (
            <div key={contest.id} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{contest.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    <Calendar className="w-3 h-3 inline mr-1" />{contest.date} · {contest.startTime}
                  </p>
                </div>
                <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  {Object.keys(reminders).filter(k => k.startsWith(contest.id)).length} active
                </span>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {REMINDER_OPTIONS.map(({ value, label }) => {
                  const active = isSet(contest.id, value);
                  return (
                    <button key={value} onClick={() => toggle(contest.id, value)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                        active ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:border-purple-300'
                      }`}>
                      <span>{label}</span>
                      {active ? <BellRing className="w-4 h-4 text-purple-600" /> : <Bell className="w-4 h-4 text-gray-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between flex-shrink-0">
        <p className="text-sm text-gray-500">
          {activeCount > 0 ? `${activeCount} reminder${activeCount !== 1 ? 's' : ''} configured` : 'No reminders set yet'}
        </p>
        <button onClick={saveAll} disabled={activeCount === 0}
          className={`px-5 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
            saved ? 'bg-green-600 text-white' :
            activeCount === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' :
            'bg-purple-600 hover:bg-purple-700 text-white'
          }`}>
          {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Bell className="w-4 h-4" /> Save Reminders</>}
        </button>
      </div>
    </Modal>
  );
};

// ─── 2. RESULTS MODAL ─────────────────────────────────────────────────────────
const ResultsModal = ({ onClose, contests }) => {
  const completed = contests.filter(c => c.status === 'completed' && c.isRegistered && c.userRank);
  const [sortBy, setSortBy] = useState('date');

  const totalScore  = completed.reduce((s, c) => s + (c.userScore || 0), 0);
  const bestRank    = completed.length ? Math.min(...completed.map(c => c.userRank)) : '—';
  const avgScore    = completed.length ? Math.round(totalScore / completed.length) : 0;
  const totalSolved = completed.reduce((s, c) => s + (c.problemsSolved || 0), 0);

  const sorted = [...completed].sort((a, b) => {
    if (sortBy === 'date')  return new Date(b.date) - new Date(a.date);
    if (sortBy === 'rank')  return (a.userRank  || 999) - (b.userRank  || 999);
    if (sortBy === 'score') return (b.userScore || 0)   - (a.userScore || 0);
    return 0;
  });

  const rankColor = (rank) => {
    if (rank <= 10)  return 'text-yellow-700 bg-yellow-50 border-yellow-300';
    if (rank <= 50)  return 'text-blue-700   bg-blue-50   border-blue-300';
    if (rank <= 100) return 'text-green-700  bg-green-50  border-green-300';
    return 'text-gray-700 bg-gray-50 border-gray-300';
  };

  const pct = (score, max) => Math.round((score / (max || 1000)) * 100);

  return (
    <Modal onClose={onClose} wide>
      <ModalHeader title="All Results" subtitle="Your complete contest performance history"
        gradient="from-green-600 to-emerald-600" icon={BarChart2} onClose={onClose} />

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {/* Aggregate cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Trophy,       label: 'Completed',      value: completed.length, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
            { icon: Medal,        label: 'Best Rank',       value: `#${bestRank}`,  color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200'   },
            { icon: Zap,          label: 'Avg Score',       value: avgScore,         color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
            { icon: CheckCircle,  label: 'Total Solved',    value: totalSolved,      color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200'  },
          ].map(({ icon: Icon, label, value, color, bg, border }) => (
            <div key={label} className={`${bg} border ${border} rounded-xl p-4 text-center`}>
              <Icon className={`w-6 h-6 ${color} mx-auto mb-1.5`} />
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Score history bar chart */}
        {completed.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Score History</p>
            <div className="space-y-2">
              {[...completed].sort((a, b) => new Date(a.date) - new Date(b.date)).map(c => (
                <div key={c.id} className="flex items-center gap-3">
                  <p className="text-xs text-gray-500 w-28 truncate flex-shrink-0">{c.title.split(' ').slice(0, 2).join(' ')}</p>
                  <div className="flex-1 bg-gray-200 rounded-full h-5 overflow-hidden">
                    <div className="h-5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-end pr-2"
                      style={{ width: `${pct(c.userScore, c.maxScore)}%` }}>
                      <span className="text-white text-xs font-bold">{c.userScore}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 w-9 text-right">{pct(c.userScore, c.maxScore)}%</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sort */}
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500 font-medium">Sort by:</p>
          {['date', 'rank', 'score'].map(k => (
            <button key={k} onClick={() => setSortBy(k)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${sortBy === k ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {k}
            </button>
          ))}
        </div>

        {/* Individual results */}
        {completed.length === 0 ? (
          <div className="text-center py-10">
            <BarChart2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No results yet</p>
            <p className="text-gray-400 text-sm mt-1">Complete contests to see your results here</p>
          </div>
        ) : sorted.map(c => (
          <div key={c.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-gray-900 text-sm">{c.title}</span>
                    {c.userRank === 1 ? '🥇' : c.userRank === 2 ? '🥈' : c.userRank === 3 ? '🥉' : c.userRank <= 10 ? '🏆' : null}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                    <span><Calendar className="w-3 h-3 inline mr-1" />{c.date}</span>
                    <span>{c.category}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${c.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : c.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{c.difficulty}</span>
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-lg border text-center flex-shrink-0 ${rankColor(c.userRank)}`}>
                  <p className="text-lg font-bold">#{c.userRank}</p>
                  <p className="text-xs">Rank</p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-3">
                {[
                  { label: 'Score',    value: `${c.userScore}/${c.maxScore}`,          color: 'text-blue-700' },
                  { label: 'Solved',   value: `${c.problemsSolved}/${c.totalProblems}`, color: 'text-green-700' },
                  { label: 'Accuracy', value: `${pct(c.userScore, c.maxScore)}%`,        color: 'text-purple-700' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className={`text-base font-bold ${color}`}>{value}</p>
                    <p className="text-xs text-gray-500">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
                <div className={`h-2 rounded-full ${pct(c.userScore, c.maxScore) >= 80 ? 'bg-green-500' : pct(c.userScore, c.maxScore) >= 60 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                  style={{ width: `${pct(c.userScore, c.maxScore)}%` }} />
              </div>
            </div>
            <div className="px-4 py-2 bg-gray-50 border-t flex justify-end">
              <Link to={`/dashboard/contests/${c.id}/results`} className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                Full details <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center flex-shrink-0">
        <p className="text-sm text-gray-500">{completed.length} contest{completed.length !== 1 ? 's' : ''} completed</p>
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors">Close</button>
      </div>
    </Modal>
  );
};

// ─── 3. CERTIFICATES MODAL ────────────────────────────────────────────────────
const CertificatesModal = ({ onClose, contests }) => {
  const eligible = contests.filter(c => c.status === 'completed' && c.isRegistered && c.userRank);
  const [downloading, setDownloading] = useState(null);
  const [downloaded, setDownloaded]   = useState({});

  const certType = (rank) => {
    if (rank <= 3)  return { label: 'Winner Certificate',        color: '#D97706', accent: '#FCD34D', emoji: '🏆', bg: 'from-yellow-400 to-amber-500'  };
    if (rank <= 10) return { label: 'Excellence Certificate',    color: '#7C3AED', accent: '#C4B5FD', emoji: '⭐', bg: 'from-violet-500 to-purple-600'  };
    if (rank <= 50) return { label: 'Merit Certificate',         color: '#059669', accent: '#6EE7B7', emoji: '🎖️', bg: 'from-emerald-400 to-green-500'  };
    return             { label: 'Participation Certificate',  color: '#2563EB', accent: '#93C5FD', emoji: '📜', bg: 'from-blue-400 to-indigo-500'     };
  };

  const downloadCertificate = (contest) => {
    setDownloading(contest.id);
    const cert = certType(contest.userRank);
    const canvas = document.createElement('canvas');
    canvas.width  = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext('2d');

    // BG
    const bg = ctx.createLinearGradient(0, 0, 1200, 850);
    bg.addColorStop(0, '#F8FAFF'); bg.addColorStop(1, '#EEF2FF');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, 1200, 850);

    // Outer border
    ctx.strokeStyle = cert.color; ctx.lineWidth = 10;
    ctx.strokeRect(18, 18, 1164, 814);
    ctx.strokeStyle = cert.accent; ctx.lineWidth = 2.5;
    ctx.strokeRect(30, 30, 1140, 790);

    // Corner circles
    [[55,55],[1145,55],[55,795],[1145,795]].forEach(([x,y]) => {
      ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI*2);
      ctx.fillStyle = cert.color; ctx.fill();
    });

    // Header banner
    const hdr = ctx.createLinearGradient(0, 0, 1200, 0);
    hdr.addColorStop(0, cert.color); hdr.addColorStop(1, cert.accent);
    ctx.fillStyle = hdr; ctx.fillRect(48, 48, 1104, 88);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 30px Georgia,serif';
    ctx.textAlign = 'center'; ctx.fillText('CodeArena Platform', 600, 104);

    // Emoji
    ctx.font = '70px serif'; ctx.fillText(cert.emoji, 600, 215);

    // Title
    ctx.fillStyle = cert.color; ctx.font = 'bold 46px Georgia,serif';
    ctx.fillText(cert.label, 600, 285);

    // Divider
    ctx.strokeStyle = cert.color; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(220, 305); ctx.lineTo(980, 305); ctx.stroke();

    // Body text
    ctx.fillStyle = '#6B7280'; ctx.font = 'italic 24px Georgia,serif';
    ctx.fillText('This is to certify that', 600, 360);

    ctx.fillStyle = '#111827'; ctx.font = 'bold 52px Georgia,serif';
    ctx.fillText('Contest Participant', 600, 435);

    ctx.strokeStyle = cert.color; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(200, 455); ctx.lineTo(1000, 455); ctx.stroke();

    ctx.fillStyle = '#374151'; ctx.font = '26px Georgia,serif';
    ctx.fillText('has successfully participated in', 600, 515);

    ctx.fillStyle = '#111827'; ctx.font = 'bold 34px Georgia,serif';
    ctx.fillText(contest.title, 600, 567);

    ctx.fillStyle = '#6B7280'; ctx.font = '22px Georgia,serif';
    ctx.fillText(`achieving Rank #${contest.userRank} · Score: ${contest.userScore}/${contest.maxScore} · Solved: ${contest.problemsSolved}/${contest.totalProblems}`, 600, 620);

    ctx.fillStyle = '#9CA3AF'; ctx.font = '20px Georgia,serif';
    ctx.fillText(`Date: ${contest.date}  ·  Category: ${contest.category}`, 600, 668);

    // Bottom divider & signatures
    ctx.strokeStyle = '#E5E7EB'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(100, 710); ctx.lineTo(1100, 710); ctx.stroke();

    [[280,'Head Judge'],[920,'Platform Director']].forEach(([x, role]) => {
      ctx.strokeStyle = '#9CA3AF'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(x-110, 768); ctx.lineTo(x+110, 768); ctx.stroke();
      ctx.fillStyle = '#9CA3AF'; ctx.font = '17px Georgia,serif';
      ctx.fillText(role, x, 790);
    });

    // Cert ID
    ctx.fillStyle = '#D1D5DB'; ctx.font = '14px monospace';
    ctx.fillText(`Certificate ID: CA-${contest.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`, 600, 825);

    setTimeout(() => {
      const link = document.createElement('a');
      link.download = `CodeArena-Certificate-${contest.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setDownloading(null);
      setDownloaded(d => ({ ...d, [contest.id]: true }));
    }, 900);
  };

  return (
    <Modal onClose={onClose} wide>
      <ModalHeader title="Download Certificates" subtitle="Official certificates for your contest achievements"
        gradient="from-orange-500 to-amber-500" icon={Award} onClose={onClose} />

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {eligible.length === 0 ? (
          <div className="text-center py-12">
            <Award className="w-14 h-14 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No certificates available yet</p>
            <p className="text-gray-400 text-sm mt-1">Participate in contests to earn certificates</p>
          </div>
        ) : (
          <>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
              🎓 You have <strong>{eligible.length}</strong> certificate{eligible.length !== 1 ? 's' : ''} ready to download as PNG images.
            </div>

            {eligible.map(contest => {
              const cert = certType(contest.userRank);
              const busy = downloading === contest.id;
              const done = downloaded[contest.id];

              return (
                <div key={contest.id} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-orange-300 transition-colors">
                  {/* Preview banner */}
                  <div className={`bg-gradient-to-r ${cert.bg} h-20 flex items-center justify-center gap-3`}>
                    <span className="text-3xl">{cert.emoji}</span>
                    <p className="text-white font-bold text-base drop-shadow">{cert.label}</p>
                  </div>

                  {/* Details + download */}
                  <div className="p-4 bg-white flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">{contest.title}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-gray-500"><Calendar className="w-3 h-3 inline mr-1" />{contest.date}</span>
                        <span className="text-xs text-gray-500">{contest.category}</span>
                      </div>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span className="px-2 py-0.5 text-xs font-bold rounded-full" style={{ background: cert.color + '18', color: cert.color }}>
                          Rank #{contest.userRank}
                        </span>
                        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                          {contest.userScore}/{contest.maxScore} pts
                        </span>
                        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                          {contest.problemsSolved}/{contest.totalProblems} solved
                        </span>
                      </div>
                    </div>

                    <button onClick={() => downloadCertificate(contest)} disabled={busy}
                      style={!done && !busy ? { background: `linear-gradient(135deg, ${cert.color}, ${cert.accent})` } : {}}
                      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        done  ? 'bg-green-100 text-green-700 border border-green-300' :
                        busy  ? 'bg-gray-100 text-gray-400 cursor-wait' :
                        'text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95'
                      }`}>
                      {busy ? (
                        <><div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /> Generating…</>
                      ) : done ? (
                        <><CheckCircle className="w-4 h-4" /> Downloaded!</>
                      ) : (
                        <><Download className="w-4 h-4" /> Download PNG</>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center flex-shrink-0">
        <p className="text-sm text-gray-500">{Object.keys(downloaded).length} of {eligible.length} downloaded</p>
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors">Close</button>
      </div>
    </Modal>
  );
};

// ─── CREATE CONTEST MODAL ─────────────────────────────────────────────────────
const CreateContestModal = ({ onClose, onCreate }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '', description: '', category: '', difficulty: 'Medium',
    type: 'public', date: '', startTime: '', duration: '',
    maxParticipants: '', prizePool: '', isFree: true,
    registrationFee: '', registrationDeadline: '', tags: '', rules: '', isFeatured: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const categories = ['Algorithm', 'AI/ML', 'Web Development', 'Data Science', 'Security', 'Mobile', 'Game Development'];
  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!form.title.trim())       e.title       = 'Required';
      if (!form.description.trim()) e.description = 'Required';
      if (!form.category)           e.category    = 'Required';
    }
    if (step === 2) {
      if (!form.date)                              e.date             = 'Required';
      if (!form.startTime)                         e.startTime        = 'Required';
      if (!form.duration.trim())                   e.duration         = 'Required';
      if (!form.maxParticipants||isNaN(form.maxParticipants)) e.maxParticipants = 'Must be a number';
      if (!form.registrationDeadline)              e.registrationDeadline = 'Required';
    }
    if (step === 3) {
      if (!form.prizePool.trim()) e.prizePool = 'Required';
      if (!form.isFree && !form.registrationFee) e.registrationFee = 'Required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep(s => s + 1); };
  const prev = () => setStep(s => s - 1);

  const handleSubmit = () => {
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false); setSuccess(true);
      setTimeout(() => {
        onCreate && onCreate({ ...form, id: `contest-${Date.now()}`, participants: 0, status: 'upcoming', isRegistered: true, isBookmarked: false, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) });
        onClose();
      }, 1500);
    }, 1200);
  };

  const stepLabels = ['Basic Info', 'Schedule', 'Prize & Rules', 'Review'];
  const err = (k) => errors[k] ? <p className="text-red-500 text-xs mt-1">{errors[k]}</p> : null;
  const inp = (extra = '') => `w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${extra}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Create New Contest</h2>
            <p className="text-white/75 text-sm mt-0.5">Step {step} of 4 — {stepLabels[step-1]}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg text-white"><X className="w-5 h-5" /></button>
        </div>

        {/* Step dots */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2">
            {stepLabels.map((label, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i+1<step?'bg-green-500 text-white':i+1===step?'bg-blue-600 text-white':'bg-gray-200 text-gray-500'}`}>
                    {i+1<step?'✓':i+1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${i+1===step?'text-blue-600':'text-gray-400'}`}>{label}</span>
                </div>
                {i<3 && <div className={`flex-1 h-0.5 ${i+1<step?'bg-green-400':'bg-gray-200'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {success ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-600" /></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Contest Created! 🎉</h3>
              <p className="text-gray-600">Your contest is now live on the listings page.</p>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Contest Title *</label>
                    <input type="text" placeholder="e.g. Spring Algorithm Challenge 2026" value={form.title} onChange={e=>set('title',e.target.value)} className={inp(errors.title?'border-red-400':'border-gray-300')} />
                    {err('title')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                    <textarea rows={3} placeholder="Describe what makes this contest special..." value={form.description} onChange={e=>set('description',e.target.value)} className={`${inp(errors.description?'border-red-400':'border-gray-300')} resize-none`} />
                    {err('description')}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                      <select value={form.category} onChange={e=>set('category',e.target.value)} className={inp(errors.category?'border-red-400':'border-gray-300')}>
                        <option value="">Select…</option>
                        {categories.map(c=><option key={c} value={c}>{c}</option>)}
                      </select>
                      {err('category')}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Difficulty</label>
                      <div className="flex gap-2">
                        {['Easy','Medium','Hard'].map(d=>(
                          <button key={d} type="button" onClick={()=>set('difficulty',d)}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${form.difficulty===d?d==='Easy'?'bg-green-500 text-white border-green-500':d==='Medium'?'bg-yellow-500 text-white border-yellow-500':'bg-red-500 text-white border-red-500':'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Contest Type</label>
                    <div className="flex gap-3">
                      {[{v:'public',l:'Public',I:Globe,d:'Anyone can join'},{v:'private',l:'Private',I:Lock,d:'Invite only'}].map(({v,l,I,d})=>(
                        <button key={v} type="button" onClick={()=>set('type',v)}
                          className={`flex-1 flex items-center gap-3 p-3 border-2 rounded-xl transition-colors ${form.type===v?'border-blue-500 bg-blue-50':'border-gray-200 hover:border-gray-300'}`}>
                          <I className={`w-5 h-5 ${form.type===v?'text-blue-600':'text-gray-400'}`} />
                          <div className="text-left">
                            <p className={`text-sm font-medium ${form.type===v?'text-blue-700':'text-gray-700'}`}>{l}</p>
                            <p className="text-xs text-gray-500">{d}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags <span className="text-gray-400">(comma separated)</span></label>
                    <input type="text" placeholder="e.g. Python, Arrays, DP" value={form.tags} onChange={e=>set('tags',e.target.value)} className={inp('border-gray-300')} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Contest Date *</label>
                      <input type="date" value={form.date} onChange={e=>set('date',e.target.value)} className={inp(errors.date?'border-red-400':'border-gray-300')} />
                      {err('date')}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Time *</label>
                      <input type="time" value={form.startTime} onChange={e=>set('startTime',e.target.value)} className={inp(errors.startTime?'border-red-400':'border-gray-300')} />
                      {err('startTime')}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration *</label>
                      <input type="text" placeholder="e.g. 6 hours" value={form.duration} onChange={e=>set('duration',e.target.value)} className={inp(errors.duration?'border-red-400':'border-gray-300')} />
                      {err('duration')}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Participants *</label>
                      <input type="number" placeholder="e.g. 1000" value={form.maxParticipants} onChange={e=>set('maxParticipants',e.target.value)} className={inp(errors.maxParticipants?'border-red-400':'border-gray-300')} />
                      {err('maxParticipants')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Registration Deadline *</label>
                    <input type="date" value={form.registrationDeadline} onChange={e=>set('registrationDeadline',e.target.value)} className={inp(errors.registrationDeadline?'border-red-400':'border-gray-300')} />
                    {err('registrationDeadline')}
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-700">Deadline must be before the contest date.</p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Prize Pool *</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input type="text" placeholder="e.g. $10,000" value={form.prizePool} onChange={e=>set('prizePool',e.target.value)} className={`pl-9 ${inp(errors.prizePool?'border-red-400':'border-gray-300')}`} />
                    </div>
                    {err('prizePool')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Entry Fee</label>
                    <div className="flex gap-3 mb-3">
                      <button type="button" onClick={()=>set('isFree',true)} className={`flex-1 py-2.5 border-2 rounded-xl text-sm font-medium transition-colors ${form.isFree?'border-green-500 bg-green-50 text-green-700':'border-gray-200 text-gray-600'}`}>✓ Free Entry</button>
                      <button type="button" onClick={()=>set('isFree',false)} className={`flex-1 py-2.5 border-2 rounded-xl text-sm font-medium transition-colors ${!form.isFree?'border-blue-500 bg-blue-50 text-blue-700':'border-gray-200 text-gray-600'}`}>$ Paid Entry</button>
                    </div>
                    {!form.isFree && (
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input type="number" placeholder="Fee in USD" value={form.registrationFee} onChange={e=>set('registrationFee',e.target.value)} className={`pl-9 ${inp(errors.registrationFee?'border-red-400':'border-gray-300')}`} />
                        {err('registrationFee')}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Rules & Guidelines</label>
                    <textarea rows={4} placeholder="Judging criteria, allowed languages, submission format…" value={form.rules} onChange={e=>set('rules',e.target.value)} className={`${inp('border-gray-300')} resize-none`} />
                  </div>
                  <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl">
                    <input type="checkbox" id="featured" checked={form.isFeatured} onChange={e=>set('isFeatured',e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                    <label htmlFor="featured" className="flex-1">
                      <span className="text-sm font-medium text-gray-800">Feature this contest</span>
                      <p className="text-xs text-gray-500 mt-0.5">Featured contests appear at the top of listings</p>
                    </label>
                    <Star className="w-5 h-5 text-yellow-400" />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {form.isFeatured && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">⭐ Featured</span>}
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${form.difficulty==='Easy'?'bg-green-100 text-green-700':form.difficulty==='Medium'?'bg-yellow-100 text-yellow-700':'bg-red-100 text-red-700'}`}>{form.difficulty}</span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">{form.category}</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">{form.type==='public'?'🌐 Public':'🔒 Private'}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{form.title||'Untitled Contest'}</h3>
                    <p className="text-gray-600 text-sm">{form.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {I:Calendar,  l:'Date',             v:form.date},
                      {I:Clock,     l:'Start Time',        v:form.startTime},
                      {I:Clock,     l:'Duration',           v:form.duration},
                      {I:Users,     l:'Max Participants',  v:form.maxParticipants},
                      {I:Trophy,    l:'Prize Pool',         v:form.prizePool},
                      {I:DollarSign,l:'Entry Fee',          v:form.isFree?'Free':`$${form.registrationFee}`},
                    ].map(({I,l,v})=>(
                      <div key={l} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                        <I className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <div><p className="text-xs text-gray-500">{l}</p><p className="text-sm font-medium text-gray-800">{v||'—'}</p></div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-sm text-green-700 font-medium">✓ Ready to publish</p>
                    <p className="text-xs text-green-600 mt-0.5">Your contest will be immediately visible on the contests listing page.</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {!success && (
          <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
            <button onClick={step===1?onClose:prev} className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors">
              {step===1?'Cancel':'← Back'}
            </button>
            {step<4
              ? <button onClick={next} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">Continue →</button>
              : <button onClick={handleSubmit} disabled={submitting} className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                  {submitting?<><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Creating…</>:'🚀 Create Contest'}
                </button>
            }
          </div>
        )}
      </div>
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const MyContests = () => {
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal,    setShowCreateModal]    = useState(false);
  const [showRemindersModal, setShowRemindersModal] = useState(false);
  const [showResultsModal,   setShowResultsModal]   = useState(false);
  const [showCertsModal,     setShowCertsModal]     = useState(false);
  const [stats, setStats] = useState({ totalContests:0, participated:0, upcoming:0, completed:0, bestRank:0, totalPoints:0 });

  const mockContests = [
    { id:'code-challenge-2024',    title:'Code Challenge 2024',       description:'Annual coding competition featuring algorithmic problems',        date:'2026-06-15', startTime:'10:00 AM', duration:'8 hours',  participants:1250, maxParticipants:2000, difficulty:'Medium', status:'upcoming',   type:'public',  isRegistered:true,  isBookmarked:true,  category:'Algorithm',              prizePool:'$10,000', tags:['Algorithm','Data Structures','C++','Python'] },
    { id:'ai-ml-hackathon',        title:'AI/ML Hackathon 2026',      description:'Build innovative AI/ML solutions for real-world problems',        date:'2026-07-20', startTime:'9:00 AM',  duration:'48 hours', participants:850,  maxParticipants:1000, difficulty:'Hard',   status:'upcoming',   type:'public',  isRegistered:false, isBookmarked:true,  category:'AI/ML',                  prizePool:'$15,000', tags:['AI','Machine Learning','Python','TensorFlow'] },
    { id:'winter-code-sprint',     title:'Winter Code Sprint',        description:'Fast-paced coding competition with time-limited challenges',      date:'2026-02-10', startTime:'11:00 AM', duration:'4 hours',  participants:950,  maxParticipants:1500, difficulty:'Medium', status:'completed',  type:'public',  isRegistered:true,  isBookmarked:false, category:'Competitive Programming', prizePool:'$5,000',  tags:['C++','Java','Python'],                        userRank:23,  userScore:850, maxScore:1000, problemsSolved:5, totalProblems:6 },
    { id:'algorithm-masters',      title:'Algorithm Masters 2025',    description:'Advanced algorithm competition for expert programmers',            date:'2025-12-05', startTime:'2:00 PM',  duration:'6 hours',  participants:2000, maxParticipants:2500, difficulty:'Hard',   status:'completed',  type:'public',  isRegistered:true,  isBookmarked:true,  category:'Algorithm',              prizePool:'$20,000', tags:['Advanced Algorithms','C++','Java'],            userRank:156, userScore:600, maxScore:1000, problemsSolved:3, totalProblems:6 },
    { id:'frontend-frenzy',        title:'Frontend Frenzy',           description:'Build beautiful and responsive web interfaces',                   date:'2026-08-25', startTime:'3:00 PM',  duration:'6 hours',  participants:650,  maxParticipants:1000, difficulty:'Easy',   status:'upcoming',   type:'public',  isRegistered:false, isBookmarked:false, category:'Web Development',        prizePool:'$8,000',  tags:['React','JavaScript','CSS','HTML'] },
    { id:'data-science-challenge', title:'Data Science Challenge',    description:'Analyze datasets and build predictive models',                    date:'2026-03-28', startTime:'1:00 PM',  duration:'72 hours', participants:750,  maxParticipants:1000, difficulty:'Medium', status:'completed',  type:'public',  isRegistered:true,  isBookmarked:true,  category:'Data Science',           prizePool:'$12,000', tags:['Python','Pandas','Scikit-learn','Data Analysis'], userRank:45,  userScore:720, maxScore:1000, problemsSolved:4, totalProblems:5 },
  ];

  useEffect(() => {
    setTimeout(() => {
      setContests(mockContests);
      setFilteredContests(mockContests.filter(c => c.status === 'upcoming'));
      const upcoming    = mockContests.filter(c => c.status === 'upcoming').length;
      const completed   = mockContests.filter(c => c.status === 'completed').length;
      const participated = mockContests.filter(c => c.isRegistered && c.status === 'completed').length;
      setStats({ totalContests: mockContests.length, participated, upcoming, completed, bestRank: 23, totalPoints: 2170 });
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    let f = [...contests];
    if (activeTab === 'upcoming')   f = f.filter(c => c.status === 'upcoming');
    if (activeTab === 'completed')  f = f.filter(c => c.status === 'completed');
    if (activeTab === 'registered') f = f.filter(c => c.isRegistered);
    if (activeTab === 'bookmarked') f = f.filter(c => c.isBookmarked);
    if (searchQuery) f = f.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.category.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredContests(f);
  }, [activeTab, contests, searchQuery]);

  const handleContestCreated = (nc) => {
    setContests(p => [nc, ...p]);
    setStats(s => ({ ...s, totalContests: s.totalContests + 1, upcoming: s.upcoming + 1 }));
  };
  const handleBookmark = (id) => setContests(cs => cs.map(c => c.id === id ? { ...c, isBookmarked: !c.isBookmarked } : c));

  const diffColor   = d => ({ Easy:'bg-green-100 text-green-800', Medium:'bg-yellow-100 text-yellow-800', Hard:'bg-red-100 text-red-800' }[d] || 'bg-gray-100 text-gray-800');
  const statusColor = s => ({ upcoming:'bg-blue-100 text-blue-800', active:'bg-green-100 text-green-800', completed:'bg-gray-100 text-gray-800' }[s] || 'bg-gray-100 text-gray-800');

  const timeLeft = (date, time) => {
    const diff = new Date(`${date} ${time}`) - new Date();
    if (diff <= 0) return 'Started';
    const d = Math.floor(diff/86400000), h = Math.floor((diff%86400000)/3600000);
    return d > 0 ? `${d}d ${h}h` : `${h}h`;
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        <p className="mt-4 text-gray-600">Loading your contests…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Modals ── */}
      {showCreateModal    && <CreateContestModal  onClose={() => setShowCreateModal(false)}    onCreate={handleContestCreated} />}
      {showRemindersModal && <RemindersModal       onClose={() => setShowRemindersModal(false)} contests={contests} />}
      {showResultsModal   && <ResultsModal         onClose={() => setShowResultsModal(false)}   contests={contests} />}
      {showCertsModal     && <CertificatesModal    onClose={() => setShowCertsModal(false)}     contests={contests} />}

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-4">My Contests</h1>
              <p className="text-white/90 mb-6">Manage your registered contests, track performance, and discover new challenges.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon:Trophy,       color:'text-yellow-300', value:stats.totalContests,  label:'Total Contests' },
                  { icon:CheckCircle,  color:'text-green-300',  value:stats.participated,   label:'Participated'   },
                  { icon:Calendar,     color:'text-blue-300',   value:stats.upcoming,       label:'Upcoming'       },
                  { icon:Target,       color:'text-purple-300', value:`#${stats.bestRank}`, label:'Best Rank'      },
                ].map(({ icon:Icon, color, value, label }) => (
                  <div key={label} className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-6 h-6 ${color}`} />
                      <div><p className="text-2xl font-bold">{value}</p><p className="text-sm text-white/80">{label}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/dashboard/contests" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium flex items-center gap-2">
                <Eye className="w-4 h-4" /> Browse All Contests
              </Link>
              <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 bg-white text-blue-700 hover:bg-gray-100 rounded-lg font-medium flex items-center gap-2">
                <Plus className="w-4 h-4" /> Create Contest
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-2 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key:'upcoming',   label:`Upcoming (${stats.upcoming})`,   icon:Calendar    },
              { key:'registered', label:'Registered',                      icon:CheckCircle },
              { key:'completed',  label:`Completed (${stats.completed})`, icon:Trophy      },
              { key:'bookmarked', label:'Bookmarked',                      icon:Bookmark    },
            ].map(({ key, label, icon:Icon }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab===key?'bg-blue-600 text-white':'text-gray-700 hover:bg-gray-100'}`}>
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="container mx-auto px-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Search contests…" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex gap-3">
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Categories</option><option>Algorithm</option><option>AI/ML</option><option>Web Development</option><option>Data Science</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Difficulty</option><option>Easy</option><option>Medium</option><option>Hard</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 pb-8">
        {filteredContests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <CalendarDays className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contests found</h3>
            <p className="text-gray-600 mb-6">
              {activeTab==='upcoming'?'No upcoming contests.':activeTab==='registered'?"You haven't registered for any.":activeTab==='completed'?"No completed contests yet.":"No bookmarked contests."}
            </p>
            <Link to="/dashboard/contests" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium inline-flex items-center gap-2">
              <Eye className="w-4 h-4" /> Browse Contests
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContests.map(contest => (
              <div key={contest.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor(contest.status)}`}>{contest.status.charAt(0).toUpperCase()+contest.status.slice(1)}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${diffColor(contest.difficulty)}`}>{contest.difficulty}</span>
                        {contest.isRegistered && contest.status==='upcoming' && <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">Registered</span>}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{contest.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{contest.description}</p>
                    </div>
                    <button onClick={() => handleBookmark(contest.id)} className={`p-2 rounded-lg transition-colors ml-2 flex-shrink-0 ${contest.isBookmarked?'text-yellow-500':'text-gray-400 hover:text-gray-600'}`}>
                      <Bookmark className={`w-5 h-5 ${contest.isBookmarked?'fill-current':''}`} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600"><Calendar className="w-4 h-4 text-gray-400"/><span>{contest.date}</span></div>
                      <div className="flex items-center gap-2 text-gray-600"><Clock className="w-4 h-4 text-gray-400"/><span>{contest.duration}</span></div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600"><Users className="w-4 h-4 text-gray-400"/><span>{contest.participants}/{contest.maxParticipants}</span></div>
                      <span className="font-semibold text-gray-900">{contest.prizePool}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-blue-600 h-1.5 rounded-full" style={{width:`${(contest.participants/contest.maxParticipants)*100}%`}}/>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {contest.tags.slice(0,3).map((tag,i)=><span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{tag}</span>)}
                      {contest.tags.length>3 && <span className="text-xs text-gray-400">+{contest.tags.length-3}</span>}
                    </div>
                    {contest.status==='completed' && contest.userRank && (
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div><div className="text-xl font-bold text-blue-700">#{contest.userRank}</div><div className="text-xs text-gray-500">Rank</div></div>
                          <div><div className="text-xl font-bold text-green-700">{contest.userScore}</div><div className="text-xs text-gray-500">Score</div></div>
                          <div><div className="text-xl font-bold text-purple-700">{contest.problemsSolved}/{contest.totalProblems}</div><div className="text-xs text-gray-500">Solved</div></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {contest.status==='upcoming' && `Starts in ${timeLeft(contest.date,contest.startTime)}`}
                    {contest.status==='completed' && '✓ Completed'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/dashboard/contests/${contest.id}`} className="px-3 py-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 hover:bg-blue-50 rounded-lg transition-colors">
                      Details <ChevronRight className="w-3.5 h-3.5"/>
                    </Link>
                    {contest.status==='upcoming' && !contest.isRegistered
                      ? <Link to={`/dashboard/contests/${contest.id}/register`} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors">Register</Link>
                      : contest.status==='completed'
                        ? <Link to={`/dashboard/contests/${contest.id}/results`} className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white rounded-lg font-medium text-sm transition-colors">Results</Link>
                        : contest.status==='upcoming' && contest.isRegistered
                          ? <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg font-medium text-sm">✓ Registered</span>
                          : null
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Stats + Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Performance */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Summary</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1"><span className="text-sm text-gray-600">Best Rank</span><span className="font-bold">#{stats.bestRank}</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full w-full"/></div>
              </div>
              <div>
                <div className="flex justify-between mb-1"><span className="text-sm text-gray-600">Total Points</span><span className="font-bold">{stats.totalPoints}</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{width:'85%'}}/></div>
              </div>
            </div>
          </div>

          {/* Upcoming Schedule */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Schedule</h3>
            <div className="space-y-3">
              {contests.filter(c=>c.status==='upcoming'&&c.isRegistered).slice(0,2).map(c=>(
                <div key={c.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div><p className="font-medium text-gray-900 text-sm">{c.title}</p><p className="text-xs text-gray-500">{c.date} · {c.startTime}</p></div>
                  <span className="text-xs font-medium text-blue-600">{timeLeft(c.date,c.startTime)}</span>
                </div>
              ))}
              {contests.filter(c=>c.status==='upcoming'&&c.isRegistered).length===0 && (
                <p className="text-gray-500 text-center py-4 text-sm">No upcoming registered contests</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button onClick={() => setShowCreateModal(true)}
                className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-between transition-colors">
                <span>Create New Contest</span><Plus className="w-4 h-4"/>
              </button>

              {/* ── SET CONTEST REMINDERS ── */}
              <button onClick={() => setShowRemindersModal(true)}
                className="w-full px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-medium flex items-center justify-between transition-colors">
                <span>Set Contest Reminders</span><Bell className="w-4 h-4"/>
              </button>

              {/* ── VIEW ALL RESULTS ── */}
              <button onClick={() => setShowResultsModal(true)}
                className="w-full px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-medium flex items-center justify-between transition-colors">
                <span>View All Results</span><BarChart className="w-4 h-4"/>
              </button>

              {/* ── DOWNLOAD CERTIFICATES ── */}
              <button onClick={() => setShowCertsModal(true)}
                className="w-full px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg font-medium flex items-center justify-between transition-colors">
                <span>Download Certificates</span><Award className="w-4 h-4"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyContests;