// src/pages/ContestResults.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Trophy, Award, BarChart, PieChart, TrendingUp,
  Download, Share2, Filter, Calendar, Users,
  CheckCircle, XCircle, Clock, Target, Star,
  Medal, Crown, ChevronRight, Eye, X, Printer,
  ExternalLink, Copy, Check, Linkedin, Twitter
} from 'lucide-react';

// ─── Certificate Modal ────────────────────────────────────────────────────────
const CertificateModal = ({ cert, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [shareMenu, setShareMenu] = useState(false);
  const certRef = useRef(null);

  if (!cert) return null;

  const getBadgeStyle = (type) => {
    if (type.includes('Top 3%') || type.includes('Top 1%') || type.includes('Winner'))
      return { bg: 'from-yellow-400 via-yellow-300 to-amber-400', text: 'text-yellow-900', border: '#d97706', seal: '#f59e0b' };
    if (type.includes('Top 5%') || type.includes('Top 10'))
      return { bg: 'from-slate-400 via-slate-300 to-gray-400', text: 'text-slate-900', border: '#64748b', seal: '#94a3b8' };
    if (type.includes('Top 50') || type.includes('Top 25%'))
      return { bg: 'from-orange-400 via-orange-300 to-amber-500', text: 'text-orange-900', border: '#c2410c', seal: '#ea580c' };
    return { bg: 'from-blue-500 via-blue-400 to-indigo-500', text: 'text-blue-900', border: '#3b82f6', seal: '#6366f1' };
  };

  const style = getBadgeStyle(cert.certificate);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://contests.dev/certificate/${cert.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printContents = certRef.current.innerHTML;
    const w = window.open('', '_blank');
    w.document.write(`
      <html><head><title>Certificate - ${cert.certificate}</title>
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
      <style>
        body { margin: 0; background: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        @media print { body { margin: 0; } }
      </style></head>
      <body>${printContents}</body></html>
    `);
    w.document.close();
    setTimeout(() => { w.print(); }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-gray-900">Certificate of Achievement</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <div className="relative">
              <button
                onClick={() => setShareMenu(v => !v)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              {shareMenu && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl py-2 w-44 z-10">
                  <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">
                    <Linkedin className="w-4 h-4 text-blue-700" /> LinkedIn
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">
                    <Twitter className="w-4 h-4 text-sky-500" /> Twitter / X
                  </button>
                  <button onClick={handleCopyLink} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">
                    <ExternalLink className="w-4 h-4 text-gray-500" /> Copy URL
                  </button>
                </div>
              )}
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="p-6 flex flex-col items-center">
          <div ref={certRef} className="w-full" style={{ maxWidth: 760 }}>
            <div
              className="relative w-full rounded-xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #fefce8 0%, #fff 40%, #eff6ff 100%)',
                border: `3px solid ${style.border}`,
                boxShadow: `0 0 0 8px rgba(255,255,255,0.8), 0 0 0 10px ${style.border}33`,
                fontFamily: "'EB Garamond', Georgia, serif",
                minHeight: 520,
              }}
            >
              {/* Corner ornaments */}
              {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos, i) => (
                <div key={i} className={`absolute ${pos} w-10 h-10 opacity-30`}
                  style={{
                    background: `radial-gradient(circle, ${style.border} 2px, transparent 2px)`,
                    backgroundSize: '8px 8px',
                  }} />
              ))}

              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]"
                style={{ fontSize: 140, fontWeight: 900, color: style.border, fontFamily: 'Georgia, serif', userSelect: 'none' }}>
                ✦
              </div>

              <div className="relative z-10 px-12 py-10 flex flex-col items-center text-center">
                {/* Top badge ribbon */}
                <div className={`inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-gradient-to-r ${style.bg} shadow-md mb-6`}>
                  <Award className="w-4 h-4" style={{ color: style.border }} />
                  <span className="text-sm font-bold tracking-widest uppercase" style={{ color: style.border, letterSpacing: '0.15em' }}>
                    Certificate of Achievement
                  </span>
                </div>

                {/* Org name */}
                <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-2">ContestHub Platform</p>

                <p className="text-base text-gray-500 mb-1" style={{ fontStyle: 'italic' }}>This certificate is proudly presented to</p>

                {/* Recipient */}
                <div className="my-4">
                  <h2 style={{
                    fontFamily: "'Cinzel', 'Palatino Linotype', Georgia, serif",
                    fontSize: 36,
                    fontWeight: 700,
                    color: '#1e293b',
                    letterSpacing: '0.05em',
                    lineHeight: 1.2,
                    borderBottom: `2px solid ${style.border}`,
                    paddingBottom: 8,
                  }}>
                    Alex Johnson
                  </h2>
                </div>

                <p className="text-gray-500 mb-1 text-base">for outstanding performance in</p>

                <h3 style={{
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#1e40af',
                  marginBottom: 4,
                  letterSpacing: '0.03em',
                }}>
                  {cert.contestName}
                </h3>

                {/* Achievement badge */}
                <div className={`mt-4 mb-6 px-8 py-3 rounded-xl bg-gradient-to-r ${style.bg} shadow-lg`}>
                  <p className="text-2xl font-black tracking-wide" style={{ color: style.border, fontFamily: "'Cinzel', Georgia, serif" }}>
                    {cert.certificate}
                  </p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-6 w-full mb-8 max-w-md">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                      style={{ background: `${style.border}22`, border: `2px solid ${style.border}44` }}>
                      <Trophy className="w-5 h-5" style={{ color: style.border }} />
                    </div>
                    <span className="text-xl font-bold text-gray-800">#{cert.rank}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Rank</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                      style={{ background: `${style.border}22`, border: `2px solid ${style.border}44` }}>
                      <Star className="w-5 h-5" style={{ color: style.border }} />
                    </div>
                    <span className="text-xl font-bold text-gray-800">{cert.score}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Points</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                      style={{ background: `${style.border}22`, border: `2px solid ${style.border}44` }}>
                      <Calendar className="w-5 h-5" style={{ color: style.border }} />
                    </div>
                    <span className="text-xl font-bold text-gray-800">{cert.date}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Date</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${style.border}66)` }} />
                  <span style={{ color: style.border, fontSize: 18 }}>✦</span>
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${style.border}66)` }} />
                </div>

                {/* Signatures row */}
                <div className="grid grid-cols-2 gap-12 w-full max-w-sm">
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-px bg-gray-400 mb-1" />
                    <p className="text-xs text-gray-500">Platform Director</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-px bg-gray-400 mb-1" />
                    <p className="text-xs text-gray-500">Contest Committee</p>
                  </div>
                </div>

                {/* Certificate ID */}
                <p className="mt-6 text-xs text-gray-400 tracking-widest uppercase">
                  Certificate ID: CERT-{cert.id.toString().padStart(6, '0')}-{cert.date.replace(/-/g, '')}
                </p>
              </div>
            </div>
          </div>

          {/* Download button below certificate */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-semibold transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Link Copied!' : 'Share Link'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main ContestResults ──────────────────────────────────────────────────────
const ContestResults = () => {
  const { contestId } = useParams();
  const [results, setResults] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('all');
  const [activeCert, setActiveCert] = useState(null); // certificate modal state

  const mockResults = [
    {
      id: 1,
      contestName: 'Code Challenge 2024',
      date: '2024-03-15',
      rank: 42,
      totalParticipants: 1250,
      score: 750,
      maxScore: 1000,
      problemsSolved: 4,
      totalProblems: 6,
      accuracy: '75%',
      timeTaken: '5h 30m',
      certificates: ['Participation', 'Top 5%'],
      performance: 'Good',
      percentile: 96.5
    },
    {
      id: 2,
      contestName: 'Winter Code Sprint 2024',
      date: '2024-02-10',
      rank: 23,
      totalParticipants: 850,
      score: 850,
      maxScore: 1000,
      problemsSolved: 5,
      totalProblems: 6,
      accuracy: '85%',
      timeTaken: '4h 45m',
      certificates: ['Top 50', 'Top 3%'],
      performance: 'Excellent',
      percentile: 97.3
    },
    {
      id: 3,
      contestName: 'Algorithm Masters 2023',
      date: '2023-12-05',
      rank: 156,
      totalParticipants: 2000,
      score: 600,
      maxScore: 1000,
      problemsSolved: 3,
      totalProblems: 6,
      accuracy: '60%',
      timeTaken: '6h 15m',
      certificates: ['Participation'],
      performance: 'Average',
      percentile: 92.2
    }
  ];

  const mockAnalytics = {
    totalContests: 12,
    bestRank: 15,
    averageRank: 78.5,
    totalPoints: 8500,
    problemsSolved: 68,
    accuracy: '78%',
    avgTimePerProblem: '45m',
    contestHistory: [
      { month: 'Jan', rank: 45 },
      { month: 'Feb', rank: 23 },
      { month: 'Mar', rank: 42 },
      { month: 'Apr', rank: 18 },
      { month: 'May', rank: 31 },
      { month: 'Jun', rank: 27 }
    ],
    difficultyDistribution: [
      { level: 'Easy', count: 28, color: 'bg-green-500' },
      { level: 'Medium', count: 32, color: 'bg-yellow-500' },
      { level: 'Hard', count: 8, color: 'bg-red-500' }
    ],
    languageUsage: [
      { language: 'Python', percentage: 65 },
      { language: 'Java', percentage: 20 },
      { language: 'C++', percentage: 10 },
      { language: 'JavaScript', percentage: 5 }
    ]
  };

  useEffect(() => {
    setTimeout(() => {
      setResults(mockResults);
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 800);
  }, []);

  // Build flat list of all certificate objects for the Certificates tab
  const allCertificates = results.flatMap(result =>
    result.certificates.map((cert, idx) => ({
      id: `${result.id}-${idx}`,
      contestName: result.contestName,
      certificate: cert,
      date: result.date,
      rank: result.rank,
      score: result.score,
      percentile: result.percentile,
      performance: result.performance,
    }))
  );

  const getPerformanceColor = (performance) => {
    switch (performance.toLowerCase()) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'average': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRankBadge = (rank) => {
    const base = 'w-10 h-10 rounded-full flex items-center justify-center';
    if (rank <= 10) return <div className={`${base} bg-gradient-to-r from-blue-500 to-purple-600`}><span className="text-white font-bold text-sm">{rank}</span></div>;
    if (rank <= 50) return <div className={`${base} bg-gradient-to-r from-green-500 to-green-600`}><span className="text-white font-bold text-sm">{rank}</span></div>;
    if (rank <= 100) return <div className={`${base} bg-gradient-to-r from-yellow-500 to-yellow-600`}><span className="text-white font-bold text-sm">{rank}</span></div>;
    return <div className={`${base} bg-gray-200`}><span className="text-gray-700 font-bold text-sm">{rank}</span></div>;
  };

  const getCertBadgeColor = (type) => {
    if (type.includes('Top 3%') || type.includes('Top 1%') || type.includes('Winner'))
      return 'bg-gradient-to-r from-yellow-400 to-amber-400 text-yellow-900';
    if (type.includes('Top 5%') || type.includes('Top 10'))
      return 'bg-gradient-to-r from-slate-300 to-gray-400 text-slate-800';
    if (type.includes('Top 50') || type.includes('Top 25%'))
      return 'bg-gradient-to-r from-orange-300 to-amber-400 text-orange-900';
    return 'bg-gradient-to-r from-blue-400 to-indigo-400 text-white';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Certificate Modal */}
      {activeCert && (
        <CertificateModal cert={activeCert} onClose={() => setActiveCert(null)} />
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-8 h-8 text-yellow-300" />
                <h1 className="text-3xl font-bold">Contest Results & Analytics</h1>
              </div>
              <p className="text-white/90 mb-6">
                Track your performance, view detailed results, and analyze your progress across all contests.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-sm text-white/80 mb-1">Total Contests</p>
                  <p className="text-2xl font-bold">{analytics.totalContests}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-sm text-white/80 mb-1">Best Rank</p>
                  <p className="text-2xl font-bold">#{analytics.bestRank}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-sm text-white/80 mb-1">Total Points</p>
                  <p className="text-2xl font-bold">{analytics.totalPoints}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-sm text-white/80 mb-1">Accuracy</p>
                  <p className="text-2xl font-bold">{analytics.accuracy}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-2 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'overview', label: 'Overview', icon: <BarChart className="w-4 h-4" /> },
              { key: 'results', label: 'Results', icon: <Trophy className="w-4 h-4" /> },
              { key: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> },
              { key: 'certificates', label: 'Certificates', icon: <Award className="w-4 h-4" /> },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  selectedTab === tab.key ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-8">

        {/* ── OVERVIEW TAB ── */}
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Rank Progress</h2>
                <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">All Time</option>
                  <option value="6m">Last 6 Months</option>
                  <option value="3m">Last 3 Months</option>
                  <option value="1m">Last Month</option>
                </select>
              </div>
              <div className="h-64 flex items-end gap-2">
                {analytics.contestHistory.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg"
                      style={{ height: `${100 - (item.rank / 50) * 100}%` }}></div>
                    <div className="text-center mt-2">
                      <div className="text-sm font-medium text-gray-900">#{item.rank}</div>
                      <div className="text-xs text-gray-500">{item.month}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">#{analytics.bestRank}</div>
                  <div className="text-sm text-gray-600">Best Rank</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{analytics.accuracy}</div>
                  <div className="text-sm text-gray-600">Avg Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{analytics.avgTimePerProblem}</div>
                  <div className="text-sm text-gray-600">Avg Time/Problem</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Difficulty Distribution</h2>
              <div className="space-y-4">
                {analytics.difficultyDistribution.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{item.level}</span>
                      <span className="text-gray-600">{item.count} problems</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className={`h-3 rounded-full ${item.color}`}
                        style={{ width: `${(item.count / analytics.problemsSolved) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Pro Tip</p>
                    <p className="text-sm text-gray-600">Focus on Medium problems to improve your ranking faster.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Contest Results</h2>
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium flex items-center gap-2">
                  <Download className="w-4 h-4" />Export All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {['Contest','Date','Rank','Score','Solved','Accuracy','Performance','Actions'].map(h => (
                        <th key={h} className="text-left py-3 font-medium text-gray-700">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr key={result.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4">
                          <p className="font-medium text-gray-900">{result.contestName}</p>
                          <p className="text-sm text-gray-500">{result.totalParticipants} participants</p>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />{result.date}
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            {getRankBadge(result.rank)}
                            <div>
                              <p className="font-bold text-gray-900">#{result.rank}</p>
                              <p className="text-sm text-gray-500">Top {result.percentile}%</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <p className="font-bold text-gray-900">{result.score}/{result.maxScore}</p>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(result.score / result.maxScore) * 100}%` }}></div>
                          </div>
                        </td>
                        <td className="py-4"><p className="font-medium text-gray-900">{result.problemsSolved}/{result.totalProblems}</p></td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            {result.accuracy > '70%'
                              ? <CheckCircle className="w-4 h-4 text-green-500" />
                              : <XCircle className="w-4 h-4 text-red-500" />}
                            <span className="font-medium">{result.accuracy}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(result.performance)}`}>
                            {result.performance}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 hover:bg-gray-100 rounded" title="View Certificates"
                              onClick={() => {
                                setSelectedTab('certificates');
                              }}>
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-100 rounded" title="Download">
                              <Download className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-100 rounded" title="Share">
                              <Share2 className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── RESULTS TAB ── */}
        {selectedTab === 'results' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Contests</option>
                    {results.map(r => <option key={r.id}>{r.contestName}</option>)}
                  </select>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Time</option>
                    <option>Last Month</option>
                    <option>Last 3 Months</option>
                    <option>Last 6 Months</option>
                  </select>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Performance</option>
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Average</option>
                    <option>Poor</option>
                  </select>
                </div>
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium flex items-center gap-2">
                  <Filter className="w-4 h-4" />Apply Filters
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result) => (
                <div key={result.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{result.contestName}</h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{result.date}</span>
                          <span className="text-sm text-gray-600">•</span>
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{result.totalParticipants}</span>
                        </div>
                      </div>
                      {getRankBadge(result.rank)}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Score</span>
                          <span className="text-sm font-medium">{result.score}/{result.maxScore}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(result.score / result.maxScore) * 100}%` }}></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{result.problemsSolved}</div>
                          <div className="text-sm text-gray-600">Solved</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{result.accuracy}</div>
                          <div className="text-sm text-gray-600">Accuracy</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-gray-600">Time Taken:</span>
                          <span className="ml-2 font-medium">{result.timeTaken}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(result.performance)}`}>
                          {result.performance}
                        </span>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Certificates Earned:</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.certificates.map((cert, idx) => {
                          const certObj = {
                            id: `${result.id}-${idx}`,
                            contestName: result.contestName,
                            certificate: cert,
                            date: result.date,
                            rank: result.rank,
                            score: result.score,
                            percentile: result.percentile,
                          };
                          return (
                            <button
                              key={idx}
                              onClick={() => setActiveCert(certObj)}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200 transition-colors flex items-center gap-1"
                            >
                              <Award className="w-3 h-3" />
                              {cert}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="mt-6 flex gap-2">
                      <button
                        onClick={() => setActiveCert({
                          id: result.id,
                          contestName: result.contestName,
                          certificate: result.certificates[0],
                          date: result.date,
                          rank: result.rank,
                          score: result.score,
                          percentile: result.percentile,
                        })}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                      >
                        View Details
                      </button>
                      <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ANALYTICS TAB ── */}
        {selectedTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Language Usage</h2>
              <div className="space-y-4">
                {analytics.languageUsage.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="font-bold text-blue-600">{item.language.charAt(0)}</span>
                        </div>
                        <span className="font-medium text-gray-900">{item.language}</span>
                      </div>
                      <span className="font-bold text-gray-900">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Recommendation</p>
                    <p className="text-sm text-gray-600">You're strong in Python. Consider practicing C++ for better performance.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Metrics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="text-3xl font-bold text-green-700 mb-1">{analytics.problemsSolved}</div>
                  <div className="text-sm text-green-800">Total Problems Solved</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="text-3xl font-bold text-blue-700 mb-1">{analytics.averageRank}</div>
                  <div className="text-sm text-blue-800">Average Rank</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <div className="text-3xl font-bold text-purple-700 mb-1">{analytics.accuracy}</div>
                  <div className="text-sm text-purple-800">Average Accuracy</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                  <div className="text-3xl font-bold text-orange-700 mb-1">{analytics.avgTimePerProblem}</div>
                  <div className="text-sm text-orange-800">Avg Time/Problem</div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-3">Strengths</h3>
                <div className="flex flex-wrap gap-2">
                  {['Algorithm Design', 'Data Structures'].map(s => (
                    <span key={s} className="px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-sm font-medium">{s}</span>
                  ))}
                  <span className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium">Dynamic Programming</span>
                  <span className="px-3 py-1.5 bg-red-100 text-red-800 rounded-lg text-sm font-medium">Graph Theory</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Areas for Improvement</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: <Clock className="w-5 h-5 text-red-600" />, bg: 'bg-red-100', title: 'Time Management', sub: 'Spending too much time on hard problems', tip: 'Practice setting time limits for each problem during practice sessions.' },
                  { icon: <XCircle className="w-5 h-5 text-yellow-600" />, bg: 'bg-yellow-100', title: 'Edge Cases', sub: 'Missing edge cases in solutions', tip: 'Always test with minimum, maximum, and boundary input values.' },
                  { icon: <Target className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-100', title: 'Consistency', sub: 'Performance varies between contests', tip: 'Stick to a regular practice schedule and focus on weaker topics.' },
                ].map((item, i) => (
                  <div key={i} className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center`}>{item.icon}</div>
                      <div>
                        <h3 className="font-bold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.sub}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700">{item.tip}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── CERTIFICATES TAB ── */}
        {selectedTab === 'certificates' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Your Certificates</h2>
                <p className="text-gray-500 text-sm mt-1">{allCertificates.length} certificate{allCertificates.length !== 1 ? 's' : ''} earned</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCertificates.map((cert) => (
                <div key={cert.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all group">
                  {/* Card top accent */}
                  <div className={`h-2 w-full bg-gradient-to-r ${
                    cert.certificate.includes('Top 3%') ? 'from-yellow-400 to-amber-500' :
                    cert.certificate.includes('Top 5%') ? 'from-slate-400 to-gray-500' :
                    cert.certificate.includes('Top 50') ? 'from-orange-400 to-amber-500' :
                    'from-blue-500 to-indigo-500'
                  }`} />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{cert.certificate}</h3>
                        <p className="text-sm text-gray-600 mt-0.5">{cert.contestName}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center border-2 border-yellow-200">
                        <Award className="w-6 h-6 text-yellow-500" />
                      </div>
                    </div>

                    <div className="space-y-3 mb-5">
                      <div className="flex items-center justify-between py-2 border-b border-gray-50">
                        <span className="text-gray-500 text-sm">Date Earned</span>
                        <span className="font-semibold text-gray-800">{cert.date}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-50">
                        <span className="text-gray-500 text-sm">Rank</span>
                        <span className="font-bold text-gray-800">#{cert.rank}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-50">
                        <span className="text-gray-500 text-sm">Score</span>
                        <span className="font-bold text-gray-800">{cert.score} points</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-500 text-sm">Percentile</span>
                        <span className="font-bold text-blue-600">Top {100 - cert.percentile < 1 ? '<1' : (100 - cert.percentile).toFixed(1)}%</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveCert(cert)}
                        className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Certificate
                      </button>
                      <button
                        onClick={() => setActiveCert(cert)}
                        className="px-3 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        className="px-3 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl transition-colors"
                        title="Share"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestResults;