import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProblemCard = ({ problem }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/problems/${problem.id}`)}
      className="cursor-pointer bg-gray-800 border border-gray-700 rounded-xl p-6 hover:shadow-lg transition flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white text-lg font-semibold">{problem.title}</h3>
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
            problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
            problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
            'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>{problem.difficulty}</span>
        </div>
        <div className="flex flex-wrap gap-2 text-gray-400 text-sm">
          <span>{problem.category}</span>
          <span>Acceptance: {problem.acceptance}</span>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        {problem.solved ? <CheckCircle className="w-5 h-5 text-green-400" /> : <div className="w-5 h-5 border-2 border-gray-600 rounded-full" />}
        <span className="text-gray-400 text-sm">{(problem.likes/1000).toFixed(1)}k Likes</span>
      </div>
    </div>
  );
};

export default ProblemCard;
