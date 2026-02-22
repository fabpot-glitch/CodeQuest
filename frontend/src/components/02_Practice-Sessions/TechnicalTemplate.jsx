import React, { useState } from 'react';
import './TechnicalTemplate.css';

const TechnicalTemplate = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const problem = {
    title: "Two Sum Problem",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "nums[1] + nums[2] = 2 + 4 = 6"
      }
    ],
    constraints: [
      "2 <= nums.length <= 104",
      "-109 <= nums[i] <= 109",
      "-109 <= target <= 109",
      "Only one valid answer exists."
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
    // Write your code here
    
}`,
      python: `def two_sum(nums, target):
    # Write your code here
    pass`,
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
};`
    },
    hints: [
      "Try using a hash map to store numbers you've seen",
      "For each number, check if target - current number exists in the map",
      "The map can store number -> index pairs"
    ],
    solution: {
      javascript: `function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}`,
      timeComplexity: "O(n) - where n is the length of the array",
      spaceComplexity: "O(n) - for the hash map"
    }
  };

  const evaluationCriteria = [
    {
      id: 1,
      name: "Correctness",
      weight: 40,
      description: "Solution produces correct output for all test cases"
    },
    {
      id: 2,
      name: "Efficiency",
      weight: 25,
      description: "Optimal time and space complexity"
    },
    {
      id: 3,
      name: "Code Quality",
      weight: 20,
      description: "Clean, readable, and well-structured code"
    },
    {
      id: 4,
      name: "Communication",
      weight: 15,
      description: "Clear explanation of approach and trade-offs"
    }
  ];

  const handleRunCode = () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      setOutput("Running test cases...\n\nTest Case 1: Passed ✅\nTest Case 2: Passed ✅\nTest Case 3: Failed ❌\n\nExpected: [0, 2]\nGot: [0, 1]");
      setIsRunning(false);
    }, 2000);
  };

  const handleSubmitCode = () => {
    // Simulate submission feedback
    setFeedback([
      {
        type: "success",
        message: "Solution accepted! Good job!"
      },
      {
        type: "info",
        message: "Time complexity: O(n) - Optimal"
      },
      {
        type: "warning",
        message: "Consider adding input validation"
      }
    ]);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="technical-template">
      {/* Header */}
      <div className="problem-header">
        <div className="problem-title">
          <div>
            <h1>{problem.title}</h1>
            <div className="problem-meta">
              <span className={`difficulty-badge ${problem.difficulty.toLowerCase()}`}>
                {problem.difficulty}
              </span>
              <span className="problem-category">{problem.category}</span>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn-outline" onClick={prevStep} disabled={currentStep === 0}>
              ← Previous
            </button>
            <button className="btn-outline" onClick={nextStep} disabled={currentStep === 3}>
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="template-container">
        {/* Left Panel - Problem Description */}
        <div className="problem-panel">
          <div className="panel-tabs">
            <button
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`tab ${activeTab === 'hints' ? 'active' : ''}`}
              onClick={() => setActiveTab('hints')}
            >
              Hints
            </button>
            <button
              className={`tab ${activeTab === 'solution' ? 'active' : ''}`}
              onClick={() => setActiveTab('solution')}
            >
              Solution
            </button>
          </div>

          <div className="panel-content">
            {activeTab === 'overview' && (
              <>
                <div className="description-section">
                  <h3>Problem Description</h3>
                  <p>{problem.description}</p>
                </div>

                <div className="examples-section">
                  <h3>Examples</h3>
                  {problem.examples.map((example, idx) => (
                    <div key={idx} className="example-card">
                      <div className="example-input">
                        <span className="label">Input:</span> {example.input}
                      </div>
                      <div className="example-output">
                        <span className="label">Output:</span> {example.output}
                      </div>
                      <div className="example-explanation">
                        <span className="label">Explanation:</span> {example.explanation}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="constraints-section">
                  <h3>Constraints</h3>
                  <ul className="constraints-list">
                    {problem.constraints.map((constraint, idx) => (
                      <li key={idx}>{constraint}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {activeTab === 'hints' && (
              <div className="hints-section">
                <h3>Hints</h3>
                <div className="hints-list">
                  {problem.hints.map((hint, idx) => (
                    <div key={idx} className="hint-item">
                      <span className="hint-number">{idx + 1}</span>
                      <p>{hint}</p>
                    </div>
                  ))}
                </div>
                <div className="hint-tip">
                  <span className="tip-icon">💡</span>
                  <p>Try to solve it yourself before looking at the solution!</p>
                </div>
              </div>
            )}

            {activeTab === 'solution' && (
              <div className="solution-section">
                <h3>Optimal Solution</h3>
                <div className="solution-card">
                  <div className="solution-header">
                    <span className="language-badge">JavaScript</span>
                  </div>
                  <pre className="code-block">
                    <code>{problem.solution.javascript}</code>
                  </pre>
                </div>

                <div className="complexity-analysis">
                  <h4>Complexity Analysis</h4>
                  <div className="complexity-item">
                    <span className="complexity-label">Time Complexity:</span>
                    <span className="complexity-value">{problem.solution.timeComplexity}</span>
                  </div>
                  <div className="complexity-item">
                    <span className="complexity-label">Space Complexity:</span>
                    <span className="complexity-value">{problem.solution.spaceComplexity}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="code-panel">
          <div className="code-header">
            <div className="language-selector">
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
            <div className="code-actions">
              <button className="btn-run" onClick={handleRunCode} disabled={isRunning}>
                {isRunning ? 'Running...' : '▶ Run Code'}
              </button>
              <button className="btn-submit" onClick={handleSubmitCode}>
                Submit Solution
              </button>
            </div>
          </div>

          <div className="code-editor">
            <textarea
              value={code || problem.starterCode[language]}
              onChange={(e) => setCode(e.target.value)}
              className="code-textarea"
              spellCheck="false"
            />
          </div>

          {/* Output Console */}
          <div className="output-console">
            <div className="console-header">
              <span>Console Output</span>
              <button className="clear-btn" onClick={() => setOutput('')}>Clear</button>
            </div>
            <div className="console-content">
              {output ? (
                <pre>{output}</pre>
              ) : (
                <div className="console-placeholder">
                  Run your code to see output here
                </div>
              )}
            </div>
          </div>

          {/* Feedback Section */}
          {feedback.length > 0 && (
            <div className="feedback-section">
              <h4>Feedback</h4>
              <div className="feedback-list">
                {feedback.map((item, idx) => (
                  <div key={idx} className={`feedback-item ${item.type}`}>
                    <span className="feedback-icon">
                      {item.type === 'success' && '✅'}
                      {item.type === 'info' && 'ℹ️'}
                      {item.type === 'warning' && '⚠️'}
                    </span>
                    <span>{item.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Evaluation Criteria */}
      <div className="evaluation-section">
        <h3>Evaluation Criteria</h3>
        <div className="criteria-grid">
          {evaluationCriteria.map((criteria) => (
            <div key={criteria.id} className="criteria-card">
              <div className="criteria-header">
                <span className="criteria-name">{criteria.name}</span>
                <span className="criteria-weight">{criteria.weight}%</span>
              </div>
              <div className="criteria-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${criteria.weight}%` }}
                  ></div>
                </div>
              </div>
              <p className="criteria-description">{criteria.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interview Tips */}
      <div className="tips-section">
        <h3>Interview Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <span className="tip-number">01</span>
            <h4>Understand the Problem</h4>
            <p>Ask clarifying questions before jumping into code. Confirm edge cases and constraints.</p>
          </div>
          <div className="tip-card">
            <span className="tip-number">02</span>
            <h4>Think Out Loud</h4>
            <p>Explain your thought process and consider multiple approaches.</p>
          </div>
          <div className="tip-card">
            <span className="tip-number">03</span>
            <h4>Start with Brute Force</h4>
            <p>Begin with a working solution, then optimize step by step.</p>
          </div>
          <div className="tip-card">
            <span className="tip-number">04</span>
            <h4>Test Your Code</h4>
            <p>Walk through your solution with examples to catch bugs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalTemplate;