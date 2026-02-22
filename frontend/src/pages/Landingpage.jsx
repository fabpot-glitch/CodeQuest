import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Navigation Bar */}
      <nav style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '20px 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: 'white',
              fontWeight: 'bold'
            }}>
              C
            </div>
            <div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: 'white',
                margin: 0
              }}>
                CodeQuest
              </h1>
              <p style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0
              }}>
                Master Your Coding Journey
              </p>
            </div>
          </div>

          {/* Auth Buttons */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '12px 30px',
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.target.style.color = '#a0aec0'}
              onMouseOut={(e) => e.target.style.color = 'white'}
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              style={{
                padding: '12px 30px',
                background: 'white',
                border: 'none',
                color: '#667eea',
                fontSize: '16px',
                fontWeight: '600',
                borderRadius: '10px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
              }}
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '100px 20px',
        textAlign: 'center'
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '50px',
          padding: '10px 20px',
          marginBottom: '40px'
        }}>
          <span style={{ fontSize: '20px' }}>✨</span>
          <span style={{
            color: 'white',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            Join 100,000+ Problem Solvers
          </span>
        </div>

        {/* Main Headline */}
        <h1 style={{
          fontSize: '72px',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '30px',
          lineHeight: '1.2'
        }}>
          Master Algorithms.<br />
          <span style={{
            background: 'linear-gradient(to right, #fff, #a0aec0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Ace Interviews.
          </span>
        </h1>

        {/* Subheadline */}
        <p style={{
          fontSize: '24px',
          color: 'rgba(255, 255, 255, 0.9)',
          marginBottom: '50px',
          maxWidth: '800px',
          margin: '0 auto 50px auto'
        }}>
          Practice data structures and algorithms. Prepare for technical interviews.
          Improve problem-solving skills.
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '60px'
        }}>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '20px 40px',
              background: 'white',
              border: 'none',
              color: '#667eea',
              fontSize: '18px',
              fontWeight: 'bold',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)';
            }}
          >
            Start Learning Free
            <span style={{ fontSize: '20px' }}>→</span>
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '20px 40px',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.25)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
          >
            Sign In
          </button>
        </div>

        {/* Trust Badges */}
        <div style={{
          display: 'flex',
          gap: '30px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#4ade80', fontSize: '20px' }}>✓</span>
            <span>Free Forever</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#4ade80', fontSize: '20px' }}>✓</span>
            <span>No Credit Card</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#4ade80', fontSize: '20px' }}>✓</span>
            <span>5000+ Problems</span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '80px auto',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          {[
            {
              emoji: '🏆',
              title: 'Real Interview Questions',
              description: 'Practice with problems from Google, Meta, Amazon, and more'
            },
            {
              emoji: '🎯',
              title: 'Personalized Learning',
              description: 'AI-powered recommendations tailored to your skill level'
            },
            {
              emoji: '📈',
              title: 'Track Your Progress',
              description: 'Detailed analytics and performance insights'
            },
            {
              emoji: '📚',
              title: 'Comprehensive Resources',
              description: 'Video tutorials, solutions, and expert explanations'
            },
            {
              emoji: '👥',
              title: 'Community Support',
              description: 'Join developers helping each other succeed'
            },
            {
              emoji: '🎓',
              title: 'Career Tools',
              description: 'Resume builder, mock interviews, and job prep'
            }
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                padding: '40px',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <div style={{
                fontSize: '48px',
                marginBottom: '20px'
              }}>
                {feature.emoji}
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '15px'
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.6'
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '80px auto',
        padding: '60px 20px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '30px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          textAlign: 'center'
        }}>
          {[
            { number: '100K+', label: 'Active Users' },
            { number: '5000+', label: 'Problems' },
            { number: '95%', label: 'Success Rate' },
            { number: '50+', label: 'Companies' }
          ].map((stat, index) => (
            <div key={index}>
              <div style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '10px'
              }}>
                {stat.number}
              </div>
              <div style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div style={{
        maxWidth: '1000px',
        margin: '80px auto 0',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '64px',
          marginBottom: '30px'
        }}>
          🧠
        </div>
        <h2 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '20px'
        }}>
          Ready to Level Up?
        </h2>
        <p style={{
          fontSize: '20px',
          color: 'rgba(255, 255, 255, 0.9)',
          marginBottom: '40px'
        }}>
          Join thousands of developers mastering algorithms and acing interviews
        </p>
        <button
          onClick={() => navigate('/register')}
          style={{
            padding: '25px 50px',
            background: 'white',
            border: 'none',
            color: '#667eea',
            fontSize: '20px',
            fontWeight: 'bold',
            borderRadius: '15px',
            cursor: 'pointer',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-5px)';
            e.target.style.boxShadow = '0 15px 50px rgba(0,0,0,0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 10px 40px rgba(0,0,0,0.3)';
          }}
        >
          Start Your Journey Free
        </button>
        <p style={{
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.7)',
          marginTop: '20px'
        }}>
          No credit card required • Free forever
        </p>
      </div>

      {/* Footer */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.7)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '15px',
          marginBottom: '15px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: 'white',
            fontWeight: 'bold'
          }}>
            C
          </div>
          <span style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'white'
          }}>
            CodeQuest
          </span>
        </div>
        <p style={{ fontSize: '14px' }}>© 2024 CodeQuest. All rights reserved.</p>
        <p style={{ fontSize: '14px', marginTop: '10px' }}>Practice. Learn. Excel.</p>
      </div>
    </div>
  );
};

export default LandingPage;