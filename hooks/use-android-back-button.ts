import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { App } from "@capacitor/app";

/**
 * Hook to handle Android hardware back button
 * Navigates to previous screen instead of exiting the app
 */
export function useAndroidBackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // List of routes where back button should exit the app
    const exitRoutes = ["/", "/landing"];
    
    const handleBackButton = async () => {
      const shouldExit = exitRoutes.includes(location.pathname);

      if (shouldExit) {
        // Allow the app to exit on home page
        App.exitApp();
      } else {
        // Navigate to previous screen on other pages
        navigate(-1);
      }
    };

    try {
      // Register back button handler
      const unsubscribe = App.addListener("backButton", handleBackButton);

      return () => {
        // Cleanup listener
        unsubscribe.remove();
      };
    } catch (error) {
      // Silently fail if not on Capacitor (web browser)
      console.debug("Android back button handler not available on this platform");
    }
  }, [navigate, location.pathname]);
}
