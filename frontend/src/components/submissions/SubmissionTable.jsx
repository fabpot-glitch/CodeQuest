// src/components/submissions/SubmissionTable.jsx
import React, { useState } from 'react';
import { 
  CheckCircle, Clock, XCircle, Eye, 
  ChevronDown, ChevronUp, Edit, Trash2,
  User, Award, Calendar, Paperclip, MessageSquare,
  FileText // Added missing import
} from 'lucide-react';

const SubmissionTable = ({ 
  submissions, 
  onView, 
  onEdit, 
  onDelete, 
  onStatusChange,
  selectedItems = [],
  onSelectItem,
  onSelectAll
}) => {
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [expandedRow, setExpandedRow] = useState(null);

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
      'in-review': { color: 'bg-blue-100 text-blue-800', icon: Eye }
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: Clock };
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleRowClick = (submissionId) => {
    // Only toggle if clicking the expand button, but since we don't have one,
    // you might want to add an expand button or handle it differently
    // For now, this function can be used by an expand button
  };

  const sortedSubmissions = [...submissions].sort((a, b) => {
    let aValue, bValue;
    
    switch(sortColumn) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'score':
        aValue = a.score || 0;
        bValue = b.score || 0;
        break;
      case 'date':
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
      case 'user':
        aValue = a.user.name.toLowerCase();
        bValue = b.user.name.toLowerCase();
        break;
      case 'reviewer':
        aValue = a.reviewer?.toLowerCase() || '';
        bValue = b.reviewer?.toLowerCase() || '';
        break;
      default:
        aValue = a[sortColumn];
        bValue = b[sortColumn];
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const columns = [
    { key: 'select', label: '', width: 'w-12' },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'user', label: 'Submitted By', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'score', label: 'Score', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'reviewer', label: 'Reviewer', sortable: true },
    { key: 'actions', label: 'Actions', width: 'w-32' }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${column.width || ''}`}
                >
                  <div className="flex items-center gap-1">
                    {column.key === 'select' ? (
                      <input
                        type="checkbox"
                        checked={submissions.length > 0 && selectedItems.length === submissions.length}
                        onChange={(e) => onSelectAll && onSelectAll(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    ) : (
                      <>
                        <span>{column.label}</span>
                        {column.sortable && (
                          <button
                            onClick={() => handleSort(column.key)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            aria-label={`Sort by ${column.label}`}
                          >
                            {sortColumn === column.key ? (
                              sortDirection === 'asc' ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedSubmissions.map((submission) => (
              <React.Fragment key={submission.id}>
                <tr className="hover:bg-gray-50 transition-colors">
                  {/* Select Checkbox */}
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(submission.id)}
                      onChange={(e) => onSelectItem && onSelectItem(submission.id, e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      aria-label={`Select ${submission.title}`}
                    />
                  </td>

                  {/* Title */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{submission.title}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {submission.tags?.slice(0, 2).map((tag, index) => (
                            <span 
                              key={index}
                              className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {submission.tags?.length > 2 && (
                            <span className="px-1.5 py-0.5 text-gray-500 text-xs">
                              +{submission.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Submitted By */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {submission.user?.avatar || submission.user?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{submission.user?.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{submission.user?.role || 'User'}</p>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    {getStatusBadge(submission.status)}
                  </td>

                  {/* Score */}
                  <td className="px-4 py-3">
                    {submission.score ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-full rounded-full ${
                              submission.score >= 80 ? 'bg-green-500' :
                              submission.score >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(submission.score, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {submission.score}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">—</span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{submission.date}</span>
                    </div>
                  </td>

                  {/* Reviewer */}
                  <td className="px-4 py-3">
                    {submission.reviewer ? (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{submission.reviewer}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Unassigned</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onView && onView(submission)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-blue-600 transition-colors"
                        title="View Details"
                        aria-label={`View ${submission.title}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit && onEdit(submission)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-yellow-600 transition-colors"
                        title="Edit"
                        aria-label={`Edit ${submission.title}`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete && onDelete(submission.id)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600 transition-colors"
                        title="Delete"
                        aria-label={`Delete ${submission.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expanded Row - You'll need to add a way to trigger this */}
                {expandedRow === submission.id && (
                  <tr>
                    <td colSpan={8} className="px-4 py-3 bg-gray-50 border-t">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
                          <p className="text-sm text-gray-600">{submission.description}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Details</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Deadline</p>
                              <p className="text-sm font-medium text-gray-900">{submission.deadline}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Comments</p>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900">{submission.comments || 0}</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Attachments</p>
                              <div className="flex items-center gap-1">
                                <Paperclip className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900">{submission.attachments || 0}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {submission.status === 'pending' && (
                        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
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
                          <button
                            onClick={() => onStatusChange && onStatusChange(submission.id, 'in-review')}
                            className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            Mark for Review
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {submissions.length === 0 && (
        <div className="py-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
          <p className="text-gray-500">Get started by creating a new submission.</p>
        </div>
      )}
    </div>
  );
};

export default SubmissionTable;