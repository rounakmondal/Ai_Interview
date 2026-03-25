# Notification System Implementation Guide

## Overview
A comprehensive notification system has been added to show:
1. **Red badge with count** on the "Daily Tasks" menu for incomplete tasks
2. **Orange dot badge** on the "Daily Tasks" menu for pending mock tests  
3. **In-app toast notifications** at 4:00 PM for reminders
4. **Push notifications** (browser notification API) when app is open

## Files Created

### 1. Notification Service ([notification-service.ts](client/lib/notification-service.ts))
Core service that checks:
- `hasPendingMockTest()` - Checks if user has a mock test in cache but hasn't submitted today
- `getIncompleteTaskCount()` - Counts incomplete daily tasks
- `sendPushNotification()` - Sends browser push notifications
- `isNotificationTime()` - Checks if current time is 4pm
- `checkAndSendNotifications()` - Main function that runs the checks

### 2. Notification Hook ([use-notification-check.ts](client/hooks/use-notification-check.ts))
React hook that:
- Runs `checkAndSendNotifications()` on component mount
- Repeats every 5 minutes for continuous checking
- Automatically triggers toasts when conditions are met

### 3. Mock Test Submission Tracker ([mock-test-submission.ts](client/lib/mock-test-submission.ts))
Utility functions to track mock test submissions:
- `recordMockTestSubmission()` - **You need to call this after submitting a test**
- `getMockTestSubmissions()` - Get all submissions
- `wasSubmittedToday()` - Check if test was submitted today
- `getLatestSubmission()` - Get last submission for exam type

### 4. Updated Components
- **[PremiumNavbar.tsx](client/components/premium/PremiumNavbar.tsx)** - Added red badge displays
- **[App.tsx](client/App.tsx)** - Integrated notification hook into app startup

## How It Works

### Daily Task Notifications
When user has incomplete daily tasks, a **red badge showing the count** appears on the "Daily Tasks" menu:
```
Daily Tasks (3)  ← Shows 3 incomplete tasks
```

### Mock Test Notifications
When a user has:
1. A mock test cached in localStorage
2. BUT hasn't submitted a test today
3. AND current time is 4:00 PM

Then:
- An **orange dot** appears on the "Daily Tasks" menu
- A **push notification** is sent: "📝 Mock Test Available!"
- An **in-app toast** confirms the notification

Notifications only send once per day to avoid spam.

## ⚠️ IMPORTANT: Integration Required

### Where to Call `recordMockTestSubmission()`

You need to find where users submit/complete a mock test and add this call:

```typescript
import { recordMockTestSubmission } from "@/lib/mock-test-submission";

// After user completes and submits a mock test:
recordMockTestSubmission(
  examType,  // e.g., "Police", "WBCS", "SSC"
  score,     // e.g., 75 (numeric score or percentage)
  totalQuestions  // e.g., 100
);
```

**Likely locations to add this:**
1. [MockTestPage.tsx](client/pages/MockTestPage.tsx) - After test submission
2. [PDFMockTest.tsx](client/pages/PDFMockTest.tsx) - After PDF test completion
3. [Evaluation.tsx](client/pages/Evaluation.tsx) - After evaluation is finalized
4. Any place that saves test results

### Example Implementation:
```typescript
const handleSubmitTest = async (results: any) => {
  // ... existing submission logic ...
  
  // Record the submission for notification system
  recordMockTestSubmission(
    currentExam.type,
    Math.round((results.correctAnswers / results.totalQuestions) * 100),
    results.totalQuestions
  );
  
  // ... rest of the logic ...
};
```

## Features

### ✅ What's Configured
- Notifications check every 5 minutes
- 4:00 PM (16:00) notification trigger time
- Desktop push notifications (requires user permission)
- Toast notifications (in-app, always visible)
- One notification per category per day
- Auto-cleanup of old submissions (30+ days)

### 🔧 To Customize Timing
Edit [notification-service.ts](client/lib/notification-service.ts):
```typescript
// Change from 4pm to 2pm:
export function isNotificationTime(): boolean {
  const now = new Date();
  const hours = now.getHours();
  return hours === 14; // 2:00 PM is hour 14 (0-23)
}

// Change check interval in use-notification-check.ts:
const interval = setInterval(checkNotifications, 10 * 60 * 1000); // 10 minutes instead of 5
```

### 🔔 To Ask for Notification Permission
The system automatically asks for permission when needed. Users can also manually enable it in browser settings.

## Testing

1. Open DevTools Console
2. Set localStorage to simulate state:
```javascript
// Simulate pending mock test
localStorage.setItem("mock_paper_cache_Police", JSON.stringify({...}));

// Simulate unseen task
// (automatically handled by daily-tasks system)

// Set time to 4pm manually (in notification-service.ts during development)
```

3. Check the navbar for badges appearing

## Known Limitations
- Push notifications require browser permission
- Notifications only check when app is open (unless push service is configured)
- Daily reset happens at midnight
- Multiple exam types detected generically (Police, WBCS, SSC)

---

**Next Step:** Find where mock tests are submitted in your pages and add the `recordMockTestSubmission()` call!
