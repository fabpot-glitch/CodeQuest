// src/pages/ActiveContest.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock, Code, CheckCircle, XCircle, AlertCircle,
  BarChart, Settings, Save, Play, Terminal,
  ChevronRight, Filter, Search, Eye, Lock, Star
} from 'lucide-react';

const ActiveContest = () => {
  const { id } = useParams();
  const [timeLeft, setTimeLeft] = useState(8 * 60 * 60); // 8 hours in seconds
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  const languages = [
    { value: 'python', label: 'Python 3', icon: '🐍' },
    { value: 'java', label: 'Java', icon: '☕' },
    { value: 'cpp', label: 'C++', icon: '⚡' },
    { value: 'javascript', label: 'JavaScript', icon: '📜' }
  ];

  // Mock problems data
  const mockProblems = [
    {
      id: 1,
      title: 'Two Sum',
      difficulty: 'Easy',
      points: 100,
      status: 'solved',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      constraints: [
        '2 <= nums.length <= 10^4',
        '-10^9 <= nums[i] <= 10^9',
        '-10^9 <= target <= 10^9'
      ],
      examples: [
        {
          input: 'nums = [2,7,11,15], target = 9',
          output: '[0,1]',
          explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
        }
      ],
      testCases: 10,
      timeLimit: '2 seconds',
      memoryLimit: '256 MB'
    },
    {
      id: 2,
      title: 'Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      points: 200,
      status: 'attempted',
      description: 'Given a string s, find the length of the longest substring without repeating characters.',
      constraints: [
        '0 <= s.length <= 5 * 10^4',
        's consists of English letters, digits, symbols and spaces.'
      ],
      examples: [
        {
          input: 's = "abcabcbb"',
          output: '3',
          explanation: 'The answer is "abc", with the length of 3.'
        }
      ],
      testCases: 15,
      timeLimit: '3 seconds',
      memoryLimit: '512 MB'
    },
    {
      id: 3,
      title: 'Median of Two Sorted Arrays',
      difficulty: 'Hard',
      points: 300,
      status: 'unsolved',
      description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
      constraints: [
        'nums1.length == m',
        'nums2.length == n',
        '0 <= m <= 1000',
        '0 <= n <= 1000',
        '1 <= m + n <= 2000',
        '-10^6 <= nums1[i], nums2[i] <= 10^6'
      ],
      examples: [
        {
          input: 'nums1 = [1,3], nums2 = [2]',
          output: '2.00000',
          explanation: 'merged array = [1,2,3] and median is 2.'
        }
      ],
      testCases: 20,
      timeLimit: '5 seconds',
      memoryLimit: '1 GB'
    },
    {
      id: 4,
      title: 'Regular Expression Matching',
      difficulty: 'Hard',
      points: 350,
      status: 'unsolved',
      description: 'Given an input string s and a pattern p, implement regular expression matching with support for "." and "*".',
      constraints: [
        '1 <= s.length <= 20',
        '1 <= p.length <= 30',
        's contains only lowercase English letters.',
        'p contains only lowercase English letters, ".", and "*".',
        'It is guaranteed for each appearance of the character "*", there will be a previous valid character to match.'
      ],
      examples: [
        {
          input: 's = "aa", p = "a"',
          output: 'false',
          explanation: '"a" does not match the entire string "aa".'
        }
      ],
      testCases: 25,
      timeLimit: '10 seconds',
      memoryLimit: '1 GB'
    }
  ];

  // Mock submissions
  const mockSubmissions = [
    { id: 1, problem: 'Two Sum', language: 'Python', time: '2 min ago', status: 'Accepted', score: 100 },
    { id: 2, problem: 'Two Sum', language: 'Python', time: '5 min ago', status: 'Wrong Answer', score: 0 },
    { id: 3, problem: 'Longest Substring', language: 'Java', time: '15 min ago', status: 'Time Limit Exceeded', score: 0 },
    { id: 4, problem: 'Longest Substring', language: 'Python', time: '30 min ago', status: 'Accepted', score: 200 }
  ];

  useEffect(() => {
    setProblems(mockProblems);
    setSelectedProblem(mockProblems[0]);
    setSubmissions(mockSubmissions);
    
    // Initial code template
    setCode(`# Write your solution here
def two_sum(nums, target):
    """
    Given an array of integers nums and an integer target,
    return indices of the two numbers such that they add up to target.
    """
    pass

# Test your solution
if __name__ == "__main__":
    # Example test case
    nums = [2, 7, 11, 15]
    target = 9
    result = two_sum(nums, target)
    print(f"Result: {result}")`);

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('Running code...\n\n');
    
    // Simulate code execution
    setTimeout(() => {
      setOutput(prev => prev + '✓ Test case 1 passed\n✓ Test case 2 passed\n✓ Test case 3 passed\n\nAll test cases passed!');
      setIsRunning(false);
    }, 1500);
  };

  const handleSubmitCode = () => {
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      const newSubmission = {
        id: submissions.length + 1,
        problem: selectedProblem.title,
        language: selectedLanguage,
        time: 'Just now',
        status: 'Accepted',
        score: selectedProblem.points
      };
      
      setSubmissions([newSubmission, ...submissions]);
      
      // Update problem status
      setProblems(problems.map(p => 
        p.id === selectedProblem.id ? { ...p, status: 'solved' } : p
      ));
      
      setSelectedProblem({ ...selectedProblem, status: 'solved' });
      
      setOutput(prev => prev + '\n\n🎉 Submission Accepted! Score: ' + selectedProblem.points);
      setIsSubmitting(false);
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'solved': return 'bg-green-100 text-green-800';
      case 'attempted': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'Hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSubmissionStatusColor = (status) => {
    switch(status) {
      case 'Accepted': return 'text-green-600 bg-green-50';
      case 'Wrong Answer': return 'text-red-600 bg-red-50';
      case 'Time Limit Exceeded': return 'text-orange-600 bg-orange-50';
      case 'Runtime Error': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Code Challenge 2024</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Problems Solved:</span>
                  <span className="font-bold text-green-600">
                    {problems.filter(p => p.status === 'solved').length}/{problems.length}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                to={`/dashboard/contests/${id}/leaderboard`}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium flex items-center gap-2"
              >
                <BarChart className="w-4 h-4" />
                Leaderboard
              </Link>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Problems List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Problems</h3>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search problems..."
                    className="text-sm border-none focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
              
              <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                {problems.map((problem) => (
                  <div
                    key={problem.id}
                    onClick={() => setSelectedProblem(problem)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedProblem?.id === problem.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">#{problem.id}</span>
                        <span className="font-medium text-gray-900">{problem.title}</span>
                        {problem.status === 'solved' && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <span className={`text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.points}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(problem.status)}`}>
                        {problem.status === 'solved' ? 'Solved' : 
                         problem.status === 'attempted' ? 'Attempted' : 'Unsolved'}
                      </span>
                      <span className={`text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-green-50 rounded">
                    <div className="text-lg font-bold text-green-700">
                      {problems.filter(p => p.status === 'solved').length}
                    </div>
                    <div className="text-xs text-green-600">Solved</div>
                  </div>
                  <div className="p-2 bg-yellow-50 rounded">
                    <div className="text-lg font-bold text-yellow-700">
                      {problems.filter(p => p.status === 'attempted').length}
                    </div>
                    <div className="text-xs text-yellow-600">Attempted</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="text-lg font-bold text-gray-700">
                      {problems.filter(p => p.status === 'unsolved').length}
                    </div>
                    <div className="text-xs text-gray-600">Unsolved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Problem & Editor Area */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Problem Description */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                {selectedProblem ? (
                  <div className="h-[calc(100vh-200px)] overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">
                          {selectedProblem.title}
                        </h2>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProblem.status)}`}>
                            {selectedProblem.status === 'solved' ? 'Solved' : 
                             selectedProblem.status === 'attempted' ? 'Attempted' : 'Unsolved'}
                          </span>
                          <span className={`font-medium ${getDifficultyColor(selectedProblem.difficulty)}`}>
                            {selectedProblem.difficulty}
                          </span>
                          <span className="text-gray-600">{selectedProblem.points} points</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{selectedProblem.testCases} test cases</span>
                        <span className="text-sm text-gray-600">•</span>
                        <span className="text-sm text-gray-600">{selectedProblem.timeLimit}</span>
                        <span className="text-sm text-gray-600">•</span>
                        <span className="text-sm text-gray-600">{selectedProblem.memoryLimit}</span>
                      </div>
                    </div>
                    
                    <div className="prose max-w-none">
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                        <p className="text-gray-700">{selectedProblem.description}</p>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Constraints</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {selectedProblem.constraints.map((constraint, idx) => (
                            <li key={idx} className="text-gray-700">{constraint}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples</h3>
                        {selectedProblem.examples.map((example, idx) => (
                          <div key={idx} className="mb-4">
                            <div className="mb-2">
                              <span className="font-medium text-gray-700">Example {idx + 1}:</span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="mb-2">
                                <span className="text-gray-600">Input: </span>
                                <code className="text-gray-900 bg-gray-100 px-2 py-1 rounded">
                                  {example.input}
                                </code>
                              </div>
                              <div className="mb-2">
                                <span className="text-gray-600">Output: </span>
                                <code className="text-gray-900 bg-gray-100 px-2 py-1 rounded">
                                  {example.output}
                                </code>
                              </div>
                              {example.explanation && (
                                <div>
                                  <span className="text-gray-600">Explanation: </span>
                                  <span className="text-gray-700">{example.explanation}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Select a problem to view details</p>
                  </div>
                )}
              </div>

              {/* Code Editor & Submissions */}
              <div className="space-y-6">
                {/* Code Editor */}
                <div className="bg-white rounded-xl shadow-sm">
                  {/* Editor Header */}
                  <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {languages.map((lang) => (
                          <option key={lang.value} value={lang.value}>
                            {lang.icon} {lang.label}
                          </option>
                        ))}
                      </select>
                      
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-gray-100 rounded" title="Save">
                          <Save className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 rounded" title="Format">
                          <Code className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 rounded" title="Fullscreen">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
                      >
                        <Play className="w-4 h-4" />
                        {isRunning ? 'Running...' : 'Run Code'}
                      </button>
                      <button
                        onClick={handleSubmitCode}
                        disabled={isSubmitting}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Submit
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Code Area */}
                  <div className="p-4">
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full h-64 font-mono text-sm p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      spellCheck="false"
                    />
                    
                    {/* Output Console */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900">Output</h4>
                        <button
                          onClick={() => setOutput('')}
                          className="text-sm text-gray-600 hover:text-gray-900"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm h-32 overflow-y-auto">
                        <pre>{output || '// Output will appear here'}</pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Submissions */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Submissions</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-sm font-medium text-gray-600">Problem</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-600">Language</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-600">Time</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-600">Status</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-600">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submissions.map((submission) => (
                          <tr key={submission.id} className="border-b border-gray-100 last:border-0">
                            <td className="py-3">
                              <span className="font-medium text-gray-900">{submission.problem}</span>
                            </td>
                            <td className="py-3">
                              <span className="text-gray-700">{submission.language}</span>
                            </td>
                            <td className="py-3">
                              <span className="text-gray-600 text-sm">{submission.time}</span>
                            </td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getSubmissionStatusColor(submission.status)}`}>
                                {submission.status}
                              </span>
                            </td>
                            <td className="py-3">
                              <span className={`font-medium ${
                                submission.score > 0 ? 'text-green-600' : 'text-gray-600'
                              }`}>
                                {submission.score}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {submissions.length === 0 && (
                    <div className="text-center py-8">
                      <Terminal className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No submissions yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveContest;