// src/components/submissions/SubmissionActions.jsx
import React from 'react';
import { 
  Download, Trash2, CheckCircle, XCircle, 
  Eye, Filter, ChevronDown, MoreVertical,
  Grid, List, Share2, Mail, Tag, Users
} from 'lucide-react';

const SubmissionActions = ({ 
  selectedCount, 
  onBulkAction,
  viewMode,
  onViewModeChange,
  onExportAll 
}) => {
  const handleAction = (action) => {
    if (selectedCount === 0 && action !== 'export-all') {
      alert('Please select submissions first');
      return;
    }
    onBulkAction(action);
  };

  const bulkActions = [
    { id: 'approve', label: 'Approve Selected', icon: CheckCircle, color: 'text-green-600 hover:bg-green-50' },
    { id: 'reject', label: 'Reject Selected', icon: XCircle, color: 'text-red-600 hover:bg-red-50' },
    { id: 'mark-review', label: 'Mark for Review', icon: Eye, color: 'text-blue-600 hover:bg-blue-50' },
    { id: 'export', label: 'Export Selected', icon: Download, color: 'text-gray-600 hover:bg-gray-50' },
    { id: 'delete', label: 'Delete Selected', icon: Trash2, color: 'text-red-600 hover:bg-red-50' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Selection Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedCount > 0}
              onChange={(e) => onBulkAction(e.target.checked ? 'select-all' : 'deselect-all')}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-900">
              {selectedCount > 0 ? `${selectedCount} selected` : 'Select submissions'}
            </span>
          </div>
          
          {selectedCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleAction('approve')}
                  className="px-3 py-1.5 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleAction('reject')}
                  className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={() => handleAction('delete')}
                  className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* More Actions */}
          <div className="relative group">
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm">
              <MoreVertical className="w-4 h-4" />
              More
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <button
                onClick={onExportAll}
                className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                Export All Submissions
              </button>
              <button className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 text-sm">
                <Share2 className="w-4 h-4" />
                Share Report
              </button>
              <button className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4" />
                Email Summary
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              <button className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 text-sm">
                <Trash2 className="w-4 h-4" />
                Delete All
              </button>
            </div>
          </div>

          {/* Quick Assign */}
          <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Users className="w-4 h-4" />
            Assign Reviewers
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar - Shows when items are selected */}
      {selectedCount > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Bulk actions:</span>
              <div className="flex flex-wrap gap-1">
                {bulkActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleAction(action.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors ${action.color}`}
                  >
                    <action.icon className="w-3.5 h-3.5" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => handleAction('deselect-all')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionActions;