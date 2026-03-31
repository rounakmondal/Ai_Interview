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

    let listener: { remove: () => Promise<void> | void } | null = null;
    let cancelled = false;

    (async () => {
      try {
        const l = await App.addListener("backButton", handleBackButton);
        if (cancelled) {
          l.remove();
          return;
        }
        listener = l;
      } catch {
        return;
      }
    })();

    return () => {
      cancelled = true;
      listener?.remove();
    };
  }, [navigate, location.pathname]);
}
