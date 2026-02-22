import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, Trophy, Star, Code, Brain, Globe, Database, Shield, Smartphone, GamepadIcon } from 'lucide-react';

const ContestCategoryDetail = () => {
  const { categoryId } = useParams();
  
  // Category data with icons and descriptions
  const categoryData = {
    'algorithm': { 
      name: 'Algorithm', 
      icon: 'A', 
      contests: 2, 
      prize: '$30,000', 
      participants: 2450,
      description: 'Competitions focusing on algorithmic problem solving, data structures, and optimization challenges.',
      Icon: Code,
      color: 'bg-blue-100 text-blue-800',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    'ai-ml': { 
      name: 'AI/ML', 
      icon: 'A', 
      contests: 1, 
      prize: '$15,000', 
      participants: 850,
      description: 'Artificial Intelligence and Machine Learning challenges involving models, predictions, and AI solutions.',
      Icon: Brain,
      color: 'bg-purple-100 text-purple-800',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    'web-dev': { 
      name: 'Web Development', 
      icon: 'W', 
      contests: 1, 
      prize: '$8,000', 
      participants: 650,
      description: 'Frontend and backend web development challenges, building responsive and functional web applications.',
      Icon: Globe,
      color: 'bg-green-100 text-green-800',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    'data-science': { 
      name: 'Data Science', 
      icon: 'D', 
      contests: 1, 
      prize: '$12,000', 
      participants: 750,
      description: 'Data analysis, visualization, and predictive modeling competitions with real-world datasets.',
      Icon: Database,
      color: 'bg-orange-100 text-orange-800',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    'security': { 
      name: 'Security', 
      icon: 'S', 
      contests: 1, 
      prize: '$20,000', 
      participants: 450,
      description: 'Cybersecurity challenges including CTF (Capture The Flag), encryption, and vulnerability assessment.',
      Icon: Shield,
      color: 'bg-red-100 text-red-800',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    'mobile': { 
      name: 'Mobile', 
      icon: 'M', 
      contests: 1, 
      prize: '$9,000', 
      participants: 550,
      description: 'Mobile app development competitions for Android and iOS platforms using various frameworks.',
      Icon: Smartphone,
      color: 'bg-indigo-100 text-indigo-800',
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    },
    'game-dev': { 
      name: 'Game Development', 
      icon: 'G', 
      contests: 1, 
      prize: '$7,000', 
      participants: 350,
      description: 'Game design and development challenges using engines like Unity, Unreal, or custom frameworks.',
      Icon: GamepadIcon,
      color: 'bg-yellow-100 text-yellow-800',
      iconBg: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    }
  };

  const category = categoryData[categoryId] || categoryData['algorithm'];
  const IconComponent = category.Icon || Code;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Use relative navigation or direct to dashboard */}
        <div className="mb-6">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
          <span className="mx-2 text-gray-400">|</span>
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            Back to Dashboard
          </Link>
          <span className="mx-2 text-gray-400">|</span>
          <Link 
            to="/dashboard/contests" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            View All Contests
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 rounded-lg ${category.iconBg} flex items-center justify-center`}>
              <IconComponent className={`w-8 h-8 ${category.iconColor}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{category.name} Contests</h1>
              <p className="text-gray-600 mt-1">{category.description}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Contests</p>
                  <p className="text-2xl font-bold text-gray-900">{category.contests}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Prize Pool</p>
                  <p className="text-2xl font-bold text-gray-900">{category.prize}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 p-5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Participants</p>
                  <p className="text-2xl font-bold text-gray-900">{category.participants.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Category Stats */}
          <div className="mb-8 p-5 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-sm text-gray-600">Avg. Prize</div>
                <div className="text-lg font-bold text-gray-900">
                  {category.contests > 0 
                    ? `$${(parseInt(category.prize.replace('$', '').replace(',', '')) / category.contests).toLocaleString()}`
                    : '$0'}
                </div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-sm text-gray-600">Avg. Participants</div>
                <div className="text-lg font-bold text-gray-900">
                  {(category.participants / category.contests).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-sm text-gray-600">Success Rate</div>
                <div className="text-lg font-bold text-gray-900">85%</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-sm text-gray-600">Difficulty</div>
                <div className="text-lg font-bold text-gray-900">Medium</div>
              </div>
            </div>
          </div>
          
          {/* Upcoming Contests Section */}
          <div className="text-center py-8 border-t border-gray-200">
            <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Contests Coming Soon!</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Detailed contests for {category.name} will be displayed here soon. 
              We're preparing exciting challenges for you to test your skills!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                to="/dashboard/contests"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                View All Upcoming Contests
              </Link>
              <Link 
                to="/dashboard/categories"
                className="inline-flex items-center px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium"
              >
                Browse All Categories
              </Link>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-500 text-sm mb-3">While you wait, explore related content:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Link 
                  to="/dashboard/problems" 
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
                >
                  Practice Problems
                </Link>
                <Link 
                  to="/dashboard/leaderboard" 
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
                >
                  View Leaderboard
                </Link>
                <Link 
                  to="/dashboard/my-contests" 
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
                >
                  My Contests
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Categories */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(categoryData)
              .filter(([id]) => id !== categoryId)
              .slice(0, 4)
              .map(([id, cat]) => {
                const RelatedIcon = cat.Icon || Code;
                return (
                  <Link 
                    key={id}
                    to={`/dashboard/categories/${id}`}
                    className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${cat.iconBg} flex items-center justify-center`}>
                        <RelatedIcon className={`w-5 h-5 ${cat.iconColor}`} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{cat.name}</div>
                        <div className="text-sm text-gray-600">{cat.contests} contest{cat.contests !== 1 ? 's' : ''}</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestCategoryDetail;