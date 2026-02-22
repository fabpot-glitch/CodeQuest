import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CourseDetails.css';

const CourseQuiz = () => {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockQuiz = {
        id: parseInt(quizId),
        title: 'Arrays & Strings Quiz',
        description: 'Test your understanding of arrays and string manipulation',
        timeLimit: 30, // minutes
        passingScore: 70,
        questions: [
          {
            id: 1,
            question: 'What is the time complexity of accessing an element in an array by index?',
            options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
            correct: 0,
            explanation: 'Array access by index is constant time O(1) because elements are stored in contiguous memory locations.'
          },
          {
            id: 2,
            question: 'Which of the following is NOT a characteristic of an array?',
            options: [
              'Fixed size',
              'Homogeneous elements',
              'Dynamic resizing',
              'Contiguous memory allocation'
            ],
            correct: 2,
            explanation: 'Arrays have fixed size (unless using dynamic arrays like ArrayList). Dynamic resizing is not a characteristic of basic arrays.'
          },
          {
            id: 3,
            question: 'What is the time complexity of inserting an element at the beginning of an array?',
            options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
            correct: 1,
            explanation: 'Inserting at the beginning requires shifting all elements, resulting in O(n) time complexity.'
          },
          {
            id: 4,
            question: 'Which data structure would be most efficient for implementing a stack?',
            options: ['Array', 'Linked List', 'Both are equally efficient', 'Neither'],
            correct: 2,
            explanation: 'Both arrays and linked lists can implement stacks efficiently with O(1) push/pop operations.'
          },
          {
            id: 5,
            question: 'What is a string in programming?',
            options: [
              'A sequence of characters',
              'A numerical value',
              'A boolean value',
              'A data structure'
            ],
            correct: 0,
            explanation: 'A string is a sequence of characters, typically used to represent text.'
          }
        ]
      };
      setQuiz(mockQuiz);
      setTimeLeft(mockQuiz.timeLimit * 60);
      setLoading(false);
    }, 1000);
  }, [quizId]);

  useEffect(() => {
    if (timeLeft > 0 && !quizSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizSubmitted) {
      handleSubmitQuiz();
    }
  }, [timeLeft, quizSubmitted]);

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.correct) {
        correctCount++;
      }
    });
    const finalScore = (correctCount / quiz.questions.length) * 100;
    setScore(finalScore);
    setQuizSubmitted(true);

    // Save quiz result
    const quizResults = JSON.parse(localStorage.getItem('quizResults') || '{}');
    quizResults[`${courseId}-${quizId}`] = {
      score: finalScore,
      passed: finalScore >= quiz.passingScore,
      date: new Date().toISOString(),
      answers
    };
    localStorage.setItem('quizResults', JSON.stringify(quizResults));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="quiz-loading">Loading quiz...</div>;
  }

  if (quizSubmitted) {
    const passed = score >= quiz.passingScore;
    return (
      <div className="quiz-results">
        <h2>Quiz Results</h2>
        <div className={`score-card ${passed ? 'passed' : 'failed'}`}>
          <div className="score-circle">
            <span className="score-value">{Math.round(score)}%</span>
          </div>
          <h3>{passed ? '🎉 Congratulations!' : '📚 Keep Learning'}</h3>
          <p>
            {passed
              ? 'You passed the quiz! Great job!'
              : `You scored ${Math.round(score)}%. The passing score is ${quiz.passingScore}%.`}
          </p>
          <div className="results-actions">
            <button
              className="review-btn"
              onClick={() => setQuizSubmitted(false)}
            >
              Review Answers
            </button>
            <button
              className="continue-btn"
              onClick={() => navigate(`/dashboard/courses/${courseId}/learn`)}
            >
              Back to Course
            </button>
          </div>
        </div>

        <div className="answer-review">
          <h3>Question Review</h3>
          {quiz.questions.map((q, index) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correct;
            return (
              <div key={q.id} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="review-question">
                  <span className="question-number">{index + 1}.</span>
                  <span className="question-text">{q.question}</span>
                  <span className="result-icon">{isCorrect ? '✓' : '✗'}</span>
                </div>
                <div className="review-answer">
                  <p><strong>Your answer:</strong> {q.options[userAnswer]}</p>
                  <p><strong>Correct answer:</strong> {q.options[q.correct]}</p>
                  <p className="explanation">{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>{quiz.title}</h2>
        <div className="quiz-timer">
          <span className="timer-icon">⏱️</span>
          <span className="timer-text">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="quiz-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          ></div>
        </div>
        <span className="progress-text">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </span>
      </div>

      <div className="quiz-question">
        <h3>{question.question}</h3>
        <div className="quiz-options">
          {question.options.map((option, index) => (
            <label key={index} className="quiz-option">
              <input
                type="radio"
                name={`question-${question.id}`}
                value={index}
                checked={answers[question.id] === index}
                onChange={() => handleAnswerSelect(question.id, index)}
              />
              <span className="option-text">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="quiz-navigation">
        <button
          className="nav-btn prev"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          ← Previous
        </button>
        
        {currentQuestion === quiz.questions.length - 1 ? (
          <button
            className="nav-btn submit"
            onClick={handleSubmitQuiz}
            disabled={Object.keys(answers).length < quiz.questions.length}
          >
            Submit Quiz
          </button>
        ) : (
          <button
            className="nav-btn next"
            onClick={handleNext}
            disabled={answers[question.id] === undefined}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseQuiz;