import React, { useState } from 'react';

const ResumeReview = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [reviewScore, setReviewScore] = useState(null);

  const reviewCriteria = [
    {
      id: 1,
      category: 'Formatting & Structure',
      tips: [
        'Use a clean, professional font (Arial, Calibri, or Times New Roman)',
        'Keep it to 1-2 pages maximum',
        'Use consistent formatting throughout',
        'Include clear section headers',
        'Use bullet points for easy scanning'
      ],
      score: 0
    },
    {
      id: 2,
      category: 'Contact Information',
      tips: [
        'Include full name, phone number, and email',
        'Add LinkedIn profile URL',
        'Include location (city and state)',
        'Ensure email is professional',
        'Remove unnecessary personal information'
      ],
      score: 0
    },
    {
      id: 3,
      category: 'Professional Summary',
      tips: [
        'Write a compelling 2-3 sentence summary',
        'Highlight key skills and experiences',
        'Tailor it to the job you\'re applying for',
        'Use active voice and strong action words',
        'Quantify achievements when possible'
      ],
      score: 0
    },
    {
      id: 4,
      category: 'Work Experience',
      tips: [
        'List in reverse chronological order',
        'Use action verbs to start each bullet point',
        'Quantify achievements with numbers/percentages',
        'Focus on accomplishments, not just duties',
        'Tailor experience to match job requirements'
      ],
      score: 0
    },
    {
      id: 5,
      category: 'Skills Section',
      tips: [
        'Include both technical and soft skills',
        'Prioritize skills mentioned in job description',
        'Be specific about proficiency levels',
        'Group similar skills together',
        'Keep it relevant to the position'
      ],
      score: 0
    },
    {
      id: 6,
      category: 'Education',
      tips: [
        'List degree, institution, and graduation date',
        'Include GPA if above 3.5',
        'Mention relevant coursework or honors',
        'List certifications and training',
        'Include ongoing education'
      ],
      score: 0
    }
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      // Simulate review score generation
      setTimeout(() => {
        setReviewScore(Math.floor(Math.random() * 20) + 75); // Random score between 75-95
      }, 1500);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return '#27ae60';
    if (score >= 70) return '#f39c12';
    return '#e74c3c';
  };

  return (
    <div className="resume-review">
      <div className="review-header">
        <h2>📄 Resume Review & Optimization</h2>
        <p>Upload your resume for AI-powered analysis and improvement suggestions</p>
      </div>

      <div className="upload-section">
        <div className="upload-box">
          {!uploadedFile ? (
            <label htmlFor="resume-upload" className="upload-label">
              <div className="upload-icon">📁</div>
              <h3>Upload Your Resume</h3>
              <p>Drag and drop or click to browse</p>
              <p className="file-info">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button className="upload-btn">Choose File</button>
            </label>
          ) : (
            <div className="uploaded-file">
              <div className="file-icon">✅</div>
              <div className="file-details">
                <h4>{uploadedFile.name}</h4>
                <p>{(uploadedFile.size / 1024).toFixed(2)} KB</p>
              </div>
              <button 
                className="remove-btn" 
                onClick={() => {
                  setUploadedFile(null);
                  setReviewScore(null);
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {reviewScore && (
          <div className="score-display">
            <div className="score-circle" style={{ borderColor: getScoreColor(reviewScore) }}>
              <div className="score-value" style={{ color: getScoreColor(reviewScore) }}>
                {reviewScore}
              </div>
              <div className="score-label">out of 100</div>
            </div>
            <div className="score-feedback">
              <h3>
                {reviewScore >= 85 ? 'Excellent Resume!' : 
                 reviewScore >= 70 ? 'Good Resume, Room for Improvement' : 
                 'Needs Significant Improvement'}
              </h3>
              <p>
                {reviewScore >= 85 ? 'Your resume is well-structured and professional. Minor tweaks could make it even better!' :
                 reviewScore >= 70 ? 'Your resume has a solid foundation. Follow the tips below to enhance it further.' :
                 'Your resume needs work. Review the suggestions below to significantly improve it.'}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="review-criteria">
        <h3>📝 Resume Review Checklist</h3>
        <p>Use this comprehensive checklist to optimize your resume:</p>

        <div className="criteria-grid">
          {reviewCriteria.map(criteria => (
            <div key={criteria.id} className="criteria-card">
              <div className="criteria-header">
                <h4>{criteria.category}</h4>
                <span className="criteria-badge">{criteria.tips.length} tips</span>
              </div>
              <ul className="tips-list">
                {criteria.tips.map((tip, index) => (
                  <li key={index}>
                    <span className="tip-bullet">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="action-buttons">
        <button className="primary-btn">
          🔍 Get Professional Review
        </button>
        <button className="secondary-btn">
          💡 View Sample Resumes
        </button>
      </div>

      <style>{`
        .resume-review {
          max-width: 1200px;
          margin: 0 auto;
        }

        .review-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .review-header h2 {
          font-size: 2rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .review-header p {
          color: #7f8c8d;
          font-size: 1.1rem;
        }

        .upload-section {
          margin-bottom: 3rem;
        }

        .upload-box {
          background: #f8f9fa;
          border: 3px dashed #cbd5e0;
          border-radius: 12px;
          padding: 3rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .upload-box:hover {
          border-color: #3498db;
          background: #e8f4f8;
        }

        .upload-label {
          cursor: pointer;
          display: block;
        }

        .upload-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .upload-box h3 {
          color: #2c3e50;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .upload-box p {
          color: #7f8c8d;
          margin-bottom: 0.5rem;
        }

        .file-info {
          font-size: 0.85rem;
          color: #95a5a6;
        }

        .upload-btn {
          background: #3498db;
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          margin-top: 1rem;
          transition: all 0.3s ease;
        }

        .upload-btn:hover {
          background: #2980b9;
          transform: scale(1.05);
        }

        .uploaded-file {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
        }

        .file-icon {
          font-size: 3rem;
        }

        .file-details {
          flex-grow: 1;
          text-align: left;
        }

        .file-details h4 {
          color: #2c3e50;
          margin: 0 0 0.25rem 0;
        }

        .file-details p {
          color: #7f8c8d;
          margin: 0;
          font-size: 0.9rem;
        }

        .remove-btn {
          background: #e74c3c;
          color: white;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }

        .remove-btn:hover {
          background: #c0392b;
          transform: scale(1.1);
        }

        .score-display {
          display: flex;
          gap: 2rem;
          align-items: center;
          background: white;
          padding: 2rem;
          border-radius: 12px;
          margin-top: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .score-circle {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          border: 8px solid;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .score-value {
          font-size: 3rem;
          font-weight: 700;
        }

        .score-label {
          color: #7f8c8d;
          font-size: 0.85rem;
        }

        .score-feedback {
          text-align: left;
        }

        .score-feedback h3 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .score-feedback p {
          color: #7f8c8d;
          line-height: 1.6;
        }

        .review-criteria {
          margin: 3rem 0;
        }

        .review-criteria h3 {
          font-size: 1.5rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .review-criteria > p {
          color: #7f8c8d;
          margin-bottom: 2rem;
        }

        .criteria-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .criteria-card {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1.5rem;
          border: 2px solid #e0e0e0;
          transition: all 0.3s ease;
        }

        .criteria-card:hover {
          border-color: #3498db;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .criteria-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #e0e0e0;
        }

        .criteria-header h4 {
          color: #2c3e50;
          margin: 0;
          font-size: 1.1rem;
        }

        .criteria-badge {
          background: #3498db;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .tips-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .tips-list li {
          color: #555;
          padding: 0.5rem 0;
          display: flex;
          gap: 0.5rem;
          line-height: 1.5;
        }

        .tip-bullet {
          color: #3498db;
          font-weight: bold;
          flex-shrink: 0;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 3rem;
        }

        .primary-btn, .secondary-btn {
          padding: 1rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .primary-btn {
          background: #3498db;
          color: white;
        }

        .primary-btn:hover {
          background: #2980b9;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
        }

        .secondary-btn {
          background: white;
          color: #3498db;
          border: 2px solid #3498db;
        }

        .secondary-btn:hover {
          background: #e8f4f8;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .upload-box {
            padding: 2rem 1rem;
          }

          .score-display {
            flex-direction: column;
            text-align: center;
          }

          .score-feedback {
            text-align: center;
          }

          .criteria-grid {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
          }

          .primary-btn, .secondary-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumeReview;