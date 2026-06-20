/**
 * API Client Helper
 * Helper functions to call Limbo API endpoints
 * 
 * Usage: Include this file in your HTML before java.js
 * or merge these functions into java.js
 */

const API_URL = 'http://localhost:3000/api';

// ==================== XHR Helper ====================

/**
 * Generic XHR request function
 */
function xhrRequest(method, url, data = null, callback) {
  const xhr = new XMLHttpRequest();
  
  xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);
        callback(null, response);
      } catch (e) {
        callback(e, null);
      }
    } else {
      callback(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`), null);
    }
  };
  
  xhr.onerror = function() {
    callback(new Error('Network error'), null);
  };
  
  xhr.open(method, url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  
  if (data) {
    xhr.send(JSON.stringify(data));
  } else {
    xhr.send();
  }
}

// ==================== GET Requests ====================

/**
 * Fetch leaderboard data
 */
async function getLeaderboard() {
  try {
    const response = await fetch(`${API_URL}/leaderboard`);
    const data = await response.json();
    if (data.success) {
      console.log('Leaderboard:', data.leaderboard);
      return data.leaderboard;
    }
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
  }
}

/**
 * Fetch game statistics
 */
async function getStats() {
  try {
    const response = await fetch(`${API_URL}/stats`);
    const data = await response.json();
    if (data.success) {
      console.log('Statistics:', data.stats);
      return data.stats;
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
}

/**
 * Fetch characters data
 */
async function getCharacters() {
  try {
    const response = await fetch(`${API_URL}/characters`);
    const data = await response.json();
    if (data.success) {
      console.log('Characters:', data.characters);
      return data.characters;
    }
  } catch (error) {
    console.error('Error fetching characters:', error);
  }
}

/**
 * Check server health
 */
async function checkHealth() {
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    console.log('Server status:', data.status);
    return data;
  } catch (error) {
    console.error('Server is not running:', error);
  }
}

// ==================== POST Requests ====================

/**
 * Register a new user
 * @param {string} phone - User phone number
 * @param {string} email - User email
 */
async function registerUser(phone, email) {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, email })
    });
    const data = await response.json();
    if (data.success) {
      console.log('Registration successful:', data.data);
      return data.data;
    } else {
      console.error('Registration failed:', data.message);
    }
  } catch (error) {
    console.error('Error registering user:', error);
  }
}

/**
 * Save trap simulator result
 * @param {string} playerName - Player name
 * @param {string} trapType - Type of trap ('spider', 'saw', 'parasite')
 * @param {string} result - Result ('success' or 'failure')
 * @param {number} score - Player score
 */
async function saveTrapResult(playerName, trapType, result, score) {
  try {
    const response = await fetch(`${API_URL}/trap-result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName, trapType, result, score })
    });
    const data = await response.json();
    if (data.success) {
      console.log('Trap result saved:', data.data);
      return data.data;
    }
  } catch (error) {
    console.error('Error saving trap result:', error);
  }
}

/**
 * Submit user feedback
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} message - Feedback message
 * @param {number} rating - Rating (1-5)
 */
async function submitFeedback(name, email, message, rating = 5) {
  try {
    const response = await fetch(`${API_URL}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message, rating })
    });
    const data = await response.json();
    if (data.success) {
      console.log('Feedback submitted:', data.data);
      return data.data;
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
  }
}

/**
 * Subscribe to newsletter
 * @param {string} email - Email address
 */
async function subscribeNewsletter(email) {
  try {
    const response = await fetch(`${API_URL}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    if (data.success) {
      console.log('Newsletter subscription successful:', data.data);
      return data.data;
    } else {
      console.error('Subscription failed:', data.message);
    }
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
  }
}

/**
 * Save chat conversation
 * @param {string} userMessage - User's message
 * @param {string} aiResponse - AI's response
 */
async function saveChatHistory(userMessage, aiResponse) {
  try {
    const response = await fetch(`${API_URL}/chat-history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userMessage, aiResponse })
    });
    const data = await response.json();
    if (data.success) {
      console.log('Chat saved:', data.data);
      return data.data;
    }
  } catch (error) {
    console.error('Error saving chat:', error);
  }
}

// ==================== XHR GET Requests ====================

/**
 * XHR: Fetch leaderboard data
 */
function getLeaderboardXHR(callback) {
  xhrRequest('GET', `${API_URL}/leaderboard`, null, (error, data) => {
    if (error) {
      console.error('Error fetching leaderboard:', error);
      callback(error, null);
    } else if (data.success) {
      console.log('Leaderboard (XHR):', data.leaderboard);
      callback(null, data.leaderboard);
    }
  });
}

/**
 * XHR: Fetch game statistics
 */
function getStatsXHR(callback) {
  xhrRequest('GET', `${API_URL}/stats`, null, (error, data) => {
    if (error) {
      console.error('Error fetching stats:', error);
      callback(error, null);
    } else if (data.success) {
      console.log('Statistics (XHR):', data.stats);
      callback(null, data.stats);
    }
  });
}

/**
 * XHR: Fetch characters data
 */
function getCharactersXHR(callback) {
  xhrRequest('GET', `${API_URL}/characters`, null, (error, data) => {
    if (error) {
      console.error('Error fetching characters:', error);
      callback(error, null);
    } else if (data.success) {
      console.log('Characters (XHR):', data.characters);
      callback(null, data.characters);
    }
  });
}

/**
 * XHR: Check server health
 */
function checkHealthXHR(callback) {
  xhrRequest('GET', `${API_URL}/health`, null, (error, data) => {
    if (error) {
      console.error('Server is not running:', error);
      callback(error, null);
    } else {
      console.log('Server status (XHR):', data.status);
      callback(null, data);
    }
  });
}

// ==================== XHR POST Requests ====================

/**
 * XHR: Register a new user
 * @param {string} phone - User phone number
 * @param {string} email - User email
 * @param {function} callback - Callback function(error, data)
 */
function registerUserXHR(phone, email, callback) {
  xhrRequest('POST', `${API_URL}/register`, { phone, email }, (error, data) => {
    if (error) {
      console.error('Error registering user:', error);
      callback(error, null);
    } else if (data.success) {
      console.log('Registration successful (XHR):', data.data);
      callback(null, data.data);
    } else {
      console.error('Registration failed:', data.message);
      callback(new Error(data.message), null);
    }
  });
}

/**
 * XHR: Save trap simulator result
 * @param {string} playerName - Player name
 * @param {string} trapType - Type of trap ('spider', 'saw', 'parasite')
 * @param {string} result - Result ('success' or 'failure')
 * @param {number} score - Player score
 * @param {function} callback - Callback function(error, data)
 */
function saveTrapResultXHR(playerName, trapType, result, score, callback) {
  xhrRequest('POST', `${API_URL}/trap-result`, 
    { playerName, trapType, result, score }, 
    (error, data) => {
      if (error) {
        console.error('Error saving trap result:', error);
        callback(error, null);
      } else if (data.success) {
        console.log('Trap result saved (XHR):', data.data);
        callback(null, data.data);
      }
    }
  );
}

/**
 * XHR: Submit user feedback
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} message - Feedback message
 * @param {number} rating - Rating (1-5)
 * @param {function} callback - Callback function(error, data)
 */
function submitFeedbackXHR(name, email, message, rating = 5, callback) {
  xhrRequest('POST', `${API_URL}/feedback`, 
    { name, email, message, rating }, 
    (error, data) => {
      if (error) {
        console.error('Error submitting feedback:', error);
        callback(error, null);
      } else if (data.success) {
        console.log('Feedback submitted (XHR):', data.data);
        callback(null, data.data);
      }
    }
  );
}

/**
 * XHR: Subscribe to newsletter
 * @param {string} email - Email address
 * @param {function} callback - Callback function(error, data)
 */
function subscribeNewsletterXHR(email, callback) {
  xhrRequest('POST', `${API_URL}/newsletter`, 
    { email }, 
    (error, data) => {
      if (error) {
        console.error('Error subscribing to newsletter:', error);
        callback(error, null);
      } else if (data.success) {
        console.log('Newsletter subscription successful (XHR):', data.data);
        callback(null, data.data);
      } else {
        console.error('Subscription failed:', data.message);
        callback(new Error(data.message), null);
      }
    }
  );
}

/**
 * XHR: Save chat conversation
 * @param {string} userMessage - User's message
 * @param {string} aiResponse - AI's response
 * @param {function} callback - Callback function(error, data)
 */
function saveChatHistoryXHR(userMessage, aiResponse, callback) {
  xhrRequest('POST', `${API_URL}/chat-history`, 
    { userMessage, aiResponse }, 
    (error, data) => {
      if (error) {
        console.error('Error saving chat:', error);
        callback(error, null);
      } else if (data.success) {
        console.log('Chat saved (XHR):', data.data);
        callback(null, data.data);
      }
    }
  );
}

// ==================== Example Usage ====================

/**
 * Run this in console to test all FETCH endpoints
 */
async function testAllEndpoints() {
  console.log('🧪 Testing Limbo API (Fetch)...\n');
  
  // Check health
  console.log('1. Checking server health...');
  await checkHealth();
  
  // GET requests
  console.log('\n2. Fetching leaderboard...');
  await getLeaderboard();
  
  console.log('\n3. Fetching stats...');
  await getStats();
  
  console.log('\n4. Fetching characters...');
  await getCharacters();
  
  // POST requests
  console.log('\n5. Registering user...');
  await registerUser('+1234567890', 'test@limbo.com');
  
  console.log('\n6. Saving trap result...');
  await saveTrapResult('TestPlayer', 'spider', 'success', 850);
  
  console.log('\n7. Submitting feedback...');
  await submitFeedback('Phantom', 'phantom@limbo.com', 'Amazing game!', 5);
  
  console.log('\n8. Subscribing to newsletter...');
  await subscribeNewsletter('subscriber@limbo.com');
  
  console.log('\n9. Saving chat...');
  await saveChatHistory('What is Limbo?', 'Limbo is a mysterious realm...');
  
  console.log('\n✅ All FETCH tests completed!');
}

/**
 * Run this in console to test all XHR endpoints
 */
function testAllEndpointsXHR() {
  console.log('🧪 Testing Limbo API (XHR)...\n');
  
  // Check health
  console.log('1. Checking server health (XHR)...');
  checkHealthXHR((error, data) => {
    if (error) console.error('Error:', error.message);
    else console.log('✓ Health check OK');
  });
  
  // GET requests
  setTimeout(() => {
    console.log('\n2. Fetching leaderboard (XHR)...');
    getLeaderboardXHR((error, data) => {
      if (error) console.error('Error:', error.message);
      else console.log('✓ Leaderboard OK');
    });
  }, 500);
  
  setTimeout(() => {
    console.log('\n3. Fetching stats (XHR)...');
    getStatsXHR((error, data) => {
      if (error) console.error('Error:', error.message);
      else console.log('✓ Stats OK');
    });
  }, 1000);
  
  setTimeout(() => {
    console.log('\n4. Fetching characters (XHR)...');
    getCharactersXHR((error, data) => {
      if (error) console.error('Error:', error.message);
      else console.log('✓ Characters OK');
    });
  }, 1500);
  
  // POST requests
  setTimeout(() => {
    console.log('\n5. Registering user (XHR)...');
    registerUserXHR('+9876543210', 'xhrtest@limbo.com', (error, data) => {
      if (error) console.error('Error:', error.message);
      else console.log('✓ Registration OK');
    });
  }, 2000);
  
  setTimeout(() => {
    console.log('\n6. Saving trap result (XHR)...');
    saveTrapResultXHR('XHRPlayer', 'saw', 'failure', 420, (error, data) => {
      if (error) console.error('Error:', error.message);
      else console.log('✓ Trap result saved');
    });
  }, 2500);
  
  setTimeout(() => {
    console.log('\n7. Submitting feedback (XHR)...');
    submitFeedbackXHR('Echo', 'echo@limbo.com', 'XHR test feedback', 4, (error, data) => {
      if (error) console.error('Error:', error.message);
      else console.log('✓ Feedback submitted');
    });
  }, 3000);
  
  setTimeout(() => {
    console.log('\n8. Subscribing to newsletter (XHR)...');
    subscribeNewsletterXHR('xhrsubscriber@limbo.com', (error, data) => {
      if (error) console.error('Error:', error.message);
      else console.log('✓ Newsletter subscription OK');
    });
  }, 3500);
  
  setTimeout(() => {
    console.log('\n9. Saving chat (XHR)...');
    saveChatHistoryXHR('Who are you?', 'I am Limbo...', (error, data) => {
      if (error) console.error('Error:', error.message);
      else console.log('✓ Chat saved');
    });
  }, 4000);
  
  setTimeout(() => {
    console.log('\n✅ All XHR tests completed!');
  }, 4500);
}
