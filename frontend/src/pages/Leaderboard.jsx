import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Crown,
  Medal,
  TrendingUp,
  TrendingDown,
  Minus,
  Flame,
  Zap,
  Target,
  Award,
  Filter,
  Search,
  Calendar,
  Users,
  Star,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  Download,
  Globe,
  Code,
  Clock
} from 'lucide-react';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('all-time');
  const [sortBy, setSortBy] = useState('points');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const user = { username: 'alice_codes' };

  const mockLeaderboardData = [
    { rank: 1, prevRank: 2, name: 'Alice Chen', username: 'alice_codes', avatar: '👩‍💻', solved: 342, points: 18650, streak: 45, accuracy: 94.5, country: 'USA', university: 'MIT', badges: ['🥇', '🔥', '⚡'], recentActivity: '2 hours ago', tier: 'platinum', level: 42 },
    { rank: 2, prevRank: 1, name: 'Bob Kumar', username: 'bob_dev', avatar: '👨‍💻', solved: 298, points: 16240, streak: 32, accuracy: 91.2, country: 'India', university: 'IIT Delhi', badges: ['🥈', '🎯', '💎'], recentActivity: '5 hours ago', tier: 'platinum', level: 39 },
    { rank: 3, prevRank: 3, name: 'Carol Wang', username: 'carol_w', avatar: '🧑‍💻', solved: 276, points: 14760, streak: 28, accuracy: 89.8, country: 'China', university: 'Tsinghua', badges: ['🥉', '🌟', '🚀'], recentActivity: '1 hour ago', tier: 'gold', level: 36 },
    { rank: 4, prevRank: 5, name: 'David Park', username: 'd_park', avatar: '👨‍🔬', solved: 265, points: 14020, streak: 21, accuracy: 88.5, country: 'South Korea', university: 'KAIST', badges: ['🏅', '⭐', '🔮'], recentActivity: '3 hours ago', tier: 'gold', level: 35 },
    { rank: 5, prevRank: 4, name: 'Emma Silva', username: 'emma_codes', avatar: '👩‍🔬', solved: 252, points: 13150, streak: 19, accuracy: 87.3, country: 'Brazil', university: 'USP', badges: ['🎖️', '💫', '🌈'], recentActivity: '30 mins ago', tier: 'gold', level: 33 },
    { rank: 6, prevRank: 7, name: 'Frank Johnson', username: 'frank_j', avatar: '🧑‍🎓', solved: 245, points: 12670, streak: 15, accuracy: 86.1, country: 'UK', university: 'Oxford', badges: ['🏆', '✨', '🎨'], recentActivity: '1 day ago', tier: 'silver', level: 31 },
    { rank: 7, prevRank: 6, name: 'Grace Lee', username: 'grace_codes', avatar: '👩‍🎨', solved: 234, points: 11940, streak: 12, accuracy: 85.4, country: 'Singapore', university: 'NUS', badges: ['🎭', '💪', '🌟'], recentActivity: '4 hours ago', tier: 'silver', level: 29 },
    { rank: 8, prevRank: 8, name: 'Henry Davis', username: 'h_davis', avatar: '👨‍🎓', solved: 228, points: 11540, streak: 10, accuracy: 84.2, country: 'Canada', university: 'UofT', badges: ['🎪', '🎯', '⚡'], recentActivity: '6 hours ago', tier: 'silver', level: 28 },
    { rank: 9, prevRank: 10, name: 'Ivy Martinez', username: 'ivy_m', avatar: '👩‍💼', solved: 215, points: 10890, streak: 8, accuracy: 83.1, country: 'Mexico', university: 'UNAM', badges: ['🎨', '🌸', '🔥'], recentActivity: '2 days ago', tier: 'bronze', level: 26 },
    { rank: 10, prevRank: 9, name: 'Jack Wilson', username: 'jack_w', avatar: '👨‍⚕️', solved: 208, points: 10460, streak: 6, accuracy: 72.5, country: 'Australia', university: 'ANU', badges: ['🎲', '🌊', '💎'], recentActivity: '5 hours ago', tier: 'bronze', level: 25 }
  ];

  useEffect(() => { fetchLeaderboard(); }, [timeFilter]);
  useEffect(() => { filterAndSortData(); }, [searchTerm, sortBy, leaderboardData]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setTimeout(() => {
      setLeaderboardData(mockLeaderboardData);
      setFilteredData(mockLeaderboardData);
      setLoading(false);
    }, 800);
  };

  const filterAndSortData = () => {
    let filtered = [...leaderboardData];
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.university.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'points': return b.points - a.points;
        case 'solved': return b.solved - a.solved;
        case 'streak': return b.streak - a.streak;
        case 'accuracy': return b.accuracy - a.accuracy;
        default: return a.rank - b.rank;
      }
    });
    setFilteredData(filtered);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLeaderboard();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Rank,Name,Username,Solved,Points,Streak,Accuracy\n" +
      filteredData.map(user => `${user.rank},${user.name},${user.username},${user.solved},${user.points},${user.streak},${user.accuracy}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leaderboard.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRankChange = (rank, prevRank) => {
    if (rank < prevRank) return { icon: ChevronUp, color: 'text-green-400', text: `+${prevRank - rank}` };
    if (rank > prevRank) return { icon: ChevronDown, color: 'text-red-400', text: `-${rank - prevRank}` };
    return { icon: Minus, color: 'text-gray-400', text: '0' };
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return { icon: Crown, color: 'text-yellow-400' };
    if (rank === 2) return { icon: Medal, color: 'text-gray-300' };
    if (rank === 3) return { icon: Medal, color: 'text-orange-400' };
    return { icon: Trophy, color: 'text-blue-400' };
  };

  const currentUserRank = leaderboardData.find(u => u.username === user?.username);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Loading leaderboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 mb-3 tracking-tight flex items-center gap-4">
                  <Trophy className="w-12 h-12 text-purple-600" />
                  Global Leaderboard
                </h1>
                <p className="text-lg text-gray-600 font-normal">Compete with the best coders worldwide</p>
              </div>
              <div className="flex gap-3">
                <button onClick={handleRefresh} disabled={isRefreshing} className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded-xl transition-all border border-purple-200 font-medium hover:shadow-md">
                  <RefreshCw className={`w-5 h-5 text-purple-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden md:inline text-purple-700">Refresh</span>
                </button>
                <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-xl transition-all border border-blue-200 font-medium hover:shadow-md">
                  <Download className="w-5 h-5 text-blue-600" />
                  <span className="hidden md:inline text-blue-700">Export</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 flex items-center gap-3 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{leaderboardData.length}</p>
                  <p className="text-xs text-gray-600 font-medium">Total Users</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200 flex items-center gap-3 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <Code className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{leaderboardData.reduce((sum, u) => sum + u.solved, 0)}</p>
                  <p className="text-xs text-gray-600 font-medium">Problems Solved</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200 flex items-center gap-3 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <Flame className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{Math.max(...leaderboardData.map(u => u.streak))}</p>
                  <p className="text-xs text-gray-600 font-medium">Max Streak</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200 flex items-center gap-3 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <Globe className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{new Set(leaderboardData.map(u => u.country)).size}</p>
                  <p className="text-xs text-gray-600 font-medium">Countries</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current User Position */}
        {currentUserRank && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border-2 border-purple-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{currentUserRank.avatar}</div>
                <div>
                  <p className="text-sm text-purple-600 font-semibold">Your Position</p>
                  <p className="text-2xl font-bold text-gray-900">Rank #{currentUserRank.rank}</p>
                </div>
              </div>
              <div className="flex gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{currentUserRank.solved}</p>
                  <p className="text-xs text-gray-600 font-medium">Solved</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{currentUserRank.points}</p>
                  <p className="text-xs text-gray-600 font-medium">Points</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{currentUserRank.streak}</p>
                  <p className="text-xs text-gray-600 font-medium">Streak</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, username, or university..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-normal hover:bg-gray-100 transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium hover:bg-gray-100 transition-colors cursor-pointer">
                <option value="all-time">All Time</option>
                <option value="monthly">This Month</option>
                <option value="weekly">This Week</option>
                <option value="daily">Today</option>
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium hover:bg-gray-100 transition-colors cursor-pointer">
                <option value="points">Points</option>
                <option value="solved">Problems Solved</option>
                <option value="streak">Streak</option>
                <option value="accuracy">Accuracy</option>
              </select>
              <button onClick={() => setShowFilters(!showFilters)} className="px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl transition-all shadow-md hover:shadow-lg text-white">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
          {showFilters && <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200"><p className="text-sm text-gray-600 font-normal">Additional filters can go here...</p></div>}
        </div>

        {/* Top 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 mt-6">
          {filteredData.slice(0, 3).map((userItem, index) => {
            const badge = getRankBadge(userItem.rank);
            const rankChange = getRankChange(userItem.rank, userItem.prevRank);
            const gradientClass = index === 0
              ? 'from-yellow-50 to-yellow-100 border-yellow-300 hover:shadow-yellow-200'
              : index === 1
              ? 'from-gray-50 to-gray-100 border-gray-300 hover:shadow-gray-200'
              : 'from-orange-50 to-orange-100 border-orange-300 hover:shadow-orange-200';
            return (
              <div
                key={userItem.rank}
                className={`relative bg-gradient-to-br ${gradientClass} border-2 rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer`}
              >
                <div className="absolute top-4 right-4 flex items-center gap-2 text-sm font-bold">
                  <badge.icon className={`w-6 h-6 ${badge.color}`} />
                  <span className="text-gray-900">#{userItem.rank}</span>
                </div>
                <div className="text-6xl mb-3">{userItem.avatar}</div>
                <p className="text-xl font-semibold text-gray-900">{userItem.name}</p>
                <p className="text-sm text-gray-600 font-normal">@{userItem.username}</p>
                <div className="flex items-center gap-2 mt-2">
                  <rankChange.icon className={`w-5 h-5 ${rankChange.color}`} />
                  <span className={`${rankChange.color} text-sm font-bold`}>{rankChange.text}</span>
                </div>
                <div className="flex gap-4 mt-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{userItem.solved}</p>
                    <p className="text-xs text-gray-600 font-medium">Solved</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{userItem.points}</p>
                    <p className="text-xs text-gray-600 font-medium">Points</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{userItem.streak}</p>
                    <p className="text-xs text-gray-600 font-medium">Streak</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  {userItem.badges.map((b, idx) => (
                    <span key={idx} className="text-2xl">{b}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-x-auto bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="text-gray-600 text-sm uppercase tracking-wide border-b-2 border-gray-200 font-semibold">
                <th className="px-6 py-3">Rank</th>
                <th className="px-6 py-3">Coder</th>
                <th className="px-6 py-3">Problems Solved</th>
                <th className="px-6 py-3">Points</th>
                <th className="px-6 py-3">Streak</th>
                <th className="px-6 py-3">Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0, 10).map((userItem) => {
                const rankChange = getRankChange(userItem.rank, userItem.prevRank);
                const accuracySymbol =
                  userItem.accuracy >= 90
                    ? '🎯'
                    : userItem.accuracy >= 75
                    ? '✅'
                    : '⚠️';

                return (
                  <tr key={userItem.rank} className="border-b border-gray-200 hover:bg-gray-50 transition-all duration-200 cursor-pointer hover:shadow-md">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-bold text-gray-900">
                        {userItem.rank}
                        <rankChange.icon className={`w-4 h-4 ${rankChange.color}`} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{userItem.avatar}</span>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">{userItem.name}</span>
                          <span className="text-gray-500 text-xs font-normal">@{userItem.username}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{userItem.solved}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{userItem.points}</td>
                    <td className="px-6 py-4 text-orange-600 font-semibold">{userItem.streak}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${userItem.accuracy >= 90 ? 'text-green-600' : userItem.accuracy >= 75 ? 'text-yellow-600' : 'text-orange-600'}`}>
                          {userItem.accuracy}%
                        </span>
                        <span className="text-xl">{accuracySymbol}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.05);
          }
        }
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
};

export default Leaderboard;