import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "60px" }}>
      <h1 style={{ fontSize: "36px", fontWeight: "bold" }}>
        CodeQuest
      </h1>

      <p style={{ marginTop: "16px", fontSize: "18px", color: "#555" }}>
        Practice data structures and algorithms.  
        Prepare for technical interviews.  
        Improve problem-solving skills.
      </p>

      <button
        onClick={() => navigate("/problems")}
        style={{
          marginTop: "30px",
          padding: "12px 24px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Explore Problems
      </button>
    </div>
  );
};

export default Home;
