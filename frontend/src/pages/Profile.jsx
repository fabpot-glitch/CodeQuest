import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Calendar, Award, Target, TrendingUp, Code, Trophy, Edit, Save, X, Github, Linkedin, Globe, MapPin, Briefcase, GraduationCap, Star, Flame, CheckCircle2, Camera, Phone, Building2, BookOpen, Clock, Sparkles, Lock, Unlock, Info, ArrowRight, Zap, BarChart3 } from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);
  
  // Modal states
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  
  const [userInfo, setUserInfo] = useState({
    fullName: '', email: '', phone: '', dateOfBirth: '', gender: '', country: '', city: '', university: '', degree: '', graduationYear: '', currentRole: '', company: '', yearsOfExperience: '', primaryLanguage: 'JavaScript', bio: '', github: '', linkedin: '', twitter: '', instagram: '', facebook: '', youtube: '', website: '', timezone: ''
  });

  const [stats, setStats] = useState({ solvedProblems: 0, rank: 0, streak: 0, points: 0 });
  const [activityData, setActivityData] = useState([]);
  const [badges, setBadges] = useState([]);
  const [skillsProgress, setSkillsProgress] = useState([]);
  const [problemHistory, setProblemHistory] = useState([]);

  useEffect(() => {
    loadProfileData();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveToStorage();
    }
  }, [userInfo, stats, activityData, badges, skillsProgress, profileImage, problemHistory]);

  useEffect(() => {
    if (!loading) {
      checkAndAwardBadges();
    }
  }, [stats.solvedProblems, stats.streak, stats.points, skillsProgress]);

  const loadProfileData = async () => {
    try {
      const userInfoResult = await window.storage.get('profile:userInfo');
      if (userInfoResult) {
        setUserInfo(JSON.parse(userInfoResult.value));
      }

      const imageResult = await window.storage.get('profile:image');
      if (imageResult) {
        setProfileImage(imageResult.value);
      }

      const statsResult = await window.storage.get('profile:stats');
      if (statsResult) {
        setStats(JSON.parse(statsResult.value));
      } else {
        setStats({ solvedProblems: 0, rank: 0, streak: 0, points: 0 });
      }

      const activityResult = await window.storage.get('profile:activity');
      if (activityResult) {
        setActivityData(JSON.parse(activityResult.value));
      } else {
        const newActivityData = generateInitialActivityData();
        setActivityData(newActivityData);
      }

      const badgesResult = await window.storage.get('profile:badges');
      if (badgesResult) {
        setBadges(JSON.parse(badgesResult.value));
      } else {
        const allBadges = initializeAllBadges();
        setBadges(allBadges);
      }

      const skillsResult = await window.storage.get('profile:skills');
      if (skillsResult) {
        setSkillsProgress(JSON.parse(skillsResult.value));
      } else {
        const initialSkills = initializeSkills();
        setSkillsProgress(initialSkills);
      }

      const historyResult = await window.storage.get('profile:history');
      if (historyResult) {
        setProblemHistory(JSON.parse(historyResult.value));
      }

    } catch (err) {
      console.error('Error loading profile:', err);
      setActivityData(generateInitialActivityData());
      setBadges(initializeAllBadges());
      setSkillsProgress(initializeSkills());
      setProblemHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const saveToStorage = async () => {
    try {
      await window.storage.set('profile:userInfo', JSON.stringify(userInfo));
      await window.storage.set('profile:stats', JSON.stringify(stats));
      await window.storage.set('profile:activity', JSON.stringify(activityData));
      await window.storage.set('profile:badges', JSON.stringify(badges));
      await window.storage.set('profile:skills', JSON.stringify(skillsProgress));
      await window.storage.set('profile:history', JSON.stringify(problemHistory));
      if (profileImage) {
        await window.storage.set('profile:image', profileImage);
      }
    } catch (err) {
      console.error('Error saving to storage:', err);
    }
  };

  const generateInitialActivityData = () => {
    const data = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      data.push({ 
        date: date.toISOString().split('T')[0], 
        count: 0,
        problems: []
      });
    }
    return data;
  };

  const initializeAllBadges = () => {
    return [
      { 
        id: 'streak_7', 
        name: '7 Day Streak', 
        icon: 'Flame', 
        gradient: 'from-orange-500 to-red-500', 
        description: 'Solved problems for 7 consecutive days',
        detailedDescription: 'Maintain a consistent coding habit by solving at least one problem every day for a week straight. This shows dedication and discipline in your learning journey.',
        unlocked: false,
        unlockedAt: null,
        requirement: 'streak',
        value: 7,
        tips: 'Set a daily reminder to solve at least one problem. Start with easy problems to maintain your streak!',
        category: 'Consistency',
        rarity: 'Common',
        pointsValue: 100
      },
      { 
        id: 'problems_50', 
        name: '50 Problems', 
        icon: 'Target', 
        gradient: 'from-blue-500 to-purple-500', 
        description: 'Solved 50 problems',
        detailedDescription: 'Reach a significant milestone by solving your first 50 coding problems. This demonstrates solid foundational knowledge across various problem types.',
        unlocked: false,
        unlockedAt: null,
        requirement: 'solvedProblems',
        value: 50,
        tips: 'Focus on understanding patterns in problems. Quality over quantity - make sure you understand each solution!',
        category: 'Milestones',
        rarity: 'Uncommon',
        pointsValue: 250
      },
      { 
        id: 'problems_100', 
        name: '100 Problems', 
        icon: 'CheckCircle2', 
        gradient: 'from-green-500 to-emerald-500', 
        description: 'Solved 100 problems',
        detailedDescription: 'An impressive achievement! You\'ve solved 100 problems, showing strong problem-solving skills and commitment to continuous learning.',
        unlocked: false,
        unlockedAt: null,
        requirement: 'solvedProblems',
        value: 100,
        tips: 'Review problems you found challenging. Try solving them again after a few weeks to reinforce your learning.',
        category: 'Milestones',
        rarity: 'Rare',
        pointsValue: 500
      },
      { 
        id: 'early_adopter', 
        name: 'Early Adopter', 
        icon: 'Star', 
        gradient: 'from-purple-500 to-pink-500', 
        description: 'Joined in the first month',
        detailedDescription: 'Welcome to the community! You\'re one of our first users. Thank you for being part of our journey from the beginning. Your early support helps shape the platform and inspires others!',
        unlocked: true,
        unlockedAt: new Date().toISOString(),
        requirement: 'special',
        value: 0,
        tips: 'Share your experience with the community and help newcomers get started!',
        category: 'Special',
        rarity: 'Legendary',
        pointsValue: 1000
      },
      { 
        id: 'quick_solver', 
        name: 'Quick Solver', 
        icon: 'TrendingUp', 
        gradient: 'from-green-500 to-emerald-500', 
        description: 'Solved 10 problems in one day',
        detailedDescription: 'Wow! You solved 10 problems in a single day. This shows incredible focus, dedication, and problem-solving stamina. Remember to take breaks and stay hydrated during intense coding sessions!',
        unlocked: false,
        unlockedAt: null,
        requirement: 'dailyProblems',
        value: 10,
        tips: 'Pick a dedicated day for a coding marathon. Mix easy and medium problems to maintain momentum and avoid burnout!',
        category: 'Speed',
        rarity: 'Uncommon',
        pointsValue: 200
      },
      { 
        id: 'code_master', 
        name: 'Code Master', 
        icon: 'Code', 
        gradient: 'from-yellow-500 to-orange-500', 
        description: 'Mastered 3 categories',
        detailedDescription: 'You\'ve achieved 80%+ progress in 3 different problem categories. This demonstrates well-rounded knowledge and true mastery of multiple algorithmic concepts. You\'re becoming a versatile problem solver!',
        unlocked: false,
        unlockedAt: null,
        requirement: 'categories',
        value: 3,
        tips: 'Focus on completing categories you\'re close to finishing. Deep knowledge in specific areas is highly valuable for interviews!',
        category: 'Mastery',
        rarity: 'Rare',
        pointsValue: 400
      },
      { 
        id: 'night_owl', 
        name: 'Night Owl', 
        icon: 'Clock', 
        gradient: 'from-indigo-500 to-purple-500', 
        description: 'Solved problems at midnight',
        detailedDescription: 'The night is dark and full of code! You\'ve solved problems between midnight and 2 AM. While we admire your dedication and late-night focus, remember to maintain a healthy sleep schedule!',
        unlocked: false,
        unlockedAt: null,
        requirement: 'special',
        value: 0,
        tips: 'If you\'re a night owl by nature, embrace it! Just maintain a consistent sleep schedule for your health.',
        category: 'Special',
        rarity: 'Uncommon',
        pointsValue: 150
      },
      { 
        id: 'streak_30', 
        name: '30 Day Streak', 
        icon: 'Flame', 
        gradient: 'from-red-500 to-pink-500', 
        description: 'Solved problems for 30 consecutive days',
        detailedDescription: 'A full month of consistent practice! This is an exceptional achievement that shows true commitment to improving your coding skills. You\'ve built a strong habit that will serve you well throughout your career.',
        unlocked: false,
        unlockedAt: null,
        requirement: 'streak',
        value: 30,
        tips: 'Build habits around your practice. Same time, same place each day helps maintain consistency! Track your progress and celebrate small wins.',
        category: 'Consistency',
        rarity: 'Epic',
        pointsValue: 750
      },
      { 
        id: 'points_1000', 
        name: '1000 Points', 
        icon: 'Award', 
        gradient: 'from-yellow-400 to-orange-500', 
        description: 'Earned 1000 total points',
        detailedDescription: 'You\'ve accumulated 1000 points through your problem-solving journey! This represents a significant investment in your skills and countless hours of practice, learning, and growth.',
        unlocked: false,
        unlockedAt: null,
        requirement: 'points',
        value: 1000,
        tips: 'Challenge yourself with harder problems for more points. Balance difficulty with consistency for optimal learning!',
        category: 'Points',
        rarity: 'Rare',
        pointsValue: 500
      }
    ];
  };

  const initializeSkills = () => {
    return [
      { 
        skill: 'Arrays & Hashing', 
        progress: 0, 
        solved: 0, 
        total: 50, 
        color: 'bg-gradient-to-r from-green-500 to-emerald-500',
        description: 'Master array manipulation and hash table operations',
        detailedDescription: 'Arrays and hashing are fundamental data structures in computer science. Master techniques like two-sum patterns, frequency counting, and hash map operations to solve complex problems efficiently.',
        problems: [
          { name: 'Two Sum', difficulty: 'Easy', description: 'Find indices of two numbers that add up to target' },
          { name: 'Group Anagrams', difficulty: 'Medium', description: 'Group strings that are anagrams of each other' },
          { name: 'Top K Frequent Elements', difficulty: 'Medium', description: 'Find k most frequent elements in array' },
          { name: 'Product of Array Except Self', difficulty: 'Medium', description: 'Calculate product array without division' },
          { name: 'Valid Sudoku', difficulty: 'Medium', description: 'Determine if Sudoku board is valid' },
          { name: 'Longest Consecutive Sequence', difficulty: 'Medium', description: 'Find longest consecutive sequence' },
          { name: 'Contains Duplicate', difficulty: 'Easy', description: 'Check if array contains duplicates' },
          { name: 'Valid Anagram', difficulty: 'Easy', description: 'Check if two strings are anagrams' }
        ],
        keyTechniques: ['Hash Maps', 'Frequency Counting', 'Two-Sum Pattern', 'Prefix/Suffix Arrays'],
        averageDifficulty: 'Medium',
        estimatedTime: '2-3 months'
      },
      { 
        skill: 'Two Pointers', 
        progress: 0, 
        solved: 0, 
        total: 40, 
        color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
        description: 'Use two pointers to efficiently solve problems',
        detailedDescription: 'Two pointers is an elegant technique for solving array and string problems. Learn to use opposing pointers, fast-slow pointers, and sliding window variations to optimize solutions.',
        problems: [
          { name: 'Valid Palindrome', difficulty: 'Easy', description: 'Check if string is a palindrome' },
          { name: 'Two Sum II', difficulty: 'Medium', description: 'Two sum in sorted array' },
          { name: '3Sum', difficulty: 'Medium', description: 'Find three numbers that sum to zero' },
          { name: 'Container With Most Water', difficulty: 'Medium', description: 'Find container with most water' },
          { name: 'Trapping Rain Water', difficulty: 'Hard', description: 'Calculate trapped rainwater' },
          { name: 'Remove Duplicates', difficulty: 'Easy', description: 'Remove duplicates from sorted array' },
          { name: 'Move Zeroes', difficulty: 'Easy', description: 'Move all zeros to end' },
          { name: 'Sort Colors', difficulty: 'Medium', description: 'Sort array with Dutch flag algorithm' }
        ],
        keyTechniques: ['Opposite Direction Pointers', 'Same Direction Pointers', 'Fast-Slow Pointers', 'Partition'],
        averageDifficulty: 'Medium',
        estimatedTime: '1-2 months'
      },
      { 
        skill: 'Sliding Window', 
        progress: 0, 
        solved: 0, 
        total: 30, 
        color: 'bg-gradient-to-r from-purple-500 to-pink-500',
        description: 'Optimize solutions using the sliding window technique',
        detailedDescription: 'Sliding window is a powerful optimization technique for substring and subarray problems. Master fixed and variable-size windows to solve complex string and array problems efficiently.',
        problems: [
          { name: 'Best Time to Buy Stock', difficulty: 'Easy', description: 'Find maximum profit from stock prices' },
          { name: 'Longest Substring', difficulty: 'Medium', description: 'Find longest substring without repeating characters' },
          { name: 'Minimum Window Substring', difficulty: 'Hard', description: 'Find minimum window containing all characters' },
          { name: 'Permutation in String', difficulty: 'Medium', description: 'Check if one string is permutation of another' },
          { name: 'Sliding Window Maximum', difficulty: 'Hard', description: 'Find maximum in each sliding window' },
          { name: 'Longest Repeating Character', difficulty: 'Medium', description: 'Find longest substring with same characters after k replacements' }
        ],
        keyTechniques: ['Fixed Window', 'Variable Window', 'Window with HashMap', 'Two Pointer Window'],
        averageDifficulty: 'Medium-Hard',
        estimatedTime: '1 month'
      },
      { 
        skill: 'Stack', 
        progress: 0, 
        solved: 0, 
        total: 40, 
        color: 'bg-gradient-to-r from-pink-500 to-rose-500',
        description: 'Utilize stack data structure for elegant solutions',
        detailedDescription: 'Stacks are LIFO data structures perfect for problems involving matching, nesting, and backtracking. Learn to use stacks for parsing, monotonic stack patterns, and more.',
        problems: [
          { name: 'Valid Parentheses', difficulty: 'Easy', description: 'Check if parentheses are balanced' },
          { name: 'Min Stack', difficulty: 'Medium', description: 'Design stack with O(1) minimum' },
          { name: 'Evaluate Reverse Polish', difficulty: 'Medium', description: 'Evaluate postfix expression' },
          { name: 'Generate Parentheses', difficulty: 'Medium', description: 'Generate all valid parentheses combinations' },
          { name: 'Daily Temperatures', difficulty: 'Medium', description: 'Find next warmer temperature' },
          { name: 'Car Fleet', difficulty: 'Medium', description: 'Calculate car fleets reaching destination' },
          { name: 'Largest Rectangle', difficulty: 'Hard', description: 'Find largest rectangle in histogram' },
          { name: 'Implement Queue', difficulty: 'Easy', description: 'Implement queue using stacks' }
        ],
        keyTechniques: ['Monotonic Stack', 'Stack for Matching', 'Stack for Parsing', 'Backtracking with Stack'],
        averageDifficulty: 'Medium',
        estimatedTime: '1-2 months'
      },
      { 
        skill: 'Binary Search', 
        progress: 0, 
        solved: 0, 
        total: 40, 
        color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
        description: 'Efficiently search sorted data structures',
        detailedDescription: 'Binary search is one of the most important algorithms. Master standard binary search, variants, and applications to solve search and optimization problems in O(log n) time.',
        problems: [
          { name: 'Binary Search', difficulty: 'Easy', description: 'Implement basic binary search' },
          { name: 'Search 2D Matrix', difficulty: 'Medium', description: 'Search in 2D sorted matrix' },
          { name: 'Koko Eating Bananas', difficulty: 'Medium', description: 'Find minimum eating speed' },
          { name: 'Find Minimum in Rotated', difficulty: 'Medium', description: 'Find minimum in rotated sorted array' },
          { name: 'Search Rotated Array', difficulty: 'Medium', description: 'Search in rotated sorted array' },
          { name: 'Time Based Key-Value', difficulty: 'Medium', description: 'Design time-based key-value store' },
          { name: 'Median of Two Sorted', difficulty: 'Hard', description: 'Find median of two sorted arrays' },
          { name: 'Split Array', difficulty: 'Hard', description: 'Split array to minimize largest sum' }
        ],
        keyTechniques: ['Standard Binary Search', 'Binary Search on Answer', 'Rotated Array Search', 'Binary Search on 2D'],
        averageDifficulty: 'Medium',
        estimatedTime: '1-2 months'
      },
      { 
        skill: 'Linked Lists', 
        progress: 0, 
        solved: 0, 
        total: 40, 
        color: 'bg-gradient-to-r from-indigo-500 to-purple-500',
        description: 'Manipulate and traverse linked list structures',
        detailedDescription: 'Linked lists are fundamental data structures. Master pointer manipulation, reversal techniques, cycle detection, and merging to handle complex linked list problems.',
        problems: [
          { name: 'Reverse Linked List', difficulty: 'Easy', description: 'Reverse a singly linked list' },
          { name: 'Merge Two Lists', difficulty: 'Easy', description: 'Merge two sorted linked lists' },
          { name: 'Reorder List', difficulty: 'Medium', description: 'Reorder list in specific pattern' },
          { name: 'Remove Nth Node', difficulty: 'Medium', description: 'Remove nth node from end' },
          { name: 'Copy List with Random', difficulty: 'Medium', description: 'Deep copy list with random pointers' },
          { name: 'Add Two Numbers', difficulty: 'Medium', description: 'Add two numbers represented as linked lists' },
          { name: 'Linked List Cycle', difficulty: 'Easy', description: 'Detect cycle in linked list' },
          { name: 'Find Duplicate', difficulty: 'Medium', description: 'Find duplicate number using cycle detection' }
        ],
        keyTechniques: ['Pointer Manipulation', 'Fast-Slow Pointers', 'Reversal', 'Dummy Nodes'],
        averageDifficulty: 'Medium',
        estimatedTime: '1-2 months'
      },
      { 
        skill: 'Trees', 
        progress: 0, 
        solved: 0, 
        total: 40, 
        color: 'bg-gradient-to-r from-red-500 to-pink-500',
        description: 'Navigate and modify tree data structures',
        detailedDescription: 'Trees are hierarchical data structures crucial for many applications. Master traversals (DFS, BFS), tree construction, and advanced tree operations for binary and n-ary trees.',
        problems: [
          { name: 'Invert Binary Tree', difficulty: 'Easy', description: 'Invert a binary tree' },
          { name: 'Maximum Depth', difficulty: 'Easy', description: 'Find maximum depth of tree' },
          { name: 'Diameter of Tree', difficulty: 'Easy', description: 'Find diameter of binary tree' },
          { name: 'Balanced Tree', difficulty: 'Easy', description: 'Check if tree is height-balanced' },
          { name: 'Same Tree', difficulty: 'Easy', description: 'Check if two trees are identical' },
          { name: 'Subtree of Another', difficulty: 'Easy', description: 'Check if tree is subtree of another' },
          { name: 'Lowest Common Ancestor', difficulty: 'Medium', description: 'Find lowest common ancestor' },
          { name: 'Level Order Traversal', difficulty: 'Medium', description: 'Perform level order traversal' }
        ],
        keyTechniques: ['DFS (Preorder, Inorder, Postorder)', 'BFS/Level Order', 'Recursion', 'Tree Construction'],
        averageDifficulty: 'Medium',
        estimatedTime: '2-3 months'
      },
      { 
        skill: 'Dynamic Programming', 
        progress: 0, 
        solved: 0, 
        total: 40, 
        color: 'bg-gradient-to-r from-cyan-500 to-blue-500',
        description: 'Break down problems using memoization and tabulation',
        detailedDescription: 'Dynamic Programming is a powerful technique for optimization problems. Master the art of breaking down problems into subproblems, recognizing patterns, and building solutions bottom-up or top-down.',
        problems: [
          { name: 'Climbing Stairs', difficulty: 'Easy', description: 'Count ways to climb n stairs' },
          { name: 'House Robber', difficulty: 'Medium', description: 'Maximum money from non-adjacent houses' },
          { name: 'Coin Change', difficulty: 'Medium', description: 'Minimum coins to make amount' },
          { name: 'Longest Increasing Subsequence', difficulty: 'Medium', description: 'Find longest increasing subsequence' },
          { name: 'Word Break', difficulty: 'Medium', description: 'Check if string can be segmented' },
          { name: 'Unique Paths', difficulty: 'Medium', description: 'Count unique paths in grid' },
          { name: 'Jump Game', difficulty: 'Medium', description: 'Check if can reach last index' },
          { name: 'Longest Common Subsequence', difficulty: 'Medium', description: 'Find longest common subsequence' }
        ],
        keyTechniques: ['Memoization (Top-Down)', 'Tabulation (Bottom-Up)', 'State Machine', '2D DP'],
        averageDifficulty: 'Medium-Hard',
        estimatedTime: '3-4 months'
      }
    ];
  };

  const checkAndAwardBadges = () => {
    const updatedBadges = badges.map(badge => {
      if (badge.unlocked) return badge;

      let shouldUnlock = false;

      switch (badge.requirement) {
        case 'solvedProblems':
          shouldUnlock = stats.solvedProblems >= badge.value;
          break;
        case 'streak':
          shouldUnlock = stats.streak >= badge.value;
          break;
        case 'points':
          shouldUnlock = stats.points >= badge.value;
          break;
        case 'categories':
          const masteredCategories = skillsProgress.filter(s => s.progress >= 80).length;
          shouldUnlock = masteredCategories >= badge.value;
          break;
        case 'dailyProblems':
          const today = new Date().toISOString().split('T')[0];
          const todayActivity = activityData.find(d => d.date === today);
          shouldUnlock = todayActivity && todayActivity.count >= badge.value;
          break;
        default:
          break;
      }

      if (shouldUnlock) {
        setSuccessMessage(`🎉 New badge unlocked: ${badge.name}!`);
        setTimeout(() => setSuccessMessage(''), 5000);
        return { ...badge, unlocked: true, unlockedAt: new Date().toISOString() };
      }

      return badge;
    });

    setBadges(updatedBadges);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        setTimeout(() => setError(null), 3000);
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        setTimeout(() => setError(null), 3000);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setSuccessMessage('Profile image updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = async () => {
    setProfileImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    try {
      await window.storage.delete('profile:image');
    } catch (err) {
      console.error('Error deleting image:', err);
    }
    setSuccessMessage('Profile image removed successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleInputChange = (field, value) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setSaving(true);
    setError(null);
    if (!userInfo.fullName || !userInfo.email) {
      setError('Full name and email are required');
      setSaving(false);
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    setTimeout(() => {
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setSaving(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
  };

  const solveProblem = (skillName, difficulty = 'medium') => {
    const pointsMap = { easy: 10, medium: 20, hard: 30 };
    const newPoints = pointsMap[difficulty] || 20;
    
    const problemEntry = {
      id: Date.now(),
      skill: skillName,
      difficulty,
      points: newPoints,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0]
    };

    setProblemHistory(prev => [problemEntry, ...prev].slice(0, 100));
    
    setStats(prev => ({
      ...prev,
      solvedProblems: prev.solvedProblems + 1,
      points: prev.points + newPoints,
      rank: Math.max(1, 10000 - (prev.solvedProblems + 1) * 10)
    }));

    const today = new Date().toISOString().split('T')[0];
    setActivityData(prev => {
      const newActivity = [...prev];
      const todayIndex = newActivity.findIndex(d => d.date === today);
      if (todayIndex !== -1) {
        const currentDay = newActivity[todayIndex];
        newActivity[todayIndex] = { 
          ...currentDay, 
          count: currentDay.count + 1,
          problems: [...(currentDay.problems || []), problemEntry]
        };
      }
      return newActivity;
    });

    if (skillName) {
      setSkillsProgress(prev => {
        return prev.map(skill => {
          if (skill.skill === skillName) {
            const newSolved = skill.solved + 1;
            const newProgress = Math.round((newSolved / skill.total) * 100);
            return { ...skill, solved: newSolved, progress: newProgress };
          }
          return skill;
        });
      });
    }

    updateStreak();

    setSuccessMessage(`✅ Problem solved! +${newPoints} points (${difficulty})`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const updateStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const todayActivity = activityData.find(d => d.date === today);
    const yesterdayActivity = activityData.find(d => d.date === yesterdayStr);

    if (todayActivity && todayActivity.count === 1) {
      if (yesterdayActivity && yesterdayActivity.count > 0) {
        setStats(prev => ({ ...prev, streak: prev.streak + 1 }));
      } else {
        setStats(prev => ({ ...prev, streak: 1 }));
      }
    }
  };

  const resetProgress = async () => {
    if (!window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      return;
    }

    const newActivityData = generateInitialActivityData();
    const newBadges = initializeAllBadges();
    const newSkills = initializeSkills();
    const newStats = { solvedProblems: 0, rank: 0, streak: 0, points: 0 };

    setActivityData(newActivityData);
    setBadges(newBadges);
    setSkillsProgress(newSkills);
    setStats(newStats);
    setProblemHistory([]);

    setSuccessMessage('Progress reset successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const getIconComponent = (iconName) => {
    const icons = { Flame, Target, Star, TrendingUp, Code, Clock, CheckCircle2, Award };
    return icons[iconName] || Trophy;
  };

  const statsArray = [
    { label: 'Problems Solved', value: stats.solvedProblems || 0, icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-50', change: stats.solvedProblems > 0 ? `+${Math.floor(stats.solvedProblems * 0.2)} this month` : 'Start solving!' },
    { label: 'Global Rank', value: stats.rank > 0 ? `#${stats.rank}` : 'Unranked', icon: Trophy, color: 'text-yellow-600', bgColor: 'bg-yellow-50', change: stats.rank > 0 ? '↑ 5 positions' : 'Solve to rank' },
    { label: 'Current Streak', value: `${stats.streak || 0} days`, icon: Flame, color: 'text-orange-600', bgColor: 'bg-orange-50', change: stats.streak > 0 ? 'Keep it up!' : 'Start today!' },
    { label: 'Total Points', value: stats.points || 0, icon: Award, color: 'text-purple-600', bgColor: 'bg-purple-50', change: stats.points > 0 ? `+${Math.floor(stats.points * 0.1)} this week` : 'Earn points!' }
  ];

  const getHeatmapColor = (count) => {
    if (count === 0) return 'bg-gray-200';
    if (count <= 2) return 'bg-green-200';
    if (count <= 5) return 'bg-green-400';
    if (count <= 7) return 'bg-green-600';
    return 'bg-green-700';
  };

  const groupByWeeks = (data) => {
    const weeks = [];
    for (let i = 0; i < data.length; i += 7) {
      weeks.push(data.slice(i, i + 7));
    }
    return weeks;
  };

  const activityWeeks = groupByWeeks(activityData);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const handleSkillClick = (skill) => {
    setSelectedSkill(skill);
    setShowSkillModal(true);
  };

  const handleBadgeClick = (badge) => {
    setSelectedBadge(badge);
    setShowBadgeModal(true);
  };

  const handleActivityDayClick = (day) => {
    setSelectedDay(day);
    setShowActivityModal(true);
  };

  const getRarityColor = (rarity) => {
    switch(rarity) {
      case 'Common': return 'text-gray-600 bg-gray-100';
      case 'Uncommon': return 'text-green-600 bg-green-100';
      case 'Rare': return 'text-blue-600 bg-blue-100';
      case 'Epic': return 'text-purple-600 bg-purple-100';
      case 'Legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const displayName = userInfo.fullName || 'Your Name';
  const displayEmail = userInfo.email || 'your.email@example.com';
  const unlockedBadges = badges.filter(b => b.unlocked);

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {successMessage && <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl mb-4 animate-pulse">✓ {successMessage}</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-4">✗ {error}</div>}

        <div className="text-center mb-8">
          <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 mb-3">My Profile</h2>
          <p className="text-lg text-gray-600">Showcase your coding journey</p>
        </div>

        <div className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-2xl border-2 border-purple-200 overflow-hidden shadow-lg">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(139,92,246,0.1) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          </div>
          
          <div className="relative p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
              <div className="relative group cursor-pointer">
                <div className="relative">
                  {profileImage ? (
                    <div className="relative">
                      <img src={profileImage} alt="Profile" className="w-40 h-40 rounded-full object-cover border-4 border-purple-300 shadow-xl" />
                      <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="flex flex-col gap-2">
                          <button onClick={() => fileInputRef.current?.click()} className="text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                            <Camera className="w-5 h-5 text-white mx-auto mb-1" />
                            <span className="text-xs text-white font-medium">Change</span>
                          </button>
                          <button onClick={handleDeleteImage} className="text-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                            <X className="w-5 h-5 text-white mx-auto mb-1" />
                            <span className="text-xs text-white font-medium">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => fileInputRef.current?.click()} 
                      className="w-40 h-40 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-full flex flex-col items-center justify-center text-white border-4 border-purple-300 shadow-xl hover:border-purple-400 transition-all duration-300 hover:scale-105"
                    >
                      <Camera className="w-12 h-12 text-white mb-2" />
                      <span className="text-sm font-semibold">Upload Photo</span>
                    </button>
                  )}
                  
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 shadow-lg pointer-events-none">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>

              <div className="flex-1 w-full">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-purple-700 mb-2">Full Name *</label>
                      <input type="text" value={userInfo.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl text-gray-900 text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Enter your full name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-700 mb-2">Email *</label>
                      <input type="email" value={userInfo.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="your.email@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-700 mb-2">Bio</label>
                      <textarea value={userInfo.bio} onChange={(e) => handleInputChange('bio', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none" rows="3" placeholder="Tell us about yourself..." />
                    </div>
                  </div>
                ) : (
                  <>
                    {displayName && <h3 className="text-4xl font-semibold text-gray-900 mb-2">{displayName}</h3>}
                    {(userInfo.currentRole || userInfo.company) ? (
                      <p className="text-lg text-purple-700 mb-4">
                        {userInfo.currentRole && <span>{userInfo.currentRole}</span>}
                        {userInfo.currentRole && userInfo.company && <span> @ </span>}
                        {userInfo.company && <span>{userInfo.company}</span>}
                      </p>
                    ) : (
                      <p className="text-lg text-purple-600/60 mb-4 italic">Software Engineer • Developer • Problem Solver</p>
                    )}
                    <p className="text-gray-700 mb-4 leading-relaxed">{userInfo.bio || 'Complete your profile to showcase your skills, achievements, and coding journey to the community.'}</p>
                  </>
                )}

                <div className="flex flex-wrap gap-4 text-sm">
                  {displayEmail && (
                    <div className="flex items-center gap-2 bg-white border border-purple-200 px-3 py-2 rounded-lg">
                      <Mail className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-700 font-medium">{displayEmail}</span>
                    </div>
                  )}
                  {userInfo.city && userInfo.country && (
                    <div className="flex items-center gap-2 bg-white border border-purple-200 px-3 py-2 rounded-lg">
                      <MapPin className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-700 font-medium">{userInfo.city}, {userInfo.country}</span>
                    </div>
                  )}
                  {userInfo.university && (
                    <div className="flex items-center gap-2 bg-white border border-purple-200 px-3 py-2 rounded-lg">
                      <GraduationCap className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-700 font-medium">{userInfo.university}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  {userInfo.github && (
                    <a href={userInfo.github.startsWith('http') ? userInfo.github : `https://${userInfo.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-2 rounded-lg hover:border-purple-500 transition-all">
                      <Github className="w-4 h-4 text-gray-600" />
                    </a>
                  )}
                  {userInfo.linkedin && (
                    <a href={userInfo.linkedin.startsWith('http') ? userInfo.linkedin : `https://${userInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-2 rounded-lg hover:border-blue-500 transition-all">
                      <Linkedin className="w-4 h-4 text-gray-600" />
                    </a>
                  )}
                  {userInfo.website && (
                    <a href={userInfo.website.startsWith('http') ? userInfo.website : `https://${userInfo.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-2 rounded-lg hover:border-green-500 transition-all">
                      <Globe className="w-4 h-4 text-gray-600" />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                      <Save className="w-5 h-5" />
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={handleCancel} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all font-semibold shadow-lg disabled:opacity-50">
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                    <Edit className="w-5 h-5" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsArray.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="relative bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-purple-400 transition-all overflow-hidden group hover:transform hover:scale-105 cursor-pointer shadow-sm hover:shadow-md">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className={`p-3 rounded-xl ${stat.bgColor} w-fit mb-4`}>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-semibold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600 mb-2 font-medium">{stat.label}</div>
                  <div className="text-xs text-gray-500">{stat.change}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200 shadow-sm">
          <h3 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Demo Controls (Test Functionality)
          </h3>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => solveProblem('Arrays & Hashing', 'easy')} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg transform hover:scale-105">
              Solve Easy Problem
            </button>
            <button onClick={() => solveProblem('Two Pointers', 'medium')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg transform hover:scale-105">
              Solve Medium Problem
            </button>
            <button onClick={() => solveProblem('Dynamic Programming', 'hard')} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg transform hover:scale-105">
              Solve Hard Problem
            </button>
            <button onClick={resetProgress} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg transform hover:scale-105">
              Reset All Progress
            </button>
          </div>
          <p className="text-sm text-gray-700 mt-3">💡 Click these buttons to test features! Watch stats update, activity track, skills progress, and badges unlock in real-time.</p>
        </div>

        {isEditing && (
          <div className="bg-white rounded-2xl p-8 border-2 border-purple-200 shadow-lg">
            <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6">Complete Your Profile</h3>
            <p className="text-gray-600 mb-6">Fill in all required information to unlock full platform features</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Phone', icon: Phone, field: 'phone', type: 'tel', placeholder: '+1 (555) 123-4567' },
                { label: 'Date of Birth', icon: Calendar, field: 'dateOfBirth', type: 'date' },
                { label: 'Country', icon: Globe, field: 'country', type: 'text', placeholder: 'United States' },
                { label: 'City', icon: MapPin, field: 'city', type: 'text', placeholder: 'San Francisco' },
                { label: 'University', icon: GraduationCap, field: 'university', type: 'text', placeholder: 'Stanford' },
                { label: 'Degree', icon: BookOpen, field: 'degree', type: 'text', placeholder: 'Computer Science' },
                { label: 'Current Role', icon: Briefcase, field: 'currentRole', type: 'text', placeholder: 'Software Engineer' },
                { label: 'Company', icon: Building2, field: 'company', type: 'text', placeholder: 'Tech Corp' },
                { label: 'Years of Experience', icon: Clock, field: 'yearsOfExperience', type: 'text', placeholder: '3' }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx}>
                    <label className="flex items-center gap-2 text-sm font-semibold text-purple-700 mb-2 uppercase tracking-wide">
                      <Icon className="w-4 h-4" />{item.label}
                    </label>
                    <input type={item.type} value={userInfo[item.field]} onChange={(e) => handleInputChange(item.field, e.target.value)} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder={item.placeholder} />
                  </div>
                );
              })}
            </div>

            <div className="mt-8">
              <h4 className="text-xl font-semibold text-purple-700 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />Social Links
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'GitHub', icon: Github, field: 'github', placeholder: 'https://github.com/username' },
                  { label: 'LinkedIn', icon: Linkedin, field: 'linkedin', placeholder: 'https://linkedin.com/in/username' },
                  { label: 'Website', icon: Globe, field: 'website', placeholder: 'https://yourwebsite.com' }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx}>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Icon className="w-4 h-4" />{item.label}
                      </label>
                      <input type="url" value={userInfo[item.field]} onChange={(e) => handleInputChange(item.field, e.target.value)} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder={item.placeholder} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-8 border-2 border-purple-200 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Skills Progress</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Target className="w-4 h-4" />
              <span className="font-medium">Click cards for details</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillsProgress.map((skill, index) => (
              <div 
                key={index} 
                onClick={() => handleSkillClick(skill)}
                className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-purple-400 transition-all cursor-pointer transform hover:scale-105 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-900 font-semibold text-lg">{skill.skill}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 text-sm font-medium">{skill.solved}/{skill.total}</span>
                    <Info className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div className={`h-full ${skill.color} transition-all duration-500 rounded-full`} style={{ width: `${skill.progress}%` }} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-purple-600">{skill.progress}%</div>
                  <div className="text-xs text-gray-500">Click for details</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border-2 border-purple-200 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Contribution Activity</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Flame className="w-4 h-4" />
              <span className="font-medium">Click days for details</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
              <div className="text-2xl font-semibold text-purple-600 mb-1">{Math.max(...activityData.map(d => d.count))}</div>
              <div className="text-xs text-gray-600">Best Day</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
              <div className="text-2xl font-semibold text-yellow-600 mb-1">{Math.round(activityData.reduce((sum, day) => sum + day.count, 0) / 52)}</div>
              <div className="text-xs text-gray-600">Weekly Average</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
              <div className="text-2xl font-semibold text-green-600 mb-1">{activityData.reduce((sum, day) => sum + day.count, 0)}</div>
              <div className="text-xs text-gray-600">Total Contributions</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
              <div className="text-2xl font-semibold text-blue-600 mb-1">{activityData.filter(d => d.count > 0).length}</div>
              <div className="text-xs text-gray-600">Active Days</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="flex gap-1">
                {activityWeeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-1">
                    {week.map((day, dayIdx) => (
                      <div 
                        key={dayIdx} 
                        onClick={() => handleActivityDayClick(day)}
                        className={`w-3 h-3 rounded-sm ${getHeatmapColor(day.count)} hover:ring-2 hover:ring-purple-500 transition-all cursor-pointer transform hover:scale-150 border border-gray-300`} 
                        title={`${day.date}: ${day.count} contributions`} 
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                {months.map((month, idx) => (
                  <span key={idx}>{month}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 text-xs text-gray-600">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-gray-200 border border-gray-300" />
              <div className="w-3 h-3 rounded-sm bg-green-200 border border-gray-300" />
              <div className="w-3 h-3 rounded-sm bg-green-400 border border-gray-300" />
              <div className="w-3 h-3 rounded-sm bg-green-600 border border-gray-300" />
              <div className="w-3 h-3 rounded-sm bg-green-700 border border-gray-300" />
            </div>
            <span>More</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border-2 border-purple-200 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Achievements & Badges</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Trophy className="w-4 h-4" />
              <span className="font-medium">{unlockedBadges.length}/{badges.length} earned • Click for details</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge, index) => {
              const Icon = getIconComponent(badge.icon);
              return (
                <div 
                  key={index} 
                  onClick={() => handleBadgeClick(badge)}
                  className={`relative rounded-xl p-6 border-2 transition-all group overflow-hidden cursor-pointer transform hover:scale-105 shadow-sm hover:shadow-md ${badge.unlocked ? 'bg-white border-gray-200 hover:border-purple-400' : 'bg-gray-50 border-gray-300 opacity-60'}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${badge.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                  <div className="relative flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${badge.gradient} flex-shrink-0 relative`}>
                      <Icon className="w-6 h-6 text-white" />
                      {!badge.unlocked && (
                        <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                          <Lock className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-gray-900 font-semibold">{badge.name}</h4>
                        {badge.unlocked && <Unlock className="w-4 h-4 text-green-600" />}
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                      {badge.unlocked && badge.unlockedAt && (
                        <p className="text-xs text-green-600">Unlocked: {new Date(badge.unlockedAt).toLocaleDateString()}</p>
                      )}
                      {!badge.unlocked && badge.requirement !== 'special' && (
                        <p className="text-xs text-yellow-600">
                          {badge.requirement === 'solvedProblems' && `${badge.value - stats.solvedProblems} more problems`}
                          {badge.requirement === 'streak' && `${badge.value - stats.streak} more days`}
                          {badge.requirement === 'points' && `${badge.value - stats.points} more points`}
                          {badge.requirement === 'categories' && `${badge.value - skillsProgress.filter(s => s.progress >= 80).length} more categories`}
                          {badge.requirement === 'dailyProblems' && `${badge.value} problems in one day`}
                        </p>
                      )}
                      <div className="flex items-center gap-1 mt-2 text-xs text-purple-600">
                        <Info className="w-3 h-3" />
                        <span>Click for details</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Skill Detail Modal */}
      {showSkillModal && selectedSkill && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowSkillModal(false)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full border-2 border-purple-300 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className={`p-8 rounded-t-2xl bg-gradient-to-r ${selectedSkill.color} relative`}>
              <button onClick={() => setShowSkillModal(false)} className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-4xl font-bold text-white mb-3">{selectedSkill.skill}</h3>
              <p className="text-white/95 text-lg mb-4">{selectedSkill.description}</p>
              <p className="text-white/90 text-sm leading-relaxed">{selectedSkill.detailedDescription}</p>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                  <div className="text-3xl font-bold text-purple-600">{selectedSkill.solved}</div>
                  <div className="text-sm text-gray-700 font-medium">Solved</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                  <div className="text-3xl font-bold text-blue-600">{selectedSkill.total}</div>
                  <div className="text-sm text-gray-700 font-medium">Total</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                  <div className="text-3xl font-bold text-green-600">{selectedSkill.progress}%</div>
                  <div className="text-sm text-gray-700 font-medium">Progress</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Difficulty: </span>
                    <span className="font-semibold text-gray-900">{selectedSkill.averageDifficulty}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Est. Time: </span>
                    <span className="font-semibold text-gray-900">{selectedSkill.estimatedTime}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Code className="w-5 h-5 text-purple-600" />
                  Key Techniques
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSkill.keyTechniques.map((technique, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
                      {technique}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  Example Problems
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {selectedSkill.problems.map((problem, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-gray-900 font-semibold">{problem.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700 border border-green-200' :
                          problem.difficulty === 'Medium' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                          'bg-purple-100 text-purple-700 border border-purple-200'
                        }`}>
                          {problem.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{problem.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    solveProblem(selectedSkill.skill, 'medium');
                    setShowSkillModal(false);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-lg"
                >
                  <Zap className="w-5 h-5" />
                  Practice This Skill
                </button>
                <button 
                  onClick={() => setShowSkillModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Badge Detail Modal */}
      {showBadgeModal && selectedBadge && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowBadgeModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full border-2 border-purple-300 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className={`p-8 rounded-t-2xl bg-gradient-to-br ${selectedBadge.gradient} relative`}>
              <button onClick={() => setShowBadgeModal(false)} className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
              <div className="flex items-start gap-4 mb-4">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  {React.createElement(getIconComponent(selectedBadge.icon), { className: "w-16 h-16 text-white" })}
                </div>
                <div className="flex-1">
                  <h3 className="text-4xl font-bold text-white mb-2">{selectedBadge.name}</h3>
                  <div className="flex items-center gap-3 mb-2">
                    {selectedBadge.unlocked ? (
                      <div className="flex items-center gap-2 text-white bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                        <Unlock className="w-4 h-4" />
                        <span>Unlocked!</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-white bg-black/20 px-3 py-1 rounded-full text-sm font-semibold">
                        <Lock className="w-4 h-4" />
                        <span>Locked</span>
                      </div>
                    )}
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${getRarityColor(selectedBadge.rarity)}`}>
                      {selectedBadge.rarity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">Category</div>
                  <div className="text-xl font-bold text-gray-900">{selectedBadge.category}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">Points Value</div>
                  <div className="text-xl font-bold text-purple-600">+{selectedBadge.pointsValue}</div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5 text-purple-600" />
                  Description
                </h4>
                <p className="text-gray-700 leading-relaxed">{selectedBadge.detailedDescription}</p>
              </div>

              {selectedBadge.unlocked && selectedBadge.unlockedAt && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-green-700 mb-1">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold text-lg">Achievement Unlocked</span>
                  </div>
                  <p className="text-gray-700 text-sm">
                    {new Date(selectedBadge.unlockedAt).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}

              {!selectedBadge.unlocked && selectedBadge.requirement !== 'special' && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-yellow-700 mb-3">
                    <Target className="w-5 h-5" />
                    <span className="font-semibold text-lg">Progress Tracker</span>
                  </div>
                  <div className="space-y-3">
                    {selectedBadge.requirement === 'solvedProblems' && (
                      <>
                        <div className="flex justify-between text-sm text-gray-700 mb-1">
                          <span className="font-medium">Problems Solved</span>
                          <span className="font-bold text-purple-600">{stats.solvedProblems} / {selectedBadge.value}</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${Math.min((stats.solvedProblems / selectedBadge.value) * 100, 100)}%` }} />
                        </div>
                        <p className="text-sm text-gray-600">{selectedBadge.value - stats.solvedProblems} problems remaining to unlock</p>
                      </>
                    )}
                    {selectedBadge.requirement === 'streak' && (
                      <>
                        <div className="flex justify-between text-sm text-gray-700 mb-1">
                          <span className="font-medium">Current Streak</span>
                          <span className="font-bold text-orange-600">{stats.streak} / {selectedBadge.value} days</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                          <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500" style={{ width: `${Math.min((stats.streak / selectedBadge.value) * 100, 100)}%` }} />
                        </div>
                        <p className="text-sm text-gray-600">{selectedBadge.value - stats.streak} more days needed</p>
                      </>
                    )}
                    {selectedBadge.requirement === 'points' && (
                      <>
                        <div className="flex justify-between text-sm text-gray-700 mb-1">
                          <span className="font-medium">Total Points</span>
                          <span className="font-bold text-purple-600">{stats.points} / {selectedBadge.value}</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500" style={{ width: `${Math.min((stats.points / selectedBadge.value) * 100, 100)}%` }} />
                        </div>
                        <p className="text-sm text-gray-600">{selectedBadge.value - stats.points} more points required</p>
                      </>
                    )}
                    {selectedBadge.requirement === 'categories' && (
                      <>
                        <div className="flex justify-between text-sm text-gray-700 mb-1">
                          <span className="font-medium">Mastered Categories (80%+)</span>
                          <span className="font-bold text-blue-600">{skillsProgress.filter(s => s.progress >= 80).length} / {selectedBadge.value}</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500" style={{ width: `${Math.min((skillsProgress.filter(s => s.progress >= 80).length / selectedBadge.value) * 100, 100)}%` }} />
                        </div>
                        <p className="text-sm text-gray-600">{selectedBadge.value - skillsProgress.filter(s => s.progress >= 80).length} more categories to master</p>
                      </>
                    )}
                    {selectedBadge.requirement === 'dailyProblems' && (
                      <>
                        <div className="flex justify-between text-sm text-gray-700 mb-1">
                          <span className="font-medium">Today's Progress</span>
                          <span className="font-bold text-green-600">{activityData.find(d => d.date === new Date().toISOString().split('T')[0])?.count || 0} / {selectedBadge.value}</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(((activityData.find(d => d.date === new Date().toISOString().split('T')[0])?.count || 0) / selectedBadge.value) * 100, 100)}%` }} />
                        </div>
                        <p className="text-sm text-gray-600">Solve {selectedBadge.value - (activityData.find(d => d.date === new Date().toISOString().split('T')[0])?.count || 0)} more problems today</p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {selectedBadge.tips && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-semibold text-lg">Tips to Unlock</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{selectedBadge.tips}</p>
                </div>
              )}

              <button 
                onClick={() => setShowBadgeModal(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Day Modal */}
      {showActivityModal && selectedDay && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowActivityModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full border-2 border-purple-300 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {new Date(selectedDay.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <p className="text-gray-600 mt-1 text-lg">{selectedDay.count} {selectedDay.count === 1 ? 'problem' : 'problems'} solved</p>
                </div>
                <button onClick={() => setShowActivityModal(false)} className="text-gray-600 hover:text-gray-900 hover:bg-gray-200 p-2 rounded-lg transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {selectedDay.count > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    Problems Solved This Day
                  </h4>
                  {selectedDay.problems && selectedDay.problems.length > 0 ? (
                    selectedDay.problems.map((problem, idx) => (
                      <div key={idx} className="bg-gray-50 p-5 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-gray-900 font-bold text-lg">{problem.skill}</span>
                          <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                            problem.difficulty === 'easy' ? 'bg-green-100 text-green-700 border-2 border-green-300' :
                            problem.difficulty === 'medium' ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' :
                            'bg-purple-100 text-purple-700 border-2 border-purple-300'
                          }`}>
                            {problem.difficulty.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 font-medium">
                            {new Date(problem.timestamp).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          <span className="text-purple-600 font-bold text-lg">+{problem.points} points</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-gray-200">
                      <p className="text-gray-600">Problem details not available</p>
                      <p className="text-sm text-gray-500 mt-2">Keep solving to track your progress!</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-8xl mb-4">📅</div>
                  <p className="text-gray-700 mb-2 text-xl font-semibold">No problems solved on this day</p>
                  <p className="text-sm text-gray-600">Start solving to build your streak!</p>
                </div>
              )}

              <button 
                onClick={() => setShowActivityModal(false)}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;