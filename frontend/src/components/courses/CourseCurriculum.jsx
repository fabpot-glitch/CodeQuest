import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CourseDetails.css';

const CourseCurriculum = ({ curriculum, courseId, isEnrolled, onProgressUpdate }) => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState(
    curriculum.map((_, index) => index === 0)
  );
  const [completedLessons, setCompletedLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [notes, setNotes] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [downloadQueue, setDownloadQueue] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showBookmarksModal, setShowBookmarksModal] = useState(false);
  const [lessonResources, setLessonResources] = useState({});
  const [showAchievements, setShowAchievements] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [selectedVideoLesson, setSelectedVideoLesson] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [selectedQuizLesson, setSelectedQuizLesson] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showAssignment, setShowAssignment] = useState(false);
  const [assignmentSubmission, setAssignmentSubmission] = useState('');
  const [assignmentFeedback, setAssignmentFeedback] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showArticle, setShowArticle] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [discussionComments, setDiscussionComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [selectedCodeLesson, setSelectedCodeLesson] = useState(null);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [code, setCode] = useState('');
  const [codeOutput, setCodeOutput] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showExercise, setShowExercise] = useState(false);
  const [exerciseAnswer, setExerciseAnswer] = useState('');
  const [exerciseFeedback, setExerciseFeedback] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProject, setShowProject] = useState(false);
  const [projectSubmission, setProjectSubmission] = useState('');
  const [projectFeedback, setProjectFeedback] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [showSectionDetails, setShowSectionDetails] = useState(false);

  // Enhanced curriculum data with complete details
  const enhancedCurriculum = [
    {
      section: 'Introduction to System Design',
      description: 'Learn the fundamentals of system design, including key concepts, principles, and methodologies used in building scalable systems.',
      objectives: [
        'Understand what system design is and why it matters',
        'Learn the key principles of scalable system design',
        'Master requirement gathering and analysis',
        'Understand different architectural patterns',
        'Learn about system design trade-offs'
      ],
      keyTopics: [
        'What is System Design?',
        'Key Principles of Scalable Systems',
        'Understanding Requirements',
        'System Design Basics Quiz'
      ],
      totalDuration: 60,
      lessons: [
        { 
          id: 'l1', 
          title: 'What is System Design?', 
          type: 'video', 
          duration: '15', 
          free: true, 
          difficulty: 'beginner',
          description: 'An introduction to system design concepts and why they are crucial for building scalable applications.',
          keyPoints: [
            'Definition of system design',
            'Importance in software architecture',
            'Real-world examples',
            'Common challenges and solutions'
          ],
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        { 
          id: 'l2', 
          title: 'Key Principles of Scalable Systems', 
          type: 'video', 
          duration: '20', 
          difficulty: 'beginner',
          description: 'Learn the fundamental principles that make systems scalable, reliable, and maintainable.',
          keyPoints: [
            'Scalability principles',
            'Reliability patterns',
            'Maintainability best practices',
            'Performance optimization techniques'
          ],
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        { 
          id: 'l3', 
          title: 'Understanding Requirements', 
          type: 'article', 
          duration: '10', 
          difficulty: 'beginner',
          description: 'Learn how to gather, analyze, and document system requirements effectively.',
          content: `
            <h3>Introduction to Requirements Gathering</h3>
            <p>Requirements gathering is the process of determining what a system should do. It's the foundation of any successful system design.</p>
            
            <h4>Types of Requirements</h4>
            <ul>
              <li><strong>Functional Requirements:</strong> What the system should do</li>
              <li><strong>Non-Functional Requirements:</strong> How the system should perform</li>
              <li><strong>Business Requirements:</strong> Why the system is needed</li>
              <li><strong>User Requirements:</strong> What users need from the system</li>
            </ul>
            
            <h4>Requirements Gathering Techniques</h4>
            <ul>
              <li>Interviews with stakeholders</li>
              <li>Surveys and questionnaires</li>
              <li>Observation of current systems</li>
              <li>Document analysis</li>
              <li>Prototyping</li>
            </ul>
            
            <h4>Best Practices</h4>
            <ul>
              <li>Be specific and unambiguous</li>
              <li>Prioritize requirements</li>
              <li>Validate with stakeholders</li>
              <li>Document everything</li>
              <li>Track changes and versions</li>
            </ul>
          `
        },
        { 
          id: 'l4', 
          title: 'Quiz: System Design Basics', 
          type: 'quiz', 
          duration: '15', 
          difficulty: 'beginner',
          description: 'Test your understanding of basic system design concepts.',
          questions: [
            {
              question: 'What is system design?',
              options: [
                'The process of defining architecture, components, and interfaces',
                'Writing code for a system',
                'Testing a system',
                'Deploying a system'
              ],
              correct: 0
            },
            {
              question: 'Which of the following is NOT a key principle of scalable systems?',
              options: [
                'Load balancing',
                'Caching',
                'Single point of failure',
                'Database sharding'
              ],
              correct: 2
            },
            {
              question: 'What are functional requirements?',
              options: [
                'What the system should do',
                'How the system should perform',
                'Why the system is needed',
                'System hardware specifications'
              ],
              correct: 0
            },
            {
              question: 'Which requirement type deals with system performance?',
              options: [
                'Functional requirements',
                'Non-functional requirements',
                'Business requirements',
                'User requirements'
              ],
              correct: 1
            },
            {
              question: 'What is the purpose of load balancing?',
              options: [
                'Distribute traffic across multiple servers',
                'Store frequently accessed data',
                'Encrypt data',
                'Compress files'
              ],
              correct: 0
            }
          ]
        }
      ]
    },
    {
      section: 'Load Balancing & Caching',
      description: 'Master the essential techniques for distributing traffic and optimizing performance in large-scale systems.',
      objectives: [
        'Understand different load balancing algorithms',
        'Implement caching strategies effectively',
        'Learn about Redis and caching patterns',
        'Master cache invalidation techniques'
      ],
      keyTopics: [
        'Load Balancing Algorithms',
        'Implementing Round Robin',
        'Caching Strategies',
        'Redis Implementation',
        'Cache Invalidation Patterns'
      ],
      totalDuration: 135,
      lessons: [
        { 
          id: 'l5', 
          title: 'Load Balancing Algorithms', 
          type: 'video', 
          duration: '25', 
          difficulty: 'intermediate',
          description: 'Deep dive into various load balancing algorithms and their use cases.',
          keyPoints: [
            'Round Robin algorithm',
            'Least Connections method',
            'IP Hash technique',
            'Weighted distribution'
          ],
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        { 
          id: 'l6', 
          title: 'Implementing Round Robin', 
          type: 'code', 
          duration: '30', 
          difficulty: 'intermediate',
          description: 'Hands-on implementation of Round Robin load balancing algorithm.',
          starterCode: `// Implement a simple Round Robin load balancer
class LoadBalancer {
  constructor(servers) {
    this.servers = servers;
    this.currentIndex = 0;
  }
  
  getNextServer() {
    // TODO: Implement Round Robin logic
    // Return the next server in the list cyclically
  }
}

// Test your implementation
const servers = ['Server1', 'Server2', 'Server3'];
const lb = new LoadBalancer(servers);

// Should cycle through servers: Server1, Server2, Server3, Server1, ...
console.log(lb.getNextServer());
console.log(lb.getNextServer());
console.log(lb.getNextServer());
console.log(lb.getNextServer());`,
          solution: `class LoadBalancer {
  constructor(servers) {
    this.servers = servers;
    this.currentIndex = 0;
  }
  
  getNextServer() {
    const server = this.servers[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.servers.length;
    return server;
  }
}`
        },
        { 
          id: 'l7', 
          title: 'Caching Strategies', 
          type: 'video', 
          duration: '20', 
          difficulty: 'intermediate',
          description: 'Learn different caching strategies and when to apply them.',
          keyPoints: [
            'Cache-aside pattern',
            'Read-through cache',
            'Write-through cache',
            'Write-behind cache'
          ],
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        { 
          id: 'l8', 
          title: 'Redis Implementation', 
          type: 'assignment', 
          duration: '45', 
          difficulty: 'intermediate',
          description: 'Implement a Redis-based caching system for a web application.',
          instructions: 'Create a Redis-based caching system that implements the cache-aside pattern. Your implementation should include:',
          requirements: [
            'Connect to Redis server',
            'Implement get/set operations with TTL',
            'Handle cache misses by fetching from database',
            'Implement cache invalidation',
            'Add monitoring and metrics'
          ],
          dueDate: '2024-03-15',
          points: 100,
          format: 'Code repository with documentation'
        },
        { 
          id: 'l9', 
          title: 'Cache Invalidation Patterns', 
          type: 'article', 
          duration: '15', 
          difficulty: 'intermediate',
          description: 'Understanding different cache invalidation strategies and their trade-offs.',
          content: `
            <h3>Cache Invalidation Strategies</h3>
            <p>Cache invalidation is one of the hardest problems in computer science. Here are the common strategies:</p>
            
            <h4>1. Write-Through Cache</h4>
            <p>Data is written to cache and database simultaneously. Ensures consistency but adds latency.</p>
            
            <h4>2. Write-Around Cache</h4>
            <p>Data is written directly to database, bypassing cache. Cache is updated on read.</p>
            
            <h4>3. Write-Back Cache</h4>
            <p>Data is written to cache first, then asynchronously to database. Fast but risk of data loss.</p>
            
            <h4>4. Time-Based Invalidation (TTL)</h4>
            <p>Cache entries expire after a fixed time period. Simple but may serve stale data.</p>
            
            <h4>5. Event-Based Invalidation</h4>
            <p>Cache is invalidated when data changes. Complex but ensures consistency.</p>
            
            <h3>Choosing the Right Strategy</h3>
            <p>Consider your application's needs:</p>
            <ul>
              <li>Read-heavy vs write-heavy workloads</li>
              <li>Consistency requirements</li>
              <li>Latency tolerance</li>
              <li>Data volatility</li>
            </ul>
          `
        }
      ]
    },
    {
      section: 'Database Design',
      description: 'Comprehensive coverage of database design principles, from basic concepts to advanced sharding strategies.',
      objectives: [
        'Understand SQL vs NoSQL differences',
        'Master database sharding techniques',
        'Learn replication strategies',
        'Understand CAP theorem'
      ],
      keyTopics: [
        'SQL vs NoSQL',
        'Database Sharding',
        'Replication Strategies',
        'CAP Theorem Explained',
        'Database Design Exercise'
      ],
      totalDuration: 102,
      lessons: [
        { 
          id: 'l10', 
          title: 'SQL vs NoSQL', 
          type: 'video', 
          duration: '18', 
          difficulty: 'intermediate',
          description: 'Compare and contrast SQL and NoSQL databases for different use cases.',
          keyPoints: [
            'ACID vs BASE',
            'Schema flexibility',
            'Scalability approaches',
            'Use case scenarios'
          ],
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        { 
          id: 'l11', 
          title: 'Database Sharding', 
          type: 'video', 
          duration: '22', 
          difficulty: 'advanced',
          description: 'Learn how to horizontally partition databases for scalability.',
          keyPoints: [
            'Horizontal partitioning',
            'Shard key selection',
            'Rebalancing strategies',
            'Cross-shard queries'
          ],
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        { 
          id: 'l12', 
          title: 'Replication Strategies', 
          type: 'article', 
          duration: '12', 
          difficulty: 'advanced',
          description: 'Understanding different database replication methods.',
          content: `
            <h3>Database Replication Strategies</h3>
            
            <h4>1. Master-Slave Replication</h4>
            <p>One master handles writes, multiple slaves handle reads. Good for read-heavy workloads.</p>
            
            <h4>2. Master-Master Replication</h4>
            <p>Multiple nodes can handle writes. Complex conflict resolution needed.</p>
            
            <h4>3. Synchronous Replication</h4>
            <p>Write is confirmed only after all replicas are updated. Strong consistency but high latency.</p>
            
            <h4>4. Asynchronous Replication</h4>
            <p>Write is confirmed immediately, replicas updated later. Fast but potential data loss.</p>
            
            <h3>Replication Topologies</h3>
            <ul>
              <li>Chain replication</li>
              <li>Tree replication</li>
              <li>Multi-mesh replication</li>
            </ul>
          `
        },
        { 
          id: 'l13', 
          title: 'CAP Theorem Explained', 
          type: 'video', 
          duration: '15', 
          difficulty: 'advanced',
          description: 'Understanding the trade-offs between Consistency, Availability, and Partition Tolerance.',
          keyPoints: [
            'Consistency explained',
            'Availability explained',
            'Partition tolerance explained',
            'Real-world examples'
          ],
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        { 
          id: 'l14', 
          title: 'Database Design Exercise', 
          type: 'exercise', 
          duration: '35', 
          difficulty: 'advanced',
          description: 'Design a database schema for a social media platform.',
          question: 'Design a database schema for a social media platform that supports users, posts, comments, and likes. Consider scalability and performance.',
          correctAnswer: 'users table, posts table, comments table, likes table with proper indexes and relationships',
          instructions: 'Create an ER diagram and explain your design choices including indexing strategies, partitioning approach, and caching strategy.'
        }
      ]
    },
    {
      section: 'Microservices Architecture',
      description: 'Master the principles and patterns of microservices architecture for building distributed systems.',
      objectives: [
        'Understand monolith vs microservices',
        'Learn service discovery patterns',
        'Master API gateway pattern',
        'Implement inter-service communication'
      ],
      keyTopics: [
        'Monolith vs Microservices',
        'Service Discovery',
        'API Gateway Pattern',
        'Inter-Service Communication',
        'Microservices Project'
      ],
      totalDuration: 135,
      lessons: [
        { 
          id: 'l15', 
          title: 'Monolith vs Microservices', 
          type: 'video', 
          duration: '20', 
          difficulty: 'intermediate',
          description: 'Compare monolithic and microservices architectures.',
          keyPoints: [
            'Monolith advantages',
            'Microservices benefits',
            'Migration strategies',
            'When to choose each'
          ],
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        { 
          id: 'l16', 
          title: 'Service Discovery', 
          type: 'video', 
          duration: '18', 
          difficulty: 'advanced',
          description: 'Learn how services find each other in a microservices architecture.',
          keyPoints: [
            'Client-side discovery',
            'Server-side discovery',
            'Service registry',
            'Consul, Eureka, etcd'
          ],
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        { 
          id: 'l17', 
          title: 'API Gateway Pattern', 
          type: 'article', 
          duration: '12', 
          difficulty: 'advanced',
          description: 'Understanding the role of API gateway in microservices.',
          content: `
            <h3>API Gateway Pattern</h3>
            <p>An API gateway is a server that acts as a single entry point for all client requests.</p>
            
            <h4>Key Responsibilities</h4>
            <ul>
              <li>Request routing</li>
              <li>Authentication and authorization</li>
              <li>Rate limiting</li>
              <li>Load balancing</li>
              <li>Caching</li>
              <li>Request/response transformation</li>
            </ul>
            
            <h4>Popular API Gateways</h4>
            <ul>
              <li>Kong</li>
              <li>NGINX</li>
              <li>AWS API Gateway</li>
              <li>Zuul (Netflix)</li>
            </ul>
          `
        },
        { 
          id: 'l18', 
          title: 'Inter-Service Communication', 
          type: 'discussion', 
          duration: '25', 
          difficulty: 'advanced',
          description: 'Discuss different approaches to communication between microservices.',
          topics: [
            'Synchronous vs asynchronous communication',
            'REST vs gRPC',
            'Message queues (RabbitMQ, Kafka)',
            'Event-driven architecture'
          ]
        },
        { 
          id: 'l19', 
          title: 'Microservices Project', 
          type: 'project', 
          duration: '60', 
          difficulty: 'advanced',
          description: 'Build a complete microservices-based application.',
          requirements: [
            'Create at least 3 microservices',
            'Implement service discovery',
            'Use API gateway',
            'Include both sync and async communication',
            'Add monitoring and logging',
            'Implement circuit breakers'
          ],
          deliverables: 'GitHub repository with code, Docker files, and documentation'
        }
      ]
    },
    {
      section: 'Real-world Case Studies',
      description: 'Analyze how top tech companies architect their systems at scale.',
      objectives: [
        'Understand Netflix architecture',
        'Learn from Uber\'s system design',
        'Analyze Twitter\'s timeline system',
        'Apply learnings to real projects'
      ],
      keyTopics: [
        'Netflix Architecture',
        'Uber Design',
        'Twitter Timeline',
        'Final Assessment'
      ],
      totalDuration: 115,
      lessons: [
        { 
          id: 'l20', 
          title: 'Netflix Architecture', 
          type: 'video', 
          duration: '30', 
          difficulty: 'advanced',
          description: 'Deep dive into Netflix\'s streaming architecture.',
          keyPoints: [
            'AWS infrastructure',
            'Content delivery network',
            'Recommendation system',
            'Chaos engineering'
          ],
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        { 
          id: 'l21', 
          title: 'Uber Design', 
          type: 'video', 
          duration: '25', 
          difficulty: 'advanced',
          description: 'Understanding Uber\'s ride-hailing system architecture.',
          keyPoints: [
            'Matching algorithm',
            'Real-time tracking',
            'Payment processing',
            'Scaling challenges'
          ],
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        { 
          id: 'l22', 
          title: 'Twitter Timeline', 
          type: 'article', 
          duration: '15', 
          difficulty: 'advanced',
          description: 'How Twitter handles millions of tweets and timelines.',
          content: `
            <h3>Twitter Timeline Architecture</h3>
            
            <h4>The Challenge</h4>
            <p>Twitter needs to show each user a timeline of tweets from people they follow, with millions of users and tweets per second.</p>
            
            <h4>Solution Approaches</h4>
            
            <h5>1. Push-based (Fan-out)</h5>
            <p>When someone tweets, push it to all followers' timelines. Good for users with few followers.</p>
            
            <h5>2. Pull-based (Timeline Generation)</h5>
            <p>Generate timeline on request by pulling tweets from followed users. Good for users with many followers.</p>
            
            <h5>3. Hybrid Approach</h5>
            <p>Push for users with few followers, pull for celebrities. Twitter uses this hybrid model.</p>
            
            <h4>Implementation Details</h4>
            <ul>
              <li>Redis for timeline caching</li>
              <li>MySQL for tweet storage</li>
              <li>Kafka for event streaming</li>
              <li>Memcached for hot data</li>
            </ul>
          `
        },
        { 
          id: 'l23', 
          title: 'Final Assessment', 
          type: 'quiz', 
          duration: '45', 
          difficulty: 'advanced',
          description: 'Comprehensive assessment covering all course topics.',
          questions: [
            {
              question: 'Which load balancing algorithm distributes requests cyclically?',
              options: [
                'Round Robin',
                'Least Connections',
                'IP Hash',
                'Weighted Round Robin'
              ],
              correct: 0
            },
            {
              question: 'What does the CAP theorem state about distributed systems?',
              options: [
                'You can have all three: Consistency, Availability, Partition Tolerance',
                'You can only have two of: Consistency, Availability, Partition Tolerance',
                'You must sacrifice Partition Tolerance',
                'You must sacrifice Availability'
              ],
              correct: 1
            },
            {
              question: 'Which caching pattern writes to cache and database simultaneously?',
              options: [
                'Write-through',
                'Write-around',
                'Write-back',
                'Cache-aside'
              ],
              correct: 0
            },
            {
              question: 'What is the primary purpose of an API gateway?',
              options: [
                'Single entry point for all clients',
                'Database replication',
                'Load balancing only',
                'Service discovery only'
              ],
              correct: 0
            },
            {
              question: 'How does Netflix ensure system reliability?',
              options: [
                'Chaos engineering',
                'Manual testing',
                'User reports',
                'Weekly maintenance'
              ],
              correct: 0
            }
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    // Load completed lessons from localStorage
    const savedProgress = localStorage.getItem(`course_${courseId}_progress`);
    if (savedProgress) {
      setCompletedLessons(JSON.parse(savedProgress));
    }

    // Load bookmarks from localStorage
    const savedBookmarks = localStorage.getItem(`course_${courseId}_bookmarks`);
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }

    // Load lesson notes
    const allNotes = {};
    getAllLessons().forEach(lesson => {
      const note = localStorage.getItem(`lesson_${lesson.id}_notes`);
      if (note) {
        allNotes[lesson.id] = note;
      }
    });
    setLessonResources(allNotes);

    // Load achievements
    const savedAchievements = localStorage.getItem(`course_${courseId}_achievements`);
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }

    // Load discussion comments
    const savedComments = localStorage.getItem(`course_${courseId}_comments`);
    if (savedComments) {
      setDiscussionComments(JSON.parse(savedComments));
    }
  }, [courseId]);

  const getLessonIcon = (type) => {
    switch(type) {
      case 'video': return '🎥';
      case 'quiz': return '📝';
      case 'assignment': return '📋';
      case 'article': return '📄';
      case 'resource': return '📎';
      case 'discussion': return '💬';
      case 'code': return '💻';
      case 'exercise': return '🏋️';
      case 'project': return '🚀';
      default: return '📌';
    }
  };

  const getLessonColor = (type) => {
    switch(type) {
      case 'video': return '#3b82f6';
      case 'quiz': return '#f59e0b';
      case 'assignment': return '#10b981';
      case 'article': return '#8b5cf6';
      case 'resource': return '#ec4899';
      case 'discussion': return '#14b8a6';
      case 'code': return '#6366f1';
      case 'exercise': return '#f97316';
      case 'project': return '#a855f7';
      default: return '#64748b';
    }
  };

  const getLessonDifficulty = (lesson) => {
    if (lesson.difficulty) return lesson.difficulty;
    const duration = parseInt(lesson.duration) || 0;
    if (duration < 10) return 'beginner';
    if (duration < 30) return 'intermediate';
    return 'advanced';
  };

  const handleLessonClick = (lessonId, type, lesson) => {
    setCurrentLesson(lessonId);
    localStorage.setItem(`course_${courseId}_last_lesson`, lessonId);
    
    // Handle different lesson types
    switch(type) {
      case 'video':
        setSelectedVideoLesson(lesson);
        setShowVideoPlayer(true);
        break;
      case 'quiz':
        setSelectedQuizLesson(lesson);
        setShowQuiz(true);
        setQuizAnswers({});
        setQuizScore(null);
        break;
      case 'assignment':
        setSelectedAssignment(lesson);
        setShowAssignment(true);
        setAssignmentSubmission('');
        setAssignmentFeedback(null);
        break;
      case 'article':
        setSelectedArticle(lesson);
        setShowArticle(true);
        break;
      case 'discussion':
        setSelectedDiscussion(lesson);
        setShowDiscussion(true);
        loadDiscussionComments(lesson.id);
        break;
      case 'code':
        setSelectedCodeLesson(lesson);
        setShowCodeEditor(true);
        setCode(lesson.starterCode || '// Write your code here\n');
        setCodeOutput('');
        break;
      case 'exercise':
        setSelectedExercise(lesson);
        setShowExercise(true);
        setExerciseAnswer('');
        setExerciseFeedback(null);
        break;
      case 'project':
        setSelectedProject(lesson);
        setShowProject(true);
        setProjectSubmission('');
        setProjectFeedback(null);
        break;
      default:
        // Fallback to navigation
        const routes = {
          'video': `/dashboard/courses/${courseId}/lessons/${lessonId}`,
          'quiz': `/dashboard/courses/${courseId}/quiz/${lessonId}`,
          'assignment': `/dashboard/courses/${courseId}/assignment/${lessonId}`,
          'article': `/dashboard/courses/${courseId}/article/${lessonId}`,
          'discussion': `/dashboard/courses/${courseId}/discussion/${lessonId}`,
          'code': `/dashboard/courses/${courseId}/code/${lessonId}`,
          'exercise': `/dashboard/courses/${courseId}/exercise/${lessonId}`,
          'project': `/dashboard/courses/${courseId}/project/${lessonId}`
        };
        navigate(routes[type] || `/dashboard/courses/${courseId}/lessons/${lessonId}`);
    }
  };

  const handleSectionClick = (section) => {
    setSelectedSection(section);
    setShowSectionDetails(true);
  };

  const loadDiscussionComments = (lessonId) => {
    const savedComments = localStorage.getItem(`course_${courseId}_comments_${lessonId}`);
    if (savedComments) {
      setDiscussionComments(JSON.parse(savedComments));
    } else {
      // Sample comments
      const sampleComments = [
        {
          id: 1,
          user: 'John Doe',
          avatar: '👤',
          content: 'Great explanation! This really helped me understand the concept.',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          likes: 5
        },
        {
          id: 2,
          user: 'Jane Smith',
          avatar: '👩',
          content: 'Can you provide more examples?',
          timestamp: new Date(Date.now() - 43200000).toISOString(),
          likes: 2
        }
      ];
      setDiscussionComments(sampleComments);
      localStorage.setItem(`course_${courseId}_comments_${lessonId}`, JSON.stringify(sampleComments));
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      user: 'You',
      avatar: '👤',
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0
    };

    const updatedComments = [...discussionComments, comment];
    setDiscussionComments(updatedComments);
    localStorage.setItem(`course_${courseId}_comments_${selectedDiscussion.id}`, JSON.stringify(updatedComments));
    setNewComment('');
  };

  const handleLikeComment = (commentId) => {
    const updatedComments = discussionComments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, likes: comment.likes + 1 };
      }
      return comment;
    });
    setDiscussionComments(updatedComments);
    localStorage.setItem(`course_${courseId}_comments_${selectedDiscussion.id}`, JSON.stringify(updatedComments));
  };

  const handleQuizSubmit = () => {
    // Calculate quiz score
    let correct = 0;
    const total = selectedQuizLesson.questions?.length || 0;
    
    selectedQuizLesson.questions?.forEach((q, index) => {
      if (quizAnswers[index] === q.correct) {
        correct++;
      }
    });

    const score = (correct / total) * 100;
    setQuizScore(score);

    // Mark as completed if score is passing (e.g., >= 70%)
    if (score >= 70) {
      handleMarkComplete(selectedQuizLesson.id);
    }

    // Save quiz results
    const quizResults = {
      lessonId: selectedQuizLesson.id,
      score,
      answers: quizAnswers,
      completedAt: new Date().toISOString()
    };
    localStorage.setItem(`course_${courseId}_quiz_${selectedQuizLesson.id}`, JSON.stringify(quizResults));
  };

  const handleAssignmentSubmit = () => {
    // Simulate assignment submission
    setAssignmentFeedback({
      submitted: true,
      message: 'Assignment submitted successfully! Your instructor will review it shortly.',
      submittedAt: new Date().toISOString()
    });

    // Mark as completed
    handleMarkComplete(selectedAssignment.id);

    // Save submission
    const submission = {
      lessonId: selectedAssignment.id,
      content: assignmentSubmission,
      submittedAt: new Date().toISOString()
    };
    localStorage.setItem(`course_${courseId}_assignment_${selectedAssignment.id}`, JSON.stringify(submission));
  };

  const handleCodeRun = () => {
    // Simulate code execution
    try {
      // Simple code evaluation for demonstration
      if (selectedCodeLesson.solution) {
        const userCode = code.trim();
        const solution = selectedCodeLesson.solution.trim();
        
        if (userCode.includes('getNextServer') && userCode.includes('currentIndex')) {
          setCodeOutput('✓ Code executed successfully!\n\nOutput:\nServer1\nServer2\nServer3\nServer1\n\nAll tests passed!');
        } else {
          setCodeOutput('✗ Code executed but not all requirements met.\n\nMake sure to:\n- Implement getNextServer method\n- Track currentIndex\n- Cycle through servers correctly');
        }
      } else {
        setCodeOutput('Code executed successfully!\n\nOutput:\nHello, World!\n\nExecution completed.');
      }
    } catch (error) {
      setCodeOutput(`Error: ${error.message}`);
    }
  };

  const handleExerciseSubmit = () => {
    // Check exercise answer
    const isCorrect = exerciseAnswer.toLowerCase().includes('users') && 
                     exerciseAnswer.toLowerCase().includes('posts') &&
                     exerciseAnswer.toLowerCase().includes('comments');

    setExerciseFeedback({
      correct: isCorrect,
      message: isCorrect ? 'Correct! Great job on the database design!' : 'Not quite right. Make sure to include users, posts, comments, and likes tables with proper relationships.',
      submittedAt: new Date().toISOString()
    });

    if (isCorrect) {
      handleMarkComplete(selectedExercise.id);
    }
  };

  const handleProjectSubmit = () => {
    setProjectFeedback({
      submitted: true,
      message: 'Project submitted successfully! Your instructor will review it.',
      submittedAt: new Date().toISOString()
    });

    handleMarkComplete(selectedProject.id);

    const submission = {
      lessonId: selectedProject.id,
      content: projectSubmission,
      submittedAt: new Date().toISOString()
    };
    localStorage.setItem(`course_${courseId}_project_${selectedProject.id}`, JSON.stringify(submission));
  };

  const handleMarkComplete = (lessonId) => {
    let updatedCompleted;
    if (completedLessons.includes(lessonId)) {
      updatedCompleted = completedLessons.filter(id => id !== lessonId);
    } else {
      updatedCompleted = [...completedLessons, lessonId];
      checkAchievements(updatedCompleted.length);
    }
    
    setCompletedLessons(updatedCompleted);
    localStorage.setItem(`course_${courseId}_progress`, JSON.stringify(updatedCompleted));
    
    const totalLessons = getAllLessons().length;
    const progress = (updatedCompleted.length / totalLessons) * 100;
    
    if (onProgressUpdate) {
      onProgressUpdate(progress);
    }
  };

  const checkAchievements = (completedCount) => {
    const totalLessons = getAllLessons().length;
    const newAchievements = [...achievements];
    
    if (completedCount === 1 && !achievements.some(a => a.id === 'first')) {
      newAchievements.push({ id: 'first', title: 'First Lesson', icon: '🎯', date: new Date().toISOString() });
      showAchievementNotification('First Lesson Completed! 🎯');
    }
    if (completedCount === Math.floor(totalLessons / 2) && !achievements.some(a => a.id === 'halfway')) {
      newAchievements.push({ id: 'halfway', title: 'Halfway There', icon: '🌟', date: new Date().toISOString() });
      showAchievementNotification('Halfway Through the Course! 🌟');
    }
    if (completedCount === totalLessons && !achievements.some(a => a.id === 'complete')) {
      newAchievements.push({ id: 'complete', title: 'Course Complete', icon: '🎓', date: new Date().toISOString() });
      showAchievementNotification('Course Completed! 🎓');
    }
    if (completedCount >= 10 && !achievements.some(a => a.id === 'ten')) {
      newAchievements.push({ id: 'ten', title: '10 Lessons', icon: '📚', date: new Date().toISOString() });
    }
    
    setAchievements(newAchievements);
    localStorage.setItem(`course_${courseId}_achievements`, JSON.stringify(newAchievements));
  };

  const showAchievementNotification = (message) => {
    alert(`🎉 Achievement Unlocked: ${message}`);
  };

  const handleAddNote = (lesson) => {
    setSelectedLesson(lesson);
    const savedNotes = localStorage.getItem(`lesson_${lesson.id}_notes`);
    setNotes(savedNotes || '');
    setShowNotesModal(true);
  };

  const handleSaveNote = () => {
    if (selectedLesson) {
      localStorage.setItem(`lesson_${selectedLesson.id}_notes`, notes);
      setLessonResources(prev => ({
        ...prev,
        [selectedLesson.id]: notes
      }));
      setShowNotesModal(false);
      setSelectedLesson(null);
      setNotes('');
    }
  };

  const handleToggleBookmark = (lesson) => {
    let updatedBookmarks;
    if (bookmarks.some(b => b.id === lesson.id)) {
      updatedBookmarks = bookmarks.filter(b => b.id !== lesson.id);
    } else {
      updatedBookmarks = [...bookmarks, { 
        ...lesson, 
        bookmarkedAt: new Date().toISOString(),
        section: getSectionForLesson(lesson.id)
      }];
    }
    
    setBookmarks(updatedBookmarks);
    localStorage.setItem(`course_${courseId}_bookmarks`, JSON.stringify(updatedBookmarks));
  };

  const getSectionForLesson = (lessonId) => {
    for (const section of enhancedCurriculum) {
      if (section.lessons.some(l => l.id === lessonId)) {
        return section.section;
      }
    }
    return '';
  };

  const handleDownloadLesson = async (lesson) => {
    if (lesson.type === 'video' || lesson.type === 'article' || lesson.type === 'resource') {
      setDownloadQueue(prev => [...prev, lesson.id]);
      setIsDownloading(true);
      
      // Simulate download with progress
      setTimeout(() => {
        setDownloadQueue(prev => {
          const newQueue = prev.filter(id => id !== lesson.id);
          if (newQueue.length === 0) {
            setIsDownloading(false);
          }
          return newQueue;
        });
        showNotification(`Download complete: ${lesson.title}`, 'success');
      }, 2000);

      showNotification(`Download started: ${lesson.title}`, 'info');
    }
  };

  const showNotification = (message, type) => {
    console.log(`[${type}] ${message}`);
  };

  const handleShareLesson = (lesson) => {
    const shareData = {
      title: lesson.title,
      text: `Check out this lesson from the course: ${lesson.title}`,
      url: `${window.location.origin}/courses/${courseId}/lessons/${lesson.id}`,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.url);
      showNotification('Link copied to clipboard!', 'success');
    }
  };

  const toggleSection = (index) => {
    setExpandedSections(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const expandAll = () => {
    setExpandedSections(enhancedCurriculum.map(() => true));
  };

  const collapseAll = () => {
    setExpandedSections(enhancedCurriculum.map(() => false));
  };

  const getAllLessons = () => {
    return enhancedCurriculum.flatMap(section => section.lessons);
  };

  const getFilteredAndSortedLessons = () => {
    let lessons = getAllLessons();
    
    if (searchTerm) {
      lessons = lessons.filter(lesson => 
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType !== 'all') {
      lessons = lessons.filter(lesson => lesson.type === filterType);
    }
    
    if (sortBy === 'duration-asc') {
      lessons.sort((a, b) => (parseInt(a.duration) || 0) - (parseInt(b.duration) || 0));
    } else if (sortBy === 'duration-desc') {
      lessons.sort((a, b) => (parseInt(b.duration) || 0) - (parseInt(a.duration) || 0));
    } else if (sortBy === 'title-asc') {
      lessons.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'title-desc') {
      lessons.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === 'completed') {
      lessons.sort((a, b) => {
        const aCompleted = completedLessons.includes(a.id) ? 1 : 0;
        const bCompleted = completedLessons.includes(b.id) ? 1 : 0;
        return bCompleted - aCompleted;
      });
    } else if (sortBy === 'incomplete') {
      lessons.sort((a, b) => {
        const aCompleted = completedLessons.includes(a.id) ? 1 : 0;
        const bCompleted = completedLessons.includes(b.id) ? 1 : 0;
        return aCompleted - bCompleted;
      });
    }
    
    return lessons;
  };

  const calculateSectionProgress = (section) => {
    const sectionLessons = section.lessons.map(l => l.id);
    const completed = sectionLessons.filter(id => completedLessons.includes(id)).length;
    return (completed / sectionLessons.length) * 100;
  };

  const totalLessons = getAllLessons().length;
  const completedCount = completedLessons.length;
  const overallProgress = (completedCount / totalLessons) * 100;

  const getNextLesson = () => {
    for (const section of enhancedCurriculum) {
      for (const lesson of section.lessons) {
        if (!completedLessons.includes(lesson.id)) {
          return lesson;
        }
      }
    }
    return null;
  };

  const nextLesson = getNextLesson();

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  // Section Details Modal
  const SectionDetailsModal = ({ section, onClose }) => {
    return (
      <div style={styles.modalOverlay} onClick={onClose}>
        <div style={{...styles.modalContainer, maxWidth: '700px'}} onClick={(e) => e.stopPropagation()}>
          <button style={styles.modalClose} onClick={onClose}>×</button>
          
          <h2 style={styles.modalTitle}>{section.section}</h2>
          
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              {section.description}
            </p>
            
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
              What You'll Learn
            </h3>
            <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
              {section.objectives.map((obj, index) => (
                <li key={index} style={{ color: '#475569', marginBottom: '0.5rem' }}>{obj}</li>
              ))}
            </ul>
            
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
              Key Topics
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {section.keyTopics.map((topic, index) => (
                <span key={index} style={{
                  padding: '0.5rem 1rem',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '2rem',
                  fontSize: '0.9rem',
                  color: '#475569',
                }}>
                  {topic}
                </span>
              ))}
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '0.75rem',
            }}>
              <span style={{ fontSize: '1.2rem' }}>📊</span>
              <div>
                <div style={{ fontWeight: '600', color: '#1e293b' }}>{section.lessons.length} lessons</div>
                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Total duration: {formatDuration(section.totalDuration)}</div>
              </div>
            </div>
          </div>
          
          <button
            style={styles.saveButton}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  // Video Player Component
  const VideoPlayer = ({ lesson, onClose }) => {
    return (
      <div style={styles.modalOverlay} onClick={onClose}>
        <div style={{...styles.modalContainer, maxWidth: '900px'}} onClick={(e) => e.stopPropagation()}>
          <button style={styles.modalClose} onClick={onClose}>×</button>
          
          <h2 style={styles.modalTitle}>{lesson.title}</h2>
          
          <div style={{
            position: 'relative',
            paddingBottom: '56.25%',
            height: 0,
            overflow: 'hidden',
            borderRadius: '1rem',
            marginBottom: '1.5rem',
          }}>
            <iframe
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
              src={lesson.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
              title={lesson.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '1rem' }}>
              {lesson.description}
            </p>
            
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
              Key Points:
            </h3>
            <ul style={{ paddingLeft: '1.5rem' }}>
              {lesson.keyPoints?.map((point, index) => (
                <li key={index} style={{ color: '#64748b', marginBottom: '0.25rem' }}>{point}</li>
              ))}
            </ul>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <p style={{ color: '#64748b' }}>
                Duration: {lesson.duration} minutes • Difficulty: {lesson.difficulty}
              </p>
            </div>
            <button
              style={{
                ...styles.saveButton,
                width: 'auto',
                padding: '0.75rem 2rem',
              }}
              onClick={() => {
                handleMarkComplete(lesson.id);
                onClose();
              }}
            >
              Mark as Completed
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Quiz Component
  const QuizComponent = ({ lesson, onClose }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(null);

    const questions = lesson.questions || [];

    const handleAnswer = (questionIndex, answerIndex) => {
      setAnswers({
        ...answers,
        [questionIndex]: answerIndex
      });
    };

    const handleNext = () => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    };

    const handlePrevious = () => {
      if (currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1);
      }
    };

    const handleSubmit = () => {
      let correctCount = 0;
      questions.forEach((q, index) => {
        if (answers[index] === q.correct) {
          correctCount++;
        }
      });
      const finalScore = (correctCount / questions.length) * 100;
      setScore(finalScore);
      setShowResults(true);

      if (finalScore >= 70) {
        handleMarkComplete(lesson.id);
      }
    };

    return (
      <div style={styles.modalOverlay} onClick={onClose}>
        <div style={{...styles.modalContainer, maxWidth: '700px'}} onClick={(e) => e.stopPropagation()}>
          <button style={styles.modalClose} onClick={onClose}>×</button>
          
          <h2 style={styles.modalTitle}>{lesson.title}</h2>
          
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>{lesson.description}</p>

          {!showResults ? (
            <>
              <div style={{
                marginBottom: '2rem',
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '0.75rem',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                }}>
                  <span style={{ color: '#64748b' }}>
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    background: '#667eea20',
                    color: '#667eea',
                    borderRadius: '2rem',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                  }}>
                    {Math.round((Object.keys(answers).length / questions.length) * 100)}% Complete
                  </span>
                </div>

                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '1.5rem',
                }}>
                  {questions[currentQuestion]?.question}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {questions[currentQuestion]?.options.map((option, index) => (
                    <button
                      key={index}
                      style={{
                        padding: '1rem',
                        background: answers[currentQuestion] === index ? '#667eea20' : 'white',
                        border: `2px solid ${answers[currentQuestion] === index ? '#667eea' : '#e2e8f0'}`,
                        borderRadius: '0.75rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        color: answers[currentQuestion] === index ? '#667eea' : '#1e293b',
                        fontWeight: answers[currentQuestion] === index ? '500' : '400',
                      }}
                      onClick={() => handleAnswer(currentQuestion, index)}
                      onMouseEnter={(e) => {
                        if (answers[currentQuestion] !== index) {
                          e.target.style.background = '#f8fafc';
                          e.target.style.borderColor = '#cbd5e1';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (answers[currentQuestion] !== index) {
                          e.target.style.background = 'white';
                          e.target.style.borderColor = '#e2e8f0';
                        }
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '1rem',
              }}>
                <button
                  style={{
                    ...styles.cancelButton,
                    opacity: currentQuestion === 0 ? 0.5 : 1,
                    cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                  }}
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </button>
                
                {currentQuestion === questions.length - 1 ? (
                  <button
                    style={styles.saveButton}
                    onClick={handleSubmit}
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <button
                    style={styles.saveButton}
                    onClick={handleNext}
                  >
                    Next Question
                  </button>
                )}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: score >= 70 ? '#10b98120' : '#ef444420',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}>
                <span style={{
                  fontSize: '2.5rem',
                  color: score >= 70 ? '#10b981' : '#ef4444',
                }}>
                  {score >= 70 ? '🎉' : '📝'}
                </span>
              </div>
              
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '0.5rem',
              }}>
                Quiz Complete!
              </h3>
              
              <p style={{
                fontSize: '1.25rem',
                color: '#64748b',
                marginBottom: '1rem',
              }}>
                Your Score: <span style={{
                  fontWeight: '700',
                  color: score >= 70 ? '#10b981' : '#ef4444',
                }}>{Math.round(score)}%</span>
              </p>
              
              {score >= 70 ? (
                <p style={{ color: '#10b981', marginBottom: '2rem' }}>
                  Congratulations! You passed the quiz.
                </p>
              ) : (
                <p style={{ color: '#ef4444', marginBottom: '2rem' }}>
                  You need 70% to pass. Please try again.
                </p>
              )}

              <button
                style={styles.saveButton}
                onClick={onClose}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Assignment Component
  const AssignmentComponent = ({ lesson, onClose }) => {
    return (
      <div style={styles.modalOverlay} onClick={onClose}>
        <div style={{...styles.modalContainer, maxWidth: '700px'}} onClick={(e) => e.stopPropagation()}>
          <button style={styles.modalClose} onClick={onClose}>×</button>
          
          <h2 style={styles.modalTitle}>{lesson.title}</h2>
          
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '1rem' }}>
              {lesson.description}
            </p>
            
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '0.5rem',
            }}>
              Instructions
            </h3>
            <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '1rem' }}>
              {lesson.instructions}
            </p>

            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '0.5rem',
            }}>
              Requirements
            </h3>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              {lesson.requirements?.map((req, index) => (
                <li key={index} style={{ color: '#475569', marginBottom: '0.5rem' }}>• {req}</li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '0.5rem',
            }}>
              Assignment Details
            </h3>
            <ul style={{ color: '#475569', listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>• Due Date: {lesson.dueDate || 'No deadline'}</li>
              <li style={{ marginBottom: '0.5rem' }}>• Points: {lesson.points || '100'}</li>
              <li style={{ marginBottom: '0.5rem' }}>• Format: {lesson.format || 'Code repository with documentation'}</li>
            </ul>
          </div>

          {assignmentFeedback ? (
            <div style={{
              padding: '1.5rem',
              background: '#f0fdf4',
              borderRadius: '1rem',
              border: '1px solid #10b981',
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>✅</span>
              <p style={{ color: '#10b981', fontWeight: '500' }}>{assignmentFeedback.message}</p>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Submitted: {new Date(assignmentFeedback.submittedAt).toLocaleString()}
              </p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  color: '#475569',
                  marginBottom: '0.5rem',
                }}>
                  Your Submission
                </label>
                <textarea
                  style={{
                    ...styles.notesTextarea,
                    minHeight: '200px',
                  }}
                  value={assignmentSubmission}
                  onChange={(e) => setAssignmentSubmission(e.target.value)}
                  placeholder="Paste your assignment here or provide a link to your repository..."
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
              }}>
                <button
                  style={styles.cancelButton}
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  style={styles.saveButton}
                  onClick={handleAssignmentSubmit}
                  disabled={!assignmentSubmission.trim()}
                >
                  Submit Assignment
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // Article Component
  const ArticleComponent = ({ lesson, onClose }) => {
    return (
      <div style={styles.modalOverlay} onClick={onClose}>
        <div style={{...styles.modalContainer, maxWidth: '800px'}} onClick={(e) => e.stopPropagation()}>
          <button style={styles.modalClose} onClick={onClose}>×</button>
          
          <h2 style={styles.modalTitle}>{lesson.title}</h2>
          
          <div style={{
            padding: '2rem',
            background: '#f8fafc',
            borderRadius: '1rem',
            marginBottom: '1.5rem',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #e2e8f0',
            }}>
              <span style={{
                padding: '0.5rem 1rem',
                background: '#667eea20',
                color: '#667eea',
                borderRadius: '2rem',
                fontSize: '0.9rem',
                fontWeight: '500',
              }}>
                Reading time: {lesson.duration} min
              </span>
              <span style={{
                padding: '0.5rem 1rem',
                background: '#f59e0b20',
                color: '#f59e0b',
                borderRadius: '2rem',
                fontSize: '0.9rem',
                fontWeight: '500',
              }}>
                Difficulty: {lesson.difficulty}
              </span>
            </div>

            <div 
              style={{ color: '#475569', lineHeight: '1.8' }}
              dangerouslySetInnerHTML={{ __html: lesson.content }}
            />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <button
              style={styles.cancelButton}
              onClick={onClose}
            >
              Close
            </button>
            <button
              style={styles.saveButton}
              onClick={() => {
                handleMarkComplete(lesson.id);
                onClose();
              }}
            >
              Mark as Read
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Discussion Component
  const DiscussionComponent = ({ lesson, onClose }) => {
    return (
      <div style={styles.modalOverlay} onClick={onClose}>
        <div style={{...styles.modalContainer, maxWidth: '700px'}} onClick={(e) => e.stopPropagation()}>
          <button style={styles.modalClose} onClick={onClose}>×</button>
          
          <h2 style={styles.modalTitle}>{lesson.title}</h2>
          
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ color: '#475569', lineHeight: '1.6' }}>
              {lesson.description}
            </p>
            {lesson.topics && (
              <div style={{ marginTop: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                  Discussion Topics:
                </h3>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  {lesson.topics.map((topic, index) => (
                    <li key={index} style={{ color: '#64748b', marginBottom: '0.25rem' }}>{topic}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem',
            }}>
              Comments ({discussionComments.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {discussionComments.map((comment) => (
                <div key={comment.id} style={{
                  padding: '1rem',
                  background: '#f8fafc',
                  borderRadius: '0.75rem',
                  border: '1px solid #e2e8f0',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: '#667eea',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1rem',
                      }}>
                        {comment.avatar}
                      </span>
                      <span style={{ fontWeight: '600', color: '#1e293b' }}>{comment.user}</span>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ color: '#475569', marginBottom: '0.5rem' }}>{comment.content}</p>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                    onClick={() => handleLikeComment(comment.id)}
                  >
                    👍 {comment.likes}
                  </button>
                </div>
              ))}
            </div>

            {/* Add Comment */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
            }}>
              <textarea
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  fontSize: '0.95rem',
                  resize: 'vertical',
                  minHeight: '80px',
                }}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add your comment..."
              />
              <button
                style={{
                  ...styles.saveButton,
                  width: 'auto',
                  padding: '0.75rem 1.5rem',
                }}
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Code Editor Component
  const CodeEditorComponent = ({ lesson, onClose }) => {
    return (
      <div style={styles.modalOverlay} onClick={onClose}>
        <div style={{...styles.modalContainer, maxWidth: '900px'}} onClick={(e) => e.stopPropagation()}>
          <button style={styles.modalClose} onClick={onClose}>×</button>
          
          <h2 style={styles.modalTitle}>{lesson.title}</h2>
          
          <p style={{ color: '#64748b', marginBottom: '1rem' }}>{lesson.description}</p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1rem',
          }}>
            {/* Code Editor */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.95rem',
                fontWeight: '500',
                color: '#475569',
                marginBottom: '0.5rem',
              }}>
                Code Editor
              </label>
              <textarea
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  fontSize: '0.95rem',
                  fontFamily: 'monospace',
                  lineHeight: '1.6',
                  minHeight: '400px',
                  resize: 'vertical',
                }}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            {/* Output */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.95rem',
                fontWeight: '500',
                color: '#475569',
                marginBottom: '0.5rem',
              }}>
                Output
              </label>
              <pre style={{
                width: '100%',
                padding: '1rem',
                background: '#1e293b',
                color: '#e2e8f0',
                borderRadius: '0.75rem',
                fontSize: '0.95rem',
                fontFamily: 'monospace',
                lineHeight: '1.6',
                minHeight: '400px',
                overflow: 'auto',
                margin: 0,
              }}>
                {codeOutput || 'Run your code to see output...'}
              </pre>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <button
                style={{
                  ...styles.actionBtn,
                  width: 'auto',
                  padding: '0.75rem 2rem',
                  background: '#10b981',
                  color: 'white',
                  marginRight: '1rem',
                }}
                onClick={handleCodeRun}
              >
                ▶️ Run Code
              </button>
              <button
                style={{
                  ...styles.actionBtn,
                  width: 'auto',
                  padding: '0.75rem 2rem',
                }}
                onClick={() => setCode(lesson.starterCode || '// Write your code here\n')}
              >
                Reset
              </button>
            </div>
            <button
              style={styles.saveButton}
              onClick={() => {
                handleMarkComplete(lesson.id);
                onClose();
              }}
            >
              Mark as Completed
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Exercise Component
  const ExerciseComponent = ({ lesson, onClose }) => {
    return (
      <div style={styles.modalOverlay} onClick={onClose}>
        <div style={{...styles.modalContainer, maxWidth: '700px'}} onClick={(e) => e.stopPropagation()}>
          <button style={styles.modalClose} onClick={onClose}>×</button>
          
          <h2 style={styles.modalTitle}>{lesson.title}</h2>
          
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '1rem' }}>
              {lesson.description}
            </p>
            
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '0.5rem',
            }}>
              Exercise Instructions
            </h3>
            <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '1rem' }}>
              {lesson.instructions}
            </p>

            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '0.5rem',
            }}>
              Question
            </h3>
            <p style={{ color: '#1e293b', fontWeight: '500', marginBottom: '1rem' }}>
              {lesson.question}
            </p>
          </div>

          {exerciseFeedback ? (
            <div style={{
              padding: '1.5rem',
              background: exerciseFeedback.correct ? '#f0fdf4' : '#fef2f2',
              borderRadius: '1rem',
              border: `1px solid ${exerciseFeedback.correct ? '#10b981' : '#ef4444'}`,
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>
                {exerciseFeedback.correct ? '✅' : '❌'}
              </span>
              <p style={{ color: exerciseFeedback.correct ? '#10b981' : '#ef4444', fontWeight: '500' }}>
                {exerciseFeedback.message}
              </p>
            </div>
          ) : null}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.95rem',
              fontWeight: '500',
              color: '#475569',
              marginBottom: '0.5rem',
            }}>
              Your Answer
            </label>
            <textarea
              style={{
                ...styles.notesTextarea,
                minHeight: '150px',
              }}
              value={exerciseAnswer}
              onChange={(e) => setExerciseAnswer(e.target.value)}
              placeholder="Enter your answer here..."
            />
          </div>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
          }}>
            <button
              style={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              style={styles.saveButton}
              onClick={handleExerciseSubmit}
              disabled={!exerciseAnswer.trim()}
            >
              Submit Answer
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Project Component
  const ProjectComponent = ({ lesson, onClose }) => {
    return (
      <div style={styles.modalOverlay} onClick={onClose}>
        <div style={{...styles.modalContainer, maxWidth: '700px'}} onClick={(e) => e.stopPropagation()}>
          <button style={styles.modalClose} onClick={onClose}>×</button>
          
          <h2 style={styles.modalTitle}>{lesson.title}</h2>
          
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '1rem' }}>
              {lesson.description}
            </p>
            
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '0.5rem',
            }}>
              Project Overview
            </h3>
            <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '1rem' }}>
              {lesson.description}
            </p>

            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '0.5rem',
            }}>
              Requirements
            </h3>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              {lesson.requirements?.map((req, index) => (
                <li key={index} style={{ color: '#475569', marginBottom: '0.5rem' }}>• {req}</li>
              ))}
            </ul>

            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '0.5rem',
            }}>
              Deliverables
            </h3>
            <p style={{ color: '#475569', lineHeight: '1.6' }}>
              {lesson.deliverables}
            </p>
          </div>

          {projectFeedback ? (
            <div style={{
              padding: '1.5rem',
              background: '#f0fdf4',
              borderRadius: '1rem',
              border: '1px solid #10b981',
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🚀</span>
              <p style={{ color: '#10b981', fontWeight: '500' }}>{projectFeedback.message}</p>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Submitted: {new Date(projectFeedback.submittedAt).toLocaleString()}
              </p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  color: '#475569',
                  marginBottom: '0.5rem',
                }}>
                  Project Submission
                </label>
                <textarea
                  style={{
                    ...styles.notesTextarea,
                    minHeight: '200px',
                  }}
                  value={projectSubmission}
                  onChange={(e) => setProjectSubmission(e.target.value)}
                  placeholder="Provide a link to your project repository or upload your project files..."
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
              }}>
                <button
                  style={styles.cancelButton}
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  style={styles.saveButton}
                  onClick={handleProjectSubmit}
                  disabled={!projectSubmission.trim()}
                >
                  Submit Project
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // Styles
  const styles = {
    container: {
      padding: '2rem',
      background: '#ffffff',
      borderRadius: '1rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    progressOverview: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      borderRadius: '1rem',
      padding: '1.5rem',
      marginBottom: '2rem',
      color: 'white',
    },
    progressHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    progressTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      margin: 0,
    },
    progressActions: {
      display: 'flex',
      gap: '0.75rem',
    },
    progressButton: {
      padding: '0.5rem 1rem',
      background: 'rgba(255, 255, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '2rem',
      color: 'white',
      fontSize: '0.9rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    progressBarContainer: {
      width: '100%',
      height: '0.75rem',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '1rem',
      marginBottom: '1rem',
      position: 'relative',
    },
    progressBarFill: {
      height: '100%',
      background: 'white',
      borderRadius: '1rem',
      transition: 'width 0.3s ease',
    },
    progressText: {
      position: 'absolute',
      right: 0,
      top: '-1.5rem',
      fontSize: '0.9rem',
      fontWeight: '500',
    },
    progressStats: {
      display: 'flex',
      gap: '2rem',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    statItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.95rem',
    },
    continueButton: {
      padding: '0.5rem 1.5rem',
      background: 'white',
      border: 'none',
      borderRadius: '2rem',
      color: '#667eea',
      fontSize: '0.95rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginLeft: 'auto',
    },
    controlsBar: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      flexWrap: 'wrap',
    },
    searchBox: {
      flex: 1,
      position: 'relative',
      minWidth: '250px',
    },
    searchInput: {
      width: '100%',
      padding: '0.75rem 1rem 0.75rem 2.5rem',
      border: '2px solid #e2e8f0',
      borderRadius: '2rem',
      fontSize: '0.95rem',
      outline: 'none',
      transition: 'border-color 0.2s ease',
    },
    searchIcon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8',
    },
    clearSearch: {
      position: 'absolute',
      right: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#94a3b8',
      cursor: 'pointer',
      fontSize: '1rem',
    },
    filterControls: {
      display: 'flex',
      gap: '0.75rem',
      flexWrap: 'wrap',
    },
    select: {
      padding: '0.75rem 2rem 0.75rem 1rem',
      border: '2px solid #e2e8f0',
      borderRadius: '2rem',
      fontSize: '0.95rem',
      background: 'white',
      cursor: 'pointer',
      outline: 'none',
      appearance: 'none',
      backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 1rem center',
    },
    actionButton: {
      padding: '0.75rem 1.5rem',
      background: '#f8fafc',
      border: '2px solid #e2e8f0',
      borderRadius: '2rem',
      color: '#475569',
      fontSize: '0.95rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    searchResults: {
      background: '#f8fafc',
      borderRadius: '1rem',
      padding: '1.5rem',
      marginBottom: '2rem',
      border: '1px solid #e2e8f0',
    },
    searchResultsTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '1rem',
    },
    searchResultsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    },
    searchResultItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '0.75rem 1rem',
      background: 'white',
      borderRadius: '0.75rem',
      border: '1px solid #e2e8f0',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    sections: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    section: {
      background: 'white',
      borderRadius: '1rem',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.25rem',
      background: '#f8fafc',
      cursor: 'pointer',
      transition: 'background 0.2s ease',
    },
    sectionTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    expandIcon: {
      fontSize: '0.8rem',
      color: '#64748b',
    },
    sectionName: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#1e293b',
      margin: 0,
    },
    sectionProgress: {
      fontSize: '0.9rem',
      color: '#667eea',
      fontWeight: '500',
    },
    sectionComplete: {
      fontSize: '0.9rem',
      color: '#10b981',
      fontWeight: '500',
    },
    sectionMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#64748b',
      fontSize: '0.9rem',
    },
    lessons: {
      padding: '1rem',
    },
    lessonItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      borderBottom: '1px solid #e2e8f0',
      transition: 'background 0.2s ease',
    },
    lessonMainContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      flex: 1,
    },
    lessonInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      cursor: 'pointer',
      flex: 1,
    },
    lessonIcon: {
      width: '2rem',
      height: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '0.5rem',
      fontSize: '1.1rem',
    },
    lessonDetails: {
      flex: 1,
    },
    lessonTitle: {
      fontSize: '1rem',
      fontWeight: '500',
      color: '#1e293b',
      marginBottom: '0.25rem',
    },
    lessonTags: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap',
    },
    freeTag: {
      padding: '0.25rem 0.75rem',
      background: '#10b981',
      color: 'white',
      borderRadius: '2rem',
      fontSize: '0.75rem',
      fontWeight: '600',
    },
    notesTag: {
      padding: '0.25rem 0.75rem',
      background: '#f59e0b',
      color: 'white',
      borderRadius: '2rem',
      fontSize: '0.75rem',
      fontWeight: '600',
    },
    bookmarkTag: {
      padding: '0.25rem 0.75rem',
      background: '#667eea',
      color: 'white',
      borderRadius: '2rem',
      fontSize: '0.75rem',
      fontWeight: '600',
    },
    lessonActions: {
      display: 'flex',
      gap: '0.5rem',
    },
    actionBtn: {
      width: '2rem',
      height: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '1rem',
    },
    lessonMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      minWidth: '120px',
      justifyContent: 'flex-end',
    },
    lessonDuration: {
      color: '#64748b',
      fontSize: '0.9rem',
    },
    lessonType: {
      padding: '0.25rem 0.75rem',
      borderRadius: '2rem',
      color: 'white',
      fontSize: '0.75rem',
      fontWeight: '600',
      textTransform: 'capitalize',
    },
    modalOverlay: {
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
      padding: '1rem',
    },
    modalContainer: {
      background: 'white',
      borderRadius: '1.5rem',
      maxWidth: '600px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto',
      position: 'relative',
      padding: '2rem',
    },
    modalClose: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      width: '2rem',
      height: '2rem',
      borderRadius: '50%',
      border: 'none',
      background: '#f1f5f9',
      cursor: 'pointer',
      fontSize: '1.2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#64748b',
    },
    modalTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '1.5rem',
    },
    saveButton: {
      padding: '0.75rem 1.5rem',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      border: 'none',
      borderRadius: '2rem',
      color: 'white',
      fontSize: '0.95rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    cancelButton: {
      padding: '0.75rem 1.5rem',
      background: '#f1f5f9',
      border: 'none',
      borderRadius: '2rem',
      color: '#475569',
      fontSize: '0.95rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    notesTextarea: {
      width: '100%',
      padding: '1rem',
      border: '2px solid #e2e8f0',
      borderRadius: '0.75rem',
      fontSize: '0.95rem',
      lineHeight: '1.6',
      resize: 'vertical',
      marginBottom: '1rem',
    },
  };

  return (
    <div style={styles.container}>
      {/* Progress Overview */}
      {isEnrolled && (
        <div style={styles.progressOverview}>
          <div style={styles.progressHeader}>
            <h3 style={styles.progressTitle}>Your Progress</h3>
            <div style={styles.progressActions}>
              <button 
                style={styles.progressButton}
                onClick={() => setShowProgressModal(true)}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              >
                View Details
              </button>
              <button 
                style={styles.progressButton}
                onClick={() => setShowBookmarksModal(true)}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              >
                🔖 Bookmarks ({bookmarks.length})
              </button>
            </div>
          </div>
          
          <div style={styles.progressBarContainer}>
            <div style={{...styles.progressBarFill, width: `${overallProgress}%`}} />
            <span style={styles.progressText}>{Math.round(overallProgress)}% Complete</span>
          </div>
          
          <div style={styles.progressStats}>
            <span style={styles.statItem}>✅ {completedCount} completed</span>
            <span style={styles.statItem}>📝 {totalLessons - completedCount} remaining</span>
            {nextLesson && (
              <button 
                style={styles.continueButton}
                onClick={() => handleLessonClick(nextLesson.id, nextLesson.type, nextLesson)}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateX(5px)';
                  e.target.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateX(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Continue Learning →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div style={styles.controlsBar}>
        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search lessons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
          {searchTerm && (
            <button style={styles.clearSearch} onClick={() => setSearchTerm('')}>
              ✕
            </button>
          )}
        </div>

        <div style={styles.filterControls}>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Types</option>
            <option value="video">🎥 Video</option>
            <option value="quiz">📝 Quiz</option>
            <option value="assignment">📋 Assignment</option>
            <option value="article">📄 Article</option>
            <option value="discussion">💬 Discussion</option>
            <option value="code">💻 Code</option>
            <option value="exercise">🏋️ Exercise</option>
            <option value="project">🚀 Project</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.select}
          >
            <option value="default">Default Order</option>
            <option value="duration-asc">Duration (Shortest)</option>
            <option value="duration-desc">Duration (Longest)</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="completed">Completed First</option>
            <option value="incomplete">Incomplete First</option>
          </select>

          <button 
            style={styles.actionButton}
            onClick={expandAll}
            onMouseEnter={(e) => {
              e.target.style.background = '#edf2f7';
              e.target.style.borderColor = '#cbd5e1';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#f8fafc';
              e.target.style.borderColor = '#e2e8f0';
            }}
          >
            Expand All
          </button>
          <button 
            style={styles.actionButton}
            onClick={collapseAll}
            onMouseEnter={(e) => {
              e.target.style.background = '#edf2f7';
              e.target.style.borderColor = '#cbd5e1';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#f8fafc';
              e.target.style.borderColor = '#e2e8f0';
            }}
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Search Results */}
      {searchTerm && (
        <div style={styles.searchResults}>
          <h4 style={styles.searchResultsTitle}>Search Results ({getFilteredAndSortedLessons().length})</h4>
          <div style={styles.searchResultsList}>
            {getFilteredAndSortedLessons().map(lesson => (
              <div 
                key={lesson.id} 
                style={styles.searchResultItem}
                onClick={() => handleLessonClick(lesson.id, lesson.type, lesson)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(5px)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = '#667eea';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{getLessonIcon(lesson.type)}</span>
                <span style={{ flex: 1, color: '#1e293b', fontWeight: '500' }}>{lesson.title}</span>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{lesson.duration}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Curriculum Sections */}
      <div style={styles.sections}>
        {enhancedCurriculum.map((section, sectionIndex) => {
          const sectionProgress = calculateSectionProgress(section);
          return (
            <div key={sectionIndex} style={styles.section}>
              <div
                style={styles.sectionHeader}
                onClick={() => toggleSection(sectionIndex)}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
              >
                <div style={styles.sectionTitle}>
                  <span style={styles.expandIcon}>
                    {expandedSections[sectionIndex] ? '▼' : '▶'}
                  </span>
                  <h3 style={styles.sectionName}>{section.section}</h3>
                  {sectionProgress > 0 && sectionProgress < 100 && (
                    <span style={styles.sectionProgress}>{Math.round(sectionProgress)}%</span>
                  )}
                  {sectionProgress === 100 && (
                    <span style={styles.sectionComplete}>✅ Complete</span>
                  )}
                </div>
                <div style={styles.sectionMeta}>
                  <span>{section.lessons.length} lessons</span>
                  <span>•</span>
                  <span>{formatDuration(section.totalDuration)}</span>
                </div>
              </div>

              {expandedSections[sectionIndex] && (
                <div style={styles.lessons}>
                  {section.lessons.map((lesson, lessonIndex) => {
                    const isCompleted = completedLessons.includes(lesson.id);
                    const isBookmarked = bookmarks.some(b => b.id === lesson.id);
                    const hasNotes = lessonResources[lesson.id];
                    
                    return (
                      <div
                        key={lessonIndex}
                        style={{
                          ...styles.lessonItem,
                          background: isCompleted ? '#f0fdf4' : 'white',
                          opacity: isEnrolled ? 1 : 0.7,
                        }}
                        onMouseEnter={(e) => {
                          if (isEnrolled) {
                            e.currentTarget.style.background = isCompleted ? '#dcfce7' : '#f8fafc';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = isCompleted ? '#f0fdf4' : 'white';
                        }}
                      >
                        <div style={styles.lessonMainContent}>
                          <div 
                            style={styles.lessonInfo} 
                            onClick={() => isEnrolled && handleLessonClick(lesson.id, lesson.type, lesson)}
                          >
                            <span style={{
                              ...styles.lessonIcon,
                              background: `${getLessonColor(lesson.type)}20`,
                              color: getLessonColor(lesson.type),
                            }}>
                              {getLessonIcon(lesson.type)}
                            </span>
                            <div style={styles.lessonDetails}>
                              <span style={styles.lessonTitle}>{lesson.title}</span>
                              <div style={styles.lessonTags}>
                                {lesson.free && <span style={styles.freeTag}>Free</span>}
                                <span className={`difficulty-badge ${lesson.difficulty}`} style={{
                                  padding: '0.25rem 0.75rem',
                                  borderRadius: '2rem',
                                  fontSize: '0.75rem',
                                  fontWeight: '600',
                                  background: lesson.difficulty === 'beginner' ? '#10b98120' : 
                                             lesson.difficulty === 'intermediate' ? '#f59e0b20' : '#ef444420',
                                  color: lesson.difficulty === 'beginner' ? '#10b981' : 
                                         lesson.difficulty === 'intermediate' ? '#f59e0b' : '#ef4444',
                                  border: `1px solid ${lesson.difficulty === 'beginner' ? '#10b981' : 
                                                       lesson.difficulty === 'intermediate' ? '#f59e0b' : '#ef4444'}`,
                                }}>
                                  {lesson.difficulty}
                                </span>
                                {hasNotes && <span style={styles.notesTag}>📝 Notes</span>}
                                {isBookmarked && <span style={styles.bookmarkTag}>🔖</span>}
                              </div>
                            </div>
                          </div>

                          {isEnrolled && (
                            <div style={styles.lessonActions}>
                              <button
                                style={{
                                  ...styles.actionBtn,
                                  background: isCompleted ? '#10b98120' : '#f8fafc',
                                  color: isCompleted ? '#10b981' : '#64748b',
                                }}
                                onClick={() => handleMarkComplete(lesson.id)}
                                title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'scale(1.1)';
                                  e.currentTarget.style.background = isCompleted ? '#10b98140' : '#e2e8f0';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'scale(1)';
                                  e.currentTarget.style.background = isCompleted ? '#10b98120' : '#f8fafc';
                                }}
                              >
                                {isCompleted ? '✅' : '◻️'}
                              </button>
                              <button
                                style={styles.actionBtn}
                                onClick={() => handleAddNote(lesson)}
                                title="Add notes"
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'scale(1.1)';
                                  e.currentTarget.style.background = '#e2e8f0';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'scale(1)';
                                  e.currentTarget.style.background = '#f8fafc';
                                }}
                              >
                                📝
                              </button>
                              <button
                                style={{
                                  ...styles.actionBtn,
                                  background: isBookmarked ? '#667eea20' : '#f8fafc',
                                  color: isBookmarked ? '#667eea' : '#64748b',
                                }}
                                onClick={() => handleToggleBookmark(lesson)}
                                title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'scale(1.1)';
                                  e.currentTarget.style.background = isBookmarked ? '#667eea40' : '#e2e8f0';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'scale(1)';
                                  e.currentTarget.style.background = isBookmarked ? '#667eea20' : '#f8fafc';
                                }}
                              >
                                🔖
                              </button>
                              <button
                                style={styles.actionBtn}
                                onClick={() => handleDownloadLesson(lesson)}
                                disabled={downloadQueue.includes(lesson.id)}
                                title="Download for offline"
                                onMouseEnter={(e) => {
                                  if (!downloadQueue.includes(lesson.id)) {
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                    e.currentTarget.style.background = '#e2e8f0';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!downloadQueue.includes(lesson.id)) {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.background = '#f8fafc';
                                  }
                                }}
                              >
                                {downloadQueue.includes(lesson.id) ? '⏳' : '📥'}
                              </button>
                              <button
                                style={styles.actionBtn}
                                onClick={() => handleShareLesson(lesson)}
                                title="Share lesson"
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'scale(1.1)';
                                  e.currentTarget.style.background = '#e2e8f0';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'scale(1)';
                                  e.currentTarget.style.background = '#f8fafc';
                                }}
                              >
                                📤
                              </button>
                            </div>
                          )}
                        </div>

                        <div style={styles.lessonMeta}>
                          <span style={styles.lessonDuration}>{lesson.duration}m</span>
                          <span style={{
                            ...styles.lessonType,
                            background: getLessonColor(lesson.type),
                          }}>
                            {lesson.type}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Section Details Modal */}
      {showSectionDetails && selectedSection && (
        <SectionDetailsModal section={selectedSection} onClose={() => setShowSectionDetails(false)} />
      )}

      {/* Modals for different lesson types */}
      {showVideoPlayer && selectedVideoLesson && (
        <VideoPlayer lesson={selectedVideoLesson} onClose={() => setShowVideoPlayer(false)} />
      )}

      {showQuiz && selectedQuizLesson && (
        <QuizComponent lesson={selectedQuizLesson} onClose={() => setShowQuiz(false)} />
      )}

      {showAssignment && selectedAssignment && (
        <AssignmentComponent lesson={selectedAssignment} onClose={() => setShowAssignment(false)} />
      )}

      {showArticle && selectedArticle && (
        <ArticleComponent lesson={selectedArticle} onClose={() => setShowArticle(false)} />
      )}

      {showDiscussion && selectedDiscussion && (
        <DiscussionComponent lesson={selectedDiscussion} onClose={() => setShowDiscussion(false)} />
      )}

      {showCodeEditor && selectedCodeLesson && (
        <CodeEditorComponent lesson={selectedCodeLesson} onClose={() => setShowCodeEditor(false)} />
      )}

      {showExercise && selectedExercise && (
        <ExerciseComponent lesson={selectedExercise} onClose={() => setShowExercise(false)} />
      )}

      {showProject && selectedProject && (
        <ProjectComponent lesson={selectedProject} onClose={() => setShowProject(false)} />
      )}

      {/* Progress Modal */}
      {showProgressModal && (
        <div style={styles.modalOverlay} onClick={() => setShowProgressModal(false)}>
          <div style={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <button style={styles.modalClose} onClick={() => setShowProgressModal(false)}>×</button>
            
            <h2 style={styles.modalTitle}>Your Learning Progress</h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}>
              <div style={{
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: '1rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Total Lessons</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>{totalLessons}</div>
              </div>
              <div style={{
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: '1rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Completed</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>{completedCount}</div>
              </div>
              <div style={{
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: '1rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Remaining</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>{totalLessons - completedCount}</div>
              </div>
              <div style={{
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: '1rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Bookmarks</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>{bookmarks.length}</div>
              </div>
              <div style={{
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: '1rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Notes</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>{Object.keys(lessonResources).length}</div>
              </div>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
              Section Progress
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {enhancedCurriculum.map((section, index) => {
                const progress = calculateSectionProgress(section);
                return (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ width: '150px', fontSize: '0.95rem', color: '#475569' }}>{section.section}</span>
                    <div style={{ flex: 1, height: '0.5rem', background: '#e2e8f0', borderRadius: '1rem', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: '1rem', width: `${progress}%` }} />
                    </div>
                    <span style={{ width: '50px', fontSize: '0.9rem', color: '#64748b', textAlign: 'right' }}>{Math.round(progress)}%</span>
                  </div>
                );
              })}
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
              Achievements
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '1rem',
            }}>
              <div style={{
                padding: '1rem',
                background: completedCount > 0 ? 'linear-gradient(135deg, #667eea20, #764ba220)' : '#f8fafc',
                borderRadius: '1rem',
                textAlign: 'center',
                opacity: completedCount > 0 ? 1 : 0.5,
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#475569' }}>First Lesson</div>
              </div>
              <div style={{
                padding: '1rem',
                background: completedCount >= 10 ? 'linear-gradient(135deg, #667eea20, #764ba220)' : '#f8fafc',
                borderRadius: '1rem',
                textAlign: 'center',
                opacity: completedCount >= 10 ? 1 : 0.5,
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📚</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#475569' }}>10 Lessons</div>
              </div>
              <div style={{
                padding: '1rem',
                background: completedCount >= 25 ? 'linear-gradient(135deg, #667eea20, #764ba220)' : '#f8fafc',
                borderRadius: '1rem',
                textAlign: 'center',
                opacity: completedCount >= 25 ? 1 : 0.5,
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌟</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#475569' }}>25 Lessons</div>
              </div>
              <div style={{
                padding: '1rem',
                background: completedCount >= 50 ? 'linear-gradient(135deg, #667eea20, #764ba220)' : '#f8fafc',
                borderRadius: '1rem',
                textAlign: 'center',
                opacity: completedCount >= 50 ? 1 : 0.5,
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#475569' }}>50 Lessons</div>
              </div>
              <div style={{
                padding: '1rem',
                background: completedCount === totalLessons ? 'linear-gradient(135deg, #667eea20, #764ba220)' : '#f8fafc',
                borderRadius: '1rem',
                textAlign: 'center',
                opacity: completedCount === totalLessons ? 1 : 0.5,
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎓</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#475569' }}>Course Complete</div>
              </div>
              <div style={{
                padding: '1rem',
                background: bookmarks.length >= 5 ? 'linear-gradient(135deg, #667eea20, #764ba220)' : '#f8fafc',
                borderRadius: '1rem',
                textAlign: 'center',
                opacity: bookmarks.length >= 5 ? 1 : 0.5,
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔖</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#475569' }}>Bookmark Master</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bookmarks Modal */}
      {showBookmarksModal && (
        <div style={styles.modalOverlay} onClick={() => setShowBookmarksModal(false)}>
          <div style={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <button style={styles.modalClose} onClick={() => setShowBookmarksModal(false)}>×</button>
            
            <h2 style={styles.modalTitle}>Your Bookmarks</h2>
            
            {bookmarks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🔖</span>
                <p style={{ color: '#94a3b8' }}>No bookmarks yet. Click the bookmark icon on any lesson to save it.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {bookmarks.map((bookmark, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    background: '#f8fafc',
                    borderRadius: '0.75rem',
                    border: '1px solid #e2e8f0',
                  }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.5rem' }}>{getLessonIcon(bookmark.type)}</span>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
                          {bookmark.title}
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                          {bookmark.section} • {bookmark.duration}m • {bookmark.type}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        style={{
                          ...styles.actionBtn,
                          background: '#667eea',
                          color: 'white',
                          width: 'auto',
                          padding: '0 1rem',
                        }}
                        onClick={() => {
                          handleLessonClick(bookmark.id, bookmark.type, bookmark);
                          setShowBookmarksModal(false);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#764ba2';
                          e.currentTarget.style.transform = 'translateX(3px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#667eea';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        ▶️ Resume
                      </button>
                      <button 
                        style={{
                          ...styles.actionBtn,
                          background: '#ef4444',
                          color: 'white',
                          width: 'auto',
                          padding: '0 1rem',
                        }}
                        onClick={() => handleToggleBookmark(bookmark)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#dc2626';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#ef4444';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {showNotesModal && selectedLesson && (
        <div style={styles.modalOverlay} onClick={() => setShowNotesModal(false)}>
          <div style={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <button style={styles.modalClose} onClick={() => setShowNotesModal(false)}>×</button>
            
            <h2 style={styles.modalTitle}>Notes for "{selectedLesson.title}"</h2>
            
            <textarea
              style={styles.notesTextarea}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write your notes here..."
              rows="10"
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                style={styles.cancelButton}
                onClick={() => setShowNotesModal(false)}
                onMouseEnter={(e) => e.target.style.background = '#e2e8f0'}
                onMouseLeave={(e) => e.target.style.background = '#f1f5f9'}
              >
                Cancel
              </button>
              <button 
                style={styles.saveButton}
                onClick={handleSaveNote}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 6px -1px rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Progress Indicator */}
      {isDownloading && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'white',
          borderRadius: '2rem',
          padding: '0.75rem 1.5rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease',
        }}>
          <span style={{ fontSize: '1.2rem' }}>📥</span>
          <span style={{ color: '#1e293b', fontWeight: '500' }}>
            Downloading {downloadQueue.length} item{downloadQueue.length > 1 ? 's' : ''}...
          </span>
        </div>
      )}
    </div>
  );
};

export default CourseCurriculum;