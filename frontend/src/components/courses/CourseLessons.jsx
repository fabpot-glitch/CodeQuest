import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CourseDetails.css';

const CourseLessons = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockLesson = {
        id: parseInt(lessonId),
        title: 'Array Basics',
        description: 'Learn the fundamentals of arrays and their operations',
        type: 'video',
        duration: '15 min',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        transcript: 'In this lesson, we will cover the basics of arrays. Arrays are fundamental data structures that store elements in contiguous memory locations. We will learn about array operations, time complexity, and common patterns.',
        resources: [
          { name: 'Array Cheat Sheet', type: 'pdf', url: '#' },
          { name: 'Practice Problems', type: 'link', url: '#' },
          { name: 'Source Code', type: 'code', url: '#' }
        ],
        nextLesson: 2,
        prevLesson: null,
        completed: false
      };

      const mockCourse = {
        id: parseInt(courseId),
        title: 'Complete Data Structures & Algorithms',
        curriculum: [
          {
            section: 'Arrays & Strings',
            lessons: [
              { id: 1, title: 'Array Basics', completed: true },
              { id: 2, title: 'Two Pointer Technique', completed: false },
              { id: 3, title: 'Sliding Window', completed: false }
            ]
          }
        ]
      };

      setLesson(mockLesson);
      setCourse(mockCourse);
      setLoading(false);
    }, 1000);
  }, [courseId, lessonId]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
      
      // Mark as completed when video ends
      if (videoRef.current.currentTime === videoRef.current.duration) {
        setCompleted(true);
        // Save progress to localStorage
        const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
        progress[`${courseId}-${lessonId}`] = 100;
        localStorage.setItem('courseProgress', JSON.stringify(progress));
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveNotes = () => {
    const savedNotes = JSON.parse(localStorage.getItem('lessonNotes') || '{}');
    savedNotes[`${courseId}-${lessonId}`] = notes;
    localStorage.setItem('lessonNotes', JSON.stringify(savedNotes));
    alert('Notes saved successfully!');
  };

  const handleMarkComplete = () => {
    setCompleted(true);
    const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
    progress[`${courseId}-${lessonId}`] = 100;
    localStorage.setItem('courseProgress', JSON.stringify(progress));
  };

  if (loading) {
    return <div className="lesson-loading">Loading lesson...</div>;
  }

  if (!lesson) {
    return <div className="lesson-not-found">Lesson not found</div>;
  }

  return (
    <div className="lesson-container">
      <div className="lesson-header">
        <button className="back-btn" onClick={() => navigate(`/dashboard/courses/${courseId}/learn`)}>
          ← Back to Curriculum
        </button>
        <h1>{lesson.title}</h1>
        <div className="lesson-progress">
          <span className="completed-badge">{completed ? '✓ Completed' : 'In Progress'}</span>
        </div>
      </div>

      <div className="lesson-content">
        <div className="video-section">
          <div className="video-player">
            <video
              ref={videoRef}
              src={lesson.videoUrl}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setCompleted(true)}
              controls
            />
          </div>

          <div className="video-controls-custom">
            <button className="play-pause-btn" onClick={handlePlayPause}>
              {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </button>
            <span className="time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <button
              className={`complete-btn ${completed ? 'completed' : ''}`}
              onClick={handleMarkComplete}
              disabled={completed}
            >
              {completed ? '✓ Completed' : 'Mark as Complete'}
            </button>
          </div>

          <div className="lesson-description">
            <h3>About this lesson</h3>
            <p>{lesson.description}</p>
          </div>

          <div className="lesson-transcript">
            <button
              className="transcript-toggle"
              onClick={() => setShowTranscript(!showTranscript)}
            >
              {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
            </button>
            {showTranscript && (
              <div className="transcript-content">
                <p>{lesson.transcript}</p>
              </div>
            )}
          </div>
        </div>

        <div className="lesson-sidebar">
          <div className="sidebar-section">
            <h3>Resources</h3>
            <ul className="resources-list">
              {lesson.resources.map((resource, index) => (
                <li key={index}>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    <span className="resource-icon">
                      {resource.type === 'pdf' && '📄'}
                      {resource.type === 'link' && '🔗'}
                      {resource.type === 'code' && '💻'}
                    </span>
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-section">
            <h3>Your Notes</h3>
            <textarea
              className="notes-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Take notes while watching..."
              rows="6"
            />
            <button className="save-notes-btn" onClick={handleSaveNotes}>
              Save Notes
            </button>
          </div>

          <div className="sidebar-section">
            <h3>Lesson Navigation</h3>
            <div className="lesson-nav">
              {lesson.prevLesson && (
                <button
                  className="nav-btn prev"
                  onClick={() => navigate(`/dashboard/courses/${courseId}/lessons/${lesson.prevLesson}`)}
                >
                  ← Previous Lesson
                </button>
              )}
              {lesson.nextLesson && (
                <button
                  className="nav-btn next"
                  onClick={() => navigate(`/dashboard/courses/${courseId}/lessons/${lesson.nextLesson}`)}
                >
                  Next Lesson →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLessons;