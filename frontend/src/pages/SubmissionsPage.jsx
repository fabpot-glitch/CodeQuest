// src/pages/SubmissionsPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Plus, Filter, Grid, List, Download, Search, 
  RefreshCw, TrendingUp, AlertTriangle, CheckCircle,
  Clock, XCircle, Users, Award, Calendar, FileText,
  ChevronDown, BarChart, PieChart, Eye
} from 'lucide-react';

// Import each component individually
import SubmissionCard from '../components/submissions/SubmissionCard';
import SubmissionTable from '../components/submissions/SubmissionTable';
import SubmissionFilters from '../components/submissions/SubmissionFilters';
import SubmissionStats from '../components/submissions/SubmissionStats';
import SubmissionForm from '../components/submissions/SubmissionForm';
import SubmissionActions from '../components/submissions/SubmissionActions';
import SubmissionDetail from '../components/submissions/SubmissionDetail';

const SubmissionsPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    score: 'all',
    dateRange: 'all',
    tags: [],
    reviewer: 'all',
    search: ''
  });
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    inReview: 0,
    avgScore: 0,
    avgReviewTime: '2.5 days'
  });

  // Simple mock data for testing
  const mockSubmissions = [
    {
      id: 'SUB-001',
      title: 'Machine Learning Project: Image Classification',
      user: { name: 'Alex Chen', avatar: 'A', role: 'ML Engineer' },
      status: 'approved',
      date: '2024-01-15',
      score: 95,
      tags: ['AI', 'Python', 'TensorFlow'],
      description: 'Implementation of a convolutional neural network for image classification.',
      comments: 12,
      attachments: 3,
      reviewer: 'Sarah Johnson',
      priority: 'high',
      category: 'AI/ML'
    },
    {
      id: 'SUB-002',
      title: 'E-commerce Platform UI Redesign',
      user: { name: 'Maria Garcia', avatar: 'M', role: 'UI/UX Designer' },
      status: 'pending',
      date: '2024-01-16',
      score: null,
      tags: ['UI/UX', 'Figma', 'React'],
      description: 'Complete redesign of the shopping cart and checkout flow.',
      comments: 5,
      attachments: 5,
      reviewer: 'Mike Wilson',
      priority: 'medium',
      category: 'Design'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSubmissions(mockSubmissions);
      setFilteredSubmissions(mockSubmissions);
      calculateStats(mockSubmissions);
      setLoading(false);
    }, 1000);
  }, []);

  const calculateStats = (data) => {
    setStats({
      total: data.length,
      pending: data.filter(s => s.status === 'pending').length,
      approved: data.filter(s => s.status === 'approved').length,
      rejected: data.filter(s => s.status === 'rejected').length,
      inReview: data.filter(s => s.status === 'in-review').length,
      avgScore: 85,
      avgReviewTime: '2.5 days'
    });
  };

  const applyFilters = () => {
    let filtered = [...submissions];
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(sub => sub.status === filters.status);
    }
    
    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(sub => 
        sub.title.toLowerCase().includes(query) ||
        sub.user.name.toLowerCase().includes(query)
      );
    }
    
    setFilteredSubmissions(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, submissions]);

  const handleCreateSubmission = (data) => {
    const newSubmission = {
      id: `SUB-${String(submissions.length + 1).padStart(3, '0')}`,
      ...data,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      score: null,
      comments: 0,
      user: { name: 'Current User', avatar: 'CU', role: 'User' },
      reviewer: null
    };
    
    const updated = [newSubmission, ...submissions];
    setSubmissions(updated);
    setFilteredSubmissions([newSubmission, ...filteredSubmissions]);
    calculateStats(updated);
    setShowForm(false);
  };

  const handleUpdateSubmission = (id, data) => {
    const updated = submissions.map(sub => 
      sub.id === id ? { ...sub, ...data } : sub
    );
    setSubmissions(updated);
    applyFilters();
    calculateStats(updated);
    setSelectedSubmission(null);
    setShowForm(false);
  };

  const handleDeleteSubmission = (id) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      const updated = submissions.filter(sub => sub.id !== id);
      setSubmissions(updated);
      setFilteredSubmissions(filteredSubmissions.filter(sub => sub.id !== id));
      calculateStats(updated);
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = submissions.map(sub => 
      sub.id === id ? { ...sub, status: newStatus } : sub
    );
    setSubmissions(updated);
    applyFilters();
    calculateStats(updated);
  };

  const handleSelectItem = (id, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(filteredSubmissions.map(sub => sub.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'approve':
        selectedItems.forEach(id => handleStatusChange(id, 'approved'));
        alert(`${selectedItems.length} submissions approved`);
        break;
      case 'reject':
        selectedItems.forEach(id => handleStatusChange(id, 'rejected'));
        alert(`${selectedItems.length} submissions rejected`);
        break;
      case 'delete':
        if (window.confirm(`Delete ${selectedItems.length} submissions?`)) {
          selectedItems.forEach(id => handleDeleteSubmission(id));
          setSelectedItems([]);
        }
        break;
    }
  };

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setShowDetail(true);
  };

  const handleEditSubmission = (submission) => {
    setSelectedSubmission(submission);
    setShowForm(true);
  };

  const handleNewSubmissionClick = () => {
    setSelectedSubmission(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Submissions</h1>
            <p className="text-gray-600 mt-1">Manage and review all submissions</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleNewSubmissionClick}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Submission
            </button>
            
            <button
              onClick={() => setLoading(!loading)}
              className="p-2.5 hover:bg-gray-200 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading submissions...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Simple view toggle for testing */}
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {filteredSubmissions.length} submissions
              </p>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Test each component individually */}
            {viewMode === 'grid' && filteredSubmissions.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSubmissions.map((submission) => (
                  <SubmissionCard
                    key={submission.id}
                    submission={submission}
                    onView={() => handleViewSubmission(submission)}
                    onEdit={() => handleEditSubmission(submission)}
                    onDelete={() => handleDeleteSubmission(submission.id)}
                  />
                ))}
              </div>
            )}

            {viewMode === 'list' && filteredSubmissions.length > 0 && (
              <SubmissionTable
                submissions={filteredSubmissions}
                onView={handleViewSubmission}
                onEdit={handleEditSubmission}
                onDelete={handleDeleteSubmission}
                selectedItems={selectedItems}
                onSelectItem={handleSelectItem}
                onSelectAll={handleSelectAll}
              />
            )}

            {filteredSubmissions.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
                <button
                  onClick={handleNewSubmissionClick}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create First Submission
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <SubmissionForm
          submission={selectedSubmission}
          onSubmit={selectedSubmission ? 
            (data) => handleUpdateSubmission(selectedSubmission.id, data) : 
            handleCreateSubmission
          }
          onClose={() => {
            setShowForm(false);
            setSelectedSubmission(null);
          }}
        />
      )}

      {showDetail && selectedSubmission && (
        <SubmissionDetail
          submission={selectedSubmission}
          onClose={() => {
            setShowDetail(false);
            setSelectedSubmission(null);
          }}
        />
      )}
    </div>
  );
};

export default SubmissionsPage;