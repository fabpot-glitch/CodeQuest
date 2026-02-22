// src/pages/ContestDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, Users, Award, Trophy, BarChart,
  FileText, Code, Lock, Globe, ChevronLeft, ExternalLink,
  Share2, Bookmark, Bell, AlertTriangle, CheckCircle, XCircle,
  Mail, Twitter, Facebook, Linkedin, Copy, Download,
  MessageCircle, HelpCircle, FileCode, Star, Gift,
  Video, Shield, ChevronRight, BookOpen, Zap
} from 'lucide-react';

// ─── SHARED CONTEST DATA ─────────────────────────────────────────────────────
const mockContests = [
  {
    id: 'code-challenge-2024',
    title: 'Code Challenge 2024',
    description: 'Annual coding competition featuring algorithmic problems from beginner to advanced levels. Test your problem-solving skills and compete with developers worldwide.',
    host: 'TechCorp Inc.',
    hostLogo: 'TC',
    date: '2026-06-15',
    startTime: '10:00 AM',
    endTime: '6:00 PM',
    duration: '8 hours',
    totalParticipants: 1250,
    maxParticipants: 2000,
    difficulty: 'Medium',
    rating: 4.8,
    reviews: 234,
    isFree: true,
    prizes: [
      { position: 1, amount: '$5,000', badge: '🥇' },
      { position: 2, amount: '$2,500', badge: '🥈' },
      { position: 3, amount: '$1,000', badge: '🥉' },
      { position: '4-10', amount: '$500 each', badge: '🏅' }
    ],
    rules: [
      'Individual participation only',
      'No external code or libraries allowed',
      'All submissions must be original work',
      'Problems range from easy to hard',
      'Submissions evaluated on correctness and efficiency',
      'Plagiarism results in immediate disqualification',
      'Code must be well-documented',
      'Time limit: 2 seconds per problem',
      'Memory limit: 256 MB per problem'
    ],
    tags: ['Algorithm', 'Data Structures', 'Competitive Programming', 'C++', 'Python', 'Java'],
    status: 'upcoming',
    type: 'public',
    registrationDeadline: '2026-06-14',
    languages: ['Python 3.9', 'Java 11', 'C++17', 'JavaScript ES6', 'Go 1.16', 'Rust 1.5'],
    problems: 6,
    organizers: [
      { name: 'John Doe', role: 'Head Judge', avatar: 'JD', email: 'john@techcorp.com' },
      { name: 'Sarah Smith', role: 'Problem Setter', avatar: 'SS', email: 'sarah@techcorp.com' },
      { name: 'Mike Johnson', role: 'Coordinator', avatar: 'MJ', email: 'mike@techcorp.com' }
    ],
    faq: [
      { question: 'What is the format of the contest?', answer: 'The contest consists of 6 algorithmic problems to be solved in 8 hours. Each problem has multiple test cases.' },
      { question: 'Can I use external libraries?', answer: 'No, only standard libraries for each programming language are allowed.' },
      { question: 'How is the winner determined?', answer: 'Winners are determined by the number of problems solved, with ties broken by total submission time.' }
    ],
    resources: [
      { name: 'Sample Problems', type: 'pdf', icon: FileText },
      { name: 'Rules & Guidelines', type: 'doc', icon: FileCode },
      { name: 'Past Solutions', type: 'video', icon: Video }
    ],
    schedule: [
      { time: '10:00 AM', event: 'Contest Starts', icon: '🚀' },
      { time: '11:00 AM', event: 'First Leaderboard Update', icon: '📊' },
      { time: '2:00 PM', event: 'Mid-Contest Announcement', icon: '📢' },
      { time: '5:00 PM', event: 'Final Hour', icon: '⏰' },
      { time: '6:00 PM', event: 'Contest Ends', icon: '🏁' }
    ]
  },
  {
    id: 'ai-ml-hackathon',
    title: 'AI/ML Hackathon 2026',
    description: 'Build innovative AI/ML solutions for real-world problems in 48 hours.',
    host: 'AI Research Lab',
    hostLogo: 'AI',
    date: '2026-07-20',
    startTime: '9:00 AM',
    endTime: '9:00 AM',
    duration: '48 hours',
    totalParticipants: 850,
    maxParticipants: 1000,
    difficulty: 'Hard',
    rating: 4.9,
    reviews: 156,
    isFree: false,
    registrationFee: 25,
    prizes: [
      { position: 1, amount: '$8,000', badge: '🥇' },
      { position: 2, amount: '$4,000', badge: '🥈' },
      { position: 3, amount: '$2,000', badge: '🥉' },
      { position: '4-5', amount: '$1,000 each', badge: '🏅' }
    ],
    rules: [
      'Team size: 2-4 members',
      'All code must be open source',
      'Must use provided datasets',
      'Solutions must be reproducible',
      'Final submission includes presentation'
    ],
    tags: ['Machine Learning', 'Deep Learning', 'Python', 'TensorFlow', 'PyTorch'],
    status: 'upcoming',
    type: 'public',
    registrationDeadline: '2026-07-19',
    languages: ['Python', 'R', 'Julia'],
    problems: 3,
    organizers: [
      { name: 'Dr. Alan Turing', role: 'Lead Judge', avatar: 'AT', email: 'alan@airesearch.com' },
      { name: 'Grace Hopper', role: 'Technical Mentor', avatar: 'GH', email: 'grace@airesearch.com' }
    ],
    faq: [
      { question: 'Do we need GPUs?', answer: 'Cloud credits will be provided for GPU usage during the hackathon.' },
      { question: 'Can we use pre-trained models?', answer: 'Yes, but they must be clearly cited in your submission.' }
    ],
    resources: [
      { name: 'Dataset', type: 'zip', icon: Download },
      { name: 'Starter Code', type: 'code', icon: Code }
    ],
    schedule: [
      { time: 'Day 1 - 9:00 AM', event: 'Kickoff & theme reveal', icon: '🚀' },
      { time: 'Day 1 - 11:00 AM', event: 'Mentorship sessions open', icon: '🤝' },
      { time: 'Day 2 - 9:00 AM', event: 'Submissions close', icon: '🏁' },
      { time: 'Day 2 - 12:00 PM', event: 'Finalist presentations', icon: '🎤' },
      { time: 'Day 2 - 5:00 PM', event: 'Awards ceremony', icon: '🏆' }
    ]
  },
  {
    id: 'cybersecurity-ctf',
    title: 'Cybersecurity CTF',
    description: 'Capture The Flag competition for cybersecurity enthusiasts. Test your hacking skills across web, crypto, pwn, and forensics challenges.',
    host: 'CyberSec Alliance',
    hostLogo: 'CS',
    date: '2026-04-12',
    startTime: '2:00 PM',
    endTime: '2:00 PM',
    duration: '24 hours',
    totalParticipants: 450,
    maxParticipants: 800,
    difficulty: 'Hard',
    rating: 4.7,
    reviews: 89,
    isFree: true,
    prizes: [
      { position: 1, amount: '$10,000', badge: '🥇' },
      { position: 2, amount: '$5,000', badge: '🥈' },
      { position: 3, amount: '$2,500', badge: '🥉' },
      { position: '4-10', amount: '$500 each', badge: '🏅' }
    ],
    rules: [
      'Individual or team participation (max 3 members)',
      'No DoS attacks on infrastructure',
      'No social engineering attacks',
      'Flags must be submitted in the correct format: FLAG{...}',
      'Writeups required for top 10 teams'
    ],
    tags: ['CTF', 'Cryptography', 'Web Security', 'Reverse Engineering', 'Forensics'],
    status: 'upcoming',
    type: 'public',
    registrationDeadline: '2026-04-11',
    languages: ['Any language allowed'],
    problems: 12,
    organizers: [
      { name: 'Eva Cyber', role: 'CTF Master', avatar: 'EC', email: 'eva@cybersec.com' }
    ],
    faq: [
      { question: 'What types of challenges are there?', answer: 'Web exploitation, Cryptography, Binary exploitation (Pwn), Reverse Engineering, Forensics, and Miscellaneous.' },
      { question: 'Is there a beginner track?', answer: 'Yes, we have specially marked easy challenges for those new to CTF competitions.' }
    ],
    resources: [
      { name: 'VPN Setup Guide', type: 'pdf', icon: FileText },
      { name: 'Recommended Tools', type: 'txt', icon: FileCode }
    ],
    schedule: [
      { time: '2:00 PM Day 1', event: 'CTF begins — challenges go live', icon: '🚀' },
      { time: '8:00 PM Day 1', event: 'Hint system unlocks', icon: '💡' },
      { time: '2:00 PM Day 2', event: 'CTF ends', icon: '🏁' },
      { time: '4:00 PM Day 2', event: 'Winners announced', icon: '🏆' }
    ]
  }
];

