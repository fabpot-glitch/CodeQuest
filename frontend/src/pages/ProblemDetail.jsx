import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, BookOpen, Code, Send, Eye, EyeOff, ChevronRight, Lightbulb, ThumbsUp, Share2, Flag } from 'lucide-react';

// ─── Shared problem database (mirrors ProblemSolver) ────────────────────────
const problemData = {
  1: {
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays',
    acceptance: '45%',
    likes: 1234,
    companies: ['Google', 'Amazon'],
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    hints: [
      'A really brute force way would be to search for all possible pairs of numbers but that would be too slow.',
      'Use a hash table to store the complement of each number as you iterate through the array.',
      'The complement is target - nums[i]. Check if it exists in the hash table.'
    ]
  },
  2: {
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    category: 'Linked Lists',
    acceptance: '40%',
    likes: 987,
    companies: ['Microsoft', 'Facebook'],
    description: `You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.`,
    examples: [
      {
        input: 'l1 = [2,4,3], l2 = [5,6,4]',
        output: '[7,0,8]',
        explanation: '342 + 465 = 807.'
      }
    ],
    constraints: [
      'The number of nodes in each linked list is in the range [1, 100].',
      '0 <= Node.val <= 9',
      'It is guaranteed that the list represents a number that does not have leading zeros.'
    ],
    hints: [
      'Traverse both linked lists simultaneously, adding corresponding digits.',
      'Keep track of the carry value as you go.',
      'Don\'t forget to handle the final carry if it exists.'
    ]
  },
  3: {
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Strings',
    acceptance: '33%',
    likes: 876,
    companies: ['Amazon', 'Google', 'Microsoft'],
    description: `Given a string s, find the length of the longest substring without repeating characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      }
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    hints: [
      'Use a sliding window approach.',
      'Maintain a set of characters in the current window.',
      'When a duplicate is found, shrink the window from the left.'
    ]
  }
};

const ProblemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const problem = problemData[id] || problemData[1];

  const [activeTab, setActiveTab] = useState('description');
  const [showHints, setShowHints] = useState(false);
  const [revealedHints, setRevealedHints] = useState([]);
  const [liked, setLiked] = useState(false);

  const revealHint = (index) => {
    if (!revealedHints.includes(index)) {
      setRevealedHints([...revealedHints, index]);
    }
  };

  const handleStart = () => {
    navigate(`/dashboard/problems/${id}/solve`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50" style={{ fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* Top Bar */}
      <div className="bg-white border-b-2 border-gray-200 px-6 py-4 shadow-sm sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard/problems')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all font-semibold text-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="h-8 w-px bg-gray-300"></div>
            <h1 className="text-xl font-bold text-gray-900">{id}. {problem.title}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              problem.difficulty === 'Easy'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : problem.difficulty === 'Medium'
                ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
              {problem.difficulty}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 border border-blue-300">
              {problem.category}
            </span>
          </div>

          {/* Start Solve Button */}
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
          >
            <Play className="w-5 h-5" />
            Start Solving
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-8">

        {/* Stats Row */}
        <div className="flex items-center gap-6 mb-8 flex-wrap">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-sm font-semibold">Acceptance:</span>
            <span className="text-sm font-bold text-gray-900">{problem.acceptance}</span>
          </div>
          <div className="h-4 w-px bg-gray-300"></div>
          <button
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-2 transition-all ${liked ? 'text-red-500' : 'text-gray-600 hover:text-red-400'}`}
          >
            <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-red-500' : ''}`} />
            <span className="text-sm font-semibold">{liked ? problem.likes + 1 : problem.likes}</span>
          </button>
          <div className="h-4 w-px bg-gray-300"></div>
          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-all">
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-semibold">Share</span>
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-all">
            <Flag className="w-4 h-4" />
            <span className="text-sm font-semibold">Report</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b-2 border-gray-200">
          {['description', 'solutions', 'discuss'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600 -mb-[2px]'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab === 'description' && <BookOpen className="w-4 h-4 inline mr-2" />}
              {tab === 'solutions' && <Code className="w-4 h-4 inline mr-2" />}
              {tab === 'discuss' && <Send className="w-4 h-4 inline mr-2" />}
              {tab}
            </button>
          ))}
        </div>

        {/* Description Tab */}
        {activeTab === 'description' && (
          <div className="space-y-8">

            {/* Problem Statement */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Problem Statement</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base">{problem.description}</p>
            </div>

            {/* Examples */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Examples</h2>
              {problem.examples.map((example, idx) => (
                <div key={idx} className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5 mb-4">
                  <p className="text-sm font-bold text-gray-900 mb-3">Example {idx + 1}:</p>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-semibold text-gray-600">Input: </span>
                      <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">{example.input}</code>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-gray-600">Output: </span>
                      <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">{example.output}</code>
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Explanation: </span>{example.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Constraints</h2>
              <ul className="space-y-3">
                {problem.constraints.map((constraint, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <code className="text-sm bg-gray-100 px-3 py-1 rounded text-gray-800">{constraint}</code>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hints */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Hints</h2>
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg transition-all font-semibold text-sm border border-yellow-300"
                >
                  {showHints ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showHints ? 'Hide Hints' : 'Show Hints'}
                </button>
              </div>

              {showHints && (
                <div className="space-y-3">
                  {problem.hints.map((hint, idx) => (
                    <div key={idx}>
                      {revealedHints.includes(idx) ? (
                        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-bold text-yellow-700 mb-1">Hint {idx + 1}</p>
                              <p className="text-sm text-gray-700">{hint}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => revealHint(idx)}
                          className="w-full bg-gray-50 hover:bg-yellow-50 border-2 border-gray-200 hover:border-yellow-300 rounded-xl p-4 transition-all text-left"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-700">Hint {idx + 1}</span>
                            <span className="text-sm text-gray-400 hover:text-yellow-600 transition-colors">Click to reveal →</span>
                          </div>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Companies */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Asked By</h2>
              <div className="flex gap-3 flex-wrap">
                {problem.companies.map((company, idx) => (
                  <span key={idx} className="bg-purple-50 text-purple-700 px-5 py-2 rounded-lg font-semibold border border-purple-200">
                    {company}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA at bottom */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 text-center shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-2">Ready to solve?</h3>
              <p className="text-blue-100 mb-6">Open the editor and start coding your solution.</p>
              <button
                onClick={handleStart}
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-md hover:shadow-lg"
              >
                <Play className="w-5 h-5" />
                Start Solving
              </button>
            </div>
          </div>
        )}

        {/* Solutions Tab */}
        {activeTab === 'solutions' && (
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-sm text-center">
            <Code className="w-14 h-14 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Solutions Unlocked After Solving</h3>
            <p className="text-sm text-gray-500 mb-6">Submit a correct solution to unlock community solutions and editorial.</p>
            <button
              onClick={handleStart}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all"
            >
              <Play className="w-4 h-4" />
              Go to Editor
            </button>
          </div>
        )}

        {/* Discuss Tab */}
        {activeTab === 'discuss' && (
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-sm text-center">
            <Send className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Discussion Coming Soon</h3>
            <p className="text-sm text-gray-500">Community discussions for this problem will be available soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDetail;