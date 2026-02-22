// src/components/submissions/SubmissionForm.jsx
import React, { useState, useEffect } from 'react';
import { 
  X, Upload, Paperclip, Tag, Users, Calendar,
  AlertCircle, CheckCircle, Globe, Lock, Star,
  Image, FileText, Code, Palette, Database,
  Smartphone, Server, Shield
} from 'lucide-react';

const SubmissionForm = ({ submission, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium',
    tags: [],
    attachments: 0,
    visibility: 'private',
    deadline: '',
    reviewer: '',
    category: 'Web Development'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);

  useEffect(() => {
    if (submission) {
      setFormData({
        title: submission.title,
        description: submission.description,
        category: submission.category || 'general',
        priority: submission.priority || 'medium',
        tags: submission.tags || [],
        attachments: submission.attachments || 0,
        visibility: 'private',
        deadline: submission.deadline || '',
        reviewer: submission.reviewer || '',
        category: submission.category || 'Web Development'
      });
    }
  }, [submission]);

  const categories = [
    { value: 'Web Development', label: 'Web Development', icon: Globe },
    { value: 'AI/ML', label: 'AI/ML', icon: Code },
    { value: 'Mobile', label: 'Mobile', icon: Smartphone },
    { value: 'Design', label: 'Design', icon: Palette },
    { value: 'Backend', label: 'Backend', icon: Database },
    { value: 'DevOps', label: 'DevOps', icon: Server },
    { value: 'Security', label: 'Security', icon: Shield },
    { value: 'Testing', label: 'Testing', icon: CheckCircle },
    { value: 'Documentation', label: 'Documentation', icon: FileText }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' }
  ];

  const reviewers = [
    'Sarah Johnson',
    'Mike Wilson',
    'John Smith',
    'Emma Davis',
    'Robert Brown',
    'Lisa Chen',
    'Alex Thompson',
    'David Kim'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else if (new Date(formData.deadline) < new Date()) {
      newErrors.deadline = 'Deadline must be in the future';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit(submission?.id || null, {
        ...formData,
        attachments: attachedFiles.length
      });
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setAttachedFiles([...attachedFiles, ...files]);
  };

  const handleRemoveFile = (index) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto pt-20">
      <div className="bg-white rounded-2xl w-full max-w-4xl my-8 relative animate-scale-in">
        
        {/* Close Button - Clearly Visible */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-20 p-3 hover:bg-gray-100 rounded-full transition-colors shadow-lg bg-white border-2 border-gray-300"
          aria-label="Close"
          type="button"
        >
          <X className="w-6 h-6 text-gray-900 stroke-[3]" />
        </button>

        {/* Header - Adjusted padding to move content down */}
        <div className="px-8 pt-10 pb-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 pr-12">
              {submission ? 'Edit Submission' : 'Create New Submission'}
            </h2>
            <p className="text-gray-600 mt-2">
              {submission 
                ? 'Update submission details and status' 
                : 'Submit a new project, code, or document for review'
              }
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="p-8 space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className={`w-full px-4 py-3.5 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter submission title"
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-900">
                  Description <span className="text-red-500">*</span>
                </label>
                <span className="text-sm text-gray-500">Markdown is supported</span>
              </div>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className={`w-full px-4 py-3.5 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe your submission in detail..."
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              )}
              <div className="mt-3 flex items-center gap-3 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                  <Lock className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700 font-medium">Private by default</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Tags
                </div>
              </label>
              <div className="flex gap-3 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Add tags (press Enter to add)"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Add
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 rounded-lg text-sm font-medium border border-blue-200"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-blue-900 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Priority & Deadline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Priority
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {priorities.map((priority) => (
                    <button
                      key={priority.value}
                      type="button"
                      onClick={() => setFormData({...formData, priority: priority.value})}
                      className={`px-4 py-3.5 rounded-lg text-center font-medium transition-all ${
                        formData.priority === priority.value
                          ? `${priority.color} border-2 border-current shadow-sm scale-[1.02]`
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {priority.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Deadline <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  className={`w-full px-4 py-3.5 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.deadline ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.deadline && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.deadline}
                  </p>
                )}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-5 h-5" />
                  Attachments
                </div>
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.txt,.zip,.rar,.png,.jpg,.jpeg"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="mx-auto w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-7 h-7 text-gray-500" />
                  </div>
                  <p className="text-gray-700 font-medium text-lg mb-2">Click to upload files</p>
                  <p className="text-sm text-gray-500">PDF, DOC, ZIP, Images up to 10MB each</p>
                </label>
              </div>

              {/* File List */}
              {attachedFiles.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
                  {attachedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Advanced Options */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Advanced Options</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Assign Reviewer (Optional)
                    </div>
                  </label>
                  <select
                    value={formData.reviewer}
                    onChange={(e) => setFormData({...formData, reviewer: e.target.value})}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="">Unassigned</option>
                    {reviewers.map((reviewer) => (
                      <option key={reviewer} value={reviewer}>
                        {reviewer}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    <div className="flex items-center gap-2">
                      {formData.visibility === 'private' ? (
                        <Lock className="w-5 h-5" />
                      ) : (
                        <Globe className="w-5 h-5" />
                      )}
                      Visibility
                    </div>
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, visibility: 'private'})}
                      className={`flex-1 px-4 py-3.5 rounded-lg text-center font-medium transition-all ${
                        formData.visibility === 'private'
                          ? 'bg-gray-900 text-white shadow-sm'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <Lock className="w-5 h-5 inline-block mr-3" />
                      Private
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, visibility: 'public'})}
                      className={`flex-1 px-4 py-3.5 rounded-lg text-center font-medium transition-all ${
                        formData.visibility === 'public'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <Globe className="w-5 h-5 inline-block mr-3" />
                      Public
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 text-gray-700 hover:bg-gray-200 font-medium rounded-lg transition-colors border border-gray-300"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {submission ? 'Updating...' : 'Submitting...'}
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  {submission ? 'Update Submission' : 'Create Submission'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmissionForm;