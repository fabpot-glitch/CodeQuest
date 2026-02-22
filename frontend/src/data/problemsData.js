export const problemsData = Array.from({ length: 50 }, (_, i) => {
  const id = i + 1;

  const titles = [
    'Two Sum', 'Reverse String', 'Palindrome Check', 'FizzBuzz', 'Factorial',
    'Merge Sorted Arrays', 'Find Max', 'Sum of Array', 'Rotate Array', 'Count Primes',
    'Valid Parentheses', 'Longest Substring', 'Remove Duplicates', 'Binary Search',
    'Climb Stairs', 'Min Stack', 'Intersection of Arrays', 'Anagram Check', 'Happy Number',
    'Single Number', 'Reverse LinkedList', 'Detect Cycle', 'Merge Intervals', 'Matrix Transpose',
    'Coin Change', 'Kth Largest Element', 'Product of Array Except Self', 'Power Function',
    'Word Ladder', 'Top K Frequent Elements', 'Sliding Window Max', 'LRU Cache', 'Design HashMap',
    'Number of Islands', 'Longest Palindromic Substring', 'Next Permutation', 'Subsets',
    'Combination Sum', 'Decode Ways', 'Letter Combinations', 'Evaluate Reverse Polish Notation',
    'Longest Consecutive Sequence', 'Max Subarray', 'Jump Game', 'House Robber', 'Sort Colors',
    'Valid Sudoku', 'Rotate Image', 'Course Schedule'
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];
  const difficulty = difficulties[id % difficulties.length];

  return {
    id,
    title: titles[i % titles.length],
    difficulty,
    description: `This is the description for problem #${id}: ${titles[i % titles.length]}. Solve it using your preferred language.`,
    templates: {
      javascript: `// JavaScript template for problem #${id}\nfunction solution() {\n  // Write your code here\n}`,
      python: `# Python template for problem #${id}\ndef solution():\n    # Write your code here\n`
    },
    examples: [
      {
        input: `Example input for problem #${id}`,
        output: `Example output for problem #${id}`
      }
    ]
  };
});