const mockProblems = [
  { id: 1, title: 'Two Sum', difficulty: 'Easy', points: 100, solved: 850, submissions: 1200, successRate: 71 },
  { id: 2, title: 'Reverse Linked List', difficulty: 'Easy', points: 100, solved: 720, submissions: 950, successRate: 76 },
  { id: 3, title: 'Binary Tree Level Order', difficulty: 'Medium', points: 200, solved: 450, submissions: 800, successRate: 56 },
  { id: 4, title: 'Dynamic Programming — Knapsack', difficulty: 'Medium', points: 200, solved: 320, submissions: 700, successRate: 46 },
  { id: 5, title: 'Graph — Dijkstra\'s Algorithm', difficulty: 'Hard', points: 300, solved: 150, submissions: 400, successRate: 38 },
  { id: 6, title: 'Advanced String Algorithms', difficulty: 'Hard', points: 300, solved: 80, submissions: 250, successRate: 32 }
];

const mockLeaderboard = [
  { rank: 1, name: 'Alex Chen', score: 1200, solved: 6, time: '4:30', country: '🇺🇸' },
  { rank: 2, name: 'Maria Garcia', score: 1150, solved: 6, time: '5:15', country: '🇪🇸' },
  { rank: 3, name: 'James Wilson', score: 1100, solved: 5, time: '4:45', country: '🇬🇧' },
  { rank: 4, name: 'Priya Patel', score: 1050, solved: 5, time: '5:30', country: '🇮🇳' },
  { rank: 5, name: 'Yuki Tanaka', score: 1000, solved: 4, time: '3:20', country: '🇯🇵' },
  { rank: 6, name: 'Carlos Mendez', score: 950, solved: 4, time: '4:10', country: '🇲🇽' },
  { rank: 7, name: 'Sophie Laurent', score: 900, solved: 3, time: '2:55', country: '🇫🇷' }
];

function getOrdinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

// ─── SHARE MODAL ─────────────────────────────────────────────────────────────
const ShareModal = ({ contest, onClose }) => {
  const [copied, setCopied] = useState(false);
  const url = window.location.href;

  const handleShare = (platform) => {
    const text = `Check out ${contest.title}!`;
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent(contest.title)}&body=${encodeURIComponent(text + '\n\n' + url)}`
    };
    if (urls[platform]) window.open(urls[platform], '_blank');
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <h3 className="text-xl font-bold mb-1">Share this Contest</h3>
        <p className="text-gray-500 text-sm mb-5">Invite others to join {contest.title}</p>
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { id: 'twitter', label: 'Twitter', bg: 'bg-sky-500', icon: Twitter },
            { id: 'facebook', label: 'Facebook', bg: 'bg-blue-600', icon: Facebook },
            { id: 'linkedin', label: 'LinkedIn', bg: 'bg-blue-700', icon: Linkedin },
            { id: 'email', label: 'Email', bg: 'bg-gray-600', icon: Mail },
          ].map(({ id, label, bg, icon: Icon }) => (
            <button key={id} onClick={() => handleShare(id)} className={`${bg} text-white rounded-xl p-3 flex flex-col items-center gap-1 hover:opacity-90 transition-opacity`}>
              <Icon className="w-5 h-5" />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-xl mb-4">
          <span className="flex-1 text-sm text-gray-600 truncate">{url}</span>
          <button onClick={handleCopy} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${copied ? 'bg-green-100 text-green-700' : 'bg-white text-gray-700 hover:bg-gray-200'}`}>
            {copied ? '✓ Copied!' : <><Copy className="w-4 h-4 inline mr-1" />Copy</>}
          </button>
        </div>
        <button onClick={onClose} className="w-full py-2 bg-gray-200 hover:bg-gray-300 rounded-xl font-medium transition-colors">Close</button>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const ContestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifSet, setNotifSet] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const found = mockContests.find(c => c.id === id);
      if (found) {
        setContest(found);
        // Read registration state from localStorage (set by ContestRegistration)
        const regData = localStorage.getItem(`registration_${id}`);
        setIsRegistered(!!regData);
        // Read bookmark state
        const bookmarks = JSON.parse(localStorage.getItem('bookmarkedContests') || '[]');
        setIsBookmarked(bookmarks.includes(id));
      } else {
        navigate('/dashboard/contests');
      }
      setLoading(false);
    }, 700);
  }, [id, navigate]);

  // Live countdown timer
  useEffect(() => {
    if (!contest?.date) return;
    const update = () => {
      const target = new Date(`${contest.date}T${contest.startTime.replace(' AM', '').replace(' PM', '')}:00`);
      const now = new Date();
      const diff = target - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff % 86400000) / 3600000),
          minutes: Math.floor((diff % 3600000) / 60000),
          seconds: Math.floor((diff % 60000) / 1000)
        });
      }
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [contest]);

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedContests') || '[]');
    let updated;
    if (isBookmarked) {
      updated = bookmarks.filter(b => b !== id);
    } else {
      updated = [...bookmarks, id];
    }
    localStorage.setItem('bookmarkedContests', JSON.stringify(updated));
    setIsBookmarked(!isBookmarked);
  };

  const handleRemind = () => {
    if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(perm => {
        if (perm === 'granted') {
          new Notification('⏰ Contest Reminder Set', {
            body: `${contest.title} starts on ${contest.date} at ${contest.startTime}`
          });
          setNotifSet(true);
        }
      });
    } else {
      setNotifSet(true);
    }
  };

  const getDifficultyColor = (d = '') => ({
    easy: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    hard: 'text-red-600 bg-red-100',
    advanced: 'text-red-700 bg-red-100',
  }[d.toLowerCase()] || 'text-blue-600 bg-blue-100');

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'problems', label: `Problems (${contest?.problems || 0})` },
    { key: 'leaderboard', label: 'Leaderboard' },
    { key: 'schedule', label: 'Schedule' },
    { key: 'resources', label: 'Resources' },
    { key: 'faq', label: 'FAQ' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p className="mt-4 text-gray-600">Loading contest details...</p>
        </div>
      </div>
    );
  }

  if (!contest) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {showShareModal && <ShareModal contest={contest} onClose={() => setShowShareModal(false)} />}

      {/* Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <h3 className="text-xl font-bold mb-5">Contest Rules & Guidelines</h3>
            <div className="space-y-3">
              {contest.rules.map((rule, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</div>
                  <p className="text-gray-700">{rule}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowRulesModal(false)} className="mt-6 w-full py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-medium transition-colors">I Understand</button>
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
            <Link to="/dashboard/contests" className="hover:text-white flex items-center gap-1 transition-colors">
              <ChevronLeft className="w-4 h-4" /> All Contests
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/90">{contest.title}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${contest.status === 'upcoming' ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30' : 'bg-green-400/20 text-green-300 border border-green-400/30'}`}>
                  {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
                </span>
                <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm flex items-center gap-1">
                  {contest.type === 'public' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                  {contest.type === 'public' ? 'Public' : 'Private'}
                </span>
                <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current text-yellow-300" />
                  {contest.rating} ({contest.reviews} reviews)
                </span>
                {contest.isFree
                  ? <span className="px-3 py-1 bg-green-500/20 border border-green-400/30 text-green-300 rounded-full text-sm">Free Entry</span>
                  : <span className="px-3 py-1 bg-orange-400/20 border border-orange-400/30 text-orange-300 rounded-full text-sm">${contest.registrationFee} Entry Fee</span>
                }
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-3">{contest.title}</h1>
              <p className="text-white/80 text-lg mb-6 max-w-3xl leading-relaxed">{contest.description}</p>

              <div className="flex flex-wrap gap-5 mb-6 text-white/90">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{contest.date} • {contest.startTime}–{contest.endTime}</span></div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span>{contest.duration}</span></div>
                <div className="flex items-center gap-2"><Users className="w-4 h-4" /><span>{contest.totalParticipants}/{contest.maxParticipants} participants</span></div>
                <div className="flex items-center gap-2"><Trophy className="w-4 h-4" /><span>Prize: {contest.prizes[0].amount}+</span></div>
              </div>

              <div className="flex flex-wrap gap-2">
                {contest.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-sm">{tag}</span>
                ))}
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex flex-col gap-3 lg:min-w-[220px]">
              {isRegistered ? (
                <div className="bg-green-500/15 border border-green-400/30 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span className="font-semibold text-green-300">You're Registered!</span>
                  </div>
                  <p className="text-sm text-green-200/70 mb-4">See you on {contest.date} at {contest.startTime}.</p>
                  <Link
                    to={`/dashboard/contests/${id}/register`}
                    className="w-full text-center block px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    View Registration Details
                  </Link>
                </div>
              ) : (
                <Link
                  to={`/dashboard/contests/${id}/register`}
                  className="px-6 py-3.5 bg-white text-blue-700 hover:bg-gray-100 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <Users className="w-5 h-5" />
                  Register Now
                </Link>
              )}

              <div className="flex gap-2">
                <button onClick={() => setShowShareModal(true)} className="flex-1 px-3 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-colors">
                  <Share2 className="w-4 h-4" /> Share
                </button>
                <button onClick={handleBookmark} className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${isBookmarked ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30' : 'bg-white/10 hover:bg-white/20'}`}>
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  {isBookmarked ? 'Saved' : 'Save'}
                </button>
                <button onClick={handleRemind} className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${notifSet ? 'bg-blue-400/20 text-blue-200 border border-blue-400/30' : 'bg-white/10 hover:bg-white/20'}`}>
                  <Bell className="w-4 h-4" /> {notifSet ? 'Set!' : 'Remind'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="border-b bg-white sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`py-4 px-4 font-medium border-b-2 transition-colors whitespace-nowrap text-sm ${
                  activeTab === key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="container mx-auto px-4 py-8">

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Countdown */}
              {contest.status === 'upcoming' && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" /> Contest Starts In
                  </h2>
                  <div className="grid grid-cols-4 gap-3">
                    {Object.entries(timeLeft).map(([unit, val]) => (
                      <div key={unit} className="text-center">
                        <div className="text-3xl md:text-4xl font-bold text-blue-600 bg-blue-50 rounded-xl py-4 tabular-nums">
                          {String(val).padStart(2, '0')}
                        </div>
                        <div className="text-xs text-gray-500 mt-2 uppercase tracking-wider">{unit}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-4 text-center">Registration closes on <strong>{contest.registrationDeadline}</strong></p>
                </div>
              )}

              {/* Rules */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" /> Rules & Guidelines
                </h2>
                <ul className="space-y-3">
                  {contest.rules.slice(0, 5).map((rule, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{rule}</span>
                    </li>
                  ))}
                </ul>
                {contest.rules.length > 5 && (
                  <button onClick={() => setShowRulesModal(true)} className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                    View all {contest.rules.length} rules <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Prizes */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" /> Prize Distribution
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {contest.prizes.map((prize, i) => (
                    <div key={i} className={`p-4 rounded-xl text-center border ${
                      i === 0 ? 'bg-gradient-to-b from-yellow-50 to-yellow-100 border-yellow-200' :
                      i === 1 ? 'bg-gradient-to-b from-gray-50 to-gray-100 border-gray-200' :
                      i === 2 ? 'bg-gradient-to-b from-orange-50 to-orange-100 border-orange-200' :
                      'bg-gradient-to-b from-blue-50 to-blue-100 border-blue-200'
                    }`}>
                      <div className="text-2xl mb-2">{prize.badge}</div>
                      <div className="text-sm font-semibold text-gray-600">
                        {typeof prize.position === 'number' ? `${prize.position}${getOrdinal(prize.position)} Place` : prize.position}
                      </div>
                      <div className="text-base font-bold text-gray-900 mt-1">{prize.amount}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organizers */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Host & Organizers</h2>
                <div className="flex items-center gap-4 mb-5 p-4 bg-gray-50 rounded-xl">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    {contest.hostLogo}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{contest.host}</h3>
                    <p className="text-gray-500 text-sm">Main Organizer</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {contest.organizers.map((org, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {org.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">{org.name}</p>
                        <p className="text-xs text-gray-500">{org.role}</p>
                      </div>
                      <a href={`mailto:${org.email}`} className="text-gray-400 hover:text-blue-600 transition-colors">
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-5">
              {/* Stats */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4">Contest Details</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Difficulty', value: contest.difficulty, badge: true },
                    { label: 'Problems', value: contest.problems },
                    { label: 'Duration', value: contest.duration },
                    { label: 'Host', value: contest.host },
                    { label: 'Languages', value: `${contest.languages.length} supported` },
                    { label: 'Entry', value: contest.isFree ? 'Free' : `$${contest.registrationFee}` },
                  ].map(({ label, value, badge }) => (
                    <div key={label} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
                      <span className="text-gray-500 text-sm">{label}</span>
                      {badge
                        ? <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(value)}`}>{value}</span>
                        : <span className="font-medium text-gray-900 text-sm">{value}</span>
                      }
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-1.5">
                  {[
                    { label: 'View Problems', icon: FileText, color: 'text-blue-600', tab: 'problems' },
                    { label: 'Leaderboard', icon: BarChart, color: 'text-green-600', tab: 'leaderboard' },
                    { label: 'Schedule', icon: Calendar, color: 'text-purple-600', tab: 'schedule' },
                    { label: 'Resources', icon: BookOpen, color: 'text-orange-600', tab: 'resources' },
                  ].map(({ label, icon: Icon, color, tab }) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group">
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${color}`} />
                        <span className="text-sm font-medium text-gray-700">{label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Registration Progress */}
              {contest.status === 'upcoming' && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-900 mb-3">Registration Status</h3>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-600">{contest.totalParticipants} registered</span>
                      <span className="font-medium text-gray-900">{contest.maxParticipants} max</span>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full transition-all" style={{ width: `${(contest.totalParticipants / contest.maxParticipants) * 100}%` }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5">{contest.maxParticipants - contest.totalParticipants} spots remaining</p>
                  </div>
                  {!isRegistered && (
                    <Link to={`/dashboard/contests/${id}/register`} className="block w-full text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors text-sm">
                      Register Now →
                    </Link>
                  )}
                </div>
              )}

              {/* Languages */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-3">Supported Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {contest.languages.map((lang, i) => (
                    <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">{lang}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PROBLEMS ── */}
        {activeTab === 'problems' && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Contest Problems</h2>
              <span className="text-sm text-gray-500">{mockProblems.length} problems total</span>
            </div>
            <div className="space-y-3">
              {mockProblems.map((problem) => (
                <div key={problem.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow hover:border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold text-gray-500">
                        {problem.id}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{problem.title}</h3>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getDifficultyColor(problem.difficulty)}`}>{problem.difficulty}</span>
                          <span className="text-xs text-gray-500">{problem.points} pts</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{problem.solved} solved</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{problem.successRate}% success</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Solve
                    </button>
                  </div>
                  <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${problem.successRate}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── LEADERBOARD ── */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Leaderboard</h2>
              <span className="text-sm text-gray-500">Updated live</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 rounded-xl">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-l-xl">Rank</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Participant</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Solved</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-r-xl">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockLeaderboard.map((entry) => (
                    <tr key={entry.rank} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-gray-700">
                        {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{entry.country}</span>
                          <span className="font-medium text-gray-900">{entry.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-blue-600">{entry.score}</td>
                      <td className="py-3.5 px-4 text-gray-700">{entry.solved}/{mockProblems.length}</td>
                      <td className="py-3.5 px-4 text-gray-500">{entry.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── SCHEDULE ── */}
        {activeTab === 'schedule' && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Contest Schedule</h2>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
              <div className="space-y-6">
                {(contest.schedule || []).map((item, i) => (
                  <div key={i} className="flex items-start gap-5 relative">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl flex-shrink-0 z-10 border-4 border-white">
                      {item.icon}
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-sm text-blue-600 font-semibold">{item.time}</p>
                      <p className="font-medium text-gray-900 mt-0.5">{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── RESOURCES ── */}
        {activeTab === 'resources' && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Resources & Downloads</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(contest.resources || []).map((res, i) => {
                const Icon = res.icon || FileText;
                return (
                  <div key={i} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow hover:border-blue-200">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{res.name}</h3>
                    <p className="text-xs text-gray-500 uppercase mb-4">{res.type}</p>
                    <button className="w-full py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                      <Download className="w-4 h-4" /> Download
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── FAQ ── */}
        {activeTab === 'faq' && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {(contest.faq || []).map((item, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-5 hover:border-blue-200 transition-colors">
                  <h3 className="font-semibold text-gray-900 flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    {item.question}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2 ml-8 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestDetail;