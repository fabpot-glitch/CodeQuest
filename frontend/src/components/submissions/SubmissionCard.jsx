// src/components/submissions/SubmissionCard.jsx
import React from 'react';
import { 
  CheckCircle, Clock, XCircle, Eye, MessageSquare, 
  Paperclip, Edit, Trash2, User, Award, Calendar
} from 'lucide-react';

const SubmissionCard = ({ 
  submission, 
  onView, 
  onEdit, 
  onDelete, 
  onStatusChange,
  showActions = true 
}) => {
  const getStatusInfo = (status) => {
    switch(status) {
      case 'approved':
        return { 
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="w-4 h-4" />,
          label: 'Approved'
        };
      case 'pending':
        return { 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Clock className="w-4 h-4" />,
          label: 'Pending'
        };
      case 'rejected':
        return { 
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle className="w-4 h-4" />,
          label: 'Rejected'
        };
      case 'in-review':
        return { 
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <Eye className="w-4 h-4" />,
          label: 'In Review'
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <Clock className="w-4 h-4" />,
          label: 'Unknown'
        };
    }
  };

  const statusInfo = getStatusInfo(submission.status);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
              {submission.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                {statusInfo.icon}
                {statusInfo.label}
              </span>
              {submission.score && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                  <Award className="w-3 h-3" />
                  {submission.score}%
                </span>
              )}
            </div>
          </div>
          
          {showActions && (
            <div className="flex gap-1">
              <button
                onClick={() => onEdit && onEdit(submission)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-blue-600 transition-colors"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete && onDelete(submission.id)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {submission.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {submission.tags.map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
            {submission.user.avatar}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{submission.user.name}</p>
            <p className="text-xs text-gray-500">{submission.user.role}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Submitted</p>
            <p className="text-sm font-medium text-gray-900">{submission.date}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">{submission.comments}</span>
            </div>
            <p className="text-xs text-gray-500">Comments</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
              <Paperclip className="w-4 h-4" />
              <span className="text-sm font-medium">{submission.attachments}</span>
            </div>
            <p className="text-xs text-gray-500">Files</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">{submission.deadline}</span>
            </div>
            <p className="text-xs text-gray-500">Deadline</p>
          </div>
        </div>

        {/* Reviewer */}
        {submission.reviewer && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Assigned to</p>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">{submission.reviewer}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 rounded-b-xl border-t border-gray-100">
        <div className="flex justify-between items-center">
          <button
            onClick={() => onView && onView(submission)}
            className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            View Details
          </button>
          
          {showActions && submission.status === 'pending' && (
            <div className="flex gap-2">
              <button
                onClick={() => onStatusChange && onStatusChange(submission.id, 'approved')}
                className="px-3 py-1.5 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => onStatusChange && onStatusChange(submission.id, 'rejected')}
                className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionCard;