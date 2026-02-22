// src/components/submissions/SubmissionStats.jsx
import React from 'react';
import { 
  TrendingUp, CheckCircle, Clock, XCircle, 
  Eye, BarChart, Award, Users
} from 'lucide-react';

const SubmissionStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Submissions',
      value: stats.total,
      icon: BarChart,
      color: 'bg-blue-500',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Approved',
      value: stats.approved,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Pending Review',
      value: stats.pending,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '-3%',
      trend: 'down'
    },
    {
      title: 'In Review',
      value: stats.inReview,
      icon: Eye,
      color: 'bg-purple-500',
      change: '+5%',
      trend: 'up'
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      color: 'bg-red-500',
      change: '-2%',
      trend: 'down'
    },
    {
      title: 'Avg. Score',
      value: `${stats.avgScore}%`,
      icon: Award,
      color: 'bg-indigo-500',
      change: '+4%',
      trend: 'up'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 ${stat.color} bg-opacity-10 rounded-lg`}>
                <Icon className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <div className={`inline-flex items-center gap-1 text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`w-3 h-3 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                {stat.change}
              </div>
            </div>
            
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.title}</p>
            
            {index === 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Avg. Review Time:</span>
                  <span className="font-medium">{stats.avgReviewTime}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SubmissionStats;