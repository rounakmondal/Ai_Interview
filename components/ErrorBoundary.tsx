import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: { componentStack: string } | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error("ErrorBoundary caught an error:", error);
    console.error("Error info:", errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-6 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-lg bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Something went wrong</h1>
              <p className="text-muted-foreground">
                An unexpected error has occurred. Please try again.
              </p>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="bg-muted/50 border border-border/40 rounded-lg p-4 text-left space-y-2 overflow-auto max-h-40">
                <p className="text-xs font-mono text-red-600 dark:text-red-400 break-words">
                  {this.state.error.message}
                </p>
                {this.state.errorInfo && (
                  <details className="text-xs text-muted-foreground">
                    <summary className="cursor-pointer font-semibold">
                      Component Stack
                    </summary>
                    <pre className="mt-2 text-xs overflow-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <Button
              onClick={this.handleReset}
              className="w-full gradient-primary text-base font-semibold"
            >
              Return to Home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
