// src/pages/ContestLeaderboard.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Trophy, Award, TrendingUp, Filter, Search,
  ChevronUp, ChevronDown, Users, Clock, Star,
  Target, TrendingDown, Shield, Crown, Medal
} from 'lucide-react';

const ContestLeaderboard = () => {
  const { id } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [filteredLeaderboard, setFilteredLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rank');
  const [sortOrder, setSortOrder] = useState('asc');
  const [userRank, setUserRank] = useState({ rank: 42, score: 750 });

  // Mock leaderboard data
  const mockLeaderboard = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    rank: i + 1,
    name: `User${1000 + i}`,
    username: `user${1000 + i}`,
    score: Math.floor(Math.random() * 2000) + 100,
    problemsSolved: Math.floor(Math.random() * 10) + 1,
    totalTime: Math.floor(Math.random() * 300) + 60,
    penalty: Math.floor(Math.random() * 50),
    country: ['US', 'IN', 'CN', 'RU', 'BR', 'JP', 'DE', 'FR', 'KR', 'CA'][i % 10],
    isCurrentUser: i === 41 // Mock user at rank 42
  }));

  // Sort by rank for initial display
  mockLeaderboard.sort((a, b) => a.rank - b.rank);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLeaderboard(mockLeaderboard);
      setFilteredLeaderboard(mockLeaderboard);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    let filtered = [...leaderboard];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      const hoursAgo = parseInt(timeFilter);
      filtered = filtered.filter(user => {
        // Mock time logic - in real app would filter by submission time
        return Math.random() > 0.3; // Random filter for demo
      });
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch(sortBy) {
        case 'rank':
          aValue = a.rank;
          bValue = b.rank;
          break;
        case 'score':
          aValue = a.score;
          bValue = b.score;
          break;
        case 'problems':
          aValue = a.problemsSolved;
          bValue = b.problemsSolved;
          break;
        case 'time':
          aValue = a.totalTime;
          bValue = b.totalTime;
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredLeaderboard(filtered);
  }, [leaderboard, searchQuery, timeFilter, sortBy, sortOrder]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
          <Crown className="w-5 h-5 text-white" />
        </div>
      );
    } else if (rank === 2) {
      return (
        <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
          <Medal className="w-5 h-5 text-white" />
        </div>
      );
    } else if (rank === 3) {
      return (
        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
          <Medal className="w-5 h-5 text-white" />
        </div>
      );
    } else if (rank <= 10) {
      return (
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          {rank}
        </div>
      );
    } else if (rank <= 50) {
      return (
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
          {rank}
        </div>
      );
    } else {
      return (
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold">
          {rank}
        </div>
      );
    }
  };

  const getCountryFlag = (countryCode) => {
    const flags = {
      'US': '🇺🇸',
      'IN': '🇮🇳',
      'CN': '🇨🇳',
      'RU': '🇷🇺',
      'BR': '🇧🇷',
      'JP': '🇯🇵',
      'DE': '🇩🇪',
      'FR': '🇫🇷',
      'KR': '🇰🇷',
      'CA': '🇨🇦'
    };
    return flags[countryCode] || '🏳️';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-8 h-8 text-yellow-300" />
                <h1 className="text-3xl font-bold">Contest Leaderboard</h1>
              </div>
              <p className="text-white/90 mb-6">
                Real-time rankings for Code Challenge 2024. Compete with the best!
              </p>
              
              {/* User Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">#{userRank.rank}</span>
                    </div>
                    <div>
                      <p className="font-bold">Your Rank</p>
                      <p className="text-white/80 text-sm">Out of {leaderboard.length} participants</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-8 h-8 text-green-300" />
                    <div>
                      <p className="font-bold">{userRank.score}</p>
                      <p className="text-white/80 text-sm">Total Score</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-8 h-8 text-yellow-300" />
                    <div>
                      <p className="font-bold">+5</p>
                      <p className="text-white/80 text-sm">Rank Change</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-8 h-8 text-blue-300" />
                    <div>
                      <p className="font-bold">{leaderboard.length}</p>
                      <p className="text-white/80 text-sm">Participants</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="container mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search participants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="1">Last Hour</option>
                <option value="24">Last 24 Hours</option>
                <option value="168">Last Week</option>
              </select>
              
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="container mx-auto px-4 pb-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('rank')}
                      className="flex items-center gap-2 font-semibold text-gray-700 hover:text-gray-900"
                    >
                      Rank
                      {sortBy === 'rank' && (
                        sortOrder === 'asc' ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="font-semibold text-gray-700">Participant</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('score')}
                      className="flex items-center gap-2 font-semibold text-gray-700 hover:text-gray-900"
                    >
                      Score
                      {sortBy === 'score' && (
                        sortOrder === 'asc' ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('problems')}
                      className="flex items-center gap-2 font-semibold text-gray-700 hover:text-gray-900"
                    >
                      Problems Solved
                      {sortBy === 'problems' && (
                        sortOrder === 'asc' ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('time')}
                      className="flex items-center gap-2 font-semibold text-gray-700 hover:text-gray-900"
                    >
                      Time
                      {sortBy === 'time' && (
                        sortOrder === 'asc' ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="font-semibold text-gray-700">Country</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeaderboard.map((participant) => (
                  <tr 
                    key={participant.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      participant.isCurrentUser ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getRankBadge(participant.rank)}
                        {participant.rank <= 3 && (
                          <div className="flex items-center gap-1">
                            {participant.rank === 1 && (
                              <span className="text-yellow-500 font-bold">🥇</span>
                            )}
                            {participant.rank === 2 && (
                              <span className="text-gray-400 font-bold">🥈</span>
                            )}
                            {participant.rank === 3 && (
                              <span className="text-orange-500 font-bold">🥉</span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {participant.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{participant.name}</p>
                          <p className="text-sm text-gray-500">@{participant.username}</p>
                        </div>
                        {participant.isCurrentUser && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">{participant.score}</span>
                        <span className={`text-sm font-medium flex items-center gap-1 ${
                          participant.score > 1500 ? 'text-green-600' :
                          participant.score > 1000 ? 'text-blue-600' :
                          'text-gray-600'
                        }`}>
                          {participant.score > 1500 ? 
                            <TrendingUp className="w-4 h-4" /> :
                            <TrendingDown className="w-4 h-4" />
                          }
                          {participant.score > 1500 ? 'Expert' :
                           participant.score > 1000 ? 'Advanced' : 'Intermediate'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <span className="text-lg font-bold text-gray-900">{participant.problemsSolved}</span>
                          <div className="text-xs text-gray-500">solved</div>
                        </div>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(participant.problemsSolved / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{participant.totalTime}m</span>
                        <span className="text-sm text-gray-500">({participant.penalty} penalty)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getCountryFlag(participant.country)}</span>
                        <span className="text-gray-700">{participant.country}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">1-{filteredLeaderboard.length}</span> of{' '}
              <span className="font-medium">{leaderboard.length}</span> participants
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                1
              </button>
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50">
                3
              </button>
              <span className="px-2">...</span>
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50">
                10
              </button>
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gold */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">1st Place</h3>
                <p className="text-yellow-700">Gold Medal</p>
              </div>
            </div>
            {leaderboard[0] && (
              <div className="bg-white/80 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                    {leaderboard[0].name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{leaderboard[0].name}</p>
                    <p className="text-sm text-gray-600">@{leaderboard[0].username}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-700">{leaderboard[0].score}</p>
                    <p className="text-sm text-gray-600">Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-700">{leaderboard[0].problemsSolved}</p>
                    <p className="text-sm text-gray-600">Problems</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Silver */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                <Medal className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">2nd Place</h3>
                <p className="text-gray-700">Silver Medal</p>
              </div>
            </div>
            {leaderboard[1] && (
              <div className="bg-white/80 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white font-bold">
                    {leaderboard[1].name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{leaderboard[1].name}</p>
                    <p className="text-sm text-gray-600">@{leaderboard[1].username}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-700">{leaderboard[1].score}</p>
                    <p className="text-sm text-gray-600">Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-700">{leaderboard[1].problemsSolved}</p>
                    <p className="text-sm text-gray-600">Problems</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Bronze */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <Medal className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">3rd Place</h3>
                <p className="text-orange-700">Bronze Medal</p>
              </div>
            </div>
            {leaderboard[2] && (
              <div className="bg-white/80 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {leaderboard[2].name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{leaderboard[2].name}</p>
                    <p className="text-sm text-gray-600">@{leaderboard[2].username}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-700">{leaderboard[2].score}</p>
                    <p className="text-sm text-gray-600">Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-700">{leaderboard[2].problemsSolved}</p>
                    <p className="text-sm text-gray-600">Problems</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestLeaderboard;