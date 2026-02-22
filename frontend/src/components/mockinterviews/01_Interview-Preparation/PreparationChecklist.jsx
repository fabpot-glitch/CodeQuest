import React, { useState, useEffect } from 'react';

const PreparationChecklist = () => {
  const [checklist, setChecklist] = useState([
    {
      id: 1,
      category: 'Before Interview',
      items: [
        { id: 101, text: 'Research the company and its products/services', checked: false },
        { id: 102, text: 'Review the job description thoroughly', checked: false },
        { id: 103, text: 'Prepare your resume and have multiple copies', checked: false },
        { id: 104, text: 'Prepare answers to common interview questions', checked: false },
        { id: 105, text: 'Prepare 3-5 STAR method stories', checked: false },
        { id: 106, text: 'Prepare questions to ask the interviewer', checked: false },
        { id: 107, text: 'Plan your outfit and ensure it\'s clean/pressed', checked: false },
        { id: 108, text: 'Know the interview location and travel time', checked: false },
      ]
    },
    {
      id: 2,
      category: 'Day Before',
      items: [
        { id: 201, text: 'Confirm interview time and location', checked: false },
        { id: 202, text: 'Prepare your bag with necessary documents', checked: false },
        { id: 203, text: 'Get a good night\'s sleep', checked: false },
        { id: 204, text: 'Review your notes and preparation materials', checked: false },
      ]
    },
    {
      id: 3,
      category: 'Day Of Interview',
      items: [
        { id: 301, text: 'Arrive 10-15 minutes early', checked: false },
        { id: 302, text: 'Bring extra copies of your resume', checked: false },
        { id: 303, text: 'Bring a notebook and pen', checked: false },
        { id: 304, text: 'Turn off your phone or put it on silent', checked: false },
        { id: 305, text: 'Have a positive attitude and smile', checked: false },
      ]
    },
    {
      id: 4,
      category: 'During Interview',
      items: [
        { id: 401, text: 'Make good eye contact', checked: false },
        { id: 402, text: 'Listen carefully to questions', checked: false },
        { id: 403, text: 'Use the STAR method for behavioral questions', checked: false },
        { id: 404, text: 'Ask clarifying questions if needed', checked: false },
        { id: 405, text: 'Take notes during the conversation', checked: false },
        { id: 406, text: 'Ask your prepared questions', checked: false },
      ]
    },
    {
      id: 5,
      category: 'After Interview',
      items: [
        { id: 501, text: 'Send a thank you email within 24 hours', checked: false },
        { id: 502, text: 'Reflect on what went well and what to improve', checked: false },
        { id: 503, text: 'Follow up if you don\'t hear back in the specified timeframe', checked: false },
      ]
    }
  ]);

  const handleToggle = (categoryId, itemId) => {
    setChecklist(prevChecklist =>
      prevChecklist.map(category =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map(item =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              )
            }
          : category
      )
    );
  };

  const calculateProgress = () => {
    const totalItems = checklist.reduce((acc, category) => acc + category.items.length, 0);
    const checkedItems = checklist.reduce(
      (acc, category) => acc + category.items.filter(item => item.checked).length,
      0
    );
    return totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
  };

  const getCategoryProgress = (category) => {
    const total = category.items.length;
    const checked = category.items.filter(item => item.checked).length;
    return `${checked}/${total}`;
  };

  return (
    <div className="preparation-checklist">
      <div className="checklist-header">
        <h2>📋 Interview Preparation Checklist</h2>
        <p>Track your preparation progress and ensure you're ready for the big day!</p>
        
        <div className="overall-progress">
          <div className="progress-label">
            <span>Overall Progress</span>
            <span className="progress-percentage">{calculateProgress()}%</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>
      </div>

      <div className="checklist-categories">
        {checklist.map(category => (
          <div key={category.id} className="category-section">
            <div className="category-header">
              <h3>{category.category}</h3>
              <span className="category-progress">
                {getCategoryProgress(category)} completed
              </span>
            </div>
            <div className="checklist-items">
              {category.items.map(item => (
                <div key={item.id} className="checklist-item">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleToggle(category.id, item.id)}
                    />
                    <span className="checkmark"></span>
                    <span className={`item-text ${item.checked ? 'checked' : ''}`}>
                      {item.text}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .preparation-checklist {
          max-width: 900px;
          margin: 0 auto;
        }

        .checklist-header {
          margin-bottom: 2rem;
        }

        .checklist-header h2 {
          font-size: 2rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .checklist-header p {
          color: #7f8c8d;
          font-size: 1.1rem;
        }

        .overall-progress {
          margin-top: 1.5rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          color: white;
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          font-weight: 600;
        }

        .progress-percentage {
          font-size: 1.5rem;
        }

        .progress-bar-container {
          background: rgba(255, 255, 255, 0.3);
          height: 12px;
          border-radius: 6px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: white;
          transition: width 0.5s ease;
          border-radius: 6px;
        }

        .checklist-categories {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .category-section {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1.5rem;
          border: 2px solid #e0e0e0;
        }

        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #e0e0e0;
        }

        .category-header h3 {
          font-size: 1.3rem;
          color: #2c3e50;
          margin: 0;
        }

        .category-progress {
          background: #3498db;
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .checklist-items {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .checklist-item {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .checklist-item:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .checkbox-container {
          display: flex;
          align-items: center;
          cursor: pointer;
          position: relative;
          padding-left: 35px;
          user-select: none;
        }

        .checkbox-container input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        .checkmark {
          position: absolute;
          left: 0;
          height: 22px;
          width: 22px;
          background-color: white;
          border: 2px solid #3498db;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .checkbox-container:hover .checkmark {
          background-color: #e8f4f8;
        }

        .checkbox-container input:checked ~ .checkmark {
          background-color: #3498db;
        }

        .checkmark:after {
          content: "";
          position: absolute;
          display: none;
        }

        .checkbox-container input:checked ~ .checkmark:after {
          display: block;
        }

        .checkbox-container .checkmark:after {
          left: 6px;
          top: 2px;
          width: 6px;
          height: 11px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .item-text {
          color: #2c3e50;
          font-size: 1rem;
          line-height: 1.5;
          transition: all 0.3s ease;
        }

        .item-text.checked {
          color: #95a5a6;
          text-decoration: line-through;
        }

        @media (max-width: 768px) {
          .checklist-header h2 {
            font-size: 1.5rem;
          }

          .category-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .category-section {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PreparationChecklist;