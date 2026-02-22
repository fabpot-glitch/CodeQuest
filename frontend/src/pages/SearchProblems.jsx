import React, { useState, useEffect } from "react";

const SearchProblems = ({ allProblems }) => {
  const [query, setQuery] = useState("");
  const [displayedProblems, setDisplayedProblems] = useState([]);

  useEffect(() => {
    // Show all problems by default
    setDisplayedProblems(allProblems);
  }, [allProblems]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      // If search is empty, show all problems
      setDisplayedProblems(allProblems);
    } else {
      // Filter problems based on title, description, or category
      const filtered = allProblems.filter(
        (p) =>
          p.title.toLowerCase().includes(value.toLowerCase()) ||
          p.description.toLowerCase().includes(value.toLowerCase()) ||
          p.category.toLowerCase().includes(value.toLowerCase())
      );
      setDisplayedProblems(filtered);
    }
  };

  return (
    <div className="search-problems">
      {/* Search input */}
      <div className="search-bar mb-4">
        <input
          type="text"
          placeholder="Search problems..."
          value={query}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Display problems */}
      <div className="problems-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedProblems.length > 0 ? (
          displayedProblems.map((problem) => (
            <div
              key={problem.id}
              className="problem-card p-4 border rounded shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold">{problem.title}</h3>
              <p className="text-gray-600 mt-2">{problem.description}</p>
              <p className="mt-1 text-sm text-gray-500">
                Difficulty: {problem.difficulty} | Points: {problem.points}
              </p>
            </div>
          ))
        ) : (
          <p>No problems found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchProblems;
