# Limbo API Documentation

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000`

---

## API Endpoints

### GET Requests

#### 1. **GET /api/health**
Health check endpoint
- **Response**: Server status

```javascript
fetch('http://localhost:3000/api/health')
  .then(res => res.json())
  .then(data => console.log(data));
```

#### 2. **GET /api/leaderboard**
Get trap simulator high scores

```javascript
fetch('http://localhost:3000/api/leaderboard')
  .then(res => res.json())
  .then(data => console.log(data.leaderboard));
```

#### 3. **GET /api/stats**
Get game statistics

```javascript
fetch('http://localhost:3000/api/stats')
  .then(res => res.json())
  .then(data => console.log(data.stats));
```

#### 4. **GET /api/characters**
Get all characters

```javascript
fetch('http://localhost:3000/api/characters')
  .then(res => res.json())
  .then(data => console.log(data.characters));
```

---

### POST Requests

#### 1. **POST /api/register**
Register a new user

```javascript
fetch('http://localhost:3000/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phone: '+1234567890',
    email: 'user@example.com'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

#### 2. **POST /api/trap-result**
Save trap simulator result

```javascript
fetch('http://localhost:3000/api/trap-result', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    playerName: 'Shadow',
    trapType: 'spider',
    result: 'success',
    score: 850
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

#### 3. **POST /api/feedback**
Submit user feedback

```javascript
fetch('http://localhost:3000/api/feedback', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Echo',
    email: 'echo@limbo.com',
    message: 'Great game! Love the atmosphere.',
    rating: 5
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

#### 4. **POST /api/newsletter**
Subscribe to newsletter

```javascript
fetch('http://localhost:3000/api/newsletter', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'subscriber@example.com'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

#### 5. **POST /api/chat-history**
Save AI chat conversation

```javascript
fetch('http://localhost:3000/api/chat-history', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userMessage: 'What is Limbo?',
    aiResponse: 'Limbo is an atmospheric puzzle platformer...'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## Data Storage

All data is stored in JSON files in the `data/` directory:
- `registrations.json` - User registrations
- `trap-results.json` - Trap simulator results
- `feedback.json` - User feedback
- `newsletter.json` - Newsletter subscribers
- `chat-history.json` - Chat conversations
- `leaderboard.json` - High scores (auto-generated with defaults)
- `stats.json` - Game statistics (auto-generated with defaults)

---

## Features

✅ 4 GET endpoints for fetching data  
✅ 5 POST endpoints for saving data  
✅ File-based data persistence  
✅ CORS enabled for cross-origin requests  
✅ Error handling and validation  
✅ JSON data format  

---

## XHR (XMLHttpRequest) Methods

For older browsers or when you prefer XMLHttpRequest over Fetch API, use the XHR versions of all functions:

### XHR GET Requests

```javascript
// Get leaderboard
getLeaderboardXHR((error, data) => {
  if (error) console.error(error);
  else console.log(data);
});

// Get stats
getStatsXHR((error, data) => {
  if (error) console.error(error);
  else console.log(data);
});

// Get characters
getCharactersXHR((error, data) => {
  if (error) console.error(error);
  else console.log(data);
});

// Check health
checkHealthXHR((error, data) => {
  if (error) console.error(error);
  else console.log(data);
});
```

### XHR POST Requests

```javascript
// Register user
registerUserXHR('+1234567890', 'user@example.com', (error, data) => {
  if (error) console.error(error);
  else console.log('Registered:', data);
});

// Save trap result
saveTrapResultXHR('PlayerName', 'spider', 'success', 850, (error, data) => {
  if (error) console.error(error);
  else console.log('Saved:', data);
});

// Submit feedback
submitFeedbackXHR('Name', 'email@example.com', 'Great game!', 5, (error, data) => {
  if (error) console.error(error);
  else console.log('Feedback sent:', data);
});

// Subscribe to newsletter
subscribeNewsletterXHR('user@example.com', (error, data) => {
  if (error) console.error(error);
  else console.log('Subscribed:', data);
});

// Save chat history
saveChatHistoryXHR('User message', 'AI response', (error, data) => {
  if (error) console.error(error);
  else console.log('Chat saved:', data);
});
```

---

## Testing

Run in browser console:

**Test Fetch API:**
```javascript
testAllEndpoints()
```

**Test XHR:**
```javascript
testAllEndpointsXHR()
```
