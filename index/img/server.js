const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname));

// Database files (simple file-based storage)
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// ==================== GET REQUESTS ====================

// GET /api/leaderboard - Get trap simulator high scores
app.get('/api/leaderboard', (req, res) => {
  try {
    const leaderboardPath = path.join(dataDir, 'leaderboard.json');
    
    if (!fs.existsSync(leaderboardPath)) {
      // Return default leaderboard if doesn't exist
      const defaultLeaderboard = [
        { rank: 1, name: 'Shadow', score: 950, date: '2026-06-18' },
        { rank: 2, name: 'Echo', score: 875, date: '2026-06-17' },
        { rank: 3, name: 'Limbo', score: 800, date: '2026-06-16' },
        { rank: 4, name: 'Whisper', score: 750, date: '2026-06-15' },
        { rank: 5, name: 'Phantom', score: 700, date: '2026-06-14' }
      ];
      return res.json({ success: true, leaderboard: defaultLeaderboard });
    }
    
    const leaderboard = JSON.parse(fs.readFileSync(leaderboardPath, 'utf8'));
    res.json({ success: true, leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching leaderboard', error: error.message });
  }
});

// GET /api/stats - Get game statistics
app.get('/api/stats', (req, res) => {
  try {
    const statsPath = path.join(dataDir, 'stats.json');
    
    if (!fs.existsSync(statsPath)) {
      // Return default stats if doesn't exist
      const defaultStats = {
        totalRegistrations: 42,
        totalGamePlays: 1250,
        successRate: 35.7,
        averageScore: 756,
        mostPlayedTrap: 'spider',
        totalFeedback: 18,
        createdAt: new Date().toISOString()
      };
      return res.json({ success: true, stats: defaultStats });
    }
    
    const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching stats', error: error.message });
  }
});

// GET /api/characters - Get all characters
app.get('/api/characters', (req, res) => {
  try {
    const charactersPath = path.join(dataDir, 'characters.json');
    
    const defaultCharacters = [
      { id: 1, name: 'Limbo', role: 'Shadow Entity', image: 'limbo.jpg' },
      { id: 2, name: 'Echo', role: 'Ethereal Guide', image: 'echo.jpg' },
      { id: 3, name: 'Phantom', role: 'Lost Soul', image: 'phantom.jpg' }
    ];
    
    if (!fs.existsSync(charactersPath)) {
      return res.json({ success: true, characters: defaultCharacters });
    }
    
    const characters = JSON.parse(fs.readFileSync(charactersPath, 'utf8'));
    res.json({ success: true, characters });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching characters', error: error.message });
  }
});

// ==================== POST REQUESTS ====================

// POST /api/register - Register new user
app.post('/api/register', (req, res) => {
  try {
    const { phone, email } = req.body;
    
    // Validate input
    if (!phone || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone and email are required' 
      });
    }
    
    // Read existing registrations
    const registrationsPath = path.join(dataDir, 'registrations.json');
    let registrations = [];
    
    if (fs.existsSync(registrationsPath)) {
      registrations = JSON.parse(fs.readFileSync(registrationsPath, 'utf8'));
    }
    
    // Add new registration
    const newRegistration = {
      id: Date.now(),
      phone,
      email,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    registrations.push(newRegistration);
    fs.writeFileSync(registrationsPath, JSON.stringify(registrations, null, 2));
    
    res.json({ 
      success: true, 
      message: 'Registration successful',
      data: newRegistration 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Registration error', 
      error: error.message 
    });
  }
});

// POST /api/trap-result - Save trap simulator result
app.post('/api/trap-result', (req, res) => {
  try {
    const { playerName, trapType, result, score } = req.body;
    
    if (!playerName || !trapType || !result) {
      return res.status(400).json({ 
        success: false, 
        message: 'Player name, trap type, and result are required' 
      });
    }
    
    // Read existing trap results
    const resultsPath = path.join(dataDir, 'trap-results.json');
    let results = [];
    
    if (fs.existsSync(resultsPath)) {
      results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
    }
    
    // Add new result
    const newResult = {
      id: Date.now(),
      playerName,
      trapType,
      result, // 'success' or 'failure'
      score: score || 0,
      timestamp: new Date().toISOString()
    };
    
    results.push(newResult);
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    
    res.json({ 
      success: true, 
      message: 'Trap result saved',
      data: newResult 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error saving trap result', 
      error: error.message 
    });
  }
});

// POST /api/feedback - Submit user feedback
app.post('/api/feedback', (req, res) => {
  try {
    const { name, email, message, rating } = req.body;
    
    if (!name || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and message are required' 
      });
    }
    
    // Read existing feedback
    const feedbackPath = path.join(dataDir, 'feedback.json');
    let feedbackList = [];
    
    if (fs.existsSync(feedbackPath)) {
      feedbackList = JSON.parse(fs.readFileSync(feedbackPath, 'utf8'));
    }
    
    // Add new feedback
    const newFeedback = {
      id: Date.now(),
      name,
      email: email || 'anonymous',
      message,
      rating: rating || 5,
      createdAt: new Date().toISOString()
    };
    
    feedbackList.push(newFeedback);
    fs.writeFileSync(feedbackPath, JSON.stringify(feedbackList, null, 2));
    
    res.json({ 
      success: true, 
      message: 'Feedback submitted successfully',
      data: newFeedback 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error submitting feedback', 
      error: error.message 
    });
  }
});

