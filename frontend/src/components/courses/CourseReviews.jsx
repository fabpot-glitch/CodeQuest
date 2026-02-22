import React, { useState, useEffect } from 'react';
import './CourseDetails.css';

const CourseReviews = ({ courseId, rating, reviews }) => {
  const [reviewsList, setReviewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    wouldRecommend: true
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockReviews = [
        {
          id: 1,
          user: 'John Doe',
          avatar: '👨‍💻',
          rating: 5,
          title: 'Excellent course! Highly recommended',
          comment: 'This course exceeded my expectations. The instructor explains complex topics in a simple and engaging way. The projects were very practical and helped me understand real-world applications.',
          date: '2024-01-15',
          helpful: 24,
          verified: true,
          wouldRecommend: true
        },
        {
          id: 2,
          user: 'Sarah Smith',
          avatar: '👩‍💼',
          rating: 4,
          title: 'Great content, slightly fast pace',
          comment: 'The course content is excellent and covers everything you need. However, some topics could be explained in more detail. Overall, a great learning experience.',
          date: '2024-01-10',
          helpful: 18,
          verified: true,
          wouldRecommend: true
        },
        {
          id: 3,
          user: 'Mike Johnson',
          avatar: '👨‍🔬',
          rating: 5,
          title: 'Best course I have taken',
          comment: 'The instructor is knowledgeable and engaging. The curriculum is well-structured and the assignments are challenging but rewarding. I feel confident in my skills now.',
          date: '2024-01-05',
          helpful: 32,
          verified: true,
          wouldRecommend: true
        }
      ];
      setReviewsList(mockReviews);
      setLoading(false);
    }, 1000);
  }, [courseId]);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const review = {
      id: reviewsList.length + 1,
      user: 'You',
      avatar: '👤',
      ...newReview,
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
      verified: true
    };
    setReviewsList([review, ...reviewsList]);
    setShowReviewForm(false);
    setNewReview({
      rating: 5,
      title: '',
      comment: '',
      wouldRecommend: true
    });
  };

  const handleHelpful = (reviewId) => {
    setReviewsList(prev =>
      prev.map(review =>
        review.id === reviewId
          ? { ...review, helpful: review.helpful + 1 }
          : review
      )
    );
  };

  const averageRating = rating;
  const totalReviews = reviewsList.length;
  const ratingDistribution = {
    5: reviewsList.filter(r => r.rating === 5).length,
    4: reviewsList.filter(r => r.rating === 4).length,
    3: reviewsList.filter(r => r.rating === 3).length,
    2: reviewsList.filter(r => r.rating === 2).length,
    1: reviewsList.filter(r => r.rating === 1).length
  };

  if (loading) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '3rem',
        color: '#64748b',
        fontSize: '1rem'
      }}>
        Loading reviews...
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '2rem 0'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#1e293b',
          margin: 0
        }}>
          Student Reviews
        </h2>
        <button
          onClick={() => setShowReviewForm(true)}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            borderRadius: '2rem',
            fontSize: '0.95rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 10px 20px rgba(102, 126, 234, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          Write a Review
        </button>
      </div>

      {/* Rating Summary */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        marginBottom: '2rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '3rem',
          alignItems: 'center'
        }}>
          {/* Average Rating */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '3.5rem',
              fontWeight: '700',
              color: '#1e293b',
              lineHeight: 1
            }}>
              {averageRating}
            </div>
            <div style={{
              display: 'flex',
              gap: '0.25rem',
              justifyContent: 'center',
              margin: '0.5rem 0',
              fontSize: '1.5rem'
            }}>
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} style={{
                  color: star <= Math.round(averageRating) ? '#fbbf24' : '#cbd5e1'
                }}>★</span>
              ))}
            </div>
            <div style={{
              color: '#64748b',
              fontSize: '0.9rem'
            }}>
              {reviews} ratings
            </div>
          </div>

          {/* Rating Bars */}
          <div>
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '0.5rem'
              }}>
                <span style={{
                  minWidth: '45px',
                  color: '#64748b',
                  fontSize: '0.9rem'
                }}>
                  {star} stars
                </span>
                <div style={{
                  flex: 1,
                  height: '8px',
                  background: '#e2e8f0',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${totalReviews > 0 ? (ratingDistribution[star] / totalReviews) * 100 : 0}%`,
                    height: '100%',
                    background: star === 5 ? '#10b981' : 
                               star === 4 ? '#3b82f6' : 
                               star === 3 ? '#f59e0b' : 
                               star === 2 ? '#f97316' : '#ef4444',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                <span style={{
                  minWidth: '30px',
                  color: '#64748b',
                  fontSize: '0.9rem',
                  textAlign: 'right'
                }}>
                  {ratingDistribution[star]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }} onClick={() => setShowReviewForm(false)}>
          <div style={{
            background: 'white',
            borderRadius: '1.5rem',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            animation: 'modalSlideUp 0.3s ease'
          }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowReviewForm(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              ×
            </button>
            
            <h3 style={{
              fontSize: '1.3rem',
              marginBottom: '1.5rem',
              color: '#1e293b'
            }}>
              Write Your Review
            </h3>
            
            <form onSubmit={handleSubmitReview}>
              {/* Rating Input */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '0.5rem'
                }}>
                  Rating
                </label>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem'
                }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '2rem',
                        cursor: 'pointer',
                        color: star <= newReview.rating ? '#fbbf24' : '#cbd5e1',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (star <= newReview.rating) {
                          e.target.style.transform = 'scale(1.2)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '0.5rem'
                }}>
                  Review Title
                </label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  placeholder="Summarize your experience"
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Comment Input */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '0.5rem'
                }}>
                  Your Review
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your experience with this course"
                  rows="4"
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Would Recommend Checkbox */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  color: '#475569'
                }}>
                  <input
                    type="checkbox"
                    checked={newReview.wouldRecommend}
                    onChange={(e) => setNewReview({ ...newReview, wouldRecommend: e.target.checked })}
                    style={{
                      width: '18px',
                      height: '18px',
                      accentColor: '#667eea',
                      cursor: 'pointer'
                    }}
                  />
                  <span>I would recommend this course</span>
                </label>
              </div>

              {/* Form Actions */}
              <div style={{
                display: 'flex',
                gap: '1rem'
              }}>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  style={{
                    flex: 1,
                    padding: '0.8rem',
                    background: 'white',
                    border: '2px solid #e2e8f0',
                    borderRadius: '0.75rem',
                    color: '#475569',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.95rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#f1f5f9';
                    e.target.style.borderColor = '#94a3b8';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'white';
                    e.target.style.borderColor = '#e2e8f0';
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '0.8rem',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    border: 'none',
                    borderRadius: '0.75rem',
                    color: 'white',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.95rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 10px 20px rgba(102, 126, 234, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div>
        {reviewsList.map(review => (
          <div key={review.id} style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '1rem',
            border: '1px solid #e2e8f0',
            transition: 'all 0.2s ease'
          }}>
            {/* Reviewer Info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem',
              flexWrap: 'wrap'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                {review.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '0.25rem'
                }}>
                  {review.user}
                </h4>
                <span style={{
                  fontSize: '0.8rem',
                  color: '#64748b'
                }}>
                  {new Date(review.date).toLocaleDateString('en-US', {
                    month: 'numeric',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              {review.verified && (
                <span style={{
                  padding: '0.25rem 0.75rem',
                  background: '#d1fae5',
                  color: '#065f46',
                  borderRadius: '2rem',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}>
                  ✓ Verified Purchase
                </span>
              )}
            </div>

            {/* Rating Stars */}
            <div style={{
              display: 'flex',
              gap: '0.25rem',
              marginBottom: '0.75rem'
            }}>
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} style={{
                  fontSize: '1.2rem',
                  color: star <= review.rating ? '#fbbf24' : '#cbd5e1'
                }}>★</span>
              ))}
            </div>

            {/* Review Title */}
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '0.5rem'
            }}>
              {review.title}
            </h4>

            {/* Review Comment */}
            <p style={{
              color: '#475569',
              lineHeight: '1.6',
              marginBottom: '1rem',
              fontSize: '0.95rem'
            }}>
              {review.comment}
            </p>

            {/* Would Recommend Badge */}
            {review.wouldRecommend && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.3rem 1rem',
                background: '#f1f5f9',
                borderRadius: '2rem',
                fontSize: '0.85rem',
                color: '#1e293b',
                marginBottom: '1rem'
              }}>
                <span>👍</span> Would recommend
              </div>
            )}

            {/* Review Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              paddingTop: '0.5rem'
            }}>
              <button
                onClick={() => handleHelpful(review.id)}
                style={{
                  background: 'none',
                  border: '1px solid #e2e8f0',
                  padding: '0.5rem 1rem',
                  borderRadius: '2rem',
                  fontSize: '0.85rem',
                  color: '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f1f5f9';
                  e.target.style.borderColor = '#94a3b8';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'none';
                  e.target.style.borderColor = '#e2e8f0';
                }}
              >
                <span>👍</span> Helpful ({review.helpful})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add keyframe animation for modal */}
      <style>{`
        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CourseReviews;