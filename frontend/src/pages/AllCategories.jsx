import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Users, Calendar } from 'lucide-react';

const AllCategories = () => {
  const categories = [
    { id: 'algorithm', name: 'Algorithm', icon: 'A', contests: 2, prize: '$30,000', participants: 2450 },
    { id: 'ai-ml', name: 'AI/ML', icon: 'A', contests: 1, prize: '$15,000', participants: 850 },
    { id: 'web-dev', name: 'Web Development', icon: 'W', contests: 1, prize: '$8,000', participants: 650 },
    { id: 'data-science', name: 'Data Science', icon: 'D', contests: 1, prize: '$12,000', participants: 750 },
    { id: 'security', name: 'Security', icon: 'S', contests: 1, prize: '$20,000', participants: 450 },
    { id: 'mobile', name: 'Mobile', icon: 'M', contests: 1, prize: '$9,000', participants: 550 },
    { id: 'game-dev', name: 'Game Development', icon: 'G', contests: 1, prize: '$7,000', participants: 350 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Contest Categories</h1>
            <p className="text-gray-600 mt-2">Browse competitions by technology domain</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <span className="font-bold text-blue-700 text-xl">{category.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                    <p className="text-gray-600">{category.contests} contest{category.contests > 1 ? 's' : ''}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Prize Pool</span>
                    <span className="font-semibold text-green-600">{category.prize}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Participants</span>
                    <span className="font-semibold text-blue-600">{category.participants.toLocaleString()}</span>
                  </div>
                </div>
                
                <Link
                  to={`/categories/${category.id}`}
                  className="block w-full text-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  View Category
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllCategories;