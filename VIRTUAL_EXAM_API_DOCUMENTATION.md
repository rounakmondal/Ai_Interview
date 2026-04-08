# Virtual Exam Room - Backend API Documentation

This document outlines all required backend API endpoints for the Virtual Exam Room feature. Since you have a separate API system, implement these endpoints in your API infrastructure.

---

## API Base Endpoints

All endpoints are prefixed with `/api/virtual-exam/`

### Authentication
- All endpoints should validate user authentication via JWT tokens in headers
- Header: `Authorization: Bearer <token>`

---

## 1. **Get Questions - Unlimited Card Loading**

### Endpoint
```
POST /api/virtual-exam/questions
```

### Purpose
Stream unlimited question cards for the exam room. Uses pagination to load 50 questions at a time (configurable).

### Request Body
```json
{
  "exam": "WBCS",           // Exam type: WBCS, SSC, Railway, Banking, Police, UPSC, JTET, etc.
  "subject": "History",      // Subject: History, Geography, Polity, Reasoning, Math, Current Affairs
  "language": "english",     // Language: english, hindi, bengali
  "limit": 50,               // Number of questions per batch (default: 50)
  "offset": 0                // Pagination offset (0, 50, 100, 150, etc.)
}
```

### Response Format
```json
{
  "success": true,
  "questions": [
    {
      "id": "q_123456",
      "questionNumber": 1,
      "text": "What is the capital of India?",
      "options": [
        "Delhi",
        "Mumbai",
        "Bangalore",
        "Chennai"
      ],
      "correctAnswer": 0,        // Index of correct option (0-3)
      "explanation": "Delhi is the capital of India...",
      "subject": "Geography",
      "difficulty": "Easy",
      "audioUrl": "https://api.example.com/audio/q_123456.mp3",
      "imageUrl": "https://api.example.com/images/q_123456.jpg"
    }
    // ... more questions
  ],
  "totalQuestions": 500,
  "totalTime": 7200            // Total allowed time in seconds (2 hours = 7200)
}
```

### Response Details
- **success**: Boolean indicating successful response
- **questions**: Array of question objects
  - **id**: Unique question identifier
  - **questionNumber**: Sequential number (1-based)
  - **text**: Question text in selected language
  - **options**: Array of 4 answer options
  - **correctAnswer**: Index of the correct option (0, 1, 2, or 3)
  - **explanation**: Detailed explanation of the answer
  - **subject**: Subject category
  - **difficulty**: Easy, Medium, or Hard
  - **audioUrl**: Optional audio pronunciation of question
  - **imageUrl**: Optional image for visual questions
- **totalQuestions**: Total available questions for this exam/subject combination
- **totalTime**: Maximum time allowed for the exam (in seconds)

### Error Response
```json
{
  "success": false,
  "error": "Invalid exam or subject",
  "message": "Subject 'InvalidSubject' not found for exam 'WBCS'"
}
```

### Implementation Notes
- ✅ Implement pagination to avoid loading all questions at once
- ✅ Cache frequently requested exam/subject combinations
- ✅ Return questions in the requested language (translate if necessary)
- ✅ For audio URLs, integrate with TTS services (ElevenLabs, Google Cloud TTS, etc.)
- ✅ For images, serve from CDN to optimize performance

---

## 2. **Submit Test & Get Results**

### Endpoint
```
POST /api/virtual-exam/submit
```

### Purpose
Submit the test attempts and receive detailed performance analysis, matrix data, and recommendations.

### Request Body
```json
{
  "exam": "WBCS",
  "subject": "History",
  "language": "english",
  "totalTime": 3600,           // Total time spent on test (in seconds)
  "attempts": [
    {
      "questionId": "q_123456",
      "userAnswer": 0,         // Option index or null if not attempted
      "status": "correct",     // not-attempted, attempted, correct, wrong, marked
      "timeTaken": 45,         // Time spent on this question (in seconds)
      "isMarkedForReview": false
    }
    // ... more attempts for all questions
  ]
}
```

### Response Format
```json
{
  "success": true,
  "result": {
    "totalScore": 75,
    "totalMarks": 100,
    "accuracy": 75,            // Percentage
    
    "subjectWiseAnalysis": [
      {
        "subject": "History",
        "correct": 15,
        "total": 20,
        "percentage": 75
      },
      {
        "subject": "Geography",
        "correct": 12,
        "total": 20,
        "percentage": 60
      }
      // ... more subjects
    ],
    
    "difficultyAnalysis": [
      {
        "difficulty": "Easy",
        "correct": 18,
        "total": 20,
        "percentage": 90
      },
      {
        "difficulty": "Medium",
        "correct": 24,
        "total": 40,
        "percentage": 60
      },
      {
        "difficulty": "Hard",
        "correct": 3,
        "total": 40,
        "percentage": 7.5
      }
    ],
    
    "timeAnalysis": {
      "averageTimePerQuestion": 36,    // in seconds
      "fastestQuestion": 15,           // in seconds
      "slowestQuestion": 120           // in seconds
    },
    
    "strengths": [
      "History - Strong understanding of ancient India",
      "Easy questions - 90% accuracy shows good fundamentals",
      "Time management - Completed test 15 minutes early"
    ],
    
    "weakAreas": [
      "Geography - Only 60% accuracy, focus on boundaries and capitals",
      "Hard difficulty questions - Only 7.5% accuracy, needs more practice",
      "Maps and coordinates - Struggled with location-based questions"
    ],
    
    "recommendations": [
      "Focus on Geography weak areas - Practice daily for 30 minutes",
      "Solve previous year papers for difficult sections",
      "Practice with time constraints to improve speed",
      "Join study groups to discuss complex topics"
    ],
    
    "languageBasedTips": [
      "Read each question twice before answering",
      "In Hindi/Bengali questions, pay attention to vernacular terminology",
      "Use process of elimination for ambiguous questions"
    ]
  }
}
```

### Response Analysis Fields

#### Subject-wise Analysis
- Breaks down performance by each subject
- Shows correct answers, total questions, and accuracy percentage
- Helps identify subject weaknesses

#### Difficulty Analysis
- Analyzes performance across Easy, Medium, Hard questions
- Shows accuracy trend with difficulty level
- Indicates whether user rushes or struggles with complexity

#### Time Analysis
- **averageTimePerQuestion**: Mean time per question
- **fastestQuestion**: Time of quickest answer (some guessing detection)
- **slowestQuestion**: Time of longest thinking (potential confusion areas)

#### Strengths & Weak Areas
- AI-generated insights based on:
  - Subject accuracy
  - Difficulty performance
  - Time patterns
  - Question category performance

#### Recommendations
- Personalized study recommendations
- Specific areas to focus
- Study strategy suggestions

#### Language-Based Tips
- Tips specific to the exam language
- For Hindi: "प्रश्न को दो बार पढ़ें" (Read question twice)
- For Bengali: "প্রতিটি বিকল্প সাবধানে বিবেচনা করুন" (Consider each option carefully)

### Error Response
```json
{
  "success": false,
  "error": "Invalid submission",
  "message": "Number of attempts does not match number of questions"
}
```

### Implementation Notes
- ✅ Validate answer keys with actual correct answers
- ✅ Calculate accuracy real-time
- ✅ Generate subject-wise and difficulty-wise segregation
- ✅ Implement AI/ML to generate personalized insights and recommendations
- ✅ Store results in database for analytics and tracking
- ✅ Generate language-based tips dynamically based on user language

---

## 3. **Get User Performance History** (Optional)

### Endpoint
```
GET /api/virtual-exam/history/:userId
```

### Purpose
Retrieve past exam attempts for tracking progress over time.

### Query Parameters
```
?exam=WBCS                    // Filter by exam (optional)
&limit=10                     // Number of results (default: 10)
&offset=0                     // Pagination offset
```

### Response Format
```json
{
  "success": true,
  "history": [
    {
      "testId": "test_789456",
      "exam": "WBCS",
      "subject": "History",
      "attemptDate": "2024-04-08T10:30:00Z",
      "score": 75,
      "totalMarks": 100,
      "accuracy": 75,
      "totalTime": 3600,
      "questionsAttempted": 75,
      "questionsCorrect": 56,
      "rank": 245,              // Rank among similar users
      "improvement": "+5%"      // Compared to previous attempt
    }
    // ... more history entries
  ],
  "totalAttempts": 45,
  "averageScore": 68,
  "bestScore": 82,
  "averageAccuracy": 68
}
```

---

## 4. **Get Leaderboard** (Optional)

### Endpoint
```
GET /api/virtual-exam/leaderboard
```

### Purpose
Show competitive rankings and motivate users.

### Query Parameters
```
?exam=WBCS                    // Filter by exam
&subject=History              // Filter by subject
&period=weekly                // weekly, monthly, all-time
&limit=100                    // Number of results
```

### Response Format
```json
{
  "success": true,
  "leaderboard": [
    {
      "rank": 1,
      "userId": "user_123",
      "name": "John Doe",
      "avatar": "https://api.example.com/avatars/user_123.jpg",
      "score": 95,
      "accuracy": 87,
      "testsCompleted": 45,
      "badge": "gold"           // gold, silver, bronze, standard
    }
    // ... more entries
  ]
}
```

---

## 5. **Analytics & Insights** (Optional)

### Endpoint
```
GET /api/virtual-exam/analytics/:userId
```

### Purpose
Provide comprehensive analytics dashboard data.

### Response Format
```json
{
  "success": true,
  "analytics": {
    "totalTestsTaken": 45,
    "averageScore": 72,
    "bestScore": 95,
    "worstScore": 42,
    "improvementRate": "+12% in last 4 weeks",
    "strengths": ["History", "Geography"],
    "weaknesses": ["Reasoning", "Math"],
    "studyStreak": 23,
    "estimatedClearanceChance": "72%",
    "recommendedStudyHours": 25,
    "performanceTrend": [
      { "date": "2024-04-01", "score": 68 },
      { "date": "2024-04-02", "score": 70 },
      { "date": "2024-04-08", "score": 75 }
    ]
  }
}
```

---

## Database Schema Recommendations

### Questions Table
```sql
CREATE TABLE questions (
  id VARCHAR(50) PRIMARY KEY,
  exam VARCHAR(50) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  difficulty VARCHAR(20),
  question_text LONGTEXT NOT NULL,
  option_a VARCHAR(500),
  option_b VARCHAR(500),
  option_c VARCHAR(500),
  option_d VARCHAR(500),
  correct_answer INT(1),
  explanation LONGTEXT,
  explanation_hindi LONGTEXT,
  explanation_bengali LONGTEXT,
  audio_url VARCHAR(500),
  image_url VARCHAR(500),
  created_at TIMESTAMP,
  INDEX (exam, subject, difficulty)
);
```

### Test Results Table
```sql
CREATE TABLE test_results (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  exam VARCHAR(50) NOT NULL,
  subject VARCHAR(100),
  language VARCHAR(20),
  score INT,
  total_marks INT,
  accuracy DECIMAL(5, 2),
  total_time INT,
  questions_attempted INT,
  questions_correct INT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  INDEX (user_id, exam, created_at),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### User Attempts Table
```sql
CREATE TABLE test_attempts (
  id VARCHAR(50) PRIMARY KEY,
  test_result_id VARCHAR(50) NOT NULL,
  question_id VARCHAR(50) NOT NULL,
  user_answer INT,
  is_correct BOOLEAN,
  time_taken INT,
  is_marked_review BOOLEAN,
  created_at TIMESTAMP,
  FOREIGN KEY (test_result_id) REFERENCES test_results(id),
  FOREIGN KEY (question_id) REFERENCES questions(id)
);
```

---

## Integration with Your Separate API

Since you have a separate API system:

1. **API Gateway Pattern**: Route virtual exam requests through your existing API gateway
2. **Authentication**: Reuse your JWT/OAuth tokens for virtual exam endpoints
3. **User Context**: Pass user ID from auth context to tracking endpoints
4. **Rate Limiting**: Apply same rate limiting rules as other endpoints
5. **Logging**: Log all exam submissions for compliance and analytics

---

## Language Support

### Supported Languages
- **english**: English (default)
- **hindi**: Hindi translation
- **bengali**: Bengali translation

### Language-Based Customization
```json
{
  "english": {
    "strengths_label": "Your Strengths",
    "weak_areas_label": "Focus Areas",
    "tips": ["Read carefully", "Manage time"]
  },
  "hindi": {
    "strengths_label": "आपकी शक्तियाँ",
    "weak_areas_label": "ध्यान केंद्रित करने के क्षेत्र",
    "tips": ["ध्यान से पढ़ें", "समय का प्रबंधन करें"]
  },
  "bengali": {
    "strengths_label": "আপনার শক্তি",
    "weak_areas_label": "মনোনিবেশের ক্ষেত্রসমূহ",
    "tips": ["মনোযোগ সহকারে পড়ুন", "সময় পরিচালনা করুন"]
  }
}
```

---

## Performance Optimization Tips

1. **Question Caching**
   - Cache frequently accessed exams/subjects
   - Use Redis for 1-hour cache validity

2. **Batch Processing**
   - Process multiple submissions in batches for score calculation
   - Queue lengthy analytics calculations

3. **Database Indexing**
   - Index on (exam, subject) for fast retrieval
   - Index on (user_id, created_at) for history queries

4. **CDN for Media**
   - Host question images and audio on CDN
   - Generate audio on-demand and cache

5. **Real-time Leaderboard**
   - Use Redis sorted sets for leaderboard ranking
   - Update rank on test submission

---

## Testing Guidelines

### Unit Tests
```javascript
// Test question retrieval
test('Should fetch 50 questions with correct pagination', async () => {
  const res = await api.post('/api/virtual-exam/questions', {
    exam: 'WBCS',
    subject: 'History',
    limit: 50,
    offset: 0
  });
  expect(res.status).toBe(200);
  expect(res.body.questions.length).toBe(50);
});

// Test result calculation
test('Should calculate accuracy correctly', async () => {
  const res = await api.post('/api/virtual-exam/submit', {
    exam: 'WBCS',
    attempts: mockAttempts
  });
  expect(res.body.result.accuracy).toBe(75);
});
```

---

## Error Handling

### Common Errors

| Error Code | Message | Status | Meaning |
|-----------|---------|--------|---------|
| 400 | Invalid exam type | 400 | Exam not found in system |
| 400 | Subject not available | 400 | Subject not offered for this exam |
| 401 | Unauthorized | 401 | Invalid or missing auth token |
| 404 | Questions not found | 404 | No questions match criteria |
| 422 | Attempts count mismatch | 422 | Questions ≠ Attempts count |
| 500 | Server error | 500 | Internal server error |

---

## Rate Limiting

```
- 10 quiz/hour per user for questions endpoint
- 100/hour for leaderboard
- 1000/hour for analytics queries
```

---

## Next Steps

1. **Implement** all 5 endpoints in your API infrastructure
2. **Update** frontend `.env` to point to new API endpoints
3. **Test** with sample data before production
4. **Deploy** to staging for integration testing
5. **Monitor** performance and adjust caching/indexing as needed

---

## Support

For issues or questions, contact the development team with:
- Error logs from both frontend and backend
- Request/response payloads
- User ID for reproduction
- Timestamp of the issue
