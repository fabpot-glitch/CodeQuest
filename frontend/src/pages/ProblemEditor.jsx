import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, CheckCircle2, XCircle, ChevronLeft, Terminal, RotateCcw, AlertCircle } from 'lucide-react';

const ProblemEditor = () => {
  const { id } = useParams();  // ✅ Fixed: was `problemId`, route defines `:id`
  const navigate = useNavigate();

  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [fontSize, setFontSize] = useState(14);

  // Problem mock data
  const problemsData = {
    1: {
      title: 'Two Sum',
      difficulty: 'Easy',
      points: 10,
      description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
      testCases: [
        { input: [[2, 7, 11, 15], 9], expected: [0, 1], hidden: false },
        { input: [[3, 2, 4], 6], expected: [1, 2], hidden: false },
        { input: [[3, 3], 6], expected: [0, 1], hidden: false },
      ],
      starterCode: {
        javascript: `function twoSum(nums, target) {\n  // Write your solution here\n  return [];\n}`,
        python: `def twoSum(nums, target):\n    # Write your solution here\n    return []`,
      },
    },
    2: {
      title: 'Add Two Numbers',
      difficulty: 'Medium',
      points: 20,
      description: `You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.`,
      testCases: [
        { input: [[2, 4, 3], [5, 6, 4]], expected: [7, 0, 8], hidden: false },
        { input: [[0], [0]], expected: [0], hidden: false },
        { input: [[9, 9, 9], [9, 9, 9, 9]], expected: [8, 9, 9, 0, 1], hidden: true },
      ],
      starterCode: {
        javascript: `function addTwoNumbers(l1, l2) {\n  // Write your solution here\n  return null;\n}`,
        python: `def addTwoNumbers(l1, l2):\n    # Write your solution here\n    return None`,
      },
    },
    3: {
      title: 'Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      points: 20,
      description: `Given a string s, find the length of the longest substring without repeating characters.`,
      testCases: [
        { input: ['abcabcbb'], expected: 3, hidden: false },
        { input: ['bbbbb'], expected: 1, hidden: false },
        { input: ['pwwkew'], expected: 3, hidden: false },
        { input: [''], expected: 0, hidden: true },
      ],
      starterCode: {
        javascript: `function lengthOfLongestSubstring(s) {\n  // Write your solution here\n  return 0;\n}`,
        python: `def lengthOfLongestSubstring(s):\n    # Write your solution here\n    return 0`,
      },
    },
  };

  // ✅ Fixed: was `problemId`, now uses `id` everywhere
  const problem = problemsData[id] || problemsData[1];

  useEffect(() => {
    const saved = localStorage.getItem(`problem_${id}_${language}`);
    setCode(saved || (problem.starterCode[language] || ''));
    setOutput('');
    setTestResults([]);
  }, [language, id]);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    localStorage.setItem(`problem_${id}_${language}`, e.target.value);
  };

  // Run code only for JavaScript (simulate other languages)
  const handleRun = () => {
    setIsRunning(true);
    setOutput('Running test cases...\n');
    setTestResults([]);

    setTimeout(() => {
      const results = problem.testCases.map((tc, index) => {
        let passed = false;
        let actual;
        try {
          if (language === 'javascript') {
            // Dynamically evaluate user code
            const funcName = Object.keys(problem.starterCode.javascript.match(/function\s+(\w+)/)?.[1] || 'solution')[0]
              ? problem.starterCode.javascript.match(/function\s+(\w+)/)?.[1]
              : 'solution';
            const func = new Function(`${code}; return ${funcName};`)();
            actual = func(...tc.input);

            // Compare results (handles arrays and primitives)
            if (Array.isArray(tc.expected) && Array.isArray(actual)) {
              passed = actual.length === tc.expected.length &&
                       actual.every((v, i) => v === tc.expected[i]);
            } else {
              passed = actual === tc.expected;
            }
          } else {
            // Simulate other languages
            actual = 'N/A (simulation)';
            passed = false;
          }
        } catch (err) {
          actual = `Error: ${err.message}`;
        }

        return {
          id: index + 1,
          passed,
          input: tc.input,
          expected: tc.expected,
          actual,
          hidden: tc.hidden,
        };
      });

      setTestResults(results);
      setOutput(
        `Executed ${results.length} test cases\n` +
        `Passed: ${results.filter(r => r.passed).length}/${results.length}`
      );
      setIsRunning(false);
    }, 500);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    if (testResults.length === 0) {
      setOutput('Run the test cases first!');
      setIsSubmitting(false);
      return;
    }

    const allPassed = testResults.every(r => r.passed);

    setTimeout(() => {
      if (allPassed) {
        setOutput(`✅ Accepted!\n\nYour solution passed all test cases.\n🏆 +${problem.points} points earned`);
      } else {
        setOutput('❌ Some test cases failed. Fix your code and try again.');
      }
      setIsSubmitting(false);
    }, 300);
  };

  const handleReset = () => {
    if (window.confirm('Reset code? This action cannot be undone.')) {
      setCode(problem.starterCode[language] || '');
      localStorage.removeItem(`problem_${id}_${language}`);
      setOutput('');
      setTestResults([]);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <button
          onClick={() => navigate('/dashboard/problems')}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Problems</span>
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">{problem.title}</h1>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          problem.difficulty === 'Easy'
            ? 'bg-green-100 text-green-700'
            : problem.difficulty === 'Medium'
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {problem.difficulty} • {problem.points} pts
        </span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-2/5 overflow-y-auto border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">{problem.description}</p>
          </div>

          {/* Test Cases Preview */}
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Examples</h2>
            <div className="space-y-3">
              {problem.testCases.filter(tc => !tc.hidden).map((tc, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">Example {idx + 1}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Input:</span>{' '}
                    <code className="bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded text-xs">
                      {JSON.stringify(tc.input)}
                    </code>
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    <span className="font-semibold">Output:</span>{' '}
                    <code className="bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded text-xs">
                      {JSON.stringify(tc.expected)}
                    </code>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col bg-gray-900">
          {/* Editor Header */}
          <div className="flex items-center justify-between p-2 border-b border-gray-700 bg-gray-800">
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="px-2 py-1 rounded bg-gray-700 text-white border border-gray-600"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
            <div className="flex items-center space-x-3">
              <div className="flex items-center gap-1 bg-gray-700 rounded px-2 py-1">
                <button
                  onClick={() => setFontSize(Math.max(11, fontSize - 1))}
                  className="text-gray-300 hover:text-white text-xs font-bold"
                >A-</button>
                <span className="text-gray-400 text-xs">{fontSize}</span>
                <button
                  onClick={() => setFontSize(Math.min(20, fontSize + 1))}
                  className="text-gray-300 hover:text-white text-xs font-bold"
                >A+</button>
              </div>
              <button onClick={handleReset} className="p-1 text-gray-400 hover:text-white transition-colors">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <textarea
            value={code}
            onChange={handleCodeChange}
            className="flex-1 p-4 text-sm font-mono text-green-400 bg-gray-900 resize-none focus:outline-none overflow-auto"
            style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
            spellCheck={false}
          />

          {/* Console */}
          <div className="h-64 bg-gray-800 border-t border-gray-700 flex flex-col">
            <div className="flex items-center justify-between p-2 border-b border-gray-700">
              <div className="flex items-center space-x-2 text-gray-200">
                <Terminal className="w-4 h-4" />
                <span className="text-sm font-semibold">Console</span>
              </div>
              <div className="flex space-x-4 text-xs text-gray-400">
                <span className="text-green-400">✓ Passed: {testResults.filter(r => r.passed).length}</span>
                <span className="text-red-400">✗ Failed: {testResults.filter(r => !r.passed).length}</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 text-sm text-gray-100 font-mono whitespace-pre-wrap">
              {testResults.length > 0 ? testResults.map(r => (
                <div key={r.id} className={`mb-2 p-2 rounded ${r.passed ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                  <div className="flex items-center gap-2">
                    {r.passed ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                    <span className={`text-xs font-semibold ${r.passed ? 'text-green-400' : 'text-red-400'}`}>
                      Test Case {r.id} {r.hidden ? '(Hidden)' : ''} — {r.passed ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                  {!r.hidden && (
                    <div className="ml-6 mt-1 text-xs text-gray-400 space-y-0.5">
                      <div>Input: <span className="text-gray-300">{JSON.stringify(r.input)}</span></div>
                      <div>Expected: <span className="text-green-300">{JSON.stringify(r.expected)}</span></div>
                      <div>Your Output: <span className={r.passed ? 'text-green-300' : 'text-red-300'}>{JSON.stringify(r.actual)}</span></div>
                    </div>
                  )}
                </div>
              )) : (
                <span className="text-gray-500 text-xs italic">{output || 'Run your code to see test results...'}</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex p-3 border-t border-gray-700 space-x-3 bg-gray-800">
            <button
              onClick={handleRun}
              disabled={isRunning || isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
            >
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Code
                </>
              )}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isRunning || isSubmitting || testResults.length === 0}
              className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Submit
                </>
              )}
            </button>
            <div className="flex items-center text-gray-500 text-xs space-x-1 px-2">
              <AlertCircle className="w-3 h-3" />
              <span>Auto-saved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemEditor;