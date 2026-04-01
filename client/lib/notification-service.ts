import { isLoggedIn } from "./auth-api";
import { getDailyTasks } from "./daily-tasks";
import { wasSubmittedToday } from "./mock-test-submission";

/**
 * Check if user has pending mock tests (cached but not submitted today)
 */
export function hasPendingMockTest(): boolean {
  if (!isLoggedIn()) return false;

  try {
    const keys = Object.keys(localStorage);
    const hasMockCache = keys.some((key) => key.startsWith("mock_paper_cache_"));
    
    if (!hasMockCache) return false;

    // Check if test was submitted today
    const examTypes = ["Police", "WBCS", "SSC"];
    for (const examType of examTypes) {
      if (!wasSubmittedToday(examType)) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Get count of incomplete daily tasks
 */
export function getIncompleteTaskCount(): number {
  if (!isLoggedIn()) return 0;

  try {
    const state = getDailyTasks();
    if (!state) return 0;
    return state.tasks.filter((task) => !task.completed).length;
  } catch {
    return 0;
  }
}

/**
 * Send push notification (requires Firebase or browser Notification API)
 */
export async function sendPushNotification(
  title: string,
  options?: NotificationOptions
): Promise<void> {
  try {
    // Check browser notification support
    if (!("Notification" in window)) {
      console.log("Browser notifications not supported");
      return;
    }

    // Check permission
    if (Notification.permission === "denied") {
      console.log("Notification permission denied");
      return;
    }

    // Request permission if not granted
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;
    }

    // Send notification
    new Notification(title, {
      icon: "/favicon.svg",
      badge: "/favicon.svg",
      ...options,
    });
  } catch (error) {
    console.error("Push notification error:", error);
  }
}

/**
 * Check if current time is 4:00 PM or later (for daily 4pm notification)
 */
export function isNotificationTime(): boolean {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // Between 4:00 PM and 4:59 PM
  return hours === 16;
}

/**
 * Store that notification was sent today (to avoid duplicates)
 */
export function markNotificationSent(key: string): void {
  const today = new Date().toISOString().split("T")[0];
  localStorage.setItem(`notification_sent_${key}_${today}`, "true");
}

/**
 * Check if notification was already sent today
 */
export function wasNotificationSentToday(key: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  return localStorage.getItem(`notification_sent_${key}_${today}`) === "true";
}

/**
 * Main notification check function (call periodically or on page load)
 */
export async function checkAndSendNotifications(onToast?: (msg: string) => void): Promise<void> {
  if (!isLoggedIn()) return;

  // Check mock test notification
  if (hasPendingMockTest() && isNotificationTime() && !wasNotificationSentToday("mock_test_4pm")) {
    const title = "📝 Mock Test Available!";
    const message = "A new mock test paper is ready. Take the test now!";

    await sendPushNotification(title, {
      body: message,
      tag: "mock_test_notification",
    });

    if (onToast) {
      onToast(message);
    }

    markNotificationSent("mock_test_4pm");
  }

  // Check daily task notification
  const incompleteCount = getIncompleteTaskCount();
  if (incompleteCount > 0 && !wasNotificationSentToday("daily_tasks")) {
    const title = `⚡ ${incompleteCount} Daily Task${incompleteCount > 1 ? "s" : ""} Pending`;
    const message = `Complete your daily tasks to earn points!`;

    await sendPushNotification(title, {
      body: message,
      tag: "daily_tasks_notification",
    });

    if (onToast) {
      onToast(message);
    }

    markNotificationSent("daily_tasks");
  }
}
