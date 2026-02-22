import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Play, CheckCircle, XCircle, Clock, Lightbulb, 
  BookOpen, MessageSquare, ThumbsUp, Share2, Flag, Settings,
  Code, Terminal, FileText, Zap, Trophy, Timer, RotateCcw,
  Send, Eye, EyeOff, ChevronRight, Award, Target, Flame
} from 'lucide-react';

const ProblemSolver = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Problem data (in real app, fetch from API)
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
      ],
      starterCode: {
        python: `def twoSum(nums, target):
    # Write your code here
    pass`,
        javascript: `function twoSum(nums, target) {
    // Write your code here
}`,
        typescript: `function twoSum(nums: number[], target: number): number[] {
    // Write your code here
}`,
        java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
    }
}`,
        cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
    }
};`,
        c: `/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    // Write your code here
}`,
        ruby: `# @param {Integer[]} nums
# @param {Integer} target
# @return {Integer[]}
def two_sum(nums, target)
    # Write your code here
end`,
        go: `func twoSum(nums []int, target int) []int {
    // Write your code here
}`,
        swift: `class Solution {
    func twoSum(_ nums: [Int], _ target: Int) -> [Int] {
        // Write your code here
    }
}`,
        kotlin: `class Solution {
    fun twoSum(nums: IntArray, target: Int): IntArray {
        // Write your code here
    }
}`,
        rust: `impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        // Write your code here
    }
}`,
        php: `class Solution {
    /**
     * @param Integer[] $nums
     * @param Integer $target
     * @return Integer[]
     */
    function twoSum($nums, $target) {
        // Write your code here
    }
}`
      },
      testCases: [
        { input: '[2,7,11,15], 9', output: '[0,1]', hidden: false },
        { input: '[3,2,4], 6', output: '[1,2]', hidden: false },
        { input: '[3,3], 6', output: '[0,1]', hidden: false },
        { input: '[-1,-2,-3,-4,-5], -8', output: '[2,4]', hidden: true },
        { input: '[1,5,3,7,9], 16', output: '[3,4]', hidden: true }
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
      ],
      starterCode: {
        python: `def addTwoNumbers(l1, l2):
    # Write your code here
    pass`,
        javascript: `function addTwoNumbers(l1, l2) {
    // Write your code here
}`,
        typescript: `function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
    // Write your code here
}`,
        java: `class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        // Write your code here
    }
}`,
        cpp: `class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        // Write your code here
    }
};`,
        c: `ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
    // Write your code here
}`,
        ruby: `def add_two_numbers(l1, l2)
    # Write your code here
end`,
        go: `func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {
    // Write your code here
}`,
        swift: `class Solution {
    func addTwoNumbers(_ l1: ListNode?, _ l2: ListNode?) -> ListNode? {
        // Write your code here
    }
}`,
        kotlin: `class Solution {
    fun addTwoNumbers(l1: ListNode?, l2: ListNode?): ListNode? {
        // Write your code here
    }
}`,
        rust: `impl Solution {
    pub fn add_two_numbers(l1: Option<Box<ListNode>>, l2: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
        // Write your code here
    }
}`,
        php: `class Solution {
    function addTwoNumbers(?ListNode $l1, ?ListNode $l2): ?ListNode {
        // Write your code here
    }
}`
      },
      testCases: [
        { input: 'l1 = [2,4,3], l2 = [5,6,4]', output: '[7,0,8]', hidden: false },
        { input: 'l1 = [0], l2 = [0]', output: '[0]', hidden: false },
        { input: 'l1 = [9,9,9], l2 = [9,9,9,9]', output: '[8,9,9,0,1]', hidden: true }
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
      ],
      starterCode: {
        python: `def lengthOfLongestSubstring(s):
    # Write your code here
    pass`,
        javascript: `function lengthOfLongestSubstring(s) {
    // Write your code here
}`,
        typescript: `function lengthOfLongestSubstring(s: string): number {
    // Write your code here
}`,
        java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your code here
    }
}`,
        cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Write your code here
    }
};`,
        c: `int lengthOfLongestSubstring(char* s) {
    // Write your code here
}`,
        ruby: `def length_of_longest_substring(s)
    # Write your code here
end`,
        go: `func lengthOfLongestSubstring(s string) int {
    // Write your code here
}`,
        swift: `class Solution {
    func lengthOfLongestSubstring(_ s: String) -> Int {
        // Write your code here
    }
}`,
        kotlin: `class Solution {
    fun lengthOfLongestSubstring(s: String): Int {
        // Write your code here
    }
}`,
        rust: `impl Solution {
    pub fn length_of_longest_substring(s: String) -> i32 {
        // Write your code here
    }
}`,
        php: `class Solution {
    function lengthOfLongestSubstring(string $s): int {
        // Write your code here
    }
}`
      },
      testCases: [
        { input: 's = "abcabcbb"', output: '3', hidden: false },
        { input: 's = "bbbbb"', output: '1', hidden: false },
        { input: 's = "pwwkew"', output: '3', hidden: false },
        { input: 's = ""', output: '0', hidden: true }
      ]
    }
  };

  const problem = problemData[id] || problemData[1];

  const [code, setCode] = useState(problem.starterCode.python);
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [revealedHints, setRevealedHints] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
  const [fontSize, setFontSize] = useState(14);
  const [showSolution, setShowSolution] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [submissions, setSubmissions] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Timer
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(problem.starterCode[newLang]);
  };

  const runCode = () => {
    // Check if code is empty or just the starter code
    const isEmptyCode = code.trim() === '' || 
                        code.trim() === problem.starterCode[language].trim() ||
                        code.includes('# Write your code here') ||
                        code.includes('// Write your code here');
    
    if (isEmptyCode) {
      setOutput('❌ Error: Please write your solution before running tests.\n');
      setTestResults([]);
      return;
    }
    
    setIsRunning(true);
    setOutput('Running test cases...\n');
    
    // Simulate code execution with validation
    setTimeout(() => {
      // Simple validation: check if code has basic implementation
      const hasImplementation = code.includes('return') || code.includes('console.log');
      
      if (!hasImplementation) {
        setOutput('❌ Error: Your code must return a value.\n');
        setTestResults([]);
        setIsRunning(false);
        return;
      }
      
      // Simulate running only visible test cases
      const visibleTests = problem.testCases.filter(tc => !tc.hidden);
      const results = visibleTests.map((tc, idx) => {
        // Simulate code evaluation - in real app, this would execute actual code
        const passed = Math.random() > 0.4; // Simulate pass/fail
        return {
          passed,
          input: tc.input,
          expected: tc.output,
          actual: passed ? tc.output : '[1,3]', // Simulate wrong output
          runtime: `${Math.floor(Math.random() * 100)}ms`,
          memory: `${(Math.random() * 50 + 10).toFixed(1)}MB`
        };
      });
      
      setTestResults(results);
      const passedCount = results.filter(r => r.passed).length;
      const totalCount = results.length;
      
      if (passedCount === totalCount) {
        setOutput(`✅ All test cases passed! (${passedCount}/${totalCount})\n\nYou can now submit your solution.`);
      } else {
        setOutput(`❌ ${passedCount}/${totalCount} test cases passed.\n\nFix the failing test cases before submitting.`);
      }
      setIsRunning(false);
      
      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById('test-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }, 2000);
  };

  const submitCode = () => {
    // Check if code is empty or just the starter code
    const isEmptyCode = code.trim() === '' || 
                        code.trim() === problem.starterCode[language].trim() ||
                        code.includes('# Write your code here') ||
                        code.includes('// Write your code here');
    
    if (isEmptyCode) {
      setOutput('❌ Error: Please write your solution before submitting.\n');
      setTestResults([]);
      return;
    }
    
    setIsRunning(true);
    setSubmissions(prev => prev + 1);
    setOutput('Submitting your solution...\nRunning all test cases (including hidden ones)...\n');
    
    // Simulate submission with proper validation
    setTimeout(() => {
      // Simple validation: check if code has proper implementation
      const hasImplementation = code.includes('return') || code.includes('console.log');
      const codeLength = code.replace(/\s+/g, '').length;
      const starterLength = problem.starterCode[language].replace(/\s+/g, '').length;
      const hasChanges = codeLength > starterLength + 20; // Must have added substantial code
      
      if (!hasImplementation || !hasChanges) {
        const failedResults = problem.testCases.map((tc, idx) => ({
          passed: false,
          input: tc.input,
          expected: tc.output,
          actual: 'null',
          hidden: tc.hidden,
          runtime: '0ms',
          memory: '0MB'
        }));
        
        setTestResults(failedResults);
        setOutput(`❌ Compilation Error or Runtime Error\n\nYour code doesn't have a valid implementation.\nPlease complete the solution and try again.\n\nSubmission #${submissions + 1} - Failed`);
        setIsRunning(false);
        
        // Scroll to output
        setTimeout(() => {
          const outputElement = document.getElementById('console-output');
          if (outputElement) {
            outputElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 100);
        return;
      }
      
      // Advanced validation: check for correct logic patterns
      const hasHashMap = code.includes('{}') || code.includes('dict') || code.includes('Map');
      const hasLoop = code.includes('for') || code.includes('while');
      
      // Simulate realistic test execution
      const allTestCases = problem.testCases.map((tc, idx) => {
        // For Two Sum problem, check if solution approach is correct
        let passed = false;
        
        if (hasHashMap && hasLoop) {
          // Good approach - most tests should pass
          passed = Math.random() > 0.1;
        } else if (hasLoop) {
          // Brute force approach - some tests might timeout
          passed = Math.random() > 0.5;
        } else {
          // Incomplete solution
          passed = false;
        }
        
        return {
          passed,
          input: tc.input,
          expected: tc.output,
          actual: passed ? tc.output : (idx % 2 === 0 ? '[1,3]' : '[]'),
          hidden: tc.hidden,
          runtime: passed ? `${Math.floor(Math.random() * 100)}ms` : 'N/A',
          memory: passed ? `${(Math.random() * 50 + 10).toFixed(1)}MB` : 'N/A'
        };
      });
      
      setTestResults(allTestCases);
      const passedCount = allTestCases.filter(r => r.passed).length;
      const totalCount = allTestCases.length;
      const passPercentage = ((passedCount / totalCount) * 100).toFixed(0);
      
      if (passedCount === totalCount) {
        // All tests passed - Success!
        const avgRuntime = allTestCases.reduce((sum, r) => sum + parseInt(r.runtime), 0) / totalCount;
        const avgMemory = allTestCases.reduce((sum, r) => sum + parseFloat(r.memory), 0) / totalCount;
        const points = problem.difficulty === 'Easy' ? 10 : problem.difficulty === 'Medium' ? 20 : 30;
        
        setPointsEarned(points);
        setShowSuccessModal(true);
        setIsTimerRunning(false);
        
        // Save completed problem to localStorage
        try {
          const completedProblemsData = localStorage.getItem('completedProblems');
          let completed = completedProblemsData ? JSON.parse(completedProblemsData) : { ids: [], attempts: {}, times: {} };
          
          // Add this problem to completed list
          if (!completed.ids.includes(parseInt(id))) {
            completed.ids.push(parseInt(id));
          }
          
          // Update attempts and time
          completed.attempts[id] = (completed.attempts[id] || 0) + 1;
          completed.times[id] = formatTime(timeElapsed);
          
          localStorage.setItem('completedProblems', JSON.stringify(completed));
        } catch (e) {
          console.error('Error saving completed problem:', e);
        }
        
        setOutput(
          `✅ Accepted!\n\n` +
          `All ${totalCount} test cases passed.\n\n` +
          `Runtime: ${avgRuntime.toFixed(0)}ms (Beats ${Math.floor(Math.random() * 30 + 65)}%)\n` +
          `Memory: ${avgMemory.toFixed(1)}MB (Beats ${Math.floor(Math.random() * 30 + 60)}%)\n\n` +
          `Time Taken: ${formatTime(timeElapsed)}\n` +
          `Submission #${submissions + 1} - Accepted\n\n` +
          `🎉 You earned ${points} points!`
        );
      } else {
        // Some tests failed
        setOutput(
          `❌ Wrong Answer\n\n` +
          `${passedCount}/${totalCount} test cases passed (${passPercentage}%)\n\n` +
          `Submission #${submissions + 1} - Failed\n\n` +
          `Review the failing test cases below and fix your solution.`
        );
      }
      
      setIsRunning(false);
      
      // Scroll to output
      setTimeout(() => {
        const outputElement = document.getElementById('console-output');
        if (outputElement) {
          outputElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }, 3000);
  };

  const revealHint = (index) => {
    if (!revealedHints.includes(index)) {
      setRevealedHints([...revealedHints, index]);
    }
  };

  const resetCode = () => {
    setCode(problem.starterCode[language]);
    setOutput('');
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col" style={{ fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      
      {/* Top Bar */}
      <div className="bg-white border-b-2 border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
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
          </div>
          
          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 px-4 py-2 rounded-lg border-2 border-orange-300">
              <Timer className="w-5 h-5 text-orange-600" />
              <span className="text-xl font-bold text-orange-600">{formatTime(timeElapsed)}</span>
              <button 
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="ml-2 hover:scale-110 transition-transform"
              >
                {isTimerRunning ? '⏸️' : '▶️'}
              </button>
            </div>
            
            {/* Points */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-lg border-2 border-purple-300">
              <Trophy className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-600">
                {problem.difficulty === 'Easy' ? '10' : problem.difficulty === 'Medium' ? '20' : '30'} pts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 border-r-2 border-gray-200 overflow-y-auto bg-white">
          <div className="p-6">
            
            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b-2 border-gray-200">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-4 py-2 font-semibold transition-all ${
                  activeTab === 'description'
                    ? 'text-blue-600 border-b-2 border-blue-600 -mb-[2px]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BookOpen className="w-4 h-4 inline mr-2" />
                Description
              </button>
              <button
                onClick={() => setActiveTab('solutions')}
                className={`px-4 py-2 font-semibold transition-all ${
                  activeTab === 'solutions'
                    ? 'text-blue-600 border-b-2 border-blue-600 -mb-[2px]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Code className="w-4 h-4 inline mr-2" />
                Solutions
              </button>
              <button
                onClick={() => setActiveTab('submissions')}
                className={`px-4 py-2 font-semibold transition-all ${
                  activeTab === 'submissions'
                    ? 'text-blue-600 border-b-2 border-blue-600 -mb-[2px]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Send className="w-4 h-4 inline mr-2" />
                Submissions ({submissions})
              </button>
            </div>

            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="space-y-6">
                
                {/* Problem Statement */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Problem Statement</h2>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">{problem.description}</p>
                </div>

                {/* Examples */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Examples</h2>
                  {problem.examples.map((example, idx) => (
                    <div key={idx} className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 mb-3">
                      <p className="text-sm font-bold text-gray-900 mb-2">Example {idx + 1}:</p>
                      <div className="space-y-2">
                        <p className="text-sm"><span className="font-semibold">Input:</span> <code className="bg-gray-200 px-2 py-1 rounded">{example.input}</code></p>
                        <p className="text-sm"><span className="font-semibold">Output:</span> <code className="bg-gray-200 px-2 py-1 rounded">{example.output}</code></p>
                        <p className="text-sm text-gray-600"><span className="font-semibold">Explanation:</span> {example.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Constraints</h2>
                  <ul className="space-y-2">
                    {problem.constraints.map((constraint, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ChevronRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">{constraint}</code>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hints Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-gray-900">Hints</h2>
                    <button
                      onClick={() => setShowHints(!showHints)}
                      className="flex items-center gap-2 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg transition-all font-semibold text-sm"
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
                              <div className="flex items-start gap-2">
                                <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-gray-700">{hint}</p>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => revealHint(idx)}
                              className="w-full bg-gray-100 hover:bg-yellow-50 border-2 border-gray-300 hover:border-yellow-300 rounded-xl p-4 transition-all text-left"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-gray-700">Hint {idx + 1}</span>
                                <span className="text-sm text-gray-500">Click to reveal</span>
                              </div>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Companies */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Companies</h2>
                  <div className="flex gap-2">
                    {problem.companies.map((company, idx) => (
                      <span key={idx} className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-semibold border border-purple-300">
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Solutions Tab */}
            {activeTab === 'solutions' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 text-center">
                  <Award className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Solutions Unlocked After Solving</h3>
                  <p className="text-sm text-gray-600 mb-4">Submit a correct solution to unlock community solutions and editorial</p>
                  <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-lg font-semibold">
                    Submit Your Solution First
                  </button>
                </div>
              </div>
            )}

            {/* Submissions Tab */}
            {activeTab === 'submissions' && (
              <div className="space-y-4">
                {submissions === 0 ? (
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No submissions yet. Write your solution and submit!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Array.from({ length: submissions }).map((_, idx) => (
                      <div key={idx} className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">Submission #{submissions - idx}</p>
                            <p className="text-sm text-gray-600">{new Date().toLocaleString()}</p>
                          </div>
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                            Wrong Answer
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col bg-gray-50">
          
          {/* Editor Header */}
          <div className="bg-white border-b-2 border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="px-4 py-2 bg-gray-100 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 transition-all"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
                <option value="ruby">Ruby</option>
                <option value="go">Go</option>
                <option value="swift">Swift</option>
                <option value="kotlin">Kotlin</option>
                <option value="rust">Rust</option>
                <option value="php">PHP</option>
              </select>
              
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                  className="px-2 py-1 hover:bg-gray-200 rounded font-semibold"
                >
                  A-
                </button>
                <span className="text-sm font-semibold text-gray-600">{fontSize}px</span>
                <button
                  onClick={() => setFontSize(Math.min(20, fontSize + 2))}
                  className="px-2 py-1 hover:bg-gray-200 rounded font-semibold"
                >
                  A+
                </button>
              </div>
            </div>
            
            <button
              onClick={resetCode}
              className="flex items-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all font-semibold"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {/* Code Editor */}
          <div className="flex-1 overflow-y-auto p-4">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full min-h-[300px] p-4 bg-gray-900 text-green-400 rounded-xl font-mono border-2 border-gray-300 focus:outline-none focus:border-blue-500 resize-none"
              style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
              spellCheck={false}
            />
          </div>

          {/* Console/Output */}
          <div className="border-t-2 border-gray-200 bg-white" id="console-output">
            <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-gray-600" />
              <span className="font-semibold text-gray-700">Test Results</span>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {output ? (
                <div className="mb-4">
                  <pre className="text-sm font-mono whitespace-pre-wrap bg-gray-900 text-green-400 p-4 rounded-lg">{output}</pre>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic mb-4">Click "Run Code" to test your solution or "Submit" for final evaluation...</p>
              )}
              
              {/* Test Results */}
              {testResults.length > 0 && (
                <div id="test-results" className="space-y-3">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-gray-200">
                    <h3 className="font-bold text-gray-900">Test Cases</h3>
                    <span className="text-sm font-semibold text-gray-600">
                      {testResults.filter(r => r.passed).length}/{testResults.length} Passed
                    </span>
                  </div>
                  
                  {testResults.map((result, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        result.passed
                          ? 'bg-green-50 border-green-400'
                          : 'bg-red-50 border-red-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {result.passed ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <span className="font-bold text-gray-900">
                            {result.hidden ? '🔒 Hidden Test Case' : `Case ${idx + 1}`}
                          </span>
                        </div>
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                          result.passed 
                            ? 'bg-green-600 text-white' 
                            : 'bg-red-600 text-white'
                        }`}>
                          {result.passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                      
                      {!result.hidden && (
                        <div className="space-y-2 text-sm">
                          <div className="bg-white/50 p-3 rounded-lg">
                            <p className="font-semibold text-gray-700 mb-1">Input:</p>
                            <code className="text-gray-900 bg-gray-100 px-2 py-1 rounded">{result.input}</code>
                          </div>
                          
                          {!result.passed && (
                            <>
                              <div className="bg-white/50 p-3 rounded-lg">
                                <p className="font-semibold text-gray-700 mb-1">Expected Output:</p>
                                <code className="text-green-700 bg-green-100 px-2 py-1 rounded font-bold">{result.expected}</code>
                              </div>
                              
                              <div className="bg-white/50 p-3 rounded-lg">
                                <p className="font-semibold text-gray-700 mb-1">Your Output:</p>
                                <code className="text-red-700 bg-red-100 px-2 py-1 rounded font-bold">{result.actual}</code>
                              </div>
                            </>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Runtime: <strong>{result.runtime}</strong>
                            </span>
                            {result.memory && (
                              <span className="flex items-center gap-1">
                                Memory: <strong>{result.memory}</strong>
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {result.hidden && result.passed && (
                        <p className="text-sm text-gray-600 italic">Hidden test case passed ✓</p>
                      )}
                      
                      {result.hidden && !result.passed && (
                        <p className="text-sm text-red-600 italic">This hidden test case failed. Make sure your solution handles all edge cases.</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t-2 border-gray-200 bg-white p-4 flex gap-3">
            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
            >
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Run Code
                </>
              )}
            </button>
            
            <button
              onClick={submitCode}
              disabled={isRunning}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
            >
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Accepted! 🎉</h2>
              <p className="text-gray-600 mb-6">Congratulations on solving this problem!</p>
              
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-4 border-2 border-purple-200">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-3xl font-bold text-purple-600">+{pointsEarned}</p>
                    <p className="text-sm text-gray-600">Points Earned</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-3xl font-bold text-blue-600">{formatTime(timeElapsed)}</p>
                    <p className="text-sm text-gray-600">Time Taken</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-sm text-gray-600 mb-1">Runtime</p>
                    <p className="text-lg font-bold text-green-600">Beats {Math.floor(Math.random() * 30 + 65)}%</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-sm text-gray-600 mb-1">Memory</p>
                    <p className="text-lg font-bold text-cyan-600">Beats {Math.floor(Math.random() * 30 + 60)}%</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 justify-center mb-6 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>All {problem.testCases.length} test cases passed</span>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/dashboard/problems')}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg"
                >
                  Next Problem
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  View Solution
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemSolver;