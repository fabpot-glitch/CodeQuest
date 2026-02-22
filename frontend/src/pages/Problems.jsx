import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Play, Heart, Lightbulb, BarChart2, Star, Target,
  ChevronDown, Flame, Zap, Trophy, CheckCircle
} from 'lucide-react';

const allProblems = [
  { id: 1, title: 'Two Sum', difficulty: 'Easy', category: 'Arrays', acceptance: '45%', likes: 1234, companies: ['Google', 'Amazon'], hints: 3 },
  { id: 2, title: 'Add Two Numbers', difficulty: 'Medium', category: 'Linked List', acceptance: '38%', likes: 987, companies: ['Meta', 'Apple'], hints: 2 },
  { id: 3, title: 'Longest Substring Without Repeating', difficulty: 'Medium', category: 'Strings', acceptance: '32%', likes: 2103, companies: ['Google', 'Microsoft'], hints: 4 },
  { id: 4, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', category: 'Arrays', acceptance: '28%', likes: 1567, companies: ['Amazon', 'Netflix'], hints: 2 },
  { id: 5, title: 'Valid Parentheses', difficulty: 'Easy', category: 'Stack', acceptance: '42%', likes: 1890, companies: ['Meta', 'Google'], hints: 1 },
  { id: 6, title: 'Merge K Sorted Lists', difficulty: 'Hard', category: 'Linked List', acceptance: '25%', likes: 1432, companies: ['Amazon', 'Apple'], hints: 3 },
  { id: 7, title: 'Binary Search', difficulty: 'Easy', category: 'Searching', acceptance: '55%', likes: 2341, companies: ['Google', 'Microsoft'], hints: 1 },
  { id: 8, title: 'Climbing Stairs', difficulty: 'Easy', category: 'Dynamic Programming', acceptance: '48%', likes: 1678, companies: ['Amazon', 'Adobe'], hints: 2 },
  { id: 9, title: 'House Robber', difficulty: 'Medium', category: 'Dynamic Programming', acceptance: '35%', likes: 1234, companies: ['Netflix', 'Uber'], hints: 3 },
  { id: 10, title: 'Coin Change', difficulty: 'Medium', category: 'Dynamic Programming', acceptance: '40%', likes: 1890, companies: ['Amazon', 'Google'], hints: 4 },
  { id: 11, title: 'Maximum Subarray', difficulty: 'Medium', category: 'Arrays', acceptance: '47%', likes: 2567, companies: ['Microsoft', 'Apple'], hints: 2 },
  { id: 12, title: 'Reverse Linked List', difficulty: 'Easy', category: 'Linked List', acceptance: '69%', likes: 3421, companies: ['Meta', 'Amazon'], hints: 1 },
  { id: 13, title: 'Palindrome Number', difficulty: 'Easy', category: 'Strings', acceptance: '52%', likes: 1456, companies: ['Google', 'Tesla'], hints: 2 },
  { id: 14, title: 'Roman to Integer', difficulty: 'Easy', category: 'Strings', acceptance: '58%', likes: 1789, companies: ['Apple', 'Adobe'], hints: 2 },
  { id: 15, title: 'Longest Common Prefix', difficulty: 'Easy', category: 'Strings', acceptance: '41%', likes: 1234, companies: ['Amazon', 'Microsoft'], hints: 3 },
  { id: 16, title: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', category: 'Arrays', acceptance: '49%', likes: 1876, companies: ['Meta', 'Netflix'], hints: 1 },
  { id: 17, title: 'Remove Element', difficulty: 'Easy', category: 'Arrays', acceptance: '51%', likes: 1342, companies: ['Google', 'Uber'], hints: 2 },
  { id: 18, title: 'Search Insert Position', difficulty: 'Easy', category: 'Searching', acceptance: '43%', likes: 2109, companies: ['Amazon', 'Apple'], hints: 1 },
  { id: 19, title: 'Length of Last Word', difficulty: 'Easy', category: 'Strings', acceptance: '39%', likes: 987, companies: ['Microsoft', 'Adobe'], hints: 2 },
  { id: 20, title: 'Plus One', difficulty: 'Easy', category: 'Arrays', acceptance: '44%', likes: 1654, companies: ['Google', 'Meta'], hints: 1 },
  { id: 21, title: 'Sqrt(x)', difficulty: 'Easy', category: 'Searching', acceptance: '36%', likes: 1432, companies: ['Amazon', 'Netflix'], hints: 3 },
  { id: 22, title: 'Merge Sorted Array', difficulty: 'Easy', category: 'Arrays', acceptance: '46%', likes: 2876, companies: ['Apple', 'Microsoft'], hints: 1 },
  { id: 23, title: 'Binary Tree Inorder Traversal', difficulty: 'Easy', category: 'Trees', acceptance: '71%', likes: 3214, companies: ['Google', 'Amazon'], hints: 2 },
  { id: 24, title: 'Same Tree', difficulty: 'Easy', category: 'Trees', acceptance: '57%', likes: 1987, companies: ['Meta', 'Apple'], hints: 1 },
  { id: 25, title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', category: 'Trees', acceptance: '73%', likes: 4123, companies: ['Google', 'Microsoft'], hints: 1 },
  { id: 26, title: 'Symmetric Tree', difficulty: 'Easy', category: 'Trees', acceptance: '54%', likes: 2765, companies: ['Amazon', 'Adobe'], hints: 2 },
  { id: 27, title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', category: 'Arrays', acceptance: '53%', likes: 3987, companies: ['Netflix', 'Uber'], hints: 2 },
  { id: 28, title: 'Valid Palindrome', difficulty: 'Easy', category: 'Strings', acceptance: '44%', likes: 2341, companies: ['Meta', 'Google'], hints: 1 },
  { id: 29, title: 'Single Number', difficulty: 'Easy', category: 'Arrays', acceptance: '70%', likes: 3654, companies: ['Apple', 'Amazon'], hints: 2 },
  { id: 30, title: 'Linked List Cycle', difficulty: 'Easy', category: 'Linked List', acceptance: '48%', likes: 2876, companies: ['Microsoft', 'Netflix'], hints: 3 },
  { id: 31, title: 'Intersection of Two Linked Lists', difficulty: 'Easy', category: 'Linked List', acceptance: '52%', likes: 2109, companies: ['Google', 'Meta'], hints: 2 },
  { id: 32, title: 'Min Stack', difficulty: 'Medium', category: 'Stack', acceptance: '50%', likes: 2987, companies: ['Amazon', 'Apple'], hints: 3 },
  { id: 33, title: 'Find Peak Element', difficulty: 'Medium', category: 'Searching', acceptance: '46%', likes: 1876, companies: ['Google', 'Adobe'], hints: 2 },
  { id: 34, title: 'Majority Element', difficulty: 'Easy', category: 'Arrays', acceptance: '63%', likes: 3421, companies: ['Microsoft', 'Uber'], hints: 1 },
  { id: 35, title: 'Happy Number', difficulty: 'Easy', category: 'Math', acceptance: '54%', likes: 1654, companies: ['Netflix', 'Tesla'], hints: 2 },
  { id: 36, title: 'Remove Linked List Elements', difficulty: 'Easy', category: 'Linked List', acceptance: '43%', likes: 1987, companies: ['Amazon', 'Google'], hints: 2 },
  { id: 37, title: 'Contains Duplicate', difficulty: 'Easy', category: 'Arrays', acceptance: '61%', likes: 2765, companies: ['Apple', 'Meta'], hints: 1 },
  { id: 38, title: 'Invert Binary Tree', difficulty: 'Easy', category: 'Trees', acceptance: '74%', likes: 4567, companies: ['Google', 'Microsoft'], hints: 1 },
  { id: 39, title: 'Power of Two', difficulty: 'Easy', category: 'Math', acceptance: '46%', likes: 1432, companies: ['Amazon', 'Adobe'], hints: 2 },
  { id: 40, title: 'Valid Anagram', difficulty: 'Easy', category: 'Strings', acceptance: '62%', likes: 3214, companies: ['Netflix', 'Uber'], hints: 1 },
  { id: 41, title: 'Binary Tree Paths', difficulty: 'Easy', category: 'Trees', acceptance: '58%', likes: 2109, companies: ['Meta', 'Apple'], hints: 2 },
  { id: 42, title: 'Move Zeroes', difficulty: 'Easy', category: 'Arrays', acceptance: '61%', likes: 2876, companies: ['Google', 'Amazon'], hints: 1 },
  { id: 43, title: 'Word Pattern', difficulty: 'Easy', category: 'Strings', acceptance: '40%', likes: 1654, companies: ['Microsoft', 'Tesla'], hints: 3 },
  { id: 44, title: 'Reverse String', difficulty: 'Easy', category: 'Strings', acceptance: '77%', likes: 3987, companies: ['Apple', 'Adobe'], hints: 1 },
  { id: 45, title: 'Intersection of Two Arrays', difficulty: 'Easy', category: 'Arrays', acceptance: '71%', likes: 2341, companies: ['Amazon', 'Netflix'], hints: 2 },
  { id: 46, title: 'Is Subsequence', difficulty: 'Easy', category: 'Strings', acceptance: '50%', likes: 1987, companies: ['Google', 'Meta'], hints: 2 },
  { id: 47, title: 'Sum of Left Leaves', difficulty: 'Easy', category: 'Trees', acceptance: '56%', likes: 1765, companies: ['Microsoft', 'Uber'], hints: 2 },
  { id: 48, title: 'Find All Numbers Disappeared', difficulty: 'Easy', category: 'Arrays', acceptance: '58%', likes: 2109, companies: ['Apple', 'Amazon'], hints: 3 },
  { id: 49, title: 'Assign Cookies', difficulty: 'Easy', category: 'Greedy', acceptance: '51%', likes: 1432, companies: ['Google', 'Adobe'], hints: 2 },
  { id: 50, title: 'Hamming Distance', difficulty: 'Easy', category: 'Math', acceptance: '73%', likes: 2876, companies: ['Meta', 'Netflix'], hints: 1 },
];

const categories = ['All', 'Arrays', 'Strings', 'Linked List', 'Trees', 'Stack', 'Searching', 'Dynamic Programming', 'Math', 'Greedy'];
const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

const getSolvedIds = () => {
  try {
    const data = localStorage.getItem('completedProblems');
    return data ? JSON.parse(data).ids || [] : [];
  } catch {
    return [];
  }
};

const difficultyColor = (d) => {
  if (d === 'Easy') return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' };
  if (d === 'Medium') return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' };
  return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' };
};

const Problems = () => {
  const navigate = useNavigate();
  const [solvedIds, setSolvedIds] = useState(() => getSolvedIds());
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('Default');
  const [quickFilter, setQuickFilter] = useState('All');
  const [likedSet, setLikedSet] = useState(new Set());

  const toggleLike = (id, e) => {
    e.stopPropagation();
    setLikedSet(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    let list = [...allProblems];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.companies.some(c => c.toLowerCase().includes(q))
      );
    }
    if (category !== 'All') list = list.filter(p => p.category === category);
    if (difficulty !== 'All') list = list.filter(p => p.difficulty === difficulty);
    if (quickFilter === 'Solved') list = list.filter(p => solvedIds.includes(p.id));
    if (quickFilter === 'Unsolved') list = list.filter(p => !solvedIds.includes(p.id));

    if (sortBy === 'Difficulty') {
      const order = { Easy: 0, Medium: 1, Hard: 2 };
      list.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
    } else if (sortBy === 'Popularity') {
      list.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === 'Acceptance') {
      list.sort((a, b) => parseFloat(b.acceptance) - parseFloat(a.acceptance));
    }
    return list;
  }, [search, category, difficulty, sortBy, quickFilter]);

  const progressPercent = (solvedIds.length / allProblems.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-5">

        {/* ─── Stats Banner ─── */}
        <div className="rounded-2xl overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 25%, #06b6d4 60%, #0ea5e9 100%)' }}>
          <div className="px-6 py-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex gap-3 flex-wrap">
                {/* Day Streak */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 min-w-[120px]">
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-5 h-5 text-orange-400" />
                  </div>
                  <p className="text-white text-2xl font-bold leading-tight">7</p>
                  <p className="text-white/60 text-xs mt-0.5">Day Streak</p>
                </div>
                {/* Total Points */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 min-w-[120px]">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-5 h-5 text-yellow-300" />
                  </div>
                  <p className="text-white text-2xl font-bold leading-tight">2350</p>
                  <p className="text-white/60 text-xs mt-0.5">Total Points</p>
                </div>
                {/* Rank */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 min-w-[120px]">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-5 h-5 text-cyan-300" />
                  </div>
                  <p className="text-white text-2xl font-bold leading-tight">Level 12</p>
                  <p className="text-white/60 text-xs mt-0.5">Your Rank</p>
                </div>
                {/* Weekly Goal */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 min-w-[120px]">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-5 h-5 text-emerald-300" />
                  </div>
                  <p className="text-white text-2xl font-bold leading-tight">12/20</p>
                  <p className="text-white/60 text-xs mt-0.5">Weekly Goal</p>
                </div>
              </div>

              {/* Achievements */}
              <div className="flex items-center gap-3">
                <p className="text-white/70 text-sm font-medium">Achievements:</p>
                <div className="flex gap-1.5">
                  {['🔥', '⚡', '🎯', '💎'].map((icon, i) => (
                    <span key={i} className="text-2xl drop-shadow">{icon}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-5">
              <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, #f59e0b, #10b981, #06b6d4)' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ─── All Problems Header ─── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">All Problems</h2>
            <p className="text-gray-500 text-sm mt-0.5">Practice coding problems and improve your skills</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-50 transition">
            <BarChart2 className="w-4 h-4" />
            Show Details
          </button>
        </div>

        {/* ─── Today's Challenge ─── */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow">
              <Star className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-base">Today's Challenge</p>
              <p className="text-gray-600 text-sm">Solve 3 more problems to maintain your streak!</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-yellow-600">3/5</p>
            <p className="text-gray-500 text-xs">Solved Today</p>
          </div>
        </div>

        {/* ─── Search / Filter / Sort ─── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5 space-y-4">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[240px]">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Search Problems</label>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by title, company, or topic..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
            </div>

            {/* Category */}
            <div className="min-w-[180px]">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Category</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 cursor-pointer transition"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Difficulty */}
            <div className="min-w-[180px]">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Difficulty</label>
              <div className="relative">
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 cursor-pointer transition"
                >
                  {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Quick Filters + Sort */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-gray-500">Quick Filters:</span>
              {['All', 'Solved', 'Unsolved'].map(f => (
                <button
                  key={f}
                  onClick={() => setQuickFilter(f)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition border ${
                    quickFilter === f
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {f === 'Solved' && <CheckCircle className="w-3 h-3" />}
                  {f}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="appearance-none pl-3 pr-7 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 bg-white focus:outline-none focus:border-blue-400 cursor-pointer transition"
                >
                  {['Default', 'Difficulty', 'Popularity', 'Acceptance'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* ─── Problem Cards Grid ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(problem => {
            const dc = difficultyColor(problem.difficulty);
            const isSolved = solvedIds.includes(problem.id);
            const isLiked = likedSet.has(problem.id);

            return (
              <div
                key={problem.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
              >
                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Title Row */}
                  <div className="flex items-start justify-between mb-3">
                    <h3
                      className="font-bold text-gray-900 text-base leading-snug cursor-pointer hover:text-blue-600 transition"
                      onClick={() => navigate(`/dashboard/problems/${problem.id}`)}
                    >
                      {problem.id}. {problem.title}
                    </h3>
                    {isSolved && (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                    )}
                  </div>

                  {/* Pills: Difficulty + Category */}
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${dc.bg} ${dc.text} ${dc.border}`}>
                      {problem.difficulty}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {problem.category}
                    </span>
                  </div>

                  {/* Stats: Acceptance & Likes */}
                  <div className="flex gap-3 mb-4">
                    <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-0.5">Acceptance</p>
                      <p className="text-sm font-bold text-gray-800">{problem.acceptance}</p>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 flex items-center gap-1 mb-0.5">
                        <Heart className="w-3 h-3" /> Likes
                      </p>
                      <p className="text-sm font-bold text-gray-800">{problem.likes.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Companies */}
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {problem.companies.map((c, i) => (
                      <span key={i} className="text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full">
                        {c}
                      </span>
                    ))}
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />
                </div>

                {/* Card Footer: Start + Heart + Hint */}
                <div className="px-5 pb-5">
                  <div className="flex items-center gap-2">
                    {/* Start Button */}
                    <button
                      onClick={() => navigate(`/dashboard/problems/${problem.id}/solve`)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-bold shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                      style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}
                    >
                      <Play className="w-4 h-4 fill-white" />
                      Start
                    </button>

                    {/* Heart */}
                    <button
                      onClick={(e) => toggleLike(problem.id, e)}
                      className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition"
                    >
                      <Heart
                        className={`w-4.5 h-4.5 transition ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
                        style={{ width: 18, height: 18 }}
                      />
                    </button>

                    {/* Hint with badge */}
                    <div className="relative">
                      <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-yellow-50 hover:border-yellow-200 transition">
                        <Lightbulb className="text-gray-400" style={{ width: 18, height: 18 }} />
                      </button>
                      <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow"
                        style={{ width: 18, height: 18, fontSize: 10 }}>
                        {problem.hints}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Footer ─── */}
        <div className="text-center py-4">
          <p className="text-gray-400 text-sm">Updated daily • Showing {filtered.length} of {allProblems.length} problems</p>
        </div>
      </div>
    </div>
  );
};

export default Problems;