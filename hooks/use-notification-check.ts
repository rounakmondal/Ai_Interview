import { useEffect } from "react";
import { useToast } from "./use-toast";
import { checkAndSendNotifications } from "@/lib/notification-service";

/**
 * Hook to check and trigger notifications periodically
 * Runs every 5 minutes to check for 4pm mock test and daily task notifications
 */
export function useNotificationCheck() {
  const { toast } = useToast();

  useEffect(() => {
    // Initial check on mount
    checkAndSendNotifications((message) => {
      toast({
        title: "📢 Notification",
        description: message,
      });
    });

    // Set up interval to check every 5 minutes
    const interval = setInterval(() => {
      checkAndSendNotifications((message) => {
        toast({
          title: "📢 Notification",
          description: message,
        });
      });
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [toast]);
}
