# Mock API Guide

## Overview

InterviewAI includes a built-in mock API system that allows you to:

- ✅ Test the entire interview flow without a backend
- ✅ Develop UI features independently
- ✅ Run locally with realistic mock data
- ✅ Automatically fall back if real API is unavailable

## How It Works

### Default Behavior (Recommended)

The app attempts to use the real backend API first. If the API is unavailable (404, network error, etc.), it **automatically falls back** to the mock API.

```
User Action
   ↓
Try Real API (if configured)
   ↓
Success? → Use Real Response
   ↓ (Fail/404)
Fall Back to Mock API
   ↓
Return Mock Response
```

### Configuration

#### 1. Use Real API (Default)
```bash
pnpm dev
# Tries real API at /api, falls back to mock if unavailable
```

#### 2. Force Real API Only
Create `.env` file:
```env
VITE_API_URL=http://localhost:3001
```

Then start dev server:
```bash
pnpm dev
```

#### 3. Force Mock API
Create `.env` file:
```env
VITE_USE_MOCK_API=true
```

This always uses mock data, useful for development.

#### 4. Custom API Server
```env
VITE_API_URL=https://api.example.com
```

## Console Messages

When you start the app, you'll see messages in the browser console:

### Real API Mode (with fallback)
```
✓ InterviewAI API Client Initialized
  Mode: Real API
  Endpoint: /api
  Fallback: Using mock API if real API is unavailable
```

### Mock API Mode (when activated)
```
✓ Mock Interview API Active
  Using mock data for development & testing
```

### When API Falls Back
```
⚠ Real API unavailable (/interview/start), falling back to mock API
```

## Mock Data Features

The mock API provides:

### Interview Types
- **IT / Software**: Technical questions about programming, design patterns, etc.
- **Government**: Questions about public service, ethics, etc.
- **Private**: General corporate interview questions
- **Non-IT**: Role-specific non-technical questions

### Mock Behavior
- Realistic network delays (500ms-1000ms)
- Follow-up questions (~30% chance)
- Dynamic scoring based on answer quality
- Proper session management
- Clean session cleanup

### Sample Scores
Scores are calculated based on:
- Answer length and detail
- Presence of keywords (experience, learned, achieved, etc.)
- Random variation for realism

Example output:
```json
{
  "overallScore": 7.8,
  "communicationScore": 8.5,
  "technicalScore": 7.2,
  "confidenceScore": 7.8,
  "strengths": [
    "Good articulation and communication",
    "Relevant examples provided",
    "Positive attitude throughout"
  ],
  "weakAreas": [
    "Could provide more technical depth",
    "Some hesitation in certain responses"
  ],
  "improvementSuggestions": [...]
}
```

## Switching to Real API

When you have a backend running:

1. Start your backend server (e.g., on port 3001)

2. Set environment variable:
   ```bash
   VITE_API_URL=http://localhost:3001 pnpm dev
   ```

   Or create `.env`:
   ```env
   VITE_API_URL=http://localhost:3001
   ```

3. The app will now use the real API, with automatic fallback to mock if it fails

## Testing Scenarios

### Test Full Interview Flow
```bash
# Uses mock API by default
pnpm dev
```

1. Go to landing page
2. Click "Start Mock Interview"
3. Choose interview type and language
4. Optionally upload CV
5. Allow camera/microphone access (or decline for text-only)
6. Answer questions using voice or text
7. Get evaluation results

### Test Real API Integration
```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend
VITE_API_URL=http://localhost:3001 pnpm dev
```

### Test Fallback Behavior
```bash
# This will try real API and fall back to mock
pnpm dev
# Without a backend running, it falls back automatically
```

## Browser Console

Always check the browser console (F12) to see:
- Which API mode is active
- When fallback occurs
- Any errors or warnings
- API request details (in dev tools Network tab)

## Production Considerations

For production:

1. **Set correct API endpoint:**
   ```bash
   VITE_API_URL=https://api.production.com pnpm build
   ```

2. **Disable mock API fallback (optional):**
   Create a `.env.production` file if you want to prevent mock API usage:
   ```env
   VITE_API_URL=https://api.production.com
   # Mock API will still be fallback, but real API should never fail
   ```

3. **Monitor errors:**
   Set up error tracking (Sentry, etc.) to catch API failures in production

## Troubleshooting

### "API request failed" with 404
**Solution:** This is normal in development if backend isn't running. Mock API will activate automatically.

### Wrong interview type questions
**Solution:** Restart dev server after changing `VITE_API_URL` environment variable.

### Mock API not activating
**Solution:** 
1. Check browser console for error messages
2. Verify network request in DevTools Network tab
3. Try setting `VITE_USE_MOCK_API=true` explicitly

### Real API not being used
**Solution:**
1. Verify backend is running at configured URL
2. Check CORS settings on backend
3. Look at Network tab in DevTools for actual requests
4. Check console for API errors

## Development Tips

- Use mock API while developing UI/UX features
- Test with real API before deployment
- Monitor performance with realistic data
- Use Network tab to debug API issues
- Check console for helpful startup messages

## File References

- **API Client:** `client/lib/api-client.ts`
- **Mock API:** `client/lib/mock-api.ts`
- **Environment Setup:** `.env.example`
- **API Types:** `shared/api.ts`
