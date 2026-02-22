const SolutionCard = ({ solution, handleUpvote, handleDownvote }) => {
  return (
    <div className="bg-gray-50 border rounded-lg p-4 mb-3">
      <p className="text-gray-700">{solution.content}</p>

      <div className="flex gap-6 mt-3">
        <button
          onClick={() => handleUpvote(solution._id)}
          className="text-green-600 font-bold"
        >
          👍 {solution.upvotes.length}
        </button>
        <button
          onClick={() => handleDownvote(solution._id)}
          className="text-red-600 font-bold"
        >
          👎 {solution.downvotes.length}
        </button>
      </div>
    </div>
  );
};

export default SolutionCard;
