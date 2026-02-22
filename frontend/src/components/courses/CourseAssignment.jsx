import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CourseDetails.css';

const CourseAssignment = () => {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockAssignment = {
        id: parseInt(assignmentId),
        title: 'Array Practice Problems',
        description: 'Implement various array operations and solve practice problems',
        dueDate: '2024-02-28T23:59:00',
        points: 100,
        instructions: `
          1. Implement the following array operations:
             - Find the maximum element
             - Reverse the array
             - Remove duplicates
          2. Solve at least 3 array problems from LeetCode
          3. Write unit tests for your implementations
          4. Submit your code with comments explaining your approach
        `,
        requirements: [
          'Use proper variable naming',
          'Include comments explaining your logic',
          'Handle edge cases',
          'Provide test cases'
        ],
        resources: [
          { name: 'Array Cheat Sheet', url: '#' },
          { name: 'Sample Solution', url: '#' },
          { name: 'Test Cases Template', url: '#' }
        ],
        rubric: [
          { criterion: 'Correctness', weight: 40 },
          { criterion: 'Code Quality', weight: 30 },
          { criterion: 'Documentation', weight: 15 },
          { criterion: 'Test Coverage', weight: 15 }
        ]
      };
      setAssignment(mockAssignment);
      setLoading(false);

      // Check if already submitted
      const submissions = JSON.parse(localStorage.getItem('assignmentSubmissions') || '{}');
      const existing = submissions[`${courseId}-${assignmentId}`];
      if (existing) {
        setSubmitted(true);
        setFeedback(existing.feedback);
        setSubmission(existing.content);
      }
    }, 1000);
  }, [courseId, assignmentId]);

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles([...files, ...uploadedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submissionData = {
      content: submission,
      files,
      submittedAt: new Date().toISOString(),
      status: 'submitted'
    };

    // Save submission
    const submissions = JSON.parse(localStorage.getItem('assignmentSubmissions') || '{}');
    submissions[`${courseId}-${assignmentId}`] = submissionData;
    localStorage.setItem('assignmentSubmissions', JSON.stringify(submissions));

    setSubmitted(true);
    
    // Simulate automatic feedback (in real app, this would come from instructor)
    setTimeout(() => {
      const mockFeedback = {
        grade: 85,
        comments: 'Good work! Your implementations are correct. Consider adding more edge cases and improving code comments.',
        rubric: [
          { criterion: 'Correctness', score: 35, max: 40 },
          { criterion: 'Code Quality', score: 25, max: 30 },
          { criterion: 'Documentation', score: 12, max: 15 },
          { criterion: 'Test Coverage', score: 13, max: 15 }
        ],
        submittedAt: submissionData.submittedAt,
        gradedAt: new Date().toISOString()
      };
      setFeedback(mockFeedback);
      
      // Save feedback
      submissions[`${courseId}-${assignmentId}`].feedback = mockFeedback;
      localStorage.setItem('assignmentSubmissions', JSON.stringify(submissions));
    }, 2000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysLeft = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  if (loading) {
    return <div className="assignment-loading">Loading assignment...</div>;
  }

  const daysLeft = getDaysLeft(assignment.dueDate);
  const isLate = daysLeft < 0;

  return (
    <div className="assignment-container">
      <div className="assignment-header">
        <button
          className="back-btn"
          onClick={() => navigate(`/dashboard/courses/${courseId}/learn`)}
        >
          ← Back to Course
        </button>
        <h1>{assignment.title}</h1>
      </div>

      {submitted && feedback ? (
        <div className="assignment-feedback">
          <h2>Assignment Feedback</h2>
          <div className="feedback-summary">
            <div className="grade-circle">
              <span className="grade-value">{feedback.grade}%</span>
            </div>
            <div className="feedback-info">
              <p><strong>Submitted:</strong> {formatDate(feedback.submittedAt)}</p>
              <p><strong>Graded:</strong> {formatDate(feedback.gradedAt)}</p>
              <p><strong>Comments:</strong> {feedback.comments}</p>
            </div>
          </div>

          <div className="rubric-feedback">
            <h3>Rubric Breakdown</h3>
            {feedback.rubric.map((item, index) => (
              <div key={index} className="rubric-item">
                <div className="rubric-header">
                  <span className="rubric-criterion">{item.criterion}</span>
                  <span className="rubric-score">{item.score}/{item.max}</span>
                </div>
                <div className="rubric-bar">
                  <div
                    className="rubric-fill"
                    style={{ width: `${(item.score / item.max) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : submitted ? (
        <div className="submission-confirmation">
          <div className="confirmation-icon">✓</div>
          <h2>Assignment Submitted Successfully!</h2>
          <p>Your submission has been received. You'll receive feedback soon.</p>
          <button
            className="view-submission-btn"
            onClick={() => {
              setSubmitted(false);
              setFeedback(null);
            }}
          >
            View Submission
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="assignment-form">
          <div className="assignment-info">
            <div className="info-card">
              <h3>Due Date</h3>
              <p className={`due-date ${isLate ? 'late' : ''}`}>
                {formatDate(assignment.dueDate)}
                {!isLate && daysLeft <= 3 && (
                  <span className="urgent-warning">
                    ⚠️ Only {daysLeft} days left!
                  </span>
                )}
                {isLate && <span className="late-badge">LATE</span>}
              </p>
            </div>

            <div className="info-card">
              <h3>Points</h3>
              <p className="points">{assignment.points}</p>
            </div>
          </div>

          <div className="assignment-description">
            <h3>Description</h3>
            <p>{assignment.description}</p>
          </div>

          <div className="assignment-instructions">
            <h3>Instructions</h3>
            <pre>{assignment.instructions}</pre>
          </div>

          <div className="assignment-requirements">
            <h3>Requirements</h3>
            <ul>
              {assignment.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="assignment-resources">
            <h3>Resources</h3>
            <ul>
              {assignment.resources.map((resource, index) => (
                <li key={index}>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    📄 {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="submission-section">
            <h3>Your Submission</h3>
            
            <div className="form-group">
              <label htmlFor="submission">Code / Answer</label>
              <textarea
                id="submission"
                value={submission}
                onChange={(e) => setSubmission(e.target.value)}
                placeholder="Paste your code or answer here..."
                rows="10"
                required
              />
            </div>

            <div className="form-group">
              <label>Attachments</label>
              <div className="file-upload">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  onChange={handleFileUpload}
                  className="file-input"
                />
                <label htmlFor="file-upload" className="file-label">
                  📎 Choose Files
                </label>
              </div>
              
              {files.length > 0 && (
                <ul className="file-list">
                  {files.map((file, index) => (
                    <li key={index} className="file-item">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">
                        {(file.size / 1024).toFixed(2)} KB
                      </span>
                      <button
                        type="button"
                        className="remove-file"
                        onClick={() => removeFile(index)}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button type="submit" className="submit-assignment-btn">
              Submit Assignment
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CourseAssignment;