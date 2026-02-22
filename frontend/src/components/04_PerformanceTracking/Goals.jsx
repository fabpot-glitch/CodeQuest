import React, { useState } from 'react';

const Goals = ({ goals = [], onUpdate }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: 0,
    current: 0,
    deadline: '',
    category: 'sessions'
  });

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.target) {
      const updatedGoals = [
        ...goals,
        {
          id: Date.now(),
          ...newGoal,
          progress: (newGoal.current / newGoal.target) * 100,
          createdAt: new Date().toISOString()
        }
      ];
      onUpdate(updatedGoals);
      setShowAddModal(false);
      setNewGoal({ name: '', target: 0, current: 0, deadline: '', category: 'sessions' });
    }
  };

  const handleDeleteGoal = (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      const updatedGoals = goals.filter(g => g.id !== goalId);
      onUpdate(updatedGoals);
    }
  };

  const updateGoalProgress = (goalId, newProgress) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const current = Math.min(goal.target, newProgress);
        return {
          ...goal,
          current,
          progress: (current / goal.target) * 100
        };
      }
      return goal;
    });
    onUpdate(updatedGoals);
  };

  return (
    <div className="goals-tab">
      <div className="goals-header">
        <h3>Learning Goals</h3>
        <button className="add-goal-btn" onClick={() => setShowAddModal(true)}>
          + Add New Goal
        </button>
      </div>

      {/* Goals Progress Overview */}
      <div className="goals-overview">
        <div className="overview-card">
          <span className="overview-label">Total Goals</span>
          <span className="overview-value">{goals.length}</span>
        </div>
        <div className="overview-card">
          <span className="overview-label">Completed</span>
          <span className="overview-value">{goals.filter(g => g.progress >= 100).length}</span>
        </div>
        <div className="overview-card">
          <span className="overview-label">In Progress</span>
          <span className="overview-value">{goals.filter(g => g.progress < 100 && g.progress > 0).length}</span>
        </div>
        <div className="overview-card">
          <span className="overview-label">Not Started</span>
          <span className="overview-value">{goals.filter(g => g.progress === 0).length}</span>
        </div>
      </div>

      {/* Goals List */}
      <div className="goals-list">
        {goals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <h4>No Goals Set</h4>
            <p>Start by adding your first learning goal</p>
          </div>
        ) : (
          goals.map(goal => (
            <div key={goal.id} className="goal-card">
              <div className="goal-header">
                <div className="goal-title">
                  <h4>{goal.name}</h4>
                  <span className={`goal-category ${goal.category}`}>
                    {goal.category}
                  </span>
                </div>
                <button 
                  className="goal-delete"
                  onClick={() => handleDeleteGoal(goal.id)}
                >
                  ×
                </button>
              </div>

              <div className="goal-progress">
                <div className="progress-header">
                  <span>Progress</span>
                  <span>{Math.round(goal.progress || 0)}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${goal.progress || 0}%`,
                      backgroundColor: goal.progress >= 80 ? '#10b981' : 
                                     goal.progress >= 50 ? '#f59e0b' : '#ef4444'
                    }}
                  ></div>
                </div>
              </div>

              <div className="goal-details">
                <div className="goal-detail">
                  <span className="detail-label">Current:</span>
                  <span className="detail-value">{goal.current || 0}</span>
                </div>
                <div className="goal-detail">
                  <span className="detail-label">Target:</span>
                  <span className="detail-value">{goal.target}</span>
                </div>
                {goal.deadline && (
                  <div className="goal-detail">
                    <span className="detail-label">Deadline:</span>
                    <span className="detail-value">{new Date(goal.deadline).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Quick Progress Update */}
              <div className="quick-update">
                <input 
                  type="range" 
                  min="0" 
                  max={goal.target}
                  value={goal.current || 0}
                  onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value))}
                  className="progress-slider"
                />
                <div className="slider-value">{goal.current || 0} / {goal.target}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Goal</h3>
            
            <div className="form-group">
              <label>Goal Name</label>
              <input 
                type="text" 
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                placeholder="e.g., Complete 20 practice sessions"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select 
                value={newGoal.category}
                onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
              >
                <option value="sessions">Sessions</option>
                <option value="score">Average Score</option>
                <option value="hours">Practice Hours</option>
                <option value="skill">Skill Mastery</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Target</label>
                <input 
                  type="number" 
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) })}
                  placeholder="Target"
                />
              </div>
              <div className="form-group">
                <label>Current</label>
                <input 
                  type="number" 
                  value={newGoal.current}
                  onChange={(e) => setNewGoal({ ...newGoal, current: parseInt(e.target.value) })}
                  placeholder="Current"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Deadline (Optional)</label>
              <input 
                type="date" 
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              />
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleAddGoal}>
                Save Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;