// POST /api/newsletter - Subscribe to newsletter
app.post('/api/newsletter', (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }
    
    // Read existing subscribers
    const newsletterPath = path.join(dataDir, 'newsletter.json');
    let subscribers = [];
    
    if (fs.existsSync(newsletterPath)) {
      subscribers = JSON.parse(fs.readFileSync(newsletterPath, 'utf8'));
      
      // Check if already subscribed
      if (subscribers.find(sub => sub.email === email)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email already subscribed' 
        });
      }
    }
    
    // Add new subscriber
    const newSubscriber = {
      id: Date.now(),
      email,
      subscriptionDate: new Date().toISOString(),
      status: 'active'
    };
    
    subscribers.push(newSubscriber);
    fs.writeFileSync(newsletterPath, JSON.stringify(subscribers, null, 2));
    
    res.json({ 
      success: true, 
      message: 'Newsletter subscription successful',
      data: newSubscriber 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Newsletter subscription error', 
      error: error.message 
    });
  }
});

// POST /api/chat-history - Save AI chat conversation
app.post('/api/chat-history', (req, res) => {
  try {
    const { userMessage, aiResponse } = req.body;
    
    if (!userMessage || !aiResponse) {
      return res.status(400).json({ 
        success: false, 
        message: 'User message and AI response are required' 
      });
    }
    
    // Read existing chat history
    const chatPath = path.join(dataDir, 'chat-history.json');
    let chatHistory = [];
    
    if (fs.existsSync(chatPath)) {
      chatHistory = JSON.parse(fs.readFileSync(chatPath, 'utf8'));
    }
    
    // Add new chat entry
    const newChat = {
      id: Date.now(),
      userMessage,
      aiResponse,
      timestamp: new Date().toISOString()
    };
    
    chatHistory.push(newChat);
    fs.writeFileSync(chatPath, JSON.stringify(chatHistory, null, 2));
    
    res.json({ 
      success: true, 
      message: 'Chat saved successfully',
      data: newChat 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error saving chat', 
      error: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online', 
    timestamp: new Date().toISOString(),
    message: 'Limbo API is running' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎮 Limbo API Server running on http://localhost:${PORT}`);
  console.log(`📝 Available endpoints:`);
  console.log(`   GET  /api/health - Server health check`);
  console.log(`   GET  /api/leaderboard - Get high scores`);
  console.log(`   GET  /api/stats - Get game statistics`);
  console.log(`   GET  /api/characters - Get characters`);
  console.log(`   POST /api/register - Register user`);
  console.log(`   POST /api/trap-result - Save trap result`);
  console.log(`   POST /api/feedback - Submit feedback`);
  console.log(`   POST /api/newsletter - Subscribe to newsletter`);
  console.log(`   POST /api/chat-history - Save chat conversation`);
});
