import React, { useState } from 'react';

const Milestones = ({ milestones = [], onUpdate }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    name: '',
    description: '',
    category: 'session',
    target: 0,
    icon: '🏆'
  });

  const categories = [
    { id: 'session', name: 'Sessions', icon: '🎯' },
    { id: 'score', name: 'Score', icon: '⭐' },
    { id: 'skill', name: 'Skill', icon: '📚' },
    { id: 'streak', name: 'Streak', icon: '🔥' },
    { id: 'time', name: 'Time', icon: '⏱️' }
  ];

  const icons = ['🏆', '🎯', '⭐', '🔥', '📚', '💪', '🚀', '🎉', '💯', '🌟'];

  const handleAddMilestone = () => {
    if (newMilestone.name && newMilestone.target) {
      const updatedMilestones = [
        ...milestones,
        {
          id: Date.now(),
          ...newMilestone,
          achieved: false,
          progress: 0,
          createdAt: new Date().toISOString()
        }
      ];
      onUpdate(updatedMilestones);
      setShowAddModal(false);
      setNewMilestone({ name: '', description: '', category: 'session', target: 0, icon: '🏆' });
    }
  };

  const handleToggleAchieved = (milestoneId) => {
    const updatedMilestones = milestones.map(m => {
      if (m.id === milestoneId) {
        return { ...m, achieved: !m.achieved, achievedDate: !m.achieved ? new Date().toISOString() : null };
      }
      return m;
    });
    onUpdate(updatedMilestones);
  };

  const handleDeleteMilestone = (milestoneId) => {
    if (window.confirm('Are you sure you want to delete this milestone?')) {
      const updatedMilestones = milestones.filter(m => m.id !== milestoneId);
      onUpdate(updatedMilestones);
    }
  };

  const achieved = milestones.filter(m => m.achieved);
  const inProgress = milestones.filter(m => !m.achieved);

  return (
    <div className="milestones-tab">
      <div className="milestones-header">
        <h3>Milestones</h3>
        <button className="add-milestone-btn" onClick={() => setShowAddModal(true)}>
          + Add Milestone
        </button>
      </div>

      {/* Stats Overview */}
      <div className="milestones-stats">
        <div className="stat-card">
          <span className="stat-icon">🏆</span>
          <div className="stat-info">
            <span className="stat-label">Total</span>
            <span className="stat-value">{milestones.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <div className="stat-info">
            <span className="stat-label">Achieved</span>
            <span className="stat-value">{achieved.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⏳</span>
          <div className="stat-info">
            <span className="stat-label">In Progress</span>
            <span className="stat-value">{inProgress.length}</span>
          </div>
        </div>
      </div>

      {/* Achieved Milestones */}
      {achieved.length > 0 && (
        <div className="milestones-section">
          <h4>Achieved Milestones</h4>
          <div className="achieved-grid">
            {achieved.map(milestone => (
              <div key={milestone.id} className="achieved-card">
                <div className="milestone-icon">{milestone.icon || '🏆'}</div>
                <div className="milestone-content">
                  <h5>{milestone.name}</h5>
                  {milestone.description && <p>{milestone.description}</p>}
                  <span className="achieved-date">
                    Achieved: {new Date(milestone.achievedDate).toLocaleDateString()}
                  </span>
                </div>
                <button 
                  className="milestone-action"
                  onClick={() => handleToggleAchieved(milestone.id)}
                  title="Mark as unachieved"
                >
                  ↩️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* In Progress Milestones */}
      {inProgress.length > 0 && (
        <div className="milestones-section">
          <h4>In Progress</h4>
          <div className="milestones-grid">
            {inProgress.map(milestone => (
              <div key={milestone.id} className="milestone-card">
                <div className="milestone-header">
                  <div className="milestone-icon">{milestone.icon || '🎯'}</div>
                  <div className="milestone-title">
                    <h5>{milestone.name}</h5>
                    {milestone.description && <p>{milestone.description}</p>}
                  </div>
                  <button 
                    className="milestone-delete"
                    onClick={() => handleDeleteMilestone(milestone.id)}
                  >
                    ×
                  </button>
                </div>

                <div className="milestone-category">
                  <span className="category-badge" data-category={milestone.category}>
                    {categories.find(c => c.id === milestone.category)?.icon} {milestone.category}
                  </span>
                </div>

                <div className="milestone-progress">
                  <div className="progress-header">
                    <span>Progress</span>
                    <span>{milestone.progress || 0}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${milestone.progress || 0}%` }}
                    ></div>
                  </div>
                </div>

                <button 
                  className="achieved-btn"
                  onClick={() => handleToggleAchieved(milestone.id)}
                >
                  Mark as Achieved
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {milestones.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏆</div>
          <h4>No Milestones Yet</h4>
          <p>Create your first milestone to track your achievements</p>
        </div>
      )}

      {/* Add Milestone Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Milestone</h3>
            
            <div className="form-group">
              <label>Milestone Name</label>
              <input 
                type="text" 
                value={newMilestone.name}
                onChange={(e) => setNewMilestone({ ...newMilestone, name: e.target.value })}
                placeholder="e.g., Complete 10 technical interviews"
              />
            </div>

            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea 
                value={newMilestone.description}
                onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                placeholder="Describe this milestone"
                rows="2"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={newMilestone.category}
                  onChange={(e) => setNewMilestone({ ...newMilestone, category: e.target.value })}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Target Value</label>
                <input 
                  type="number" 
                  value={newMilestone.target}
                  onChange={(e) => setNewMilestone({ ...newMilestone, target: parseInt(e.target.value) })}
                  placeholder="Target"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Choose Icon</label>
              <div className="icon-selector">
                {icons.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    className={`icon-btn ${newMilestone.icon === icon ? 'active' : ''}`}
                    onClick={() => setNewMilestone({ ...newMilestone, icon })}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleAddMilestone}>
                Add Milestone
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Milestones;