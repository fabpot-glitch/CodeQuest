// src/components/Placeholder.jsx
import React from 'react';

const Placeholder = ({ title = "Under Development", message = "This section is under development and will be available soon." }) => {
  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center',
      minHeight: '400px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h2>{title}</h2>
      <p>{message}</p>
      <button 
        onClick={() => window.history.back()}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Go Back
      </button>
    </div>
  );
};

export default Placeholder;