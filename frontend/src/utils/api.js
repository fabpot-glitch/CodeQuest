// API utility functions for future backend integration

const API_BASE_URL = 'http://localhost:5000/api';

// Auth API
export const authAPI = {
  login: async (email, password) => {
    // Mock API call
    // In production, replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, user: { email, username: 'user' } });
      }, 1000);
    });
  },

  register: async (username, email, password) => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, user: { email, username } });
      }, 1000);
    });
  },

  logout: async () => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  }
};

// Problems API
export const problemsAPI = {
  getAll: async () => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, problems: [] });
      }, 1000);
    });
  },

  getById: async (id) => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, problem: {} });
      }, 1000);
    });
  },

  submit: async (problemId, code) => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, result: 'Accepted' });
      }, 2000);
    });
  }
};

// User API
export const userAPI = {
  getProfile: async () => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, user: {} });
      }, 1000);
    });
  },

  updateProfile: async (data) => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, user: data });
      }, 1000);
    });
  }
};

// Leaderboard API
export const leaderboardAPI = {
  getTop: async (limit = 100) => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, users: [] });
      }, 1000);
    });
  }
};

export default {
  authAPI,
  problemsAPI,
  userAPI,
  leaderboardAPI
};