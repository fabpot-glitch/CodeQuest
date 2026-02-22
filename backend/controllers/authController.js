import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Received username:', username);
    console.log('Received password:', password);

    // IMPORTANT: .select('+password') to include password field
    const user = await User.findOne({ username }).select('+password');
    
    console.log('User found:', user ? 'YES' : 'NO');
    
    if (!user) {
      console.log('❌ User not found');
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    console.log('Password exists:', !!user.password);
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password mismatch');
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    console.log('✅ Login successful');

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};