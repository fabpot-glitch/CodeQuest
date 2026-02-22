// src/components/submissions/SubmissionDetail.jsx
import React from 'react';
import { 
  X, CheckCircle, XCircle, Clock, Eye, 
  User, Calendar, Paperclip, MessageSquare,
  Award, Tag, Share2, Download, Edit,
  AlertCircle, CalendarDays, Flag, Folder,
  BarChart, Users, FileText, Send, Star
} from 'lucide-react';

const SubmissionDetail = ({ submission, onClose, onStatusChange, onEdit, onDelete }) => {
  const getStatusConfig = (status) => {
    const config = {
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Approved' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' },
      'in-review': { color: 'bg-blue-100 text-blue-800', icon: Eye, label: 'In Review' }
    };
    return config[status] || { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Pending' };
  };

  const getPriorityConfig = (priority) => {
    const config = {
      high: { color: 'bg-red-100 text-red-800', icon: Flag },
      medium: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      low: { color: 'bg-green-100 text-green-800', icon: Flag }
    };
    return config[priority] || { color: 'bg-gray-100 text-gray-800', icon: Flag };
  };

  const statusConfig = getStatusConfig(submission.status);
  const priorityConfig = getPriorityConfig(submission.priority);
  const StatusIcon = statusConfig.icon;
  const PriorityIcon = priorityConfig.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-8 relative transform transition-all">
        
        {/* Close Button - Positioned with more space */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-20 p-3 hover:bg-gray-100 rounded-full transition-colors bg-white shadow-sm"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>

        {/* Header Section - Adjusted padding to move content down */}
        <div className="pt-8 px-8 pb-6 border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${statusConfig.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  {statusConfig.label}
                </div>
                {submission.priority && (
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${priorityConfig.color}`}>
                    <PriorityIcon className="w-4 h-4" />
                    {submission.priority.charAt(0).toUpperCase() + submission.priority.slice(1)} Priority
                  </div>
                )}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
                  <Folder className="w-4 h-4" />
                  {submission.category || 'General'}
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{submission.title}</h1>
              
              <div className="flex items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {submission.user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <span className="font-medium">{submission.user?.name || 'Unknown User'}</span>
                    <span className="text-sm ml-2">{submission.user?.role || 'User'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Submitted: {submission.date}</span>
                </div>
                {submission.score && (
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold text-blue-600">Score: {submission.score}%</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-4 mt-2">
              <button 
                className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Edit"
                onClick={() => onEdit && onEdit(submission)}
              >
                <Edit className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Share"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Description
                </h2>
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{submission.description}</p>
                </div>
              </div>

              {/* Tags */}
              {submission.tags && submission.tags.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Tags
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {submission.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg font-medium text-sm border border-blue-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Status Actions */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Status Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => onStatusChange && onStatusChange(submission.id, 'approved')}
                    className="w-full flex items-center justify-between px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Approve</span>
                    </div>
                    <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">✓</span>
                  </button>
                  <button
                    onClick={() => onStatusChange && onStatusChange(submission.id, 'rejected')}
                    className="w-full flex items-center justify-between px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <XCircle className="w-5 h-5" />
                      <span className="font-medium">Reject</span>
                    </div>
                    <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">✗</span>
                  </button>
                  <button
                    onClick={() => onStatusChange && onStatusChange(submission.id, 'in-review')}
                    className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5" />
                      <span className="font-medium">Mark for Review</span>
                    </div>
                    <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">👁️</span>
                  </button>
                  <button
                    onClick={() => onStatusChange && onStatusChange(submission.id, 'pending')}
                    className="w-full flex items-center justify-between px-4 py-3 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">Set Pending</span>
                    </div>
                    <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">⏰</span>
                  </button>
                </div>
              </div>

              {/* Reviewer Info */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Reviewer</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {submission.reviewer ? submission.reviewer.charAt(0) : '?'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {submission.reviewer || 'Unassigned'}
                      </p>
                      <p className="text-sm text-gray-600">Reviewer</p>
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-700">Pending review</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Timeline</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">Submitted</span>
                    </div>
                    <span className="font-medium text-gray-900">{submission.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">Deadline</span>
                    </div>
                    <span className="font-medium text-gray-900">{submission.deadline || 'No deadline'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">Priority</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityConfig.color}`}>
                      {submission.priority?.toUpperCase() || 'MEDIUM'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Folder className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Category</span>
                    </div>
                    <p className="font-bold text-lg text-gray-900">{submission.category || 'General'}</p>
                  </div>
                  
                  {submission.score && (
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-700">Score</span>
                      </div>
                      <p className="font-bold text-2xl text-blue-700">{submission.score}</p>
                    </div>
                  )}

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-purple-700">Comments</span>
                    </div>
                    <p className="font-bold text-2xl text-purple-700">{submission.comments || 0}</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Paperclip className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700">Attachments</span>
                    </div>
                    <p className="font-bold text-2xl text-green-700">{submission.attachments || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t px-8 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-gray-600">
              <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-medium">
                ID: {submission.id}
              </span>
              <span className="text-sm">Last updated: {submission.date}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onDelete && onDelete(submission.id)}
                className="px-5 py-2.5 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors border border-red-200 hover:border-red-300"
              >
                Delete
              </button>
              <button
                onClick={() => onEdit && onEdit(submission)}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow"
              >
                Edit Submission
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetail;