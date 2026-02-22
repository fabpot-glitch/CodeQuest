// backend/index.js
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000; // Backend on port 5000 to avoid conflict with React

// Middleware
app.use(cors());
app.use(express.json());

// Temporary in-memory profile
let profile = {
  username: 'john_doe',
  fullName: 'John Doe',
  email: 'john@example.com',
  phone: '+1 555 123 4567',
  bio: 'Passionate developer',
  city: 'San Francisco',
  country: 'USA',
  university: 'Stanford University',
  degree: 'Computer Science',
  company: 'Tech Corp',
  role: 'Software Engineer',
  primaryLanguage: 'JavaScript'
};

// ✅ Get profile
app.get('/api/profile', (req, res) => {
  res.json(profile);
});

// ✅ Update profile
app.put('/api/profile', (req, res) => {
  profile = { ...profile, ...req.body };
  res.json({ message: 'Profile updated successfully', profile });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
