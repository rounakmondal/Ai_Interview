import React from "react";

/**
 * RouteLoader — Fallback UI while route chunks are loading
 * Shows spinner + progress bar for better perceived performance
 */
export const RouteLoader: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Spinner */}
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-muted animate-pulse" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin" />
        </div>
        
        {/* Loading text */}
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-foreground">Loading page...</p>
          <p className="text-xs text-muted-foreground">Please wait</p>
        </div>

        {/* Minimal progress bar */}
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full animate-pulse"
            style={{
              width: "70%",
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
            }}
          />
        </div>
      </div>
    </div>
  );
};
